
import React, { useState, useEffect, useRef, Fragment, } from 'react'
import { ProForm, Icons, FormItem } from '@/components'
import { renderField, translate, format, getUser } from '@/utils';
import { requiredField, } from '@/utils/rules';
import { Radio, Row, Space, Button, Modal, message, Col } from 'antd';
import WalletOptionItem from "./WalletOptionItem"
import BankOptionItem from "./BankOptionItem"
import AutomaticWithdrawal from "./AutomaticWithdrawal"
import _ from "lodash";
import { FormAmount } from '@/components/FormField';
import { useToggle, useSetState } from 'react-use';
import { getWalletInfo, payoutConfigs, createPayoutRequest, getPayoutRequestFee, getConfigMaxMinPayoutRequest } from "@/services/profile/api";
import BankNameItem from "./BankNameItem";
const { WalletTwoTone, ExclamationCircleOutlined } = Icons;
import { LeftOutlined } from "@ant-design/icons";
import { parseCurrencyToIntNumber, parseNumberToCurrency } from "@/utils/parse";

const MIN_AMOUNT_DEFAULT = 12345;
const MAX_AMOUNT_DEFAULT = 987654321;
import styles from "./WithdrawalRequestModal.less"


interface ExportModalProps {
    [key: string]: any;
}
const DetailFieldItem = (item: any) => {
    return <Row style={{
        padding: "20px 0",
        borderTop: `${item?.dashed ? "1px dashed gray" : "none"}`
    }} justify='space-between'>
        <span>{item?.label}</span>
        <span>{item?.content}</span>
    </Row>
}

