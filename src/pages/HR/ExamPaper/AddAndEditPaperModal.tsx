import {useEffect, useState} from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch, Alert, Skeleton, Row, Col
} from "antd"
import { queryExamModuleInfo } from '@/services/hr/exam';

const { Option } = Select

const AddAndEditPaperModal = (props: any) => {

  const { paperForm, editingPaper, isPaperModalVisible, handleSavePaper, onCancel } = props;
  const [moduleList, setModuleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInitData = async()=> {
    setLoading(true);
    const resModule = await queryExamModuleInfo({
      sort: 'module_code',
      order: 'asc'
    })
    setModuleList(resModule.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchInitData();
  }, [])

  return (
    <Modal
      title={editingPaper ? "编辑题库" : "新建题库"}
      open={isPaperModalVisible}
      onOk={handleSavePaper}
      onCancel={onCancel}
      width={600}
      okText="保存"
      cancelText="取消"
    >
      <Skeleton loading={loading}>
        <Alert type={"info"} message={"角色为空表示通用题目，填写则针对特定角色"}/>
        <Form form={paperForm} layout="vertical" style={{ marginTop: "24px" }}>
          <Form.Item name="paper_name" label="试卷名称" rules={[{ required: true, message: "请输入试卷名称" }]}>
            <Input placeholder="请输入试卷名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="module_code" label="考试系统" rules={[{ required: true, message: "请选择考试系统" }]}>
                <Select placeholder="请选择考试系统">
                  {moduleList.map((item: any) => (
                    <Option key={item.module_code} value={item.module_code}>{item.module_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="exam_duration"
            label="考试时长（分钟）"
            rules={[{ required: true, message: "请输入考试时长" }]}
          >
            <InputNumber min={1} max={300} style={{ width: "100%" }} />
          </Form.Item>

          {/*<Form.Item
            label="报名截止时间（考试开始前多少分钟）"
            name="registration_deadline_minutes"
            rules={[{ required: true, message: "请输入报名截止时间" }]}
            tooltip="设置考试开始前多少分钟截止报名，例如：30表示考试开始前30分钟截止报名"
          >
            <InputNumber min={0} max={1440} style={{ width: "100%" }} placeholder="例如：30" />
          </Form.Item>*/}

          <Form.Item name="total_score" label="试卷总分" rules={[{ required: true, message: "请输入试卷总分" }]}>
            <InputNumber min={1} max={1000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="pass_score" label="及格分数" rules={[{ required: true, message: "请输入及格分数" }]}>
            <InputNumber min={1} max={1000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="is_active" label="是否启用" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Skeleton>
    </Modal>
  )
}

export default AddAndEditPaperModal;
