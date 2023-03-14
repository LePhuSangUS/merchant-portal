import {
  EditOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';

const { confirm } = Modal;

// @ts-ignore
const NeoPayGrid = ({
  columns,
  getListFunc,
  createFunc,
  updateFunc,
  removeFunc,
  form,
  onLoadModal,
  modalWidth = '800px',
  onCloseModal,
  filterType = 'light',
  actionsFooter,
  extraButtons,
}) => {
  const intl = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<API.UserItem[]>([]);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserItem>();

  const handleAdd = async (fields: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'message.processing',
        defaultMessage: 'Đang xử lý...',
      }),
    );
    try {
      const res = await createFunc({ ...fields });
      hide();
      if (res.success) {
        message.success(
          intl.formatMessage({
            id: 'message.create.success',
            defaultMessage: 'Thêm mới thành công',
          }),
        );
      } else {
        message.warn(
          intl.formatMessage({
            id: 'message.update.error',
            defaultMessage: 'Cập nhật thất bại',
          }) +
            ': ' +
            res.message,
        );
      }
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'message.create.error',
          defaultMessage: 'Thêm mới thất bại',
        }),
      );
      return false;
    }
  };

  const handleUpdate = async (fields: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'message.processing',
        defaultMessage: 'Đang xử lý...',
      }),
    );
    try {
      const res = await updateFunc(fields);
      hide();
      if (res.success) {
        message.success(
          intl.formatMessage({
            id: 'message.update.success',
            defaultMessage: 'Cập nhật thành công',
          }),
        );
      } else {
        message.warn(
          intl.formatMessage({
            id: 'message.update.error',
            defaultMessage: 'Cập nhật thất bại',
          }) +
            ': ' +
            res.message,
        );
      }
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'message.update.error',
          defaultMessage: 'Cập nhật thất bại',
        }),
      );
      return false;
    }
  };

  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'message.processing',
        defaultMessage: 'Đang xử lý...',
      }),
    );
    if (!selectedRows) return true;
    try {
      await removeFunc({
        key: selectedRows.map((row) => row['_id']),
      });
      hide();
      message.success(
        intl.formatMessage({
          id: 'message.delete.success',
          defaultMessage: 'Xóa thành công',
        }),
      );
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'message.delete.error',
          defaultMessage: 'Xóa thất bại!',
        }),
      );
      return false;
    }
  };

  const reloadGrid = () => {
    actionRef.current?.reloadAndRest?.();
  };

  return (
    <>
      <ProTable
        headerTitle=""
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
          filterType,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.searchTable.new" defaultMessage="Thêm mới" />
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              getListFunc({ current: 1, export: true }, {});
            }}
          >
            <FileExcelOutlined />{' '}
            <FormattedMessage id="pages.searchTable.export" defaultMessage="Export" />
          </Button>,
        ]}
        request={getListFunc}
        columns={[
          ...columns,
          ...[
            {
              title: '#',
              dataIndex: 'option',
              valueType: 'option',
              render: (_, record) => [
                <EditOutlined
                  onClick={() => {
                    handleModalVisible(true);
                    setCurrentRow(record);
                    onLoadModal && onLoadModal(record);
                  }}
                />,
                <>{extraButtons ? extraButtons?.(record) : null}</>,
              ],
            },
          ],
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Đã chọn" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="item" />
              &nbsp;&nbsp;
              <span></span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              confirm({
                title: 'Bạn có chắc chắn xóa?',
                icon: <ExclamationCircleOutlined />,
                content: 'Click OK để xóa',
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
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch Deletion"
            />
          </Button>
          {actionsFooter}
          {/*<Button type="primary">*/}
          {/*  <FormattedMessage*/}
          {/*    id="pages.searchTable.batchApproval"*/}
          {/*    defaultMessage="Batch Approval"*/}
          {/*  />*/}
          {/*</Button>*/}
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: currentRow ? 'form.title.update' : 'form.title.create',
          defaultMessage: 'Tạo mới',
        })}
        width={modalWidth}
        visible={createModalVisible}
        onVisibleChange={(e) => {
          handleModalVisible(e);
          if (!e) {
            onCloseModal && onCloseModal();
          }
        }}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={currentRow || {}}
        onFinish={async (value) => {
          if (currentRow) {
            confirm({
              title: intl.formatMessage({
                id: 'form.message.update.confirm',
                defaultMessage: 'Bạn chắc chắn muốn cập nhật?',
              }),
              icon: <ExclamationCircleOutlined />,
              content: intl.formatMessage({
                id: 'form.message.update.tutorial',
                defaultMessage: 'Bấm OK để tiếp tục',
              }),
              onOk: async () => {
                const success = await handleUpdate(value as API.UserItem);
                if (success) {
                  handleModalVisible(false);
                  reloadGrid();
                }
              },
              onCancel() {},
            });
          } else {
            const success = await handleAdd(value as API.UserItem);
            if (success) {
              handleModalVisible(false);
              reloadGrid();
            }
          }
        }}
      >
        {form}
      </ModalForm>
    </>
  );
};

export default NeoPayGrid;
