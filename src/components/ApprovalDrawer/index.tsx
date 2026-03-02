import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi'
import CrudQueryDetailDrawer from '@/components/CrudQueryDetailDrawer'
import { aimInstanceTask } from '@/services/backConfig/flow'


interface ApprovalDrawerProps {
  open: boolean;
  onClose: () => void;
  record: {
    funcCode: string;
    instanceId: string;
    number?: string;// 部分模块需要字段  定义出来仅仅是怕传错字段
    registerFlowNo?: string; // 部分模块需要字段  定义出来仅仅是怕传错字段
    responseId?: string;// 部分模块需要字段  定义出来仅仅是怕传错字段
    complete?: boolean; // 审批流通过按钮控制
    refuse?: boolean; // 审批流驳回按钮控制
    back?: boolean; // 审批流退回按钮控制
    reboot?: boolean; // 审批流分包商重新发起按钮控制
    [key: string]: any;
  };
  system?: string;
  operationSuccess?: () => void; // 审批流操作完成后父组件回调
  // 当前模块需要给审批流传递的参数
  paramsData?: any;
}

const ApprovalDrawer: React.FC<ApprovalDrawerProps> = (props: ApprovalDrawerProps) => {
  let { open, onClose, record, operationSuccess, system = 'ZyyjIms', paramsData } = props;

  let { formatMessage } = useIntl()
  let [approvalUserData, setApprovalUserData] = useState<any[] | null>(null)
  let [approvalUrl, setApprovalUrl] = useState<string | null>(null)

  let userCode = localStorage.getItem('auth-default-userCode')
  useEffect(() => {
    /**
     * instanceId变化时重新推送新的数据
     */
    aimInstanceTask({
      instanceId: record.instanceId
    }).then((res) => {
      if (res.data && res.data.rows && res.data.rows.length > 0) {
        setApprovalUserData(res.data.rows)
        console.log(res.data.rows, "res.data.rows");
      } else {
        setApprovalUserData([])
      }
    })
  }, [JSON.stringify(record)]);

  const getApprovalUrl = (params?: Record<string, any>) => {
    let baseUrl = '';

    if (!approvalUserData) {
      return
    }
    let approvalUser = approvalUserData.find((item) => item.assignee === userCode && item.status === 0)
    if (process.env.NODE_ENV === 'production') {
      if (approvalUser) {
        console.log('approvalUser', approvalUser)
        baseUrl = `${window.location.origin}/micro/comp/base/backconfig/flow/approve/flow/todoCpecc`
      } else {
        console.log('approvalUser', approvalUser)
        baseUrl = `${window.location.origin}/micro/comp/base/backconfig/flow/approve/flow/instanceCpecc`

      }
    } else {
      if (approvalUser) {
        baseUrl = `${window.location.protocol}//${window.location.hostname}:3232/micro/comp/base/backconfig/flow/approve/flow/todoCpecc`
        // setApprovalUrl(`https://dev.yayangsoft.com:60632/micro/comp/base/backconfig/flow/approve/flow/todoCpecc`
      } else {
        baseUrl = `${window.location.protocol}//${window.location.hostname}:3232/micro/comp/base/backconfig/flow/approve/flow/instanceCpecc`
        // setApprovalUrl(`https://dev.yayangsoft.com:60632/micro/comp/base/backconfig/flow/approve/flow/instanceCpecc`)
      }
    }

    if (paramsData) {
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
    }


    return baseUrl;
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<any>) => {
      /**
       * 页面加载成功onMounted时发送消息 每个页面创建只执行一次
       */
      if (event.data.source === 'yayangflow') {
        const iframe: HTMLIFrameElement | null = document.getElementById('register-process-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          let approvalUser = null
          if (approvalUserData) {
            approvalUser = approvalUserData.find((item) => item.assignee === userCode && item.status === 0)
          }
          // 发送消息
          iframe.contentWindow.postMessage({
            isHasApproval: !!approvalUser,
            taskId: approvalUser ? approvalUser.id : '',
            system,
            ...record,
            job: approvalUser?.name || '',
            currWbsCode: localStorage.getItem('auth-default-currWbsCode'),
            source: 'yayang',
          }, '*');
        }
        /*
        这里return代表第一次初始化已经发送消息了 不需要再往下执行重复发送消息
         */
        return
      }

      if (event.data.source === 'yayangFlowLoadSuccess') {
        const iframe: HTMLIFrameElement | null = document.getElementById('register-process-iframe') as HTMLIFrameElement;
        /**
         * 审批流系统初始化加载传递请求需要的参数
         */
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            data: [
              { key: 'auth-default-wbsCode', value: localStorage.getItem('auth-default-wbsCode') },
              { key: 'x-auth-token', value: localStorage.getItem('x-auth-token') || '' },
              { key: 'auth-default-userCode', value: localStorage.getItem('auth-default-userCode') },
              { key: 'auth-default-userName', value: localStorage.getItem('auth-default-userName') },
            ],
            source: 'yayangPutData'
          }, '*');
        }
      }
      if (event.data.source === 'yayangflowOperation') {
        if (operationSuccess) {
          setTimeout(() => {
            operationSuccess()
          }, 2000)
        }
      }

    }

    const iframe: HTMLIFrameElement | null = document.getElementById('register-process-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      let approvalUser = null
      if (approvalUserData) {
        approvalUser = approvalUserData.find((item) => item.assignee === userCode)
      }
      /**
       * record变化时重新推送新的数据
       */
      iframe.contentWindow.postMessage({
        isHasApproval: !!approvalUser,
        taskId: approvalUser ? approvalUser.id : '',
        system,
        ...record,
        job: approvalUser?.name || '',
        currWbsCode: localStorage.getItem('auth-default-currWbsCode'),
        source: 'yayang',
      }, '*');
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage); // 清理监听器
    };

  }, [approvalUserData])


  return (
    <CrudQueryDetailDrawer
      rowKey="component_name"
      title={`${formatMessage({ id: 'approval' })}${formatMessage({ id: 'detail' })}`}
      columns={[]}
      open={open}
      onClose={onClose}
      selectedRecord={{}}
      buttonToolbar={() => []}
    >
      {<iframe
        id={'register-process-iframe'}
        width={'100%'}
        height={`${(window.innerHeight - 114)}px`}
        src={getApprovalUrl(paramsData)}
        onLoad={() => {
        }}
      />}
    </CrudQueryDetailDrawer>
  )
}

export default ApprovalDrawer
