import { Card, Button } from '@/new_components';
import { FormText, FormSwitch } from '@/components';
import  { useEffect} from 'react';
import styles from './APIConnectionConfig.less';
import {  translate } from '@/utils';
import {  Space, message } from 'antd';
import { connect } from 'dva';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import _ from 'lodash';
interface IProps {
  [key: string]: any;
}

const SERVICES_NAME = {
  DISBURSEMENT: 'DISBURSEMENT',
  COLLECTION: 'COLLECTION',
};
const APIConnectionConfig = (props: IProps) => {
  const { loading, myProfile = {}, dispatch } = props;
  const { merchantConfigData = {} } = myProfile;
  console.log(merchantConfigData);
  const clientSecret = merchantConfigData?.oAuth?.clientSecret || '';
  const clientId = merchantConfigData?.oAuth?.clientId || '';
  const isActiveDisbursement = merchantConfigData?.disbursement?.isActive;
  const isActiveCollection = merchantConfigData?.collectionService?.isActive;

  const handleToggleActiveService = (checked: any, serviceName: string) => {
    switch (serviceName) {
      case SERVICES_NAME?.DISBURSEMENT:
        dispatch({
          type: 'myProfile/toggleDisbursementActive',
          payload: {
            isActive: checked,
          },
        });
        break;
      case SERVICES_NAME?.COLLECTION:
        message.info(translate("Coming soon"));
        break;
      default:
        break;
    }
  };
  const serviceMapping = [
    {
      id: '1',
      label: translate('Disbursement'),
      content: (
        <FormSwitch
          label={translate('Disbursement')}
          fieldProps={{
            checked: isActiveDisbursement,
            disabled:_.isEmpty(merchantConfigData?.disbursement),
            onChange: (e) => handleToggleActiveService(e, SERVICES_NAME?.DISBURSEMENT),
          }}
        />
      ),
    },
    {
      id: '2',
      label: translate('Collection'),
      content: (
        <FormSwitch
          fieldProps={{
            checked: isActiveCollection,
            disabled:_.isEmpty(merchantConfigData?.collectionService),
            onChange: (e) => handleToggleActiveService(e, SERVICES_NAME?.COLLECTION),
          }}
          label={translate('Collection')}
        />
      ),
    },
  ];

  //start get config
  useEffect(() => {
    dispatch({ type: 'myProfile/getMerchantConfig' });
  }, []);
  const renderComponent = () => {
    return (
      <div className={styles.content}>
        <FormText
          labelCol={{ span: 24 }}
          label={translate('Client ID')}
          placeholder={''}
          fieldProps={{
            size: 'large',
            readOnly: true,
            addonAfter: (
              <CopyToClipboard
                text={`${clientId}`}
                onCopy={() => {
                  message.success({
                    content: translate('Copied'),
                  });
                }}
              >
                <Button>{translate('Copy')}</Button>
              </CopyToClipboard>
            ),
            value: clientId,
          }}
        />
        <FormText
          labelCol={{ span: 24 }}
          placeholder={''}
          label={translate('Secret key')}
          fieldProps={{
            size: 'large',
            readOnly: true,
            addonAfter: (
              <CopyToClipboard
                text={`${clientSecret}`}
                onCopy={() => {
                  message.success({
                    content: translate('Copied'),
                  });
                }}
              >
                <Button>{translate('Copy')}</Button>
              </CopyToClipboard>
            ),
            value: clientSecret,
          }}
        />
        <div className={styles.applyService} >
          <h4  >{translate('Apply service')}</h4>
          <Space size={64}>
          {serviceMapping?.map((item) => {
            return item?.content;
          })}
        </Space>
        </div>

      </div>
    );
  };
  return (
    <Card title={<h1>{translate('APIs Connection Information Configuration')}</h1>}>
      {renderComponent()}
    </Card>
  );
};

export default connect(({ myProfile, loading, dispatch }: any) => ({
  loading,
  myProfile,
  dispatch,
}))(APIConnectionConfig);
