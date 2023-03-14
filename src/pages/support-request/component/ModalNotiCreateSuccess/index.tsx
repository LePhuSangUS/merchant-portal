import React, { useState } from 'react';
import { Modal, Row, Result, Button } from 'antd';
import { translate } from '@/utils';
import { useHistory } from 'react-router';
import _ from 'lodash';
import styles from "./style.less"
const ModalNotiCreateSuccess = (props: any) => {

  const { data,onCancel } = props;
  const history = useHistory();
  const handleViewDetail = () => {
    const ticketId = data?.id;
    if (_.isEmpty(ticketId)) return;
    history.push(`/support/list/${ticketId}`)
}
  
  return (<Modal
    visible={true}
    footer={null}
    onCancel={onCancel}
    wrapClassName={styles.modal}
 

  >
    <Row justify='center'>
      <Result
        status="success"
        title={translate("support.success")}
        subTitle={translate("support.success__description")}
        extra={[
          <Button type="primary" onClick={handleViewDetail}>
            {translate("form.button.agree")}
          </Button>
        ]}
      />
    </Row>
  </Modal>);
};

export default ModalNotiCreateSuccess;
