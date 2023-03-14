import React, { FC, useCallback, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import QRCode from 'qrcode.react';
import { debounce } from 'lodash';

import { renderFormTextItem, renderStatus } from '@/utils/render';
import { Container, Col, Countdown, Icons, Modal, ProForm, Row, Button, Input, ProTable } from '@/components';
import { FormAmount } from '@/components/FormField';
import { createRequestPaymentForMerchant, getPaymentLinkList, checkOrderIdForCurrentMerchant } from "@/services/payment-link/api";
import { BILL_STATUS_LIST } from '@/constants';
import * as constants from '@/constants/payment-link.constant'
import { message, translate, renderField,getUser } from '@/utils';
import { copyToClipboard } from "@/utils/utils";
import { checkMaxLength, requiredField, requiredWithMessage } from '@/utils/rules';
import { parseCurrencyToIntNumber, parseNumberToCurrency, parseOptions, parseValue } from '@/utils/parse';
import styles from './styles.less'
import { useRequestAPI } from '@/hooks';
import _ from "lodash";

const { PlusOutlined, CopyOutlined } = Icons;

interface TransactionListProps {
  route: Record<string, any>;
}

const TransactionList: FC<TransactionListProps> = ({ route }) => {
  const [form] = ProForm.useForm();
  const transactionRules = getUser()?.rules;

  const [visible, setVisible] = useState<boolean>(false);
  const [isReloadTable, setReloadTable] = useState<boolean>(false);
  const [isRequestPaymentModal, setIsRequestPaymentModal] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<any>('');
  const [isDuplicateOrderId, setIsDuplicateOrderId] = useState<boolean>(false)
  const [orderIdMessage, setOrderIdMessage] = useState<any>('')
  const createPaymentLinkRequestRulesObject = _.keyBy(transactionRules?.CREATE_PAYMENT_LINK_REQUEST?.fields || [], 'fieldName');
  
  const { request: requestGetPaymentLinkList} = useRequestAPI({
    requestFn: getPaymentLinkList,
    pageName: route?.name,
  })
  const _getConditionAmount = () => {
            return createPaymentLinkRequestRulesObject?.amount?.conditions ||{min:1,max:99999999};
    
}
  const handleCheckOrderId = async (orderId: string) => {
    if (orderId) {
      const resp = await checkOrderIdForCurrentMerchant(orderId)
      if (!resp?.success) {
        setOrderIdMessage(resp?.message)
        setIsDuplicateOrderId(true)
        form?.setFields([{ name: 'orderId', errors: [resp?.message] }])
      } else {
        setIsDuplicateOrderId(false)
      }
    }
  }
  const targetTime = new Date().getTime() + Number(paymentData?.expireValue || 0)*60*1000 ;
  const debounceCheckOrderId = useCallback(debounce(val => handleCheckOrderId(val), constants?.DEBOUNCE_TIME_CHECK_ORDER_ID), [])

  const toggleCreateRequestForm = () => {
    form.resetFields();
    setVisible(!visible);
  };

  const toggleReload = () => {
    setReloadTable(!isReloadTable);
  };

  const toggleCreateRequestModal = () => {
    setIsRequestPaymentModal(!isRequestPaymentModal);
  };

  const columns: ProColumns[] = [
    {
      title: translate('form.field.creationTime'),
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
    },
    {
      title: translate('form.field.amount'),
      dataIndex: 'amount',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.amount || 0, 'currency')
    },
    {
      title: translate('page.paymentLink.orderId'),
      dataIndex: 'orderId',
      width: 150,
      sorter: true,
      render: renderField
    },
    {
      title: translate('page.paymentLink.paymentLink'),
      dataIndex: 'linkPaymentGateway',
      width: 300,
      sorter: true,
      render: renderField
    },
    {
      title: translate('page.paymentLink.paymentTime'),
      dataIndex: 'expireTime',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => {
        const oneDay = 24 * 60 * 60 * 1000;
        // @ts-ignore
        const totalDays: any = Math.round(Math.abs((new Date(row.createdAt) - new Date(row.expireTime)) / oneDay));
        return `${totalDays} ${parseValue({ vi: "ngày", en: totalDays > 1 ? "days" : "day" })}`;
      }
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'state',
      width: 150,
      sorter: true,
      align: 'center',
      render: renderStatus(BILL_STATUS_LIST),
    }
  ];

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate('page.paymentLink.orderId'),
      dataIndex: 'orderId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('orderId')
    },
    {
      title: translate('form.field.creationTime'),
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      valueType: "dateRange",
      search: {
        transform: (value: any) => {
          return {
            dateFr: value[0],
            dateTo: value[1]
          };
        }
      },
    },
  ]

  return (
    <Container>
      <ProTable
        searchProps={{
          searchText: translate('form.field.search')
        }}
        columns={columns}
        queryColumns={queryColumns}
        reloadTable={isReloadTable}
        getListFunc={requestGetPaymentLinkList}
        addAction={false}
        exportExcel={false}
        showActionColumn={false}
        searchAction={false}
        dateAction={false}
        showPickList={false}
        picklistPosition='start'
        extraButtonsToolbar={() => (
          <Button type="primary" onClick={toggleCreateRequestForm}>
            <PlusOutlined style={{ fontSize: 'initial' }} /> {translate('paymentLink.modal.createRequestPayment.addButton')}
          </Button>
        )}
      />
      <ModalForm
        form={form}
        visible={visible}
        className={styles?.paymentLinkForm}
        initialValues={
          {
            orderInfo:"Thanh toán đơn hàng"
        }
        }
        title={translate('paymentLink.modal.createRequestPayment.title')}
        onFinish={async (values: any) => {
          const resp = await createRequestPaymentForMerchant({ ...values, amount: parseCurrencyToIntNumber(values?.amount) })
          if (resp?.success) {
            message.success(translate('refund.message.add.success'));
            setPaymentData(resp?.data || []);
            toggleCreateRequestModal();
            toggleReload();
            return true
          } else {
            message.error(resp.message);
            return false
          }
        }}
        onVisibleChange={setVisible}
        width="500px"
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          okText: translate('form.button.submit')
        }}
      >
        <FormAmount
          label={translate('page.paymentLink.createRequestPayment.amount.label')}
          placeholder={translate('page.paymentLink.createRequestPayment.amount.placeholder')}
          minAmount={_getConditionAmount()?.min}
          rules={[requiredField, {
            validator(_: any, value: any) {
              const amount = parseCurrencyToIntNumber(value)
              if (!+amount && +amount !== 0)
                return Promise.reject(
                  new Error(translate('page.paymentLink.createRequestPayment.amount.message.invalid'))
                )
              if ((amount || amount === 0) && (amount < _getConditionAmount()?.min || amount > _getConditionAmount()?.max))
                return Promise.reject(
                  new Error(translate('page.paymentLink.createRequestPayment.amount.message.minMax', '', { minAmount: parseNumberToCurrency(_getConditionAmount()?.min), maxAmount: parseNumberToCurrency(_getConditionAmount()?.max) }))
                )
              return Promise.resolve()
            }
          }]}
          isReplaceRules={true}
        />
        <ProFormText
          name="orderId"
          label={translate('page.paymentLink.createRequestPayment.id.label')}
          placeholder={translate('page.paymentLink.createRequestPayment.id.placeholder')}
          rules={[
            checkMaxLength(constants?.ORDER_ID_MAX_LENGTH, translate('page.paymentLink.createRequestPayment.id.message.maxLength')),
            {
              pattern: constants?.ORDER_ID_REGEX_PATTERN,
              message: translate('page.paymentLink.createRequestPayment.id.message.invalid'),
            },
            () => ({
              validator(_: any, value: any) {
                return value && isDuplicateOrderId
                  ? Promise.reject(new Error(orderIdMessage))
                  : Promise.resolve();
              },
            })
          ]}
          fieldProps={{
            onKeyPress: (e: any) => {
              const orderId = e?.target?.value
              if (orderId && (orderId?.length === constants?.ORDER_ID_MAX_LENGTH))
                e.preventDefault()
            },
            onChange: (e) => {
              const orderId = e?.target?.value
              if (isDuplicateOrderId) setIsDuplicateOrderId(false)
              if (orderId && constants?.ORDER_ID_REGEX_PATTERN?.test(orderId) && orderId?.length <= constants?.ORDER_ID_MAX_LENGTH)
                debounceCheckOrderId(orderId)
            }
          }}
        />
        <ProFormTextArea
          name="orderInfo"
          label={translate('page.paymentLink.createRequestPayment.orderInfo.label')}
          placeholder={translate('page.paymentLink.createRequestPayment.orderInfo.placeholder')}
          rules={[checkMaxLength(100)]}
          normalize={(s)=>s.replace("\n","")}
        />
        <ProFormSelect
          options={
            parseOptions(
              [
                {
                  value: 43200,
                  label: { vi: "30 ngày", en: "30 days" },
                },
                {
                  value: 10080,
                  label: { vi: "7 ngày", en: "7 days" },
                },
                {
                  value: 1440,
                  label: { vi: "1 ngày", en: "1 day" },
                },
              ]
            )
          }
          // width="md"
          name="expireTime"
          label={translate('page.paymentLink.paymentTime')}
          initialValue={43200}
          rules={[ requiredWithMessage(translate('page.paymentLink.paymentTime.message.required')) ]}
        />
      </ModalForm>

      <Modal
        title={translate('page.paymentLink.modal.createRequestPayment.success.title')}
        visible={isRequestPaymentModal}
        maskClosable={false}
        onCancel={toggleCreateRequestModal}
        onOk={toggleCreateRequestModal}
        footer={
          <Button
            key="submit"
            type="primary"
            onClick={toggleCreateRequestModal}
          >
            Ok
          </Button>
        }
        width="600px"
      >
        <Row>
          <Col xs={12}>
            <strong style={{ display: 'flex' }}>
              {renderField(paymentData?.amount || 0, 'currency')}&nbsp;đ
            </strong>
          </Col>
          <Col xs={12} style={{ textAlign: 'right' }}>
            {renderField(paymentData?.createdAt, 'datetimes')}
          </Col>
        </Row>
        <div>{paymentData.orderId}</div>
        <div className="qrcode" style={{ marginTop: 30 }}>
          <QRCode
            style={{ margin: 'auto' }}
            value={paymentData?.linkPaymentGateway ||"-"}
            size={200}
          />
        </div>
        <div className="link" style={{ marginTop: 30 }}>
          <Row>
            <Col span={18}>
              <Input
                defaultValue={paymentData?.linkPaymentGateway}
                onClick={() => window.open(paymentData?.linkPaymentGateway)}
                readOnly="readonly"
              />
            </Col>
            <Col span={6}>
              <Button
                style={{ width: '100%' }}
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(paymentData?.linkPaymentGateway)}
              >
                {parseValue({ vi: "Sao chép", en: "Copy" })}
              </Button>
            </Col>
          </Row>
        </div>
        <Countdown
          className="count-down-payment-link"
          style={{ marginTop: 30 }}
          title={parseValue({ vi: "Hết hạn sau", en: "Expires after" })}
          value={targetTime}
          format={`DD ${parseValue({ vi: "[ngày]", en: "[days]" })} HH:mm:ss`}
        />
      </Modal>
    </Container>
  );
};

export default TransactionList;
