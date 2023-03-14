import React from 'react';
import { Container, ProTable } from '@/components';
import { renderChannels, renderStatus, renderTimes } from '@/pages/store';
import type { ProColumns } from '@ant-design/pro-table';
import { getUserAllStore } from '@/services/merchantstore/api';
import { translate, renderField } from '@/utils';

const MerchantStore = () => {
  const columns: ProColumns[] = [
    {
      title: translate('form.field.name'),
      dataIndex: 'fullName',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.phone'),
      dataIndex: 'phone',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.phone, 'phone')
    },
    {
      title: translate('form.field.email'),
      dataIndex: 'email',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.storeName'),
      dataIndex: 'storeName',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('merchantStore.field.channel'),
      dataIndex: 'channel',
      width: 140,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderChannels(row)
    },
    {
      title: translate('merchantStore.field.workingTime'),
      dataIndex: 'workingTimes',
      width: 150,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderTimes(row)
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'isActive',
      width: 120,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderStatus(row)
    },
    {
      title: translate('form.field.createdAt'),
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
    },
    {
      title: translate('form.field.updatedAt'),
      dataIndex: 'lastUpdatedAt',
      width: 150,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.lastUpdatedAt, 'datetimes')
    },
  ]

  return (
    <Container>
      <ProTable
        columns={columns}
        formWidth="740px"
        getListFunc={getUserAllStore}
        exportExcel={false}
        addAction={false}
        showActionColumn={false}
      />
    </Container>
  );
};

export default MerchantStore;
