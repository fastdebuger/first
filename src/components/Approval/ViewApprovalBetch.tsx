import React, { useState } from 'react';
import { Button, message } from 'antd';
import ApprovalDrawerBetch from '../ApprovalDrawerBetch';

type ViewApprovalProps = {
  /** 按钮文案，默认"查看审批"。 */
  buttonText?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 审批实例ID（直接打开该审批） */
  instanceIdLabel?: string;
  taskIdLabel?: string;
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
  buttonText = '批量查看审批',
  disabled,
  buttonProps,
  instanceIdLabel="",
  taskIdLabel="",
  funcCode,
  id,
  onSuccess,
  number = '1',
  selectedRecord: selectedRecordArray,
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
    if (!instanceIdLabel) {
      message.warning('缺少审批实例ID');
      return;
    }
    setIsApprovalVisible(true);
  };

  return (
    <>
      <Button type="primary" onClick={openApproval} disabled={disabled || !instanceIdLabel} {...buttonProps} style={style}>
        {buttonText}
      </Button>

      {/* 多条审批 */}
      {isApprovalVisible && instanceIdLabel && (
        <ApprovalDrawerBetch
          open={isApprovalVisible}
          onClose={() => {
            setIsApprovalVisible(false)
          }}
          recordArray={
            selectedRecordArray.map((item: any) => ({
              ...item,
              funcCode: funcCode || '',
              instanceId: item[instanceIdLabel] || '',
              taskId: item[taskIdLabel] || '',
              id: id || '',
              number: number || '1',
              complete: false,
              refuse: false,
              back: false,
              currUserCode: item?.currUserCode || undefined,
              currUserName: item?.currUserName || undefined,
              ts: item?.ts || undefined,
              tz: item?.tz || undefined,
              depCode: item?.depCode || undefined,
            }))
          }
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
