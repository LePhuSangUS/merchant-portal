import React, { useEffect, useState } from 'react';
import { StepsForm } from "@ant-design/pro-form";
import { Button, FormText, Space, Icons, FormField } from "@/components";
import { checkWalletPhone, genOTPLinkWallet, linkNotExistWallet, verifyOTPLinkWallet } from '@/services/profile/api';
import { format, translate, clearStorage } from "@/utils";
import { history } from "umi";
import QRCode from 'qrcode.react';
import { connect } from 'dva'

const {
  ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined,
  CheckOutlined, WalletOutlined, InfoCircleOutlined, WarningOutlined
} = Icons;

const walletTypes = [
  'WALLET_NOT_EXIST',
  'WALLET_STILL_NOT_REGISTER_KYC',
  'WALLET_WAITING_APPROVE_KYC',
  'WALLET_APPROVED_KYC',
  'WALLET_LINK_TO_OTHER_MERCHANT',
  'WALLET_SENT_REQUEST_CREATE_MERCHANT',
  'WALLET_KYC_NOT_MATCH_MERCHANT_VERIFIED_INFO'
]

// Ví không tồn tại
const isNotExist = (type: string) => type === walletTypes[0]

// Ví chưa KYC
const isNotKYC = (type: string) => type === walletTypes[1]

// Ví chờ duyệt KYC
const isPending = (type: string) => type === walletTypes[2]

// Ví đã KYC
const isCompleted = (type: string) => type === walletTypes[3]

// Ví đã liên kết tài khoản khác
const isLinked = (type: string) => type === walletTypes[4]

// Ví có yêu cầu tạo merchant
const isRequest = (type: string) => type === walletTypes[5]

// Ví không trùng khớp thông tin
const isNotMatch = (type: string) => type === walletTypes[6]

// Những ví đã tồn tại có thể liên kết
const existedCanLink = (type: string) => type === walletTypes[1] || type === walletTypes[3]

type PageProps = {
  merchant?: any;
  defaultStep?: number;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  countdownTime?: number;
  countdownOtp?: number;
  onLoading?: (loading: boolean) => void;
  dispatch?: (action: any) => void;
}

