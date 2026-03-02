import React, { useRef, useState } from 'react';
import { Modal, Button, Space, Input, message, Spin } from 'antd';
import { BasicFormColumns } from 'qcx4-components';
import BaseTaskForm from '@/components/BaseTaskForm';
import ReactSimpleVerify from 'react-simple-verify';
import { VerifyCode } from '@/common/const';
import { connect, useIntl } from 'umi';

const UpdatePassWordModal: React.FC<any> = (props) => {
  const { visible, handleOk, handleCancel, inputUserCode, dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [isOk, setIsOk] = useState(true);
  const [token, setToken] = useState('');
  const { formatMessage } = useIntl();
  const childRef: any = useRef();
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
  let timer: NodeJS.Timeout | null = null;
  const debounce = <T extends any[]>(handle: (...args: T) => void, wait: number) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    return (...args: T) => {
      timer = setTimeout(() => {
        handle(...args);
      }, wait);
    };
  };
  const checkPwd = (_: any, value: any) => {
    const regExp = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@$%^\-_]).*$/;
    if (regExp.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'base.user.password.verify.info' })));
  };
  const columns = [
    {
      title: 'base.user.login.user_code',
      dataIndex: 'user_code',
      width: 200,
      align: 'center',
      subTitle: '用户账号',
    },
    {
      title: 'base.user.old_password',
      dataIndex: 'old_password',
      width: 200,
      align: 'center',
      subTitle: '旧密码',
    },
    {
      title: 'base.user.new_password',
      dataIndex: 'new_password',
      width: 200,
      align: 'center',
      subTitle: '新密码',
    },
  ];
  const getFormColumns = () => {
    const cols = new BasicFormColumns(columns);
    cols
      .initFormColumns([
        'user_code',
        {
          title: 'base.user.old_password',
          dataIndex: 'old_password',
          width: 200,
          align: 'center',
          subTitle: '旧密码',
          renderSelfForm: () => {
            return <Input.Password />;
          },
        },
        {
          title: 'base.user.new_password',
          dataIndex: 'new_password',
          width: 200,
          align: 'center',
          subTitle: '新密码',
          renderSelfForm: () => {
            return <Input.Password />;
          },
        },
      ])
      .needToDisabled(['user_code'])
      .needToRules([
        'old_password',
        {
          value: 'new_password',
          rules: [
            {
              required: true,
              validator: checkPwd,
            },
          ],
        },
      ]);
    return cols.getNeedColumns();
  };

  const footerBarRender = (form: any) => {
    const handleSubmit = async () => {
      const values = await form.validateFields();
      values.verify_code = token;
      handleOk(values);
    };
    return (
      <div>
        <div style={{ marginLeft: 125, marginBottom: 10 }}>
          <ReactSimpleVerify
            tips={formatMessage({ id: 'base.user.slider.info' })}
            success={() => {
              setLoading(true);
              debounce(handleVerify, 300);
            }}
            width={378}
            ref={childRef}
          />
        </div>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            key={1}
            onClick={() => {
              handleCancel();
            }}
          >
            {formatMessage({ id: 'base.user.login.cancel' })}
          </Button>
          <Button type="primary" disabled={isOk} key={2} onClick={handleSubmit}>
            {formatMessage({ id: 'base.user.login.ok' })}
          </Button>
        </Space>
      </div>
    );
  };
  return (
    <Modal
      title={formatMessage({ id: 'base.component.globalHeader.change_password' })}
      visible={visible}
      destroyOnClose
      width="672px"
      footer={[]}
      onCancel={() => handleCancel()}
    >
      <Spin spinning={loading}>
        <p style={{ color: 'red' }}>*{formatMessage({ id: 'base.user.password.verify.info' })}</p>
        <BaseTaskForm
          initialValue={{ user_code: inputUserCode }}
          formColumns={getFormColumns()}
          labelAlign="left"
          colSpan={20}
          footerBarRender={footerBarRender}
        />
      </Spin>
    </Modal>
  );
};

export default connect()(UpdatePassWordModal);
