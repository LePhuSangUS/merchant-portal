import { Card, Table, Status, Button, ButtonActionRow } from '@/new_components';
import { accountAPI } from '@/new_service/merchantAPI';
import { Fragment, useEffect, useState } from 'react';
import styles from './AuthorizationManagement.less';
import { format, translate } from '@/utils';
import MemberColumnItem from './MemberColumnItem';
import { icRoleNone, icRoleUserEmpty } from '@/assets/icons/table';
import { MEMBER_STATUS_LIST, MODAL_TYPE } from '@/constants';
import ModalAddMember from './ModalAddMember';
import { connect } from 'dva';
import { Row } from 'antd';
import { AUTHORIZATION_MANAGEMENT_USER_ROLES } from '@/constants';
import { Avatar, Skeleton } from "antd"

interface IProps {
  [key: string]: any;
}

const AuthorizationManagement = (props: IProps) => {
  const { dispatch, myProfile = {}, currentMerchant, loading } = props;
  
  const { modalAddMemberVisible } = myProfile;
  const { userInfo = {} } = currentMerchant;
  const { roleCode } = userInfo;
  const isAuthorizationManagement = AUTHORIZATION_MANAGEMENT_USER_ROLES?.[roleCode];

  const loadingUser = loading?.effects?.["user/fetchCurrentMerchant"];
  console.log(loading)
  const columns: any = [
    {
      title: translate('Member'),
      dataIndex: 'member',
      render: (value: string, record: any) => <MemberColumnItem dataItem={record} />,
      align: 'center',
    },
    {
      title: translate('Creation time'),
      dataIndex: 'createdAt',
      render: (value: string, record: any) => format.datetimes(value),
    },
    {
      title: translate('Status'),
      dataIndex: 'isActive',
      render: (value: string, record: any) => <Status value={value} options={MEMBER_STATUS_LIST} />,
    },
  ];

  const handleShowModalAddMember = (modalType = MODAL_TYPE?.EDIT, currentMemberItem: any) => {
    dispatch({
      type: 'myProfile/showModalAddMember',
      payload: {
        currentMemberItem,
        modalMemberType: modalType,
      },
    });
  };
  const handleHideModalAddMember = () => {
    dispatch({ type: 'myProfile/hideModalAddMember' });
  };

  const handleToggleActiveMember = (record: any) => {
    const isActive = record?.isActive;
    const description = isActive
      ? translate('You definitely want to deactivate this account?', '')
      : translate('Are you sure you want to activate this account?');
    dispatch({
      type: 'global/showModalRemind',
      payload: {
        modalRemindData: {
          onConfirm: () => {
            dispatch({
              type: 'myProfile/setActiveMerchantUser',
              payload: { _id: record?._id },
            });
          },
          description,
        },
      },
    });
  };
  const handleDeleteMember = (record: any) => {
    console.log(record);
    dispatch({
      type: 'global/showModalRemind',
      payload: {
        modalRemindData: {
          onConfirm: () => {
            dispatch({ type: 'myProfile/deleteMerchantUser', payload: { _id: record?._id } });
          },
          description: translate('Are you sure you want to delete member {member}?', '', {
            member: record?.email,
          }),
        },
      },
    });
  };

  const renderActionRow = (value?: any, record?: any) => {
    const isActive = record?.isActive;
    return (
      <>
        <ButtonActionRow
          onClick={() => handleShowModalAddMember(MODAL_TYPE?.EDIT, record)}
          type="VIEW_EDIT"
        />
        <ButtonActionRow
          onClick={() => handleToggleActiveMember(record)}
          type={isActive ? 'INACTIVE' : 'ACTIVE'}
        />
        <ButtonActionRow onClick={() => handleDeleteMember(record)} type="DELETE" />
      </>
    );
  };
  const renderTableAction = () => {
    return (
      <Button
        onClick={() => handleShowModalAddMember(MODAL_TYPE?.CREATE, null)}
        type="primary"
        size="large"
      >
        {translate('Add member')}
      </Button>
    );
  };

  useEffect(() => {
    dispatch({ type: 'myProfile/getMerchantUserRoles' });
    dispatch({ type: 'myProfile/getRoleTable' });
  }, []);

  const renderComponent = () => {
    if(loadingUser)return <div className="skeleton-group">
    <Skeleton className={styles.skeleton} />
    <Skeleton className={styles.skeleton} />
    <Skeleton className={styles.skeleton} />
    </div>; 
    if (isAuthorizationManagement) return<Table
    tableTitle={translate('Permission management')}
    columns={columns}
    defaultParams={{ pageSize: 5, pageIndex: 1 }}
    getDataFromAPI={accountAPI?.getMerchantUsers}
    renderTableAction={renderTableAction}
    showActionRow={true}
    renderActionRow={renderActionRow}
    filterable={true}
    localeTableEmpty={ {
      emptyText: (
        <Row justify={'center'}>
          <div className={styles.empty}>
            <img src={icRoleUserEmpty} alt="icons" />
            <div>
              <p>{translate('Merchant users empty')}</p>
            </div>
            <Button
            onClick={() => handleShowModalAddMember(MODAL_TYPE?.CREATE, null)}
            type="primary"
            size="large"
          >
            {translate('Add member')}
          </Button>
          </div>

        </Row>
      ),
    }}
    />
    return<Table
    tableTitle={translate('Permission management')}
      showHeader={false}
      isTableEmpty={true}
      localeTableEmpty={{
      emptyText: (
        <Row justify={'center'}>
          <div className={styles.empty}>
            <img src={icRoleNone} alt="icons" />
            <div>
              <p>{translate('Do not have permission to view description')}</p>
            </div>
          </div>
        </Row>
      ),
    }}
    />
  }
  return (
    <Fragment>
      <Card>
       
       { renderComponent()}
      </Card>

      {modalAddMemberVisible && <ModalAddMember onCancel={handleHideModalAddMember} />}
    </Fragment>
  );
};

export default connect(({ myProfile, loading, dispatch }: any) => ({
  loading,
  myProfile,
  dispatch,
}))(AuthorizationManagement);
