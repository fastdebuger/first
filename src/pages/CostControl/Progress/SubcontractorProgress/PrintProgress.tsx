import React, { useState } from 'react';
import { Button, Modal, Radio, Space } from 'antd';
import { numberToChinese, getPrintUrl } from '@/utils/utils';
import { APPROVAL_STATUS } from '@/common/const';
import IframeComponent from '@/components/IframeComponent';

type PrintProgressProps = {
  /** 按钮文案，默认"打印"。 */
  buttonText?: string;
  /** 弹窗标题，默认"选择需要打印的进度款"。 */
  modalTitle?: string;
  /** 是否禁用按钮。 */
  disabled?: boolean;
  /** 透传按钮属性。 */
  buttonProps?: React.ComponentProps<typeof Button>;
  /** 选中的记录，包含id1、id2、id{x}和approval_schedule1、approval_schedule2、approval_schedule{x}等字段。 */
  selectedRecord?: any;
  style?: React.CSSProperties;
};

/**
 * 打印进度款组件：提供一个按钮，点击后打开选择进度款的弹窗，
 * 只显示审批通过的进度款，支持选择多个进度款中的任意一个进行打印。
 */
const PrintProgress: React.FC<PrintProgressProps> = ({
  selectedRecord,
  buttonText = '打印',
  modalTitle = '选择需要打印的进度款',
  disabled,
  buttonProps,
  style = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProgressNumber, setSelectedProgressNumber] = useState<number | undefined>(undefined);
  const [printUrl, setPrintUrl] = useState<string>('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  /**
   * 从selectedRecord中提取审批通过的进度款
   * 只显示 approval_schedule{x} === 1 (审批通过) 的进度款
   * @returns 进度款选项数组，value存储的是number（索引）
   */
  const getProgressOptions = () => {
    if (!selectedRecord) return [];

    const options: Array<{ label: string; value: number; number: number }> = [];

    // 遍历selectedRecord的所有属性，查找id1、id2、id{x}格式的字段
    Object.keys(selectedRecord).forEach(key => {
      if (key.startsWith('id') && selectedRecord[key] !== '' && selectedRecord[key] !== undefined) {
        const number = parseInt(key.replace('id', ''));
        if (!isNaN(number)) {
          // 检查对应的approval_schedule{x}字段，只有值为1（审批通过）时才显示
          const approvalScheduleKey = `approval_schedule${number}`;
          const approvalScheduleValue = selectedRecord[approvalScheduleKey];
          // 兼容字符串和数字两种情况
          const scheduleValue = Number(approvalScheduleValue);
          if (scheduleValue === APPROVAL_STATUS.APPROVED) {
            options.push({
              label: `第${numberToChinese(number)}笔进度款`,
              value: number, // 存储number（索引）而不是id值
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
   * 确认选择：打开打印预览
   */
  const handleOk = async () => {
    if (!selectedProgressNumber) return;

    // 构建打印URL，传入进度款ID
    const url = getPrintUrl('subcontract', 'YJZHPDYJS-001-2025R03', {
      form_no: selectedRecord?.form_no,
      contract_no: selectedRecord?.contract_no,
      number: selectedProgressNumber, // 传入选中的进度款number
    });

    setPrintUrl(url);
    setIframeVisible(true);
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
          setSelectedProgressNumber(undefined);
        }}
        okButtonProps={{ disabled: selectedProgressNumber === undefined }}
      >
        <Radio.Group
          value={selectedProgressNumber}
          onChange={(e) => {
            setSelectedProgressNumber(e.target.value);
          }}
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
            暂无可打印的进度款（只有审批通过的进度款才能打印）
          </div>
        )}
      </Modal>
      {iframeVisible && printUrl && (
        <IframeComponent
          visible={iframeVisible}
          cancel={() => {
            setIframeVisible(false);
            setSelectedProgressNumber(undefined);
            setPrintUrl('');
          }}
          title="分包合同进度款台账"
          url={printUrl}
        />
      )}
    </>
  );
};

export default PrintProgress;

