import { CardHeader, Table } from "@/components";
import { Card } from "antd";
import { FC, useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";

import { getPaymentInfo } from "@/services/refund/api";
import { translate, message, renderField } from "@/utils"
import { renderStatus } from "@/utils/render"
import { TRANSACTION_CHANNELS_LIST } from "@/constants";

const OrderInfo: FC<{ paymentId: string, history: any, billId: string|number }> = ({ paymentId, history, billId }) => {
    const [orderInfo, setOrderInfo] = useState<any>()
    
    useEffect(() => {
        const handleGetOrderInfo = async () => {
            if (paymentId) {
                const resp = await getPaymentInfo(paymentId)
                if (!resp?.success) message.error(translate('bill.message.list.error'))
                setOrderInfo(resp?.data)
            }
        }
        handleGetOrderInfo()
    }, [paymentId])

    const columns: ColumnsType = [
        {
            title: translate('refund.field.billId'),
            dataIndex: 'orderID',
            key: 'orderID',
            render: (val: string) => <a onClick={() => {
                history.push(`/pg/transaction/${billId}`)
              }}>{val}</a>
        },
        {
            title: translate('refund.field.paymentCode'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: translate('refund.field.transAmount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (value: any) => value ? renderField(value, 'currency') : ''
        },
        {
            title: translate('refund.field.paymentChannel_full'),
            dataIndex: 'channelID',
            key: 'channelID',
            render: renderStatus(TRANSACTION_CHANNELS_LIST)
        },
        {
            title: translate('refund.field.refundedAmount'),
            dataIndex: 'refundedAmount',
            key: 'refundedAmount',
            render: (value: any) => value ? renderField(value, 'currency') : ''
        },
        {
            title: translate('refund.field.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: any) => renderField(value, 'datetimes')
        },
        {
            title: translate('refund.field.updatedAt'),
            dataIndex: 'lastUpdatedAt',
            key: 'lastUpdatedAt',
            render: (value: any) => renderField(value, 'datetimes')
        },
    ]

    return (
        <Card className='card-mt'>
            <CardHeader title={translate('refund.title.orderInfo')} />
            <div className="content">
                <Table
                    columns={columns}
                    dataSource={[orderInfo]}
                    pagination={{ position: ['none', 'none'] }}
                />
            </div>
        </Card>
    )
}

export default OrderInfo