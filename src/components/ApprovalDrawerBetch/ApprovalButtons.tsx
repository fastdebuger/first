import React, { useState } from "react";
import { Button, Space, Modal, Form, Input, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFlowAction } from "./useFlowAction";

interface FlowApprovalButtonsProps {
  selectedRows: any[]; 
  onRefresh?: () => void;
}

const FlowApprovalButtons: React.FC<FlowApprovalButtonsProps> = ({
  selectedRows = [],
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [currentMode, setCurrentMode] = useState<"approve" | "reject">(
    "approve",
  );

  const { isModalOpen, setIsModalOpen, isSubmitting, executeFlowTask } =
    useFlowAction({
      onSuccess: ()=>{
        form.setFieldValue("comment", "");
        if(onRefresh) onRefresh();
      }
    });

  const handleOpenModal = (mode: "approve" | "reject") => {
    if (selectedRows.length === 0) {
      return message.warning("请至少选择一项任务");
    }
    setCurrentMode(mode);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    const { comment } = await form.validateFields();
    await executeFlowTask(selectedRows, comment, currentMode);
  };

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          onClick={() => handleOpenModal("approve")}
        >
          批量通过 ({selectedRows.length})
        </Button>

        <Button
          danger
          icon={<CloseOutlined />}
          onClick={() => handleOpenModal("reject")}
        >
          批量驳回
        </Button>
      </Space>

      <Modal
        title={currentMode === "approve" ? "审批通过" : "审批驳回"}
        open={isModalOpen}
        confirmLoading={isSubmitting}
        onOk={handleConfirm}
        onCancel={() => {
          form.setFieldValue("comment", "");
          setIsModalOpen(false);
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comment"
            label="审批意见"
            // rules={[{ required: true, message: "请输入审批意见" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Space>
            {currentMode === "approve" && (
              <Button
                size="small"
                onClick={() => form.setFieldValue("comment", "审核同意")}
              >
                审核同意
              </Button>
            )}
            {currentMode === "reject" && (
              <Button
                size="small"
                onClick={() => form.setFieldValue("comment", "审核驳回")}
              >
                审核驳回
              </Button>
            )}
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default FlowApprovalButtons;
