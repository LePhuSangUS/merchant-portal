import React, { Fragment, useEffect, useState } from 'react';
import { Row } from '@/components';
import { translate, format } from '@/utils';
import styles from './PurpleWalletBalance.less';
import { Space, Button, Card } from 'antd';
import TopupModal from "./TopupModal";
import ModalAddWalletCurrency from "./ModalAddWalletCurrency";
import { useToggle, useSetState } from 'react-use';
import Slider from "react-slick";
import _ from "lodash";
import { getDisbursementRequestCurrencyAPI } from "@/services/disbursement/api"
import { useModal, useRequestAPI } from '@/hooks';
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"
import {
  EditOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { connect } from "dva";
import Empty from 'antd/es/empty';
import classNames from 'classnames';



const PurpleWalletBalance: React.FC = (props: any) => {
  const [showTopup, toggleShowTopup] = useToggle(false);
  const [showAddWallet, toggleShowAddWallet] = useToggle(false);
  const [reloadData, toggleReloadData] = useToggle(false);
  const [walletSelected, setWalletSelected] = useState(null);
  const { dispatch, disbursement, onChangeCurrency,currency } = props;
  const { config, banks } = disbursement || {};
  const { data: disbursementConfig } = config || {};
  const { bankAccount = [] } = disbursementConfig || {};
  const { resp }: any = useRequestAPI({
    requestFn: () => getDisbursementRequestCurrencyAPI({}),
    internalCall: true,
    callDepndencies: [reloadData],
    handleSuccess: (resp) => {
      const data = resp?.data || [];
      const firstCurrency = data?.[0]?.currency;
      if (firstCurrency) {
        onChangeCurrency(firstCurrency)
      }

    }
  });

  const requestDisbusermentCurrencyList = resp?.data || [];


  const handleCloseModalAddWalletCurrency = () => {
    toggleShowAddWallet();
    setWalletSelected(null)
  }
  const handleEditWalletCurrency = (selected: any) => {

    setWalletSelected(selected);
    toggleShowAddWallet()
  }



  const renderWalletCurrency = () => {
    return !_.isEmpty(requestDisbusermentCurrencyList) ? <div className={styles.slider}>

{(_.isArray(requestDisbusermentCurrencyList) ? requestDisbusermentCurrencyList : []).map((item: any) => {
  return <div 
  
  
    className={classNames(styles.walletCurrencyItem,
      {[styles.walletCurrencyItemActive]:currency === item?.currency}
    )}
    
    onClick={()=>onChangeCurrency(item.currency)}>
    <Card className={styles.walletCurrencyContent}>
      <p className={styles.label} >{translate("Disbursement_Limit.Disbursement_Limit")} {item?.currency}</p>
      {item?.status === "APPROVED"
        ? <p className={styles.amount}  >{parseNumberToCurrencyMultipleLanguage(item?.walletDetail?.balance || 0)} {item?.currency} </p>
        : <p className={styles.pendingStatus}  >{translate("disbursement.Pending")} </p>
      }
      <Button onClick={() => handleEditWalletCurrency(item)} className={styles.buttonEdit} type="primary" shape="circle" icon={<EditOutlined />}></Button>
    </Card>
  </div>
})}
    </div> :<Empty/>
  }
  return (
    <Fragment>
      <Card className={styles.component} >
        {renderWalletCurrency()}
        <div className={styles.walletCurrencyAdd} onClick={toggleShowAddWallet}><FileAddOutlined style={{ fontSize: "40px" }} /></div>
        {!_.isEmpty(bankAccount) &&<Button type="primary" onClick={toggleShowTopup}>{translate("Disbursement_Limit.Topup")}</Button>}
      </Card>
      { <TopupModal
        open={showTopup}
        onCancel={toggleShowTopup}
      />}
      {
        showAddWallet && <ModalAddWalletCurrency toggleReloadData={toggleReloadData} requestList={requestDisbusermentCurrencyList} selected={walletSelected} onCancel={handleCloseModalAddWalletCurrency} />
      }
    </Fragment>

  )
}
export default connect(({ dispatch, disbursement }: any) => ({
  dispatch,
  disbursement,

}))(PurpleWalletBalance);
