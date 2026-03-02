import React, { useImperativeHandle } from 'react';
import {ConnectState} from "@/models/connect";
import { connect } from 'umi';
import {Button, Col, Form, InputNumber, Modal, Row, Space } from 'antd';

const FuZhai = (props: any) => {
  const { cRef, disabled = false, selectedRecord } = props;

  const [form] = Form.useForm();

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
            title: '负债有必填项未填写'
          });
        }
      }
    };
  });

  return (
    <div>
      <Form disabled={disabled} layout={'vertical'} form={form} name="resource_b3"  initialValues={{
        curr_moment_provision: selectedRecord.curr_moment_provision || 0,
        curr_year_provision: selectedRecord.curr_year_provision || 0,
      }}>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col span={6}>
            <Form.Item
              name={'curr_moment_provision'}
              label={'预计负债-本期期末'}
              // rules={[{ required: true, message: `请输入预计负债-本期期末` }]}
            >
              <InputNumber style={{width: '100%'}} placeholder={'请输入预计负债-本期期末'} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={'curr_year_provision'}
              label={'预计负债-本年末'}
              // rules={[{ required: true, message: `请输入预计负债-本年末` }]}
            >
              <InputNumber style={{width: '100%'}} placeholder={'请输入预计负债-本年末'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}


export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(FuZhai);
