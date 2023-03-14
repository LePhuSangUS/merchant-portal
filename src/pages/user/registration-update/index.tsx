import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import { StepsForm } from '@ant-design/pro-form';
import { PageLoading, Row, Col, Button, Link, FormItem, FormText, FormRadio, FormSelect,
  Space, CustomUpload, Icons, FormField, FormDatePicker, FormAddress, Cascader } from '@/components';
import type { ProFormInstance } from '@ant-design/pro-form';
import { message, translate, parseOptions, parseValue, validateEmail } from '@/utils';
import { BUSINESS_TYPES, IDENTITY_TYPES, IDENTITY_GENDERS } from '@/constants';
import { checkEmailExisted, getBusinessLines, getUserRegister, updateRegister } from '@/services/user/api';
import styles from './index.less';
import { checkEmailSpecialCharacter, checkMaxLength, merchantNameRules, requiredWithMessage,checkPhoneNumber,checkTaxCode  } from '@/utils/rules';
import debounce from 'debounce-promise';
import { propertyEqual } from '@/utils/curry';
import _ from 'lodash';
import {formatPhoneNumber,removeSpace} from "@/utils/format"

const { ArrowRightOutlined, ArrowLeftOutlined, CheckOutlined } = Icons;
const FORMAT_DATE_SUBMIT = 'YYYY-MM-DD'
const FORMAT_DATE_DISPLAY = 'DD/MM/YYYY'
interface PageProps {
  match: any,
  history: any,
  location: any,
}

const checkEmailExistedInput = debounce(async (email: string) => {
  const resp = await checkEmailExisted(email);
  if (resp.data.status) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}, 1000)

