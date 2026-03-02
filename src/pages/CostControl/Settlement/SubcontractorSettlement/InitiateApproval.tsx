import React, { useState } from 'react';
import { Button, Modal, Form, message, Spin } from 'antd';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';
import { ErrorCode } from '@/common/const'


type InitiateApprovalProps = {
  /** 按钮文案，默认"发起审批"。 */
  buttonText?: string;
  /** 弹窗标题，默认"发起审批"。 */
  modalTitle?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** dispatch 用于 CommonPaginationSelect */
  dispatch?: any;
  /** 审批模板号 */
  funcode: string;
  /** 成功之后回调的函数 */
  onSuccess: () => void;
  /** 选中的记录ID（如果需要） */
  recordId: string | number;
  /** 当前选中的数据 */
  selectedRecord: any
  /** 发起审批的接口 */
  type: string
  style?: React.CSSProperties;
};

/**
 * 发起审批组件：提供一个按钮，点击后打开选择审批人的弹窗。
 */
const InitiateApproval: React.FC<InitiateApprovalProps> = ({
  buttonText = '发起审批',
  modalTitle = '发起审批',
  disabled,
  buttonProps,
  dispatch,
  funcode,
  onSuccess,
  recordId,
  selectedRecord,
  type,
  style = {}
}) => {
  console.log(style, 'style');
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 确认选择：发起审批并显示loading状态。
   */
  const handleOk = async () => {
    if (!selectedUserId) return;

    // 开始loading
    setLoading(true);

    dispatch({
      type: type,
      payload: {
        funcCode: funcode,
        func_code: funcode,
        id: recordId,
        user_id: selectedUserId
      },
      callback: (res: any) => {
        // 结束loading
        setLoading(false);
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('审批发起成功');
          setSelectedUserId(undefined);
          setIsModalOpen(false);
          onSuccess()
        } else {
          message.error(res.errMsg || '审批发起失败');
        }
      },
    });
  };


  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          if (selectedRecord.approval_schedule1) {
            message.warning('当前数据以发起审批无需重新发起')
            return
          }
          setIsModalOpen(true)
          
        }} disabled={disabled} {...buttonProps} style={style}>
        {buttonText}
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUserId(undefined);
          setLoading(false);
        }}
        okButtonProps={{
          disabled: !selectedUserId || loading
        }}
      >
        <Spin spinning={loading} tip="发起中...">
          <Form layout="vertical">
            {dispatch && (
              <Form.Item label="选择审批人">
                <CommonPaginationSelect
                  dispatch={dispatch}
                  fieldNames={{ label: 'user_name', value: 'user_code' }}
                  optionFilterProp={'user_name'}
                  fetchType='user/queryUserInfoInclude'
                  payload={{
                    sort: 'user_code',
                    order: 'desc',
                  }}
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  placeholder="请选择审批人"
                  disabled={loading}
                />
              </Form.Item>
            )}
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default InitiateApproval;


