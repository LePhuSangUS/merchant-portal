import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import _ from 'lodash';
import { Row } from "antd"

import { Container, Icons, ProTable, Status } from '@/components';
import { translate, renderField } from '@/utils';
import { exportTransactionHistory, getTransactionHistoryList } from '@/services/transaction-history/api';
import { TRANSACTION_CHANNELS_LIST, TRANSACTION_STATUS_LIST } from "@/constants";
import ExportModal from '../components/ExportModal';
import { shortString } from '@/utils/utils';
import { useExportModal, useGetSysConfig, useRequestAPI } from '@/hooks';
import { renderFormTextItem, renderStatus } from '@/utils/render';

const { EyeOutlined } = Icons

interface PageProps {
  history: Record<string, any>;
  location: Record<string, any>;
  route: Record<string, any>;
}

const TransactionList: React.FC<PageProps> = ({ history, location, route }) => {
  const [showExportModal, openExportModal, closeExportModal] = useExportModal()
  const { request: requestTransactionHistoryList } = useRequestAPI({
    requestFn: getTransactionHistoryList,
    pageName: route?.name
  })
  const paymentChannel = useGetSysConfig('PAYMENT_CHANNEL')

  const columns: ProColumns[] = [
    {
      title: translate('refund.field.billId'),
      dataIndex: 'orderId',
      width: 160,
      sorter: true,
      // render: renderField
    },
    {
      title: translate('refund.field.billAmount'),
      dataIndex: 'amount',
      width: 150,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderField(row?.amount || 0, 'currency')
    },
    {
      title: translate('transaction.field.orderInfo'),
      dataIndex: 'orderInfo',
      // width: 200,
      sorter: true,
      render: (value: any) => shortString(value, 65, '...')
    },
    {
      title: translate('transaction.field.payChannel'),
      dataIndex: 'paymentChannels',
      width: 150,
      sorter: true,
      align: 'center',
      render: (value: any, record: any) => {
        return <Row gutter={[12, 12]}>
          {
            !_.isEmpty(record?.paymentChannels) ? (record?.paymentChannels?.map((channel: any) => {
              return <Status key={`${record?.id}-${channel}`} value={channel} options={TRANSACTION_CHANNELS_LIST || "-"} />
            })) : "-"
          }
        </Row>
      }
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'state',
      width: 150,
      sorter: true,
      align: 'center',
      render: renderStatus(TRANSACTION_STATUS_LIST)
    },
    {
      title: translate('form.field.createdAt'),
      dataIndex: 'createdAt',
      width: 170,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
    },
    {
      title: translate('form.field.updatedAt'),
      dataIndex: 'lastUpdatedAt',
      width: 170,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.lastUpdatedAt, 'datetimes')
    },
  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate('refund.field.billId'),
      dataIndex: 'orderId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('orderId')
    },
    {
      title: translate('form.field.createdAt'),
      dataIndex: 'createdAt',
      width: 150,
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
  ]

  const sortQueryColumns = ['orderId', 'channelID', 'createdAt', 'state']

  return (
    <Container>
      <ProTable
        columns={columns}
        queryColumns={queryColumns}
        form={null}
        getListFunc={requestTransactionHistoryList}
        addAction={false}
        editAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        showPickList={false}
        sortQueryColumns={sortQueryColumns}
        exportExcelFunc={openExportModal}
        extraButtons={(row: any) => (
          <>
            <EyeOutlined
              key='DetailButton'
              title={translate('form.button.detail')}
              onClick={() => history.push(`${location?.pathname}/${row?._id}`)}
            />
          </>
        )}
      />

      {showExportModal && <ExportModal
        visible={showExportModal}
        // onOk={handleOkConversionConfirmModal}
        onCancel={closeExportModal}
        exportExcelFunc={exportTransactionHistory}
        paymentChannel={paymentChannel}
      />}
    </Container>
  )
}

export default TransactionList
