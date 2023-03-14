
import styles from './ModalViewPermissionTable.less';
import { Modal, Table } from 'antd';
import { connect } from 'dva';
import {  translate } from '@/utils';
import { icClose } from '@/assets/icons/my-profile';
import {
  icCheckOff,
  icCheckOn } from '@/assets/icons/table';
import _ from 'lodash';

const ModalViewPermissionTable = (props: any) => {
  const {  myProfile = {},onCancel } = props;
  const { roleTableData=[] } = myProfile;

  const columnsMap = () => {
   const columns= roleTableData?.role?.map((item:any)=> {
      return  {
        title: (item?.title),
        dataIndex: item?.key,
        align: "center",
        render: (value:any) => <img src={value?icCheckOn:icCheckOff } />
      }
   })
     columns?.unshift(
      {
        title: "",
        dataIndex: 'permissionName',
        align: "start",
        width:160,
        fixed: 'left',

      }
    )
    return columns;
  } 
  const dataSourceMap = () => {
    return roleTableData?.data;
  }

  const renderTable = () => {
    return (<Table pagination={false} columns={columnsMap()} dataSource={dataSourceMap()} />);
  };
  //=============
  return (
    <Modal
      width={1000}
      open={true}
      onCancel={onCancel}
      title={translate('Permission table member')}
      closeIcon={<img src={icClose} />}
      footer={null}
      className={styles.modal}
    >
      {renderTable()}
    </Modal>
  );
};

export default connect(({ myProfile, loading, dispatch }: any) => ({
  loading,
  myProfile,
  dispatch,
}))(ModalViewPermissionTable);
