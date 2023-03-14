import React, { useState, useEffect, } from 'react';
import { Container, Row, Col, Status, Card, Tag, Icons } from '@/components';
import { TRANSACTION_STATUS_LIST, TRANSACTION_CHANNELS_LIST } from '@/constants';
import { getPaymentHistoryByTransactionId, getTransactionHistoryDetail } from '@/services/transaction-history/api';
import { translate, message, format, renderField } from '@/utils';
import styles from './style.less';
import { DetailPage } from '@/components/DetailPage';
import { isEmpty } from 'lodash';
import RefundHistory from './RefundHistory';
import PaymentHistory from "./PaymentHistory"
import { parseCurrencyToIntNumber, parseOptions } from '@/utils/parse';
import { renderStatus } from '@/utils/render';
import { useExportModal, useGetSysConfig, useModal } from '@/hooks';
import UpdateStateModal from './UpdateStateModal';
import { includes } from '@/utils/curry';
import { DefaultOptionType } from 'antd/lib/select';
import _ from "lodash"
const { RollbackOutlined, EditOutlined } = Icons
const isSuccessStatus = (stt: string) => stt === 'PAID'

const ALLOW_EDIT_STATE = ['NOT_PAID', 'PROCESSING'] // open updte state modal
const WILL_UPDATE_STATE = {
  NOT_PAID: 'CANCELED',
  PROCESSING: 'PAID'
}

interface PageProps {
  match: any;
  history: any;
}

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
      <Col xs={10} md={8} xl={6} xxl={4}>
        {props?.title}
      </Col>
      <Col xs={14} md={16} xl={18} xxl={20}>
        <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
          {props?.content}
        </div>
      </Col>
    </Row>
    <hr hidden={!!props?.hidden || props?.noBorder} />
  </>
)

