
import React, { useEffect } from 'react'
import { translate, } from '@/utils';
import { Row, Col, Modal } from 'antd';
import BankInfoItem from "../components/BankInfoItem"
import { connect } from 'dva';
import Slider from "react-slick";
import styles from "./TopupModal.less"
import _ from "lodash";
const TopupModal = (props: any) => {
    const { onCancel,open } = props;

    const { dispatch, disbursement } = props;
    const { config, banks } = disbursement || {};
    const { data: disbursementConfig } = config || {};
    const { data: bankList } = banks || {};
    const { bankAccount = [] } = disbursementConfig || {};
    const slidesToShows = (quantity: any) => {
        return (_.isArray(bankAccount) ? bankAccount : [])?.length > quantity ? quantity : bankAccount?.length;
    }
    const settings = {
        dots: true,
        // fade: true,
        infinite: false,
        speed: 500,
        slidesToShow:slidesToShows(2),
        slidesToScroll: 1,
        className: styles.slickContainer,
        responsive: [
            {
              breakpoint: 1520,
              settings: {
                slidesToShow:slidesToShows(2),

              }
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow:slidesToShows(1),

              }
            }
        ],

    };
    const renderBankInfo = () => {
        return <Slider {...settings}>

            {(_.isArray(bankAccount) ? bankAccount?.filter((item)=>item?.isActive) : []).map((item: any) => {
                const bankDetail = bankList?.find((bank: any) => bank?.bankCode === item?.bankCode) || item;
                const newBankDetail = { ...item, logo: bankDetail?.logo }
                return <BankInfoItem data={newBankDetail} />
            })}
        </Slider>
    }
    useEffect(() => {
        dispatch({
            type: 'disbursement/getConfig',
            payload: {},
        })
    }, [])

    return (
        <Modal
            visible={open}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            title={translate("Disbursement_Limit.Recharge_Your_Checking_Account")}
            footer={null}
            width="900px"
            bodyStyle={{
                marginBottom: "60px"
            }}
        >
            {renderBankInfo()}
        </Modal>
    )
}

export default connect((props: any) => ({
    ...props
}))(TopupModal);