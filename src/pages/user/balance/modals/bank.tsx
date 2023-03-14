import React from 'react';
import { Row, Button, Space, FormField, FormSelect } from '@/components';
import { ModalForm } from '@ant-design/pro-form';
import { parseValue, translate } from '@/utils';

interface ModalProps {
  visible: boolean;
  loading?: boolean;
  isForbidden?: boolean;
  banksList?: any[];
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

const BankModal: React.FC<ModalProps> = (
  {
    visible,
    loading = false,
    isForbidden = false,
    banksList = [],
    onSubmit,
    onCancel
  }
) => {
  const handleSubmit = async (formData: any) => {
    onSubmit?.(formData);
  }

  const handleCancel = () => {
    onCancel?.();
  }

  const validateCardNumber = (_: any, val: string) => {
    if (!val) return Promise.resolve();
    const isValid = /^[0-9]{4,24}$/.test(val);
    if (!isValid) return Promise.reject(new Error(parseValue({
      vi: 'Số tài khoản không hợp lệ',
      en: 'Invalid account number'
    })));
    return Promise.resolve();
  }

  const validateCardOwner = (_: any, val: string) => {
    if (!val) return Promise.resolve();
    const isValid =  /^[a-zA-Z ]{1,50}$/.test(val);
    if (!isValid) return Promise.reject(new Error(parseValue({
      vi: 'Họ tên không hợp lệ',
      en: 'Invalid account name'
    })));
    return Promise.resolve();
  }

  return (
    <ModalForm
      visible={!isForbidden && visible}
      width='500px'
      title={translate('balance.title.addBank')}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        onCancel: handleCancel
      }}
      name='LinkBankAccountForm'
      onFinish={handleSubmit}
      submitter={{
        render: () => (
          <Row justify="center">
            <Space>
              <Button onClick={handleCancel}>
                {translate('form.button.cancel')}
              </Button>
              <Button loading={loading} type="primary" htmlType="submit">
                {translate('form.button.submit')}
              </Button>
            </Space>
          </Row>
        ),
      }}
    >
      <FormSelect
        showSearch
        name="bankCode"
        label={translate('balance.field.bankName')}
        placeholder={translate('balance.placeholder.bankName')}
        rules={[{ required: true, message: translate('form.message.select.required') }]}
        options={banksList || []}
      />
      <FormField
        name="accountNumber"
        label={translate('balance.field.cardNumber')}
        placeholder={translate('balance.placeholder.cardNumber')}
        rules={[
          { required: true, message: translate('form.message.field.required') },
          { validator: validateCardNumber },
          { max: 24, message: '' }
        ]}
      />
      <FormField
        name="accountName"
        label={translate('balance.field.fullName')}
        placeholder={translate('balance.placeholder.fullName')}
        tooltip={translate('balance.message.bank.accountName.tooltip')}
        rules={[
          { required: true, message: translate('form.message.field.required') },
          { validator: validateCardOwner },
          { max: 50, message: '' }
        ]}
      />
      <FormField
        name="branch"
        label={translate('balance.field.branchName')}
        placeholder={translate('balance.placeholder.branchName')}
        rules={[
          { required: true, message: translate('form.message.field.required') },
          { max: 256, message: translate('form.message.field.length') },
        ]}
      />
    </ModalForm>
  );
};

export default BankModal;
