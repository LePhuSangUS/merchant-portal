import React, { useState } from 'react';
import { Container, PageLoading, Icons, ProTable, FormField, FormText,
  FormSwitch, FormAddress, FormItem, CustomUpload, Button } from '@/components';
import { getMerchantStoreList, createMerchantStore, updateMerchantStore,
  removeMerchantStore } from '@/services/merchantstore/api';
import { translate, message, parseAddress, notification, renderField } from '@/utils';
import { merchantNameRules} from '@/utils/rules';
import { renderStatus } from '@/pages/store';
import type { ProColumns } from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';

const { EditOutlined, EyeOutlined } = Icons;
interface PageProps {
  history: any
}

const MerchantStore: React.FC<PageProps> = ({ history }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [reloadTable, setReloadTable] = useState<boolean>(false)

  const toggleReload = () => setReloadTable(!reloadTable)

  const getStoresList = async (params: any, options?: any) => {
    const resp = await getMerchantStoreList(params, options)
    if (!resp?.success)
      notification.error(resp?.message || translate('merchantStore.message.list.failed'));
    return resp
  }

  const createToggle = () => {
    setEditItem(null)
    setIsEdit(true)
  }

  const editToggle = (row: any) => {
    setEditItem(row)
    setIsEdit(true)
  }

  const editCancel = () => {
    setIsEdit(false)
    setEditItem(null)
  }

  const editSubmit = async (formData: any) => {
    if (!formData) return
    let resp: any
    setLoading(true)
    if (formData?._id) {
      // edit submit
      if (formData?.transactionLimit !== 0 && !formData?.transactionLimit) {
        formData.transactionLimit = null
      }
      resp = await updateMerchantStore(formData)
      if (!resp?.success)
        notification.error(resp?.message || translate('merchantStore.message.update.failed'))
      else {
        message.success(translate('merchantStore.message.update.success'))
        toggleReload()
      }
    } else {
      // create submit
      resp = await createMerchantStore(formData)
      if (!resp?.success)
        notification.error(resp?.message || translate('merchantStore.message.create.failed'))
      else {
        message.success(translate('merchantStore.message.create.success'))
        toggleReload()
      }
    }
    setIsEdit(false)
    setEditItem(null)
    setLoading(false)
    return resp
  }

  const removeSubmit = async (formData: any) => {
    if (!formData) return
    const resp = await removeMerchantStore(formData)
    if (!resp?.success)
      notification.error(resp?.message || translate('merchantStore.message.delete.failed'))
    else {
      message.success(translate('merchantStore.message.delete.success'))
      toggleReload()
    }
    return true
  }

  const columns: ProColumns<any>[] = [
    {
      title: translate('form.field.storeName'),
      dataIndex: 'name',
      width: 200,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.storeAccount'),
      dataIndex: 'accountNumber',
      width: 220,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.storeBalance'),
      dataIndex: 'accountBalance',
      width: 180,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderField(row?.accountBalance, 'currency')
    },
    {
      title: translate('form.field.address'),
      dataIndex: 'address',
      width: 240,
      sorter: true,
      render: (dom: any, row: any) => (
        parseAddress(row?.address) || '-'
      )
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'isActive',
      width: 150,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => renderStatus(row)
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
    }
  ]

  return (
    <Container>
      <PageLoading active={isLoading} />
      <ProTable
        columns={columns}
        getListFunc={getStoresList}
        exportExcel={false}
        editAction={false}
        createToggle={createToggle}
        removeFunc={removeSubmit}
        reloadTable={reloadTable}
        extraButtons={(row: any) => (
          <>
            <EyeOutlined
              title={translate('form.button.detail')}
              onClick={() => history.push(`${history?.location?.pathname}/${row?._id}`)}
            />
            <Button
              type="text"
              size={'small'}
              onClick={() => editToggle(row)}
            >
              <EditOutlined title={translate('form.button.edit')} />
            </Button>
          </>
        )}
      />
      <ModalForm
        visible={isEdit}
        title={
          editItem?._id
            ? translate('merchantStore.title.update')
            : translate('merchantStore.title.create')
        }
        initialValues={editItem}
        onFinish={editSubmit}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: editCancel
        }}
      >
        <FormField
          hidden
          disabled
          name='_id'
        />
        <FormText
          name='name'
          label={translate('form.field.storeName')}
          placeholder={translate('form.field.storeName')}
          rules={merchantNameRules()}
        />
        <FormItem
          name='image'
          label={translate('form.field.storeImage')}
        >
          <CustomUpload
            single
            maxCount={1}
            accept="image/png, image/jpeg"
          />
        </FormItem>
        <FormSwitch
          name='isActive'
          label={translate('form.field.status')}
        />
        <FormAddress
          name='address'
          label={translate('form.field.address')}
          initialValue={editItem?.address}
        />
      </ModalForm>
    </Container>
  )
}

export default MerchantStore
