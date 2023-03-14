import { Button, CustomUpload,FormText,FormAddress } from '@/new_components';
import {  FormItem } from '@/components';
import styles from './ModalEditInformation.less';
import { Modal, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import { translate } from '@/utils';
import { icClose } from '@/assets/icons/my-profile';
import { phoneNumberRules,merchantNameRules } from '@/utils/rules';
import { formatPhoneNumber } from '@/utils/format';
import { replaceAllSpace } from '@/utils/parse';
import dftAvatar from "@/assets/icons/navigation-avatar-default.svg";
import _ from 'lodash';

const ModalEditInformation = (props: any) => {
  const { myProfile = {}, dispatch } = props;
  const [form] = Form.useForm();
  const { currentItem = {} } = myProfile;
  console.log(myProfile);
  const handleCancel = () => {
    if (form?.isFieldsTouched()) {
      dispatch({
        type: 'global/showModalRemind',
        payload: {
          modalRemindData: {
            onConfirm: () => {
              dispatch({ type: 'myProfile/hideModal' });
            },
            confirmText: translate("Exit"),
            description: translate("Close modal warning message"),
          },
        },
      });
      
    } else {
      dispatch({ type: 'myProfile/hideModal' }); 
      
    }
  };

  const handleSubmitForm = (values:any) => {
    console.log(values);
    dispatch({
      type: 'myProfile/updateMerchantInfo', payload: {
        ...values,
        merchantPhone:replaceAllSpace(values?.merchantPhone)
      }
    });
  };
  const renderForm = () => {
    return (
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          ...currentItem,
        merchantPhone:formatPhoneNumber(currentItem?.merchantPhone)

        }}
        onFinish={handleSubmitForm}
      >
        <Row>
          <FormItem noStyle hidden name="_id"></FormItem>
          <Col sm={24} md={6}>
            <CustomUpload
              uploadType="avatar"
              name="visibleAvatar"
              accept="image/png, image/jpeg"
              defaultImage={dftAvatar}
            ></CustomUpload>
          </Col>
          <Col sm={24} md={18}>
            <FormText
              name={'name'}
              rules={merchantNameRules()}
              fieldProps={{ size: 'large' }}
              placeholder={translate('Placeholder: Enter information')}
              label={translate('Merchant name')}
            />
            <FormText
              fieldProps={{ size: 'large' }}
              rules={phoneNumberRules()}
              normalize={formatPhoneNumber}
              name="merchantPhone"
              placeholder={translate('Placeholder: Enter information')}
              label={translate('Merchant phone number')}
            />
            <FormAddress
              size="large"
              name="address"
              required
              initialValue={currentItem?.address}
              label={translate('Address')}
            />
          </Col>
        </Row>
        <Row justify="end">
          <FormItem shouldUpdate noStyle>
            {(formItem: any) => {
              console.log(formItem?.isFieldsTouched());
              return (
                <Button disabled={!formItem?.isFieldsTouched()} type="primary" htmlType='submit' size="large">
                  {translate('Save information')}
                </Button>
              );
            }}
          </FormItem>
        </Row>
      </Form>
    );
  };
  return (
    <Modal
      width={600}
      open={true}
      onCancel={handleCancel}
      title={translate('Edit information')}
      closeIcon={<img src={icClose} />}
      footer={null}
      className={styles.modal}
      maskClosable={false}

    >
      {_.isEmpty(currentItem) ? null : renderForm()}
    </Modal>
  );
};

export default connect(({ myProfile, loading, dispatch }: any) => ({
  loading,
  myProfile,
  dispatch,
}))(ModalEditInformation);
