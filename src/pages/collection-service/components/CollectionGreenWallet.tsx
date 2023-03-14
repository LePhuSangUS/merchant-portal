import React, { useEffect } from "react";
import { connect } from "dva";
import { Button, Card, Row, WalletBox, WalletBoxContainer } from "@/components";
import { translate } from "@/utils";
import CollectionWithdrawalModal from "./CollectionWithdrawalModal";
import { useModal } from "@/hooks";
import { useToggle } from "react-use";

const CollectionGreenWallet: React.FC = (props: any) => {
	const { dispatch, collectionService } = props;
	const { greenWallet } = collectionService;
	const [showCashOutModal, openCashOutModal, closeCashOutModal] = useModal();
	const [reloadWallet, triggerReloadWallet] = useToggle(true);

	useEffect(() => {
		dispatch({ type: 'collectionService/getCollectionBalance' })
	}, [dispatch, reloadWallet])

	return (
		<Card style={{ marginBottom: 10 }}>
			<Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
				<WalletBoxContainer>
					<WalletBox
						title={translate('collection-service.transaction.collectionAccount')}
						balance={greenWallet?.balance || 0}
						backgroundColor="#bfe7c3"
						borderColor="#03580c"
					/>
				</WalletBoxContainer>

				<Button type="primary" onClick={openCashOutModal}>{translate('collection-service.button.cashout')}</Button>
			</Row>

			{showCashOutModal && <CollectionWithdrawalModal
				visible={showCashOutModal}
				onCancel={closeCashOutModal}
				toggleRefreshWalletBalance={triggerReloadWallet}
				onReloadTransactionHistory={props?.onReloadTransactionHistory}
			/>}
		</Card>
	)
}
export default connect(({ dispatch, collectionService }: any) => ({
	dispatch,
	collectionService,
}))(CollectionGreenWallet);
