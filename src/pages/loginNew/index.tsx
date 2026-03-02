import React, { useState } from "react"
import { Database } from "lucide-react"
import { Form, Input, Button, message, Modal } from "antd"
import { ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import './index.css';
import { ErrorCode, VerifyCode } from "@/common/const";
import { connect, useIntl } from "umi";
import UpdatePassWordModal from "../login/UpdatePassWordModal";
import { encrypt } from "@/utils/request";
import ForgotPasswordModal from './components/forgotPasswordModal'
import homeLeftLogo from '@/assets/homeLeftLogo.png';
import logo from '@/assets/logo.png';

const Login = (props) => {
  const { dispatch } = props;
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [inputUserCode, setInputUserCode] = useState('');
  const [loginErrorModalVisible, setLoginErrorModalVisible] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const { formatMessage } = useIntl();


  const handleSubmit = async (values: any) => {
    setLoading(true)
    if (dispatch) {
      dispatch({
        type: 'login/getVerifyCode',
        payload: {
          module: VerifyCode.Login,
        },
        callback(res: any) {
          console.log(res,'login/getVerifyCodelogin/getVerifyCode');

          if (res && res.token) {
            loginPc(values, res.token);
          } else {
            // setToken('');
            setLoading(false);
            // setIsLogin(true);
            message.error(formatMessage({ id: "base.user.verify.failed" }));
            // @ts-ignore
            childRef.current.reset();

          }
        },
      });
    }
    // try {
    //   console.log("登录信息:", values)
    //   // 这里可以添加实际的登录API调用
    //   await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟网络请求
    //   alert("登录成功！")
    // } catch (error) {
    //   alert("登录失败，请检查用户名和密码")
    // } finally {
    //   setLoading(false)
    // }
  }


  /**
     * 登录方法
     * @param values
     */
  const loginPc = (values, token) => {
    setLoading(true)
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        verify_code: token,
      },
      callback(res: any) {
        setLoading(false);
        if (res && res.errCode === ErrorCode.ErrOk) {
          message.success('登陆成功');
        } else if (res && res.errCode === -104) {
          Modal.confirm({
            title: formatMessage({ id: 'base.user.login.password_security_change.title' }),
            icon: <ExclamationCircleOutlined />,
            content:
              res.errText || formatMessage({ id: 'base.user.login.password_security_change.content' }),
            onOk() {
              setInputUserCode(values.userCode);
              setLoginErrorModalVisible(true);
            },
            onCancel() {
              setInputUserCode(values.userCode);
              setLoginErrorModalVisible(true);
            },
          });
        } else if (res && res.errCode === ErrorCode.ErrUserCodeOrPwd) {
          Modal.warning({
            title: '提示',
            content: res.errInfo,
            onOk() {

            },
          });
        } else {
          message.error(formatMessage({ id: 'base.user.login.failed' }));
          setIsLogin(true);
        }
        setLoading(false)
      },
    });
  };

  /**
   * 修改密码确定方法
   * @param fields
   */
  const handleOk = (fields: any) => {
    // eslint-disable-next-line no-param-reassign
    fields.new_password = encrypt(JSON.stringify({ pwd: fields.new_password }));
    // eslint-disable-next-line no-param-reassign
    fields.old_password = encrypt(JSON.stringify({ pwd: fields.old_password }));
    if (dispatch) {
      dispatch({
        type: 'login/modifyPwd',
        payload: fields,
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'base.user.login.change_password_success_tips' }));
            setLoginErrorModalVisible(false);
            setIsLogin(true);
          }
          if (res.errCode === -1 || res.errCode === '-1') {
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
  const editLoginModal = {
    visible: loginErrorModalVisible,
    inputUserCode,
    handleOk,
    handleCancel: () => setLoginErrorModalVisible(false),
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/bg-02.png')",
        }}
      >
        {/* 左侧内容区域 - 仅在大屏幕显示 */}
        <div className="hidden lg:flex lg:absolute lg:left-12 lg:top-12 lg:bottom-12 lg:w-2/5 flex-col justify-between text-white z-10">
          {/* 顶部标题 */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <img src={homeLeftLogo} style={{width: 56, marginTop: -10}}/>
            </div>
            <div>
              <h1 style={{ position: 'relative', color: 'rgb(255 255 255)' }} className="text-2xl font-bold">公司数字化管理平台</h1>
              <p style={{ color: 'rgb(255 255 255)' }} className="text-sm">Smart Management System</p>
            </div>
          </div>

          {/* 中间主要内容 */}
          {/*<div className="space-y-6">*/}
          {/*  <h2 style={{ color: 'rgb(255 255 255 / var(--tw-text-opacity, 1))' }} className="text-4xl font-bold leading-tight">智能化管理·数字化未来</h2>*/}
          {/*  <p style={{ color: 'rgb(191 219 254 / var(--tw-text-opacity, 1))' }} className="text-lg text-blue-100 max-w-md leading-relaxed">*/}
          {/*    基于先进技术构建的智能管理平台，为企业提供全方位的数字化解决方案，助力企业数字化转型升级*/}
          {/*  </p>*/}
          {/*</div>*/}

          {/* 底部版权信息 */}
          <div className="space-y-2 text-sm text-color-white">
            <p>
              <a style={{ fontSize: 13, color: '#fff' }} href="https://beian.miit.gov.cn/" target="view_window">
                鲁ICP备18057782号-1
              </a>
            </p>
          </div>
        </div>

        {/* 登录表单 - 居中显示 */}
        <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, width: '25%', background: '#fff'}} >
          <div style={{ width: '100%', height: '100%', paddingTop: '30%' }}>
            {/* 移动端头部 */}
            <div className="lg:hidden text-center space-y-2">
              <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
              <h1 style={{ fontWeight: 700 }} className="text-2xl font-bold text-white">公司数字化管理平台</h1>
            </div>

            {/* 登录表单卡片 */}
            <div className="bg-white p-8 space-y-6">
              {/* 表单头部 */}
              <div className="text-center space-y-2">
                <img src={logo} alt="Logo" className="w-12 h-12 rounded-xl mx-auto" />
                {/*<img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl mx-auto" />*/}
                <h2 className="text-2xl font-bold text-gray-900">公司数字化管理平台</h2>
                <p className="text-gray-600">请输入您的账户信息登录系统</p>
              </div>

              {/* Ant Design 登录表单 */}
              <Form
                form={form}
                name="login"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                size="large"
                layout="vertical"
              >
                <Form.Item label={<strong>用户名</strong>} name="userCode" rules={[{ required: true, message: "请输入用户名" }]}>
                  <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item label={<strong>密码</strong>} name="pwd" rules={[{ required: true, message: "请输入密码" }]}>
                  <Input.Password
                    placeholder="请输入密码"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <div className="flex items-center justify-between mb-4">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    {/* <Checkbox>记住登录状态</Checkbox> */}
                    <span> </span>
                  </Form.Item>
                  <a onClick={() => {
                    setForgotPasswordOpen(true)
                  }} className="text-sm text-blue-600 hover:text-blue-700" href="#">
                    忘记密码？
                  </a>
                </div>

                <Form.Item>
                  <Button
                    type="primary" danger
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{ height: "44px", borderRadius: "8px", backgroundColor: "#b52319" }}
                  >
                    {loading ? "登录中..." : "登录系统"}
                  </Button>
                </Form.Item>
              </Form>

              {/* 服务条款 */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>
                  登录即表示您同意我们的{" "}
                  <a className="text-blue-600 hover:text-blue-700" href="#">
                    服务条款
                  </a>{" "}
                  和{" "}
                  <a className="text-blue-600 hover:text-blue-700" href="#">
                    隐私政策
                  </a>
                </p>
              </div>
            </div>

            {/* 页面底部信息 */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>技术支持：青岛雅扬科技</p>
              <p>系统版本：v2.1.0</p>
            </div>
          </div>
        </div>
        <UpdatePassWordModal {...editLoginModal} />
        <ForgotPasswordModal
          open={forgotPasswordOpen}
          onOpenChange={setForgotPasswordOpen} />
      </div>
    </>
  )
}


export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
function setInputUserCode(userCode: any) {
  throw new Error("Function not implemented.");
}

