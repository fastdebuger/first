import {Button, Card, Form, Input, Modal, Radio } from 'antd';
import React, { useEffect } from 'react';
import {PUSH_RANGE_TYPE} from "@/common/const";
import SelectedObs from "@/pages/HR/PushCourse/Common/PushRangeList/SelectedObs";
import SelectedJobType from './SelectedJobType';
import SelectedUserGroup from "@/pages/HR/PushCourse/Common/PushRangeList/SelectedUserGroup";
import UserFetchList from "@/components/CommonList/UserFetchList";

const FormItemRangeValue = (props: any) => {

  const { form } = props;

  const pushRangeType = Form.useWatch('push_range_type', form);
  // 1-全体，2-部门，3-工种，4-角色，5-个人
  useEffect(() => {
    form.resetFields(['push_range_value']);
  }, [pushRangeType]);
  // 全部选项 不用选择
  if (pushRangeType === '1') {
    return null
  }

  if (pushRangeType === '2') {
    return (
      <Form.Item
        label={'选择部门'}
        name="push_range_value"
        rules={[{ required: true, message: '请选择选择部门' }]}
      >
        <SelectedObs onChange={(value, name) => {
          form.setFieldsValue({
            push_range_value: value,
            push_range_name: name,
          })
        }}/>
      </Form.Item>
    )
  }

  if (pushRangeType === '3') {
    return (
      <Form.Item
        label={'选择工种'}
        name="push_range_value"
        rules={[{ required: true, message: '请选择工种' }]}
      >
        <SelectedJobType/>
      </Form.Item>
    )
  }

  if (pushRangeType === '4') {
    return (
      <Form.Item
        label={'选择角色'}
        name="push_range_value"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <SelectedUserGroup onChange={(value, name) => {
          form.setFieldsValue({
            push_range_value: value,
            push_range_name: name,
          })
        }}/>
      </Form.Item>
    )
  }

  if (pushRangeType === '5') {
    return (
      <Form.Item
        label={'选择人员'}
        name="push_range_value"
        rules={[{ required: true, message: '请选择人员' }]}
      >
        <UserFetchList  onChange={(value, name) => {
          form.setFieldsValue({
            push_range_value: value,
            push_range_name: name,
          })
        }}/>
      </Form.Item>
    )
  }

  return null;
}

const PushRangeList = (props: any) => {

  const { onChange } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setSelectedItem(values);
    onChange(values);
    setVisible(false)
  };

  const showSelectedInfo = () => {
    if (Number(selectedItem.push_range_type) === 1) {
      return (
        <Card style={{ width: 300, cursor: 'pointer' }} onClick={() => setVisible(true)}>
          <div style={{fontSize: 16, fontWeight: 'bold'}}>全体人员</div>
          <div>
            将推送给平台所有人员
          </div>
        </Card>
      )
    }
    const findObj = PUSH_RANGE_TYPE.find(item => item.type === selectedItem.push_range_type)
    if (findObj) {
      return (
        <Card style={{ width: 300, cursor: 'pointer' }} onClick={() => setVisible(true)}>
          <div style={{fontSize: 16, fontWeight: 'bold'}}>{findObj.typeName}: {selectedItem.push_range_name}</div>
          <div>
            (编码：{selectedItem.push_range_value})
          </div>
        </Card>
      )
    }
    return null;
  }

  return (
    <div>
      {selectedItem ? (
        <div>
          {showSelectedInfo()}
        </div>
        ) : (
        <Button type="primary" onClick={() => setVisible(true)}>
          选择推送范围
        </Button>
      )}
      {visible && (
        <Modal
          title={'配置推送范围'}
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          <Form
            form={form}
            name="push_range"
            layout="vertical"
            initialValues={{
              push_range_name: '',
              push_range_value: '',
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="推送范围"
              name="push_range_type"
              rules={[{ required: true, message: '请选择推送范围!' }]}
            >
              <Radio.Group>
                {PUSH_RANGE_TYPE.map((item: any, index: number) => {
                  return (
                    <Radio key={item.type} value={item.type}>{item.typeName}</Radio>
                  )
                })}
              </Radio.Group>
            </Form.Item>
            {/* 无特殊意义，只是承接载体 */}
            <Form.Item
              noStyle
              style={{display: 'none'}}
              name="push_range_name"
            >
              <div> </div>
            </Form.Item>

            <FormItemRangeValue form={form}/>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default PushRangeList;
