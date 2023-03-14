import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import { Container, Row, Col, Icons, Card, Button, Popconfirm, Status, Space } from '@/components';
import { getRefund, updateRefund, removeRefund, sendApproveRefundRequest } from '@/services/refund/api';
import {translate, message, renderField, format, notification} from '@/utils';
import { MIN_REFUND_AMOUNT, REFUND_STATUS_LIST } from "@/constants";
import { DetailPage } from '@/components/DetailPage';
import FormAmount from '@/components/FormField/FormAmount';
import { useGetSysConfig } from '@/hooks';
import { renderStatus } from '@/utils/render';
import { parseCurrencyToIntNumber, parseOptions } from '@/utils/parse';

import styles from './style.less';
import OrderInfo from './OrderInfo';
import RefundTransactionInfo from './RefundTransactionInfo';

// const { DeleteOutlined, EditOutlined, SendOutlined } = Icons

const isInitialStatus = (stt: string) => stt === 'INITIAL'
const isPendingStatus = (stt: string) => stt === 'PENDING'
const isSuccessStatus = (stt: string) => stt === 'APPROVED'
const isFailedStatus = (stt: string) => stt === 'REJECTED'

const DetailFieldItem = (
  props: {
    title: string,
    content?: any,
    hidden?: boolean,
    noBorder?: boolean
  }
) => (
  <>
    <Row gutter={15} hidden={!!props?.hidden}>
      <Col xs={10} md={8} xl={6}>
        {props?.title}
      </Col>
      <Col xs={14} md={16} xl={18}>
        <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
          {props?.content}
        </div>
      </Col>
    </Row>
    <hr hidden={!!props?.hidden || props?.noBorder} />
  </>
)

export type Props = {
  match: any;
  history: any;
}

