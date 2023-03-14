
import React, { Fragment } from 'react'
import { Card, Icons, Button, Space, FormItem } from '@/components'
import { parseValue, translate } from '@/utils';
import { useToggle } from 'react-use';
import styles from "./BankOptionItem.less";
import AddBankModal from "./AddBankModal"
import { requiredSelect } from '@/utils/rules';
import _ from "lodash"
import { Typography, Radio, Empty, Row, Modal, message } from "antd";
import { removeCollectionPayoutBank } from '@/services/collection-service/api';
const { confirm } = Modal;

const { DeleteFilled, ExclamationCircleOutlined } = Icons;
const { Title, Text } = Typography;

const WalletOptionItem = (props: any) => {
    const { banks, handleRefreshPayoutConfigs, payoutConfigs, payoutType, onSetPayoutType } = props || {};
    const [showAddBank, toggleShowAddBank] = useToggle(false);
    const [showDelete, toggleShowDelete] = useToggle(false);
    const handleRemoveBank = async (bankId: string) => {
        let title = translate("are_you_sure_to_delete");
        let content = translate("message_press_save_to_confirm");

        if (payoutConfigs?.isAuto && bankId === payoutConfigs?.autoBankId) {
            title = parseValue({ vi: 'Thông báo', en: 'Notice' });
            content = translate('collection-service.message.payOut.removeBank.desc');
        }

        confirm({
            title,
            icon: null,
            content,
            okText: translate("save"),
            onOk: async () => {
                const resp = await removeCollectionPayoutBank(bankId);
                if (resp.success) {
                    handleRefreshPayoutConfigs()
                    message.success(translate("message_delete_bank_success"))
                } else {
                    message.error(resp?.message || "message_delete_bank_failed")
                }
            },
            onCancel() { },
            className: 'neo-confirm-modal'
        });

    }

    const renderBankList = () => {
        return <Fragment>
            <FormItem
                name="bankId"
                rules={(payoutType === "BANK") ? [requiredSelect] : []}
                style={{
                    width: "100%"
                }}

            >
                <Radio.Group
                    style={{
                        width: "100%"
                    }}
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
                    {(showDelete || _.isEmpty(banks)) && <Button type="primary" onClick={toggleShowAddBank}>{translate("add_new_account")}</Button>}
                </Row>
            </Card>
            {showAddBank && < AddBankModal onClose={toggleShowAddBank} handleRefreshPayoutConfigs={handleRefreshPayoutConfigs} />}
        </Fragment>

    )
}

export default WalletOptionItem
