import React, { useState } from 'react'
import { Moment } from 'moment'
import {  DISBURSEMENT_REQUEST_STATUS } from "@/constants"

import { Button, FormSelect, Icons, Modal, DateRangePicker, Form, FormItem, FormText } from '@/components'
import { translate, rangeDateLimitSelect, parseOptions } from '@/utils'
import { rageDateLimitPast } from '@/utils/utils';
import { useExport, useGetSysConfig } from '@/hooks';
import { requiredRangeDate } from '@/utils/rules';
import { convertFromDateToDateToISOString} from '@/utils/format'

const { DownloadOutlined } = Icons
const MAX_DAYS_EXPORT = 31
const LIMITED_PAST_TYPE = 'months'
const LIMITED_PAST_AMOUNT = 6

interface ExportModalProps {
    [key: string]: any;
}

const ExportModal: React.FC<ExportModalProps> = ({paymentChannel, ...props}) => {
    const [dates, setDates] = useState<Moment[]>([])
    const [isExporting, exportExcel] = useExport(props?.exportExcelFunc, props?.onCancel)

    const onFinish = async (values: any) => {
        const { rangeDate: [_dateFr, _dateTo], ...rest } = values;
        const params = {
            ...convertFromDateToDateToISOString(_dateFr,_dateTo),

            ...rest
        }
        exportExcel(params)
    }

    const disabledDate = (current: Moment): boolean => {
        const limitRange = rangeDateLimitSelect(dates, MAX_DAYS_EXPORT)(current)
        const limitPast = rageDateLimitPast(LIMITED_PAST_TYPE, LIMITED_PAST_AMOUNT)(current)
        return limitRange || limitPast
    }


    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            footer={null}
            visible={true}
        >
            <Form
                name="export-customer"
                labelCol={{ span: 7 }}
                labelAlign="left"
                wrapperCol={{ span: 13 }}
                initialValues={{}}
                onFinish={onFinish}
                autoComplete="off"
                style={{ marginTop: '20px' }}
                requiredMark={false}
            >
                <FormItem name="rangeDate" label={translate('form.field.creationTime')} rules={[requiredRangeDate]}>
                    <DateRangePicker disabledDate={disabledDate} onCalendarChange={(val: Moment[]) => setDates(val)} />
                </FormItem>
                <FormSelect
                    options={parseOptions(DISBURSEMENT_REQUEST_STATUS)}
                    name="status"
                    label={translate('Disbursement_Request.Status')}
                    placeholder={translate('form.placeholder.pleaseSelect')}
                />
                <FormText
                    name="refCode"
                    label={translate('Disbursement_Request.Ref_Code')}
                    placeholder={translate('form.placeholder.pleaseEnter')}
                />
                <FormText
                    name="requestId"
                    label={translate('Disbursement_Request.Request_Code')}
                    placeholder={translate('form.placeholder.pleaseEnter')}
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