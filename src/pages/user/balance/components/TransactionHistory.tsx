import { Card, PageLoading, ProColumns, ProTable, FormSelect, Status, Icons, FormText } from "@/components"
import { MERCHANT_TRANSACTION_STATUS_LIST, TRANSACTION_TYPES_LIST } from "@/constants"
import { renderField, translate, message, format, parseOptions } from "@/utils"
import { FC, Fragment, useState } from "react"
const { EyeOutlined } = Icons
import { getWithdrawHistory ,exportExcel} from '@/services/profile/api';
import ExportModal from "../components/ExportModal";
import ModalTransactionDetail from "../components/ModalTransactionDetail";
import {useSetState} from "react-use"
interface PageProps {
    history: any,
    reloadTransaction:any
  }

const TransactionHistory: FC<PageProps> = ({history,reloadTransaction }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showExportModal, setShowExportModal] = useState<boolean>(false)
    const [modalTransactionDetail, setModalTransactionDetail] = useSetState({
        open: false,
        transactionId:null,
    })
    const columns: ProColumns[] = [
        {
            title: translate('balance.field.type'),
            dataIndex: 'transType',
            width: 200,
            sorter: true,
            render: (dom) => <Status value={dom} options={TRANSACTION_TYPES_LIST} />
        },
        {
            title: translate('Creation time'),
            dataIndex: 'createdAt',
            width: 180,
            sorter: true,
            render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
        },
        {
            title: translate('balance.field.transactionId'),
            dataIndex: 'transId',
            width: 200,
            sorter: true,
            render: renderField
        },
        // {
        //     title: translate('balance.field.destination'),
        //     dataIndex: 'destination',
        //     width: 220,
        //     sorter: true,
        //     render: (dom: any, row: any) => renderField("sacombank")
        // },
        {
            title: translate('balance.field.amount'),
            dataIndex: 'value',
            width: 150,
            sorter: true,
            render: (dom: any, row: any) => renderField(row?.value, 'currency')
        },
        {
            title: translate('balance.field.status'),
            dataIndex: 'status',
            width: 150,
            sorter: true,
            render: (dom) => <Status value={dom} options={MERCHANT_TRANSACTION_STATUS_LIST} />

        }
    ]
    const queryColumns: ProColumns[] = [
        {
            title: translate('balance.field.transactionId'),
            key: 'transId',
            dataIndex: 'transId',
            renderFormItem: () => (
                <FormText
                    placeholder={translate('form.placeholder.pleaseEnter')}
                />
            ),
            sorter: true
        },
        {
            title: translate('balance.field.status'),
            key: "status",
            dataIndex: "status",
            width: 80,
            renderFormItem: () => (
                <FormSelect
                    name="state"
                    placeholder={translate('form.placeholder.pleaseSelect')}
                    options={parseOptions(MERCHANT_TRANSACTION_STATUS_LIST)}
                />
            ),
            sorter: true
        },
        {
            title: translate('Creation time'),
            key: 'transDate',
            dataIndex: 'createdAt',
            editable: false,
            width: 150,
            valueType: "dateRange",
            search: {
                transform: (value: any) => {
                    return {
                        dateFr: value[0],
                        dateTo: value[1]
                    };
                }
            },
            sorter: true,
            render: (dom: any) => format.date(dom)
        },
    ]

    const handleGetWithdrawHistory = async (params?: any, options?: any) => {
        //todo : tạm ẩn để đưa lên production do chỉ có UI 

        setIsLoading(true)
        const resp = await getWithdrawHistory(params, options);
        setIsLoading(false)

        if (!resp?.success)
            message.error(resp?.message || translate('balance.message.changeHistory.get.failed'))
        return resp
    }

    const handleCloseExportModal = () => setShowExportModal(false)
    const handleOpenExportModal = () => setShowExportModal(true)

    return (<Fragment>

        <Card className='card-mt'>
            <div className="content" style={{ paddingTop: 0 }}>
                <PageLoading active={isLoading} />
                <ProTable
                    columns={columns}
                    getListFunc={handleGetWithdrawHistory}
                    addAction={false}
                    editAction={false}
                    removeAction={false}
                    searchAction={false}
                    dateAction={false}
                    exportExcel={false}
                    reloadTable={reloadTransaction}
                    //todo : tạm ẩn để đưa lên production do chỉ có UI 
                    // exportExcelFunc={handleOpenExportModal}
                    queryColumns={queryColumns}

                    titlePage={
                        <div className='grid-title'>
                            {translate('balance.title.transaction')}
                        </div>
                    }
                    //todo : tạm ẩn để đưa lên production do chỉ có UI
                    showActionColumn={false}
                    
                    // extraButtons={(record: any) => (
                    //     <EyeOutlined
                    //         title={translate('form.button.detail')}
                    //         onClick={() => {
                    //             setModalTransactionDetail({
                    //                 open: true,
                    //                 transactionId: record?._id,
                    //             })
                    //         }}
                    //     />
                    // )}

                />
            </div>
        </Card>


        {showExportModal && <ExportModal
            visible={showExportModal}
            onCancel={handleCloseExportModal}
            exportExcelFunc={exportExcel}
        />}
        {
            modalTransactionDetail?.open && <ModalTransactionDetail transactionId={modalTransactionDetail?.transactionId} onCancel={() => {
                setModalTransactionDetail({open:false})
            }} />
        }
    </Fragment>

    )
}

export default TransactionHistory