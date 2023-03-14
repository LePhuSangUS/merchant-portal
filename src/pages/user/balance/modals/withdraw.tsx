import React from 'react';
import { Row, Button, Space, FormSelect, FormDigit, FormText } from '@/components';
import { ModalForm } from '@ant-design/pro-form';
import { translate, format } from '@/utils';
import FormAmount from '@/components/FormField/FormAmount';
import styles from './styles.less'
import { parseCurrencyToIntNumber } from '@/utils/parse';

interface ModalProps {
  visible: boolean;
  loading?: boolean;
  banksList: any[];
  minAmount?: number;
  maxAmount?: number;
  isForbidden?: boolean;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
  onToggle?: () => void;
}

const WithdrawModal: React.FC<ModalProps> = (
  {
    visible,
    loading = false,
    banksList,
    minAmount = 0,
    maxAmount = undefined,
    isForbidden = false,
    onSubmit,
    onCancel,
    onToggle
  }
) => {
  const handleSubmit = async (formData: any) => {
    onSubmit?.({...formData, amount: parseCurrencyToIntNumber(formData?.amount)});
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleToggle = () => {
    onToggle?.();
  };

  return (
    <ModalForm
      visible={visible}
      className={styles?.onlyShowOneError}
      width='500px'
      title={translate('balance.title.withdrawRequest')}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        onCancel: handleCancel
      }}
      name='WithdrawRequestForm'
      onFinish={handleSubmit}
      submitter={{
        render: () => (
          <Row justify="center" style={{ paddingBottom: '1em' }}>
            <Space>
              {
                isForbidden ? (
                  <Button type="primary" onClick={handleCancel}>
                    {translate('form.button.ok')}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel}>
                      {translate('form.button.cancel')}
                    </Button>
                    {
                      !banksList?.length ? (
                        <Button type="primary" onClick={handleToggle}>
                          {translate('balance.button.addAccount')}
                        </Button>
                      ) : (
                        <Button loading={loading} type="primary" htmlType="submit">
                          {translate('form.button.submit')}
                        </Button>
                      )
                    }
                  </>
                )
              }
            </Space>
          </Row>
        )
      }}
    >
      {
        isForbidden ? (
          <div
            style={{
              textAlign: 'center',
              fontSize: '1.1em',
              whiteSpace: 'pre',
              padding: '.5em 0 1em'
            }}
          >
            {translate('balance.message.withdraw.forbidden')}
          </div>
        ) : (
          !banksList?.length ? (
            <div
              style={{
                textAlign: 'center',
                fontSize: '1.1em',
                whiteSpace: 'pre',
                padding: '.5em 0 1em'
              }}
            >
              {translate('balance.message.withdraw.invalid')}
            </div>
          ) : (
            <>
              <FormSelect
                name="bankCode"
                label={translate('balance.field.bankInfo')}
                placeholder={translate('balance.placeholder.bankName')}
                rules={[{ required: true, message: translate('form.message.select.required') }]}
                options={banksList || []}
              />

              <FormAmount
                minAmount={10000}
                initialValue={''}
                label={translate('balance.field.amount')}
                placeholder={
                  translate('balance.placeholder.amount', `Số tiền tối thiểu ${format.currency(minAmount)}`, { minValue: format.currency(minAmount) })
                }
                rules={[
                  { required: true, message: translate('form.message.field.required') },
                  () => ({
                    validator(_: any, value: any) {
                      const amount = parseCurrencyToIntNumber(value)
                      if (!amount || (amount && amount < minAmount)) {
                        return Promise.reject(new Error(translate( 'balance.message.withdraw.requiredMin', '', { minValue: format.currency(minAmount) } )))
                      }
                      if (amount && maxAmount && amount > maxAmount) {
                        return Promise.reject(new Error(translate('balance.message.withdraw.requiredMax')))
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
                isReplaceRules={true}
              />
              <FormText.Password
                name="verifyPassword"
                label={translate('balance.field.verifyPassword')}
                placeholder={translate('balance.placeholder.verifyPassword')}
                rules={[{ required: true, message: translate('form.message.field.required') }]}
                fieldProps={{
                  autoComplete: "new-password"
                }}
              />
            </>
          )
        )
      }
    </ModalForm>
  );
};

export default WithdrawModal;
