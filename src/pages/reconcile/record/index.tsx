import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { Container, PageLoading, Modal, ProTable, Button, Space, FormDatePicker, FormText, Icons } from '@/components';
import { getReconciliationsByMonth, getReconcileReport, downloadReconcileReport } from '@/services/reconcile/api';
import { translate, renderField, message } from '@/utils';
import type { ProColumns } from '@ant-design/pro-table';
import PDFView from '@/components/PDFView';
import styles from './index.less';
import { useRequestAPI } from '@/hooks';

const { EyeOutlined, DownloadOutlined } = Icons;

interface ReconcileRecordProps {
  route: Record<string, any>;
}

const ReconcileRecord: FC<ReconcileRecordProps> = ({ route }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [isDownload, setIsDownload] = useState<boolean>(false)
  const [downloadable, setDownloadable] = useState<boolean>(false)
  const [reloadTable] = useState<boolean>(false)
  const [currCode, setCurrCode] = useState<any>(null)
  const [fileSource, setFileSource] = useState<any>(null)
  const [cNumber, setCNumber] = useState<string>('')

  const {request: getReconcilesList} = useRequestAPI({
    requestFn: getReconciliationsByMonth,
    pageName: route?.name,
    messageError: translate('reconcile.message.list.failed')
  })

  const downloadToggle = async (code: any) => {
    setCurrCode(code || null)
    setIsDownload(true)
  }

  const downloadCancel = () => {
    setIsDownload(false)
    setCurrCode(null)
  }

  const downloadPdf = async () => {
    if (!currCode) return
    setLoading(true)
    const resp: any = await downloadReconcileReport(currCode, 'pdf')
    if (!resp || resp?.data && !resp?.success)
      message.error(resp?.message || translate('reconcile.message.download.failed'))
    setIsDownload(false)
    setLoading(false)
  }

  const downloadExcel = async () => {
    if (!currCode) return
    setLoading(true)
    const resp: any = await downloadReconcileReport(currCode, 'excel')
    if (!resp || resp?.data && !resp?.success)
      message.error(resp?.message || translate('reconcile.message.download.failed'))
    setIsDownload(false)
    setLoading(false)
  }

  const previewCancel = () => {
    setIsPreview(false)
    setIsDownload(false)
    setDownloadable(false)
    setFileSource(null)
    setCurrCode(null)
  }

  const previewToggle = async (code: any) => {
    setCurrCode(code || null)
    if (!code) return
    setLoading(true)
    const resp: any = await getReconcileReport(code, 'pdf')
    if (!resp || resp?.data && !resp?.success)
      message.error(resp?.message || translate('reconcile.message.detail.failed'))
    else {
      setFileSource(resp)
      setIsPreview(true)
    }
    setLoading(false)
  }

  const onLoadSuccess = () => {
    setDownloadable(true)
  }

  const renderPeriod = (val: any) => {
    const momentVal = moment(val, 'MM-YYYY', true)
    return (
      momentVal?.isValid()
        ? momentVal.format('MM/YYYY')
        : val || '-'
    )
  }

  const renderButtons = (row: any) => {
    return (
      <>
        <DownloadOutlined
          title={translate('reconcile.button.downloadRecord')}
          onClick={() => downloadToggle(row?.code)}
        />
      </>
    )
  }

  const columns: ProColumns<any>[] = [
    {
      title: translate('reconcile.field.period'),
      dataIndex: 'periodic',
      width: 500,
      sorter: true,
      render: renderPeriod
    },
    {
      title: translate('reconcile.field.contractNumber'),
      dataIndex: 'merchantContractNumber',
      width: 600,
      sorter: true,
      render: renderField
    },
    {
      title: translate('reconcile.field.receivedAmount'),
      dataIndex: 'finalTotalAmount',
      width: 500,
      sorter: true,
      hideInSearch: true,
      render: (dom: any, row: any) => renderField(row?.finalTotalAmount || 0, 'currency')
    }
  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate('reconcile.field.contractNumber'),
      dataIndex: 'merchantContractNumber',
      renderFormItem: () => (
        <FormText
          placeholder={translate('reconcile.placeholder.contractNumber')}
          fieldProps={{
            onBlur: (e: any) => setCNumber((e.target.value || '').trim()),
            onChange: (e: any) => setCNumber(e?.target?.value || ''),
            value: cNumber || ''
          }}
        />
      ),
    },
    {
      title: translate('reconcile.field.period'),
      dataIndex: 'periodic',
      renderFormItem: () => (
        <FormDatePicker
          fieldProps={{
            picker: 'month',
            format: 'MM/YYYY',
            style: { width: '100%' },
            disabledDate: (date: any) => date && moment(date).isAfter(moment(), 'month')
          }}
          placeholder={translate('reconcile.placeholder.period')}
        />
      ),
      search: {
        transform: (val: any) => ({
          periodic: (
            val
              ? moment(val).set('date', 15).toDate()
              : ''
          )
        })
      }
    }
  ]

  return (
    <Container>
      <PageLoading active={isLoading} />

      <ProTable
        searchProps={{
          searchText: translate('form.field.search')
        }}
        rowKey="code"
        columns={columns}
        queryColumns={queryColumns}
        searchAction={false}
        dateAction={false}
        getListFunc={getReconcilesList}
        editAction={false}
        removeAction={false}
        addAction={false}
        exportExcel={false}
        reloadTable={reloadTable}
        extraButtons={renderButtons}
        onReset={() => {
          setCNumber('')
        }}
      />

      <Modal
        destroyOnClose
        visible={isPreview}
        maskClosable={false}
        footer={false}
        onCancel={previewCancel}
        className={styles.previewModal}
      >
        {/* <PDFView
          file={fileSource || ''}
          onLoadSuccess={onLoadSuccess}
        /> */}
        <iframe onLoad={onLoadSuccess} src={fileSource} style={{ width: 'calc(100% - 50px)', height: 'calc(100vh - 100px)' }} frameBorder={0} ></iframe>
        <div className='btn-wrap'>
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            hidden={!downloadable}
            onClick={() => downloadToggle(currCode)}
          >
            {translate('reconcile.button.downloadRecord')}
          </Button>
        </div>
      </Modal>

      <Modal
        destroyOnClose
        visible={isDownload}
        title={translate('reconcile.title.download')}
        footer={false}
        onCancel={downloadCancel}
        className={styles.downloadModal}
      >
        <Space>
          {/* TODO: hidden for golive, waiting to fix api */}
          {/* <Button
            type='primary'
            icon={<DownloadOutlined />}
            onClick={downloadPdf}
          >
            {translate('reconcile.button.downloadPdf')}
          </Button> */}
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            onClick={downloadExcel}
          >
            {translate('reconcile.button.downloadExcel')}
          </Button>
        </Space>
      </Modal>
    </Container>
  );
};

export default ReconcileRecord;
