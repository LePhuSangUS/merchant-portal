import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import {
  Modal, ProTable, Button, Space, Container, FormText,
  FormTextArea, ProForm, Icons, Status, Row, FormField, FormSelect
} from '@/components';
import CustomUpload from "../component/Upload"
import { format, translate, message, renderField, parseOptions, parseValue } from '@/utils';
import type { ProColumns } from '@ant-design/pro-table';
import { SUPPORT_STATUS_LIST } from '@/constants';
import { getSupportRequests, createSupportRequest, getSupportCategory } from '@/services/support-request/api';
import { rejectOnlySpace, requiredField, requiredSelect, checkMaxLength } from '@/utils/rules';
import { useRequestAPI } from '@/hooks';
import ModalNotiCreateSuccess from "../component/ModalNotiCreateSuccess"
import { useToggle } from 'react-use';
const { EyeOutlined, PlusOutlined } = Icons;

interface PageProps {
  history: any,
  route: any
}

const SupportRequestList: React.FC<PageProps> = ({ history, route }) => {
  const ref = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [reloadToggle, setReloadToggle] = useState<boolean>(false);
  const [supportTypeList, setSupportTypeList] = useState<any[]>([]);
  const [openNotiSuccess, toggleOpenNotiSuccess] = useToggle(false);
  const [ticketResultSuccess, setTicketResultSuccess] = useState({});
  const toggleCancelForm = () => {
    setVisible(false);
  };

  const { request: requestGetSupportRequests} = useRequestAPI({
    requestFn: getSupportRequests,
    pageName: route?.name,
    messageError: translate('support.message.list.failed'),
  })

  const submitSupportRequest = async (formData: any) => {
    setIsDisable(true);
    const { supportId, content, attachments } = formData || {};
    const resp = await createSupportRequest({
      supportId, content, attachments, priority: 1
    })
    if (!resp?.success) {
      message.error(resp?.message || translate('message.error'));
    }
    else {
      setVisible(false);
      setReloadToggle(!reloadToggle);
      toggleOpenNotiSuccess()
      setTicketResultSuccess(resp?.data)
      // message.success(translate('message.success'));
    }
    setIsDisable(false);
    return true;
  };

  const columns: ProColumns<any>[] = [
    {
      title: translate('support.field.requestTime'),
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (value: any) => renderField(value, 'datetimes')
    },
    {
      title: translate('support.field.code'),
      dataIndex: 'ticketId',
      width: 120,
      sorter: true,
      render: renderField
    },
    {
      title: translate('support.field.type'),
      dataIndex: 'supportId',
      width: 200,
      sorter: true,
      render: (dom: any, row: any) => ( <Status value={dom ||"-"} options={supportTypeList} /> )
    },
    {
      title: translate('support.field.content'),
      dataIndex: 'content',
      width: 400,
      sorter: true,
    },
    {
      title: translate('form.field.status'),
      dataIndex: 'status',
      width: 150,
      sorter: true,
      align: 'center',
      render: (dom: any, row: any) => (
        row?.status
          ? <Status value={dom} options={SUPPORT_STATUS_LIST} />
          : '-'
      )
    }
  ]

  const queryColumns: ProColumns<any>[] = [
    {
      title: translate('support.field.requestTime'),
      key: 'transDate',
      dataIndex: 'createdAt',
      editable: false,
      valueType: "dateRange",
      search: {
        transform: (value: any) => {
          return {
            dateFr: value[0],
            dateTo: value[1]
          };
        }
      },
      sorter: true,
      render: (dom: any) => format.date(dom)
    },
    {
      title: translate('support.field.code'),
      key: 'ticketId',
      dataIndex: 'ticketId',
      renderFormItem: () => (
        <FormText
          placeholder={translate('support.form.placeholder.pleaseEnter')}
        />
      ),
      sorter: true
    },
    {
      title: translate("support.field.status"),
      key: "status",
      dataIndex: "status",
      renderFormItem: () => (
        <FormSelect
          name="status"
          placeholder={translate('support.form.placeholder.pleaseSelect')}
          options={parseOptions(SUPPORT_STATUS_LIST)}
        />
      ),
      sorter: true
    },
  ]

  useEffect(() => {
    (async function () {
      const resp: any = await getSupportCategory({ cateType: "SUPPORT_TYPE" });      
      const categories = resp?.data || [];
      if (_.isArray(categories)) {
        const categoriesMapping = categories?.map((el) => {
          return {
            value: el?.id,
            label:el?.name
          }
        })
        setSupportTypeList(categoriesMapping);
      }
    })()

  }, [])

  return (
    <Container>
      <ProTable
        columns={columns}
        queryColumns={queryColumns}
        searchAction={false}
        dateAction={false}
        getListFunc={requestGetSupportRequests}
        editAction={false}
        removeAction={false}
        exportExcel={false}
        addAction={false}
        reloadTable={reloadToggle}
        extraButtonsToolbar={() => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
          >
            {translate('form.button.addNew')}
          </Button>
        )}
        extraButtons={(row: any) => (
          <EyeOutlined
            onClick={() => history.push(`/support/list/${row?.ticketId}`)}
            title={translate('form.button.detail')}
          />
        )}
      />
      {/* create form */}
      <Modal
        destroyOnClose
        width={600}
        visible={visible}
        maskClosable={false}
        title={translate('support.title.create')}
        onCancel={toggleCancelForm}
        onCollapse={toggleCancelForm}
        footer={false}
      >
        <ProForm
          formRef={ref}
          name="requestSupportModal"
          onFinish={submitSupportRequest}
          submitter={{
            searchConfig: {
              submitText: translate('support.button.send')
            },
            render: (x: any, dom: any) => (
              <Row justify="end">
                <Space>
                  {dom[1]}
                </Space>
              </Row>
            ),
            submitButtonProps: {
              disabled: isDisable
            }
          }}
        >
          <FormSelect
            name="supportId"
            label={translate('support.field.type')}
            placeholder={translate('support.form.placeholder.pleaseSelect')}
            options={parseOptions(supportTypeList)}
            rules={[requiredSelect]}
          />

          <FormTextArea
            name='content'
            label={translate('support.field.content')}
            placeholder={translate('support.form.placeholder.pleaseEnter')}
            rules={[
              requiredField,
              checkMaxLength(10000, translate('support.form.message.max')),
              rejectOnlySpace
            ]}
            fieldProps={{
              autoSize: { minRows: 7, maxRows: 12 },
              onBlur: (e: any) => ref.current.setFieldsValue({ content: _.trim(e.target.value) })
            }}
          />
          <FormField
            name='attachments'
            label={translate('support.field.attach')}
          >
            <CustomUpload
              multiple={true}
              maxCount={5}
              maxSize={2}
              acceptTypeList={["image/png", "image/jpg", "image/jpeg"]}
              accept="image/png, image/jpeg, image/jpg"
            />
          </FormField>

        </ProForm>
      </Modal>
     {/* Modal Noti Create Success  */}
     {openNotiSuccess && <ModalNotiCreateSuccess data={ticketResultSuccess} onCancel={toggleOpenNotiSuccess} />}
    </Container>
  );
};

export default SupportRequestList;
