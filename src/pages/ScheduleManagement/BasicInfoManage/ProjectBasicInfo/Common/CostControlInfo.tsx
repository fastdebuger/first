import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Row, Col } from "antd";

/**
 * 费控信息表单组件（用于项目成本预算管理）
 * @param props - 组件接收的props
 *   @param ref: 父组件传递的Ref，用于暴露getFormData方法
 * @constructor
 */
const CostControlInfo: React.FC<any> = forwardRef((props, ref) => {
  const { disabled = false } = props;
  const [form] = Form.useForm(); // 内部创建 form 实例

  // 通过 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    /**
     * 获取表单数据（父组件提交时调用）
     * 1. 触发所有表单校验（包括两个必填字段）
     * 2. 返回格式化后的表单数据（直接返回表单值）
     * 3. 校验失败时抛出错误（由父组件统一处理）
     */
    getFormData: async () => {
      try {
        // 先触发校验，失败会抛错
        const values = await form.validateFields();
        return values; // 直接返回 { expected_revenue: ..., approved_cost: ... }
      } catch (errorInfo) {
        // 校验不通过时，抛出错误让父组件统一处理（或返回部分值）
        console.warn("费控信息表单校验失败", errorInfo);
        throw new Error("费控信息必填项未填写完整");
      }
    },
    setFormData: (data: any) => {
      form.setFieldsValue(data);
    },
  }));

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      disabled={disabled}
      initialValues={{}}
    >
      {/* 两个输入框使用双列布局（Row/Gutter实现） */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="预计收入(不含税)"
            name="expected_revenue"
            rules={[{ required: true, message: "请输入预计收入(不含税)" }]}
          >
            {/* 输入框 + 单位后缀（万元） */}
            <Input addonAfter="万元" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="批复成本预算(不含税)"
            name="approved_cost"
            rules={[{ required: true, message: "请输入批复成本预算(不含税)" }]}
          >
            <Input addonAfter="万元" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

// React 组件的静态属性
CostControlInfo.displayName = "CostControlInfo";

export default CostControlInfo;