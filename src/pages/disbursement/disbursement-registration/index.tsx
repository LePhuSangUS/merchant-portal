import React, { Fragment, useEffect } from 'react';
import { Container, PageLoading, Card, Row, Col, Divider, } from '@/components';
import { translate } from '@/utils';
import { Typography, Button, Modal, message, Carousel } from 'antd';
import BankInfoItem from "../components/BankInfoItem"
import APIUse from "../components/APIUse";
import RegistrationSFTP from "../components/RegistrationSFTP";
import _ from "lodash";
import Slider from "react-slick";
import styles from "./index.less";
import { useToggle } from "react-use"
import ModalConfirmDisbursementRegistration from "./components/ModalConfirmDisbursementRegistration"
import { connect } from 'dva';

const { Title, Text, } = Typography;


const DisbursementRegistration = (props: any) => {
    const { dispatch, disbursement, loading, user } = props;
    const { config, banks } = disbursement || {};
    const { data: disbursementConfig } = config || {};
    const { data: bankList } = banks || {};
    const { bankAccount = [], callback } = disbursementConfig || {};
    const [openModalRegistration, toggleOpenModalRegistration] = useToggle(false);

    const handleServiceRegistration = (values: any) => {
        dispatch({
            type: 'disbursement/registration',
            payload: {
                ...values
            },
            callbackFailed: () => {
                message.error(translate("disbursement.Registration_Failed"))
            },
            callbackSuccess: () => {
                message.success(translate("disbursement.Registration_Success"));
                toggleOpenModalRegistration();
                dispatch({
                    type: 'disbursement/getConfig',
                    payload: {},
                }
                )
                dispatch({
                    type: 'user/fetchCurrentMerchant',
                    payload: {},
                }
                )

            }
        })
    }

    const slidesToShows = (quantity: any) => {
        return (_.isArray(bankAccount) ? bankAccount : [])?.length > quantity ? quantity : bankAccount?.length;
    }
    const settings = {
        dots: true,
        // fade: true,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToShows(3),
        slidesToScroll: 1,
        // centerMode:true,
        responsive: [
            {
                breakpoint: 1520,
                settings: {
                    slidesToShow: slidesToShows(2),

                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: slidesToShows(1),

                }
            }
        ],
        className: styles.slickContainer
    };
    useEffect(() => {
        dispatch({
            type: 'disbursement/getConfig',
            payload: {},
        })

        dispatch({
            type: 'disbursement/getBankConfig',
            payload: {},
        })
    }, [])


    return (<Container >
        <PageLoading active={loading?.global} />
        <Card className="card-mt">
            <Title level={4}>{translate("disbursement.disbursement_service_overview")}</Title>
            <Text>{translate("disbursement.disbursement_service_overview__description")}</Text>
            <Title level={4}>{translate("disbursement.term_and_condition")}</Title>
            <a href={"https://www.neopay.vn/"} target="_blank">http://dieukhoandichvuchiho.neopay.vn</a>
            {user.currentMerchant.isRegisteredDisbursement ? <Fragment>
                {!_.isEmpty(bankAccount) &&
                    <Fragment>
                        <Divider />
                        <Slider {...settings}>

                            {(_.isArray(bankAccount) ? bankAccount?.filter((item)=>item?.isActive) : []).map((item: any) => {
                                const bankDetail = bankList?.find((bank: any) => bank?.bankCode === item?.bankCode) || item;
                                const newBankDetail = { ...item, logo: bankDetail?.logo }
                                return <BankInfoItem data={newBankDetail} />
                            })}
                        </Slider>
                    </Fragment>
                }
                <Divider />
                <APIUse data={callback} />
            </Fragment> : <Row justify="center" style={{ marginTop: "10px" }}>
                <Button type='primary' onClick={toggleOpenModalRegistration} >{translate("disbursement.service_registration")}</Button>
            </Row>}
            <Divider />
           {user.currentMerchant.isRegisteredDisbursement&& <RegistrationSFTP/>
}
        </Card>
        {openModalRegistration && <ModalConfirmDisbursementRegistration onCancel={toggleOpenModalRegistration} onSubmit={handleServiceRegistration} />}
    </Container>
    )
}

export default connect(({ dispatch, disbursement, loading, user }: any) => ({
    dispatch,
    disbursement,
    loading,
    user
}))(DisbursementRegistration);