import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Container, Row, Col, PageLoading, Card, Image, Status } from '@/components';
import { getSupportRequestDetail, getSupportCategory } from '@/services/support-request/api';
import { translate, message, renderField } from '@/utils';
import { Typography, Empty } from "antd"
import { SUPPORT_STATUS_LIST, } from '@/constants';
import styles from '@/assets/styles/page-detail.less';
import { DetailPage } from '@/components/DetailPage';
import { isEmpty } from 'lodash';
import { env } from "@/env";
import ReactHtmlParser from 'react-html-parser'; 

const { Title } = Typography

const FieldItem = (props: { title: string, content?: any,noBorder:any }) => (
  <>
    <Row gutter={15}>
      <Col xs={10} md={8} lg={6} xl={5}>
        {props?.title}
      </Col>
      <Col xs={14} md={16} lg={18} xl={19}>
        {props?.content || '-'}
      </Col>
    </Row>
   {!props?.noBorder && <hr />}
  </>
)

interface PageProps {
  match: any;
  history: any;
}


const SupportRequestDetail: React.FC<PageProps> = ({ match, history }) => {
  const { id } = match.params;
  const [requestItem, setRequestItem] = useState<any>({});
  const [responseItem, setResponseItem] = useState<any>([{}]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [triggerReload, setTriggerReload] = useState<boolean>(false)
  const [requestTypeList, setRequestTypeList] = useState<any[]>([]);

  const initSupportRequest = async () => {

    if (!id) return;
    setLoading(true);
    const resp = await getSupportRequestDetail(id);

    const comments = resp?.data?.comments;
    if (!resp?.success)
      message.error(translate('support.message.detail.failed'));
    setRequestItem(resp?.data || {});
    if (_.isArray(comments)) {
      setResponseItem([{
        content: (translate("Support request auto message")),
        createdAt: resp?.data?.createdAt,
        isAuto:true,
      }, ...comments] || []);
    }
    setLoading(false);
    return resp;
  };

  useEffect(() => {
    initSupportRequest().then()
  }, [triggerReload]);

  const requestDataRender = [
    {
      id: "1",
      label: translate('support.field.type'),
      content: <Status value={requestItem.supportId || "-"} options={requestTypeList} />
    },
    {
      id: "2",
      label: translate('support.field.content'),
      content: renderField(requestItem?.content)
    },
    {
      id: "3",
      label: translate('support.field.requestTime'),
      content: renderField(requestItem?.createdAt, 'datetimes')
    },
    {
      id: "4",
      label: translate('support.field.status'),
      content: <Status value={requestItem?.status} options={SUPPORT_STATUS_LIST} />
    },
    {
      id: "5",
      label: translate('support.field.attach'),
      content: requestItem?.attachments?.length ? (
        <Row gutter={[16, 16]}>
          {
            requestItem.attachments.map((i: any, idx: number) => (
              <Col key={`${i}${idx}`} xs={12} md={8} lg={6}>
                <Image
                  src={`${env.FILE_API_URL}/img/${i?.fileName}`}
                  style={{ maxHeight: '20em' }}
                />
              </Col>
            ))
          }
        </Row>
      ) : '-'
    },
  ]
  const responseDataRender = (item: any) => [
    {
      id: "1",
      label: translate('support.field.content'),
      content: renderField(item?.content),
    },
    {
      id: "2",
      label: translate('support.field.responseTime'),
      content: renderField(item?.createdAt, 'datetimes'),
      noBorder:item.isAuto,

    },
    {
      id: "3",
      label: translate('support.field.supporter'),
      content: renderField(item?.createdBy?.userEmail),
      hide: item.isAuto,
      
    },
    {
      id: "4",
      label: translate('support.field.attach'),
      hide:item.isAuto,
      noBorder:true,
      content: item?.attachments?.length > 0 ? (
        <Row gutter={[16, 16]}>
          {
            item?.attachments?.map((i: any, idx: number) => (
              <Col key={`${i}${idx}`} xs={12} md={8} lg={6}>
                <Image
                  src={`${env.FILE_API_URL}/img/${i?.fileName}`}
                  style={{ maxHeight: '20em' }}
                />
              </Col>
            ))
          }
        </Row>
      ) : '-'
    },


  ].filter((item:any)=>!item.hide)
  useEffect(() => {
    (async function () {
      const resp: any = await getSupportCategory({ cateType: "SUPPORT_TYPE" });
      const categories = resp?.data || [];
      if (_.isArray(categories)) {
        const categoriesMapping = categories?.map((el) => {
          return {
            value: el?.id,
            label: el?.name
          }
        })
        setRequestTypeList(categoriesMapping);
      }
    })()

  }, [])

  return (
    <Container className={styles.container}>
      <DetailPage isLoading={isLoading} hasData={!isEmpty(requestItem)} onBack={history.goBack} onReload={() => setTriggerReload(!triggerReload)}>
        <Card style={{ marginBottom: "20px" }}>
          <Title level={5}>{`${translate('support.title.requestId')} #${requestItem?.ticketId || ""}`}</Title>
          <hr />
          {
            requestDataRender?.map((el, index) => {
              return < FieldItem key={`request-${index}`} title={el?.label} content={el?.content} />
            })
          }
        </Card>
        <Card>
          <Title level={5}> {translate('support.title.feedback')}</Title>
          <hr />
          {
            !_.isEmpty(responseItem) ? (

              responseItem.map((item: any) => {
                return <Card style={{marginBottom:"10px"}}>
                 { responseDataRender(item)?.map((el, index) => {
                  return < FieldItem key={`response-${index}`} noBorder={el?.noBorder} title={el?.label} content={el?.content} />
                })}
                </Card>
              })

            ) : (<Empty />)
          }
        </Card>
      </DetailPage>
    </Container>
  );
};

export default SupportRequestDetail;
