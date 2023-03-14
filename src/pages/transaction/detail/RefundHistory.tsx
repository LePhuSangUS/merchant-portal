import { Card, PageLoading, ProColumns, ProTable, Table } from "@/components"
import { REFUND_TRANSACTION_STATUS } from "@/constants/refund.constant"
import { getRefundTransInBill } from "@/services/transaction-history/api"
import { renderField, translate, message } from "@/utils"
import { renderStatus } from "@/utils/render"
import { FC, useEffect, useState } from "react"

interface RefundHistoryProps {
    paymentBillId: string;
    reloadTable: boolean;
    setRefundHistory: (...args: any[]) => void;
}

const RefundHistory: FC<RefundHistoryProps> = ({ paymentBillId, reloadTable, setRefundHistory }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState();

    const columns: ProColumns[] = [
        {
            title: translate('transaction.field.refundId'),
            dataIndex: 'transId',
            width: 220,
            sorter: false,
            render: (val: any) => renderField(val)
        },
        {
            title: translate('transaction.field.paymentCode'),
            dataIndex: 'paymentId',
            width: 220,
            sorter: false,
        },
        {
            title: translate('refund.field.refundAmount'),
            dataIndex: 'amount',
            width: 150,
            sorter: false,
            align: 'center',
            render: (dom: any) => dom ? renderField(dom, 'currency') : ' '
        },
        {
            title: translate('form.field.status'),
            dataIndex: 'status',
            width: 150,
            sorter: false,
            align: 'center',
            render: renderStatus(REFUND_TRANSACTION_STATUS)
        },
        {
            title: translate('form.field.note'),
            dataIndex: 'note',
            render: renderField
        },
        {
            title: translate('transaction.field.fee'),
            dataIndex: 'fee',
            render: (dom: any, row: any) => row?.fee ? renderField(row?.fee, 'currency') : 0
        },
        {
            title: translate('form.field.createdAt'),
            dataIndex: 'createdAt',
            width: 170,
            sorter: false,
            render: (val: any) => renderField(val, 'datetimes') || '-'
        },
        {
            title: translate('form.field.updatedAt'),
            dataIndex: 'updatedAt',
            width: 170,
            sorter: false,
            render: (val: any) => renderField(val, 'datetimes') || '-'
        },
    ]

    useEffect(() => {
        const getRefundHistoryList = async (params?: any, options?: any) => {
            if (paymentBillId) {
                setIsLoading(true)
                const resp = await getRefundTransInBill(paymentBillId)
                if (!resp?.success) message.error(translate('refund.message.list.failed'))
                if (resp?.data) {
                    setData(resp?.data)
                    setRefundHistory(resp.data)
                }
                setIsLoading(false)
                // return resp
            }
        }
        getRefundHistoryList()
    }, [paymentBillId, reloadTable])

    return (
        <Card className='card-mt'>
            <div className="header">
                <div className="title">
                    {translate('transaction.title.refund.history')}
                </div>
            </div>
            <div className="content" style={{ paddingTop: 0 }}>
                {/* <Table
                    reloadTable={reloadTable}
                    columns={columns}
                    getListFunc={getRefundHistoryList}
                    addAction={false}
                    editAction={false}
                    removeAction={false}
                    searchAction={false}
                    dateAction={false}
                    exportExcel={false}
                    showActionColumn={false}
                /> */}

                <Table
                    columns={columns}
                    dataSource={data ? data : undefined}
                    pagination={{ position: ['none', 'none'] }}
                />
            </div>
        </Card>
    )
}

export default RefundHistory;