import {
  Button,
  Cascader,
  Col,
  CustomUpload,
  FormAddress,
  FormCheckbox,
  FormItem,
  FormRadio,
  FormSelect,
  FormText,
  Icons,
  Link,
  PageLoading,
  Row,
  Space,
} from '@/components';
import { BUSINESS_TYPES, IDENTITY_GENDERS } from '@/constants';
import {
  getBusinessLines,
  userRegister,
  ocrAndCompareDocumentWithFace,
  checkEmailExisted
} from '@/services/user/api';

import ReCAPTCHA from "react-google-recaptcha";
import {formatPhoneNumber, formatTaxCode,removeSpace} from "@/utils/format"

import { message, parseOptions, parseValue, translate, validateEmail,getLanguageKey } from '@/utils';
import { checkEmailSpecialCharacter, checkMaxLength, checkMerchantName, checkMinLength, merchantNameRules, rejectOnlySpace, requiredField, requiredSelect, requiredUpload, requiredWithMessage, checkPhoneNumber,checkTaxCode } from '@/utils/rules';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { StepsForm } from '@ant-design/pro-form';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import CustomUploadEkyc from './components/CustomUploadEkyc';
import { Modal } from 'antd';
import { useRef } from 'react';
import _, { isEmpty } from 'lodash';
import EKycField from './components/EKycField';
import debounce from "debounce-promise";
import { getCurrentStep, getStepData, removeStepData, setStepData, setRegisterUUID, handleSubmitStep, removeAllStepData, setStep, getTrackedStep, setOcrData as storageOcrData, getOcrData, setOcrEdited, getOcrEdited } from './handler';
import { stringify } from 'querystring';
import { propertyEqual } from '@/utils/curry';
import moment from 'moment';
import { FormSelectResponsive } from '@/components/FormField';
import { env } from "@/env";

const { confirm } = Modal;

const { ArrowRightOutlined, ArrowLeftOutlined, CheckCircleOutlined } = Icons;

const PASS_EKYC_RATIO = 80;
const TRUST_EKYC_RATIO = 0.9;
const DOCUMENT_FIELDS = {
  ID: "id",
  NAME: "name",
  //================================
  ISSUE_DATE: "issue_date",
  RECENT_LOCATION: "recent_location",
  ISSUE_PLACE: "issue_place",
  BIRTH_DAY: "birth_day",
  GENDER: 'gender',
}
const IDENTITY_TYPES = {
  0: 'CMND',
  1: 'CCCD',
  5: 'CCCD',
}



const checkEmailExistedInput = debounce(async (email: string) => {
  const resp = await checkEmailExisted(email);
  if (resp.data.status) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}, 1000)


interface AccountRegister {
  history: Record<string, any>;
  location: Record<string, any>;
}

