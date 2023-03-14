
import React, { useState, useEffect, useRef } from 'react'
import { ProForm, Icons, FormItem } from '@/components'
import { parseValue, translate, } from '@/utils';
import { requiredField, } from '@/utils/rules';
import { Radio, Row, Space, Button, Modal, message, ModalFuncProps } from 'antd';
import BankOptionItem from "./BankOptionItem"
import AutomaticWithdrawal from "./AutomaticWithdrawal"
import _ from "lodash";
import { FormAmount } from '@/components/FormField';
import { useToggle, useSetState } from 'react-use';
import { getWalletInfo, payoutConfigs, getFeePayoutRequest } from "@/services/profile/api";
import BankNameItem from "./BankNameItem";
import { createCollectionPayoutRequest, getCollectionPayoutConfigs } from '@/services/collection-service/api';
import { connect } from 'dva';
const { WalletTwoTone, ExclamationCircleOutlined } = Icons;

const MIN_AMOUNT = 10000;

const { confirm } = Modal;


interface ExportModalProps extends ModalFuncProps {
    [key: string]: any;
}

const CollectionWithdrawalModal: React.FC<ExportModalProps> = ({ onCancel, walletBalance, toggleRefreshWalletBalance, onReloadTransactionHistory, ...props }) => {
    const formRef = useRef<any>();
    const [loading, setLoading] = useState(false);

    const [payoutType, setPayoutType] = useState<any>("WALLET");
    const [refreshPayoutConfigs, toggleRefreshPayoutConfigs] = useToggle(false)
    const [refreshWalletInfo, toggleRefreshWalletInfo] = useToggle(false)
    const [state, setState] = useSetState<any>({
        isLoading: false,
        walletInfo: null,
        payoutConfigs: null,
    });

    const { dispatch, collectionService, user } = props;
    const { greenWallet } = collectionService;

    const handleRefreshPayoutConfigs = () => {
        toggleRefreshPayoutConfigs()
    }
    const handleRefreshWalletInfo = () => {
        toggleRefreshWalletInfo()
    }
    const handleWithdrawal = async (data: any) => {
        const resp = await createCollectionPayoutRequest(data);
        if (resp.success) {
            if(resp?.data?.status === 'REJECTED') {
                message.error(translate(resp?.data?.message));
            } else {
                message.success(translate("balance.message.withdraw.request.success"));
            }
            toggleRefreshWalletBalance();
            onReloadTransactionHistory?.();
            return Promise.resolve(true);
        } else {
            message.error(translate(resp.message || "balance.message.withdraw.request.failed"))
        }
    }
    const handleSubmit: any = (values: any) => {
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
                merchantId: user?.merchantInfo?.id
            };

        }
        confirm({
            title: translate("balance.confirm-withdrawal-money"),
            icon: <ExclamationCircleOutlined />,
            content: translate("balance.are-you-sure"),
            okText: translate("form.button.agree"),
            onOk: async () => {
                const isSuccess = await handleWithdrawal(data);
                if (isSuccess) onCancel?.();
            },
            onCancel() { },
        });
    }

    useEffect(() => {
        (async () => {
            const payoutConfigsResp = await getCollectionPayoutConfigs();
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
        // {
        //     label: translate("withdraw_to_wallet"),
        //     content: < WalletOptionItem payoutType={payoutType} walletInfo={state?.walletInfo} handleRefreshWalletInfo={handleRefreshWalletInfo} />,
        //     value: "WALLET"
        // },
        {
            label: translate("withdraw_to_bank"),
            content: <BankOptionItem payoutType={payoutType} payoutConfigs={state?.payoutConfigs} banks={bankList} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} onSetPayoutType={handleSetPayoutType} />,
            value: "BANK"
        },
    ]

    const renderForm = () => {
        return <ProForm
            formRef={formRef}
            onFinish={handleSubmit}
            submitter={{
                render: (props, dom) => <Row justify='space-between' style={{
                    marginTop: "20px",
                    borderTop: "1px solid gray",
                    paddingTop: "10px"
                }}>
                    <Button danger onClick={onCancel}>{translate("cancel")}</Button>
                    <Button disabled={checkDisable()} loading={loading} type='primary' onClick={() => { props?.submit() }}>{translate("confirm_withdrawal")}</Button>
                </Row>,

            }}

        >
            <FormAmount
                label={parseValue({ vi: 'Số tiền rút', en: 'Withdraw amount' })}
                placeholder={parseValue({ vi: 'Nhập số tiền', en: 'Enter amount' })}
                minAmount={MIN_AMOUNT}
                messageMaxAmount={translate("balance.insufficient_wallet_balance")}
                maxAmount={greenWallet?.balance || 1}
                rules={[requiredField]}
            />
            <Radio.Group name='payoutType' value={payoutType} onChange={handleChangePayoutType} style={{
                width: "100%"
            }} >
                {
                    optionItemMapping?.map((item: any, index: number) => {
                        const key = `${item.value}-${index}`;
                        return <Space key={key} direction='vertical' style={{
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


    return (
        <Modal
            {...props}
            onCancel={onCancel}
            closable={true}
            maskClosable={false}
            title={translate("withdraw_request")}
            footer={null}
        >
            {renderForm()}
        </Modal>
    )
}

export default connect(({ dispatch, collectionService, user }: any) => ({
    dispatch,
    collectionService,
    user
}))(CollectionWithdrawalModal);