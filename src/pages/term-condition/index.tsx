import React, { useEffect, useMemo, useState } from 'react';
import { Container, PageLoading, Card, Row, Col, Space, } from '@/components';
import { translate } from '@/utils';
import { Typography, message } from 'antd';
import {getMerchantProfile} from "@/services/profile/api"
import { connect } from 'dva'
import { ConnectState } from '@/models/connect';
const { Text, Title } = Typography;

const TermCondition= (props:any) => {

    const { currentMerchant } = props;


    const tcConfigLink = {
        //Have token is so ban hang
        tcLink:currentMerchant?.platformMerchantId?'https://www.neox.vn/neox-dieu-khoa-su-dung-dich-vu-danh-cho-nha-ban-hang-tren-so-ban-hang/' : 'https://neox.vn/tnc-merchant',
        privacyLink:currentMerchant?.platformMerchantId?"https://neox.vn/neox-chinh-sach-bao-mat": 'https://neox.vn/neox-chinh-sach-bao-mat'
    }
    const tcConfigLabel = {
        tcLabel:currentMerchant?.platformMerchantId? translate("t&c_for_sbh") :  translate("t&c_for_organization")
    }


    const dataMapping = [
        {
            id: "1",
            label: tcConfigLabel.tcLabel,
            link: tcConfigLink.tcLink,
            title: translate("view_here")
        },
        {
            id: "2",
            label: translate("privacy_policy"),
            link: tcConfigLink.privacyLink,
            title: translate("view_here")

        }
    ];

    const renderList = () => {
        return <Row style={{
            flexDirection: "column"

        }} >
            {dataMapping?.map((item) => {
                return <Space style={{
                    margin: "10px 0",
                    flexWrap: "wrap"
                }}>
                    <Text style={{
                        display: "block"
                    }}>{item.label}</Text>
                    <a style={{
                    }} target={"_blank"} href={item?.link}>{item?.title}</a>
                </Space>
            })}
        </Row>
    }
    return (<Container >
        <PageLoading />
        <Card className="card-mt">
            {
                renderList()
            }
        </Card>
    </Container>
    )
}

export default connect(({ user }: ConnectState) => ({
    currentMerchant: user.currentMerchant,
  }))(TermCondition);