const AccountRegister: FC<AccountRegister> = ({ history, location, ...rest }) => {
  const stepOneFormRef = useRef<any>();
  const stepTwoFormRef = useRef<any>();
  const stepThreeFormRef = useRef<any>();
  const recaptchaRef = useRef<any>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [stepForm, setStepForm] = useState(1);
  const checkOtherLine = (code: string) => code === '00000';
  const [ocrData, setOcrData] = useState<any>(null);
  const merchantEmailRef = useRef('');
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const [second, setSecond] = useState<number>(5)
  const countdownRef = useRef<any>()
  const [isRedirect, setIsRedirect] = useState<boolean>(false)

  const dataStep1 = getStepData(1)
  const dataStep2 = getStepData(2)
  const dataStep3 = getStepData(3)

  const queryStep = location?.query?.step;
  const token = location?.query?.token;

  const tcConfigLink = {
    //Have token is so ban hang
    tcLink:token?'https://www.neox.vn/neox-dieu-khoa-su-dung-dich-vu-danh-cho-nha-ban-hang-tren-so-ban-hang/' : 'https://neox.vn/tnc-merchant',
    privacyLink:token?"https://neox.vn/neox-chinh-sach-bao-mat": 'https://neox.vn/neox-chinh-sach-bao-mat'
  }
  const handlePushStepUrl = (step: number | string) => {
    history.replace({
      pathname: '/user/register',
      search: stringify({ ...location?.query, step })
    })
  }

  useEffect(() => {
    setRegisterUUID()

    if (!queryStep) {
      const savedStep = getCurrentStep()
      const step = savedStep ? savedStep : 1
      setStepForm(step)
      handlePushStepUrl(step)
    } else {
      const savedStep = getCurrentStep()
      let step = savedStep || 1
      let currentStepData = {}
      while (isEmpty(currentStepData) && step > 0) {
        currentStepData = getStepData(step)
        step--
      }
      step++
      setStepForm(step)
      handlePushStepUrl(step)
    }

    // step 3
    const ocrDt = getOcrData()
    if (!ocrData && !isEmpty(ocrDt)) {
      setOcrData(ocrDt)
    }

    // businessType
    if (!dataStep1?.businessType)
      setStepData(1, { businessType: BUSINESS_TYPES?.[0]?.value })

    // submit tracking step
    const trackedStep = getTrackedStep()
    if (_.isEmpty(trackedStep)) {
      handleSubmitStep(0, null, location?.query)
    }

    getBusinessLinesList().then();
  }, [])

  useEffect(() => {
    if (ocrData && isEmpty(dataStep3)) {
      const initDataStep3 = {
        identityName: ocrData?.name,
        identityNumber: ocrData?.id,
        identityDob: ocrData?.birth_day,
        identityAddress: ocrData?.recent_location,
        gender: IDENTITY_GENDERS?.find(gender => (gender?.label?.vi === ocrData?.gender || gender?.label?.en === ocrData?.gender))?.value || ocrData?.gender,
        identityIssuedBy: ocrData?.issue_place,
        identityIssuedDate: ocrData?.issue_date,
        identityType: IDENTITY_TYPES[ocrData?.type_id]
      }
      setStepData(3, initDataStep3)
      stepThreeFormRef?.current?.setFieldsValue({
        ...initDataStep3,
        identityDob: parseVNDateStrToMoment(initDataStep3?.identityDob),
        identityIssuedDate: parseVNDateStrToMoment(initDataStep3?.identityIssuedDate),
      })
    }

    if (ocrData) {
      storageOcrData(ocrData)
    }
  }, [ocrData])

  const handleSetStepForm = (step: number) => {
    if (step < queryStep) {
      removeStepData(queryStep)
    }

    setTimeout(() => {
      handlePushStepUrl(step)
    }, 0)
    setStep(step)
    setStepForm(step)
  }


  const getBusinessLinesList = async () => {
    const list: any = [];
    const resp = await getBusinessLines();
    if (resp?.success && resp?.data?.length) {
      resp.data.forEach((i: any) => {
        if (i?.level === 2 || checkOtherLine(i?.code)) {
          list.push({
            value: i?.code,
            label: parseValue(i?.name),
          });
        }
      });
    }
    setBusinessLines(resp.data);
    return list;
  };


  const parseVNDateStrToMoment = (date: string) => {
    if (!date) return null
    const [d, m, y] = date?.split('/')
    return moment([y, +m - 1, d]).format('YYYY-MM-DD')
  }


  const formSubmit = async (formData: any) => {
    setLoading(true);

    const data = { ...dataStep1, ...formData, ...getStepData(3) }

    const params = {
      ...data,
      businessLine: data?.businessLine?.pop(),
      token: location?.query?.token,
      returnUrl: location?.query?.returnUrl,
      merchantPhone:removeSpace(data?.merchantPhone)
    }

    const resp = await userRegister(params);
    if (!resp?.success)
      message.error(resp?.message || translate('user.register.message.submit.failed'));
    else {
      handleSubmitStep(3, getStepData(3), location?.query)
      removeAllStepData()
      setSuccess(true);
      handleReturnRedirect()
    }
    setLoading(false);
  };

  const checkCheckBox = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error(translate('form.message.aprrovetc.required')));
    }
    return Promise.resolve();
  };



  const returnUrl = location?.query?.returnUrl || location?.query?.returnURL || location?.query?.redirect

  const handleReturnRedirect = () => {
    if (returnUrl) {
      setIsRedirect(true)
    }
  }

  useEffect(() => {
    if (isRedirect) {
      countdownRef.current = setInterval(() => {
        setSecond(t => t - 1)
      }, 1000)
    }

    return () => {
      clearInterval(countdownRef.current)
    }
  }, [isRedirect])

  useEffect(() => {
    if (second === 0) {
      clearInterval(countdownRef.current)
      window.location.href = returnUrl
    }
  }, [second])


  const checkInfoTrust = (probs: any) => {
    if (_.isArray(probs)) {
      return probs.every((item: any) => item > TRUST_EKYC_RATIO)
    } else if (_.isNumber(probs)) {
      return probs >= TRUST_EKYC_RATIO
    }
    return false;
  }

  const getDataOcrField = (textDetect: string, probs: any, documentField?: string) => {
    let convertedProb: any = [];
    if (_.isArray(probs)) {
      convertedProb = _.cloneDeep(probs)
    } else if (_.isString(probs)) {
      convertedProb = _.cloneDeep(probs?.replace(/\[|\]/g, '')?.split(','))
    }
    else if (_.isNumber(probs)) {
      convertedProb = probs;
    }
    switch (documentField) {
      case DOCUMENT_FIELDS?.ID:
      case DOCUMENT_FIELDS.NAME:
      case DOCUMENT_FIELDS.ISSUE_DATE:
      case DOCUMENT_FIELDS.RECENT_LOCATION:
      case DOCUMENT_FIELDS.BIRTH_DAY:
      case DOCUMENT_FIELDS.GENDER:
      case DOCUMENT_FIELDS.ISSUE_PLACE: {
        return {
          content: textDetect,
          trust: checkInfoTrust(convertedProb)
        };
      }
      default:
        return {
          content: '',
          trust: false
        };

    }
  };

  const renderBackToLogin = () => token ? <span></span> : (
    <Link to="/user/login" className="home-btn">
      {translate('user.register.button.backLogin')}
    </Link>
  )

  // handle business line
  const businessLineList = useMemo(() => {
    const compareLevel = propertyEqual('level')
    const businessLineLevel_1 = businessLines?.filter(compareLevel(1))
    const businessLineLevel_2 = businessLines?.filter(compareLevel(2))

    return businessLineLevel_1?.map(parentItem => {
      const children = parseOptions(businessLineLevel_2?.filter(propertyEqual('parentId', parentItem?._id)), 'code', 'name')
      return ({
        value: parentItem?.code,
        label: parseValue(parentItem?.name),
        ..._.isEmpty(children) ? {} : {children}
      })
    })
  }, [businessLines])

  return (
    <div className={styles.container}>
      <PageLoading active={isLoading} />
      {isSuccess ? (
        <div className="success-msg">
          <CheckCircleOutlined
            style={{
              color: '#389e0d',
              fontSize: "40px"
            }}
          />
          <p className={styles.titleSuccess}>{translate("user.register.update.send.success")}</p>
          <p className='success-msg--desc'>{translate('user.register.text.success')}</p>
          {
            isRedirect &&
            <p className=''>
              {translate('user.register.message.redirect', `Bạn sẽ được chuyển hướng trong ${second} giây.`, { second })}
            </p>
          }
          <Link to="/user/login">{translate('user.register.text.backLogin')}</Link>
        </div>
      ) : (
        <div className="wrapper">
          <StepsForm
            onFinish={formSubmit}
            containerStyle={{
              width: '100%',
              minWidth: '0',
              maxWidth: '100%',
            }}
            formProps={{
              style: { maxWidth: '100%' },
            }}
            stepsProps={{
              style: { maxWidth: '100%' },
              className: 'steps-props-responsive'
            }}
            current={stepForm - 1}
            submitter={{
              render: (props) => {
                const step = props?.step;
                const { form } = props || {};
                const { getFieldsValue }: any = form || {};

                switch (step) {
                  case 0:
                    return (
                      <div className="btn-wrap">
                        {renderBackToLogin()}
                        <Button
                          type="primary"
                          onClick={() => {
                            form?.validateFields().then((result) => {
                              form?.submit();
                              handleSetStepForm(2);
                              handleSubmitStep(1, getStepData(1), location?.query)
                            });
                          }}
                          icon={<ArrowRightOutlined />}
                          size="large"
                          className="next-btn"
                        >
                          {translate('user.register.button.next')}
                        </Button>
                      </div>
                    );
                  case 1:
                    return (
                      <>
                        <Row align="end">
                          <div className='recapcha-container'>
                            {
                              showRecaptcha && <ReCAPTCHA
                                ref={recaptchaRef}
                                datatype="image"
                                sitekey={env.SITE_KEY}
                                hl={"vi"}
                              />
                            }
                          </div>
                          <div className="btn-wrap">
                            {renderBackToLogin()}
                            <Space>
                              <Button
                                key="pre"
                                onClick={() => {
                                  const { img_front, img_back, img_face } = getFieldsValue(true) || {}

                                  if (img_face || img_back || img_front) {
                                    confirm({
                                      title: translate('user.register.title.warning'),
                                      icon: <ExclamationCircleOutlined />,
                                      className: styles.modalConfirmEkyc,
                                      content: (
                                        <div style={{
                                          textAlign: "center"
                                        }}>                                          <p>
                                            {translate('user.register.message.resetRegister_1')}
                                          </p>
                                          <p>
                                            {translate('user.register.message.resetRegister_2')}
                                          </p>
                                        </div>
                                      ),
                                      onOk: () => {
                                        form?.resetFields();
                                        handleSetStepForm(1);
                                        setShowRecaptcha(false)

                                      },
                                      okText: translate('form.button.agree'),
                                      cancelText: translate('form.button.cancel'),
                                    });
                                  }

                                  else {
                                    handleSetStepForm(1);
                                    setShowRecaptcha(false)
                                  }

                                }}
                                icon={<ArrowLeftOutlined />}
                              >
                                {translate('user.register.button.previous')}
                              </Button>
                              <Button
                                type="primary"
                                onClick={async () => {
                                  const { img_front, img_back, img_face } = getFieldsValue(true) || {}
                                  form
                                    ?.validateFields()
                                    .then(async (result) => {
                                      const recaptchaToken = recaptchaRef?.current?.getValue();

                                      if (recaptchaToken) {
                                        setLoading(true);
                                        const data = await ocrAndCompareDocumentWithFace({
                                          img_front,
                                          img_face,
                                          img_back,
                                          client_session: 'ANDROID_Redmi8_28_Device_3.2.0_99f4a80aecc90a37_1657513805028_vn.com.neopay.app.dev',
                                          token: '8928skjhfa89298jahga1771vbvb',
                                          recaptchaToken,
                                          emailRegistration: merchantEmailRef?.current || dataStep1?.merchantEmail,
                                          validate_postcode: false,
                                          crop_param: '1,1',
                                          challenge_code: 11111
                                        });
                                        setLoading(false);
                                        const faceCompareResult = data?.compareResult?.object;
                                        const ocrResult = data?.orcResult?.object;
                                        if (
                                          faceCompareResult &&
                                          ocrResult &&
                                          faceCompareResult?.prob >= PASS_EKYC_RATIO
                                        ) {
                                          setOcrData(ocrResult);
                                          handleSetStepForm(3);
                                          handleSubmitStep(2, getStepData(2), location?.query)
                                        } else {
                                          confirm({
                                            title: translate('user.register.title.notification'),
                                            icon: <ExclamationCircleOutlined />,
                                            className: styles.modalConfirmEkyc,
                                            content: (
                                              <div style={{
                                                textAlign: "center"
                                              }}>
                                                <p>
                                                  {translate('user.register.message.kycInvalid_1')}
                                                </p>
                                                <p>
                                                  {translate('user.register.message.kycInvalid_2')}
                                                </p>
                                              </div>
                                            ),
                                            onOk: () => {
                                              form?.resetFields();
                                              setShowRecaptcha(false)

                                            },
                                            okText: translate('user.register.button.backUpload'),
                                            cancelButtonProps: {
                                              style: {
                                                display: 'none',
                                              },
                                            },
                                          });
                                        }
                                      } else {
                                        setShowRecaptcha(true);
                                      }
                                    }
                                    )
                                }
                                }

                                icon={<ArrowRightOutlined />}
                                size="large"
                                className="next-btn"
                              >
                                {translate('user.register.button.next')}
                              </Button>
                            </Space>
                          </div>
                        </Row>
                      </>

                    );
                  case 2:
                    return (
                      <div className="btn-wrap">
                        {renderBackToLogin()}
                        <Space>
                          <Button
                            key="pre"
                            onClick={() => {

                              stepTwoFormRef?.current?.resetFields();
                              handleSetStepForm(2);
                              setShowRecaptcha(false)
                            }}
                            icon={<ArrowLeftOutlined />}
                          >
                            {translate('user.register.button.previous')}
                          </Button>
                          <Button
                            type="primary"
                            key="goToTree"
                            onClick={() => props.onSubmit?.()}
                            icon={<CheckCircleOutlined />}
                            size="large"
                          >
                            {translate('user.register.button.register')}
                          </Button>
                        </Space>
                      </div>
                    );
                }
                return null;
              },
            }}
            stepsFormRender={(dom, submitter) => {
              return (
                <div>
                  <div>{dom}</div>
                  <div>{submitter}</div>
                </div>
              );
            }}
          >
            {/* Thông tin kinh doanh */}
            <StepsForm.StepForm
              name="BusinessInformationForm"
              title={translate('user.register.title.businessInfo')}
              formRef={stepOneFormRef}
              onValuesChange={(value) => {
                setStepData(queryStep, value)
              }}
              initialValues={dataStep1}
            >
              <FormItem
                noStyle
                shouldUpdate={(prevVal: any, currVal: any) =>
                  prevVal?.businessLine !== currVal?.businessLine ||
                  prevVal?.businessType !== currVal?.businessType
                }
                className={styles?.businessInformationForm}
              >
                {({ getFieldValue, setFieldsValue, getFieldError }: any) => {

                  const isCorporation = getFieldValue('businessType') === BUSINESS_TYPES?.[1]?.value

                  return (
                    <Row gutter={15}>
                      <Col span={24} className={styles?.businessType}>
                        <FormRadio.Group
                          name="businessType"
                          initialValue={BUSINESS_TYPES?.[0]?.value}
                          options={parseOptions(BUSINESS_TYPES || [])}
                          label={translate('user.register.field.businessType')}
                          rules={[
                            { required: true, message: translate('form.message.select.required') },
                          ]}
                          // @ts-ignore
                          onChange={() => {
                            if (getFieldValue('businessLicense')) {
                              setFieldsValue({
                                businessLicense: null,
                              });
                            }
                          }}
                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormText
                          name="merchantEmail"
                          label={translate('user.register.field.email')}
                          placeholder={translate('user.register.placeholder.email')}
                          extra={translate('user.register.extra.email')}
                          fieldProps={{
                            size: 'large',
                            onChange: (e) => {
                              const value = e?.target?.value?.trim();
                              merchantEmailRef.current = value;
                            },
                          }}
                          rules={[
                            { required: true, message: translate('form.message.email.required') },
                            {
                              pattern: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\D-]{2,10}$/),
                              message: translate('user.register.message.email.invalid_2'),
                            },
                            checkMaxLength(250),
                            checkEmailSpecialCharacter,
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const email = value?.trim();
                                if(/([.]{2})/.test(email)) {
                                  return Promise.reject(translate("user.register.message.email.invalid_2"));
                                }

                                if (email && validateEmail(email)) {
                                  return new Promise((resolve: any, reject: any) => {
                                    checkEmailExistedInput(email)?.then((response: any) => {
                                      if (response) {
                                        return reject(translate("user.register.message.email.existed"));
                                      } else {
                                        return resolve();
                                      }
                                    })
                                  })
                                }
                                return Promise.resolve();

                              }
                            })

                          ]}
                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormText
                          name="merchantPhone"
                          label={translate('user.register.field.phone')}
                          placeholder={translate('user.register.placeholder.phone')}
                          extra={translate('user.register.extra.phone')}
                          fieldProps={{
                            size: 'large',
                          }}
                          normalize={formatPhoneNumber}
                          rules={checkPhoneNumber()}

                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormAddress
                          responsive
                          required
                          size="large"
                          name="merchantAddress"
                          label={translate('user.register.field.merchantAddress')}
                          onChange={(obj) => {
                            setStepData(queryStep, { merchantAddress: obj })
                          }}
                          initialValue={dataStep1?.merchantAddress}
                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormText
                          name="merchantName"
                          label={translate('user.register.field.merchantName')}
                          placeholder={translate('user.register.placeholder.merchantName')}
                          fieldProps={{
                            size: 'large',
                          }}
                          rules={merchantNameRules()}
                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormItem
                          name="businessLine"
                          label={translate('user.register.field.businessLine')}
                          rules={[requiredWithMessage(translate('register.message.businessLine.required'))]}
                        >
                          <Cascader
                            options={businessLineList}
                            placeholder={translate('user.register.placeholder.businessLine')}
                            size='large'
                          />
                        </FormItem>
                      </Col>
                      {getFieldValue('businessLine')?.[0] === '00000' ? (
                        <Col xs={24} md={12}>
                          <FormText
                            name="otherBusinessLine"
                            label={translate('user.register.field.otherBusinessLine')}
                            placeholder={translate('user.register.placeholder.otherBusinessLine')}
                            fieldProps={{
                              size: 'large',
                            }}
                            rules={[
                              { required: true, message: translate('form.message.field.required') },
                              { max: 256, message: translate('form.message.field.length') },
                            ]}
                          />
                        </Col>
                      ) : null}
                      {isCorporation ? (
                        <>
                          <Col xs={24} md={12}>
                            <FormText
                              name="taxNo"
                              label={translate('user.register.field.taxNo')}
                              placeholder={translate('user.register.placeholder.taxNo')}
                              fieldProps={{
                                size: 'large',
                              }}
                              rules={checkTaxCode()}
                            />
                          </Col>
                          <Col span={24}>
                            <FormItem shouldUpdate>
                              {({ getFieldError }: any) => (
                                <FormItem
                                  name={'businessLicense'}
                                  label={translate('user.register.field.businessLicense')}
                                  extra={translate('user.register.extra.businessLicense')}
                                  rules={[
                                    {
                                      required: true,
                                      message: translate('form.message.upload.required'),
                                    },
                                  ]}
                                >
                                  <CustomUpload
                                    anonymous
                                    acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                    maxSize={1}
                                    maxCount={20}
                                    multiple
                                    error={getFieldError('businessLicense')}
                                  />
                                </FormItem>
                              )}
                            </FormItem>
                          </Col>
                        </>
                      ) : null}
                      <Col span={24}>
                        <div>{translate('user.register.text.tcStart')} <a target='_blank' href={tcConfigLink?.tcLink}><strong>{translate('user.register.text.tcText')}</strong></a> {translate('user.register.text.and')} <a target='_blank' href={tcConfigLink?.privacyLink}><strong>{translate('user.register.text.privacyText')}</strong></a></div>
                      </Col>
                    </Row>
                  )
                }}
              </FormItem>
            </StepsForm.StepForm>

            {/* Thông tin người đại điện */}
            <StepsForm.StepForm
              name="AgentInformationForm"
              title={translate('Representative information')}
              formRef={stepTwoFormRef}
              onValuesChange={(value) => {
                setStepData(queryStep, value)
              }}
              initialValues={dataStep2}
            >
              <FormItem
                noStyle
                shouldUpdate={(prevVal: any, currVal: any) =>
                  prevVal?.identityType !== currVal?.identityType ||
                  prevVal?.identityIssuedDate !== currVal?.identityIssuedDate
                }
              >
                {({ getFieldValue, getFieldError, setFieldsValue }: any) => (
                  <>
                    <Row gutter={15} className={styles?.showOneError}>
                      <Col xs={24} md={12}>
                        <FormItem shouldUpdate>
                          {({ getFieldError }: any) => (
                            <FormItem
                              name="img_front"
                              label={translate('user.register.field.frontIdentity')}
                              rules={[
                                {
                                  required: true,
                                  message: translate('form.message.upload.required'),
                                },
                              ]}
                            >
                              <CustomUploadEkyc
                                anonymous
                                single
                                acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                maxSize={10}
                                maxCount={1}
                                error={getFieldError('img_front')}
                                uploadApi={`${env.UPLOAD_FILE_E_KYC_URL}/addFile`}
                                onAfterChange={(data) => {
                                  setStepData(queryStep, { data_front: data })
                                }}
                                onCaptureChange={(hash: string) => {
                                  setStepData(queryStep, {img_front: hash})
                                  setFieldsValue({ img_front: hash })
                                }}
                                initUrl={dataStep2?.data_front ? `${env.FILE_API_URL}/img/${dataStep2?.data_front?.fileName}.${dataStep2?.data_front?.fileType}` : ''}
                              />
                            </FormItem>
                          )}
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12}>
                        <FormItem shouldUpdate>
                          {({ getFieldError }: any) => (
                            <FormItem
                              name="img_back"
                              label={translate('user.register.field.backIdentity')}
                              rules={[
                                {
                                  required: true,
                                  message: translate('form.message.upload.required'),
                                },
                              ]}
                            >
                              <CustomUploadEkyc
                                anonymous
                                single
                                acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                maxSize={10}
                                maxCount={1}
                                error={getFieldError('img_back')}
                                uploadApi={`${env.UPLOAD_FILE_E_KYC_URL}/addFile`}
                                onAfterChange={(data) => {
                                  setStepData(queryStep, { data_back: data })
                                }}
                                onCaptureChange={(hash: string) => {
                                  setStepData(queryStep, {img_back: hash})
                                  setFieldsValue({ img_back: hash })
                                }}
                                initUrl={dataStep2?.data_back ? `${env.FILE_API_URL}/img/${dataStep2?.data_back?.fileName}.${dataStep2?.data_back?.fileType}` : ''}
                              />
                            </FormItem>
                          )}
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12}>
                        <FormItem shouldUpdate>
                          {({ getFieldError }: any) => (
                            <FormItem
                              name="img_face"
                              label={translate('user.register.field.avatar')}
                              rules={[
                                {
                                  required: true,
                                  message: translate('form.message.upload.required'),
                                },
                              ]}
                            >
                              <CustomUploadEkyc
                                anonymous
                                single
                                acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                maxSize={10}
                                maxCount={1}
                                error={getFieldError('img_face')}
                                uploadApi={`${env.UPLOAD_FILE_E_KYC_URL}/addFile`}
                                onAfterChange={(data) => {
                                  setStepData(queryStep, { data_face: data })
                                }}
                                onCaptureChange={(hash: string) => {
                                  setStepData(queryStep, {img_face: hash})
                                  setFieldsValue({ img_face: hash })
                                }}
                                initUrl={dataStep2?.data_face ? `${env.FILE_API_URL}/img/${dataStep2?.data_face?.fileName}.${dataStep2?.data_face?.fileType}` : ''}
                              />
                            </FormItem>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </>
                )}
              </FormItem>
            </StepsForm.StepForm>
            {/* Kiểm tra thông tin */}
            <StepsForm.StepForm
              name="CheckInformationForm"
              title={translate('user.register.title.checkInfo')}
              formRef={stepThreeFormRef}
              onValuesChange={(value) => {
                setStepData(queryStep, value)
                setOcrEdited({ ...getOcrEdited(), ...value })
              }}
              initialValues={{
                identityName: dataStep3?.identityName,
                identityNumber: dataStep3?.identityNumber,
                identityDob: parseVNDateStrToMoment(dataStep3?.identityDob),
                identityAddress: dataStep3?.identityAddress,
                gender: dataStep3?.gender,
                identityIssuedBy: dataStep3?.identityIssuedBy,
                identityIssuedDate: parseVNDateStrToMoment(dataStep3?.identityIssuedDate),
              }}
            >
              <FormItem
                noStyle
                shouldUpdate
              >
                {({ getFieldValue, getFieldError, setFieldsValue }: any) => (
                  <>
                    <Row gutter={15}>

                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='text'
                            name="identityName"
                            isEdited={getOcrEdited()?.['identityName']??false}
                            label={translate('user.register.field.identityName')}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                            getDataField={() => getDataOcrField(ocrData?.name, ocrData?.name_probs, DOCUMENT_FIELDS.NAME)}
                            normalize={(text: string) =>  text?.toUpperCase()}
                            rules={[requiredField, checkMaxLength(50)]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='text'
                            name="identityNumber"
                            isEdited={getOcrEdited()?.['identityNumber']??false}
                            label={translate('user.register.field.identityNumber')}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                            getDataField={() => getDataOcrField(ocrData?.id, ocrData?.id_probs, DOCUMENT_FIELDS.ID)}
                            rules={[requiredField, checkMinLength(8), checkMaxLength(20)]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='date'
                            name="identityDob"
                            isEdited={getOcrEdited()?.['identityDob']??false}
                            label={translate('user.register.field.identityDob')}
                            placeholder={translate('form.placeholder.pleaseSelect')}
                            getDataField={() => getDataOcrField(ocrData?.birth_day, ocrData?.birth_day_prob, DOCUMENT_FIELDS.BIRTH_DAY)}
                            rules={[requiredSelect]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='text'
                            name="identityAddress"
                            isEdited={getOcrEdited()?.['identityAddress']??false}
                            label={translate('user.register.field.identityAddress')}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                            getDataField={() => getDataOcrField(ocrData?.recent_location, ocrData?.recent_location_prob, DOCUMENT_FIELDS.RECENT_LOCATION)}
                            rules={[requiredField, rejectOnlySpace, checkMaxLength(250)]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='select'
                            name="gender"
                            isEdited={getOcrEdited()?.['gender']??false}
                            label={translate('user.register.field.identityGender')}
                            placeholder={translate('form.placeholder.pleaseSelect')}
                            getDataField={() => getDataOcrField(ocrData?.gender, ocrData?.gender_prob , DOCUMENT_FIELDS.GENDER)}
                            options={parseOptions(IDENTITY_GENDERS || [])}
                            fieldProps={{
                              size: 'large',
                            }}
                            rules={[
                              { required: true, message: translate('form.message.gender.required') },
                              {
                                validator(_: any, value: any) {
                                    return value === '-'
                                        ? Promise.reject(new Error(translate('form.message.select.required')))
                                        : Promise.resolve();
                                },
                              }
                            ]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='text'
                            name="identityIssuedBy"
                            isEdited={getOcrEdited()?.['identityIssuedBy']??false}
                            label={translate('user.register.field.identityIssuedBy')}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                            getDataField={() => getDataOcrField(ocrData?.issue_place, ocrData?.issue_place_prob, DOCUMENT_FIELDS.ISSUE_PLACE)}
                            rules={[requiredField, rejectOnlySpace, checkMaxLength(250)]}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <EKycField
                            setFieldsValue={setFieldsValue}
                            type='date'
                            name="identityIssuedDate"
                            isEdited={getOcrEdited()?.['identityIssuedDate']??false}
                            label={translate('user.register.field.identityIssuedAt')}
                            placeholder={translate('form.placeholder.pleaseSelect')}
                            getDataField={() => getDataOcrField(ocrData?.issue_date, ocrData?.issue_date_prob, DOCUMENT_FIELDS.ISSUE_DATE)}
                            rules={[requiredSelect]}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </FormItem>
            </StepsForm.StepForm>
          </StepsForm>
        </div>
      )}
    </div>
  );
};

export default AccountRegister;
