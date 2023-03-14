import type { ProColumns } from "@ant-design/pro-table";

import { Container, ProTable } from "@/components";
import { translate } from "@/utils";
import { useRequestAPI } from "@/hooks";
import { renderCurrency, renderDatetimes, renderStatus } from "@/utils/render";
import { getTransactionsHistory } from "@/services/collection-service/api";
import { TRANSACTION_HISTORY_STATE, TRANSACTION_HISTORY_TYPE } from "@/constants/collection-service.constant";
import CollectionGreenWallet from "@/pages/collection-service/components/CollectionGreenWallet";
import { useBoolean } from "react-use";

const CollectionServiceAccountInfo: ReactPageProps = ({ route }) => {
    const [reloadTransactionHistory, triggerReloadTransactionHistory] = useBoolean(false);
    const { request: requestGetTransactionsHistory } = useRequestAPI({
        requestFn: getTransactionsHistory,
        pageName: route?.name,
    });

    const columns: ProColumns[] = [
        {
            title: translate('collection-service.transaction.type'),
            dataIndex: 'transType',
            width: 180,
            sorter: true,
            render: renderStatus(TRANSACTION_HISTORY_TYPE)
        },
        {
            title: translate('form.field.creationTime'),
            dataIndex: 'createdAt',
            width: 140,
            sorter: true,
            render: renderDatetimes
        },
        {
            title: translate('collection-service.transaction.code'),
            dataIndex: 'transId',
            width: 140,
            sorter: true,
            // render: renderCurrency
        },
        {
            title: translate('form.field.amount'),
            dataIndex: 'value',
            width: 140,
            sorter: true,
            render: renderCurrency
        },
        {
            title: translate('form.field.status'),
            dataIndex: 'status',
            width: 155,
            sorter: true,
            render: renderStatus(TRANSACTION_HISTORY_STATE)
        },
    ];

    return (
        <Container>
            <CollectionGreenWallet onReloadTransactionHistory={triggerReloadTransactionHistory} />
            <ProTable
                reloadTable={reloadTransactionHistory}
                titlePage={translate('collection-service.transaction.history')}
                columns={columns}
                getListFunc={requestGetTransactionsHistory}
                editAction={false}
                addAction={false}
                removeAction={false}
                searchAction={false}
                dateAction={false}
                exportExcel={false}
                showActionColumn={false}
            />
        </Container>
    )
}

export default CollectionServiceAccountInfo;
