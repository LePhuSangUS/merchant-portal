
import BankInfoItem from "../components/BankInfoItem"
import { connect } from 'dva';
import Slider from "react-slick";
import styles from "./TopupModal.less"
import _ from "lodash";
import React, { useRef, useState } from 'react';
import { ProForm, FormText, FormSelect, FormCheckbox, } from "@/components"
import { translate } from "@/utils";
import { requiredField, checkEmailValid } from "@/utils/rules";
import type { FormInstance } from 'antd';
import { Modal, Row, Button, message, Form, Input, InputNumber } from "antd";
import { DISBURSEMENT_SUPPORT_CURRENCY } from "@/constants/local-storage.const"
import { getUser } from '@/utils/storage';
import { FormAmount } from "@/components/FormField";
import FormItem from "antd/es/form/FormItem";
import numeral from "numeral"
// var numeral = require('numeral');
const ModalAddWalletCurrency = (props: any) => {
    const { onCancel,requestList, selected,dispatch, toggleReloadData } = props;
    const formRef = useRef<FormInstance>();
    const [loading, setLoading] = useState(false);
    // const { dispatch, disbursement } = props;
    const userData = getUser();
    const checkId = (prev:any, next:any) => {
        return prev.value == next.currency
    }
    
    const disbursementSupportCurrency = userData?.[DISBURSEMENT_SUPPORT_CURRENCY]
    const disbursementSupportCurrencyOptions = _.differenceWith(disbursementSupportCurrency,requestList,checkId)

    const onSubmit: any = (values: any) => {

        if (selected) {
            const extraData = values?.extraData || {};
            dispatch({
                type: 'disbursement/updateWallet',
                payload: {
                    id: selected?._id,
                    extraData: {
                        ...extraData,
                        warningLimit:numeral(extraData?.warningLimit)?._value||0
                    }
                },
                callbackFailed: () => {
                },
                callbackSuccess: () => {
                    message.success(translate("disbursement.Adjust_Limit_Notification_Success"));
                    toggleReloadData();
                    onCancel()
                }
            })  
        } else {
            dispatch({
                type: 'disbursement/registration',
                payload: {
                    ...values,
                    currencies:[values?.currencies]
                },
                callbackFailed: () => {
                },
                callbackSuccess: () => {
                    message.success(translate("disbursement.Activate_Foreign_Currency_Limit_Success"));
                    toggleReloadData();
                    onCancel()
                }
            })   
        }


    }

    const renderForm = () => {
        return <ProForm
            formRef={formRef}
            initialValues={{
                currencies: selected?.currency,
                extraData:{...selected?.extraData,warningLimit: numeral(selected?.extraData?.warningLimit)?.format("0,0.[00]")|| "10,000"}
            }}
            submitter={{
                render: (props, dom) => <Row justify='space-between'>
                    <Button danger onClick={onCancel}>{translate("form.button.close")}</Button>
                    <Button  loading={loading} type='primary' onClick={() => { props?.submit() }}>{translate("form.button.submit")}</Button>

                </Row>,

            }}
            onFinish={onSubmit}
            layout='horizontal'>
            <FormSelect
                disabled={selected}
                name="currencies"
                label={translate("disbursement.Foreign_Currency")}
                placeholder={translate("form.placeholder.pleaseSelect")}
                rules={[requiredField]}
                options={disbursementSupportCurrencyOptions}
                fieldProps={{
                    getPopupContainer: (triggerNode) => {
                        return triggerNode.parentNode as any;
                    }
                }}
            />

            <Form.Item
                name={["extraData", "warningLimit"]}
                label={translate('disbursement.Warning_Amount')}
                rules={[requiredField,]}


            >
                <Input
                    onBlur={(e) => {
                        console.log("Vale", e.target.value);
                        const amount = numeral(e?.target?.value).format("0,0.[00]");
                        // setAmount(amount);
                        formRef.current?.setFieldsValue({
                            extraData: {
                                warningLimit:amount
                        }})
                    }}
                    // value={amount}
                    placeholder={translate("form.placeholder.pleaseEnter")}

                />

            </Form.Item>

            <FormText
                name={["extraData", "warningEmail"]}
                label={translate('disbursement.Email_Notification')}
                placeholder={translate("form.placeholder.pleaseEnter")}
                rules={[requiredField,
                    checkEmailValid(),
                ]} />

        </ProForm>

    }
    // useEffect(() => {
    //     dispatch({
    //         type: 'disbursement/getConfig',
    //         payload: {},
    //     })
    // }, [])

    return (
        <Modal
            visible={true}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            title={translate(!selected ? "disbursement.Activate_Foreign_Currency_Limit" : "disbursement.Adjust_Limit_Notification")}
            footer={null}
            width="450px"
            bodyStyle={{
                marginBottom: "60px"
            }}
        >
            {renderForm()}
        </Modal>
    )
}

export default connect((props: any) => ({
    ...props
}))(ModalAddWalletCurrency);