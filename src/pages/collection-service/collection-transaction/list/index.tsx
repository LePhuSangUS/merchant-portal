import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';

import { Container, ProTable, FormSelect } from '@/components';
import { translate, renderField, parseOptions, message } from '@/utils';
import { useRequestAPI } from '@/hooks';
import { renderFormTextItem, renderStatus } from '@/utils/render';
import { exportCollectionTransactions, getCollectionTransactions } from '@/services/collection-service/api';
import { TRANSACTION_STATE } from '@/constants/collection-service.constant';
import { trimObjectValue } from '@/utils/utils';
import _ from 'lodash';
import moment from 'moment';

const MAX_DAY_EXPORT = 31;

const CollectionServiceTransactions: ReactPageProps = ({ route, history }) => {
  const [currentFilter, setCurrentFilter] = useState<ObjectType>();

  const exportParamsNameArr = ['transactionId', 'accountName', 'bankAccountNumber', 'dateFr', 'dateTo', 'status'];
  const { request: requestGetCollectionTransactions } = useRequestAPI({
    requestFn: getCollectionTransactions,
    pageName: route?.name,
  });

  const columns: ProColumns[] = [
    {
      title: translate('collection-service.transaction.time'),
      dataIndex: 'transactionDate',
      width: 180,
      sorter: true,
      render: (val: React.ReactNode) => renderField(val, 'datetimes')
    },
    {
      title: translate('collection-service.transaction.code'),
      dataIndex: 'transactionId',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('collection-service.account.name'),
      dataIndex: 'accountName',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('collection-service.account.number'),
      dataIndex: 'bankAccountNumber',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.amount'),
      dataIndex: 'amount',
      width: 140,
      sorter: true,
      render: (val: React.ReactNode) => renderField(val, 'currency')
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'status',
      width: 155,
      sorter: true,
      render: renderStatus(TRANSACTION_STATE)
    },
  ];

  const queryColumns: ProColumns<Record<string, any>>[] = [
    {
      title: translate('collection-service.transaction.code'),
      dataIndex: 'transactionId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('transactionId')
    },
    {
      title: translate('collection-service.account.name'),
      dataIndex: 'accountName',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('accountName')
    },
    {
      title: translate('collection-service.account.number'),
      dataIndex: 'bankAccountNumber',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('bankAccountNumber')
    },
    {
      title: translate('collection-service.transaction.time'),
      dataIndex: 'createdAt',
      width: 200,
      sorter: true,
      valueType: "dateRange",
      search: {
        transform: (value: any) => {
          return {
            dateFr: value[0],
            dateTo: value[1]
          };
        }
      },
    },
    {
      title: translate('form.field.status'),
      key: "status",
      dataIndex: "status",
      renderFormItem: () => (
        <FormSelect
          name="status"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(TRANSACTION_STATE)}
        />
      ),
      sorter: true
    },
  ];

  return (
    <Container>
      <ProTable
        beforeSearchSubmit={(searchParams) => {
          setCurrentFilter(trimObjectValue(_.pick(searchParams, exportParamsNameArr)));
          return searchParams;
        }}
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={requestGetCollectionTransactions}
        editAction={false}
        addAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        showActionColumn={false}
        exportExcelFunc={() => {
          const exportParams = { ..._.pick(history?.location?.query || {}, exportParamsNameArr), ...currentFilter };
          const { dateFr, dateTo } = exportParams;

          if (!dateFr || !dateTo) {
            message.error(translate('collection-service.message.virtualAccount.export.exceededDate', '', { maxDay: MAX_DAY_EXPORT }));
            return;
          }

          const isExceededDate = moment(dateTo).diff(dateFr, 'days') >= MAX_DAY_EXPORT;
          if (isExceededDate) {
            message.error(translate('collection-service.message.virtualAccount.export.exceededDate', '', { maxDay: MAX_DAY_EXPORT }));
            return;
          }

          exportCollectionTransactions(exportParams);
        }}
      />

    </Container>
  )
}

export default CollectionServiceTransactions;
