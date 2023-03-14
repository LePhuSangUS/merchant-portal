
import React, { useState } from 'react'
import { Button, FormSelect, Icons, Modal, DateRangePicker, Form, FormItem } from '@/components'
import { translate, parseOptions, rangeDateLimitSelect, parseValue } from '@/utils'
import { Moment } from 'moment'
import {  TRANSACTION_STATUS_LIST } from '@/constants';
import _ from "lodash";

const { DownloadOutlined } = Icons
const MAX_DAYS_EXPORT = 31

interface ExportModalProps {
    [key: string]: any;
}

const ExportModal: React.FC<ExportModalProps> = (props) => {
    const [dates, setDates] = useState<Moment[]>([])
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const onFinish = async (values: any) => {
        setIsExporting(true)
        const { rangeDate: [_dateFr, _dateTo], state, linkChannel,bankCode } = values
        const params = {
            dateFr: _dateFr.format('YYYY-MM-DD'),
            dateTo: _dateTo.format('YYYY-MM-DD'),
            state,
            linkChannel,
            bankCode
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
                labelCol={{ span: 8 }}
                labelAlign="left"
                wrapperCol={{ span: 14 }}
                initialValues={{}}
                onFinish={onFinish}
                autoComplete="off"
                style={{ marginTop: '20px' }}
                requiredMark={false}
            >
                <FormItem name="rangeDate" label={translate('form.field.createdAt')} rules={rangeDateRules}>
                    <DateRangePicker disabledDate={rangeDateLimitSelect(dates, MAX_DAYS_EXPORT)} onCalendarChange={(val: Moment[]) => setDates(val)} />
                </FormItem>

                <FormSelect
                    name="status"
                    label={translate('balance.field.status')}
                    placeholder={translate('form.placeholder.pleaseSelect')}
                    options={parseOptions(TRANSACTION_STATUS_LIST)}
                    fieldProps={{
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