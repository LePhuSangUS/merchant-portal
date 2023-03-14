import React, {useEffect} from 'react';
import {  Card } from '@/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import { translate, format } from '@/utils';
import styles from './YellowWalletBalance.less';
import { Space, Tooltip } from 'antd';
import { useToggle,useSetState } from 'react-use';
import {getBalance} from "@/services/profile/api"

const YellowWalletBalance: React.FC = () => {
  const [state, setState]= useSetState<any>({
    isLoading: false, 
    walletBalance:null,
    
  }) 
  const { walletBalance } = state;
  useEffect( () => {
    (async () => {
        const walletBalanceResp = await getBalance();
        setState({
          walletBalance: walletBalanceResp?.data,
        })
    })();

},[])

  return (
    <Card className={styles.component} >
      <div className={styles.yellowBox} >
        <Space><span>{translate("pages.dashboard.revenue")}</span>
          <Tooltip

            title={<div className={styles.tooltip}>
              {translate("Is the total revenue being reconciled from NeoX")}
            </div>}
          >
            <InfoCircleOutlined />
          </Tooltip>

        </Space>
        <span className={styles.amount}>{format?.["currency"]?.(walletBalance?.yellowWallet?.balance || 0)} VND</span>
      </div>
    </Card>
  )
}

export default YellowWalletBalance
