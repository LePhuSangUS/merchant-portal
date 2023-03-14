import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Popconfirm, Button, Input, Modal, DatePicker, Form, Space, Select } from 'antd';
import { EditOutlined, ExclamationCircleOutlined, PlusOutlined,
  DeleteOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ATable from '@ant-design/pro-table';
import { history } from 'umi';
import _ from 'lodash';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import type { SearchConfig } from '@ant-design/pro-table/lib/components/Form/FormRender';

import { parseValue, translate, message, notification, getPicklistsByPageRoutePath } from '@/utils';
import { momentFormat, removeEmptyStringInObject, removeUndefinedInObject, sortObjectArrayByArray, trimObjectValue } from '@/utils/utils';
import { getFilterQuery, pushQueryToUrl, renderActsWidth, setFilterQuery } from './handler';
import { FormSelect } from '../FormField'
import styles from './styles.less'
import { compose } from '@/utils/curry';

const { confirm } = Modal;
const CODE_DATE_FORMAT = 'YYYY-MM-DD'

interface TableProps {
  columns: any;
  form?: any;
  modalProps?: any;
  rowKey?: string;
  titlePage?: string | React.ReactNode;
  title?: string;
  addAction?: boolean;
  createToggle?: () => void;
  exportExcel?: boolean;
  editAction?: boolean;
  removeAction?: boolean;
  searchAction?: boolean;
  dateAction?: boolean;
  searchPlaceholder?: string;
  formWidth?: string;
  showRowSelection?: boolean;
  showActionColumn?: boolean;
  rowSelection?: (row: any) => void;
  buttonsType?: "text" | "icon";
  filterType?: "light" | "query";
  extraButtons?: (row: any, reloadFunc?: () => void, formModal?: any) => void;
  extraButtonsToolbar?: (params?: any) => void;
  hideSelectAll?: boolean;
  getListFunc?: (params?: any, options?: any) => void;
  createFunc?: (formData?: any) => void;
  updateFunc?: (formData?: any) => void;
  removeFunc?: (formData?: any) => void;
  onModalLoad?: (record?: any, formModal?: any) => void;
  onModalClose?: () => void;
  exportExcelFunc?: (params?: any) => void;
  actionRef?: any;
  reloadTable?: boolean;
  queryColumns?: any[],
  hideToolBar?: boolean;
  defaultPageSize?: number;
  showSizeChanger?: boolean;
  onReset?: () => void;
  showPickList?: boolean;
  picklistPosition?: 'start' | 'end',
  sortQueryColumns?: any[],
  name?: string,
  disableFilterQuery?: boolean;
  importExcel?: boolean;
  importExcelFunc?: (...args: any[]) => void;
  importExcelButton?: React.ReactNode;
  searchProps?: SearchConfig;
  expandable?: any

}



const ProTable: React.FC<TableProps> = (
  {
    columns,
    form,
    modalProps,
    rowKey,
    title,
    titlePage,
    formWidth,
    extraButtons,
    hideSelectAll,
    getListFunc,
    createFunc,
    updateFunc,
    removeFunc,
    onModalLoad,
    onModalClose,
    addAction = true,
    createToggle,
    exportExcel = true,
    editAction = true,
    removeAction = true,
    showRowSelection = false,
    showActionColumn = true,
    rowSelection,
    searchAction = true,
    dateAction = true,
    searchPlaceholder,
    exportExcelFunc,
    extraButtonsToolbar,
    actionRef,
    reloadTable,
    queryColumns,
    hideToolBar = false,
    defaultPageSize = 20,
    showSizeChanger = true,
    onReset = () => {},
    showPickList = true,
    picklistPosition = 'end',
    sortQueryColumns = [],
    name,
    disableFilterQuery = false,
    importExcel,
    importExcelFunc,
    importExcelButton,
    searchProps,
    expandable,

  }
) => {
  const location = useLocation()
  const ref = useRef<ActionType>()
  const [formModal] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [selectedRowsState, setSelectedRows] = useState<any[]>([])
  const [currentRow, setCurrentRow] = useState<any>()
  const [filter, setFilter] = useState<any>()
  const [picklist, setPicklist] = useState<any[]>([])
  const [currentNo, setCurrentNo] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<ObjectType>();
  
  const storageKey = useMemo(() => (
    name || history?.location?.pathname?.replace(/^\//g, '')?.split('/')?.join('-')
  ), [name, history.location.pathname])
  const urlQueryInFirstLoad = useMemo(() => history?.location?.query, [])
  const filterQueryObj = getFilterQuery(storageKey)
  const setProTableFilterQuery = setFilterQuery(storageKey)

  const removeWrongItemInObject = compose(removeUndefinedInObject, removeEmptyStringInObject);

  useEffect(() => {
    const pls = getPicklistsByPageRoutePath(location.pathname)
    setPicklist(pls || [])
    if (pls?.length) {
      const newFilter = { ...filter }
      pls.forEach((pl: any) => {
        delete newFilter[pl?.id]
      })
      setFilter(newFilter)
    }
  }, [location])

  const filterChange = (filterName: string, value: any) => {
    const newFilter = { ...filter }
    if (value || value === 0) {
      if (typeof value === 'string')
        newFilter[filterName] = value.trim()
      else newFilter[filterName] = value
    }
    else delete newFilter[filterName]
    setFilter(newFilter)
    ref.current?.reset?.()
  };

  const handleCreate = async (fields: any) => {
    if (!createFunc) return false
    await createFunc(fields)
    return true
  }

  const handleUpdate = async (fields: any) => {
    if (!updateFunc) return false
    await updateFunc(fields)
    return true
  }

  const handleRemove = async (selectedRows: any[]) => {
    if (!selectedRows || !removeFunc) return false
    await removeFunc({ key: selectedRows.map((row: any) => row?._id || '') })
    return true
  }

  const reloadGrid = () => {
    ref.current?.reload?.()
  }

  useEffect(() => {
    reloadGrid()
  }, [reloadTable])

  const onRequest = async (params: any, options: any) => {
    let requestParams = {...params, ...filterState}
    if(isFirstLoad) {
      setIsFirstLoad(false)
      requestParams = {...(_.isEmpty(urlQueryInFirstLoad) ? filterQueryObj : urlQueryInFirstLoad)}
      setFilterState(requestParams)
    }
    if(requestParams?.current === undefined) {
      requestParams = {...requestParams, current: 1, pageSize: defaultPageSize}
    }

    if(!disableFilterQuery)
      setProTableFilterQuery(removeWrongItemInObject(trimObjectValue(requestParams)))
    
    let resp: any = {}
    if (!getListFunc) return resp
    const { current, pageSize } = requestParams
    setCurrentNo(((current || 0) - 1) * (pageSize || 0))
    const trimParams = {}
    Object.keys(requestParams).forEach((i: any) => {
      if (typeof requestParams[i] === 'string')
        trimParams[i] = requestParams[i].trim()
      else trimParams[i] = requestParams[i]
    })
    resp = await getListFunc?.(trimParams, options)
    return resp
  }

  const handleSetFilterToState = useCallback((state: ObjectType) => {
    setFilterState((prev) => removeWrongItemInObject({...prev, ...state}))
  }, [removeWrongItemInObject])

  // handle columns
  const picklistColumns = useMemo(() => !showPickList ? picklist?.map((item: any) => ({
    title: parseValue(item?.label),
    key: item?.id,
    dataIndex: item?.id,
    hideInTable: true,
    hideInSetting: true,
    renderFormItem: () => (
      <FormSelect
        name={item?.id}
        placeholder={translate('form.placeholder.pleaseSelect')}
        options={item.options}
      />
    ),
    fieldProps: {
      ...item?.fieldProps,
      value: filterState?.[item?.id] || undefined,
      onChange(value: string) {
        // because picklist alway select
        handleSetFilterToState({[item?.id]: value})
      }
    }
  })) : [], [picklist, showPickList, filterState, handleSetFilterToState])

  const momentToDateString = momentFormat(CODE_DATE_FORMAT)

  const renderPickList = useCallback((position: string) => position === picklistPosition ? picklistColumns : [], [picklistPosition, picklistColumns])
  let mappedQueryColumns = useMemo(() => {
    return [
      ...renderPickList('start'),
      ...(queryColumns || []).map((i: any) => {
        return ({
          ...i,
          hideInTable: true,
          hideInSetting: true,
          fieldProps: {
            ...i?.fieldProps,
            value: i.valueType === 'dateRange' 
              ? (
                filterState?.dateFr ?
                [filterState?.dateFr ? moment(filterState?.dateFr) : null, filterState?.dateTo ? moment(filterState?.dateTo) : null] 
                : undefined
              )
              : filterState?.[i?.dataIndex] || undefined,
            onChange(e: any) {
              if(i.valueType === 'dateRange') {
                handleSetFilterToState({'dateFr': moment(e?.[0]).startOf("date").toISOString(), 'dateTo': moment(e?.[1]).endOf("date").toISOString()})
              } else {
                const value = typeof e === 'object' ? e?.target?.value : e
                handleSetFilterToState({[i?.dataIndex]: value})
              }
            }
          }
        })
      }),
      ...renderPickList('end'),
    ]
  }, [filterState])

  if(sortQueryColumns?.length > 0) {
    mappedQueryColumns = sortObjectArrayByArray(mappedQueryColumns, sortQueryColumns, 'dataIndex')
  }
  const mappedColumns = useMemo(() => (columns || []).map((i: any) => ({...i, hideInSearch: true})), [columns])

  // query url
  useEffect(() => {
    const isNotPushInFirstLoad = isFirstLoad && !_.isEmpty(urlQueryInFirstLoad)
    if(!disableFilterQuery && !isNotPushInFirstLoad) {
      pushQueryToUrl(history, '', filterQueryObj)
    }
  }, [JSON.stringify(filterQueryObj)])

  return (
    <>
      <ATable
        onReset={() => {
          onReset()
          setProTableFilterQuery({current: 1, pageSize: 20})
          setFilterState({current: 1, pageSize: 20})
        }}
        actionRef={actionRef || ref}
        search={
          queryColumns?.length ? {
            labelWidth: 'auto',
            defaultCollapsed: false,
            defaultColsNumber: 6,
            split: true,
            className: styles?.searchLoading,
            searchText:translate("Search"),
            ...searchProps
          } : false
        }
        toolbar={{
          title: titlePage || '',
          style: {
            width: '100%',
            overflow: 'hidden',
            overflowX: 'auto',
            display: hideToolBar ? 'none' : 'block'
          }
        }}
        pagination={{
          current: Number(filterQueryObj?.current) || 1,
          pageSize: filterQueryObj?.pageSize || defaultPageSize,
          showSizeChanger: showSizeChanger,
          onShowSizeChange: (current, pageSize) => {
            if(!isFirstLoad) {
              handleSetFilterToState({current, pageSize})
            }
          }
        }}
        // params={{ ...filterState }}
        // @ts-ignore
        toolBarRender={() => !hideToolBar && (
          <>
            <Space>
              {
                showPickList && picklist?.length > 0
                && picklist.map((i: any) => (
                  <Select
                    allowClear
                    showArrow
                    key={i?.id}
                    mode={i?.isMulti ? 'multiple' : undefined}
                    options={i?.options || []}
                    placeholder={i?.label}
                    optionFilterProp='label'
                    onChange={(val: any) => filterChange(i?.id, val)}
                    style={{ width: '200px' }}
                  />
                ))
              }
              {
                searchAction && (
                  <Input.Search
                    allowClear
                    style={{ width: 200 }}
                    placeholder={searchPlaceholder || translate('form.placeholder.search')}
                    onSearch={(value: string) => {
                      const val = (value || '').trim()
                      setKeyword(val)
                      filterChange('keyword', val)
                    }}
                    onBlur={(e: any) => {
                      const val = (e.target.value || '').trim()
                      setKeyword(val)
                      filterChange('keyword', val)
                    }}
                    onChange={(e: any) => setKeyword(e?.target?.value || '')}
                    value={keyword || ''}
                  />
                )
              }
              {
                dateAction && (
                  <>
                    <DatePicker
                      allowClear
                      style={{ width: 160 }}
                      placeholder={parseValue({
                        vi: 'Từ ngày',
                        en: 'From date',
                      })}
                      format='DD/MM/YYYY'
                      onChange={(val: any) => filterChange('dateFr', val?.toDate())}
                      disabledDate={(date: any) => filter?.dateTo && date.isAfter(filter.dateTo, 'day')}
                    />
                    <DatePicker
                      allowClear
                      style={{ width: 160 }}
                      placeholder={parseValue({
                        vi: 'Tới ngày',
                        en: 'To date',
                      })}
                      format='DD/MM/YYYY'
                      onChange={(val: any) => filterChange('dateTo', val?.toDate())}
                      disabledDate={(date: any) => filter?.dateFr && date.isBefore(filter.dateFr, 'day')}
                    />
                  </>
                )
              }
            </Space>
            {
              extraButtonsToolbar
              && extraButtonsToolbar?.()
            }
            {
              addAction && (
                <Button
                  type="primary"
                  key="toolbarAddButton"
                  icon={<PlusOutlined/>}
                  onClick={async () => {
                    if (createToggle) {
                      createToggle()
                    } else {
                      setCurrentRow(undefined)
                      handleModalVisible(true)
                    }
                  }}
                >
                  {translate('form.button.addNew')}
                </Button>
              )
            }
            {
              importExcel && (
                importExcelButton ? importExcelButton :
                <Button
                  type="primary"
                  key="toolbarImportButton"
                  loading={loading}
                  icon={<UploadOutlined />}
                  onClick={async () => {
                    if (importExcelFunc) {
                      // setLoading(true)
                      await importExcelFunc()
                      // setLoading(false)
                    }
                  }}
                >
                  {translate('form.button.import')}
                </Button>
              )
            }
            {
              exportExcel && (
                <Button
                  type="primary"
                  key="toolbarExportButton"
                  loading={loading}
                  icon={<FileExcelOutlined />}
                  onClick={async () => {
                    if (exportExcelFunc) {
                      setLoading(true)
                      await exportExcelFunc()
                      setLoading(false)
                    }
                  }}
                >
                  {translate('form.button.export')}
                </Button>
              )
            }
          </>
        )}
        request={onRequest}
        expandable={expandable}

        columns={
          [
            {
              title: translate('form.field.stt'),
              dataIndex: 'index',
              valueType: 'index',
              width: 55,
              align: 'center',
              hideInSearch: true,
              render: (dom: any, entity: any, index: number) => currentNo + index + 1
            },
            ...mappedColumns,
            ...(showActionColumn ? [
              {
                title: '',
                dataIndex: 'option',
                valueType: 'option',
                width: renderActsWidth(editAction, removeAction, extraButtons?.length || 0),
                render: (_temp: any, record: any) => (
                  <div style={{ textAlign: 'center' }}>
                    <Space size="small">
                      {
                        extraButtons
                          ? extraButtons?.(record, reloadGrid, formModal)
                          : null
                      }
                      {
                        editAction && (
                          <EditOutlined
                            title={translate('form.button.edit')}
                            onClick={() => {
                              handleModalVisible(true)
                              setCurrentRow(record)
                              onModalLoad?.(record, formModal)
                            }}
                          />
                        )
                      }
                      {
                        removeAction && (
                          <Popconfirm
                            title={
                              <div style={{ whiteSpace: 'pre' }}>
                                {translate('form.message.delete.confirmText')}
                              </div>
                            }
                            okText={translate('form.button.delete')}
                            cancelText={translate('form.button.cancel')}
                            okButtonProps={{ danger: true }}
                            onConfirm={async () => {
                              if (!removeFunc) return;
                              const resp: any = await removeFunc?.(record);
                              if (resp?.success) message.success(translate('form.delete.success.message'));
                              else notification.error(resp?.message || translate('form.delete.failed.message'));
                              reloadGrid();
                            }}
                          >
                            <DeleteOutlined
                              title={translate('form.button.delete')}
                              style={{ color: 'red' }}
                            />
                          </Popconfirm>
                        )
                      }
                    </Space>
                  </div>
                )
              }
            ] : []),
            ...mappedQueryColumns,
          ]
        }
        rowSelection={
          rowSelection
            ? {
              onChange: (_temp: any, selected: any) => rowSelection(selected)
            }
          : showRowSelection
            && !hideSelectAll && {
              onChange: (_temp: any, selected: any) => setSelectedRows(selected)
            }
        }
        tableStyle={{
          width: '100%',
          overflow: 'hidden',
          overflowX: 'auto'
        }}
      />

      {
        selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                Đã chọn{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              </div>
            }
          >
            <Button
              onClick={async () => {
                confirm({
                  title: parseValue({
                    vi: 'Bạn có chắc chắn xóa?',
                    en: 'Are you sure you want to delete?'
                  }),
                  icon: <ExclamationCircleOutlined />,
                  content: parseValue({
                    vi: 'Bấm OK để xóa',
                    en: 'Click OK to delete'
                  }),
                  onOk: async () => {
                    await handleRemove(selectedRowsState);
                    setSelectedRows([]);
                    reloadGrid();
                  },
                  onCancel() {},
                });
              }}
              type="ghost"
            >
              {translate('form.button.delete')}
            </Button>
          </FooterToolbar>
        )
      }

      <ModalForm
        form={formModal}
        title={`${
          currentRow
            ? translate('form.title.update')
            : translate('form.title.create')
        } ${title || ''}`}
        width={formWidth || '500px'}
        visible={createModalVisible}
        onVisibleChange={(e: boolean) => {
          handleModalVisible(e);
          if (!e) onModalClose?.();
        }}
        modalProps={{
          ...modalProps,
          destroyOnClose: true,
          okText: translate('form.button.ok'),
          cancelText: translate('form.button.cancel'),
        }}
        initialValues={currentRow || {}}
        onFinish={async (value: any) => {
          if (currentRow) {
            confirm({
              title: translate('form.message.update.confirm'),
              icon: <ExclamationCircleOutlined />,
              content: translate('form.message.update.tutorial'),
              onOk: async () => {
                const success = await handleUpdate(value);
                if (success) {
                  handleModalVisible(false);
                  reloadGrid();
                }
              },
              onCancel() {},
              okText: translate('form.button.ok'),
              cancelText: translate('form.button.cancel'),
            });
          } else {
            const success = await handleCreate(value);
            if (success) {
              handleModalVisible(false);
              reloadGrid();
              formModal.resetFields()
            }
          }
        }}
      >
        {form}
      </ModalForm>
    </>
  );
};

export default ProTable;
