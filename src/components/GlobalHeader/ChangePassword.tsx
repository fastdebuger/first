import React, { useRef, useState } from 'react';
import { Modal, Button, Space, Input, message, Spin, Form } from 'antd';
import ReactSimpleVerify from 'react-simple-verify';
import { VerifyCode } from '@/common/const';
import { connect, useIntl } from 'umi';
import 'react-simple-verify/dist/react-simple-verify.css';

const ChangePassWord: React.FC<any> = (props) => {
  const { showChangePasswordModal, handleModifyPwd, handleHideModal, inputUserCode, dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [isOk, setIsOk] = useState(true);
  const [token, setToken] = useState('');
  const { formatMessage } = useIntl();
  const childRef = useRef();
  const [form] = Form.useForm();

  /**
   * 滑动滑块获取登录验证token
   */
  const handleVerify = () => {
    if (dispatch) {
      dispatch({
        type: 'login/getVerifyCode',
        payload: {
          module: VerifyCode.ModifyPwd,
        },
        callback(res: any) {
          if (res && res.token) {
            setLoading(false);
            setIsOk(false);
            message.success(formatMessage({ id: 'base.user.verify.success.please.confirm' }));
            setToken(res.token);
          } else {
            setToken('');
            setLoading(false);
            setIsOk(true);
            message.error(formatMessage({ id: 'base.user.verify.failed' }));
            // @ts-ignore
            childRef.current.reset();

          }
        },
      });
    }
  };
  /**
   * 防抖函数
   */
  let timer: any = null;
  const debounce = (handle: Function, wait: number) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      handle();
    }, wait);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.verify_code = token;
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
      title={formatMessage({ id: 'base.component.globalHeader.change_password' })}
      visible={showChangePasswordModal}
      destroyOnClose
      width='672px'
      footer={[]}
      onCancel={() => handleHideModal()}
    >
      <Spin spinning={loading}>
        <p style={{ color: 'red' }}>*{formatMessage({ id: 'base.user.password.verify.info' })}</p>
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
            label={formatMessage({ id: 'base.user.old_password' })}
            name="old_password"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'base.user.new_password' })}
            name="new_password"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <div style={{ marginLeft: 125, marginBottom: 10 }}>
          <ReactSimpleVerify tips={formatMessage({ id: 'base.user.slider.info' })} success={() => {
            setLoading(true);
            debounce(handleVerify, 300);
          }} width={378} ref={childRef} />
        </div>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button key={1} onClick={() => {
            handleHideModal();
            form.resetFields();
          }}>
            {formatMessage({ id: 'base.user.login.cancel' })}
          </Button>
          <Button type='primary' disabled={isOk} key={2} onClick={handleSubmit}>
            {formatMessage({ id: 'base.user.login.ok' })}
          </Button>
        </Space>
      </Spin>
    </Modal>
  );
};

export default connect()(ChangePassWord);

