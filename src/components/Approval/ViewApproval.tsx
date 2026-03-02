import React, { useState } from 'react';
import { Button, message } from 'antd';
import ApprovalDrawer from '@/components/ApprovalDrawer';

type ViewApprovalProps = {
  /** 按钮文案，默认"查看审批"。 */
  buttonText?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 审批实例ID（直接打开该审批） */
  instanceId?: string;
  /** 审批模板号 */
  funcCode?: string;
  /**当前业务id */
  id?: string;
  /** 当前审批次数(默认1) */
  number?: string;
  /** 选中的记录 */
  selectedRecord?: any;
  onSuccess: () => void;
  /** 是否显示审批退回 */
  back?: boolean

  currUserCode?: string;
  currUserName?: string;
  ts?: string | number;
  tz?: string | number;
  depCode?: string;
  style?: React.CSSProperties;
  // 当前模块需要给审批流传递的参数
  paramsData?: any;
};

/**
 * 查看审批组件：点击按钮直接打开审批抽屉。
 */
const ViewApproval: React.FC<ViewApprovalProps> = ({
  buttonText = '查看审批',
  disabled,
  buttonProps,
  instanceId,
  funcCode,
  id,
  onSuccess,
  number = '1',
  selectedRecord,
  style = {},
  back = true,
  currUserCode,
  currUserName,
  ts,
  tz,
  depCode,
  paramsData,
}) => {
  const [isApprovalVisible, setIsApprovalVisible] = useState<boolean>(false);

  const openApproval = () => {
    if (!instanceId) {
      message.warning('缺少审批实例ID');
      return;
    }
    if (number === '2' && selectedRecord?.report_amount2 === null) {
      message.warning('请填写点击修改按钮填写预结算费控中心的上报金额再进行审批');
      return;
    }
    setIsApprovalVisible(true);
  };

  return (
    <>
      <Button type="primary" onClick={openApproval} disabled={disabled || !instanceId} {...buttonProps} style={style}>
        {buttonText}
      </Button>
      {isApprovalVisible && instanceId && (
        <ApprovalDrawer
          open={isApprovalVisible}
          onClose={() => {
            setIsApprovalVisible(false)
          }}
          record={{
            funcCode: funcCode || '',
            instanceId: instanceId || '',
            id: id || '',
            number: number || '1',
            complete: true,
            refuse: true,
            back,
            currUserCode: selectedRecord?.currUserCode || undefined,
            currUserName: selectedRecord?.currUserName || undefined,
            ts: selectedRecord?.ts || undefined,
            tz: selectedRecord?.tz || undefined,
            depCode: selectedRecord?.depCode || undefined,
          }}
          operationSuccess={() => {
            setIsApprovalVisible(false)
            onSuccess();
            message.success('已审批');
          }}
          paramsData={paramsData}
        />
      )}
    </>
  );
};

export default ViewApproval;
