import React, {} from 'react';
import { Container } from '@/components';
import styles from './index.less';
import GreenWalletBalance from './components/GreenWalletBalance';
import TransactionHistory from './components/TransactionHistory';
import { useToggle } from 'react-use';

interface PageProps {
  history: any
}

const BalanceManagement: React.FC<PageProps> = ({ history }) => {

  const [reloadTransaction,toggleReloadTransaction]=useToggle(false)

  return (
    <Container className={styles.profile}>
      <GreenWalletBalance toggleReloadTransaction={ toggleReloadTransaction} />
      <TransactionHistory history={ history} reloadTransaction={reloadTransaction} />
    </Container>
  )
}

export default BalanceManagement
