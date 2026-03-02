import { useState } from 'react';
import { notification } from 'antd';
import { flowComplete, flowRefuse } from '@/services/backConfig/flow';

interface FlowContext {
  onSuccess?: () => void;
}

export const useFlowAction = ({ onSuccess }: FlowContext) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 执行流程处理逻辑
   * @param items 选中的行数据
   * @param comment 审批意见
   * @param mode 'approve' (通过) | 'reject' (驳回)
   */
  const executeFlowTask = async (
    items: any[],
    comment: string,
    mode: 'approve' | 'reject' = 'approve'
  ) => {
    try {
      setIsSubmitting(true);
      let successCount = 0;
      let failCount = 0;

      for (const item of items) {
        try {
          const taskId = item.taskId;

          const payload = {
            taskId: taskId,
            langType: "zh-CN",
            comment: {
              content: comment,
              taskId: taskId,
              userId: "",
              attachments: []
            },
            values: {
              ...item
            }
          };

          const api = mode === 'approve' ? flowComplete : flowRefuse;
          const res = await api(payload);

          if (res.success) successCount++;
          else failCount++;
        } catch (err) {
          failCount++;
        }
      }

      notification.success({
        message: '处理结果',
        description: `成功处理 ${successCount} 条任务${failCount > 0 ? `，失败 ${failCount} 条` : ''}`,
      });

      setIsModalOpen(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    executeFlowTask
  };
};