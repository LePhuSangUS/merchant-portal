import React, { useState } from 'react';
import { Button, Card, Col, Container, PageLoading, Row, Result } from '@/components';
import { getDetailPGConfig } from '@/services/pg-config/api';
import { translate, message } from '@/utils';
import { CopyOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styles from './style.less';
import { useRequestAPI } from '@/hooks';

const DEVELOPER_SITE_URL = 'https://developer.neopay.vn/summary/homepage/'

interface PageProps {
  history: any;
  route: Record<string, any>;
}
const DeveloperSite: React.FC<PageProps> = ({ history, route }) => {
  const [pgConfig, setPGConfig] = useState<any>({});

  const {isLoading} = useRequestAPI({
    requestFn: getDetailPGConfig,
    pageName: route?.name,
    handleSuccess: (resp) => {
      setPGConfig(resp?.data || {});
    },
    internalCall: true
  })

  return (
    <Container className={styles.developerSite}>
      <PageLoading active={isLoading} />
      {
        !isLoading &&
        <Card>
          <div className="header">
            <div className="title">{translate('pages.developer-site.sandbox-credential.title')}</div>
            <div className="actions">{isLoading && <></>}</div>
          </div>
          <div className="content">
            {pgConfig?.state && pgConfig?.state === 'APPROVED' ? (
              <Row gutter={15}>
                <Col xs={8} xxl={6}>
                  {translate('page.profile.field.hashKey')}
                </Col>
                <Col xs={16} xxl={18}>
                  {pgConfig?.hashKey || '-'}{' '}
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(pgConfig?.hashKey);
                      message.success(translate('pages.developer-site.copy.message.success'));
                    }}
                  />
                </Col>
              </Row>
            ) : pgConfig?.state === 'PENDING' ? (
              <Result
                icon={<FieldTimeOutlined />}
                title={
                  <>
                    <p>{translate('pages.developer-site.pending.message-1')}</p>{' '}
                    <p>{translate('pages.developer-site.pending.message-2')}</p>
                  </>
                }
                // extra={<Button type="primary">Next</Button>}
              />
            ) : (
              <Result
                // icon={<SmileOutlined />}
                status="warning"
                title={
                  <>
                    <p>{translate('pages.developer-site.initial.message-1')}</p>{' '}
                    <p>{translate('pages.developer-site.initial.message-2')}</p>
                  </>
                }
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push('/my-profile');
                    }}
                  >
                    {translate('pages.developer-site.routing.button')}
                  </Button>
                }
              />
            )}
          </div>
        </Card>
      }
      {pgConfig?.state && pgConfig?.state === 'APPROVED' && (
        <>
          <br />
          Link Developer Site:{' '}
          <a href={DEVELOPER_SITE_URL} target="_blank" rel="noreferrer">
            {DEVELOPER_SITE_URL}
          </a>
        </>
      )}
    </Container>
  );
};

export default DeveloperSite;