const WithdrawalRequestModal: React.FC<ExportModalProps> = (props) => {
    const { onClose = () => { }, walletBalance, toggleRefreshWalletBalance } = props;
    const formRef = useRef<any>();
    const [loading, toggleLoading] = useToggle(false);

    const [payoutType, setPayoutType] = useState<any>("WALLET");
    const [refreshPayoutConfigs, toggleRefreshPayoutConfigs] = useToggle(false)
    const [refreshWalletInfo, toggleRefreshWalletInfo] = useToggle(false)
    const [showCaculateFee, toggleShowCaculateFee] = useToggle(false)
    const [dataCalucator, setDataCalulate] = useState<any>(null)
    const [dataPayout, setDataPayout] = useState<any>(null);
    const [state, setState] = useSetState<any>({
        isLoading: false,
        walletInfo: null,
        payoutConfigs: null,
    })





//======================================================================

    const transactionRules = getUser()?.rules;


    const payoutRequestWalletRules = transactionRules?.PAYOUT_REQUEST_WALLET;
    const payoutRequestBankRules = transactionRules?.PAYOUT_REQUEST_BANK;

    const fieldsWalletRulesObject = _.keyBy(payoutRequestWalletRules?.fields || [], 'fieldName');
    const fieldsBankRulesObject = _.keyBy(payoutRequestBankRules?.fields || [], 'fieldName');

    const _getConditionAmount = () => {

        if (payoutType === "WALLET") {
            return fieldsWalletRulesObject?.amount?.conditions;
        }
        return fieldsBankRulesObject?.amount?.conditions;
}


 


    const handleRefreshPayoutConfigs = () => {
        toggleRefreshPayoutConfigs()
    }
    const handleRefreshWalletInfo = () => {
        toggleRefreshWalletInfo()
    }
    const handleWithdrawal = async (data: any) => {
        try {
            toggleLoading();
            const resp = await createPayoutRequest(data);
            if (resp.success) {
                message.success(translate("balance.message.withdraw.request.success"));
                onClose();
                toggleRefreshWalletBalance();
                return;
            } else {
                message.error(translate(resp.message || "balance.message.withdraw.request.failed"))
            }
        } catch (error) {
            
        } finally {
            toggleLoading();
        }
      
    }
    const handleSubmit: any = async (values: any) => {
        const value = Number(values?.amount.replaceAll(".", ''));
        let data: any = {
            value,
            payoutType
        };
        const bankId = values.bankId;
        const bankDetail = state?.payoutConfigs?.banks?.find((item: any) => item.id === bankId);
        if (payoutType === "BANK" && bankDetail) {
            data = {
                value,
                payoutType,
                bankCode: bankDetail?.bankCode,
                bankName: bankDetail.bankName,
                bankBranch: bankDetail.branch,
                bankAccountNumber: bankDetail.bankAccount,
                bankAccountName: bankDetail.accountName,
                accountType: bankDetail.accountType,
            };

        }

        const feeData: any = await getPayoutRequestFee({ payoutType, amount: data.value })
        if (feeData?.success && feeData?.data) {
            toggleShowCaculateFee();
            setDataCalulate({ ...data, ...feeData?.data });
            setDataPayout(data)
        }
    }

    useEffect(() => {
        (async () => {
            const walletInfoResp = await getWalletInfo();
            if (walletInfoResp.success) {
                setState({
                    walletInfo: walletInfoResp?.data,
                })
            }

        })();
    }, [refreshWalletInfo]);
    useEffect(() => {
        (async () => {
            const payoutConfigsResp = await payoutConfigs();
            if (payoutConfigsResp.success) {
                setState({
                    payoutConfigs: payoutConfigsResp?.data,
                })
            }

        })();

    }, [refreshPayoutConfigs])
    const bankList = state?.payoutConfigs?.banks?.map((item: any) => {
        return {
            ...item,
            label: <BankNameItem bankName={item?.bankName} bankAccount={item?.bankAccount} />,
            value: item?.id
        }
    }) || [];
    const mergeWalletBank = state?.walletInfo?.isLinked ? [...bankList, {
        label: <BankNameItem icon={<WalletTwoTone />} bankName={"NeoPay"} bankAccount={state?.walletInfo.walletAccount} />,
        value: "NEO_PAY"
    }] : [...bankList];

    const handleChangePayoutType = (e: any) => {
        setPayoutType(e?.target?.value);
        formRef.current.setFieldsValue({
            bankId: null
        })
    }
    const handleSetPayoutType = (type: string) => {
        setPayoutType(type)
    }
    const checkDisable = () => {
        if (payoutType === "WALLET" && state?.walletInfo?.isLinked) {
            return false
        } else if (payoutType === "BANK" && !_.isEmpty(state.payoutConfigs?.banks)) {
            return false;
        }
        return true
    }

    const optionItemMapping = [
        {
            label: translate("withdraw_to_wallet"),
            content: < WalletOptionItem payoutType={payoutType} walletInfo={state?.walletInfo} handleRefreshWalletInfo={handleRefreshWalletInfo} />,
            value: "WALLET"
        },
        {
            label: translate("withdraw_to_bank"),
            content: <BankOptionItem  payoutType={payoutType} payoutConfigs={state?.payoutConfigs} banks={bankList} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} onSetPayoutType={handleSetPayoutType} />,
            value: "BANK"

        },


    ]

    const renderForm = () => {
        return <ProForm
            formRef={formRef}
            onFinish={handleSubmit}
            submitter={{
                render: (props, dom) => <Row justify='space-between' className={styles.submitter}>
                    <Button danger onClick={onClose}>{translate("cancel")}</Button>
                    <Button disabled={checkDisable()} loading={loading} type='primary' onClick={() => { props?.submit() }}>{translate("form.button.next")}</Button>
                </Row>,

            }}

        >
            <FormAmount
                label={translate('page.paymentLink.createRequestPayment.amount.label')}
                placeholder={translate('page.paymentLink.createRequestPayment.amount.placeholder')}
                minAmount={_getConditionAmount()?.min || MIN_AMOUNT_DEFAULT}
                maxAmount={_getConditionAmount()?.max ||MAX_AMOUNT_DEFAULT}
                rules={[requiredField,
                    ({ getFieldValue }: any) => ({
                        validator(_: any, value: any) {
                            const amount = parseCurrencyToIntNumber(value);                            
                            if (amount && amount >( walletBalance?.greenWallet?.balance||0)) {
                                return Promise.reject(new Error(translate('balance.insufficient_wallet_balance')))
                            }
                            return Promise.resolve();

                        },
                    }),


                ]}
            />
            <Radio.Group name='payoutType' value={payoutType} onChange={handleChangePayoutType} style={{
                width: "100%"
            }} >
                {
                    optionItemMapping?.map((item: any) => {
                        return <Space direction='vertical' style={{
                            width: "100%",
                            margin: "10px 0"
                        }}>
                            <Radio disabled={item.disabled} value={item?.value}><span>{item?.label}</span></Radio>
                            {item?.content}
                        </Space>
                    })
                }
            </Radio.Group>
            <AutomaticWithdrawal payoutConfigs={state?.payoutConfigs} mergeWalletBank={mergeWalletBank} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} handleChangePayoutType={handleChangePayoutType} />
        </ProForm>
    }

    const renderFee = () => {
        const dataMappingFee = () => {
            switch (dataCalucator?.payoutType) {
                case "BANK":
                    return [
                        {
                            label: translate('balance.withdrawal'),
                            content: renderField(dataCalucator.bankName)
                        },
                        {
                            label: translate('balance.account-number'),
                            content: renderField(dataCalucator.bankAccountNumber)

                        },
                        {
                            label: translate('balance.account-name'),
                            content: renderField(dataCalucator.bankAccountName)

                        },
                        {
                            label: translate('balance.field.amount'),
                            content: renderField(dataCalucator?.value, "currency", "đ")

                        },
                        {
                            label: translate('balance.withdrawal-fee'),
                            content: renderField(dataCalucator?.fee, "currency", "đ")

                        },
                        {
                            label: translate('balance.total-amount'),
                            content: renderField(dataCalucator?.totalAmount, "currency", "đ"),
                            dashed: true,

                        },
                    ]
                default:
                    return [
                        {
                            label: translate('balance.withdrawal'),
                            content: renderField(translate("balance.neox"))
                        },
                        {
                            label: translate('balance.wallet-phone'),
                            content: renderField(state?.walletInfo?.walletAccount)

                        },
                        {
                            label: translate('balance.wallet-name'),
                            content: renderField(state?.walletInfo?.walletName)

                        },
                        {
                            label: translate('balance.field.amount'),
                            content: renderField(dataCalucator?.value, "currency", "đ")
                        },
                        {
                            label: translate('balance.withdrawal-fee'),
                            content: renderField(dataCalucator?.fee, "currency", "đ")

                        },
                        {
                            label: translate('balance.total-amount'),
                            content: renderField(dataCalucator?.totalAmount, "currency", "đ"),
                            dashed: true,

                        },
                    ]
            }

        }


        return <div className={styles.feeContainer}>
            <div>
                {(dataMappingFee() || [])?.map((item: any) => {
                    return <DetailFieldItem {...item} />
                })}
            </div>
            <Row justify='space-between' className={styles.submitter}>
                <Button danger onClick={onClose}>{translate("cancel")}</Button>
                <Button loading={loading} type='primary' onClick={() => handleWithdrawal(dataPayout)}>{translate("balance.confirm-withdrawal-money")}</Button>
            </Row>
        </div>
    }


    return (
        <Fragment>
            <Modal
                {...props}
                visible={true}
                closable={true}
                maskClosable={false}
                onCancel={onClose}
                title={showCaculateFee ? <Row className={styles.titleModalRequestDetail}> <LeftOutlined onClick={toggleShowCaculateFee} className={styles.arrowLeft} /> {translate("balance.request-detail")}</Row> : translate("withdraw_request")}
                footer={null}

            >
                <Row gutter={[32, 32]} style={{
                    flexWrap: "nowrap",
                    overflow: "hidden"
                }}>
                    <Col sm={24} xs={24} className={showCaculateFee ? "slide-exit-active" : "slide-exit"}>{renderForm()}</Col>
                    <Col className={showCaculateFee ? "slide-exit-active" : "slide-exit"} sm={24} xs={24}>{renderFee()}</Col>

                </Row>
            </Modal>
        </Fragment>

    )
}

export default WithdrawalRequestModal