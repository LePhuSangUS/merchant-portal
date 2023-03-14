import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { PageLoading, Row, Col, Icons, ProTable, FormText, Card, FormCheckbox,
  FormList, FormField, Tooltip, FormItem, Button, Popconfirm } from '@/components';
import { merchantStoreUserList, createUserInStore, updateUserInStore,
  removeUserInStore, changeUserPassword } from '@/services/merchantstore/api';
import { message, notification, parseValue, translate, checkPasswordPolicy, renderField } from '@/utils';
import { renderChannels, renderStatus, renderTimes } from '@/pages/store';
import { ModalForm, ProFormTimePicker } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { getPasswordPolicy } from '@/services/user/api';
import styles from './../style.less';
import { checkEmailSpecialCharacter } from '@/utils/rules';

const FORMAT_TIME = 'HH:mm:ss'
const PASSWORD_DEFAULT_APP = '123456'
const PASSWORD_DEFAULT_WEB = 'Admin@123'
const {
  EditOutlined, CloseCircleOutlined,
  DeleteOutlined, QuestionCircleOutlined,
  LockOutlined, MobileOutlined, UserOutlined,
  PlusOutlined
} = Icons

interface PageProps {
  id: string | number
}

const UsersTab: React.FC<PageProps> = ({ id }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isResetPwd, setIsResetPwd] = useState<boolean>(false)
  const [pwdPolicy, setPwdPolicy] = useState<any>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [passwordItem, setPasswordItem] = useState<any>(null)
  const [reloadTable, setReloadTable] = useState<boolean>(false)

  useEffect(() => {
    getPasswordPolicy()
      .then((resp: any) => setPwdPolicy(resp?.data))
  }, [])

  const toggleReload = () => setReloadTable(!reloadTable)

  const validateMobilePassword = (_: any, value: any) => {
    if (value) {
      const pwdRegex = new RegExp('^([0-9]{6})$')
      if (!pwdRegex.test(value))
        return Promise.reject(new Error(translate('userStore.message.appPassword.invalid')))
    }
    return Promise.resolve()
  }

  const validatePortalPassword = (_: any, value: any) => {
    if (value && pwdPolicy) {
      const checkPwd = checkPasswordPolicy(pwdPolicy, value)
      if (!checkPwd?.valid)
        return Promise.reject(new Error(parseValue(checkPwd?.messages?.[0])))
    }
    return Promise.resolve()
  }

  const validateWorkingTime = (_: any, value: any) => {
    if (!value || !value?.length) return Promise.resolve()
    const startTime = moment(value?.[0]).format( 'HH:mm:ss')
    const endTime = moment(value?.[1]).format( 'HH:mm:ss')
    if (startTime === endTime)
      return Promise.reject(new Error(translate('userStore.message.workingTime.compare')))
    return Promise.resolve()
  }

  const getUsersList = async (params: any, options: any) => {
    const resp = await merchantStoreUserList(params, options, id)
    if (!resp?.success)
      notification.error(resp?.message || translate('userStore.message.list.failed'))
    return resp
  }

  const createToggle = () => {
    setEditItem({
      workingTimes: [{ timeRange: [] }]
    })
    setIsEdit(true)
  }

  const editToggle = async (row?: any) => {
    if (!row) {
      setEditItem(null)
    } else {
      const workingTimes = (
        row?.workingTimes?.length
          ? row.workingTimes.map((i: any) => (
            { timeRange: [moment(i?.startTime || '', FORMAT_TIME), moment(i?.endTime || '', FORMAT_TIME)] }
          )) : [{ timeRange: [] }]
      )
      setEditItem({
        ...row,
        workingTimes,
        isMobile: !!row?.userMobileRef,
        isPortal: !!row?.userPortalRef,
        passwordForApp: !!row?.userMobileRef ? PASSWORD_DEFAULT_APP : '',
        passwordForWeb: !!row?.userPortalRef ? PASSWORD_DEFAULT_WEB : ''
      })
    }
    setIsEdit(true)
  }

  const editCancel = () => {
    setIsEdit(false)
    setEditItem(null)
  }

  const parseWorkingTime = (timeRange: any[], formatType: string) => {
    if(!timeRange?.length) return []
    const range: any = []
    timeRange.forEach((i: any) => {
      if (Object.keys(i).length) {
        range.push ({
          startTime: moment(i?.timeRange?.[0] || '').format(formatType),
          endTime: moment(i?.timeRange?.[1] || '').format(formatType)
        })
      }
    })
    return range
  }

  const parseWorkChannel = (isApp: boolean, isWeb: boolean) => {
    const channels: any[] = []
    if (isApp) channels.push('APP')
    if (isWeb) channels.push('WEB')
    return channels
  }

  const editSubmit = async (formData: any) => {
    if (!id) return {}
    setLoading(true)
    let resp: any
    formData.workingTimes = parseWorkingTime(formData?.workingTimes, FORMAT_TIME)
    formData.channelWorks = parseWorkChannel(formData?.isMobile, formData?.isPortal)
    delete formData?.isMobile
    delete formData?.isPortal

    if (formData?._id) {
      // edit submit
      formData.cashierId = formData._id
      if (!!editItem?.userMobileRef) delete formData?.passwordForApp
      if (!!editItem?.userPortalRef) delete formData?.passwordForWeb
      resp = await updateUserInStore(formData)
      if (!resp?.success)
        notification.error(resp?.message || translate('userStore.message.update.failed'))
      else {
        message.success(translate('userStore.message.update.success'))
        toggleReload()
      }
    } else {
      // create submit
      formData.storeId = id
      resp = await createUserInStore(formData)
      if (!resp?.success)
        notification.error(resp?.message || translate('userStore.message.create.failed'))
      else {
        message.success(translate('userStore.message.create.success'))
        toggleReload()
      }
    }
    setIsEdit(false)
    setLoading(false)
    setEditItem(null)
    return resp
  }

  const passwordToggle = (row: any) => {
    setPasswordItem(row)
    setIsResetPwd(true)
  }

  const passwordCancel = () => {
    setIsResetPwd(false)
    setPasswordItem(null)
  }

  const passwordSubmit = async (formData: any) => {
    if (!formData) return
    setLoading(true)
    const resp = await changeUserPassword(formData)
    if (resp?.success)
      message.success(translate('userStore.message.password.success'))
    else notification.error(translate(resp?.message || translate('userStore.message.password.failed')))
    setIsResetPwd(false)
    setPasswordItem(null)
    setLoading(false)
  }

  const deleteSubmit = async (row: any) => {
    if (!row) return
    setLoading(true)
    const formData = {
      storeId: row?.storeId,
      cashierId: row?._id
    }
    const resp = await removeUserInStore(formData)
    if (resp?.success) {
      message.success(translate('userStore.message.delete.success'))
      toggleReload()
    } else notification.error(resp?.message || translate('userStore.message.delete.success'))
    setLoading(false)
  }

  const userColumns: ProColumns[] = [
    {
      title: translate('merchantStore.field.fullName'),
      dataIndex: 'fullName',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.phone'),
      dataIndex: 'phone',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.phone, 'phone')
    },
    {
      title: translate('form.field.email'),
      dataIndex: 'email',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('merchantStore.field.channel'),
      dataIndex: 'channel',
      width: 140,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderChannels(row)
    },
    {
      title: translate('merchantStore.field.workingTime'),
      dataIndex: 'workingTimes',
      width: 150,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderTimes(row)
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'isActive',
      width: 120,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderStatus(row)
    },
    {
      title: translate('form.field.createdAt'),
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
    },
    {
      title: translate('form.field.updatedAt'),
      dataIndex: 'lastUpdatedAt',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.lastUpdatedAt, 'datetimes')
    }
  ]

  return (
    <>
      <PageLoading active={isLoading} />

      <ProTable
        columns={userColumns}
        editAction={false}
        removeAction={false}
        exportExcel={false}
        reloadTable={reloadTable}
        getListFunc={getUsersList}
        createToggle={createToggle}
        extraButtons={(row: any) => (
          <>
            <EditOutlined
              title={translate('form.button.edit')}
              onClick={() => editToggle(row)}
            />
            <Popconfirm
              title={
                <div style={{ whiteSpace: 'pre' }}>
                  {translate('form.message.delete.confirmText')}
                </div>
              }
              okText={translate('form.button.delete')}
              cancelText={translate('form.button.cancel')}
              okButtonProps={{ type: 'danger' }}
              onConfirm={() => deleteSubmit(row)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </>
        )}
      />

      <ModalForm
        visible={isEdit}
        width='600px'
        title={
          editItem?._id
            ? translate("userStore.title.user.update")
            : translate("userStore.title.user.create")
        }
        onFinish={editSubmit}
        initialValues={editItem}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: editCancel
        }}
        className={styles.userModalCustom}
      >
        <FormText hidden disabled name='_id' />
        <FormText hidden disabled name='storeId' />

        <FormText
          name="fullName"
          label={translate('merchantStore.field.fullName')}
          placeholder={translate('merchantStore.placeholder.fullName')}
          rules={[
            { required: true, message: translate('form.message.field.required') },
            { max: 250, message: translate('form.message.field.length') }
          ]}
        />
        <FormText
          name="phone"
          disabled={editItem?._id}
          label={translate('merchantStore.field.phone')}
          placeholder={translate('merchantStore.placeholder.phone')}
          rules={[
            { required: true, message: translate('form.message.field.required') },
            { max: 250, message: translate('form.message.field.length') },
            {
              pattern: new RegExp('^(0[1-9])+([0-9]{8})$'),
              message: translate('form.message.phone.pattern'),
            }
          ]}
        />
        <FormText
          name="email"
          disabled={editItem?._id}
          label={translate('merchantStore.field.email')}
          placeholder={translate('merchantStore.placeholder.email')}
          rules={[
            { required: true, message: translate('form.message.field.required') },
            { type: 'email', message: translate('form.message.email.invalid') },
            { max: 250, message: translate('form.message.field.length') },
            checkEmailSpecialCharacter
          ]}
        />
        <FormList
          name="workingTimes"
          label={translate('merchantStore.field.workingTime')}
          tooltip={translate('merchantStore.tooltip.workingTime')}
        >
          {(fields: any, { add, remove }: any) => (
            <>
              {
                fields.map(({ key, name, fieldKey }: any) => (
                  <Row key={key} gutter={15}>
                    <Col span={22}>
                      <ProFormTimePicker.RangePicker
                        key={key}
                        fieldKey={[fieldKey, 'timeRange']}
                        name={[name, 'timeRange']}
                        fieldProps={{
                          format: FORMAT_TIME,
                          style: { width: '100%' }
                        }}
                        placeholder={[
                          translate('merchantStore.field.startTime'),
                          translate('merchantStore.field.endTime')
                        ]}
                        rules={[
                          { required: true, message: translate('form.message.select.required') },
                          { validator: validateWorkingTime }
                        ]}
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center', padding: '.3em 0 0' }}>
                      {
                        fields?.length > 1 ? (
                          <CloseCircleOutlined onClick={() => remove(name)} />
                        ) : null
                      }
                    </Col>
                  </Row>
                ))
              }
              <Button
                block
                type="dashed"
                onClick={add}
                icon={<PlusOutlined />}
                style={{ height: '2.6em' }}
              >
                {translate('merchantStore.button.workingTime.add')}
              </Button>
            </>
          )}
        </FormList>

        <div className="customLabel">
          {translate('merchantStore.field.channel')}
          {` `}
          <Tooltip
            placement="top"
            title={translate('merchantStore.tooltip.channel')}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </div>

        {/* Create/edit mobile account */}
        <div className="channel-wrap">
          <FormCheckbox
            name="isMobile"
            fieldProps={{
              className: "checkbox"
            }}
            disabled={!!editItem?.userMobileRef}
          >
            <div className="c-title">
              <div>
                {translate('merchantStore.field.channelApp')}
                {
                  !!editItem?.userMobileRef && (
                    <span className="highlight">
                      ({translate('merchantStore.text.registered')})
                    </span>
                  )
                }
              </div>
              {
                !!editItem?.userMobileRef ? (
                  <Button
                    type="link"
                    onClick={() => passwordToggle({
                      phone: editItem?.phone,
                      userId: editItem?.userMobileRef
                    })}
                  >
                    {translate('merchantStore.text.password.reset')}
                  </Button>
                ) : null
              }
            </div>
          </FormCheckbox>

          <FormItem
            noStyle
            shouldUpdate={(prevVal: any, currVal: any) => prevVal?.isMobile !== currVal?.isMobile}
          >
            {({ getFieldValue, setFieldsValue }: any) => {
              const isMobileRegister = getFieldValue('isMobile')
              const isMobileRegistered = !!editItem?.userMobileRef
              return (
                <Card
                  className='account-card'
                  hidden={!isMobileRegister}
                >
                  <FormItem
                    noStyle
                    shouldUpdate={(prevVal: any, currVal: any) => prevVal?.phone !== currVal?.phone}
                  >
                    <FormText
                      disabled
                      name='mobileAccount'
                      placeholder={translate('merchantStore.field.phone')}
                      fieldProps={{
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                        value: getFieldValue('phone') || ''
                      }}
                      rules={[{ max: 250, message: translate('form.message.field.length') }]}
                    />
                  </FormItem>
                  <FormItem
                    noStyle
                    shouldUpdate={(prevVal: any, currVal: any) => prevVal?.passwordForApp !== currVal?.passwordForApp}
                  >
                    <FormText.Password
                      name='passwordForApp'
                      disabled={isMobileRegistered}
                      placeholder={translate('form.field.password')}
                      fieldProps={{
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      rules={[
                        {
                          required: isMobileRegister && !isMobileRegistered,
                          message: translate('form.message.field.required'),
                        },
                        { validator: validateMobilePassword }
                      ]}
                    />
                  </FormItem>
                  {
                    !isMobileRegistered && (
                      <Button
                        type="link"
                        onClick={() => {
                          setFieldsValue({
                            passwordForApp: PASSWORD_DEFAULT_APP
                          })
                        }}
                      >
                        {translate('merchantStore.text.password.default')}
                        {' '}
                        ({PASSWORD_DEFAULT_APP})
                      </Button>
                    )
                  }
                </Card>
              )
            }}
          </FormItem>
        </div>

        {/* Create/edit portal account */}
        <div className="channel-wrap">
          <FormCheckbox
            name="isPortal"
            fieldProps={{
              className: "checkbox"
            }}
            disabled={!!editItem?.userPortalRef}
          >
            <div className="c-title">
              <div>
                {translate('merchantStore.field.channelWeb')}
                {
                  !!editItem?.userPortalRef && (
                    <span className="highlight">
                      ({translate('merchantStore.text.registered')})
                    </span>
                  )
                }
              </div>
              {
                !!editItem?.userPortalRef ? (
                  <Button
                    type="link"
                    onClick={() => passwordToggle({
                      email: editItem?.email,
                      userId: editItem?.userPortalRef
                    })}
                  >
                    {translate('merchantStore.text.password.reset')}
                  </Button>
                ) : null
              }
            </div>
          </FormCheckbox>
          <FormItem
            noStyle
            shouldUpdate={(prevVal: any, currVal: any) => prevVal?.isPortal !== currVal?.isPortal}
          >
            {({ getFieldValue, setFieldsValue }: any) => {
              const isPortalRegister = getFieldValue('isPortal')
              const isPortalRegistered = !!editItem?.userPortalRef
              return (
                <Card
                  className='account-card'
                  hidden={!isPortalRegister}
                >
                  <FormItem
                    noStyle
                    shouldUpdate={(prevVal: any, currVal: any) => prevVal?.email !== currVal?.email}
                  >
                    <FormText
                      disabled
                      name='portalAccount'
                      placeholder={translate('merchantStore.field.email')}
                      fieldProps={{
                        prefix: <UserOutlined className={'prefixIcon'} />,
                        value: getFieldValue('email') || ''
                      }}
                      rules={[{ max: 250, message: translate('form.message.field.length') }]}
                    />
                  </FormItem>
                  <FormItem
                    noStyle
                    shouldUpdate={(prevVal: any, currVal: any) => prevVal?.passwordForWeb !== currVal?.passwordForWeb}
                  >
                    <FormText.Password
                      name='passwordForWeb'
                      disabled={isPortalRegistered}
                      placeholder={translate('form.field.password')}
                      fieldProps={{
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      rules={[
                        {
                          required: isPortalRegister && !isPortalRegistered,
                          message: translate('form.message.field.required'),
                        },
                        { validator: validatePortalPassword }
                      ]}
                    />
                  </FormItem>
                  {
                    !isPortalRegistered && (
                      <div>
                        <Button
                          type="link"
                          onClick={() => {
                            setFieldsValue({
                              passwordForWeb: PASSWORD_DEFAULT_WEB
                            })
                          }}
                        >
                          {translate('merchantStore.text.password.default')}
                          {' '}
                          ({PASSWORD_DEFAULT_WEB})
                        </Button>
                      </div>
                    )
                  }
                </Card>
              )
            }}
          </FormItem>
        </div>
      </ModalForm>

      {/* Reset password form */}
      <ModalForm
        visible={isResetPwd}
        className={styles.resetForm}
        title={translate("userStore.title.password.reset")}
        width='600px'
        onFinish={passwordSubmit}
        initialValues={passwordItem}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: passwordCancel
        }}
      >
        <FormText
          hidden
          disabled
          name='userId'
        />
        <FormItem
          noStyle
          shouldUpdate={(prevVal: any, currVal: any) => prevVal?.newPassword !== currVal?.newPassword}
        >
          {
            ({ setFieldsValue }: any) => {
              const isMobilePwd = !!passwordItem?.phone;
              const isPortalPwd = !!passwordItem?.email;
              const defaultPwd = (
                isMobilePwd
                  ? PASSWORD_DEFAULT_APP
                  : isPortalPwd ? PASSWORD_DEFAULT_WEB : ''
              )
              return (
                <Card className='account-card'>
                  { // Reset password for app account
                    isMobilePwd ? (
                      <>
                        <FormField
                          disabled
                          name='phone'
                          placeholder={translate('form.field.phone')}
                          rules={[{ max: 250, message: translate('form.message.field.length') }]}
                          fieldProps={{
                            prefix: <MobileOutlined className='prefixIcon' />
                          }}
                        />
                        <FormText.Password
                          name='newPassword'
                          placeholder={translate('form.field.password')}
                          rules={[
                            { required: true, message: translate('form.message.field.required') },
                            { validator: validateMobilePassword }
                          ]}
                          fieldProps={{
                            prefix: <LockOutlined className='prefixIcon' />
                          }}
                        />
                      </>
                    ) : null
                  }

                  { // Reset password for portal account
                    isPortalPwd ? (
                      <>
                        <FormField
                          disabled
                          name='email'
                          placeholder={translate('form.field.email')}
                          fieldProps={{
                            prefix: <UserOutlined className='prefixIcon' />
                          }}
                          rules={[{ max: 250, message: translate('form.message.field.length') }]}
                        />
                        <FormText.Password
                          name='newPassword'
                          placeholder={translate('form.field.password')}
                          rules={[
                            { required: true, message: translate('form.message.field.required') },
                            { validator: validatePortalPassword }
                          ]}
                          fieldProps={{
                            prefix: <LockOutlined className='prefixIcon' />
                          }}
                        />
                      </>
                    ) : null
                  }

                  <Button
                    type="link"
                    className="defaultPassForWeb"
                    onClick={() => setFieldsValue({ newPassword: defaultPwd })}
                  >
                    {translate('merchantStore.text.password.default')}
                    {' '}
                    ({defaultPwd})
                  </Button>
                </Card>
              )
            }
          }
        </FormItem>
      </ModalForm>
    </>
  );
};

export default UsersTab;

