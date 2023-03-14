
import React, { Fragment, useEffect, useState } from 'react'
import { Card, Icons, Button, Space, Modal } from '@/components'
import { translate, format } from '@/utils';
import { useToggle,useSetState } from 'react-use';
import styles from "./WalletOptionItem.less";
import LinkWalletModal from '@/pages/user/balance/modals/link-wallet';
import {  checkWalletInfo } from '@/services/profile/api';

const { WalletOutlined } = Icons;
const COUNT_DOWN_TIME = 60 // Thời gian countdown có thể gửi lại OTP
const COUNT_DOWN_OTP = 3 // Số lần gửi sai OTP tối đa cho 1 lần đăng ký

interface IProps{
    walletInfo: any,
    handleRefreshWalletInfo:any
}
const WalletOptionItem: React.FC<any> = (props:IProps) => {
    const [showLinkWallet, setToggleLinkWallet] = useToggle(false);
    const [merchantInfo, setMerchantInfo] = useState<any>(null)
    const [isLoading, setLoading] = useState<boolean>(false)

    const { walletInfo,handleRefreshWalletInfo } = props;    
    const handleFinish: any =async  () => {
        setLoading(false)
        handleRefreshWalletInfo();
        setToggleLinkWallet();
    
    }

    useEffect(() => {

        (async function() {
            const resp = await checkWalletInfo();
            setMerchantInfo(resp?.data?.info)

            
        })()

    },[])

    return (
        <Fragment>
            <Card className={styles.component} >
                <WalletOutlined className={styles.walletIcon} />

                {
                    walletInfo?.isLinked ? <Space direction="vertical">
                        <Space><span>{translate("wallet")}: </span><span>{`${walletInfo?.walletAccount || ""} - ${walletInfo?.walletName || ""}`}</span></Space>
                        <Space><span>{translate("current_balance")} : </span><span>{format?.["currency"](walletInfo?.balance || 0)}</span>VND</Space>
                    </Space> : <Button type="primary" onClick={setToggleLinkWallet}>{translate("link_to_my_neopay_wallet")}</Button>
                }

            </Card>

            {showLinkWallet && <Modal
                destroyOnClose
                width={800}
                maskClosable={false}
                visible={true}
                title={translate('balance.title.linking')}
                className={styles.walletModal}
                footer={null}
                onCancel={setToggleLinkWallet}

            >
                <LinkWalletModal
                    countdownTime={COUNT_DOWN_TIME}
                    countdownOtp={COUNT_DOWN_OTP}
                    merchant={merchantInfo}
                    onSubmit={handleFinish}
                    onCancel={setToggleLinkWallet}
                    onLoading={setLoading}
                />
            </Modal>
            }
        </Fragment>

    )
}

export default WalletOptionItem