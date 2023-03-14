import React, { useEffect, useState } from 'react';
import { Row, Modal, Button, Space, ProForm, FormField } from '@/components';
import { translate } from '@/utils';
import { rejectOnlySpace } from '@/utils/rules';

interface ModalProps {
  item: any
  onSubmit?: (formData: any) => void
  onCancel?: any
}

const PGConfigModal: React.FC<ModalProps> = (
  {
    item,
    onSubmit,
    onCancel
  }
) => {
  const [formRef] = ProForm.useForm()
  const handleSubmit = async (formData: any) => {
    const params = {
      ...formData,
      ipnURL: formData?.ipnUrl?.trim?.(),
    }
    delete params?.ipnUrl
    onSubmit?.(params)
  }

  const handleCancel = () => {
    onCancel?.()
  }


  return (
    <Modal
      visible={true}
      maskClosable={false}
      destroyOnClose={true}
      title={translate('page.profile.title.payment.update')}
      onCancel={handleCancel}
      footer={null}
    >
      <ProForm
        name="UpdatePaymentConfigForm"
        form={formRef}
        onFinish={handleSubmit}
        initialValues={item || {}}
        submitter={{
          render: () => (
            <Row justify="end">
              <Space>
                <Button onClick={handleCancel}>
                  {translate('form.button.cancel')}
                </Button>
                <Button type="primary" htmlType="submit">
                  {translate('form.button.update')}
                </Button>
              </Space>
            </Row>
          ),
        }}
      >
        <FormField hidden name="_id" />

        <FormField
          name="ipnUrl"
          label={translate('page.profile.field.ipnUrl')}
          placeholder={translate('page.profile.placeholder.ipnUrl')}
          rules={[rejectOnlySpace]}
        />
      </ProForm>
    </Modal>
  )
}

export default PGConfigModal
