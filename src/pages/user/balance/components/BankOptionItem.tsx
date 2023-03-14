
import React, { Fragment, useState, } from 'react'
import { Card, Icons, Button, Space, FormItem } from '@/components'
import { translate } from '@/utils';
import { useToggle } from 'react-use';
import styles from "./BankOptionItem.less";
import AddBankModal from "./AddBankModal"
import { removeBank } from "@/services/profile/api";
import { requiredSelect } from '@/utils/rules';
import _ from "lodash"
import { Typography, Radio, Empty, Row, Modal, message } from "antd";
const { confirm } = Modal;

const { DeleteFilled, ExclamationCircleOutlined } = Icons;
const { Title, Text } = Typography;

const BankOptionItem = (props:any) => {
    const { banks, handleRefreshPayoutConfigs, payoutConfigs, payoutType, onSetPayoutType } = props || {};
    const [showAddBank, toggleShowAddBank] = useToggle(false);
    const [showDelete, toggleShowDelete] = useToggle(false);
    const handleRemoveBank = async (bankId: string) => {
        let title = translate("are_you_sure_to_delete");
        let content = translate("message_press_save_to_confirm");

        if (payoutConfigs?.isAuto && bankId === payoutConfigs?.payoutBankId) {
            title = translate("warning");
            content = translate("message_delete_bank_warning");
        }

        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            content: content,
            okText: translate("save"),
            onOk: async () => {
                const resp = await removeBank(bankId);
                if (resp.success) {
                    handleRefreshPayoutConfigs()
                    message.success(translate("message_delete_bank_success"))
                } else {
                    message.error(resp?.message || "message_delete_bank_failed")
                }
            },
            onCancel() { },
        });

    }

    const renderBankList = () => {
        return <Fragment>
            <FormItem
                name="bankId"
                rules={(payoutType === "BANK") ? [requiredSelect] : []}
                style={{ width: "100%"}}

            >
                <Radio.Group
                    style={{width: "100%"}}
                    onChange={() => {
                        if (payoutType !== "BANK") {
                            onSetPayoutType("BANK")
                        }
                    }}
                >
                    {
                        banks?.map((item: any) => {
                            return <Space style={{
                                width: "100%",
                                padding: "10px 0",
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <Radio value={item?.value}>{item?.label}</Radio>

                                {showDelete && <DeleteFilled
                                    onClick={() => {
                                        handleRemoveBank(item?.id);
                                    }}
                                    style={{
                                        fontSize: "18px",
                                        cursor: "pointer"
                                    }} />}
                            </Space>
                        })
                    }
                </Radio.Group>
            </FormItem>

        </Fragment>

    }

    return (
        <Fragment>
            <Card className={styles.component} >
                <Row justify='space-between'>
                    <Title level={5}>{translate("bank_info")}</Title>
                    {!_.isEmpty(banks) && <Text onClick={toggleShowDelete} style={{ cursor: "pointer" }}>{showDelete ? translate("balance.complete") : translate("balance.edit")}</Text>}
                </Row>
                <Row className={styles.bankList}  >
                    {!_.isEmpty(banks) ? renderBankList() : <Empty />}
                </Row>
                <Row justify="center">
                   { (showDelete||_.isEmpty(banks))&&<Button type="primary" onClick={toggleShowAddBank}>{translate("add_new_account")}</Button>}
                </Row>
            </Card>
            {showAddBank && < AddBankModal onClose={toggleShowAddBank} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} />}
        </Fragment>

    )
}

export default BankOptionItem
