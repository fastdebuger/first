import React from "react";
import { Form, DatePicker, Input, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";

/**
 * 质量中有多个表需要填写工作简历表单，所以需要将其拆出来
 * 工作简历表单组件（支持多行动态添加）
 */
const MultiDynamicForms: React.FC<any> = (props) => {
  const {
    name= "job_resume",
    required = true,
    initialValue= [{ time_start: undefined, time_end: undefined, company: "", experience: "" }]
  } = props;
  return (
    <Form.List name={name} initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <div>
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              添加工作简历
            </Button>
          </Form.Item>

          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{
                display: 'flex',
                marginBottom: 16,
                border: '1px solid #d9d9d9',
                padding: '16px',
                borderRadius: '4px'
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'time_start']}
                label="开始时间"
                rules={required ? [{ required: true, message: '请选择开始时间' }] : []}
                getValueFromEvent={(_date, dateString) => {
                  // 直接返回日期字符串，不返回 moment 对象
                  return dateString;
                }}
                getValueProps={(value) => {
                  // 将字符串转换为 moment 对象用于显示
                  return { value: value ? moment(value) : null };
                }}
              >
                <DatePicker
                  placeholder='请选择开始时间'
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'time_end']}
                label="结束时间"
                rules={required ? [{ required: true, message: '请选择结束时间' }] : []}
                getValueFromEvent={(_date, dateString) => {
                  // 直接返回日期字符串，不返回 moment 对象
                  return dateString;
                }}
                getValueProps={(value) => {
                  // 将字符串转换为 moment 对象用于显示
                  return { value: value ? moment(value) : null };
                }}
              >
                <DatePicker
                  placeholder='请选择结束时间'
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'company']}
                label="工作单位"
                rules={required ? [{ required: true, message: '请输入工作单位' }] : []}
              >
                <Input placeholder="请输入工作单位" />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'experience']}
                label="工作经历和业绩"
                rules={required ? [{ required: true, message: '请输入工作经历和业绩' }] : []}
              >
                <Input.TextArea
                  placeholder="请输入主要工作经历和业绩"
                />
              </Form.Item>

              {fields.length > 1 && (
                <MinusCircleOutlined
                  onClick={() => remove(name)}
                  style={{ fontSize: '16px', marginLeft: '16px', color: '#ff4d4f' }}
                />
              )}
            </Space>
          ))}
        </div>
      )}
    </Form.List>
  );
};

export default MultiDynamicForms;