const LinkWalletModal: React.FC<PageProps> = (
  {
    merchant,
    defaultStep = 0,
    onSubmit,
    onCancel,
    onLoading,
    countdownTime = 60,
    countdownOtp = 3,
    dispatch
  }
) => {
  const [walletItem, setWalletItem] = useState<any>(null)
  const [currStep, setCurrStep] = useState<number>(defaultStep)
  const [countdown, setCountdown] = useState<any>(null)
  const [second, setSecond] = useState<number>(countdownTime)
  const [otpMsg, setOtpMsg] = useState<string>('')
  const [otpCount, setOtpCount] = useState<number>(countdownOtp)

  console.log('LinkWalletModal')

  const handleCountdown = () => {
    const interval: any = setInterval(() => {
      setSecond((s: number) => s - 1)
    }, 1000)
    setCountdown(interval)
  }

  useEffect(() => {
    if (second <= 0)
      clearInterval(countdown)
  }, [second])

  const resetAllSteps = () => {
    setWalletItem(null)
    setCurrStep(defaultStep)
    setSecond(countdownTime)
    setOtpCount(countdownOtp)
    setOtpMsg('')
  }

  const onStepChange = (step: number) => {
    setCurrStep(step || 0)
  }

  const goNextStep = () => {
    setCurrStep((step: any) => step + 1)
  }

  const walletNext = async () => {
    goNextStep()
    return false
  }

  const walletSubmit = async (formData?: any) => {
    onSubmit?.(formData)
    clearInterval(countdown)
    resetAllSteps()
    return true
  }

  const walletCancel = async () => {
    if (onCancel) return onCancel()
    return false
  }

  const restartCountdown = () => {
    clearInterval(countdown)
    setSecond(countdownTime)
    handleCountdown()
  }

  useEffect(() => {
    resetAllSteps()
    const notifyListener = (resp: any) => {
      if (resp?.actionType === 'MERCHANT_LINK_WALLET') {
        setWalletItem((item: any) => ({
          ...item,
          phone: resp?.data?.phone || item?.phone,
          success: !!resp?.data?.result
        }))
        goNextStep()
      }
    }
    window.socket?.on('notify', notifyListener)
    return () => {
      clearInterval(countdown)
      resetAllSteps()
      window.socket?.off('notify', notifyListener)
    }
  }, [])

  const verifyWalletPhone = async (data: any) => {
    if (!data?.phone) return false
    onLoading?.(true)
    const resp = await checkWalletPhone({ phone: data.phone })
    setWalletItem({
      phone: data.phone,
      type: resp?.data?.noticeCode,
      qrCode: resp?.data?.qrCode,
      success: true
    })
    onLoading?.(false)
    return goNextStep()
  }

  const generateOtp = async () => {
    onLoading?.(true)
    const resp = await genOTPLinkWallet({ phone: walletItem.phone })
    if (!resp?.success) {
      setWalletItem((i: any) => ({ ...i, success: false }))
      setOtpMsg(resp?.message || translate('balance.message.genOtp.failed'))
    } else restartCountdown()
    onLoading?.(false)
    return resp
  }

  const createWalletApprove = async () => {
    if (otpCount <= 0) return
    const resp = await generateOtp()
    if (resp?.success) {
      goNextStep()
      clearInterval(countdown)
      setOtpCount(countdownOtp)
      return true
    }
    return false
  }

  // props.step == 1
  const renderStep2 = () => {
    // Chưa có ví
    if (isNotExist(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='NotExistApproval'
          onFinish={createWalletApprove}
        >
          <div className='msg'>
            <p>
              {translate('balance.message.notExist.notice')}
            </p>
            <p>
              <WalletOutlined className='icon' />
            </p>
            <p>
              {translate('balance.message.notExist.notice2')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Chưa KYC
    if (isNotKYC(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='NotKycApproval'
          onFinish={walletNext}
        >
          <div className='msg'>
            <div>
              <QRCode
                style={{margin: 'auto'}}
                value={walletItem?.qrCode || "-"}
                size={200}
              />
            </div>
            <p>
              {translate('balance.message.qrCode.notice')}
            </p>
            <p>
              {translate('balance.message.qrCode.notice2')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Đã duyệt KYC
    if (isCompleted(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='CompleteKycApproval'
          onFinish={walletNext}
        >
          <div className='msg'>
            <div>
              <QRCode
                style={{margin: 'auto'}}
                value={walletItem?.qrCode ||"-"}
                size={200}
              />
            </div>
            <p>
              {translate('balance.message.qrCode.notice')}
            </p>
            <p>
              {translate('balance.message.qrCode.notice3')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Đang chờ duyệt KYC
    if (isPending(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='PendingKycNotice'
          onFinish={walletCancel}
        >
          <div className='msg'>
            <p>
              <b>
                {translate('balance.message.error.notice')}
              </b>
            </p>
            <p>
              <InfoCircleOutlined className='icon' />
            </p>
            <p>
              {translate('balance.message.kycPending.notice')}
            </p>
            <p>
              {translate('balance.message.kycPending.notice2')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Đã liên kết tài khoản khác
    if (isLinked(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='WalletLinkedNotice'
          onFinish={walletCancel}
        >
          <div className='msg'>
            <p>
              <b>
                {translate('balance.message.error.notice')}
              </b>
            </p>
            <p>
              <WarningOutlined className='icon' />
            </p>
            <p>
              {translate('balance.message.linkComplete.notice')}
            </p>
            <p>
              {translate('balance.message.support.notice')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Ví có yêu cầu tạo merchant
    if (isRequest(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='WalletHasRequestNotice'
          onFinish={walletCancel}
        >
          <div className='msg'>
            <p>
              <b>
                {translate('balance.message.error.notice')}
              </b>
            </p>
            <p>
              <WarningOutlined className='icon' />
            </p>
            <p>
              {translate('balance.message.requesting.notice')}
            </p>
            <p>
              {translate('balance.message.support.notice')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    // Thông tin không trùng khớp
    if (isNotMatch(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='WalletNotMatchNotice'
          onFinish={walletCancel}
        >
          <div className='msg'>
            <p>
              <b>
                {translate('balance.message.error.notice')}
              </b>
            </p>
            <p>
              <WarningOutlined className='icon' />
            </p>
            <p>
              {translate('balance.message.notMatch.notice')}
            </p>
            <p>
              {translate('balance.message.support.notice')}
            </p>
          </div>
        </StepsForm.StepForm>
      )
    }
    return (
      <StepsForm.StepForm
        name='WalletFailedNotice'
        onFinish={walletCancel}
      >
        <div className='msg'>
          <p>
            <b>
              {translate('balance.message.error.notice')}
            </b>
          </p>
          <p>
            <WarningOutlined className='icon' />
          </p>
          <p>
            {translate('balance.message.failed.notice')}
          </p>
          <p>
            {translate('balance.message.tryAgainLater')}
          </p>
        </div>
      </StepsForm.StepForm>
    )
  }

  const verifyOtpSubmit = async (data: any) => {
    if (!data?.otp) return false
    setOtpMsg('')
    onLoading?.(true)
    const resp = await verifyOTPLinkWallet({ otp: data.otp, phone: walletItem?.phone })
    if (!resp?.success || !resp?.data || !resp?.data?.result) {
      const count = countdownOtp - (resp?.data?.wrongTimes || 0)
      if (count > 0) {
        setOtpMsg(
          translate(
            'balance.message.otp.countTime',
            'Mã xác thực không chính xác\nBạn còn {count} lần xác thực',
            { count }
          )
        )
      }
      else {
        if (dispatch) dispatch({ type: 'login/logout' })
        return false
      }
      setOtpCount(count)
      onLoading?.(false)
      return false
    }
    const regResp: any = await linkNotExistWallet({
      merchantId: merchant?.merchantId,
      phone: walletItem?.phone,
      otp: data.otp
    })
    setWalletItem((prevItem: any) => (
      {
        ...prevItem,
        success: !!regResp?.success && !!regResp?.data
      }
    ))
    onLoading?.(false)
    goNextStep()
    return true
  }

  // props.step == 2
  const renderStep3 = () => {
    // Chưa có ví
    if (isNotExist(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='NotExistVerifyOtp'
          onFinish={verifyOtpSubmit}
          onValuesChange={() => otpMsg && setOtpMsg('')}
        >
          <div className='msg'>
            <p>
              <b style={{ fontSize: '1.1em' }}>
                {translate('balance.message.opt.notice')}
              </b>
            </p>
            <p>
              {translate('balance.message.opt.notice2')}
              <span className='phone-number'>
                {format.phone(walletItem?.phone)}
              </span>
            </p>
            <p style={{ marginTop: '1em', fontSize: '.9em' }}>
              <i>
                {translate(
                  'balance.message.otp.warning',
                  '(*): Tài khoản của bạn sẽ bị khóa nếu nhập sai {count} lần',
                  { count: countdownOtp })
                }
              </i>
            </p>
            <div className='otp-wrap'>
              <FormField
                name='otp'
                disabled={otpCount < 1 || !walletItem?.success}
                placeholder={translate('balance.field.otp')}
                rules={[{ required: true, message: translate('balance.field.otp.required') }]}
                fieldProps={{ className: 'input-wrap' }}
              />
            </div>
            {
              otpMsg && (
                <div className='otp-msg'>
                  {`${otpMsg}`}
                </div>
              )
            }
            {
              otpCount ? (
                <div className='otp-btn'>
                  <Button
                    type='link'
                    onClick={generateOtp}
                    disabled={second > 0}
                  >
                    {translate('balance.button.resendOtp')}
                    {`${second > 0 ? ` (${second})` : ''}`}
                  </Button>
                </div>
              ) : null
            }
          </div>
        </StepsForm.StepForm>
      )
    }
    // Chưa KYC
    if (isNotKYC(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='NotKycLinkResult'
          onFinish={walletSubmit}
        >
          {
            walletItem?.success ? (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.success.notice')}
                  </b>
                </p>
                <p>
                  {translate(
                    'balance.message.linked.notice',
                    'Bạn vừa liên kết ví thành công',
                    { phone: format.phone(walletItem?.phone) || walletItem?.phone }
                  )}
                </p>
                <p>
                  <CheckCircleOutlined className='icon' />
                </p>
              </div>
            ) : (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.error.notice')}
                  </b>
                </p>
                <p>
                  <InfoCircleOutlined className='icon' />
                </p>
                <p>
                  {translate('balance.message.error.notice2')}
                </p>
                <p>
                  {translate('balance.message.tryAgainLater')}
                </p>
              </div>
            )
          }
        </StepsForm.StepForm>
      )
    }
    // Đã duyệt KYC
    if (isCompleted(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='CompleteKycLinkResult'
          onFinish={walletSubmit}
        >
          {
            walletItem?.success ? (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.success.notice')}
                  </b>
                </p>
                <p>
                  {translate(
                    'balance.message.linked.notice',
                    'Bạn vừa liên kết ví thành công',
                    { phone: format.phone(walletItem?.phone) || walletItem?.phone }
                  )}
                </p>
                <p>
                  <CheckCircleOutlined className='icon' />
                </p>
              </div>
            ) : (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.error.notice')}
                  </b>
                </p>
                <p>
                  <InfoCircleOutlined className='icon' />
                </p>
                <p>
                  {translate('balance.message.error.notice2')}
                </p>
                <p>
                  {translate('balance.message.tryAgainLater')}
                </p>
              </div>
            )
          }
        </StepsForm.StepForm>
      )
    }
    return null
  }

  // props.step == 3
  const renderStep4 = () => {
    // Chưa có ví
    if (isNotExist(walletItem?.type)) {
      return (
        <StepsForm.StepForm
          name='NotExistLinkResult'
          onFinish={walletSubmit}
        >
          {
            walletItem?.success ? (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.success.notice')}
                  </b>
                </p>
                <p>
                  {translate(
                    'balance.message.linked.notice',
                    'Bạn vừa liên kết ví thành công',
                    { phone: format.phone(walletItem?.phone) || walletItem?.phone }
                  )}
                </p>
                <p>
                  <CheckCircleOutlined className='icon' />
                </p>
                <p>
                  <i>
                    {translate('balance.message.continue.notice')}
                  </i>
                </p>
              </div>
            ) : (
              <div className='msg'>
                <p>
                  <b>
                    {translate('balance.message.error.notice')}
                  </b>
                </p>
                <p>
                  <InfoCircleOutlined className='icon' />
                </p>
                <p>
                  {translate('balance.message.error.notice2')}
                </p>
                <p>
                  {translate('balance.message.tryAgainLater')}
                </p>
              </div>
            )
          }
        </StepsForm.StepForm>
      )
    }
    return null
  }

  return (
    <StepsForm
      current={currStep}
      onCurrentChange={onStepChange}
      containerStyle={{
        width: '100%',
        minWidth: 0,
        maxWidth: '100%'
      }}
      formProps={{
        className: 'wallet-form'
      }}
      stepsProps={{
        style: { maxWidth: '100%' }
      }}
      submitter={{
        render: (props: any) => {
          // step 1
          if (props.step === 0) {
            return (
              <Button
                type='primary'
                onClick={() => props.onSubmit?.()}
                icon={<ArrowRightOutlined />}
              >
                {translate('form.button.next')}
              </Button>
            )
          }
          // step 2
          if (props.step == 1) {
            // Chưa có ví
            if (isNotExist(walletItem?.type)) {
              return (
                <Space>
                  <Button
                    onClick={() => props.onPre?.()}
                    icon={<ArrowLeftOutlined />}
                  >
                    {translate('form.button.back')}
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => props.onSubmit?.()}
                    icon={<ArrowRightOutlined />}
                  >
                    {translate('form.button.next')}
                  </Button>
                </Space>
              )
            }
            // Có thể link
            if (existedCanLink(walletItem?.type)) {
              return (
                <Button
                  onClick={() => props.onPre?.()}
                  icon={<ArrowLeftOutlined />}
                >
                  {translate('form.button.back')}
                </Button>
              )
            }
            // Không thể link
            return (
              <Button
                type='primary'
                onClick={() => onSubmit?.(walletItem?.type)}
                icon={<CheckOutlined />}
              >
                {translate('form.button.understood')}
              </Button>
            )
          }
          // step 3
          if (props.step == 2) {
            return (
              <Space>
                { // Chưa có ví
                  isNotExist(walletItem?.type) && (
                    <Button
                      type='primary'
                      onClick={() => (
                        otpCount
                        && walletItem?.success
                          ? props.onSubmit?.()
                          : onCancel?.()
                      )}
                      icon={(
                        otpCount
                        && walletItem?.success
                          ? <ArrowRightOutlined />
                          : <CheckOutlined />
                      )}
                    >
                      {
                        otpCount
                        && walletItem?.success
                          ? translate('form.button.next')
                          : translate('form.button.understood')
                      }
                    </Button>
                  )
                }
                { // Ví đã tồn tại có thể liên kết
                  existedCanLink(walletItem?.type) && (
                    <Button
                      type='primary'
                      onClick={() => (
                        walletItem?.success
                          ? props.onSubmit?.()
                          : onCancel?.()
                      )}
                      icon={<CheckOutlined />}
                    >
                      {
                        walletItem?.success
                          ? translate('form.button.close')
                          : translate('form.button.understood')
                      }
                    </Button>
                  )
                }
              </Space>
            )
          }
          // step 4
          if (props.step == 3) {
            return (
              <Space>
                { // Chưa có ví
                  isNotExist(walletItem?.type) && (
                    <Button
                      type='primary'
                      onClick={() => (
                        walletItem?.success
                          ? props.onSubmit?.()
                          : onCancel?.()
                      )}
                      icon={<CheckOutlined />}
                    >
                      {translate('form.button.understood')}
                    </Button>
                  )
                }
              </Space>
            )
          }
          return null
        }
      }}
      stepsFormRender={(dom: any, submitter: any) => (
        <>
          <div className='content-wrap'>
            {dom}
          </div>
          <div className='btn-wrap'>
            {submitter}
          </div>
        </>
      )}
      stepsRender={() => null}
    >
      <StepsForm.StepForm
        name='VerifyWalletPhone'
        onFinish={verifyWalletPhone}
      >
        <FormText
          name='phone'
          placeholder={translate('balance.field.linkingPhone')}
          formItemProps={{ className: 'phone-wrap' }}
          fieldProps={{ className: 'input-wrap' }}
          rules={[
            {
              required: true,
              message: translate('balance.field.linkingPhone.required')
            },
            {
              pattern: new RegExp('^(0[1-9])+([0-9]{8})$'),
              message: translate('user.register.message.phone.invalid')
            }
          ]}
        />
      </StepsForm.StepForm>

      {renderStep2()}

      {renderStep3()}

      {renderStep4()}
    </StepsForm>
  )
}

export default connect()(LinkWalletModal)