const RefundDetail: React.FC<Props> = ({ match, history }) => {
  const { id } = match.params
  const [detailItem, setDetailItem] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isReload, setReload] = useState<boolean>(false)
  const paymentChannel = useGetSysConfig('PAYMENT_CHANNEL')

  const isBankTransfer = detailItem?.paymentChannelID === 'BANK_TRANSFER'

  const getRefundDetail = async () => {
    setLoading(true)
    const resp = await getRefund(id)
    if (!resp?.success || !resp?.data) {
      notification.error(resp?.message || translate('refund.message.detail.failed'))
      // history.push('/pg/refund')
    } else setDetailItem(resp?.data)
    setLoading(false)
  }

  useEffect(() => {
    getRefundDetail().then()
  }, [isReload])

  const toggleReload = () => setReload(!isReload)

  const sendSubmit = async () => {
    setLoading(true)
    const resp = await sendApproveRefundRequest(detailItem)
    setLoading(false)
    if (!resp?.success)
      notification.error(resp?.message || translate('refund.message.send.failed'))
    else {
      message.success(translate('refund.message.send.success'))
      toggleReload()
    }
    return true
  }

  const deleteSubmit = async () => {
    setLoading(true)
    const resp = await removeRefund({ _id: id })
    setLoading(false)
    if (!resp?.success)
      notification.error(translate('refund.message.delete.failed'))
    else {
      message.success(translate('refund.message.delete.success'))
      history.push('/pg/refund')
    }
    return true
  }

  const editSubmit = async (formData: any) => {
    const resp = await updateRefund({...formData, amount: parseCurrencyToIntNumber(formData?.amount)})
    if (!resp?.success)
      notification.error(translate('refund.message.update.failed'))
    else {
      message.success(translate('refund.message.update.success'))
      toggleReload()
    }
    return true
  }

  return (
    <Container className={styles.refund}>
      <DetailPage isLoading={isLoading} hasData={!isEmpty(detailItem)} onBack={history.goBack} onReload={() => setReload(!isReload)}>

        <Card>
          <div className="header">
            <div className="title">
              {translate('refund.title.detail')}
            </div>
            {/* <div className="actions">
              <Space>
                {
                  isInitialStatus(detailItem?.state) && (
                    <Popconfirm
                      title={
                        <div style={{ whiteSpace: "pre" }}>
                          {translate('refund.message.send.confirm')}
                        </div>
                      }
                      okText={translate('form.button.submit')}
                      cancelText={translate('form.button.cancel')}
                      okButtonProps={{ type: "danger" }}
                      placement='bottom'
                      onConfirm={sendSubmit}
                    >
                      <Button icon={<SendOutlined />}>
                        {translate('refund.button.submit')}
                      </Button>
                    </Popconfirm>
                  )
                }
                {
                  !isSuccessStatus(detailItem?.state) && (
                    <ModalForm
                      width='500px'
                      title={translate("refund.title.edit")}
                      trigger={
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                        >
                          {translate('form.button.edit')}
                        </Button>
                      }
                      initialValues={detailItem || {}}
                      onFinish={editSubmit}
                      modalProps={{
                        destroyOnClose: true,
                        maskClosable: false
                      }}
                      className={styles?.modalEditRefund}
                    >
                      <ProFormText
                        hidden
                        disabled
                        name="_id"
                      />
                      <ProFormText
                        hidden
                        disabled
                        name="paymentBillId"
                      />
                      <FormAmount
                        name="amount"
                        minAmount={MIN_REFUND_AMOUNT}
                        maxAmount={(detailItem?.paymentBillAmount || 0) - (detailItem?.refundedAmount || 0)}
                        label={translate('refund.field.refundAmount')}
                        placeholder={`${translate('refund.tooltip.minAmount')}: ${format.currency(MIN_REFUND_AMOUNT)}`}
                        rules={[{ required: true, message: translate('form.message.field.required') }]}
                        // isReplaceRules={true}
                      />
                      <ProFormTextArea
                        name="note"
                        label={translate('form.field.note')}
                        placeholder={translate('form.field.note')}
                        rules={[
                          { required: true, message: translate('form.message.field.required') },
                          { max: 250, message: translate('form.message.field.length') }
                        ]}
                      />
                    </ModalForm>
                  )
                }
                {
                  !isPendingStatus(detailItem?.state)
                  && !isSuccessStatus(detailItem?.state) && (
                    <Popconfirm
                      title={
                        <div style={{ whiteSpace: "pre" }}>
                          {translate('refund.message.delete.confirm')}
                        </div>
                      }
                      okText={translate('form.button.submit')}
                      cancelText={translate('form.button.cancel')}
                      okButtonProps={{ type: "danger" }}
                      placement='bottomRight'
                      onConfirm={deleteSubmit}
                    >
                      <Button
                        danger
                        type='primary'
                        icon={<DeleteOutlined />}
                      >
                        {translate('form.button.delete')}
                      </Button>
                    </Popconfirm>
                  )
                }
              </Space>
            </div> */}
          </div>
          <div className="content">
            <Row>
              <Col span={isBankTransfer ? 12 : 24}>

                <DetailFieldItem
                  title={translate('refund.field.billId')}
                  content={renderField(detailItem?.orderId)}
                />
                <DetailFieldItem
                  title={translate('refund.field.paymentCode')}
                  content={renderField(detailItem?.paymentId)}
                />
                <DetailFieldItem
                  title={translate('refund.field.refundId')}
                  content={renderField(detailItem?.tranHisId)}
                />
                <DetailFieldItem
                  title={translate('refund.field.paymentChannel_full')}
                  content={renderStatus(parseOptions(paymentChannel, 'key', 'value'))(detailItem?.paymentChannelID)}
                />
                <DetailFieldItem
                  title={translate('refund.field.refundAmount')}
                  content={renderField(detailItem?.refundAmount || 0, 'currency')}
                />
                <DetailFieldItem
                  title={translate('refund.field.paymentAmount')}
                  content={renderField(detailItem?.paidAmount || 0, 'currency')}
                />
                {/* <DetailFieldItem
                  title={translate('refund.field.refundedAmount')}
                  content={renderField(detailItem?.refundedAmount || 0, 'currency')}
                /> */}
                <DetailFieldItem
                  title={translate('form.field.status')}
                  content={
                    detailItem?.state
                      ? <Status value={detailItem?.state} options={REFUND_STATUS_LIST} />
                      : '-'
                  }
                />
                {
                  isFailedStatus(detailItem?.state) && (
                    <DetailFieldItem
                      title={translate('form.field.failedReason')}
                      content={renderField(detailItem?.extraInfo?.updateManual?.errorCode?.message)}
                      hidden={!detailItem?.extraInfo?.updateManual?.errorCode?.message}
                    />
                  )
                }
                <DetailFieldItem
                  title={translate('form.field.note')}
                  content={renderField(detailItem?.extraInfo?.updateManual?.note || detailItem?.note)}
                />
                <DetailFieldItem
                  title={translate('form.field.createdBy')}
                  content={renderField(detailItem?.merchantInfo?.merchantEmail)}
                />
                <DetailFieldItem
                  title={translate('form.field.createdAt')}
                  content={renderField(detailItem?.createdAt, 'datetimes') || '-'}
                />
                <DetailFieldItem
                  title={translate('form.field.updatedAt')}
                  content={renderField(detailItem?.lastUpdatedAt, 'datetimes') || '-'}
                />
                <DetailFieldItem
                  noBorder
                  title={translate('form.field.updatedBy')}
                  content={renderField(detailItem?.lastUpdatedBy)}
                />
              </Col>
              {
                isBankTransfer &&
                <Col span={12}>
                  <DetailFieldItem
                    title={translate('refund.field.bankName')}
                    content={renderField(detailItem?.refundTargetSource?.bankName)}
                  />
                  <DetailFieldItem
                    title={translate('refund.field.bankAccount')}
                    content={renderField(detailItem?.refundTargetSource?.accountNumber)}
                  />
                  <DetailFieldItem
                    noBorder
                    title={translate('refund.field.accountName')}
                    content={renderField(detailItem?.refundTargetSource?.accountName)}
                  />
                </Col>
              }
            </Row>
           
          </div>
        </Card>
      </DetailPage>

      {detailItem?.paymentId && <OrderInfo paymentId={detailItem?.paymentId} history={history} billId={detailItem?.billId} />}
      <RefundTransactionInfo transId={detailItem?.tranHisId} />
    </Container>
  )
}

export default RefundDetail
