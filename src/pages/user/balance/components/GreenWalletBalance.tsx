import React, { Fragment, useEffect } from 'react';
import { Card, Button, Row } from '@/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import { translate, renderField } from '@/utils';
import styles from './GreenWalletBalance.less';
import { Space, Tooltip } from 'antd';
import WithdrawalRequestModal from "./WithdrawalRequestModal";
import { useToggle, useSetState } from 'react-use';
import { getBalance } from "@/services/profile/api"

const GreenWalletBalance: React.FC<{toggleReloadTransaction: () => void}> = (props: any) => {

  const { toggleReloadTransaction } = props;
  const [showWithdrawal, toggleWithdrawal] = useToggle(false);
  const [refreshWalletBalance, toggleRefreshWalletBalance] = useToggle(false);
  const [state, setState] = useSetState<any>({
    isLoading: false,
    walletBalance: null,

  })
  const { walletBalance } = state;
  const balance = walletBalance?.greenWallet?.balance || 0;
  useEffect(() => {
    (async () => {
      const walletBalanceResp = await getBalance();
      setState({
        walletBalance: walletBalanceResp?.data,
      })
    })();

  }, [refreshWalletBalance])
  return (
    <Fragment>
      <Card className={styles.component} >
        <Row className={styles.main}>
          <div className={styles.greenBox} >
            <Space><span>{translate("balance.title.accountInfo")}</span>
              <Tooltip
                title={<div className={styles.tooltip}>
                  {translate("balance.title.accountInfo.tooltip")}
                </div>}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <span className={styles.amount}  >{renderField (balance,"currency","đ")}</span>
          </div>
          <Button type="primary" onClick={() => { toggleWithdrawal() }}>{translate("balance.button.withdraw")}</Button>
        </Row>
      </Card>
      {showWithdrawal && <WithdrawalRequestModal toggleRefreshWalletBalance={() => {
        toggleRefreshWalletBalance()
        toggleReloadTransaction();
      }} onClose={toggleWithdrawal} walletBalance={walletBalance} />}
    </Fragment>


  )
}

export default GreenWalletBalance
