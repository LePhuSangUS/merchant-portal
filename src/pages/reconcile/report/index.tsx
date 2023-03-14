import React, { FC } from 'react';
import { Container, FormSelect, FormText, Icons, ProColumns, ProTable, Status } from '@/components';
import { getReconciliations, exportReconciliation ,getTotalAmountReconcileUnPaid} from '@/services/reconcile/api';
import { translate, renderField, parseOptions } from '@/utils';
import { RECONCILE_STATUS_LIST } from '@/constants';
import {RECONCILE_SFTP_STATUS} from "@/constants/reconcile.constant"
import { renderStatus } from '@/utils/render';
import { useRequestAPI } from '@/hooks';
import { Card, Typography, Tooltip } from "antd";
import styles from "./styles.less";
import {format} from "@/utils"
const { DownloadOutlined } = Icons;
interface ReconcileReportProps {
  route: Record<string, any>;
}

const ReconcileReport: FC<ReconcileReportProps> = ({route}) => {
  const isFailed = (status: string) => status === 'FAILED';

  const isShowDownloadButton = (val: string ) => val === 'DONE'|| val === 'APPROVED'|| val === 'PAID'|| val === 'UNPAID' || val === 'PROCESSING';

  const {request: requestGetReconciliations} = useRequestAPI({
    requestFn: getReconciliations,
    pageName: route?.name,
  })
  // const {resp: respUnpaid}:any = useRequestAPI({
  //   requestFn: getTotalAmountReconcileUnPaid,
  //   pageName: route?.name,
  //   internalCall: true,

  // })
  const renderButtons = (row: any) => {
    return (
      isShowDownloadButton(row?.state)
        ? (
        <DownloadOutlined
          title={translate('locale.download')}
          onClick={() => exportReconciliation(row)}
        />
      ) : null
    )
  };

  const columns = [
    {
      title: translate('reconcile.field.code'),
      dataIndex: 'code',
      width: 230,
      sorter: true,
      render: renderField
    },
    {
      title: translate('reconcile.field.period'),
      dataIndex: 'period',
      // sorter: true,
      render: (dom: any, row: any) =>format.date(row?.startTime),
      width: 250,
      
    },
    {
      title: translate('reconcile.field.totalBillAmount'),
      dataIndex: 'totalBillAmount',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => format.currency(row?.totalBillAmount)
    },
    {
      title: translate('reconcile.field.paymentAmount'),
      dataIndex: 'totalBillPaidAmount',
      width: 200,
      sorter: true,
      hideInSearch: true,
      render: (dom: any, row: any) => format.currency(row?.totalBillPaidAmount)
    },
    {
      title: translate('reconcile.field.refundAmount'),
      dataIndex: 'totalRefundAmount',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => format.currency(row?.totalRefundAmount)
    },
    {
      title: translate('reconcile.field.fee'),
      dataIndex: 'fee',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => format.currency(row?.fee)
    },
    {
      title: translate('reconcile.field.afterReconcileAmount'),
      dataIndex: 'totalAmountReconciliation',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => format.currency(row?.totalAmountReconciliation)
    },
    {
      title: translate('reconcile.field.actualAmountReceived'),
      dataIndex: 'totalAmountPaid',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => format.currency(row?.totalAmountReconciliation < 0 ? 0 : row?.totalAmountPaid)
    },
    {
      title: translate('reconcile.field.status'),
      dataIndex: 'state',
      width: 180,
      sorter: true,
      align: 'center',
      render: renderStatus(RECONCILE_STATUS_LIST)
    },
    {
      title: 'SFTP',
      dataIndex: 'sftpStatus',
      width: 120,
      render: (status: string, row: ObjectType) => isFailed(status) ? <Tooltip title={row?.sftpFailedReason}>{renderStatus(RECONCILE_SFTP_STATUS)(status)}{` `}</Tooltip> : renderStatus(RECONCILE_SFTP_STATUS)(status)
  },
  ];

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate('reconcile.field.code'),
      dataIndex: 'code',
      width: 150,
      sorter: true,
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
    },
    {
      title: translate("reconcile.field.status"),
      key: "state",
      dataIndex: "state",
      renderFormItem: () => (
        <FormSelect
          name="state"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(RECONCILE_STATUS_LIST)}
        />
      ),
      sorter: true
    },
    {
      title: translate('reconcile.field.period'),
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
  return (
    <Container>

      {/* <Card style={{marginBottom:"10px"}}>
        <div className={styles.totalCard}>
          <Text>{ translate("reconcile.field.totalAmountReconcileUnPaid")}</Text>
          <Text  className={styles.amount}>{renderField(respUnpaid?.data||0,"currency")} <p className={styles.unit}>đ</p></Text>
        </div>
      </Card> */}
      <ProTable
        searchProps={{
          searchText: translate('form.field.search')
        }}
        rowKey="code"
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={requestGetReconciliations}
        editAction={false}
        removeAction={false}
        addAction={false}
        exportExcel={false}
        searchAction={false}
        dateAction={false}
        extraButtons={renderButtons}
      />
    </Container>
  );
};

export default ReconcileReport;
