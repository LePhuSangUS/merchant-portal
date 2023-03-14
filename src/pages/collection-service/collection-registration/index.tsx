import React, { Fragment, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import { connect } from 'dva';

import { Container, PageLoading, Card, Row, Divider, } from '@/components';
import { translate } from '@/utils';
import { APIUse, SFTPRegister } from "@/pages/collection-service/components";

const { Title, Text, } = Typography;

const CollectionRegistration = (props: any) => {
    const { dispatch, loading, collectionService } = props;
    const { merchantConfig, sftpConfig } = collectionService;
    // const { merchantConfig } = config || {};
    const collectionConfig = merchantConfig?.collectionService || {};
    const handleServiceRegistration = () => {
        dispatch({
            type: 'collectionService/registration',
            payload: {},
            callbackFailed: () => {
                message.error(translate("collection-service.Registration_Failed"))
            },
            callbackSuccess: () => {
                message.success(translate("collection-service.Registration_Success"));
                // dispatch({
                //     type: 'collectionService/getConfig',
                //     payload: {},
                // })
                dispatch({
                    type: 'collectionService/getMerchantConfig',
                    payload: {},
                })
                dispatch({
                    type: 'user/fetchCurrentMerchant',
                    payload: {},
                })
            }
        })
    }
    const handleConfirmServiceRegistration = () => {
        Modal.confirm({
            title: translate("collection-service.notification"),
            content: translate("collection-service.service_registration_confirm__description"),
            icon: '',
            okText: translate("form.button.submit"),
            cancelText: translate("form.button.close"),
            onOk: handleServiceRegistration,
            className: 'neo-confirm-modal footer-reverse'
        })
    }

    useEffect(() => {
        // dispatch({
        //     type: 'collectionService/getConfig',
        //     payload: {},
        // })
        dispatch({ type: 'collectionService/getMerchantConfig' })

        // dispatch({
        //     type: 'collectionService/getBankConfig',
        //     payload: {},
        // })
        if (dispatch) {
            dispatch({ type: 'collectionService/getSFTPConfig' })
        }
    }, [dispatch])


    return (<Container >
        <PageLoading active={loading?.global} />
        <Card className="card-mt">
            <Title level={4}>{translate("collection-service.registration.title")}</Title>
            <Text>{translate("collection-service.registration.overview")}</Text>
            <Title level={4}>{translate("collection-service.term_and_condition")}</Title>
            <a href={"https://www.neopay.vn/"} target="_blank" rel="noreferrer">http://dieukhoandichvuthuho.neopay.vn</a>
            {!!collectionConfig?.isActive ? (
                <Fragment>
                    <Divider />
                    <APIUse data={collectionConfig?.callback} />
                    <Divider />
                    <SFTPRegister data={sftpConfig} />
                </Fragment>
            ) : (
                <Row justify="center" style={{ marginTop: "10px" }}>
                    <Button type='primary' onClick={handleConfirmServiceRegistration} >{translate("collection-service.service_registration")}</Button>
                </Row>
            )}
        </Card>
    </Container>
    )
}

export default connect(({ dispatch, loading, user, collectionService }: any) => ({
    dispatch,
    loading,
    user,
    collectionService
}))(CollectionRegistration);