const TransactionHistoryDetail: React.FC<PageProps> = ({ match, history }) => {
  const { id } = match.params
  const [transaction, setTransaction] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [toggleReload, setToggleReload] = useState<boolean>(false)
  const [hasProcessingPayment, setHasProcessingPayment] = useState<boolean>(false)
  const [showEditModal, openEditModal, closeEditModal] = useModal()
  const [billStatusOptions, setBillStatusOptions] = useState<DefaultOptionType[]>();
  const [reloadTableRefundHistory, setReloadTableRefundHistory] = useState<boolean>(false);
  const transTypes = useGetSysConfig('BILL_STATUS')
  const [refundHistory, setRefundHistory] = useState<any[]>([]);


  const isEditState = ALLOW_EDIT_STATE.includes(transaction?.state) && !(transaction?.state === 'PROCESSING' && (transaction?.paidAmount || 0) === 0)

  useEffect(() => {
    setBillStatusOptions(parseOptions(transTypes, 'key', 'value'))
  }, [JSON.stringify(transTypes)])

  useEffect(() => {
    const getTransactionDetail = async () => {
      setLoading(true)
      const resp = await getTransactionHistoryDetail(id)
      setTransaction(resp?.data)
      setLoading(false)
    }

    getTransactionDetail()
  }, [toggleReload, id])

  // chỉ highlight khi đơn hàng quá hạn và chưa thanh toán
  const showExpireTime = (expireTime: number = 0, state: string = '') => {
    if (
      state === 'EXPIRED'
      // @ts-ignore
      && (new Date(expireTime) - new Date() <= 0)
    )
      return (
        <b style={{ color: 'red' }}>
          {format.datetimes(expireTime)}
        </b>
      )
    return format.datetimes(expireTime)
  }

  return (
    <Container className={styles.transaction}>
      <DetailPage isLoading={isLoading} hasData={!isEmpty(transaction)} onBack={history.goBack} onReload={() => setToggleReload(!toggleReload)}>
        <Card>
          <div className="header">
            <div className="title">
              {translate('transaction.title.detail')}
            </div>
          </div>
          <div className="content">
            <DetailFieldItem
              title={translate('transaction.field.transId')}
              content={renderField(transaction?.orderId)}
            />
            <DetailFieldItem
              title={translate('transaction.field.orderAmount')}
              content={renderField(transaction?.amount || 0, 'currency')}
            />
            <DetailFieldItem
              title={translate('transaction.field.recivedAmount')}
              content={renderField(transaction?.paidAmount || 0, 'currency')}
            />
            <DetailFieldItem
              title={translate('refund.field.refundedAmount')}
              content={renderField(transaction?.refundedAmount || 0, 'currency')}
            />
            <DetailFieldItem
              title={translate('transaction.field.currencyUnit')}
              content={
                transaction?.currencies ? (
                  <Tag color="default">
                    {transaction?.currencies}
                  </Tag>
                ) : '-'
              }
            />
            <DetailFieldItem
              title={translate('transaction.field.orderInfo')}
              content={renderField(transaction?.orderInfo)}
            />
            <DetailFieldItem
              title={translate('form.field.status')}
              content={
                <div className='state-row'>
                  {renderStatus(TRANSACTION_STATUS_LIST, transaction?.state)}

                  {
                    isEditState &&
                    <EditOutlined onClick={openEditModal} />
                  }
                </div>
              }
            />
            <DetailFieldItem
              title={translate('transaction.field.note')}
              content={renderField(transaction?.extraInfo?.updateManual?.note)}
            />
            {/* {
              isSuccessStatus(transaction?.state) && (
                <DetailFieldItem
                  title={translate('form.field.note')}
                  content={renderField(transaction?.extraInfo?.updateManual?.note)}
                  hidden={!transaction?.extraInfo?.updateManual?.note}
                />
              )
            } */}
            <DetailFieldItem
              title={translate('form.field.createdAt')}
              content={renderField(transaction?.createdAt, 'datetimes') || '-'}
            />
            <DetailFieldItem
              title={translate('transaction.field.expiredAt')}
              content={
                transaction?.expireTime
                  ? showExpireTime(transaction?.expireTime, transaction?.state)
                  : '-'
              }
            />
            <DetailFieldItem
              title={translate('form.field.updatedAt')}
              content={renderField(transaction?.lastUpdatedAt, 'datetimes') || '-'}
            />

            <div className="content">
              <div className="header" style={{ marginBottom: 15 }}>
                <div className="title">
                  {translate('transaction.title.paymentInfo')}
                </div>
              </div>
              <DetailFieldItem
                title={translate('transaction.field.payChannel')}
                content={
                  <Row gutter={[12, 12]}>
                    {
                      !_.isEmpty(transaction?.paymentChannels) ? (transaction?.paymentChannels?.map((paymentChannel: any) => {
                        return <Status value={paymentChannel} options={TRANSACTION_CHANNELS_LIST || "-"} />
                      })) : "-"
                    }
                  </Row>
                }
              />
              <DetailFieldItem
                title={translate('refund.field.payLink')}
                content={
                  transaction?.linkPaymentGateway ? (
                    <a
                      href={transaction?.linkPaymentGateway}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {transaction?.linkPaymentGateway}
                    </a>
                  ) : '-'
                }
                hidden={!transaction?.linkPaymentGateway}
              />
            </div>
          </div>
        </Card>
        <PaymentHistory paymentBillId={transaction?._id} reloadRefundHistory={() => setReloadTableRefundHistory(val => !val)} setHasProcessingPayment={setHasProcessingPayment} refundHistory={refundHistory} transactionState={transaction?.state} />
        <RefundHistory paymentBillId={transaction?._id} reloadTable={reloadTableRefundHistory} setRefundHistory={setRefundHistory} />

        {showEditModal && <UpdateStateModal
          visible={showEditModal}
          onCancel={closeEditModal}
          state={transaction?.state}
          billId={transaction?._id}
          dftOptions={billStatusOptions?.filter(includes(ALLOW_EDIT_STATE, 'value'))}
          fullOptions={billStatusOptions}
          willUpdate={WILL_UPDATE_STATE}
          reloadTransactionDetail={() => {
            setToggleReload(val => !val)
          }}
        />}

      </DetailPage>
    </Container>
  )
}

export default TransactionHistoryDetail
