import React, { useEffect } from "react";
import { connect } from "dva";
import { Card, Row, WalletBox, WalletBoxContainer } from "@/components";
import { translate } from "@/utils";

const PurpleWalletBalance: React.FC = (props: any) => {
	const { dispatch, collectionService } = props;
	const { yellowWallet } = collectionService;

	useEffect(() => {
		dispatch({ type: 'collectionService/getTotalReceivedAmount' })
	}, [dispatch])

	return (
		<Card style={{ marginBottom: 10 }}>
			<Row>
				<WalletBoxContainer>
					<WalletBox
						title={translate('collection-service.totalCollectionAmount')}
						balance={yellowWallet?.balance || 0}
						backgroundColor="#fff2cc"
						borderColor="#fcbb0a"
					/>
					{/* <WalletBox title={translate('collection-service.totalUnpaidCollection')} balance={10000} /> */}
				</WalletBoxContainer>
			</Row>
		</Card>
	)
}
export default connect(({ dispatch, collectionService }: any) => ({
	dispatch,
	collectionService,
}))(PurpleWalletBalance);
