import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { DownloadOutlined } from '@ant-design/icons';

import { Container, ProTable, FormSelect, Tooltip } from '@/components';
import { translate, parseOptions } from '@/utils';
import { useRequestAPI } from '@/hooks';
import { renderCurrency, renderDate, renderFormTextItem, renderStatus } from '@/utils/render';
import { exportCollectionReconcileRecord, getCollectionReconciles } from '@/services/collection-service/api';
import { COLLECTION_RECONCILE_STATE, COLLECTION_SFTP_STATUS } from '@/constants/collection-service.constant';
import CollectionYellowWallet from '@/pages/collection-service/components/CollectionYellowWallet';

const CollectionServiceReconcile: ReactPageProps = ({ route }) => {
    const { request: requestGetCollectionReconciles } = useRequestAPI({
        requestFn: getCollectionReconciles,
        pageName: route?.name,
    });

    const isFailed = (status: string) => status === 'FAILED';

    const columns: ProColumns[] = [
        {
            title: translate('collection-service.reconcileId'),
            dataIndex: 'reconcileCode',
            width: 180,
            sorter: true,
        },
        {
            title: translate('collection-service.reconcilePeriod'),
            dataIndex: 'reconcileDate',
            width: 110,
            sorter: true,
            render: renderDate
        },
        {
            title: translate('collection-service.transactionQuantity'),
            dataIndex: 'transQuantity',
            width: 140,
            sorter: true,
            render: renderCurrency
        },
        {
            title: translate('collection-service.totalCollectionAmount'),
            dataIndex: 'totalCollectedAmount',
            width: 140,
            sorter: true,
            render: renderCurrency
        },
        {
            title: translate('collection-service.fee'),
            dataIndex: 'totalFee',
            width: 140,
            sorter: true,
            render: renderCurrency
        },
        {
            title: translate('collection-service.totalAmountAfterReconcile'),
            dataIndex: 'totalAmount',
            width: 140,
            sorter: true,
            render: renderCurrency
        },
        {
            title: translate('form.field.status'),
            dataIndex: 'status',
            width: 155,
            sorter: true,
            render: renderStatus(COLLECTION_RECONCILE_STATE)
        },
        {
            title: 'SFTP',
            dataIndex: 'sftpStatus',
            width: 155,
            sorter: true,
            render: (status: string, row: ObjectType) => isFailed(status) ? <Tooltip title={row?.sftpError}>{renderStatus(COLLECTION_SFTP_STATUS)(status)}{` `}</Tooltip> : renderStatus(COLLECTION_SFTP_STATUS)(status)
        },
    ];

    const queryColumns: ProColumns<Record<string, any>>[] = [
        {
            title: translate('collection-service.reconcileId'),
            dataIndex: 'reconcileCode',
            width: 150,
            sorter: true,
            renderFormItem: renderFormTextItem('reconcileCode')
        },
        {
            title: translate('form.field.status'),
            key: "status",
            dataIndex: "status",
            renderFormItem: () => (
                <FormSelect
                    name="status"
                    placeholder={translate('form.placeholder.pleaseSelect')}
                    options={parseOptions(COLLECTION_RECONCILE_STATE)}
                />
            ),
            sorter: true
        },
        {
            title: translate('collection-service.reconcilePeriod'),
            dataIndex: 'reconcileDate',
            width: 200,
            sorter: true,
            valueType: "dateRange",
            search: {
                transform: (value: any) => {
                    return { dateFr: value[0], dateTo: value[1] };
                }
            },
        },
    ];
    

    return (
        <Container>
            <CollectionYellowWallet />
            <ProTable
                columns={columns}
                queryColumns={queryColumns}
                getListFunc={requestGetCollectionReconciles}
                editAction={false}
                addAction={false}
                removeAction={false}
                searchAction={false}
                dateAction={false}
                exportExcel={false}
                extraButtons={(row: ObjectType) => (
                    <>
                        <DownloadOutlined
                            title={translate('form.button.detail')}
                            onClick={() => {
                                exportCollectionReconcileRecord(row?.id);
                            }}
                        />
                    </>
                )}
            />
        </Container>
    )
}

export default CollectionServiceReconcile;
