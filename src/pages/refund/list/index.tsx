import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { Container, Icons, ProTable, Button, Link, Status, Popconfirm, PageLoading, FormSelect } from '@/components';
import { exportRefunds, getRefunds, removeRefund, updateRefund } from '@/services/refund/api';
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { message, translate, renderField, notification, format } from '@/utils';
import { MIN_REFUND_AMOUNT, REFUND_STATUS_LIST } from "@/constants";
import FormAmount from '@/components/FormField/FormAmount';
import styles from './style.less'
import { parseCurrencyToIntNumber, parseOptions } from '@/utils/parse';
import ExportModal from '../components/ExportModal';
import { useExportModal, useRequestAPI } from '@/hooks';
import { renderFormTextItem } from '@/utils/render';

const { EyeOutlined, EditOutlined, DeleteOutlined } = Icons

const isApprovedStatus = (stt: string) => stt === 'APPROVED'
const isPendingStatus = (stt: string) => stt === 'PENDING'

interface PageProps {
  history: any;
  route: Record<string, any>;
}

const RefundList: React.FC<PageProps> = ({ history, route }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [reloadTable, setReloadTable] = useState<boolean>(false)
  const [showExportModal, openExportModal, closeExportModal] = useExportModal()
  const { request: requestGetRefunds } = useRequestAPI({
    requestFn: getRefunds,
    pageName: route?.name,
  })

  const columns: ProColumns[] = [
    {
      title: translate('refund.field.paymentCode'),
      dataIndex: 'paymentId',
      width: 180,
      sorter: true,
    },
    {
      title: translate('refund.field.billId'),
      dataIndex: 'orderId',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('refund.field.refundId'),
      dataIndex: 'tranHisId',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('refund.field.refundAmount'),
      dataIndex: 'refundAmount',
      width: 130,
      sorter: true,
      align: 'center',
      render: (dom: any) => dom ? renderField(dom, 'currency') : ' '
    },
    {
      title: translate('refund.field.paymentAmount'),
      dataIndex: 'paidAmount',
      width: 155,
      sorter: true,
      align: 'center',
      render: (dom: any) => dom ? renderField(dom, 'currency') : ' '
    },
    // {
    //   title: translate('refund.field.refundedAmount'),
    //   dataIndex: 'refundedAmount',
    //   width: 155,
    //   sorter: true,
    //   align: 'center',
    //   render: (dom: any) => dom ? renderField(dom, 'currency') : ' '
    // },
    {
      title: translate('form.field.status'),
      dataIndex: 'state',
      width: 135,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => (
        row?.state
          ? <Status value={row?.state} options={REFUND_STATUS_LIST} />
          : '-'
      )
    },
    // {
    //   title: translate('form.field.createdBy'),
    //   dataIndex: 'createdBy',
    //   width: 200,
    //   sorter: true,
    //   render: renderField
    // },
    {
      title: translate('form.field.createdAt'),
      dataIndex: 'createdAt',
      width: 155,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.createdAt, 'datetimes')
    },
    {
      title: translate('form.field.updatedAt'),
      dataIndex: 'lastUpdatedAt',
      width: 155,
      sorter: true,
      render: (dom: any, row: any) => renderField(row?.lastUpdatedAt, 'datetimes')
    }
  ]


  const queryColumns: ProColumns<Record<string, any>>[] = [
    {
      title: translate('refund.field.paymentCode'),
      dataIndex: 'paymentId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('paymentId')
    },
    {
      title: translate('refund.field.billId'),
      dataIndex: 'orderId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('orderId')
    },
    {
      title: translate('refund.field.refundId'),
      dataIndex: 'tranHisId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('tranHisId')
    },
    {
      title: translate('form.field.createdAt'),
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
      key: "state",
      dataIndex: "state",
      renderFormItem: () => (
        <FormSelect
          name="state"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(REFUND_STATUS_LIST)}
        />
      ),
      sorter: true
    },
  ]

  const editSubmit = async (data: any) => {
    const resp = await updateRefund({ ...data, amount: parseCurrencyToIntNumber(data?.amount) })
    if (!resp?.success)
      notification.error(resp?.message || translate('refund.message.update.failed'))
    else {
      message.success(translate('refund.message.update.success'))
      setReloadTable(!reloadTable)
    }
    return true
  }

  const removeSubmit = async (_id: string) => {
    setLoading(true)
    const resp = await removeRefund({ _id })
    setLoading(false)
    if (!resp?.success)
      notification.error(resp?.message || translate('refund.message.delete.failed'))
    else {
      message.success(translate('refund.message.delete.success'))
      setReloadTable(!reloadTable)
    }
  }

  return (
    <Container>
      <PageLoading active={isLoading} />
      <ProTable
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={requestGetRefunds}
        editAction={false}
        addAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
        exportExcelFunc={openExportModal}
        reloadTable={reloadTable}
        extraButtons={(row: any) => (
          <>
            <EyeOutlined
              title={translate('form.button.detail')}
              onClick={() => history.push(`/pg/refund/${row?.id}`)}
            />
            {/* {
              !isApprovedStatus(row?.state) && (
                <ModalForm
                  title={translate("refund.title.edit")}
                  width='500px'
                  trigger={
                    <Button
                      type='text'
                      size='small'
                      title={translate('form.button.edit')}
                      icon={<EditOutlined />}
                    />
                  }
                  initialValues={row}
                  onFinish={editSubmit}
                  className={styles?.modalEditRefund}
                >
                  <ProFormText
                    hidden
                    disabled
                    name="_id"
                  />
                  <ProFormText
                    hidden
                    disabled
                    name="paymentBillId"
                  />
                  <FormAmount
                    name="amount"
                    minAmount={MIN_REFUND_AMOUNT}
                    maxAmount={(row?.paymentBillAmount || 0) - (row?.refundedAmount || 0)}
                    label={translate('refund.field.refundAmount')}
                    placeholder={`${translate('refund.tooltip.minAmount')}: ${format.currency(MIN_REFUND_AMOUNT)}`}
                    rules={[{ required: true, message: translate('form.message.field.required') }]}
                  />
                  <ProFormTextArea
                    name="note"
                    label={translate('form.field.note')}
                    placeholder={translate('form.field.note')}
                    rules={[
                      { required: true, message: translate('form.message.field.required') },
                      { max: 250, message: translate('form.message.field.length') }
                    ]}
                  />
                </ModalForm>
              )
            }
            {
              !isPendingStatus(row?.state) &&
              !isApprovedStatus(row?.state) && (
                <Popconfirm
                  title={
                    <div style={{ whiteSpace: 'pre' }}>
                      {translate('refund.message.delete.confirm')}
                    </div>
                  }
                  okText={translate('form.button.delete')}
                  cancelText={translate('form.button.cancel')}
                  okButtonProps={{ danger: true }}
                  onConfirm={() => removeSubmit(row?._id)}
                >
                  <DeleteOutlined
                    title={translate('form.button.delete')}
                    style={{ color: 'red' }}
                  />
                </Popconfirm>
              )
            } */}
          </>
        )}
      />

      {showExportModal && <ExportModal
        visible={showExportModal}
        onCancel={closeExportModal}
        exportExcelFunc={exportRefunds}
      />}
    </Container>
  )
}

export default RefundList
