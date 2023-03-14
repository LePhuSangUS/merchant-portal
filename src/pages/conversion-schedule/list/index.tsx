import React, { useRef, useState } from "react"
import { Container, ProTable, PageLoading, Icons, FormText, FormSelect, Status,Row } from '@/components'
import { translate, format, parseValue, renderField, message } from '@/utils'
import { ActionType, ProColumns } from "@ant-design/pro-table"
import { getConversionScheduleList, exportExcel, getGoldStore } from "@/services/conversion-schedule-gold/api";
import { CONVERSION_STATUS_LIST } from '@/constants'
import ExportModal from '../components/ExportModal'

const { EyeOutlined } = Icons
interface Props {
    history: any,
    route: any

}

const ConversionScheduleList: React.FC<Props> = ({ history,route }) => {

    const actionRef = useRef<ActionType>();
    const [showExportModal, setShowExportModal] = useState<boolean>(false)

    const columns = [
        {
            title: translate('investment.conversionSchedule.label.neopayId'),
            dataIndex: 'neoId',
            width: 100,
            hideInSearch: true,
        },
        {
            title: translate('investment.conversionSchedule.label.investorName'),
            dataIndex: 'customerName',
            width: 180,
            hideInSearch: true,
        },
        {
            title: translate('investment.conversionSchedule.label.createdAt'),
            dataIndex: 'createdAt',
            sorter: true,
            width: 180,
            hideInSearch: true,
            render: (dom: any) => renderField(dom, 'datetimes')
        },
        {
            title: translate('investment.conversionSchedule.label.appointmentDate'),
            dataIndex: 'appointmentTime',
            sorter: true,
            width: 180,
            hideInSearch: true,
            render: (dom: any,record:any) => renderField(record?.appointmentTime, 'datetimes')
        },
        {
            title: translate('investment.conversionSchedule.label.exchangeDate'),
            dataIndex: 'exchangeSuccessAt',
            sorter: true,
            width: 180,
            hideInSearch: true,
            render: (dom: any,record:any) => renderField(record?.exchangeSuccessAt, 'datetimes')
        },
        {
            title: translate('investment.conversionSchedule.label.quantity'),
            dataIndex: 'quantity',
            sorter: true,
            width: 150,
            hideInSearch: true,
            render: (dom: any) => <Row>{renderField(dom, 'currency')}&nbsp;<span>{translate("investment.conversionScheduleDetail.label.mace")}</span></Row> 

        },
        {
            title: translate('investment.conversionSchedule.label.status'),
            dataIndex: 'status',
            width: 120,
            hideInSearch: true,
            sorter:true,
            render: (dom: any) => dom ? <Status value={dom} options={CONVERSION_STATUS_LIST} /> : '-'
        },
        {
            title: translate('investment.conversionSchedule.label.store'),
            dataIndex: 'store',
            // width: 120,
            hideInSearch: true,
            render: (dom: any,record:any) => record?.tradeDetail?.storeInfo?.name ?record?.tradeDetail?.storeInfo?.name : '-'

        },
    ]
    const queryColumns: ProColumns<any>[] = [
        {
            title: translate('investment.conversionSchedule.label.neopayId'),
            dataIndex: 'neoId',
            renderFormItem: () => (
                <FormText
                    placeholder={translate('investment.conversionSchedule.placeholder.pleaseEnter')}
                />
            ),
        },
        {
            title: translate('investment.conversionSchedule.label.createdAt'),
            key: 'transDate',
            dataIndex: 'createdAt',
            editable: false,
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
        {
            title: translate('investment.conversionSchedule.field.status'),
            key: "status",
            dataIndex: "status",
            renderFormItem: () => (
                <FormSelect
                    name="status"
                    placeholder={translate('investment.conversionSchedule.placeholder.select')}
                    options={
                        
                        CONVERSION_STATUS_LIST?.map(item => {
                            return {
                                ...item,
                                label: parseValue(item?.label),
                                
                            }
                        })
                       }
                />
            ),
            sorter: true
        },
        {
            title: translate('investment.conversionSchedule.field.store'),
            key: "storeId",
            dataIndex: "storeId",
            renderFormItem: () => (
                <FormSelect
                    name="store"
                    placeholder={translate('investment.conversionSchedule.placeholder.select')}
                    request={async ({ }) => {
                        const resp:any= await getGoldStore();            
                        return resp?.data?resp?.data?.map((el:any)=>{
                            return {
                                label: el?.name ||"-" ,
                                value: el?.id
                           }
                        }):[]
                      }}
                />
            ),
            sorter: true
        },
    ]

    const getConversionSchedule = async (params?: any, options?: any) => {
        const resp = await getConversionScheduleList(params, options)
        if (!resp?.success)
            message.error(translate('investment.conversionScheduleDetail.message.list.failed'))
        return resp
    }

    const handleRedirectDetail = (id: string) => {
        history.push(`${route?.path}/${id}`)
    }
    const handleCloseExportModal = () => setShowExportModal(false)
    const handleOpenExportModal = () => setShowExportModal(true)


    return (
        <Container>
            <PageLoading />
            <ProTable
                hideSelectAll
                columns={columns}
                removeAction={false}
                exportExcel={true}
                editAction={false}
                addAction={false}
                searchAction={false}
                dateAction={false}
                queryColumns={queryColumns}
                getListFunc={getConversionSchedule}
                exportExcelFunc={handleOpenExportModal}
                extraButtons={(row: any) => (
                    <EyeOutlined
                        title={translate('form.button.detail')}
                        onClick={() => handleRedirectDetail(row?.id)}
                    />
                )}
                actionRef={actionRef}
            />
                        {showExportModal && <ExportModal
                visible={showExportModal}
                // onOk={handleOkConversionConfirmModal}
                onCancel={handleCloseExportModal}
                exportExcelFunc={exportExcel}
            />}
        </Container>
    )
}

export default ConversionScheduleList