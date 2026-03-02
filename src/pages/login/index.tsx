import {
  ExclamationCircleOutlined,
  LockOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Space, message, Tabs, Spin, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import ReactSimpleVerify from 'react-simple-verify';
import 'react-simple-verify/dist/react-simple-verify.css';
// @ts-expect-error CSS模块类型声明问题
import styles from './index.less';
import { ErrorCode, PROP_KEY, VerifyCode, WORK_BENCH } from '@/common/const';
import UpdatePassWordModal from './UpdatePassWordModal';
import CryptoJS from 'crypto-js';


export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};


const Login: React.FC<LoginProps> = (props: {dispatch: Dispatch}) => {
  const { dispatch } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');
  const [inputUserCode, setInputUserCode] = useState<string>('');
  const [isLoginErrorModalVisible, setLoginErrorModalVisible] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childRef: React.MutableRefObject<any> = useRef<any>(null);


  /**
   * 滑动滑块获取登录验证token
   */
  const handleVerify: () => void = () => {
    if (dispatch) {
      dispatch({
        type: 'login/getVerifyCode',
        payload: {
          module: VerifyCode.Login,
        },
        callback(res: {token: string}) {
          if (res && res.token) {
            setLoading(false);
            setIsLogin(false);
            message.success(formatMessage({ id: "base.user.verify.success.please.login" }));
            setToken(res.token);
            
          } else {
            setToken('');
            setLoading(false);
            setIsLogin(true);
            message.error(formatMessage({ id: "base.user.verify.failed" }));
            if (childRef.current) {
              childRef.current.reset();
            }
          }
        },
      });
    }
  };
  /**
   * 防抖函数
   */
  let timer: NodeJS.Timeout | null = null;
  const debounce: (handle: () => void, wait: number) => void = (handle: () => void, wait: number) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      handle();
    }, wait);
  };

  /**
   * 加密
   * @param plaintText
   */
  const cryptoJsKey: string = 'YaYangCPECCWM777';
  
  function encrypt(plaintText: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key: any = CryptoJS.enc.Utf8.parse(cryptoJsKey);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const src: any = CryptoJS.enc.Utf8.parse(plaintText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const encryptedData: any = CryptoJS.AES.encrypt(src, key, options);
    return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext);
  }

  

  /**
   * 登录方法
   * @param values
   */
  const handleSubmit: (values: LoginParamsType) => void = (values: LoginParamsType): void => {
    setLoading(true);
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        verify_code: token,
      },
      callback(res: { errCode: number; errText?: string; errInfo?: string }) {
        if (res && res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({ id: 'base.user.login.success' }));
        } else if (res && res.errCode === -104) {
          Modal.confirm({
            title: formatMessage({ id: 'base.user.login.password_security_change.title' }),
            icon: <ExclamationCircleOutlined />,
            content:
              res.errText || formatMessage({ id: 'base.user.login.password_security_change.content' }),
            onOk() {
              setInputUserCode(values.userCode);
              if (childRef.current) {
                childRef.current.reset();
              }
              setLoginErrorModalVisible(true);
            },
            onCancel() {
              setInputUserCode(values.userCode);
              if (childRef.current) {
                childRef.current.reset();
              }
              setLoginErrorModalVisible(true);
            },
          });
        } else if (res && res.errCode === ErrorCode.ErrUserCodeOrPwd) {
          Modal.warning({
            title: '提示',
            content: res.errInfo,
            onOk() {
              if (childRef.current) {
                childRef.current.reset();
              }
            },
          });
        } else {
          message.error(formatMessage({ id: 'base.user.login.failed' }));
          setIsLogin(true);
          if (childRef.current) {
            childRef.current.reset();
          }
        }
        setLoading(false);
      },
    });
  };

  /**
   * 修改密码确定方法
   * @param fields
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOk: (fields: { new_password: string; old_password: string; [key: string]: any }) => void = (fields: { new_password: string; old_password: string; [key: string]: any }): void => {
    // eslint-disable-next-line no-param-reassign
    fields.new_password = encrypt(JSON.stringify({ pwd: fields.new_password }));
    // eslint-disable-next-line no-param-reassign
    fields.old_password = encrypt(JSON.stringify({ pwd: fields.old_password }));
    if (dispatch) {
      dispatch({
        type: 'login/modifyPwd',
        payload: fields,
        callback: (res: { errCode: number; errText?: string }) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'base.user.login.change_password_success_tips' }));
            setLoginErrorModalVisible(false);
            setIsLogin(true);
            if (childRef.current) {
              childRef.current.reset();
            }
          }
          if (res.errCode === -1 || res.errCode === -1) {
            message.error(res.errText);
          } else if (res.errCode === -104) {
            message.error(
              formatMessage({ id: 'base.user.login.password_security_change.content' }),
            );
          }
        },
      });
    }
  };

  /**
   *编辑密码配置
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editLoginModal: {
    visible: boolean;
    inputUserCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleOk: (fields: { new_password: string; old_password: string; [key: string]: any }) => void;
    handleCancel: () => void;
  } = {
    visible: isLoginErrorModalVisible,
    inputUserCode,
    handleOk,
    handleCancel: () => setLoginErrorModalVisible(false),
  };
  useEffect(() => {
    // 已登陆账号
    const storedAuthToken: string | null = localStorage.getItem('x-auth-token');
    if (storedAuthToken) {
      window.location.replace(`/${PROP_KEY}/contract/income?version=${WORK_BENCH.VERSION}`);
    }
  }, []);
  return (
    <div className={styles.main}>
      <Spin spinning={isLoading}>
        <Tabs tabBarStyle={{ margin: 0 }} size='large' type='line'>
          <Tabs.TabPane
            key='account'
            tab={formatMessage({
              id: 'base.user.login.login_with_account_and_password',
            })}
          >
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                searchConfig: {
                  submitText: formatMessage({ id: 'base.user.login' }),
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  disabled: isLogin,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async (values) => {
                await handleSubmit(values as LoginParamsType);
                return Promise.resolve(true);
              }}
            >
              <ProFormText
                name='userCode'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={formatMessage({ id: 'base.user.login.please_input_user_code', })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id='base.pages.login.usercode.required'
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name='pwd'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={formatMessage({
                  id: 'base.user.login.please_input_password',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id='base.login.password.required'
                      />
                    ),
                  },
                ]}
              />
              <div className={styles.verifyInfo}>
                <ReactSimpleVerify tips={formatMessage({ id: 'base.user.slider.info' })} success={() => {
                  setLoading(true);
                  debounce(handleVerify, 200);
                }} width={328} ref={childRef} />
              </div>
            </ProForm>
          </Tabs.TabPane>
        </Tabs>
        <div>
          <div className={styles.verifyInfo}>{formatMessage({ id: 'base.user.code.verify.info' })}</div>
          <div className={styles.verifyInfo}>{formatMessage({ id: 'base.user.password.verify.info' })}</div>
        </div>
        <Space className={styles.other}>
          <FormattedMessage id='base.pages.login.loginWith' />
          <WechatOutlined className={styles.icon} />
        </Space>
      </Spin>
      <UpdatePassWordModal {...editLoginModal} />
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading?.effects['login/login'],
}))(Login);
