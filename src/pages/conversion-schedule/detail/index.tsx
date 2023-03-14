import React, { useEffect, useState, useCallback, useRef } from "react"
import { Container, PageLoading, Card, ProForm,Row, Button, Icons, Status, Space, FormText, Modal, Title, Typography } from '@/components'
import { translate, message, renderField, parseValue,nonAccentVietnamese } from '@/utils'
import { useParams } from "react-router"
import { CONVERSION_STATUS_LIST } from '@/constants'
import styleDetail from './styles.less'
import { DetailFieldItem, DetailHeader, DetailContent, DetailFooter, DetailPage } from "@/components/DetailPage"
import { getConversionScheduleDetailById, updateGoldExchangeAppointment } from "@/services/conversion-schedule-gold/api";
import { isEmpty } from "lodash"

const { CloseCircleOutlined, SaveOutlined } = Icons

interface PageProps {
    history: any
}

const ConversionScheduleDetail: React.FC<PageProps> = ({ history }) => {
    const params: any = useParams();
    const formRef = useRef<any>();

    const { id } = params;

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isToggleReload, setIsToggleReload] = useState<boolean>(true)
    const [isShowModalConfirm, setIsShowModalConfirm] = useState<boolean>(false)
    const [conversionScheduleDetail, setConversionScheduleDetail] = useState<any>()
    const [exchangeCode, setExchangeCode] = useState("");
    const [isExchangeCodeInvalid, setIsExchangeCodeInvalid] = useState(false);

    const checkExchangeSuccess = (status: any) => {
        return status === "SUCCESS"
    }
    const checkPending = (status: any) => {
        return status === "PENDING"
    }
    // get conversion schedule detail
    useEffect(() => {
        const getConversionScheduleDetail = async () => {
            setIsLoading(true)
            const resp = await getConversionScheduleDetailById(id);
            if (resp?.success) {
                setConversionScheduleDetail(resp?.data);
            }
            else {
                message.error(translate("investment.conversionScheduleDetail.message.detail.failed"))
            }
            setIsLoading(false)
        };
        getConversionScheduleDetail()
    }, [isToggleReload])
    const conversionScheduleDetailData = [
        {
            id: 1,
            label: translate('investment.conversionScheduleDetail.label.conversionCode'),
            content: checkExchangeSuccess(conversionScheduleDetail?.status) ? renderField(conversionScheduleDetail?.exchangeCode?.match(/.{1,4}/g)?.join(" - ")) :
                (checkPending(conversionScheduleDetail?.status) ? <div className={styleDetail.exchangeCodeInput}><FormText
                    placeholder={translate('investment.conversionSchedule.placeholder.pleaseEnter')}
                    name="exchangeCode"
                    //Chỉ chứa kí tự và số , phân cách 4 kí tự băng dấu -
                    normalize={value => (nonAccentVietnamese(value || '')).trim().replace(/[^A-Za-z0-9]/g,"").toUpperCase().match(/.{1,4}/g)?.join(" - ")}
                    
                    fieldProps={{
                        onChange: () => {
                            if (isExchangeCodeInvalid) {
                                setIsExchangeCodeInvalid(false);
                            }
                        },
                        maxLength: 11,
                        
                        
                    }}
                    rules={[
                        {
                            required: true,
                            message: translate('form.message.field.required')
                        },
                        {
                            validator: async (rule, value: any) => {
                                if (isExchangeCodeInvalid) {
                                    return Promise.reject(translate("investment.conversionScheduleDetail.error.conversionCodeIsNotExists"))
                                }
                                return Promise.resolve()
                            }
                        }
                    ]}

                /></div> : "-"),
            isFullRow: true
        },

        {
            id: 3,
            label: translate('investment.conversionScheduleDetail.label.productType'),
            content: parseValue({
                vi: "Chứng chỉ vàng",
                en: "Gold certificate"
            }),
            isFullRow: true
        },

        {
            id: 5,
            label: translate('investment.conversionScheduleDetail.label.productName'),
            content: renderField(conversionScheduleDetail?.productName),
            isFullRow: true
        },

        {
            id: 7,
            label: translate('investment.conversionScheduleDetail.label.quantity'),
            content:  <Row>{renderField(conversionScheduleDetail?.quantity, 'currency')}&nbsp;<span>{translate("investment.conversionScheduleDetail.label.mace")}</span></Row> ,
            isFullRow: true
            
        },
        {
            id: 9,
            label: translate('investment.conversionScheduleDetail.label.createdAt'),
            content: renderField(conversionScheduleDetail?.createdAt, 'datetimes'),
            isFullRow: true
        },

        {
            id: 11,
            label: translate('investment.conversionScheduleDetail.label.appointmentDate'),
            content: renderField(conversionScheduleDetail?.appointmentTime, 'datetimes'),
            isFullRow: true
        },
        {
            id: 18,
            label: translate('investment.conversionScheduleDetail.label.exchangeDate'),
            content: renderField(conversionScheduleDetail?.exchangeSuccessAt, 'datetimes'),
            isFullRow: true
        },
        {
            id: 13,
            label: translate('investment.conversionScheduleDetail.label.conversionStore'),
            content: renderField(conversionScheduleDetail?.tradeDetail?.storeInfo?.name),
            isFullRow: true
        },
        {
            id: 15,
            label: translate('investment.conversionScheduleDetail.label.status'),
            content: conversionScheduleDetail?.status ? <Status value={conversionScheduleDetail?.status} options={CONVERSION_STATUS_LIST} /> : '-',
            isFullRow: true
        },
        {
            id: 2,
            label: translate('investment.conversionScheduleDetail.label.customerName'),
            content: renderField(conversionScheduleDetail?.customerName),
            isFullRow: true
        },
        {
            id: 4,
            label: translate('investment.conversionScheduleDetail.label.phone'),
            content: renderField(conversionScheduleDetail?.neoId),
            isFullRow: true
        },
    ]

    const handleCloseDetail = () => {
        history.goBack()
    }
    const handleCheckAndSaveCode = async (values: any) => {
        setIsShowModalConfirm(true);
        setExchangeCode(values?.exchangeCode?.replace(/[^A-Za-z0-9]/g,""))
        return

    }

    // confirm modal
    const handleOkConversionConfirmModal = async () => {
        //Call api
        const resp = await updateGoldExchangeAppointment(id, exchangeCode);
        if (resp?.success) {
            setIsToggleReload(!isToggleReload)
            message.success(translate('investment.conversionScheduleDetail.modal.successContent'))
        }
        else {
            setIsExchangeCodeInvalid(true);            
            if (typeof formRef.current?.validateFields == "function") {
                formRef.current?.validateFields(["exchangeCode"]);
                
            }
        
        }
        setIsShowModalConfirm(false);


    }
    const handleCancelConversionConfirmModal = () => {
        setIsShowModalConfirm(false);
    }

    const renderDetailItem = useCallback((infoData: any) => {
        return infoData?.map((item: any, index: number) => {
            return <DetailFieldItem
                key={`GoldCertificateTransactionDetail-DetailFieldItem-${index}`}
                {...item}
                colConfig={{
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: item?.isFullRow ? 24 : 12
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
    }, [conversionScheduleDetailData])

    return (
        <Container className={styleDetail.detailPage}>
            <DetailPage isLoading={isLoading} hasData={!isEmpty(conversionScheduleDetail)} onBack={history.goBack} onReload={() => setIsToggleReload(!isToggleReload)}>

            <ProForm
                formRef={formRef}
                name="ResponseForm"
                onFinish={handleCheckAndSaveCode}
                submitter={{
                    render: ((props: any) => <DetailFooter>
                        <Space size={15}>
                            {checkPending(conversionScheduleDetail?.status) && <Button type="primary" onClick={() => props?.form?.submit()}><SaveOutlined />{translate("investment.conversionScheduleDetail.button.checkAndSaveCode")}</Button>}
                            <Button onClick={handleCloseDetail}><CloseCircleOutlined />{translate("investment.conversionScheduleDetail.button.close")}</Button>
                        </Space>
                    </DetailFooter>
                    ),
                    resetButtonProps: {
                        style: {
                            display: 'none',
                        },
                    },
                }}
            >
                <Card>
                    <DetailHeader title={translate("investment.conversionScheduleDetail.label.title")} />
                    <DetailContent>{renderDetailItem(conversionScheduleDetailData)}</DetailContent>


                </Card>

                {/* confirm modal */}
                <Modal
                    closable={false}
                    maskClosable={false}
                    visible={isShowModalConfirm}
                    onOk={handleOkConversionConfirmModal}
                    onCancel={handleCancelConversionConfirmModal}
                    footer={[
                        <Button key="back" onClick={handleCancelConversionConfirmModal}>
                            {translate("investment.conversionScheduleDetail.button.close")}
                        </Button>,
                        <Button key="confirm" type="primary" onClick={handleOkConversionConfirmModal}>
                            {translate("investment.conversionScheduleDetail.button.accept")}
                        </Button>,
                    ]}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3}>{translate("investment.conversionScheduleDetail.modal.title")}</Title>
                        <Typography level={3}>{translate("investment.conversionScheduleDetail.modal.confirmContent")}</Typography>
                    </div>
                </Modal>
            </ProForm>
            </DetailPage>

        </Container>
    )
}

export default ConversionScheduleDetail