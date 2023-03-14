import { Button, Card, PageLoading, ProColumns, ProTable, Status } from "@/components"
import { PG_CHANNELS_LIST, PAYMENT_HISTORY_STATUS } from "@/constants"
import { useModal } from "@/hooks"
import { addRefund } from "@/services/refund/api"
import { getPaymentHistoryByTransactionId } from "@/services/transaction-history/api"
import { renderField, translate, message } from "@/utils"
import { propertyEqual } from "@/utils/curry"
import { parseCurrencyToIntNumber } from "@/utils/parse"
import { renderStatus } from "@/utils/render"
import { RollbackOutlined } from "@ant-design/icons"
import { FC, useState } from "react"
import RefundModal from "./RefundModal"

interface PaymentHistory {
    paymentBillId: string;
    reloadRefundHistory: () => void;
    setHasProcessingPayment: (...args: any[]) => void;
    refundHistory: any[];
    transactionState: string;
}

const RefundHistory: FC<PaymentHistory> = ({ paymentBillId, reloadRefundHistory, setHasProcessingPayment, refundHistory, transactionState }) => {
    const [reloadTable, setReloadTable] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [paymentInfo, setPaymentInfo] = useState();
    const [showRefundModal, openRefundModal, closeRefundModal] = useModal()
    const isRefundable = (row: Record<string, any>) => {
        const isFullRefund = row?.amount <= row?.refundedAmount
        const hasPendingRefund = refundHistory?.find(propertyEqual('paymentId', row?.id))?.status === 'PROCESSING'
        return (row?.state === 'SUCCESS') && (row?.amount || 0) && !isFullRefund && !hasPendingRefund && transactionState === 'PAID'
    }
    const toggleReloadTable = () => {
        setReloadTable(!reloadTable)
    }

    const columns: ProColumns[] = [
        {
            title: translate('transaction.field.paymentCode'),
            dataIndex: 'id',
            width: 220,
            sorter: true,
            render: renderField
        },
        {
            title: translate('transaction.detail.paymentHistory.paymentMethod'),
            dataIndex: 'channelID',
            width: 150,
            sorter: true,
            align: 'center',
            render: renderStatus(PG_CHANNELS_LIST)
        },
        {
            title: translate('transaction.field.bankOrPartnerName'),
            dataIndex: 'bankName',
            sorter: true,
            render: renderField
        },
        {
            title: translate('transaction.field.transactionAmount'),
            dataIndex: 'amount',
            sorter: true,
            render: value => value ? renderField(value, 'currency') : ' '
        },
        {
            title: translate('transaction.field.totalRefund'),
            dataIndex: 'refundedAmount',
            sorter: true,
            render: value => value ? renderField(value, 'currency') : '   '
        },
        {
            title: translate('transaction.field.fee'),
            dataIndex: 'fee',
            render: (dom: any, row: any) => row?.fee ? renderField(row?.fee, 'currency') : 0
        },
        {
            title: translate('transaction.detail.paymentHistory.transactionStatus'),
            dataIndex: 'state',
            width: 150,
            sorter: true,
            align: 'center',
            render: renderStatus(PAYMENT_HISTORY_STATUS)
        },
        {
            title: translate('transaction.detail.paymentHistory.createdDate'),
            dataIndex: 'createdAt',
            width: 170,
            sorter: true,
            render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes') || '-'
        },
    ]

    const getPaymentHistory = async (params?: any, options?: any) => {
        if (paymentBillId) {
            setIsLoading(true)
            const resp = await getPaymentHistoryByTransactionId({ ...params, paymentBillId }, options)
            if (!resp?.success) message.error(translate('transactionHistories.message.list.failed'))

            if(resp?.data) {
                setHasProcessingPayment(resp.data?.some(propertyEqual('state', 'PROCESSING')))
            }
            setIsLoading(false);
            return resp
        }

        return []
    }

    const createSubmit = async (values: any) => {
        const formData = {
            ...values,
            paymentBillId: values?._id,
            amount: parseCurrencyToIntNumber(values?.amount),
            note: values?.note?.trim()
        }
        const resp = await addRefund(formData)
        if (!resp?.success)
            message.error(resp?.message || translate('transaction.message.request.failed'))
        else {
            reloadRefundHistory()
            message.success(translate('transaction.message.request.success'))
            toggleReloadTable()
            closeRefundModal()
        }
        return true
    }


    return (
        <Card className='card-mt'>
            <div className="header">
                <div className="title">
                    {translate('transaction.title.paymentHistory')}
                </div>
            </div>
            <div className="content" style={{ paddingTop: 0 }}>
                <PageLoading active={isLoading} />
                <ProTable
                    columns={columns}
                    reloadTable={reloadTable}
                    getListFunc={getPaymentHistory}
                    addAction={false}
                    editAction={false}
                    removeAction={false}
                    searchAction={false}
                    dateAction={false}
                    exportExcel={false}
                    extraButtons={(row: any) => (
                        <>
                            {
                                isRefundable(row) && (
                                    <Button
                                        type="text"
                                        icon={<RollbackOutlined />}
                                        size={'small'}
                                        title={translate('transaction.button.refund')}
                                        onClick={() => {
                                            setPaymentInfo(row)
                                            openRefundModal()
                                        }}
                                    />
                                )
                            }
                        </>
                    )}
                />
            </div>
            {
                showRefundModal &&
                <RefundModal visible={showRefundModal} row={paymentInfo} createSubmit={createSubmit} onCancel={closeRefundModal} />
            }
        </Card>
    )
}

export default RefundHistory