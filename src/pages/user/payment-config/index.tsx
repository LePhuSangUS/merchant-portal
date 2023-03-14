import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Container, CustomUpload, FormField, PageLoading, Status, Button, Card, Col, Row } from '@/components';
import { getMerchantProfile, getPaymentPageConfig, sendApprovePaymentPageConfig } from '@/services/profile/api';
import ProForm, { ProFormField, ProFormSelect } from '@ant-design/pro-form';
import { parseOptions, translate } from '@/utils';
import { PAYMENT_PAGE_CONFIG_STATE } from '@/constants';
import ReactGPicker from 'react-gcolor-picker';
import styles from './index.less';
import PaymentGatewayIntegrate from "./PaymentGatewayIntegrate"
import defaultStore from '@/assets/defaultStore.png'
import paymentContent from '@/assets/formPaymentNew.png'
import langIco from '@/assets/languageViet.png'
import {logoWhiteHorizontal} from '@/assets'
import { shortString } from '@/utils/utils';
import { ProfileContext } from './PaymentGatewayIntegrate/context';
import { message } from "antd";
import { getDetailPGConfig, updateIPNForMerchantGw } from '@/services/pg-config/api';
import { env } from "@/env";
import RegisttrationSFTP from "./RegistrationSFTP"
const defaultColor = 'linear-gradient(90deg, rgb(89, 50, 204) 46.00%,rgb(156, 166, 185) 100.00%)'

const PaymentConfig = () => {
  const [form] = ProForm.useForm()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [formDetail, setFormDetail] = useState<any>({})
  const [bgColor, setBgColor] = useState<string>(defaultColor)
  const [merchantLogo, setMerchantLogo] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(false)
  const [merchantDetail, setMerchantDetail] = useState<any>({})
  const [pgConfig, setPGConfig] = useState<any>({});

  const handleChangeBGColor = (value: any) => {
    setBgColor(value)
    form.setFieldsValue({ bgColor: value })
  }

  const getPaymentGateway = async () => {
    const resp = await getDetailPGConfig();
    if (!resp?.success)
      message.error(resp?.message || translate('page.profile.message.payment.get.failed'));
    setPGConfig(resp?.data || {});
    return resp;
  }

  const getPaymentConfigDetail = async () => {
    setLoading(true)
    const resp = await getPaymentPageConfig()
    if (resp?.success) {
      setBgColor(resp?.data?.bgColor || defaultColor)
      setMerchantLogo(resp?.data?.logo || '')
      setFormDetail(resp?.data || {})
      setDisabled(resp?.data.state === 'PENDING')
    }
    const resp2 = await getMerchantProfile()
    if (resp2?.success)
      setMerchantDetail(resp2?.data || {})
    form.resetFields()
    setLoading(false)
  }

  useEffect(() => {
    getPaymentConfigDetail();
    getPaymentGateway();
  }, [])

  return (

    <Container className={styles.page}>
      <PageLoading active={isLoading} />
      <Row>
        <Col xs={24} md={24} lg={12}>
          <Card
            title={translate('Payment Page Setting')}
            extra={
              <Status
                value={formDetail?.state || 'INITIAL'}
                options={PAYMENT_PAGE_CONFIG_STATE}
              />
            }
            style={{ width: '100%' }}
          >
            <ProForm
              onFinish={async (data) => {
                setLoading(true)
                data.logo = merchantLogo
                if (_.isEqual(data, formDetail))
                  message.warning(translate('user.payment.config.unchanged.message'))
                else {
                  const resp = await sendApprovePaymentPageConfig(data)
                  if (!resp?.success)
                    message.error(resp?.message || translate('user.payment.config.failed.message'))
                  else {
                    message.success(translate('user.payment.config.success.message'))
                    getPaymentConfigDetail().then()
                  }
                }
                setLoading(false)
                return true
              }}
              form={form}
              initialValues={formDetail}
              submitter={{
                render: (props: any) => {
                  if (disabled) return null
                  return (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                      <Button
                        onClick={() => {
                          props.form?.resetFields()
                          setBgColor(defaultColor)
                        }}
                      >
                        {translate('form.button.reset')}
                      </Button>
                      {' '}
                      <Button
                        type="primary"
                        onClick={() => props.form?.submit()}
                      >
                        {translate('form.button.saveAndSubmit')}
                      </Button>
                    </div>
                  )
                }
              }}
            >
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <ProFormField
                    name="bgColor"
                    label={translate('user.payment.config.bgColor.label')}
                    valuePropName="value"
                    initialValue={defaultColor}
                    disabled={disabled}
                  >
                    <ReactGPicker
                      value={bgColor}
                      onChange={handleChangeBGColor}
                      gradient={true}
                      solid={false}
                    />
                  </ProFormField>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <FormField
                    name="logo"
                    label={translate('user.payment.config.logo.label')}
                    rules={[{ required: true, message: translate('user.payment.config.logo.required.message')}]}
                    disabled={disabled}
                  >
                    <CustomUpload
                      anonymous
                      single={true}
                      maxCount={1}
                      accept="image/png, image/jpeg, image/jpg"
                      acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                      onChange={(value: any) => {
                        setMerchantLogo(value)
                        form.setFieldsValue({ logo: value })
                      }}
                    />
                  </FormField>
                </Col>
              </Row>
              <ProFormSelect
                name="defaultLang"
                label={translate('user.payment.config.defaultLang.label')}
                placeholder={translate('user.payment.config.defaultLang.placeholder')}
                tooltip={translate('user.payment.config.defaultLang.tooltip')}
                options={
                  parseOptions([
                    {
                      value: 'vi',
                      label: {
                        vi: 'Tiếng Việt',
                        en: 'Vietnamese'
                      }
                    },
                    {
                      value: 'en',
                      label: {
                        vi: 'Tiếng Anh',
                        en: 'English'
                      }
                    }
                  ])
                }
                rules={[{ required: true, message: translate('user.payment.config.defaultLang.required.message') }]}
                disabled={disabled}
              />
            </ProForm>
          </Card>
        </Col>
        <Col xs={24} md={24} lg={12}>
          <Card
            title={translate('user.payment.config.preview.title')}
            style={{ width: '100%', height: '770px', overflow: 'hidden' }}
          >
            {/* <Empty /> */}
            <div
              className={styles.sumting}
              style={{ background: bgColor }}
            />
            <div
              className={styles.neoLogoGroup}
            
            >
            <img
              className={styles.neoLogo}
              src={logoWhiteHorizontal}
              alt=''
              />
              <span>  |  Cổng thanh toán</span>
            </div>
  
            <img
              className={styles.languageIco}
              src={langIco}
              alt=''
            />
            <div className={styles.paymentContent}>
              <div
                className={styles.logo}
              
              >
                <img
                src={
                  merchantLogo
                    ? `${env.FILE_API_URL}/img/${merchantLogo}`
                    : defaultStore
                }
                alt=''
              />
              </div>
              
              <span className={styles.storeName}>
                {shortString(merchantDetail?.name, 20, '...') || 'Store name'}
              </span>
              <img
                src={paymentContent}
                style={{ width: '100%' }}
                alt=''
              />
              <span
                className={styles.someLine1}
                style={{ background: bgColor }}
              />
              <span
                className={styles.someLine2}
                style={{ background: bgColor }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        
        {/* Thông tin tích hợp Payment Gateway */}
        <PaymentGatewayIntegrate />

        {/* Đăng ký nhận SFTP  */}
        <RegisttrationSFTP/>
      </Row>
    </Container>
      
  )
}

export default PaymentConfig
