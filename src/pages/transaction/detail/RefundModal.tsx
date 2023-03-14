import { PageLoading } from "@/components"
import { FormAmount, FormCheckbox, FormRadio, FormSelect } from "@/components/FormField"
import { getBanks } from "@/services/profile/api"
import { getAccountNameByBank } from "@/services/refund/api"
import { format, translate, message, getUser } from "@/utils"
import { propertyEqual } from "@/utils/curry"
import { parseNumberToCurrency, parseOptions, parseCurrencyToIntNumber } from "@/utils/parse"
import { checkMaxLength, rejectOnlySpace, requiredField, requiredSelect } from "@/utils/rules"
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form"
import { FormInstance, Modal, ModalFuncProps } from "antd"
import { debounce } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"
import _ from "lodash";
interface RefundModalProps extends ModalFuncProps {
    row: any;
    createSubmit: any;
    visible: boolean;
}

const { confirm } = Modal

const MIN_AMOUNT_DEFAULT = 12345;
const MAX_AMOUNT_DEFAULT = 987654321;
const RefundModal = ({ row, createSubmit, visible, ...props }: RefundModalProps) => {
    const [isAmountDisable, setIsAmountDisable] = useState<boolean>(false);
    const isRefundBanktransfer = row?.channelID === 'BANK_TRANSFER'
    const [form] = ProForm.useForm()
    const [banks, setBanks] = useState<any[]>([]);
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [accountName, setAccountName] = useState<string>('');
    const [accountType, setAccountType] = useState("ACCOUNT");

    const accountTypes = [
        {
            label: translate("account_number"),
            value: "ACCOUNT"
        },
        {
            label: translate("card_number"),
            value: "CARD"
        },
    ]
    const transactionRules = getUser()?.rules;
    const fieldsWalletRulesObject = _.keyBy(transactionRules?.REFUND_REQUEST_WALLET?.fields || [], 'fieldName');
    const fieldsBankTranferRulesObject = _.keyBy(transactionRules?.REFUND_REQUEST_BANK_TRANSFER?.fields || [], 'fieldName');
    const fieldsCCRulesObject = _.keyBy(transactionRules?.REFUND_REQUEST_CC?.fields || [], 'fieldName');
    const fieldsATMRulesObject = _.keyBy(transactionRules?.REFUND_REQUEST_ATM?.fields || [], 'fieldName');

    const _getConditionAmount = () => {
        switch (row?.channelID) {
            case "NEOPAY_WALLET":
                return fieldsWalletRulesObject?.amount?.conditions;
            case "ATM":
                return fieldsATMRulesObject?.amount?.conditions;
            case "CC":
                return fieldsCCRulesObject?.amount?.conditions;
            case "BANK_TRANSFER":
                return fieldsBankTranferRulesObject?.amount?.conditions;
            default:
                return fieldsWalletRulesObject?.amount?.conditions;
        }
    }

    const getMax = () => {
        return (((row?.amount || 0) - (row?.refundedAmount || 0)) > (_getConditionAmount()?.max||0))?(_getConditionAmount()?.max||0):((row?.amount || 0) - (row?.refundedAmount || 0))
    }
    const getMin = () => {
        return (((row?.amount || 0) - (row?.refundedAmount || 0)) > (_getConditionAmount()?.min||0))?(_getConditionAmount()?.min||0):((row?.amount || 0) - (row?.refundedAmount || 0))
    }

    const confirmBeforeRefund = (values: any) => {
        confirm({
            title: translate('transaction.title.notice'),
            icon: null,
            content: translate('refund.message.confirmRefund'),
            okText: translate('form.button.agree'),
            cancelText: translate('form.button.close'),
            onOk: async () => {
                setisLoading(true)
                await createSubmit({
                    ...values,
                    bankName: banks?.find(propertyEqual('bankCode', values?.bankCode))?.shortName,
                    accountType
                })
                setisLoading(false)
            },
            onCancel() { },
            className: 'neo-confirm-modal'
        });

        return Promise.resolve()
    }
    useEffect(() => {
        const handleGetAllBank = async () => {
            const resp = await getBanks()
            if (!resp?.success)
                message.error(translate('guarantee-account.message.getBankFailed'))
            setBanks(resp?.data)
        }

        handleGetAllBank()
    }, [])

    const handleGetAccountNameByBank = async (params: any) => {
        try {
            const resp = await getAccountNameByBank(params)
            if (!resp?.success) {
                // setOrderIdMessage(resp?.message)
                // setIsDuplicateOrderId(true)
                // form?.setFields([{ name: 'orderId', errors: [resp?.message] }])
            } else {
                // setIsDuplicateOrderId(false)
                const accountName = resp?.data?.resData?.data?.fullname
                setAccountName(resp?.data?.resData?.data?.fullname)
                form?.setFieldsValue({ accountName })
            }
        } catch (error) {

        }
    }

    const debounceGetAccountName = useCallback(debounce(val => handleGetAccountNameByBank(val), 500), [])

    return (
        <ModalForm
            key='CreateForm'
            title={translate('transaction.title.refund.create')}
            width="500px"
            onFinish={confirmBeforeRefund}
            form={form}
            visible={visible}
            modalProps={{
                onCancel: props?.onCancel
            }}
        >
            <PageLoading active={isLoading} />
            <ProFormText
                hidden
                disabled
                name="paymentId"
                initialValue={row?.id}
            />
            {
                isRefundBanktransfer &&
                <>
                    {/* <ProFormText
                        name="bankName"
                        label={translate('transaction.field.bankName')}
                        placeholder={translate('form.placeholder.pleaseEnter')}
                        rules={[requiredField]}
                    /> */}
                    <FormRadio.Group
                        name='accountType'
                        options={accountTypes}
                        fieldProps={{
                            value: accountType,
                            onChange: (e: any) => {
                                const value: any = e?.target?.value;
                                setAccountType(value);
                                form?.resetFields();
                            }
                        }}
                        style={{
                            width: "100%"

                        }} >
                    </FormRadio.Group>
                    <FormSelect
                        options={parseOptions(banks, 'bankCode', 'shortName')}
                        name="bankCode"
                        label={translate('transaction.field.bankName')}
                        placeholder={translate('form.placeholder.pleaseSelect')}
                        rules={[requiredSelect]}
                        showSearch
                        dependencies={['accountNumber']}
                        fieldProps={{
                            onChange(val) {
                                const cardNo = form?.getFieldValue('accountNumber')
                                const bankCode = val
                                if (bankCode && cardNo)
                                    debounceGetAccountName({ cardNo, bankCode })
                            }
                        }}
                    />
                    <ProFormText
                        name="accountNumber"
                        label={accountType === 'CARD' ? translate("card_number") : translate('transaction.field.bankAccount')}
                        placeholder={translate('form.placeholder.pleaseEnter')}
                        rules={[requiredField, checkMaxLength(accountType === "CARD" ? 19 : 50)]}
                        fieldProps={{
                            onChange(e) {
                                const cardNo = e.target.value
                                const bankCode = form?.getFieldValue('bankCode')
                                if (bankCode && cardNo)
                                    debounceGetAccountName({ cardNo, bankCode })
                            }
                        }}
                        dependencies={['bankCode']}
                        normalize={(value: any, prevValue: any, prevValues: any) => {
                            const patterm = accountType === "CARD" ? /[^0-9]/g : /[^0-9a-zA-Z]/g
                            const failedValue = patterm.test(`${value}`)
                            return (failedValue ? prevValue || '' : value)
                        }}
                    />
                    {
                        accountName ?
                            <ProFormText
                                name="accountName"
                                fieldProps={{
                                    value: accountName
                                }}
                                readonly={!!accountName}
                                label={translate('transaction.field.accountName')}
                                placeholder={translate('form.placeholder.pleaseEnter')}
                                rules={[requiredField, checkMaxLength(50)]}
                                normalize={(value: any, prevValue: any, prevValues: any) => {
                                    const failedValue = /[^a-zA-Z]/g.test(`${value}`)
                                    return (failedValue ? prevValue || '' : value).toUpperCase()
                                }}
                            /> :
                            <ProFormText
                                name="accountName"
                                label={translate('transaction.field.accountName')}
                                placeholder={translate('form.placeholder.pleaseEnter')}
                                rules={[requiredField, checkMaxLength(50)]}
                                normalize={(value: any, prevValue: any, prevValues: any) => {
                                    const failedValue = /[^a-zA-Z ]/g.test(`${value}`)
                                    return (failedValue ? prevValue || '' : value).toUpperCase()
                                }}
                            />
                    }
                </>
            }
            <FormAmount
                name="amount"
                minAmount={_getConditionAmount()?.min||MIN_AMOUNT_DEFAULT}
                maxAmount={_getConditionAmount()?.max || MAX_AMOUNT_DEFAULT}
                label={translate('refund.field.refundAmount')}
                rules={[requiredField,
                    ({ getFieldValue }: any) => ({
                        validator(_: any, value: any) {
                            const amount = parseCurrencyToIntNumber(value); 
                            const amountAllowed = (row?.amount || 0) - (row?.refundedAmount || 0);
                            if (amount && (amount >amountAllowed)) {
                                return Promise.reject(new Error(translate('form.message.amount.allowed',"",{amount:format?.currency(amountAllowed) })))
                            }
                            return Promise.resolve();

                        },
                    }),


                ]}                disabled={isAmountDisable}
            />

            <FormCheckbox fieldProps={{
                onChange(e) {
                    const checked = e.target.checked
                    if (checked) {
                        form?.setFieldsValue({
                            amount: parseNumberToCurrency(row.amount - (row?.refundedAmount || 0))
                        })
                        setIsAmountDisable(true)
                    } else {
                        setIsAmountDisable(false)
                    }
                }
            }}>
                {translate('transaction.field.refundAllPaymentAmount')}
            </FormCheckbox>

            <ProFormTextArea
                name="note"
                label={translate('form.field.note')}
                placeholder={translate('form.field.note')}
                rules={[
                    requiredField,
                    checkMaxLength(250),
                    rejectOnlySpace
                ]}
            />
        </ModalForm>
    )
}

export default RefundModal