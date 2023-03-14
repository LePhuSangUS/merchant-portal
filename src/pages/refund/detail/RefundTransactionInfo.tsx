import { CardHeader, Table } from "@/components";
import { Card } from "antd";
import { FC, useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";

import { getRefundTrans } from "@/services/refund/api";
import { translate, message, renderField } from "@/utils"
import { renderStatus } from "@/utils/render"
import { REFUND_TRANSACTION_STATUS } from "@/constants/refund.constant";

const RefundTransactionInfo: FC<{ transId: string }> = ({ transId }) => {
    const [data, setData] = useState<any>()

    useEffect(() => {
        const handleGetRefundTrans = async () => {
            if (transId) {
                const resp = await getRefundTrans(transId)
                if (!resp?.success) message.error(translate('bill.message.list.error'))
                setData(resp?.data)
            }
        }
        handleGetRefundTrans()
    }, [transId])

    const columns: ColumnsType = [
        {
            title: translate('refund.field.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: any) => renderField(value, 'datetimes')
        },
        {
            title: translate('refund.field.refundId'),
            dataIndex: 'transId',
            key: 'transId',
        },
        {
            title: translate('refund.field.refundAmount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (value: any) => value ? renderField(value, 'currency') : ''
        },
        {
            title: translate('form.field.status'),
            dataIndex: 'status',
            key: 'status',
            render: renderStatus(REFUND_TRANSACTION_STATUS)
        },
        {
            title: translate('refund.field.fee'),
            dataIndex: 'fee',
            render: (dom: any, row: any) => row?.fee ? renderField(row?.fee, 'currency') : 0
        },
        {
            title: translate('refund.field.failReason'),
            dataIndex: 'failedReason',
            key: 'failedReason',
        },
        {
            title: translate('refund.field.updatedAt'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: any) => renderField(value, 'datetimes')
        },
    ]

    return (
        <Card className='card-mt'>
            <CardHeader title={translate('refund.title.refundTransactionInfo')} />
            <div className="content">
                <Table
                    columns={columns}
                    dataSource={data ? [data] : undefined}
                    pagination={{ position: ['none', 'none'] }}
                />
            </div>
        </Card>
    )
}

export default RefundTransactionInfo