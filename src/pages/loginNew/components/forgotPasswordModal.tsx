import React , { useEffect, useState } from "react"
import { Modal, Form, Input, Button, Alert, Typography, Space, message, Steps } from "antd"
import { MailOutlined, CheckCircleOutlined, PhoneOutlined } from "@ant-design/icons"
import { connect, useIntl } from "umi"
import { ErrorCode } from "@/common/const"
import ResetPasswordModal from "./resetPasswordModal"
import { filter } from "lodash"

const { Text, Title } = Typography

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dispatch: any
}

const ForgotPasswordModal = ({ open, onOpenChange, dispatch }: ForgotPasswordModalProps) => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0) // 0: 输入账号, 1: 验证手机号
  const [account, setAccount] = useState("")
  const [maskedPhone, setMaskedPhone] = useState("") // 后端返回的脱敏手机号
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { formatMessage } = useIntl()

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
        if (countdown < 1) {
          setIsLoading(false)
        }
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // 关闭弹窗并重置所有相关状态
  const handleClose = () => {
    form.resetFields()
    setCurrentStep(0)
    setAccount("")
    setMaskedPhone("")
    setPhone("")
    setVerificationCode("")
    setIsCodeSent(false)
    setCountdown(0)
    setShowResetPassword(false)
    setIsLoading(false)
    setIsSubmitLoading(false)
    onOpenChange(false)
  }

  // 格式化手机号，只保留数字并限制为11位
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 11)
  }

  // 手机号输入框变化时处理格式化
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  // 第一步：验证账号并获取手机号信息
  const handleAccountSubmit = async () => {
    try {
      // 调用后端接口验证账号并获取手机号
      dispatch({
        type: "login/queryUserTelNum", // 假设这是验证账号的接口
        payload: {
          user_code : account,
          sort: 'user_code',
          order : 'asc',
          filter: JSON.stringify([])
        },
        callback: (res: any) => {
          console.log(res, "验证账号返回结果")
          if (res.errCode === ErrorCode.ErrOk && res.rows && res.rows.length > 0) {
            setMaskedPhone(res.rows[0].tel_num) // 设置后端返回的脱敏手机号
            setCurrentStep(1) // 进入第二步
            message.success(formatMessage({ id: "forgotPassword.accountVerified" }))
          } else {
            message.error(formatMessage({ id: "forgotPassword.accountNotFound" }))
          }
        },
      })
    } catch (error) {
      // 表单验证失败
    } finally {
      setIsLoading(false)
    }
  }

  // 发送验证码
  const handleSendCode = async () => {
    try {
      await form.validateFields(["phone"])
      setIsLoading(true)

      dispatch({
        type: "login/sendCode",
        payload: {
          user_code: account,
          tel_num: form.getFieldValue("phone"),
        },
        callback: (res: any) => {
          console.log(res, "发送验证码返回结果")
          if (res.errCode === ErrorCode.ErrOk) {
            setIsCodeSent(true)
            setCountdown(60)
            message.success(formatMessage({ id: "forgotPassword.codeSentTitle" }))
          }
        },
      })
    } catch (error) {
      // 表单验证失败
    } finally {
      setIsLoading(false)
    }
  }

  // 提交验证码
  const handleSubmit = async (values: { phone: string; verificationCode: string }) => {
    setIsSubmitLoading(true)
    try {
      dispatch({
        type: "login/verifyGenerateCode",
        payload: {
          generate_code: values.verificationCode,
          tel_num: values.phone,
          lang_type: "zh-CN",
        },
        callback: (res: any) => {
          console.log(res, "验证码验证返回结果")
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: "forgotPassword.validationSuccessful" }))
            setShowResetPassword(true)
          }
          setIsSubmitLoading(false)
        },
      })
    } catch (error) {
      Modal.error({
        title: formatMessage({ id: "forgotPassword.verifyFailedTitle" }),
        content: formatMessage({ id: "forgotPassword.verifyFailedContent" }),
      })
      setIsSubmitLoading(false)
    }
  }

  // 返回上一步
  const handleBack = () => {
    setCurrentStep(0)
    setMaskedPhone("")
    setPhone("")
    setVerificationCode("")
    setIsCodeSent(false)
    setCountdown(0)
  }

  // 重置密码弹窗关闭时的处理
  const handleResetPasswordClose = (open: boolean) => {
    setShowResetPassword(open)
    if (!open) {
      handleClose()
    }
  }

  // 渲染第一步：输入账号
  const renderStepOne = () => (
    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
      <Form.Item
        name="account"
        label={
          <span style={{ fontSize: 14, fontWeight: 500 }}>{formatMessage({ id: "forgotPassword.accountLabel" })}</span>
        }
        rules={[{ required: true, message: formatMessage({ id: "forgotPassword.accountRequired" }) }]}
        style={{ marginBottom: 24 }}
      >
        <Input
          size="large"
          placeholder={formatMessage({ id: "forgotPassword.accountPlaceholder" })}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          style={{
            borderRadius: 8,
            height: 48,
          }}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleAccountSubmit}
          style={{
            height: 48,
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {formatMessage({ id: "forgotPassword.nextStep" })}
        </Button>
      </Form.Item>
    </Form>
  )

  // 渲染第二步：验证手机号
  const renderStepTwo = () => (
    <div style={{ marginTop: 16 }}>
      {/* 显示后端返回的脱敏手机号 */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "16px",
          borderRadius: 8,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <PhoneOutlined style={{ color: "#666", marginRight: 8 }} />
        <Text type="secondary" style={{ fontSize: 14 }}>
          {formatMessage({ id: "forgotPassword.registeredPhone" })}
        </Text>
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ fontSize: 16 }}>
            {maskedPhone}
          </Text>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="phone"
          label={
            <span style={{ fontSize: 14, fontWeight: 500 }}>{formatMessage({ id: "forgotPassword.phoneLabel" })}</span>
          }
          rules={[
            { required: true, message: formatMessage({ id: "forgotPassword.phoneRequired" }) },
            { pattern: /^1[3-9]\d{9}$/, message: formatMessage({ id: "forgotPassword.phoneInvalid" }) },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input
            size="large"
            placeholder={formatMessage({ id: "forgotPassword.phonePlaceholder" })}
            value={phone}
            onChange={handlePhoneChange}
            addonBefore="+86"
            maxLength={11}
            style={{
              borderRadius: 8,
              height: 48,
            }}
          />
        </Form.Item>

        <Form.Item
          name="verificationCode"
          label={
            <span style={{ fontSize: 14, fontWeight: 500 }}>{formatMessage({ id: "forgotPassword.codeLabel" })}</span>
          }
          rules={[
            { required: true, message: formatMessage({ id: "forgotPassword.codeRequired" }) },
            { min: 6, message: formatMessage({ id: "forgotPassword.codeLength" }) },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              size="large"
              placeholder={formatMessage({ id: "forgotPassword.codePlaceholder" })}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              style={{
                flex: 1,
                borderRadius: "8px 0 0 8px",
                height: 48,
              }}
            />
            <Button
              size="large"
              onClick={handleSendCode}
              loading={isLoading}
              disabled={!phone || phone.length !== 11 || countdown > 0}
              style={{
                width: 120,
                borderRadius: "0 8px 8px 0",
                height: 48,
              }}
            >
              {countdown > 0
                ? `${countdown}s${formatMessage({ id: "forgotPassword.resendLater" })}`
                : formatMessage({ id: "forgotPassword.sendCode" })}
            </Button>
          </Space.Compact>
        </Form.Item>

        {isCodeSent && (
          <Alert
            message={
              <Space>
                <CheckCircleOutlined />
                <Text strong>{formatMessage({ id: "forgotPassword.codeSentTo" })}</Text>
                <Text>{phone ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : ""}</Text>
              </Space>
            }
            description={formatMessage({ id: "forgotPassword.codeExpire" })}
            type="success"
            showIcon={false}
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        <Space style={{ width: "100%", marginBottom: 16 }}>
          <Button
            size="large"
            onClick={handleBack}
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              flex: 1,
            }}
          >
            {formatMessage({ id: "forgotPassword.backBtn" })}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitLoading}
            style={{
              height: 48,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              flex: 2,
            }}
          >
            {formatMessage({ id: "forgotPassword.confirmBtn" })}
          </Button>
        </Space>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatMessage({ id: "forgotPassword.codeSendViaSms" })}
          </Text>
        </div>
      </Form>
    </div>
  )

  return (
    <>
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#1890ff",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              {currentStep === 0 ? (
                <MailOutlined style={{ color: "white", fontSize: 24 }} />
              ) : (
                <PhoneOutlined style={{ color: "white", fontSize: 24 }} />
              )}
            </div>
            <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {currentStep === 0
                ? formatMessage({ id: "forgotPassword.title" })
                : formatMessage({ id: "forgotPassword.verifyPhoneTitle" })}
            </Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: "block" }}>
              {currentStep === 0
                ? formatMessage({ id: "forgotPassword.subTitle" })
                : formatMessage({ id: "forgotPassword.verifyPhoneSubTitle" })}
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
        {/* 步骤指示器 */}
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            {
              title: formatMessage({ id: "forgotPassword.step1Title" }),
            },
            {
              title: formatMessage({ id: "forgotPassword.step2Title" }),
            },
          ]}
        />

        {currentStep === 0 ? renderStepOne() : renderStepTwo()}
      </Modal>

      <ResetPasswordModal
        open={showResetPassword}
        onOpenChange={handleResetPasswordClose}
        account={account}
        verificationCode={verificationCode}
        phone={phone}
      />
    </>
  )
}

export default connect()(ForgotPasswordModal)
