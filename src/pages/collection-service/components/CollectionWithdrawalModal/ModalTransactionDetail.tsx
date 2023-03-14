
import React, { Fragment, useEffect, useState } from 'react'
import { Modal, message, Empty, Row, Col, Typography } from 'antd'
import _ from "lodash";
import { getTransactionById } from "@/services/profile/api"
import { renderField, translate } from '@/utils';
import { Status } from '@/components';
import { DetailFieldItem } from '@/components/DetailPage'
import moment from 'moment';
import { TRANSACTION_STATUS_LIST } from "@/constants"

const { Title } = Typography;
interface IProps {
    transactionId: string | undefined | null,
    onCancel: () => void;
}

const ExportModal = (props: IProps) => {

    const { onCancel, transactionId } = props;


    const [transactionData, setTransactionData] = useState({});

    useEffect(() => {
        (async function () {
            if (transactionId) {
                const resp = await getTransactionById(transactionId);
                if (resp?.success) {
                    setTransactionData(resp.data)
                } else {
                    message.error(resp.message || translate("balance.get-transaction-failed"))
                }

            }

        })();
    }, [transactionId])

    const mappingDataGeneralInformation = [
        {
            id: "1",
            label: translate("balance.field.date"),
            content: renderField(moment(), "datetimes"),
        },
        {
            id: "2",
            label: translate("balance.field.transactionId"),
            content: "42342424324234",
        },
        {
            id: "3",
            label: translate("balance.field.amount"),
            content: renderField(10000,"currency")
        },
        {
            id: "4",
            label: translate("balance.field.status"),
            content:<Status value={"CLOSED"} options={TRANSACTION_STATUS_LIST}></Status>
        },
        {
            id: "5",
            label: translate("balance.reason"),
            content: "Khác",
        },
    ]
    const mappingDataDetail = [
        {
            id: "1",
            label: translate("balance.field.destination"),
            content: "MB BANK",
        },
        {
            id: "2",
            label: translate("balance.field.branchName"),
            content: "CN 2 Hội Sở",
        },
        {
            id: "3",
            label: translate("balance.field.accountNumber"),
            content: "09818747743",
        },
        {
            id: "4",
            label: translate("balance.field.accountName"),
            content: "Nguyen Thi My Tho",
        },
    ]
    const renderGeneralInformation = () => {
        return <Row>
            <Col sm={24} xs={24}>
                <Title level={4}>{translate("balance.general-information")}</Title>
            </Col>
            <Col sm={24} xs={24}>
                {
                    mappingDataGeneralInformation?.map((item: any) => {
                        return <DetailFieldItem
                            label={item?.label}
                            content={item?.content}
                            key={item?.id}
                            colConfig={{
                                xs: 24,
                                sm: 24,
                                md: 24,
                                lg: 24,
                            }}
                            childColConfig={{
                                label: {
                                    xs: 24,
                                    sm: 10,
                                    md: 8,
                                    lg: item?.isFullRow ? 6 : 12,
                                    xxl: item?.isFullRow ? 4 : 8
                                },
                                content: {
                                    xs: 24,
                                    sm: 14,
                                    md: 16,
                                    lg: item?.isFullRow ? 18 : 12,
                                    xxl: item?.isFullRow ? 20 : 16
                                }
                            }}
                        />
                    })
                }
            </Col>
        </Row>
    }
    const renderDetail = () => {
        return <Row>
            <Col sm={24} xs={24}>
                <Title level={4}>{translate("balance.detail")}</Title>
            </Col>
            <Col sm={24} xs={24}>
                {
                    mappingDataDetail?.map((item: any) => {
                        return <DetailFieldItem
                            label={item?.label}
                            content={item?.content}
                            key={item?.id}
                            colConfig={{
                                xs: 24,
                                sm: 24,
                                md: 24,
                                lg: 24,
                            }}
                            childColConfig={{
                                label: {
                                    xs: 24,
                                    sm: 10,
                                    md: 8,
                                    lg: item?.isFullRow ? 6 : 12,
                                    xxl: item?.isFullRow ? 4 : 8
                                },
                                content: {
                                    xs: 24,
                                    sm: 14,
                                    md: 16,
                                    lg: item?.isFullRow ? 18 : 12,
                                    xxl: item?.isFullRow ? 20 : 16
                                }
                            }}
                        />
                    })
                }
            </Col>
        </Row>
    }


    return (
        <Modal
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            footer={null}
            visible={true}
            title={translate("balance.transaction-detail")}
        >

            {
                !_.isEmpty(transactionData) ? <Empty /> : <Fragment>
                    {renderGeneralInformation()}
                    {renderDetail()}

                </Fragment>
            }
        </Modal>
    )
}

export default ExportModal