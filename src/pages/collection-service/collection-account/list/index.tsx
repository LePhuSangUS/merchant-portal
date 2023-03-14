import React, { useState } from 'react';
import { useBoolean } from 'react-use';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';

import { Container, Icons, ProTable, Button, FormSelect } from '@/components';
import { translate, renderField, parseValue, parseOptions, message } from '@/utils';
import { useModal, useRequestAPI } from '@/hooks';
import { renderFormTextItem, renderStatus } from '@/utils/render';
import { exportCollectionServicecAccounts, getMerchantVirtualAccounts } from '@/services/collection-service/api';
import DetailModal from './DetailModal';
import PreviewModal from './PreviewModal';
import { getFileNameFromUrl, trimObjectValue } from '@/utils/utils';
import ImportVirtualAccount from '../../components/ImportVirtualAccount';
import { COLLECTION_VIRTUAL_ACCOUNT_STATE } from '@/constants/collection-service.constant';
import moment from 'moment';
import _ from 'lodash';

const { EyeOutlined } = Icons;
const MAX_DAY_EXPORT = 31;

const CollectionServiceAccounts: ReactPageProps = ({ route, history }) => {
  const [selectedAccount, setSelectedAccount] = useState<ObjectType>();
  const [showDetailModal, openDetailModal, closeDetailModal] = useModal(false);
  const [showIdentityFile, openIdentityFileModal, closeIdentityFileModal] = useModal(false);
  const [showImportVirtualAccount, openImportVirtualAccountModal, closeImportVirtualAccountModal] = useModal(false);
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [reloadTable, triggerReloadTable] = useBoolean(false);
  const [currentFilter, setCurrentFilter] = useState<ObjectType>();

  const exportParamsNameArr = ['bankAccountNumber', 'dateFr', 'dateTo', 'accountName', 'merchantAccountId', 'status'];

  const { request: requestGetMerchantVirtualAccounts } = useRequestAPI({
    requestFn: getMerchantVirtualAccounts,
    pageName: route?.name,
  });

  const isActive = (status: string) => status === 'ACTIVE';
  const isProcessing = (status: string) => status === 'PROCESSING';
  const isNotFullImage = (row: ObjectType) => (!row?.frontIdCard || !row.backIdCard || !row?.profileImg || !row?.businessRegistration)

  const columns: ProColumns[] = [
    {
      title: translate('collection-service.account.number'),
      dataIndex: 'bankAccountNumber',
      width: 180,
      sorter: true,
    },
    {
      title: translate('collection-service.account.name'),
      dataIndex: 'accountName',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('collection-service.account.address'),
      dataIndex: 'accountAddress',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('collection-service.account.identityDocument'),
      dataIndex: 'fileUrl',
      width: 140,
      sorter: true,
      render: (url: React.ReactNode, row: ObjectType) => {
        const isShowFile = !!url && typeof url === 'string' && url !== '-' && isActive(row?.status);
        return isShowFile ?
          <a style={{ textDecoration: 'underline' }} onClick={() => { setCurrentUrl(url); openIdentityFileModal(); }} >
            {getFileNameFromUrl(url)}
          </a>
          : (
            isNotFullImage(row) ? <span style={{ color: 'red', fontWeight: 600, fontStyle: 'italic' }}>{translate('collection-service.message.virtualAccount.requireKYC')}</span> : null
          )
      }
    },
    {
      title: translate('collection-service.account.merchantAccountID'),
      dataIndex: 'merchantAccountId',
      width: 140,
      sorter: true,
      render: renderField
    },
    {
      title: translate('form.field.creationTime'),
      dataIndex: 'createdAt',
      width: 155,
      sorter: true,
      render: (val: React.ReactNode) => renderField(val, 'datetimes')
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'status',
      width: 120,
      sorter: true,
      render: renderStatus(COLLECTION_VIRTUAL_ACCOUNT_STATE)
    },
  ];

  const queryColumns: ProColumns<ObjectType>[] = [
    {
      title: translate('collection-service.account.number'),
      dataIndex: 'bankAccountNumber',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('bankAccountNumber')
    },
    {
      title: translate('collection-service.account.name'),
      dataIndex: 'accountName',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('accountName')
    },
    {
      title: translate('collection-service.account.merchantAccountID'),
      dataIndex: 'merchantAccountId',
      width: 150,
      sorter: true,
      renderFormItem: renderFormTextItem('merchantAccountId')
    },
    {
      title: translate('form.field.status'),
      key: "status",
      dataIndex: "status",
      renderFormItem: () => (
        <FormSelect
          name="status"
          placeholder={translate('form.placeholder.pleaseSelect')}
          options={parseOptions(COLLECTION_VIRTUAL_ACCOUNT_STATE)}
        />
      ),
    },
    {
      title: translate('form.field.creationTime'),
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
  ];

  return (
    <Container>
      <ProTable
        beforeSearchSubmit={(searchParams) => {
          setCurrentFilter(trimObjectValue(_.pick(searchParams, exportParamsNameArr)));
          return searchParams;
        }}
        reloadTable={reloadTable}
        columns={columns}
        queryColumns={queryColumns}
        getListFunc={requestGetMerchantVirtualAccounts}
        importExcel={true}
        importExcelButton={(
          <Button
            type="primary"
            key="toolbarImportButton"
            // loading={loading}
            icon={<UploadOutlined />}
            onClick={openImportVirtualAccountModal}
          >
            {parseValue({ vi: 'Tạo tài khoản', en: 'Create account' })}
          </Button>
        )}
        // importExcelFunc={openImportVirtualAccountModal}
        editAction={false}
        addAction={false}
        removeAction={false}
        searchAction={false}
        dateAction={false}
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

          exportCollectionServicecAccounts(exportParams);
        }}
        extraButtons={(row: ObjectType) => (
          <>
            {
              isActive(row?.status) &&
              <EyeOutlined
                onClick={() => {
                  setSelectedAccount(row)
                  openDetailModal()
                }}
              />
            }
            {
              isNotFullImage(row) &&
              <EditOutlined
                onClick={() => history.push(`${history.location?.pathname}/${row?.id}/update`)}
              />
            }
          </>
        )}
      />

      {showDetailModal && <DetailModal
        visible={showDetailModal}
        onCancel={closeDetailModal}
        id={selectedAccount?.id}
      />}
      {showIdentityFile && <PreviewModal
        visible={showIdentityFile}
        onCancel={closeIdentityFileModal}
        url={currentUrl}
      />}
      {showImportVirtualAccount && <ImportVirtualAccount
        visible={showImportVirtualAccount}
        onCancel={closeImportVirtualAccountModal}
        reloadList={triggerReloadTable}
      // url={currentUrl}
      />}

    </Container>
  )
}

export default CollectionServiceAccounts;
