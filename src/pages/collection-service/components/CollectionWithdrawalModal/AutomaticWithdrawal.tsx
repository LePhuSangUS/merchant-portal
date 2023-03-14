
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Icons, Button, Space, ProForm, FormRadio } from '@/components'
import { translate, format, parseValue } from '@/utils';
import { useToggle, useSetState } from 'react-use';
import styles from "./AutomaticWithdrawal.less";
import { Typography, Empty, Modal, Tooltip, Switch, Row, message } from "antd";

import { requiredSelect } from '@/utils/rules';
import _ from 'lodash';
import { updateCollectionPayoutConfig } from '@/services/collection-service/api';
const { InfoCircleOutlined, ExclamationCircleOutlined } = Icons;
const { Title, Text } = Typography;
const { confirm } = Modal;

const ModalSelectBank = ({ onClose, payoutBankIdDefault, banks, handleRefreshPayoutConfigs = () => { } }: any) => {

    const formRef = useRef<any>();
    const [loading, setLoading] = useState(false);

    const handleSetAutoBank: any = async (values: any) => {
        setLoading(true)
        const { autoBankId } = values;
        // if (payoutBankId) {
        const payoutType = "BANK";
        // let payoutId = payoutBankId;
        // if (payoutBankId === "NEO_PAY") {
        //     payoutType = "WALLET";
        //     payoutId = "";
        // }
        const resp = await updateCollectionPayoutConfig({
            isAuto: true,
            payoutType,
            autoBankId
        });

        if (resp.success) {
            message.success(translate("message_auto_withdraw_success"))
            handleRefreshPayoutConfigs()
            onClose();
        } else {
            message.error(resp?.message || "message_auto_withdraw_failed")
        }
        // }

        setLoading(false)


    }
    return <Modal
        visible={true}
        footer={null}
        onCancel={onClose}
        title={translate("balance.automatic-withdrawal-source")}

    >
        <ProForm

            formRef={formRef}
            className={styles.withdrawForm}
            initialValues={{
                autoBankId: payoutBankIdDefault
            }}
            submitter={{

                render: (props, dom) => <Row justify='space-between'>
                    <Button danger onClick={onClose}>{translate("cancel")}</Button>
                    <Button loading={loading} disabled={_.isEmpty(banks)} type='primary' onClick={() => { props?.submit() }}>{translate("choose")}</Button>
                </Row>,

            }}
            onFinish={handleSetAutoBank}
        >
            {
                banks?.length ?
                    <FormRadio.Group
                        name={"autoBankId"}
                        rules={[requiredSelect]}
                        options={banks}
                        style={{
                            width: "100%"
                        }}
                    />
                    : <Empty />
            }
        </ProForm>

    </Modal>
}

const AutomaticWithdrawal: React.FC<any> = (props) => {
    const { payoutConfigs, mergeWalletBank, handleRefreshPayoutConfigs = () => { } } = props || {};
    const { isAuto } = payoutConfigs || {};
    const [state, setState] = useSetState<any>({
        isLoading: false,
        isAuto: false,
        showSelectBank: false

    })
    const [showSelectBank, toggleSelectBank] = useToggle(false)
    const onChange = (checked: any) => {
        if (checked) {
            toggleSelectBank()
        }
        else {
            confirm({
                title: translate("are_you_sure_to_cancel"),
                icon: <ExclamationCircleOutlined />,
                content: parseValue({ vi: 'Chọn OK để hủy', en: 'Click OK to cancel' }),
                onOk: async () => {
                    const resp = await updateCollectionPayoutConfig({
                        autoBankId: 'string',
                        isAuto: false,
                        payoutType: 'BANK'
                    });

                    if (resp.success) {
                        message.success(translate("message_cancel_auto_withdraw_success"))
                    } else {
                        message.error(resp?.message || "message_cancel_auto_withdraw_failed")
                    }
                    handleRefreshPayoutConfigs()
                },
                onCancel() { },
            });
        }
    }

    const getPayoutBankIdDefault = () => {
        const { payoutType, autoBankId, isAuto } = payoutConfigs;
        if (!isAuto) {
            return null;
        }
        if (payoutType === "BANK") {
            return autoBankId;
        } else if (payoutType === "WALLET") {
            return "NEO_PAY";

        }

    }

    const genBankAutoWithdrawal = () => {
        const { payoutType, autoBankId } = payoutConfigs;
        let payoutId = "";
        if (payoutType === "BANK") {
            payoutId = autoBankId;
        } else if (payoutType === "WALLET") {
            payoutId = "NEO_PAY";

        }

        const bankSelect = mergeWalletBank?.find((item: any) => item?.value === payoutId);
        return bankSelect?.label;
    }
    useEffect(() => {
        setState({
            isAuto
        })
    }, [payoutConfigs])

    return (
        <Fragment>
            <Space className={styles.component}>
                <Switch id="auto" checked={state?.isAuto} onChange={onChange} />
                <label htmlFor="auto">
                    <Text>{translate("automatic_withdrawal")}</Text>
                    <Tooltip
                        title={<div className={styles.tooltip}>
                            {translate("collection-service.autoCashOutTooltip")}
                        </div>}
                    >
                        <InfoCircleOutlined style={{
                            marginLeft: "10px"
                        }} />
                    </Tooltip>
                </label>
            </Space>
            {payoutConfigs?.isAuto && <div className={styles.selectedBank}>
                {genBankAutoWithdrawal()}
                <Button onClick={toggleSelectBank}>{translate("change")}</Button>
            </div>}


            {showSelectBank && <ModalSelectBank onClose={toggleSelectBank} banks={mergeWalletBank} payoutBankIdDefault={getPayoutBankIdDefault()} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} />}
        </Fragment>


    )
}

export default AutomaticWithdrawal