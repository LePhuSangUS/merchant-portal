import React, { useState } from 'react'
import { isEmpty } from 'lodash';
import { Moment } from 'moment'

import { Button, FormSelect, Icons, Modal, DateRangePicker, Form, FormItem } from '@/components'
import { translate, rangeDateLimitSelect } from '@/utils'
import { rageDateLimitPast } from '@/utils/utils';
import { useExport, useGetSysConfig } from '@/hooks';
import { requiredRangeDate } from '@/utils/rules';
import { parseOptionsSysConfig } from '@/utils/parse';

const { DownloadOutlined } = Icons
const MAX_DAYS_EXPORT = 31
const LIMITED_PAST_TYPE = 'months'
const LIMITED_PAST_AMOUNT = 6
const DATE_FORMAT = 'YYYY-MM-DD'

interface ExportModalProps {
    [key: string]: any;
}

const ExportModal: React.FC<ExportModalProps> = ({paymentChannel, ...props}) => {
    const [dates, setDates] = useState<Moment[]>([])
    const billStatus = useGetSysConfig('BILL_STATUS')
    const paymentChannelList = isEmpty(paymentChannel) ?  useGetSysConfig('PAYMENT_CHANNEL') : paymentChannel
    const [isExporting, exportExcel] = useExport(props?.exportExcelFunc, props?.onCancel)

    const onFinish = async (values: any) => {
        const { rangeDate: [_dateFr, _dateTo], ...rest } = values
        const params = {
            dateFr: _dateFr.format(DATE_FORMAT),
            dateTo: _dateTo.format(DATE_FORMAT),
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
            // onOk={handleOkConversionConfirmModal}
            // onCancel={handleCloseExportModal}
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
                    options={parseOptionsSysConfig(paymentChannelList)}
                    name="channelID"
                    label={translate('transaction.exportModal.label.paymentChannel')}
                    placeholder={translate('transaction.exportModal.label.placeholder.select')}
                />
                <FormSelect
                    options={parseOptionsSysConfig(billStatus)}
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