const RegistrationUpdate: React.FC<PageProps> = ({ match, history, location }) => {
  const { id } = match.params;
  const businessForm = useRef<ProFormInstance>();
  const accountForm = useRef<ProFormInstance>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [isValid, setValid] = useState<boolean|undefined>(undefined);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [reCheckFields, setReCheckFields] = useState<any[]>([]);
  const [second, setSecond] = useState<number>(10);
  const [countdown, setCountdown] = useState<any>(null);
  const [identityDob, setIdentityDob] = useState<Moment|null>();
  const [identityIssuedAt, setIdentityIssuedAt] = useState<Moment|null>();
  const [identityValidDate, setIdentityValidDate] = useState<Moment|null>();
  const [businessLineInitValue, setBusinessLineInitValue] = useState<string[]>();


  const checkOtherLine = (code: string) => code === '00000';

  const getBusinessLinesList = async () => {
    const list: any[] = [];
    const resp = await getBusinessLines();
    if (resp?.success && resp?.data?.length) {
      resp.data.forEach((i: any) => {
        if (i?.level === 2 || checkOtherLine(i?.code)) {
          list.push({
            value: i?.code,
            label: parseValue(i?.name),
          })
        }
      })
    }
    setBusinessLines(resp.data);
    return false;
  }

  const handleCountdown = () => {
    const interval = setInterval(() => {
      setSecond(s => s - 1);
    }, 1000);
    setCountdown(interval);
  }

  const getRegistrationDetail = async (regId: string) => {
    setLoading(true)
    const resp = await getUserRegister(regId);
    setLoading(false)
    if (!resp?.success) {
      setValid(false);
      handleCountdown();
    } else {
      setValid(true);
      setReCheckFields(resp?.data?.reCheckFields || []);
      setDetailItem(resp?.data || {});
      setIdentityDob(resp?.data?.identityDob ? moment(resp?.data?.identityDob) : null);
      setIdentityIssuedAt(resp?.data?.identityIssuedAt ? moment(resp?.data?.identityIssuedAt) : null);
      setIdentityValidDate(resp?.data?.identityValidDate ? moment(resp?.data?.identityValidDate) : null);
    }
  }

  useEffect(() => {
    getBusinessLinesList().then()
  }, [])

  useEffect(() => {
    getRegistrationDetail(id).then()
  }, [id])

  useEffect(() => {
    if (second <= 0) {
      clearInterval(countdown);
      history.push('/user/login');
    }
  }, [second])

  useEffect(() => {
    businessForm?.current?.resetFields();
    accountForm?.current?.resetFields();
  }, [detailItem])

  const formSubmit = async (formData: any) => {
    setLoading(true);
    formData = {
      ...formData,
      identityDob: identityDob?.format(FORMAT_DATE_SUBMIT),
      identityIssuedAt: identityIssuedAt?.format(FORMAT_DATE_SUBMIT),
      identityValidDate: identityValidDate?.format(FORMAT_DATE_SUBMIT),
      taxNo: formData?.taxNo?.trim(),
      businessLine: formData?.businessLine?.pop(),
      merchantPhone:removeSpace(formData?.merchantPhone)

    }
    const params: any = { _id: formData?._id };
    if (reCheckFields?.length) {
      reCheckFields.forEach((field: any) => {
        params[field] = formData?.[field] || ''
        if (field === 'businessLine' && checkOtherLine(formData?.[field])) {
          params.otherBusinessLine = formData?.otherBusinessLine || ''
        }
      })
    }
    const resp = await updateRegister(params);
    if (!resp?.success)
      message.error(resp?.message || translate('user.register.message.update.failed'));
    else setSuccess(true);
    setLoading(false);
    return false;
  }

  const checkDisabledField = (name: string) => {
    if (!name || !reCheckFields?.length)
      return true;
    return !reCheckFields?.includes(name)
  }

  const validateIdentityImg = (_: any, val: any, maxCount: number) => {
    if (!val) return Promise.reject(new Error(translate('form.message.upload.required')));
    if (maxCount > 0 && val?.length !== maxCount)
      return Promise.reject(translate('form.message.upload.length.mismatch'));
    return Promise.resolve();
  }

  // handle business line
  const businessLineList = useMemo(() => {
    const compareLevel = propertyEqual('level')
    const businessLineLevel_1 = businessLines?.filter(compareLevel(1))
    const businessLineLevel_2 = businessLines?.filter(compareLevel(2))

    // handle get init value for business line
    if(detailItem?.businessLine) {
      const blObject = businessLines?.find(propertyEqual('code', detailItem?.businessLine)) || {}
      if(Number(blObject?.level) === 1) {
        setBusinessLineInitValue([`${blObject?.code}`])
      }
      if(Number(blObject?.level) === 2) {
        const parentObject = businessLineLevel_1?.find(propertyEqual('_id', blObject?.parentId))
        setBusinessLineInitValue([`${parentObject?.code}`, `${blObject?.code}`])
      }
    }

    return businessLineLevel_1?.map(parentItem => {
      const children = parseOptions(businessLineLevel_2?.filter(propertyEqual('parentId', parentItem?._id)), 'code', 'name')
      return ({
        value: parentItem?.code,
        label: parseValue(parentItem?.name),
        ..._.isEmpty(children) ? {} : {children}
      })
    })
  }, [businessLines, detailItem])

  return (
    <div className={styles.container}>
      <PageLoading active={isLoading} />
      {
        isValid !== undefined && (
          <Fragment>
            {
              !isValid ? (
                <div className='msg-wrapper invalid'>
                  {translate(
                    'form.message.verifyToken.invalid',
                    'Link bị lỗi hoặc đã hết hạn.\nTự động về trang đăng nhập sau {second}s',
                    { second }
                  )}
                </div>
              ) : (
                isSuccess ? (
                  <div className='msg-wrapper'>
                    <p style={{ whiteSpace: 'pre' }}>
                      {translate('user.register.update.text.success')}
                    </p>
                    <Link to='/user/login'>
                      {translate('user.register.text.backLogin')}
                    </Link>
                  </div>
                ) : (
                  <div className='wrapper'>
                    {
                      businessLineInitValue !== undefined &&
                    <StepsForm
                      onFinish={formSubmit}
                      containerStyle={{
                        width: '100%',
                        minWidth: '0',
                        maxWidth: '100%'
                      }}
                      formProps={{
                        style: { maxWidth: '100%' }
                      }}
                      stepsProps={{
                        style: { maxWidth: '100%' },
                      }}
                      submitter={{
                        render: (props) => (
                          props.step === 0 ? (
                            <div className='btn-wrap'>
                              <Link to='/user/login' className='home-btn'>
                                {translate('user.register.button.backLogin')}
                              </Link>
                              <Button
                                type="primary"
                                onClick={() => props.onSubmit?.()}
                                icon={<ArrowRightOutlined />}
                              >
                                {translate('user.register.button.next')}
                              </Button>
                            </div>
                          ) : (
                            <div className='btn-wrap'>
                              <Link to='/user/login'>
                                {translate('user.register.button.backLogin')}
                              </Link>
                              <Space>
                                <Button
                                  key="pre"
                                  onClick={() => props.onPre?.()}
                                  icon={<ArrowLeftOutlined />}
                                >
                                  {translate('user.register.button.previous')}
                                </Button>
                                <Button
                                  type="primary"
                                  key="goToTree"
                                  onClick={() => props.onSubmit?.()}
                                  icon={<CheckOutlined />}
                                >
                                  {translate('user.register.button.update')}
                                </Button>
                              </Space>
                            </div>
                          )
                        )
                      }}
                      stepsFormRender={(dom, submitter) => {
                        return (
                          <div>
                            <div>
                              {dom}
                            </div>
                            <div className='note-wrapper'>
                              {`(*) ${translate('user.register.text.note')}: ${(/\s/.test(detailItem?.note) ? `\n${detailItem?.note}` : detailItem?.note) || '-'}`}
                            </div>
                            <div>
                              {submitter}
                            </div>
                          </div>
                        )
                      }}
                    >
                      {/* Thông tin kinh doanh */}
                      <StepsForm.StepForm
                        formRef={businessForm}
                        name='BusinessInformationForm'
                        title={translate('user.register.title.businessInfo')}
                        initialValues={{
                          ...detailItem,
                          ...detailItem?.businessLine ? { businessLine: businessLineInitValue } : {},
                           merchantPhone: formatPhoneNumber(detailItem?.merchantPhone)
                        }}
                      >
                        <FormItem
                          noStyle
                          shouldUpdate={
                            (prevVal: any, currVal: any) => (
                              prevVal?.businessLine !== currVal?.businessLine
                              || prevVal?.businessType !== currVal?.businessType
                            )
                          }
                        >
                          {
                            ({ getFieldValue }: any) => {
                              const isCorporation = getFieldValue('businessType') === BUSINESS_TYPES?.[1]?.value
                              return (
                                <Row gutter={15}>
                                  <Col span={24}>
                                    <FormField
                                      hidden
                                      disabled
                                      name='_id'
                                    />
                                  </Col>
                                  <Col span={24}>
                                    <FormRadio.Group
                                      disabled={checkDisabledField('businessType')}
                                      readonly={checkDisabledField('businessType')}
                                      name='businessType'
                                      options={parseOptions(BUSINESS_TYPES || [])}
                                      label={translate('user.register.field.businessType')}
                                      rules={[{ required: true, message: translate('form.message.select.required') }]}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormText
                                      name='merchantEmail'
                                      disabled={checkDisabledField('merchantEmail')}
                                      label={translate('user.register.field.email')}
                                      placeholder={translate('user.register.placeholder.email')}
                                      extra={translate('user.register.extra.email')}
                                      rules={[
                                        { required: true, message: translate('form.message.field.required') },
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
                                            
                                            if (email && email != detailItem?.merchantEmail && validateEmail(email)) {
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
                                      name='merchantPhone'
                                      disabled={checkDisabledField('merchantPhone')}
                                      label={translate('user.register.field.phone')}
                                      placeholder={translate('user.register.placeholder.phone')}
                                      extra={translate('user.register.extra.phone')}
                                      normalize={formatPhoneNumber}
                                      rules={checkPhoneNumber()}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormAddress
                                      required
                                      name='merchantAddress'
                                      disabled={checkDisabledField('merchantAddress')}
                                      label={translate('user.register.field.merchantAddress')}
                                      initialValue={detailItem?.merchantAddress}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormText
                                      name='merchantName'
                                      disabled={checkDisabledField('merchantName')}
                                      label={translate('user.register.field.merchantName')}
                                      placeholder={translate('user.register.placeholder.merchantName')}
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
                                        disabled={checkDisabledField('businessLine')}
                                      />
                                    </FormItem>
                                  </Col>
                                  {
                                    checkOtherLine(getFieldValue('businessLine')) ? (
                                      <Col xs={24} md={12}>
                                        <FormText
                                          name='otherBusinessLine'
                                          disabled={checkDisabledField('businessLine')}
                                          label={translate('user.register.field.otherBusinessLine')}
                                          placeholder={translate('user.register.placeholder.otherBusinessLine')}
                                          rules={[
                                            { required: true, message: translate('form.message.field.required') },
                                            { max: 256, message: translate('form.message.field.length') },
                                          ]}
                                        />
                                      </Col>
                                    ) : null
                                  }
                                  {
                                    isCorporation ? (
                                      <Fragment>
                                        <Col xs={24} md={12}>
                                          <FormText
                                            name='taxNo'
                                            disabled={checkDisabledField('taxNo')}
                                            label={translate('user.register.field.taxNo')}
                                            placeholder={translate('user.register.placeholder.taxNo')}
                                            rules={checkTaxCode()}
                                          />
                                        </Col>
                                        <Col span={24}>
                                          <FormField
                                            name='businessLicense'
                                            disabled={checkDisabledField('businessLicense')}
                                            label={translate('user.register.field.businessLicense')}
                                            extra={translate('user.register.extra.businessLicense')}
                                            rules={[
                                              {
                                                required: true,
                                                message: translate('form.message.upload.required')
                                              }
                                            ]}
                                          >
                                            <CustomUpload
                                              anonymous
                                              maxCount={20}
                                              accept="image/png, image/jpeg, image/jpg"
                                              maxSize={2}
                                            />
                                          </FormField>
                                        </Col>
                                      </Fragment>
                                    ) : null
                                  }
                                </Row>
                              )
                            }
                          }
                        </FormItem>
                      </StepsForm.StepForm>
  
                      {/* Thông tin tài khoản */}
                      <StepsForm.StepForm
                        formRef={accountForm}
                        name='AccountInformationForm'
                        title={translate('Representative information')}
                        initialValues={detailItem || {}}
                      >
                        <FormItem
                          noStyle
                          shouldUpdate={
                            (prevVal: any, currVal: any) => (
                              prevVal?.identityType !== currVal?.identityType
                              || prevVal?.identityIssuedAt !== currVal?.identityIssuedAt
                            )
                          }
                        >
                          {
                            ({ getFieldValue }: any) => (
                              <>
  
                                <Row gutter={15}>
                                  <Col xs={24} md={12}>
                                    <FormSelect
                                      disabled
                                      readonly
                                      name='identityType'
                                      label={translate('user.register.field.identityType')}
                                      placeholder={translate('user.register.placeholder.identityType')}
                                      options={parseOptions(IDENTITY_TYPES || [])}
                                      rules={[{ required: true, message: translate('form.message.select.required') }]}
                                    />
                                  </Col>
                                </Row>
                                <Row gutter={15}>
                                  <Col xs={24} md={12}>
                                    <FormField
                                      name='identityImg'
                                      className='hidden-drag-area'
                                      disabled={checkDisabledField('identityImg')}
                                      rules={[
                                        {
                                          validator: (_: any, val: any) => (
                                            validateIdentityImg(_, val, getFieldValue('identityType') === 'PASSPORT' ? 1 : 2)
                                          )
                                        }
                                      ]}
                                    >
                                      <CustomUpload
                                        anonymous
                                        maxCount={getFieldValue('identityType') === 'PASSPORT' ? 1 : 2}
                                        accept="image/png, image/jpeg, image/jpg"
                                        maxSize={2}
                                      />
                                    </FormField>
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormField
                                      name='avatar'
                                      className='hidden-drag-area'
                                      disabled={checkDisabledField('avatar')}
                                      // label={translate('user.register.field.avatar')}
                                      rules={[{ required: true, message: translate('form.message.upload.required') }]}
                                    >
                                      <CustomUpload
                                        anonymous
                                        single
                                        maxCount={1}
                                        accept="image/png, image/jpeg, image/jpg"
                                        maxSize={2}
                                      />
                                    </FormField>
                                  </Col>
                                </Row>
                                <Row gutter={15}>
                                  <Col xs={24} md={12}>
                                    <FormText
                                      name='identityName'
                                      disabled={checkDisabledField('identityName')}
                                      label={translate('user.register.field.identityName')}
                                      placeholder={translate('user.register.placeholder.identityName')}
                                      rules={[
                                        { required: true, message: translate('form.message.field.required') },
                                        checkMaxLength(50)
                                      ]}
                                      normalize={(value) => value.toUpperCase()}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormText
                                      name='identityNumber'
                                      disabled={checkDisabledField('identityNumber')}
                                      label={translate('user.register.field.identityNumber_new')}
                                      placeholder={translate('user.register.placeholder.identityNumber')}
                                      rules={[
                                        { required: true, message: translate('form.message.field.required') },
                                        {
                                          pattern: new RegExp('^[a-zA-Z0-9]{8,20}$'),
                                          message: translate('user.register.message.identityNumber.invalid'),
                                        }
                                      ]}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormDatePicker
                                      name='identityDob'
                                      disabled={checkDisabledField('identityDob')}
                                      label={translate('user.register.field.identityDob')}
                                      placeholder={translate('user.register.placeholder.identityDob')}
                                      rules={[{ required: true, message: translate('form.message.select.required') }]}
                                      fieldProps={{
                                        onChange: value => setIdentityDob(value),
                                        format: FORMAT_DATE_DISPLAY,
                                        disabledDate: (date: any) => moment(date).isAfter(moment())
                                      }}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    {
                                      // Nếu là PASSPORT thì có nơi sinh
                                      // CMND + CCCD có nơi đăng ký HKTT
                                      getFieldValue('identityType') === 'PASSPORT' ? (
                                        <FormText
                                          name='identityPob'
                                          disabled={checkDisabledField('identityPob')}
                                          label={translate('user.register.field.identityPob')}
                                          placeholder={translate('user.register.placeholder.identityPob')}
                                          rules={[
                                            { required: true, message: translate('form.message.field.required') },
                                            checkMaxLength(250)
                                          ]}
                                        />
                                      ) : (
                                        <FormAddress
                                          required
                                          noSelect
                                          name='identityAddress'
                                          disabled={checkDisabledField('identityAddress')}
                                          label={translate('user.register.field.identityAddress')}
                                          initialValue={detailItem?.identityAddress}
                                        />
                                      )
                                    }
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormSelect
                                      name='identityGender'
                                      disabled={checkDisabledField('identityGender')}
                                      label={translate('user.register.field.identityGender')}
                                      placeholder={translate('user.register.placeholder.identityGender')}
                                      options={parseOptions(IDENTITY_GENDERS || [])}
                                      rules={[{ required: true, message: translate('form.message.select.required') }]}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormText
                                      name='identityIssuedBy'
                                      disabled={checkDisabledField('identityIssuedBy')}
                                      label={translate('user.register.field.identityIssuedBy')}
                                      placeholder={translate('user.register.placeholder.identityIssuedBy')}
                                      rules={[
                                        { required: true, message: translate('form.message.field.required') },
                                        checkMaxLength(250)
                                      ]}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <FormDatePicker
                                      name='identityIssuedAt'
                                      disabled={checkDisabledField('identityIssuedAt')}
                                      label={translate('user.register.field.identityIssuedAt')}
                                      placeholder={translate('user.register.placeholder.identityIssuedAt')}
                                      rules={[{ required: true, message: translate('form.message.select.required') }]}
                                      fieldProps={{
                                        onChange: value => setIdentityIssuedAt(value),
                                        format: FORMAT_DATE_DISPLAY,
                                        disabledDate: (date: any) => moment(date).isAfter(moment())
                                      }}
                                    />
                                  </Col>
                                  {
                                    // Nếu là PASSPORT thì có ngày hiệu lực
                                    getFieldValue('identityType') === 'PASSPORT' ? (
                                      <Col xs={24} md={12}>
                                        <FormDatePicker
                                          name='identityValidDate'
                                          disabled={!getFieldValue('identityIssuedAt') || checkDisabledField('identityValidDate')}
                                          label={translate('user.register.field.identityValidDate')}
                                          placeholder={translate('user.register.placeholder.identityValidDate')}
                                          rules={[{ required: true, message: translate('form.message.select.required') }]}
                                          fieldProps={{
                                            onChange: value => setIdentityValidDate(value),
                                            format: FORMAT_DATE_DISPLAY,
                                            disabledDate: (date: any) => (
                                              !!getFieldValue('identityIssuedAt')
                                              && moment(date).isBefore(getFieldValue('identityIssuedAt'), 'second')
                                            )
                                          }}
                                        />
                                      </Col>
                                    ) : null
                                  }
                                </Row>
                              </>
                            )
                          }
                        </FormItem>
                      </StepsForm.StepForm>
                    </StepsForm>
                    }
                  </div>
                )
              )
            }
          </Fragment>
        )
      }
    </div>
  );
};

export default RegistrationUpdate;
