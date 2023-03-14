import React, { useCallback, useState } from 'react'
import { Moment } from 'moment'
import { ModalProps } from 'antd';

import { Button, FormSelect, Icons, Modal, DateRangePicker, Form, FormItem } from '@/components'
import { translate, rangeDateLimitSelect, parseOptions } from '@/utils'
import { REFUND_STATUS_LIST } from "@/constants";
import { requiredRangeDate } from '@/utils/rules';
import { useExport } from '@/hooks';

const { DownloadOutlined } = Icons
const MAX_DAYS_EXPORT = 31
const DATE_FORMAT = 'YYYY-MM-DD'

interface ExportModalProps extends ModalProps {
    exportExcelFunc: (params: any) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onCancel, exportExcelFunc, ...props }) => {
    const [dates, setDates] = useState<Moment[]>([])
    const [isExporting, exportExcel] = useExport(exportExcelFunc, onCancel)

    const onFinish = useCallback(async (values: any) => {
        const { rangeDate: [_dateFr, _dateTo], ...rest } = values
        const params = {
            dateFr: _dateFr?.format(DATE_FORMAT),
            dateTo: _dateTo?.format(DATE_FORMAT),
            ...rest
        }
        exportExcel(params)
    }, [])
    const disabledDate = (current: Moment): boolean => rangeDateLimitSelect(dates, MAX_DAYS_EXPORT)(current)

    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            footer={null}
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
                <FormItem name="rangeDate" label={translate('transaction.exportModal.label.createdAt')} rules={[requiredRangeDate]}>
                    <DateRangePicker disabledDate={disabledDate} onCalendarChange={(val: Moment[]) => setDates(val)} />
                </FormItem>

                <FormSelect
                    options={parseOptions(REFUND_STATUS_LIST)}
                    name="state"
                    label={translate('transaction.exportModal.label.status')}
                    placeholder={translate('transaction.exportModal.label.placeholder.select')}
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