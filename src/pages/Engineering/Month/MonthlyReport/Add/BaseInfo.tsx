import { Col, Form, Input, Modal, Row, Select } from 'antd';
import {useEffect, useImperativeHandle, useState } from 'react';
import {PROJECT_STATUS} from "@/common/const";
import FormItemIsDatePicker from "../FormItem/FormItemIsDatePicker";
import ColProjectStatusDate from '../Common/ColProjectStatusDate';

const BaseInfo = (props: any) => {
  const { cRef, lastMonthRecord } = props;
  const initProjectStatus = '2';

  const [form] = Form.useForm();
  const changeCompleteDate = Form.useWatch( 'change_complete_date', form);
  const [hasRule, setHasRule] = useState<boolean>(false);

  useEffect(() => {
    setHasRule(!!changeCompleteDate);
  }, [changeCompleteDate]);

  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlyReportBase) {
      Object.assign(lastMonthRecord.MonthlyReportBase, {
        project_status: lastMonthRecord.MonthlyReportBase.project_status + ''
      });
      form.setFieldsValue(lastMonthRecord.MonthlyReportBase);
    }
  }, [lastMonthRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: async () => {
        try {
          return await form.validateFields();
        } catch (err) {
          Modal.error({
            title: '基础数据有必填项未填写'
          });
        }
      }
    };
  });

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      form={form}
      layout={'vertical'}
      initialValues={{
        project_status: initProjectStatus,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="项目状态"
            name="project_status"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select placeholder={'请选择'}>
              {PROJECT_STATUS.map((item: any) => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <ColProjectStatusDate/>
        </Col>


        <Col span={6} key={`${hasRule}`}>
          <Form.Item
            label="变更后完工日期"
            name="change_complete_date"
            rules={hasRule ? [{ required: true, message: '必填项' }] : []}
          >
            <FormItemIsDatePicker needValue={"date"} />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label="变更日期"
            name="change_date"
            rules={hasRule ? [{ required: true, message: '必填项' }] : []}
          >
            <FormItemIsDatePicker  needValue={"date"}/>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="工期变更原因"
            name="change_reason"
            rules={hasRule ? [{ required: true, message: '必填项' }] : []}
          >
            <Input.TextArea  placeholder={'请输入'} />
          </Form.Item>
        </Col>

        <Col span={12}/>

        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.project_status !== curr.project_status}>
          {({ getFieldValue }) => {
            const projectStatus = getFieldValue("project_status")

            if (projectStatus === "6") {
              return (
                <>
                  <Col span={6}>
                    <Form.Item
                      name="shut_down_date"
                      label="停工日期"
                      rules={[{ required: true, message: "必填项" }]}
                    >
                      <FormItemIsDatePicker needValue={"date"}/>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="work_resumption_date"
                      label="复工日期"
                      rules={[{ required: true, message: "必填项" }]}
                    >
                      <FormItemIsDatePicker needValue={"date"}/>
                    </Form.Item>
                  </Col>
                  <Col span={12}/>
                  <Col span={12}>
                    <Form.Item
                      name="shut_down_reason"
                      label="停工原因"
                      rules={[{ required: true, message: "必填项" }]}
                    >
                      <Input.TextArea  placeholder={'请输入'} />
                    </Form.Item>
                  </Col>
                </>
              )
            }
            return null;
          }}
        </Form.Item>
      </Row>
    </Form>
  )
}

export default BaseInfo;
