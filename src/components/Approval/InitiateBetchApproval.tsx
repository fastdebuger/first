import React, { useState, useCallback } from 'react';
import { Button, Modal, Form, message, Spin } from 'antd';
import type { ButtonProps } from 'antd';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';
import { ErrorCode } from '@/common/const';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";


interface PayloadFieldMapping {
  /** 循环提交时，单条记录 ID 发给后端的 Key 名 (默认 'id') */
  idField: string;
  /** 其他需要合并到每个请求中的固定参数，例如 { type: 'emergency' } */
  extraParams?: Record<string, any>;
}

interface BaseProps {
  buttonText?: string;      // 触发按钮文字
  modalTitle?: string;      // 弹窗标题
  disabled?: boolean;       // 按钮禁用状态
  buttonProps?: ButtonProps;
  dispatch: any;
  /** 审批模板号，后端业务标识 */
  funcode: string;
  /** 发起审批的接口路径  */
  type: string;
  /** 成功发起后的回调 */
  onSuccess: () => void;
  /** 字段配置映射对象 */
  fieldMapping: PayloadFieldMapping;
  /** 选人下拉框需要的参数*/
  userContext?: Record<string, any>;
  /** 获取用户列表的接口路径 */
  fetchUserApi?: string;
  tableType: string;
  tableTitle?: string;
  tableColumns: () => object[];
  tableSortOrder: {
    sort: string,
    order: string
  };
  tableDefaultFilter: {
    Key: string, Val: string, Operator: string
  }[]
}



/** * 使用联合类型：
 * 强制要求：要么传 isApprovalAllowed，要么传 onPreCheck，或者都传。
 */
type InitiateApprovalProps = BaseProps & (
  /** 是否允许发起审批的业务开关 */
  | { isApprovalAllowed: boolean; onPreCheck?: () => boolean }
  /** 外部自定义校验函数：点击按钮时执行，返回 false 则不打开弹窗 */
  | { onPreCheck: () => boolean; isApprovalAllowed?: boolean }
);

/**
 * 批量审批组件
 * @param param0 
 * @returns 
 */
const InitiateApproval: React.FC<InitiateApprovalProps> = ({
  buttonText = '批量发起审批',
  modalTitle = '批量发起审批',
  disabled = false,
  buttonProps,
  dispatch,
  funcode,
  type,
  onSuccess,
  isApprovalAllowed = true,
  onPreCheck,
  fieldMapping = { idField: 'id' },
  userContext = {},
  fetchUserApi = 'user/queryUserInfoInclude',
  tableTitle = "待发起审批详情",
  tableType,
  tableColumns,
  tableSortOrder,
  tableDefaultFilter
}) => {
  // --- 状态管理 ---
  const [visible, setVisible] = useState(false);        // 控制弹窗显示
  const [selectedUserCode, setSelectedUserCode] = useState<string>(); // 存储选中的审批人 ID
  const [submitting, setSubmitting] = useState(false);  // 全局提交 Loading 状态
  const [recordIds, setRecordIds] = useState<(string | number)[]>([]); // 存储拦截到的待处理 ID 列表

  /**
   * 当子组件请求完数据并调用 handleResponse 时，
   * 本组件会拦截响应，从中提取所有的业务 ID 存入 state。
   */
  const handleResponse = useCallback((res: any) => {
    if (res?.errCode === ErrorCode.ErrOk && Array.isArray(res.rows)) {
      // 提取 rows 数组中每一项的 id 字段
      const ids = res.rows.map((row: any) => row.id);
      setRecordIds(ids);
    }
  }, []);

  /**
   * 重置组件内部状态
   */
  const resetStatus = useCallback(() => {
    setVisible(false);
    setSelectedUserCode(undefined);
    setSubmitting(false);
    setRecordIds([]);
  }, []);

  /**
   * 触发逻辑：先校验，再开窗
   */
  const handleTriggerClick = () => {
    // 1. 检查基础状态开关
    if (!isApprovalAllowed) return message.warning('当前数据已发起审批，无需重复操作');
    // 2. 检查外部传入的自定义校验（如：判断是否选择了数据）
    if (onPreCheck && !onPreCheck()) return;
    setVisible(true);
  };

  /** 
   * 批量循环提交
   */
  const handleSubmit = async () => {
    // 校验：必须选择审批人且必须有待处理的数据
    if (!selectedUserCode) return message.error('请选择下一步处理人');
    if (recordIds.length === 0) return message.error('未获取到待处理数据，请刷新后重试');

    setSubmitting(true);
    let successCount = 0;
    const totalCount = recordIds.length;

    const runDispatch = (singleId: string | number) => {
      return new Promise((resolve) => {
        const payload = {
          funcCode: funcode,
          func_code: funcode,
          user_id: selectedUserCode,
          // 动态设置 Key 名，例如后端要 batch_id，这里就会变成 { batch_id: singleId }
          [fieldMapping.idField || 'id']: singleId,
          ...fieldMapping.extraParams,
        };

        dispatch({
          type,
          payload,
          callback: (res: { errCode: number; errMsg?: string }) => {
            if (res.errCode === ErrorCode.ErrOk) successCount++;
            resolve(res);
          },
        });
      });
    };

    // 准备同时发出所有请求
    const promises = recordIds.map(id => runDispatch(id));

    // 等待全部执行结束
    await Promise.all(promises);

    setSubmitting(false);

    if (successCount === totalCount) {
      message.success(`成功发起 ${successCount} 项审批`);
      resetStatus();
      onSuccess();
    } else if (successCount > 0) {
      message.warning(`部分发起成功：${successCount} 条成功, ${totalCount - successCount} 条失败`);
      resetStatus();
      onSuccess();
    } else {
      message.error('审批发起失败，请检查数据或网络');
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleTriggerClick}
        disabled={disabled}
        {...buttonProps}
      >
        {buttonText}
      </Button>

      <Modal
        title={modalTitle}
        open={visible}
        onOk={handleSubmit}
        onCancel={resetStatus}
        confirmLoading={submitting}
        destroyOnClose
        okButtonProps={{ disabled: submitting }}
        width="100vw"
        centered
        style={{ top: 0 }}
        bodyStyle={{ height: 'calc(100vh - 130px)', overflowY: 'auto', padding: '24px' }}
      >
        <Spin spinning={submitting} tip={`正在处理批量请求 (${recordIds.length}条)...`}>
          <Form layout="vertical">
            <Form.Item label="审批处理人" required tooltip="请选择该业务流程的下一步处理人">
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp="user_name"
                fetchType={fetchUserApi}
                payload={{ ...userContext, sort: 'user_code', order: 'desc' }}
                value={selectedUserCode}
                onChange={setSelectedUserCode}
                placeholder="请搜索并选择下一步处理人"
                disabled={submitting}
                style={{ width: 500 }}
              />
            </Form.Item>
          </Form>

          <div style={{ marginTop: 16 }}>
            <BaseCurdSingleTable
              rowKey="RowNumber"
              tableTitle={tableTitle}
              funcCode={tableType}
              type={tableType}
              importType={tableType}
              tableColumns={tableColumns()}
              tableSortOrder={tableSortOrder}
              buttonToolbar={undefined}
              rowSelection={null}
              tableDefaultFilter={tableDefaultFilter}
              handleResponse={handleResponse}
            />
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default React.memo(InitiateApproval);