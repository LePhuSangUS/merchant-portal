import React, { useEffect, useMemo, useState } from 'react'
import { Button, FormSelect, Modal, FormItem } from '@/components'
import { translate, parseOptions } from '@/utils'
import { Form, Input, ModalFuncProps, Space } from 'antd'
import { propertyEqual, propertyNotEqual } from '@/utils/curry'
import { checkMaxLength, rejectOnlySpace, requiredField, requiredSelect } from '@/utils/rules'
import { message } from '@/utils'
import { DefaultOptionType } from 'antd/lib/select'
import { updatePaymentBills } from '@/services/transaction-history/api'

interface UpdateStateModalProps extends ModalFuncProps {
    state: string;
    billId: string;
    dftOptions: DefaultOptionType[] | undefined;
    fullOptions: DefaultOptionType[] | undefined;
    willUpdate: Record<string, string>;
    reloadTransactionDetail: () => void;
}

const UpdateStateModal: React.FC<UpdateStateModalProps> = ({ state, billId, dftOptions, fullOptions, willUpdate, reloadTransactionDetail, ...props }) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [statusValue, setStatusValue] = useState<string>(state)
    const hardOption = useMemo(() => dftOptions?.find(propertyEqual('value', state)), [dftOptions, state])
    const willUpdateOption = useMemo(() => fullOptions?.find(propertyEqual('value', willUpdate?.[state])), [willUpdate, state])

    const onFinish = async (values: any) => {
        setIsSubmit(true)
        const { _id, ...rest } = values
        const resp = await updatePaymentBills(_id, rest)
        
        setIsSubmit(false)
        if(resp?.success) {
            reloadTransactionDetail()
            props?.onCancel?.()
            message.success(translate('transaction.updateState.message.success'))
        } else {
            message.error(translate('transaction.updateState.message.failed'))
        }
    }

    const handleFieldChange = (changedValues: any, allValues: any) => {
        if (changedValues?.state) setStatusValue(changedValues?.state)
    }

    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            // onOk={handleOkConversionConfirmModal}
            // onCancel={handleCloseUpdateStateModal}
            footer={null}
            title={translate("transaction.title.updateStatus")}
        >
            <Form
                // form={form}
                name="export-customer"
                labelCol={{ span: 8 }}
                labelAlign="left"
                wrapperCol={{ span: 16 }}
                initialValues={{
                    _id: billId,
                    state
                }}
                onFinish={onFinish}
                autoComplete="off"
                style={{ marginTop: '20px' }}
                requiredMark={true}
                onValuesChange={handleFieldChange}
            >
                <Form.Item
                    name="_id"
                    hidden={true}
                >
                    <Input/>
                </Form.Item>

                <FormSelect
                    options={[hardOption, willUpdateOption] as DefaultOptionType[]}
                    name="state"
                    label={translate('transaction.field.status')}
                    placeholder={translate('form.placeholder.pleaseSelect')}
                    rules={[requiredSelect]}
                />
                <Form.Item
                    name="note"
                    label={translate('transaction.field.note')}
                    rules={[
                        requiredField,
                        checkMaxLength(150),
                        rejectOnlySpace
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>

                <FormItem style={{ textAlign: 'right', marginTop: '15px' }} wrapperCol={{ span: 24 }}>
                    <Space>
                        <Button onClick={() => props?.onCancel?.()}>
                            {translate('form.button.cancel')}
                        </Button>
                        <Button type="primary" htmlType="submit" disabled={isSubmit || state === statusValue}>
                            {translate('form.button.ok')}
                        </Button>
                    </Space>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default UpdateStateModal