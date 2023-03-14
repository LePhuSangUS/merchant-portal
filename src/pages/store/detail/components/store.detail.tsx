import React, { useState, useEffect } from 'react';
import { Row, Col, Card, FormItem, FormField, FormText, FormSwitch,
  CustomUpload, CustomImage, FormAddress, Button, Icons } from '@/components';
import { ModalForm } from '@ant-design/pro-form';
import { translate, parseAddress, renderField } from '@/utils';
import { renderStatus } from '@/pages/store';
import { merchantNameRules } from '@/utils/rules';

const { EditOutlined } = Icons

interface PageProps {
  store: any,
  formSubmit?: (formData?: any) => void
}

const StoresTab: React.FC<PageProps> = (
  {
    store,
    formSubmit
  }
) => {
  const [detailItem, setDetailItem] = useState<any>(null)

  useEffect(() => {
    setDetailItem(store)
  }, [store])

  const handleSubmit = async (formData: any) => {
    if (formSubmit) await formSubmit(formData)
    return true
  }

  return (
    <Card>
      <div className="header">
        <div className="title">
          {detailItem?.name || translate('merchantStore.title.detail')}
        </div>
        <div className="actions">
          {
            detailItem?._id && (
              <ModalForm
                width='600px'
                title={translate("merchantStore.title.update")}
                trigger={
                  <Button icon={<EditOutlined />}>
                    {translate('locale.edit')}
                  </Button>
                }
                onFinish={handleSubmit}
                initialValues={detailItem || {}}
                modalProps={{
                  destroyOnClose: true,
                  maskClosable: false
                }}
              >
                <FormField
                  hidden
                  name='_id'
                />
                <FormText
                  name='name'
                  label={translate('form.field.storeName')}
                  rules={merchantNameRules()}
                />
                <FormItem
                  name="image"
                  label={translate('form.field.storeImage')}
                >
                  <CustomUpload
                    single
                    maxCount={1}
                    accept="image/png, image/jpeg"
                  />
                </FormItem>
                <FormSwitch
                  name='isActive'
                  label={translate('form.field.status')}
                  initialValue={false}
                />
                <FormAddress
                  name="address"
                  label={translate('page.profile.field.address')}
                  initialValue={detailItem?.address}
                />
              </ModalForm>
            )
          }
        </div>
      </div>
      <div className="content">
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.storeAccount')}
          </Col>
          <Col xs={24} md={18}>
            {renderField(detailItem?.accountNumber)}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.storeName')}
          </Col>
          <Col xs={24} md={18}>
            {renderField(detailItem?.name)}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.storeBalance')}
          </Col>
          <Col xs={24} md={18}>
            {renderField(detailItem?.accountBalance || 0,' currency')}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.status')}
          </Col>
          <Col xs={24} md={18}>
            {renderStatus(detailItem)}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.address')}
          </Col>
          <Col xs={24} md={18}>
            {parseAddress(detailItem?.address) || '-'}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={24} md={6}>
            {translate('form.field.storeImage')}
          </Col>
          <Col xs={18} md={6}>
            {
              detailItem?.image ? (
                <CustomImage
                  width={200}
                  src={detailItem.image}
                />
              ) : '-'
            }
          </Col>
        </Row>
        <hr />
      </div>
    </Card>
  )
}

export default StoresTab
