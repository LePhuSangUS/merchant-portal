import React, { useEffect, useState, } from "react";
import { Space, Modal } from "antd";

import { Container, PageLoading, Card, Button, Col, Row, FormText, Form } from "@/components";
import { translate, message } from "@/utils";
import { DetailHeader } from "@/components/DetailPage";
import style from "./index.less";
import { getMerchantVirtualAccountsDetail, updateVirtualAccountForMerchantPortal } from "@/services/collection-service/api";
import UpdateVirtualAccountUpload from "../../components/UpdateVirtualAccountUpload";
import { requiredField } from "@/utils/rules";
import { env } from "@/env";

const UpdateCollectionVirtualAccount: ReactPageProps = ({ match, history }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [detail, setDetail] = useState<ObjectType>();
    const [updateImage, setUpdateImage] = useState<Record<string, any>>({});

    const { id } = match.params;

    useEffect(() => {
        (async () => {
            const resp = await getMerchantVirtualAccountsDetail(id);
            if (resp?.success) {
                const { frontIdCard, backIdCard, profileImg, businessRegistration } = resp?.data;
                if (frontIdCard && backIdCard && profileImg && businessRegistration) {
                    history.goBack();
                } else {
                    setDetail(resp?.data);
                }
            }
            else {
                message.error(translate("collection-service.message.virtualAccountDetail.failed"));
            }
            setIsLoading(false)
        })();
    }, [id]);

    const onFinish = async (formValues: ObjectType) => {
        const { accountAddress } = formValues;
        const requestParams = {
            id,
            ...updateImage,
            accountAddress
        }
        try {
            setIsLoading(true);
            const resp = await updateVirtualAccountForMerchantPortal(requestParams);
            if (!resp?.success) {
                message.error(translate('collection-service.message.updateVirtualAccount.failed'));
                setIsLoading(false);
                return;
            }
            message.success(translate('collection-service.message.updateVirtualAccount.success'));
            history.goBack();
        } catch (error) {
            message.error(translate('collection-service.message.updateVirtualAccount.failed'));
            setIsLoading(false);
        }
    }

    const frontIdCard = detail?.frontIdCard;
    const backIdCard = detail?.backIdCard;
    const profileImg = detail?.profileImg;
    const businessRegistration = detail?.businessRegistration;

    useEffect(() => {
        setUpdateImage({
            frontIdCard: detail?.frontIdCard,
            backIdCard: detail?.backIdCard,
            profileImg: detail?.profileImg,
            businessRegistration: detail?.businessRegistration,
        })
    }, [JSON.stringify(detail)])

    return (
        <Container className={style['collection-request-detail']}>
            <PageLoading active={isLoading} />
            {
                detail &&
                <Card>
                    <DetailHeader title={translate("collection-service.virtualAccountDetail.title")} />
                    <Form
                        name="export-transaction"
                        // labelCol={{ span: 7 }}
                        labelAlign="left"
                        // wrapperCol={{ span: 17 }}
                        initialValues={{
                            // accountName: '',
                            accountAddress: '',
                            frontIdCard: '',
                            backIdCard: '',
                            profileImg: '',
                            businessRegistration: '',
                            ...detail
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                        className={style.container}
                        layout="vertical"
                        requiredMark={false}
                    // onValuesChange={(value: any) => {
                    //     if (value.reason === undefined) {
                    //         enableSubmitButton()
                    //     }
                    // }}
                    >
                        <Row gutter={[15, 0]} style={{ paddingTop: 15 }}>
                            <Col xs={24} md={12}>
                                <FormText
                                    disabled
                                    // label="Account ID"
                                    label={translate('collection-service.account.merchantAccountID')}
                                    name={'merchantAccountId'}
                                    fieldProps={{
                                        className: "collection-request-detail--input",
                                    }}
                                    placeholder=''
                                />
                                <FormText
                                    disabled
                                    // label="Account Name"
                                    label={translate('collection-service.account.name')}
                                    name="accountName"
                                    fieldProps={{
                                        className: "collection-request-detail--input",
                                    }}
                                    placeholder=''
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <FormText
                                    label={translate('collection-service.account.address')}
                                    name="accountAddress"
                                    fieldProps={{
                                        className: "collection-request-detail--input",
                                    }}
                                    placeholder='Vui lòng nhập trường này'
                                    rules={[requiredField]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[15, 0]} style={{ paddingTop: 15 }}>
                            <Col xs={24} md={12}>
                                <UpdateVirtualAccountUpload
                                    label={<span className='edit-kyc--upload-label'>{translate('collection-service.frontIDCard')}</span>}
                                    anonymous
                                    single
                                    acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                    maxSize={2}
                                    maxCount={1}
                                    onChange={(data) => {
                                        setUpdateImage(val => ({ ...val, frontIdCard: data }))
                                    }}
                                    initImage={frontIdCard ? `${env.FILE_API_URL}/img/${frontIdCard}` : ''}
                                    showMessage
                                // rules={[
                                //     {require: true, message: 'Vui lòng cập nhật bổ sung thông tin KYC'}
                                // ]}
                                />
                                <UpdateVirtualAccountUpload
                                    label={<span className='edit-kyc--upload-label'>{translate('collection-service.profileImage')}</span>}
                                    anonymous
                                    single
                                    acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                    maxSize={2}
                                    maxCount={1}
                                    onChange={(data) => {
                                        setUpdateImage(val => ({ ...val, profileImg: data }))
                                        // enableSubmitButton()
                                    }}
                                    initImage={profileImg ? `${env.FILE_API_URL}/img/${profileImg}` : ''}
                                    showMessage
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <UpdateVirtualAccountUpload
                                    label={<span className='edit-kyc--upload-label'>{translate('collection-service.backIDCard')}</span>}
                                    anonymous
                                    single
                                    acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                    maxSize={2}
                                    maxCount={1}
                                    onChange={(data) => {
                                        setUpdateImage(val => ({ ...val, backIdCard: data }))
                                        // enableSubmitButton()
                                    }}
                                    initImage={backIdCard ? `${env.FILE_API_URL}/img/${backIdCard}` : ''}
                                    showMessage
                                />
                                <UpdateVirtualAccountUpload
                                    label={<span className='edit-kyc--upload-label'>{translate('collection-service.businessRegistration')}</span>}
                                    anonymous
                                    single
                                    acceptTypeList={['image/png', 'image/jpg', 'image/jpeg']}
                                    maxSize={2}
                                    maxCount={1}
                                    onChange={(data) => {
                                        setUpdateImage(val => ({ ...val, businessRegistration: data }))
                                        // enableSubmitButton()
                                    }}
                                    initImage={businessRegistration ? `${env.FILE_API_URL}/img/${businessRegistration}` : ''}
                                    showMessage
                                />
                            </Col>
                        </Row>
                        {
                            <Col style={{ textAlign: 'center', marginTop: 20 }}>
                                <Space size={15}>
                                    <Button type="primary" htmlType="submit" onClick={() => { }}>{translate('form.button.update')}</Button>
                                    <Button onClick={history.goBack}>{translate('form.button.close')}</Button>
                                </Space>
                            </Col>
                        }
                    </Form>
                </Card>
            }
        </Container>
    )
}

export default UpdateCollectionVirtualAccount;

