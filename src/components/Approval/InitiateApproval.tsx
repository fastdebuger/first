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
  recordId?: string | number;
  recordFormNo?: string | number;
  recordMainId?: string | number;
  /** 当前选中的数据 */
  selectedRecord: any
  /** 发起审批的接口 */
  type: string
  /** 是否允许发起审批 */
  allowedApproval?: boolean
  /** 发起审批校验的方法  如果需要这个字段需要将allowedApproval设置为true*/
  checkApprovalEligibility?:any
  /** 自定义参数映射配置 */
  payloadMapping?: {
    id?: string; // 对应 recordId 的字段名，默认 'id'
    projectId?: string; // 对应 project_id 的字段名，默认 'project_id'
    formNo?: string; // 对应 recordFormNo 的字段名
  };
  userInfoByPlayload?: {
    obs_code?: string,
    depCode?: string,
    dep_code?: string,
    wbsCode?: string,
    wbs_code?: string,
    prop_key?: string,
  },
  fetchUserType?: string,
  style?: React.CSSProperties;
  additionalParameters?: any
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
  recordFormNo,
  recordMainId,
  allowedApproval = true,
  checkApprovalEligibility=undefined,
  payloadMapping = {
    id: 'id',
    projectId: 'project_id',
    formNo: 'form_no',
  },
  userInfoByPlayload={},
  fetchUserType = 'user/queryUserInfoInclude',
  style = {},
  additionalParameters = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  // if(typeof allowedApproval === 'undefined'){
  //   allowedApproval
  // }

  /**
   * 确认选择：发起审批并显示loading状态。
   */
  const handleOk = async () => {
    if (!selectedUserId) return;

    // 开始loading
    setLoading(true);

    const payload: any = {
      funcCode: funcode,
      func_code: funcode,
      user_id: selectedUserId,
      ...additionalParameters
    }

    if (recordId) {
      Object.assign(payload, {
        id: recordId,
      })
    }
    if (recordFormNo) {
      Object.assign(payload, {
        form_no: recordFormNo,
      })
    }
    if (recordMainId) {
      Object.assign(payload, {
        main_id: recordMainId,
      })
    }
    // 动态添加字段
    if (recordId && payloadMapping.projectId) {
      payload[payloadMapping.projectId] = recordId;
    }
    dispatch({
      type: type,
      payload,
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
      <Button type="primary" onClick={() => {
        console.log(selectedRecord,"selectedRecordselectedRecord");
        if (selectedRecord.approval_schedule1) {
          message.warning('当前数据以发起审批无需重新发起')
          return
        }
        if (selectedRecord.approval_schedule) {
          message.warning('当前数据以发起审批无需重新发起')
          return
        }
        if(!allowedApproval){
          message.warning('当前数据以发起审批无需重新发起')
          return
        }
        // 自定义检查通过 如果是函数需要单独处理
        if (typeof checkApprovalEligibility === "function") {
          if (checkApprovalEligibility()) {
            setIsModalOpen(true)
            return
          }
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
                  fetchType={fetchUserType}
                  payload={{
                    ...userInfoByPlayload,
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


