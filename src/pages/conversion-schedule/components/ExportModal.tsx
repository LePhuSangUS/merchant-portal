import React, { useState } from 'react'
import { Button, FormSelect, Icons, Modal, DateRangePicker, Form, FormItem } from '@/components'
import { translate, getSelectOptionsFromConstant, rangeDateLimitSelect } from '@/utils'
import { CONVERSION_STATUS_LIST, } from '@/constants'
import { Moment } from 'moment'
import {getGoldStore } from "@/services/conversion-schedule-gold/api";

const { DownloadOutlined } = Icons
const MAX_DAYS_EXPORT = 31

interface ExportModalProps {
    [key: string]: any;
}

const ExportModal: React.FC<ExportModalProps> = (props) => {
    const [dates, setDates] = useState<Moment[]>([])
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const onFinish = async (values:any) => {
        setIsExporting(true)
        const { rangeDate: [_dateFr, _dateTo],status,storeId } = values
        const params = {
            dateFr: _dateFr.format('YYYY-MM-DD'),
            dateTo: _dateTo.format('YYYY-MM-DD'),
            status,
            storeId
        }

        await props?.exportExcelFunc(params)
        setIsExporting(false)
        props?.onCancel()
    }

    const rangeDateRules = [
        {
            type: 'array' as const,
            required: true,
            message: translate('form.message.select.required')
        }
    ]


    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            // onOk={handleOkConversionConfirmModal}
            // onCancel={handleCloseExportModal}
            footer={null}
        >
            <Form
                name="export-customer"
                labelCol={{ span: 6 }}
                labelAlign="left"
                wrapperCol={{ span: 14 }}
                initialValues={{}}
                onFinish={onFinish}
                autoComplete="off"
                style={{ marginTop: '20px' }}
            >
                <FormItem name="rangeDate" label={translate('investment.conversionSchedule.label.createdAt')} rules={rangeDateRules}>
                    <DateRangePicker disabledDate={rangeDateLimitSelect(dates, MAX_DAYS_EXPORT)} onCalendarChange={(val: Moment[]) => setDates(val)} />
                </FormItem>

                <FormSelect
                    options={getSelectOptionsFromConstant(CONVERSION_STATUS_LIST)}
                    name="status"
                    label={translate('investment.conversionSchedule.label.status')}
                    placeholder={translate('investment.conversionSchedule.placeholder.select')}
                />
                <FormSelect

                    name="storeId"
                    label={translate('investment.conversionSchedule.field.store')}
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

                <FormItem style={{ textAlign: 'center', marginTop: '15px' }} wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<DownloadOutlined />} disabled={isExporting}>
                        {translate('form.button.export')}
                    </Button>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default ExportModal