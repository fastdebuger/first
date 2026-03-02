import React, { useState } from 'react';
import { Button, Modal, Radio, Space, Form, message, Spin } from 'antd';
import { numberToChinese } from '@/utils/utils';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';
import { APPROVAL_STATUS, ErrorCode } from '@/common/const'


type InitiateApprovalProps = {
  /** 按钮文案，默认"发起审批"。 */
  buttonText?: string;
  /** 弹窗标题，默认"选择进度款"。 */
  modalTitle?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 选中的记录，包含id1、id2、id{x}等字段。 */
  selectedRecord?: any;
  /** dispatch 用于 CommonPaginationSelect */
  dispatch?: any;
  /** 审批模板号 */
  funcode: string;
  /** 成功之后回调的函数 */
  onSuccess: () => void;
  style?: React.CSSProperties;
};

/**
 * 发起审批组件：提供一个按钮，点击后打开选择进度款的弹窗，
 * 支持选择多个进度款中的任意一个进行审批。
 */
const InitiateApproval: React.FC<InitiateApprovalProps> = ({
  selectedRecord,
  buttonText = '发起审批',
  modalTitle = '选择需要审批的进度款',
  disabled,
  buttonProps,
  dispatch,
  funcode,
  onSuccess,
  style = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProgressId, setSelectedProgressId] = useState<string | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 从selectedRecord中提取进度款ID，过滤掉空字符串（后台已改为空字符串替代null）和已审批完成的进度款
   * @returns 进度款ID数组
   */
  const getProgressOptions = () => {
    if (!selectedRecord) return [];

    const options: Array<{ label: string; value: string; number: number }> = [];

    // 遍历selectedRecord的所有属性，查找id1、id2、id{x}格式的字段
    Object.keys(selectedRecord).forEach(key => {
      if (key.startsWith('id') && selectedRecord[key] !== '' && selectedRecord[key] !== undefined) {
        const number = parseInt(key.replace('id', ''));
        if (!isNaN(number)) {
          // 检查对应的approval_schedule{x}字段，如果值为2则跳过（已审批完成）
          const approvalScheduleKey = `approval_schedule${number}`;
          const approvalScheduleValue = selectedRecord[approvalScheduleKey];
          // 只有当approval_schedule{x}等于-1时才显示该进度款的radio单选框
          // 兼容字符串和数字两种情况
          const scheduleValue = Number(approvalScheduleValue);
          if (scheduleValue === APPROVAL_STATUS.UNAPPROVED) {
            options.push({
              label: `第${numberToChinese(number)}笔进度款`,
              value: selectedRecord[key],
              number: number
            });
          }
        }
      }
    });

    // 按数字顺序排序
    return options.sort((a, b) => a.number - b.number);
  };
  /**
   * 确认选择：发起审批并显示loading状态。
   */
  const handleOk = async () => {
    // if (!selectedProgressId || !selectedUserId) return;

    // 打印当前选中的进度款ID和用户ID
    console.log('当前选中的进度款ID:', selectedProgressId);
    console.log('当前选中的用户ID:', selectedUserId);

    // 开始loading
    setLoading(true);

    dispatch({
      type: 'user/startApproval',
      payload: {
        funcCode: funcode,
        func_code: funcode,
        id: selectedProgressId,
        user_id: selectedUserId
      },
      callback: (res: any) => {
        // 结束loading
        setLoading(false);

        if (res.errCode === ErrorCode.ErrOk) {
          message.success('审批发起成功');
          setSelectedProgressId(undefined);
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
      <Button type="primary" onClick={() => setIsModalOpen(true)} disabled={disabled} {...buttonProps} style={style}>
        {buttonText}
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedProgressId(undefined);
          setSelectedUserId(undefined);
          setLoading(false);
        }}
        okButtonProps={{
          disabled: !selectedProgressId  || loading
        }}
        // || !selectedUserId
      >
        <Spin spinning={loading} tip="发起中...">
          <Form layout="vertical">
            <Form.Item label="选择进度款">
              <Radio.Group
                value={selectedProgressId}
                onChange={(e) => setSelectedProgressId(e.target.value)}
                disabled={loading}
              >
                <Space direction="horizontal" wrap>
                  {getProgressOptions().map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              {getProgressOptions().length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  暂无可发起审批的进度款
                </div>
              )}
            </Form.Item>

            {/* {selectedProgressId && dispatch && (
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
            )} */}
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default InitiateApproval;


