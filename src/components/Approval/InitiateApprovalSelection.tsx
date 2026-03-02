import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, message } from 'antd';
import { queryApprovalBusinessProcessTemplate } from '@/services/backConfig/flow';


type InitiateApprovalProps = {
  /** 按钮文案，默认"发起审批"。 */
  buttonText?: string;
  /** 弹窗标题，默认"发起审批"。 */
  modalTitle?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 审批模板号 */
  funcode: string;
  /** 成功之后回调的函数 */
  onSuccess: () => void;
  /** 选中的记录ID */
  recordId: string | number;
  /** 当前选中的数据（用于检查是否已发起审批） */
  selectedRecord?: any;
  /** 是否允许发起审批 */
  allowedApproval?: boolean;
  /** 审批URL，如果不提供则使用默认地址 */
  approvalUrl?: string;
};

/**
 * 发起审批组件：提供一个按钮，点击后打开审批流程的iframe弹窗。
 */
const InitiateApproval: React.FC<InitiateApprovalProps> = ({
  buttonText = '发起审批',
  modalTitle = '发起审批',
  disabled,
  buttonProps,
  funcode,
  onSuccess,
  recordId,
  selectedRecord,
  allowedApproval = true,
  approvalUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [urlParams, setUrlParams] = useState<Record<string, any>>({});

  // 构建审批URL
  const getApprovalUrl = (params?: Record<string, any>) => {
    let baseUrl = '';

    if (approvalUrl) {
      baseUrl = approvalUrl;
    } else {
      // 默认URL
      if (process.env.NODE_ENV === 'production') {
        baseUrl = `${window.location.origin}/micro/comp/base/backconfig/flow/approve/flow/startProcessCpecc`;
      } else {
        baseUrl = `${window.location.protocol}//${window.location.hostname}:3232/micro/comp/base/backconfig/flow/approve/flow/startProcessCpecc`;
      }
    }

    // 拼接参数
    const finalParams = params;
    if (finalParams && typeof finalParams === 'object') {
      // 将对象转换为查询字符串
      const queryString = Object.keys(finalParams)
        .filter(key => finalParams[key] !== null && finalParams[key] !== undefined && finalParams[key] !== '')
        .map(key => {
          const value = finalParams[key];
          // 对键和值进行编码
          return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join('&');

      if (queryString) {
        // 如果 baseUrl 已经包含查询参数，用 & 连接；否则用 ? 连接
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${queryString}`;
      }
    }

    return baseUrl;
  };

  // 监听子页面的消息
  useEffect(() => {
    if (!isModalOpen) return;

    // 获取审批模板数据
    queryApprovalBusinessProcessTemplate({
      page: 1,
      limit: 9999,
      sort: 'funcCode',
      order: 'asc',
      propKey: 'branchComp',
      wbsCode: '',
      wbs_code: '',
    }).then((res: any) => {
      if (res && res.data && res.data.rows) {
        const template = res.data.rows.find((item: any) => item.funcCode === funcode);
        if (template) {
          // 构建要发送的数据
          const messageData: any = {
            id: recordId,
            func_code: funcode,
            defineId: template.id,
          };
          setUrlParams(messageData);
        }
      }
    });
  }, [isModalOpen, recordId, funcode]);

  // 监听子页面通过postMessage发送的消息
  useEffect(() => {
    if (!isModalOpen) return;

    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源（可选，根据实际需求调整）
      // if (event.origin !== window.location.origin) return;

      // 监听子页面发送的成功消息
      if (event.data && event.data.type === 'APPROVAL_SUCCESS') {
        message.success('审批发起成功');
        setIsModalOpen(false);
        onSuccess();
      }

      if (event.data && event.data.type === 'APPROVAL_CLOSE') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isModalOpen, onSuccess]);


  return (
    <>
      <Button type="primary" onClick={() => {
        if (selectedRecord?.approval_schedule1) {
          message.warning('当前数据已发起审批无需重新发起');
          return;
        }
        if (selectedRecord?.approval_schedule) {
          message.warning('当前数据已发起审批无需重新发起');
          return;
        }
        if (!allowedApproval) {
          message.warning('当前数据已发起审批无需重新发起');
          return;
        }
        setIsModalOpen(true);
      }} disabled={disabled} {...buttonProps}>
        {buttonText}
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, height: `${window.innerHeight - 114}px` }}
      >
        {urlParams && (<iframe
          ref={iframeRef}
          key={Date.now()}
          src={getApprovalUrl(urlParams)}
          id="register-process-iframe"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />)}
      </Modal>
    </>
  );
};

export default InitiateApproval;


