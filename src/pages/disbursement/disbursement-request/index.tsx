import { Container, PageLoading, ProColumns, ProTable, FormSelect, Status, Icons, FormText } from "@/components"
import { DISBURSEMENT_REQUEST_STATUS } from "@/constants"
import { renderField, translate, message, parseOptions, format } from "@/utils"
import { Fragment, useState } from "react";
import { Button, Row } from "antd";
import { getDisbursementRequestListAPI, exportDisbursementRequest } from '@/services/disbursement/api';
import ExportModal from './components/ExportModal';
import { useExportModal,useModal } from '@/hooks';
import { Link } from "react-router-dom";
import { useBoolean } from 'react-use';
import ImportModal from "./components/ImportDisbursementRequest"
const { EyeOutlined, PlusCircleOutlined } = Icons;
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"

const DisbursementRequest = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showExportModal, openExportModal, closeExportModal] = useExportModal()
  const [showImportModal, openImportModal, closeImportModal] = useModal(false);
  const [reloadTable, triggerReloadTable] = useBoolean(false);

  const columns = [
    {
      title: translate('Disbursement_Request.CreationTime'),
      dataIndex: 'createdAt',
      render: (dom: any, row: any) => format.datetimes(row?.createdAt),
      width: 200,

    },
    {
      title: translate('Disbursement_Request.Request_Code'),
      dataIndex: 'requestId',
      width: 200,
      sorter: true,
    },
    {
      title: translate('Disbursement_Request.Ref_Code'),
      dataIndex: 'refCode',
      width: 200,
    },
    {
      title: translate('Disbursement_Request_Detail.Disbursement_Total_Amount'),
      dataIndex: 'totalAmount',
      render: (dom: any, row: any) => parseNumberToCurrencyMultipleLanguage(row?.totalAmount),
      width: 200,
      align:"center"

    },
    {
      title: translate('Disbursement_Request.Status'),
      dataIndex: 'status',
      render: (dom: any, row: any) => <Status value={row.status || "-"} options={DISBURSEMENT_REQUEST_STATUS}></Status>,
      width: 200,


    },
  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate("Disbursement_Request.Ref_Code"),
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
      title: translate("Disbursement_Request.Request_Code"),
      key: "requestId",
      dataIndex: "requestId",
      renderFormItem: () => (
        <FormText
          placeholder={translate('form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate("Disbursement_Request.Status"),
      key: "status",
      dataIndex: "status",
      renderFormItem: () => (
        <FormSelect
          name="status"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(DISBURSEMENT_REQUEST_STATUS)}
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

  const getDisbursementRequestList = async (params?: any, options?: any) => {
    setIsLoading(true)
    const resp = await getDisbursementRequestListAPI(params, options);
    setIsLoading(false)

    if (!resp?.success)
      message.error(resp?.message || translate('Disbursement_Request.An_Error_Occurred'))
    return resp
  }


  const renderButtonToolbar = () => {
    return <Row>
      <Button onClick={openImportModal} icon={<PlusCircleOutlined />} type="primary">{translate("Disbursement_Request.Create_Disbursement_Request")}</Button>
    </Row>
  }

  return (<Fragment>

    <Container >
      <PageLoading active={isLoading} />
      <ProTable
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={getDisbursementRequestList}
        addAction={false}
        editAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        reloadTable={reloadTable}
        importExcelButton={false}
        exportExcel={true}
        exportExcelFunc={openExportModal}
        extraButtonsToolbar={renderButtonToolbar}
        extraButtons={(row: any) => (
          <Link style={{color:"#000"}} to={`/disbursement-management/disbursement-request/${row?.id}`} target="_blank">
            <EyeOutlined title={translate('form.button.detail')} />
          </Link>
        )}
      />
    </Container>
    {showExportModal && <ExportModal
      onCancel={closeExportModal}
      exportExcelFunc={exportDisbursementRequest}
    />}

{showImportModal && <ImportModal
        visible={showImportModal}
        onCancel={closeImportModal}
        reloadList={triggerReloadTable}
      // url={currentUrl}
      />}
  </Fragment>

  )
}

export default DisbursementRequest