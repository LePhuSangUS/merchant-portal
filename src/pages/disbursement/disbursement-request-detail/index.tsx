import React, { useEffect, useState, } from "react"
import { CloseCircleFilled } from "@ant-design/icons"
import type { ColumnsType } from "antd/lib/table"

import { Container, PageLoading, Card, Button, Col, Row, FormText, Table, Title } from '@/components'
import { translate, message, format, parseValue, renderField } from '@/utils'
import { DetailHeader, DetailContent, DetailFooter } from "@/components/DetailPage"
import { getDisbursementRequestDetail, getDisbursementRequestDetailTrans } from "@/services/disbursement/api"
import { DISBURSEMENT_REQUEST_STATUS, DISBURSEMENT_HISTORIES_TRANSACTION_STATUS } from "@/constants/disbursement.constants"
import style from './index.less'
import { renderStatus } from "@/utils/render"
import { propertyEqual } from "@/utils/curry"
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"
import {renderMaskCardNumber} from "@/utils/format"


type ConfigType = {
    title: string;
    dataIndex: string;
    type?: string;
    render?: (...args: any[]) => any
}


const DetailFieldItem = ({ label, content, type = 'text' }: { label: string, content: string, type?: string }) => {
    return (
        <div>
            <span>{label}</span>
            {
                type === 'textarea' ?
                    <span
                        className="disbursement-request-detail--textbox"
                        role="textbox"
                    >
                        {content}
                    </span>
                    :
                    <FormText
                        disabled
                        fieldProps={{
                            className: "disbursement-request-detail--input",
                            value: content
                        }}
                        placeholder=''
                    />
            }
        </div>
    )
}

const DisbursementRequestDetail: ReactPageProps = ({ match, history }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [detail, setDetail] = useState<ObjectType>();
    const [detailTransactions, setDetailTransactions] = useState();

    const { id } = match.params

    useEffect(() => {
        const getDetail = async () => {
            const resp = await getDisbursementRequestDetail(id)
            if (resp?.success) {
                setDetail(resp?.data)
            }
            else {
                message.error(translate("Disbursement_Request_Detail.Amount.An_Error_Occurred"))
            }
            setIsLoading(false)
        }
        getDetail()

        const getDetailTrans = async () => {
            const resp = await getDisbursementRequestDetailTrans(id)
            if (resp?.success) {
                setDetailTransactions(resp?.data)
            }
            else {
                message.error(translate("Disbursement_Request_Detail.Amount.An_Error_Occurred"))
            }
            setIsLoading(false)
        }
        getDetailTrans()
    }, [id])

    const leftColumnConfig: ConfigType[] = [
        {
            title: translate('form.field.creationTime'),
            dataIndex: 'createdAt',
            render: (val: string) => format?.datetimes(val) as string
        },
        {
            title: translate('Disbursement_Request_Detail.Disbursement_Total_Amount'),
            dataIndex: 'totalAmount',
            render: (val: string) => parseNumberToCurrencyMultipleLanguage(val) + ' đ'
        },
        {
            title: translate('form.field.status'),
            dataIndex: 'status',
            render: (val: string | undefined) => parseValue(DISBURSEMENT_REQUEST_STATUS.find(propertyEqual('value', val))?.label)
        },
    ]
    const rightColumnConfig: ConfigType[] = [
        {
            title: translate('Disbursement_Request_Detail.Request_Code'),
            dataIndex: 'requestId',
        },
        {
            title: translate('Disbursement_Request_Detail.Ref_Code'),
            dataIndex: 'refCode',
        },
        {
            title: translate('form.field.note'),
            dataIndex: 'note',
            type: 'textarea'
        },
    ]

    const columns: ColumnsType = [
        {
            title: 'Transaction ID',
            dataIndex: 'transId',
            key: 'transId',
        },
        {
            title: translate('Disbursement_Histories.Transaction_Code_Merchant'),
            dataIndex: 'requestTransId',
            render: (dom: any, row: any) => renderField(row?.requestTransId),
            width: 200,
      
      
          },
        {
            title: translate('disbursement.Currency_Code'),
            dataIndex: 'srcCurrency',
            render: (dom: any, row: any) => renderField(row?.srcCurrency),
            width: 200,
      
      
          },
        {
            title: translate('Disbursement_Request_Detail.Amount'),
            dataIndex: 'srcAmount',
            key: 'srcAmount',
            render: (value: any, row: any) => row?.srcAmount ? parseNumberToCurrencyMultipleLanguage(row?.srcAmount) : ''
        },
        {
            title: 'Bank',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: translate('Disbursement_Request_Detail.Branch'),
            dataIndex: 'bankBranchName',
            key: 'bankBranchName',
        },
        {
            title: translate('Disbursement_Request_Detail.Account_Number'),
            dataIndex: 'bankAccountNumber',
            key: 'bankAccountNumber',
            render: (value: any, row: any) => row?.bankAccountNumber ? renderMaskCardNumber(row?.bankAccountNumber) : ''

        },
        {
            title: translate('Disbursement_Request_Detail.Account_Name'),
            dataIndex: 'bankAccountName',
            key: 'bankAccountName',
        },

        {
            title: translate('Disbursement_Request_Detail.Status'),
            dataIndex: 'status',
            key: 'status',
            render: renderStatus([...DISBURSEMENT_HISTORIES_TRANSACTION_STATUS, ...DISBURSEMENT_REQUEST_STATUS])
        },
    ]

    return (
        <Container className={style['disbursement-request-detail']}>
            <PageLoading active={isLoading} />
            <Row>
                <Col xs={24}>
                    <Card>
                        <DetailHeader title={translate("Disbursement_Request_Detail.Title")} />
                        <Row gutter={[15, 0]} style={{ paddingTop: 15 }}>
                            <Col xs={24} md={12}>
                                {
                                    leftColumnConfig?.map(field => {
                                        return (
                                            <DetailFieldItem
                                                key={field.dataIndex}
                                                label={field?.title}
                                                content={field?.render?.(detail?.[field?.dataIndex], detail) || detail?.[field?.dataIndex]}
                                                type={field?.type || 'text'}
                                            />
                                        )
                                    })
                                }
                            </Col>
                            <Col xs={24} md={12}>
                                {
                                    rightColumnConfig?.map(field => {
                                        return (
                                            <DetailFieldItem
                                                key={field.dataIndex}
                                                label={field?.title}
                                                content={field?.render?.(detail?.[field?.dataIndex], detail) || detail?.[field?.dataIndex]}
                                                type={field?.type || 'text'}
                                            />
                                        )
                                    })
                                }
                            </Col>
                        </Row>

                        <Col style={{ marginTop: 20 }}>
                            <Title level={5}>{translate('Disbursement_Request_Detail.Disbursement_Transaction')}</Title>
                            <Table
                                columns={columns}
                                dataSource={detailTransactions}
                                pagination={false}
                            />
                        </Col>

                        <DetailFooter>
                            <Button onClick={() => {
                                const path = history.location?.pathname?.replace(/\/[\w-]+$/, '')
                                history.push(path)
                            }}><CloseCircleFilled />{translate('form.button.close')}</Button>
                        </DetailFooter>
                    </Card>
                </Col>
             
            </Row>
        </Container>
    )
}

export default DisbursementRequestDetail

