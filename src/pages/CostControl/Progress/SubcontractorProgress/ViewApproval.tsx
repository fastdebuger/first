import React, { useState } from 'react';
import { Button, message, Modal, Radio, Space } from 'antd';
import { numberToChinese } from '@/utils/utils';
import ApprovalDrawer from '@/components/ApprovalDrawer';

type ViewApprovalProps = {
  /** 按钮文案，默认"查看审批"。 */
  buttonText?: string;
  /** 弹窗标题，默认"选择需要查看的进度款"。 */
  modalTitle?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 选中的记录，包含approval_process_id1、approval_process_id2、approval_process_id{x}等字段。 */
  selectedRecord?: any;
  onSuccess: () => void
  style?: React.CSSProperties;
};

/**
 * 查看审批组件：提供一个按钮，点击后打开选择进度款的弹窗，
 * 支持选择多个进度款中的任意一个进行查看审批。
 */
const ViewApproval: React.FC<ViewApprovalProps> = ({
  selectedRecord,
  buttonText = '查看审批',
  modalTitle = '选择需要查看的进度款',
  disabled,
  buttonProps,
  onSuccess,
  style = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProgressId, setSelectedProgressId] = useState<string | undefined>(undefined);
  const [isApprovalVisible, setIsApprovalVisible] = useState<boolean>(false);

  /**
   * 从selectedRecord中提取进度款审批ID，过滤掉空字符串（后台已改为空字符串替代null）
   * @returns 进度款审批ID数组
   */
  const getProgressOptions = () => {
    if (!selectedRecord) return [];

    const options: Array<{ label: string; value: string; number: number }> = [];

    // 遍历selectedRecord的所有属性，查找approval_process_id1、approval_process_id2、approval_process_id{x}格式的字段
    Object.keys(selectedRecord).forEach(key => {
      const value = selectedRecord[key];
      if (key.startsWith('approval_process_id') && selectedRecord[key] !== '' && selectedRecord[key] !== undefined) {
        const number = parseInt(key.replace('approval_process_id', ''));
        
        if (!isNaN(number)) {
          options.push({
            label: `第${numberToChinese(number)}笔进度款`,
            value: value,
            number: number
          });
        }
      }
    });

    // 按数字顺序排序
    return options.sort((a, b) => a.number - b.number);
  };

  /**
   * 确认选择：打印选中的进度款审批ID并关闭弹窗。
   */
  const handleOk = async () => {
    if (!selectedProgressId) return;

    // 打印当前选中的进度款审批ID
    console.log('当前选中的进度款审批ID:', selectedProgressId);
    setIsApprovalVisible(true)
    setIsModalOpen(false);
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
        }}
        okButtonProps={{ disabled: !selectedProgressId }}
      >
        <Radio.Group
          value={selectedProgressId}
          onChange={(e) => setSelectedProgressId(e.target.value)}
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
            暂无可查看的进度款
          </div>
        )}
      </Modal>
      {isApprovalVisible && selectedProgressId && (<ApprovalDrawer
        open={isApprovalVisible}
        onClose={() => {
          setIsApprovalVisible(false)
          setSelectedProgressId(undefined);
        }}
        record={{
          funcCode: 'S22',
          instanceId: selectedProgressId || '',
          complete: true,
          refuse: true,
          back: true,
        }}
        operationSuccess={() => {
          setIsApprovalVisible(false)
          setSelectedProgressId(undefined);
          onSuccess();
          message.success('已审批');
        }
        }
      />)}
    </>
  );
};

export default ViewApproval;
