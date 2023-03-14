
import React, { useEffect, useRef, useState } from 'react'
import { nonAccentVietnamese, translate,} from '@/utils'
import { Moment } from 'moment'
import { checkMaxLength, requiredField } from '@/utils/rules';
import _, { reject } from "lodash";
import { Modal, Row, Button, message } from "antd";
import type { FormInstance } from 'antd';
import { FormSelect, ProForm, FormText, FormRadio } from '@/components';
import { getBanks, addBank } from "@/services/profile/api";
import {getMerchantProfile} from "@/services/profile/api"
interface IProps {
    [key: string]: any;
}


const AddBankModal: React.FC<IProps> = (props) => {
    const { onClose, handleRefreshPayoutConfigs } = props;


    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormInstance>();
    const [accountType, setAccountType] = useState("ACCOUNT");
    const [merchantInfo, setMerchantInfo] = useState<any>(null);
    const handleCreateBank: any = async (values: any) => {
        setLoading(true);
        const data = {
            ...values,
            accountType,

        }
        const resp: any = await addBank(data);
        if (resp.success) {
            message.success(translate("message_add_bank_success"))
            onClose();
            handleRefreshPayoutConfigs();

        } else {
            message.error(resp?.message || "message_add_bank_failed")
        }
        setLoading(false)
    }

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

    const getMerchantName = () => {
        return merchantInfo?.identityName || ""
    }

    const checkMerchantIsEnterprise = () => {
        return merchantInfo?.businessType === "CORPORATION"
    }

    const createValidator = () => {
        return accountType === "CARD" ? [
            {
                pattern: /^(9704|35|51|52|53|54|55|37|4).*$/,
                message: translate('balance.card-number-invalid')
            },
            {
                pattern: /^(?=[0-9]*$)(?:.{16}|.{20})$/,
                message: translate('balance.card-number-invalid')
            },
        ] : [

            {
                min: 1,
                message: translate("balance.account-number-too-short", "", {
                    number: 1,
                })
            },
            {
                max: 20,
                message: translate("balance.account-number-too-long", "", {
                    number: 20,
                })

            },
        ]
    }

console.log(merchantInfo)

    useEffect(() => {
        (async function () {
            const resp = await getMerchantProfile();
            if (!resp.success) {
                message.error(resp?.message || translate('page.profile.message.profile.get.failed'));
                return;
            }
            setMerchantInfo(resp?.data)
        })()
    }, [])


    return (
        <Modal
            {...props}
            visible={true}
            title={translate("add_new_account")}
            onCancel={onClose}
            footer={null}

        >
            <ProForm

                formRef={formRef}
                className="form"
                submitter={{
                    searchConfig: {
                        submitText: translate('pages.changePassword.button.submit'),
                    },
                    render: (props, dom) => <Row justify='space-between'>
                        <Button danger onClick={onClose}>{translate("cancel")}</Button>
                        <Button loading={loading} type='primary' onClick={() => { props?.submit() }}>{translate("add_new_account")}</Button>
                    </Row>,

                }}

                onFinish={handleCreateBank}
            >
                <FormRadio.Group
                    options={accountTypes}
                    fieldProps={{
                        value: accountType,
                        onChange: (e: any) => {
                            const value: any = e?.target?.value;
                            setAccountType(value);
                            formRef.current?.resetFields();
                        }
                    }}
                    style={{
                        width: "100%"

                    }} >
                </FormRadio.Group>
                <FormText
                    name="bankAccount"
                    rules={[
                        requiredField,
                        ...createValidator()
                    ]}
                    normalize={value => (value?.replace(/[^0-9]/g, ''))}
                    placeholder={translate('form.placeholder.pleaseEnter')}

                />
                <FormSelect
                    name="bankCode"
                    label={translate('bank_select')}
                    rules={[
                        requiredField
                    ]}
                    placeholder={translate('form.placeholder.pleaseSelect')}
                    request={async () => {
                        const resp = await getBanks();
                        if (resp.success) {
                            return resp?.data?.map((item: any) => {
                                return {
                                    label: item?.shortName,
                                    value: item?.bankCode
                                }
                            }) || []
                        }
                        return []
                    }}
                    fieldProps={{

                    }}
                />
                <FormText
                    name="branch"
                    label={translate('bank_branch')}
                    rules={[
                        // requiredField,
                        {
                            max: 50,
                            message: translate('form.message.field.length')

                        },

                    ]}
                    placeholder={translate('form.placeholder.pleaseEnter')}

                />
                <FormText
                    name="accountName"
                    label={translate('account_name')}
                    normalize={value => ((nonAccentVietnamese(value)?.toUpperCase() || ''))?.replace(/[\"\'~`!@#$%^&()_={}[\]:;,.<>+\/?-]+|\d+|^\s+$/g, '').replace(/\s+/ig, ' ')}
                    rules={[
                        requiredField,
                        {
                            validator: async (rule, value: any) => {

                                //todo : If the customer is a business, the same name will not be checked
                                if (checkMerchantIsEnterprise()){
                                    return;
                                }
                                const textValue = value?.trim();
                                const merchantName = nonAccentVietnamese(getMerchantName() || '')?.toUpperCase();
                                if (textValue && merchantName ) {
                                    return await new Promise(async (resolve: any, reject: any) => {
                                        if (textValue !== merchantName) {
                                            reject(translate("balance.validation.accountNameMatchMerchantName"));
                                        } else {
                                            resolve();
                                        }

                                    })
                                } else {
                                  return Promise.reject(translate("balance.validation.accountNameMatchMerchantName"))  
                                }
                            }
                        }

                    ]}
                    placeholder={translate("form.placeholder.pleaseEnter")}
                    extra={checkMerchantIsEnterprise()?"":translate("balance.extra.accountNameMatchMerchantName")}

                />

            </ProForm>
        </Modal>
    )
}

export default AddBankModal;