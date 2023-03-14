import { Container, PageLoading, ProColumns, ProTable, FormSelect, Button, Icons, FormText, Status } from "@/components"
// import { DISBURSEMENT_HISTORIES_STATUS } from "@/constants"
import { renderField, translate, message, format} from "@/utils"
import { Fragment, useState } from "react"
import { getReconcileLimitAPI,exportReconciles,exportDisbursementReconcileById} from '@/services/disbursement/api';
import ExportModal from './components/ExportModal';
import { useExportModal } from '@/hooks';
import moment from "moment";
import {Tooltip, Table} from "antd"
import { SFTP_STATUS } from "@/constants/disbursement.constants"

const { EyeOutlined, DownloadOutlined } = Icons;
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"

const DisbursementReconcile = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showExportModal, openExportModal, closeExportModal] = useExportModal()
  const renderPeriod = (period: any,) => {
    return `${moment(period).isValid()?moment(period)?.utc()?.format("DD/MM/YYYY"):"" }`
  }

  const columns: ProColumns[] = [
    {
      title: translate('Disbursement_Reconcile.Reconcile_Code'),
      dataIndex: 'id',
      width: 200,
      render: (dom: any, row: any) => renderField(row?.id)
    },
    {
      title: translate('Disbursement_Reconcile.Reconcile_Period'),
      dataIndex: 'period',
      width: 180,
      render:(dom:any,record:any)=>renderPeriod(record?.period)
    },
    {
      title: translate('Disbursement_Reconcile.Transaction_Quantity'),
      dataIndex: 'totalTrans',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.totalTrans)
    },
    {
      title: translate('Disbursement_Reconcile.totalDisbursementInVND'),
      dataIndex: 'totalAmount',
      width: 150,
      render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.totalAmount)
    },
    {
      title: translate('Disbursement_Reconcile.SFTP'),
      dataIndex: 'sftpStatus',
      width: 150,
      render: (dom: any, row: any) => (row.sftpStatus) ?
        (row.sftpStatus == "SUCCESS" ?
          <Status value={row.sftpStatus || "-"} options={SFTP_STATUS}/>:
          <Tooltip  placement="topLeft" title={row?.sftpFailedReason}><div><Status value={row.sftpStatus || "-"} options={SFTP_STATUS}/></div></Tooltip>)
        : "-",

    },

  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate("Disbursement_Reconcile.Reconcile_Code"),
      key: "id",
      dataIndex: "id",
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate('Disbursement_Reconcile.Reconcile_Period'),
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


  const getReconcileLimit = async (params?: any, options?: any) => {
    setIsLoading(true)
    const resp = await getReconcileLimitAPI(params, options);
    setIsLoading(false)

    if (!resp?.success)
      message.error(resp?.message || translate('Disbursement_Histories.An_Error_Occurred'))
    return resp
  }
  const exportToggle = async (row: any) => {
    setIsLoading(true);
    const resp = await exportDisbursementReconcileById(row.id);
    setIsLoading(false);
  }
  const renderButtons = (row: any) => (
    <Fragment>
        <DownloadOutlined
            title={translate('reconcile.button.export.title')}
        onClick={() => exportToggle(row)}
        />
    </Fragment>
)

const expandedRowRender = (record: any) => {
  console.log(record);
  const columns= [
    { title: translate("Currency code"), dataIndex: 'currency', key: 'currency' },
      {
          title: translate('Number of transaction'),
          dataIndex: 'totalQuantity',
          key: 'totalQuantity',
          render: (dom: any) => format.currency(dom)

      },
    {
      title: translate('Expenditure value'),
      dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (dom: any) => format.currency(dom)
      
    },
  ];

  const data = record?.reconcileSummary||[];
  return <Table columns={columns} dataSource={data} pagination={false} />;
};
  return (<Fragment>

    <Container >
      <PageLoading active={isLoading} />
      <ProTable
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={getReconcileLimit}
        addAction={false}
        editAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        exportExcel={true}
        exportExcelFunc={openExportModal}
        extraButtons={renderButtons}
        expandable={{
          expandedRowRender,
      }}
      />
    </Container>
    {showExportModal && <ExportModal
      onCancel={closeExportModal}
      exportExcelFunc={exportReconciles}

    />}
  </Fragment>

  )
}

export default DisbursementReconcile