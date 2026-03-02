import React, { useState } from "react"
import { message, Modal, Form, Input, Button, Progress, Alert, Typography, Space } from "antd"
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import { connect, useIntl } from "umi";
import { encrypt } from "@/utils/request";
import { ErrorCode } from '@/common/const';

const { Text, Title } = Typography

interface ResetPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: string,
  verificationCode: string,
  phone: string,
  dispatch: any
}

const ResetPasswordModal = ({ open, onOpenChange, dispatch, account,verificationCode,phone }: ResetPasswordModalProps) => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { formatMessage } = useIntl();

  // 关闭弹窗并重置表单
  const handleClose = () => {
    form.resetFields()
    setPasswordStrength(0)
    onOpenChange(false)
  }

  // 校验密码强度，返回强度分数
  const validatePassword = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 20
    if (/(?=.*[a-z])/.test(password)) strength += 20
    if (/(?=.*[A-Z])/.test(password)) strength += 20
    if (/(?=.*\d)/.test(password)) strength += 20
    if (/(?=.*[!@#$%^&*])/.test(password)) strength += 20
    return strength
  }

  // 根据密码强度分数返回状态和文本
  const getPasswordStrengthStatus = (strength: number) => {
    if (strength < 40) return { status: "exception" as const, text: formatMessage({ id: 'resetPassword.strengthWeak' }) }
    if (strength < 80) return { status: "normal" as const, text: formatMessage({ id: 'resetPassword.strengthMedium' }) }
    return { status: "success" as const, text: formatMessage({ id: 'resetPassword.strengthStrong' }) }
  }

  // 密码输入框内容变化时，更新密码强度
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPasswordStrength(validatePassword(value))
  }

  // 表单提交处理
  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    setIsLoading(true)
    try {
      // 模拟修改密码API调用
      dispatch({
        type: "login/retrievePassword",
        payload: {
          generate_code: verificationCode,
          tel_num: phone,
          user_code: account,
          password: encrypt(values.confirmPassword),
          lang_type: 'zh-CN'
        },
        callback: (res: any) => {
          console.log(res, '发送验证码返回结果');
          if (res.errCode === ErrorCode.ErrOk) {
            handleClose()
            message.success(formatMessage({ id: 'resetPassword.passwordResetSuccess' }))
          }
        }
      })
    } catch (error) {
      Modal.error({
        title: formatMessage({ id: 'resetPassword.failTitle' }),
        content: formatMessage({ id: 'resetPassword.failContent' }),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const strengthStatus = getPasswordStrengthStatus(passwordStrength)

  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: "#52c41a",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LockOutlined style={{ color: "white", fontSize: 24 }} />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {formatMessage({ id: 'resetPassword.title' })}
          </Title>
          <Text type="secondary">
            {formatMessage({ id: 'resetPassword.subTitle' }, { account })}
          </Text>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={450}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 24 }}>
        <Form.Item
          name="newPassword"
          label={formatMessage({ id: 'resetPassword.newPasswordLabel' })}
          rules={[
            { required: true, message: formatMessage({ id: 'resetPassword.newPasswordRequired' }) },
            { min: 8, message: formatMessage({ id: 'resetPassword.passwordMinLength' }) },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^-_])/,
              message: formatMessage({ id: 'resetPassword.passwordPattern' }),
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder={formatMessage({ id: 'resetPassword.newPasswordPlaceholder' })}
            onChange={handlePasswordChange}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        {passwordStrength > 0 && (
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Progress
                  percent={passwordStrength}
                  status={strengthStatus.status}
                  showInfo={false}
                  size="small"
                  style={{ flex: 1 }}
                />
                <Text style={{ fontSize: 12 }}>
                  {formatMessage({ id: 'resetPassword.strengthLabel' })}: {strengthStatus.text}
                </Text>
              </div>
            </Space>
          </Form.Item>
        )}

        <Form.Item
          name="confirmPassword"
          label={formatMessage({ id: 'resetPassword.confirmPasswordLabel' })}
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: formatMessage({ id: 'resetPassword.confirmPasswordRequired' }) },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(formatMessage({ id: 'resetPassword.passwordMismatch' })))
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder={formatMessage({ id: 'resetPassword.confirmPasswordPlaceholder' })}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Alert
          message={formatMessage({ id: 'resetPassword.passwordRequirements' })}
          description={
            <ul style={{ margin: 0, paddingLeft: 0 }}>
              <li>{formatMessage({ id: 'resetPassword.requirementLength' })}</li>
              <li>{formatMessage({ id: 'resetPassword.requirementChars' })}</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
            {formatMessage({ id: 'resetPassword.confirmBtn' })}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatMessage({ id: 'resetPassword.loginHint' })}
          </Text>
        </div>
      </Form>
    </Modal>
  )
}

export default connect()(ResetPasswordModal);