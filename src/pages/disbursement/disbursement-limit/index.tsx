import React, {useEffect, useState} from 'react';
import { PageLoading, Container, Icons } from '@/components';
import styles from './index.less';
import PurpleWalletBalance from '../components/PurpleWalletBalance';
import TransactionHistory from '../components/TransactionHistory';
import { useToggle } from 'react-use';
import { connect } from "dva";

interface PageProps {
  history: any
}

const BalanceManagement: React.FC<PageProps> = ({ history,dispatch }:any) => {

  const [currency, setCurrency] = useState("");

  const handleChangeCurrency = (curencySelected: any) => {
    if (curencySelected == currency) {
      setCurrency("")
    } else {
      setCurrency(curencySelected)

    }
  }

  useEffect(() => {
    dispatch({
      type: 'disbursement/getBankConfig',
      payload: {},
  })
  },[])

  return (
    <Container className={styles.profile}>
      <PurpleWalletBalance currency={currency} onChangeCurrency={handleChangeCurrency} />
      <TransactionHistory currency={currency} history={ history}/>
    </Container>
  )
}

export default connect(({ dispatch, history, }: any) => ({
  dispatch,
  history,
}))(BalanceManagement);