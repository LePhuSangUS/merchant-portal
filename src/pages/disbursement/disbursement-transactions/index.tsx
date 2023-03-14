import { Container, PageLoading, ProColumns, ProTable, FormSelect, Status, Icons, FormText } from "@/components"
import { DISBURSEMENT_HISTORIES_TRANSACTION_STATUS } from "@/constants"
import { renderField, translate, message, parseOptions } from "@/utils"
import { Fragment, useState } from "react";
import { Button, Row } from "antd";
import { getDisbursementTransactions, exportDisbursementTransaction } from '@/services/disbursement/api';
import ExportModal from './components/ExportModal';
import { useExportModal } from '@/hooks';
import { Link } from "react-router-dom";
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"
import { format } from "@/utils";
import {renderMaskCardNumber} from "@/utils/format"

const { EyeOutlined, PlusCircleOutlined } = Icons;

const DisbursementTransactions = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showExportModal, openExportModal, closeExportModal] = useExportModal()

  const columns = [
    {
      title: translate('form.field.creationTime'),
      dataIndex: 'createdAt',
      render: (dom: any, row: any) => format.datetimes(row?.createdAt),
      width: 200,

    },
    {
      title: translate('Disbursement_Histories.Ref_Code'),
      dataIndex: 'refCode',
      width: 200,
    },
    {
      title: translate('Disbursement_Histories.Request_Code'),
      dataIndex: 'disbursementRequestId',
      width: 200,
    },
    {
      title: translate('Disbursement_Histories.Transaction_Code'),
      dataIndex: 'transId',
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Transaction_Code_Merchant'),
      dataIndex: 'requestTransId',
      width: 200,


    },
    {
      title: translate('disbursement.Currency_Code'),
      dataIndex: 'srcCurrency',
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Amount'),
      dataIndex: 'srcAmount',
      render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.srcAmount),
      width: 200,

    },
    {
      title: translate('disbursement.Exchange_Rate'),
      dataIndex: 'fxRate',
      render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.fxRate),
      width: 200,

    },
    {
      title: translate('Disbursement_Histories.Bank'),
      dataIndex: 'bankName',
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Branch'),
      dataIndex: 'bankBranchName',
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Account_Number'),
      dataIndex: 'bankAccountNumber',
      render: (dom: any, row: any) => renderMaskCardNumber(row?.bankAccountNumber),
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Account_Name'),
      dataIndex: 'bankAccountName',
      width: 200,


    },
    {
      title: translate('Disbursement_Histories.Status'),
      dataIndex: 'status',
      render: (dom: any, row: any) => <Status value={row.status || "-"} options={DISBURSEMENT_HISTORIES_TRANSACTION_STATUS}></Status>,
      width: 200,


    },
  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate("Disbursement_Histories.Ref_Code"),
      key: "refCode",
      dataIndex: "refCode",
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate("Disbursement_Histories.Request_Code"),
      key: "disbursementRequestId",
      dataIndex: "disbursementRequestId",
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate("Disbursement_Histories.Transaction_Code"),
      key: "transId",
      dataIndex: "transId",
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate("Disbursement_Histories.Status"),
      key: "status",
      dataIndex: "status",
      renderFormItem: () => (
        <FormSelect
          name="status"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(DISBURSEMENT_HISTORIES_TRANSACTION_STATUS)}
        />
      ),
      sorter: true
    },
    {
      title: translate('form.field.creationTime'),
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

  const getDisbursementTransactionList = async (params?: any, options?: any) => {
    setIsLoading(true)
    const resp = await getDisbursementTransactions(params, options);
    setIsLoading(false)

    if (!resp?.success)
      message.error(resp?.message || translate('Disbursement_Histories.An_Error_Occurred'))
    return resp
  }

  return (<Fragment>

    <Container >
      <PageLoading active={isLoading} />
      <ProTable

        columns={columns}
        queryColumns={queryColumns}
        getListFunc={getDisbursementTransactionList}
        addAction={false}
        editAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        exportExcelFunc={openExportModal}
        extraButtons={(row: any) => (
          <Link style={{color:"#000"}} to={`/disbursement-management/disbursement-transactions/${row?.id}`} target="_blank">
            <EyeOutlined title={translate('form.button.detail')} />
          </Link>
        )}
      />
    </Container>
    {showExportModal && <ExportModal
      onCancel={closeExportModal}
      exportExcelFunc={exportDisbursementTransaction}
    />}
  </Fragment>

  )
}

export default DisbursementTransactions