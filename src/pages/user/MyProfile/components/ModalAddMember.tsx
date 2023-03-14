import { Button, CustomUpload,FormSelect,FormText } from '@/new_components';
import { FormItem } from '@/components';
import  { Fragment} from 'react';
import styles from './ModalAddMember.less';
import { Modal, Form, Row, Col} from 'antd';
import { connect } from 'dva';
import { parseOptions, translate } from '@/utils';
import { icClose } from '@/assets/icons/my-profile';
import { icOpenFile } from '@/assets/icons/table';
import ModalViewPermissionTable from './ModalViewPermissionTable';
import { AUTHORIZATION_MANAGEMENT_USER_ROLES } from "@/constants";

import { phoneNumberRules, merchantNameRules, emailRules, requiredField } from '@/utils/rules';
import { replaceAllSpace } from '@/utils/parse';
import { formatPhoneNumber } from '@/utils/format';

import _ from 'lodash';
import {MODAL_TYPE} from "@/constants"

const ModalEditInformation = (props: any) => {
  const {  myProfile = {}, dispatch, onCancel = () => {} } = props;
  const [form] = Form.useForm();
  const { merchantUserRoles, modalViewPermissionVisible, currentMemberItem, modalMemberType } = myProfile;
  
  const merchantUserRolesOmitBusinessOwner=merchantUserRoles?.filter((item:any)=>!(item?.code === AUTHORIZATION_MANAGEMENT_USER_ROLES?.BUSINESS_OWNER))

  const checkEditModalType=() => modalMemberType === MODAL_TYPE?.EDIT;

  const handleCancel = () => {
    if (form?.isFieldsTouched()) {
      dispatch({
        type: 'global/showModalRemind',
        payload: {
          modalRemindData: {
            onConfirm: () => {
              onCancel()
            },
            confirmText: translate("Exit"),
            description: translate("Close modal warning message"),
          },
        },
      });
      
    } else {
      onCancel()
      
    }
  };
  const handleShowModalViewPermission = () => {
    dispatch({ type: 'myProfile/showModalViewPermission' });
  };
  const handleHideModalViewPermission = () => {
    dispatch({ type: 'myProfile/hideModalViewPermission' });
  };

  const handleSubmitForm = (values: any) => {
    if (checkEditModalType()) {
      dispatch({
        type: 'myProfile/editMember', payload: {
          ...values,
        phone:replaceAllSpace(values?.phone)
        }
      });

      return;
    } else {
      dispatch({
        type: 'myProfile/addMember', payload: {
          ...values,
        phone:replaceAllSpace(values?.phone)

        }
      });
      
    }
  };
  const renderForm = () => {
    return (
      <Form layout="vertical" initialValues={{
        ...currentMemberItem,
        roleId: currentMemberItem?.roleIds?.[0],
        phone:formatPhoneNumber(currentMemberItem?.phone)
      }}
      form={form} onFinish={handleSubmitForm}>
        <Row>
          {checkEditModalType()&&<FormItem hidden name="_id"></FormItem>}
          <Col sm={24} md={6}>
            <CustomUpload
              uploadType="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
            ></CustomUpload>
          </Col>
          <Col sm={24} md={18}>
            <FormText
              name="fullName"
              rules={merchantNameRules()}
              fieldProps={{
                size: 'large',
                readOnly:checkEditModalType()

              }}
              placeholder={translate('Placeholder: Enter information')}
              label={translate("Member's name")}
              
            />
            <FormText
              fieldProps={{
                size: 'large',
                readOnly:checkEditModalType()
              }}
              rules={emailRules()}
              name="email"
              placeholder={translate('Placeholder: Enter information')}
              label={translate('Email login')}
              readOnly={checkEditModalType()}

            />
            <FormText
              fieldProps={{ size: 'large' }}
              rules={phoneNumberRules()}
              normalize={formatPhoneNumber}
              name="phone"
              placeholder={translate('Placeholder: Enter information')}
              label={translate('Contact phone number')}
            />
            <Row justify={'end'}>
              <span className={styles.viewPermissionBlock} onClick={handleShowModalViewPermission}>
                <img src={icOpenFile} />
                <span className={styles.viewPermissionTable}>
                  {translate('View permission table')}
                </span>
              </span>
              <FormSelect
              rules={[requiredField]}
              name="roleId"
              placeholder={translate('Placeholder: Select information')}
              label={translate('Permission')}
              options={parseOptions(merchantUserRolesOmitBusinessOwner, '_id', 'name')}
            />
            </Row>
            
          </Col>
        </Row>
        <Row justify="end">
          <FormItem shouldUpdate noStyle>
            {(form: any) => {
              return (
                <Button type="primary" htmlType="submit" size="large">
                  {checkEditModalType()?translate('Save information'):translate('Create new')}
                </Button>
              );
            }}
          </FormItem>
        </Row>
      </Form>
    );
  };
  return (
    <Fragment>
      <Modal
        width={600}
        open={true}
        onCancel={handleCancel}
        title={translate('Add member')}
        closeIcon={<img src={icClose} />}
        footer={null}
        className={styles.modal}
        maskClosable={true}
      >
        {renderForm()}
      </Modal>

      {modalViewPermissionVisible && (
        <ModalViewPermissionTable onCancel={handleHideModalViewPermission} />
      )}
    </Fragment>
  );
};

export default connect(({ myProfile, loading, dispatch }: any) => ({
  loading,
  myProfile,
  dispatch,
}))(ModalEditInformation);
