import React from "react";
import { Form, DatePicker, Input, Button, Space, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";

/**
 * 创优情况计划
 * 获奖情况表单组件（支持多行动态添加）
 */
const MultiDynamicForms: React.FC<any> = (props) => {
  const {
    name,
    title,
    required = true,
    initialValue = [{ engin_name: undefined, engin_time: undefined, engin_level: "" }]
  } = props;
  return (
    <Form.List name={name} initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <div>
          <Form.Item>
            <Divider orientation="left">
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                添加{title}
              </Button>
            </Divider>

          </Form.Item>

          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{
                display: 'flex',
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'engin_name']}
                label="名称"
                rules={required ? [{ required: true, message: '请填写名称' }] : []}
              >
                <Input placeholder="请填写名称" />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'engin_time']}
                label="时间"
                rules={required ? [{ required: true, message: '请选择时间' }] : []}
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
                  placeholder='请选择时间'
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'engin_level']}
                label="等级"
                rules={required ? [{ required: true, message: '请输入等级' }] : []}
              >
                <Input placeholder="请输入等级" />
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
