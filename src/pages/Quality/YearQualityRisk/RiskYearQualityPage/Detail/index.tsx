import React from "react";
import { Modal, Form, Input } from "antd";
import QuestionnaireTable from "../QuestionnaireTable";


/**
 * 年度质量风险评估详情
 */
const RiskMonthlyPageDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord = {}, isDetail = true } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      title={'年度质量风险评估详情'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'100vw'}
      style={{ top: 0, maxWidth: '100vw', paddingBottom: 0 }}
      bodyStyle={{ height: 'calc(100vh - 55px)' }}
    >
      <Form style={{ margin: 16 }} form={form} initialValues={selectedRecord} layout="inline">
        <Form.Item
          label="年份"
          name="year"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="工程名称"
          name="project"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
      </Form>
      <QuestionnaireTable
        main_id={selectedRecord.main_id}
        selectedRecord={selectedRecord}
        isDetail={isDetail}
      />
    </Modal>
  )
}

export default RiskMonthlyPageDetail;
