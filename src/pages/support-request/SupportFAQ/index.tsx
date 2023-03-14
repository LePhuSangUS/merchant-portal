import React, { useEffect, useMemo, useState } from 'react';
import { Container, PageLoading, Card, Row, Col, Space, } from '@/components';
import { translate } from '@/utils';
import { Typography, message } from 'antd';
import {getMerchantProfile} from "@/services/profile/api"
import { connect } from 'dva'
import { ConnectState } from '@/models/connect';
const { Text, Title } = Typography;

const SupportFAQ= (props:any) => {


    const dataMapping = [
        {
            id: "1",
            label: translate("support.for_merchant"),
            link: "https://www.neox.vn/faqs-merchant/",
            title: translate("view_here")
        },
        {
            id: "2",
            label: translate("support.user_guider_for_merchant"),
            link: " https://www.neox.vn/hdsd-merchant-portal/",
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
    // currentMerchant: user.currentMerchant,
  }))(SupportFAQ);