
import styles from './ModalRemind.less';
import { Modal, Row,Space } from 'antd';
import { connect } from 'dva';
import {  translate } from '@/utils';
import { icWarrning} from '@/assets/icons/table';
import _ from 'lodash';
import { ReactNode } from 'react';
import {Button} from "@/new_components"

const ModalRemind = (props: any) => {
  const { global={},dispatch } = props;
  const { modalRemindData } = global;
  console.log(modalRemindData,global)
  const renderDefaultRemind = () => {
    return <div className={styles.main}>
      <img src={modalRemindData?.icon || icWarrning} alt="icon" />
      <h1 className={styles.title}>{modalRemindData?.title||translate("Remind")}</h1>
      <p className={styles.description}>{ modalRemindData?.description}</p>
      <Space >
        <Button onClick={() => {
          dispatch({type:"global/hideModalRemind"})
        }}>{translate("Close")}</Button>
        <Button
          type='primary'
          onClick={() => {
            if (_.isFunction(modalRemindData?.onConfirm)) {
              modalRemindData?.onConfirm();
              dispatch({type: 'global/hideModalRemind'})
              
          }
        }}>{modalRemindData?.confirmText||translate("Confirm")}</Button>
      </Space>
    </div>
  }
  //=============
  return (
    <Modal
      width={450}
      open={true}
      title={false}
      closeIcon={false}
      closable={false}
      footer={null}
      className={styles.modal}
    >
      {renderDefaultRemind()}
    </Modal>
  );
};

export default connect(({ global, loading, dispatch }: any) => ({
  loading,
  global,
  dispatch,
}))(ModalRemind);
