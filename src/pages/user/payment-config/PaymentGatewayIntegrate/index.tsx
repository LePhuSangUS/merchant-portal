import React, { FC, Fragment, ReactNode, useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'

import { Card, Row, Col, Text, Switch, Icons, CardHeader } from '@/components'
import { parseValue, renderField, translate, message, format } from '@/utils'
import { getProperty } from '@/utils/curry'
import { updatePaymentMethod } from '@/services/profile/api'
import { getDetailPGConfig } from '@/services/pg-config/api'
import { useGetSysConfig } from '@/hooks'
import style from './style.less'
import { sortObjectArrayByArray } from '@/utils/utils'
import PGConfigModal from "./pg-config";
import { updateIPNForMerchantGw, getFeeConfig } from '@/services/pg-config/api';
import { Table } from "antd"
const { EditFilled } = Icons
const { confirm, warning } = Modal

// TODO: waiting sys config have order
const PAYMENT_METHOD_ORDER = ['NEOPAY_WALLET', 'ATM', 'CC', 'BANK_TRANSFER']


const PaymentGatewayIntegrate = () => {
    const [paymentMethodActiveList, setPaymentMethodActiveList] = useState<any[]>([]);
    const [paymentGatewayInfo, setPaymentGatewayInfo] = useState<any>();
    const [triggerSync, setTriggerSync] = useState<boolean>(false);
    const [openModalEdit, toggleOpenModalEdit] = useState<any>(false);
    const paymentMethod = sortObjectArrayByArray(useGetSysConfig('PAYMENT_METHOD'), PAYMENT_METHOD_ORDER, 'key')
    const paymentInfoFields = ['hashKey', 'ipnUrl']
    const [isLoading, setLoading] = useState<boolean>(false);
    const [feeConfig, setFeeConfig] = useState([])

    useEffect(() => {
        (async function () {
            const resp = await getDetailPGConfig();
            if (resp.success) {
                setPaymentMethodActiveList(resp?.data?.regChannels?.map(getProperty('id')) || []);
                setPaymentGatewayInfo(resp?.data);
            }
        })()

    }, [triggerSync])
    // useEffect(() => {
    //     (async function () {
    //         const resp = await getFeeConfig();
    //         if (resp.success) {
    //             setFeeConfig(resp?.data);
    //         }
    //     })()

    // }, [])


    const renderFee = (key: string) => {
        const feeDetail: any = feeConfig.find((item: any) => item?.channelID === key)
        return (feeDetail ? <div>
            <div style={{ textAlign: "center" }}>{format?.currency(feeDetail?.fixedValue)}{feeDetail?.percentValue ? ` + ${feeDetail?.percentValue}%` : ""}</div>
            {(feeDetail?.minValue && feeDetail?.maxValue) && <div style={{ textAlign: "center" }}>( {translate("user.payment.config.minimum")} {format.currency(feeDetail?.minValue)}, {translate("user.payment.config.maximum")} {format.currency(feeDetail?.maxValue)} )</div>}
        </div> : <div style={{ textAlign: "center" }}>-</div>)
    }

    const handleUpdatePaymentMethod = async (params: any) => {
        try {
            const resp = await updatePaymentMethod(params)
            if (resp?.success) {
                setPaymentMethodActiveList(resp?.data?.map(getProperty('id')) || [])
                message.success(translate('page.profile.message.paymentMethod.success'))
            } else {
                message.error(resp?.message ?? translate('page.profile.message.paymentMethod.failed'))
                setTriggerSync(trigger => !trigger)
            }

        } catch (error) {
            message.error(translate('page.profile.message.paymentMethod.failed'))
        }
    }

    const handleSwitch = (row: any) => (checked: boolean) => {
        const paymentMethodKey = row?.key
        const params = { name: paymentMethodKey, value: checked }

        if (checked)
            handleUpdatePaymentMethod(params)
        else {
            if (paymentMethodActiveList?.length === 1)
                showWarningLastPaymentMethod()
            else
                showConfirmDisablePaymentMethod(params)
        }
    }

    const showConfirmDisablePaymentMethod = (params: any) => {
        confirm({
            title: <div>{translate('page.profile.title.notice')}</div>,
            icon: null,
            content: <div>{translate('page.profile.message.paymentMethod.confirmContent')}</div>,
            onOk() {
                handleUpdatePaymentMethod(params)
            },
            onCancel() { },
            className: style?.noticeModal
        })
    }
    const configSubmit = async (formData: any) => {
        setLoading(true);
        const params = { ...formData };
        if (params?.hashKey) {
            params.hashKey = params.hashKey.replace(/ /g, '')
        }
        if (params?.ipnUrl) {
            params.ipnUrl = params.ipnUrl.replace(/ /g, '')
        }
        delete params?.state;
        const resp = await updateIPNForMerchantGw(params);
        if (!resp?.success)
            message.error(resp?.message || translate('page.profile.message.payment.update.failed'));
        else {
            toggleOpenModalEdit(false);
            setTriggerSync(trigger => !trigger)
            message.success(translate('page.profile.message.payment.update.success'));
        }
        setLoading(false);
    }
    const showWarningLastPaymentMethod = () => {
        warning({
            title: <div>{translate('page.profile.title.notice')}</div>,
            icon: null,
            content: <div>{translate('page.profile.message.paymentMethod.warningLastMethod')}</div>,
            className: style?.noticeModal
        })
    }

    const renderPGConfigField = (key: string) => (
        <>
            <Col xs={8} xxl={6}>{translate(`page.profile.field.${key}`)}</Col>
            <Col xs={16} xxl={18}>{key == "ipnUrl" ? <a target='_blank' href={`${paymentGatewayInfo?.[key]}`}>{renderField(paymentGatewayInfo?.[key])}</a> : renderField(paymentGatewayInfo?.[key])}</Col>
        </>
    )



    const columns:any = [
        {
            title: translate('page.profile.field.regChannels'),
            dataIndex: 'value',
            render: (value: any, record: any) => parseValue(record?.value)

        },
        // {
        //     title: `${translate('page.profile.field.reconcileFee')} (VND)`,
        //     dataIndex: 'merchantContractNumber',
        //     render: (value: any, record: any) => renderFee(record?.key),
        //     align: "center",
        // },

        //todo : Tạm ẩn để đưa lên production do còn vướng flow
        {
            title: translate('page.profile.field.status'),
            dataIndex: 'merchantContractNumber',
            render: (value: any, record: any) => <Switch defaultChecked checked={paymentMethodActiveList?.includes(record?.key)} onChange={handleSwitch(record)} /> ,
            align: "center",

        },
    ]


    return (
        <Fragment>
            <Card className="card-mt" style={{ width: "100%" }}>
                <CardHeader title={translate('page.profile.title.payment')} />
                <div className="content">
                    <Row gutter={[16,16]}>

                        {/* left column */}
                        <Col xs={24} md={24} lg={14}>
                            <Text type="secondary">{translate('page.profile.description.paymentChannel')}</Text>

                            <Table
                                dataSource={paymentMethod}
                                columns={columns}
                                pagination={false}

                            />
                        </Col>

                        {/* right column */}
                        <Col xs={24} md={24} lg={10}>
                            <Row gutter={15} className={style?.paymentInfo}>
                                <Col xs={24} className='info-title'><Text strong>{translate('page.profile.title.paymentInfo')}</Text> <EditFilled className='edit-icon' onClick={toggleOpenModalEdit} /></Col>
                                <Col xs={24} style={{ margin: '15px 0' }}><Text type="secondary">{translate('page.profile.description.paymentInfo')}</Text></Col>
                            </Row>
                            {paymentInfoFields?.map(field => <PaymentInfoField key={field} content={renderPGConfigField(field)} />)}
                        </Col>
                    </Row>
                </div>
            </Card>
            {
                openModalEdit && <PGConfigModal
                    item={paymentGatewayInfo}
                    onSubmit={configSubmit}
                    onCancel={toggleOpenModalEdit}
                />
            }
        </Fragment>
    )
}

export default PaymentGatewayIntegrate



const PaymentInfoField: FC<{ content: ReactNode }> = ({ content }) => (
    <>
        <Row gutter={15}>{content}</Row>
        <hr />
    </>
)