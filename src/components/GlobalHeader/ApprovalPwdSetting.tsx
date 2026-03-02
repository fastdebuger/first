import React from 'react';
import { Modal, Button, Space, Input, Form } from 'antd';
import { connect, useIntl } from 'umi';

const ApprovalPwdSetting: React.FC<any> = (props) => {
  const { showChangePasswordModal, handleModifyPwd, handleHideModal } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const checkPwd = (_: any, value: any) => {
    const regExp = /^\d{6}$/;
    if (regExp.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'base.user.approval.setting.pwd.info' })));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      handleModifyPwd(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  React.useEffect(() => {
    if (showChangePasswordModal) {
      form.setFieldsValue({
        user_code: localStorage.getItem('auth-default-userCode') || '',
      });
    }
  }, [showChangePasswordModal, form]);
  return (
    <Modal
      title={formatMessage({ id: 'base.component.setting.approval.pwd' })}
      visible={showChangePasswordModal}
      destroyOnClose
      width='672px'
      footer={[]}
      onCancel={() => handleHideModal()}
    >
      <p style={{ color: 'red' }}>* {formatMessage({ id: 'base.user.approval.setting.pwd.info' })}</p>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign='left'
      >
        <Form.Item
          label={formatMessage({ id: 'base.user.login.user_code' })}
          name="user_code"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'base.user.login_pwd' })}
          name="pwd"
          rules={[{ required: true, message: '请输入登录密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'base.user.approval.pwd' })}
          name="approvalPwd"
          rules={[
            { required: true, message: '请输入审批密码' },
            { validator: checkPwd },
          ]}
        >
          <Input maxLength={6} />
        </Form.Item>
      </Form>
      <Space style={{ display: 'flex', justifyContent: 'end' }}>
        <Button key={1} onClick={() => {
          handleHideModal();
          form.resetFields();
        }}>
          {formatMessage({ id: 'base.user.login.cancel' })}
        </Button>
        <Button type='primary' key={2} onClick={handleSubmit}>
          {formatMessage({ id: 'base.user.login.ok' })}
        </Button>
      </Space>
    </Modal>
  );
};

export default connect()(ApprovalPwdSetting);

