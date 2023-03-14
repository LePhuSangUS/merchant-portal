import { Card, PageLoading, ProColumns, ProTable, FormSelect, Status, Icons, FormText } from "@/components"
import { MERCHANT_TRANSACTION_STATUS_LIST, TRANSACTION_TYPES_LIST } from "@/constants"
import { renderField, translate, message, format, parseOptions } from "@/utils"
import { Fragment, useState } from "react"
import { getHistoriesTopupAPI} from '@/services/disbursement/api';
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"


const TransactionHistory= ({ history,currency}:any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const columns: ProColumns[] = [
        {
            title: translate('Disbursement_Limit.Created_At'),
            dataIndex: 'createdAt',
            width: 200,
            render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
        },
        {
            title: translate('Disbursement_Limit.Request_Code'),
            dataIndex: 'requestId',
            width: 180,
        },
        {
            title: translate('Disbursement_Limit.Amount'),
            dataIndex: 'value',
            width: 200,
            sorter: true,
            render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.value)
        },
        {
            title: translate('Disbursement_Limit.From'),
            dataIndex: 'accountSender',
            width: 150,
            render: (dom: any, row: any) => renderField(row?.accountSender)
        },
        {
            title: translate('Disbursement_Limit.To'),
            dataIndex: 'accountReceiver',
            width: 150,
            render: (dom: any, row: any) => renderField(row?.accountReceiver)

        },
        {
            title: translate('Disbursement_Limit.Account_Number'),
            dataIndex: 'state',
            width: 150,
            render: (dom: any, row: any) => renderField(row?.accountNumber)

        }
    ]

    const getHistoriesTopup = async (params?: any, options?: any) => {
        setIsLoading(true);
        let resp:any = {};
        if (currency) {
            resp = await getHistoriesTopupAPI({ ...params, currency }, options);
            setIsLoading(false)
    
            if (!resp?.success)
                message.error(resp?.message || translate('balance.message.changeHistory.get.failed'))
            return resp
        } else {
            resp = await getHistoriesTopupAPI(params, options);
            setIsLoading(false)
    
            if (!resp?.success)
                message.error(resp?.message || translate('balance.message.changeHistory.get.failed'))
            return resp  
        }

    }


    return (<Fragment>

        <Card className='card-mt'>
            <div className="content" style={{ paddingTop: 0 }}>
                <PageLoading active={isLoading} />
                <ProTable
                    columns={columns}
                    getListFunc={getHistoriesTopup}
                    addAction={false}
                    reloadTable={currency}
                    editAction={false}
                    removeAction={false}
                    searchAction={false}
                    dateAction={false}
                    exportExcel={false}
                    titlePage={
                        <div className='grid-title' style={{ textTransform: 'none' }}>
                            {translate('Disbursement_Limit.Topup_Histories')}
                        </div>
                    }
                    showActionColumn={false}

                />
            </div>
        </Card>
    </Fragment>

    )
}

export default TransactionHistory