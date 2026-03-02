import React, { useEffect, useState } from "react";
import { connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Modal, Form, Input, Radio, Button, Space, Row, Col, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import '../Add/index.less';

/**
 * 编辑工程产品总体质量概述
 * @param props
 * @constructor
 */
const QualityProjectQualityOverviewEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && selectedRecord) {
      form.resetFields();
      let projectList = [];
      //将单个记录转换为数组
      projectList = [{
        project_in_progress_name: selectedRecord.project_in_progress_name || '',
        type_code: String(selectedRecord.type_code) || '0',
        overall_quality_status: selectedRecord.overall_quality_status || '',
        major_quality_activities: selectedRecord.major_quality_activities || '',
        award_info: selectedRecord.award_info || ''
      }];

      // 如果解析后为空，至少保留一条空记录
      if (!projectList || projectList.length === 0) {
        projectList = [{
          project_in_progress_name: '',
          type_code: '0',
          overall_quality_status: '',
          major_quality_activities: '',
          award_info: ''
        }];
      }

      form.setFieldsValue({
        project_list: projectList
      });
    }
  }, [visible, selectedRecord, form]);

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!values.project_list || values.project_list.length === 0) {
        message.warning('请至少添加一条项目记录');
        return;
      }
      const projectList = values.project_list[0];
      setSubmitting(true);
      dispatch({
        type: "qualityProjectQualityOverview/updateQualityProjectQualityOverview",
        payload: {
          ...selectedRecord,
          ...projectList,
        },
        callback: (res: any) => {
          setSubmitting(false);
          if (res.errCode === ErrorCode.ErrOk) {
            message.success("编辑成功");
            setTimeout(() => {
              callbackSuccess();
            }, 1000);
          }
        },
      });
    } catch (error: any) {
      console.error('Validate Failed:', error);
      message.error('请填写完整表单信息');
    }
  };

  return (
    <Modal
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      closable={false}
      bodyStyle={{
        height: 'calc(100vh - 65px)',
        overflowY: 'auto',
      }}
      width={'100%'}
      title={
        <div className="custom-modal-header">
          <span className="modal-title">
            编辑工程产品总体质量概述
          </span>
          <div className="modal-buttons">
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={submitting}>
                提交
              </Button>
              <Button onClick={onCancel}>
                取消
              </Button>
            </Space>
          </div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            project_list: []
          }}
        >
          {/* 动态项目列表 */}
          <Form.List name="project_list">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={16} style={{ marginBottom: '16px' }}>
                    <Col span={24}>
                      <Card
                        style={{ border: '1px solid #d9d9d9' }}
                        extra={
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            disabled={fields.length === 1}
                          >
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={5}>
                            <Form.Item
                              label="在建项目名称:"
                              name={[field.name, 'project_in_progress_name']}
                              rules={[{ required: true, message: '请输入在建项目名称' }]}
                            >
                              <Input placeholder="请输入在建项目名称" />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              label="项目类型:"
                              name={[field.name, 'type_code']}
                              rules={[{ required: true, message: '请选择项目类型' }]}
                            >
                              <Radio.Group>
                                <Radio value="0">在建</Radio>
                                <Radio value="1">中交</Radio>
                                <Radio value="2">投产</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              label="质量运行整体情况描述:"
                              name={[field.name, 'overall_quality_status']}
                              rules={[{ required: true, message: '请输入质量运行整体情况描述' }]}
                            >
                              <Input placeholder="请输入质量运行整体情况描述" />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              label="单位开展的质量活动:"
                              name={[field.name, 'major_quality_activities']}
                              rules={[{ required: true, message: '请输入单位开展的质量活动' }]}
                            >
                              <Input placeholder="请输入单位开展的质量活动" />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              label="获奖情况说明:"
                              name={[field.name, 'award_info']}
                              rules={[{ required: true, message: '请输入获奖情况说明' }]}
                            >
                              <Input placeholder="请输入获奖情况说明" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Card>
    </Modal>
  );
};

export default connect()(QualityProjectQualityOverviewEdit);
