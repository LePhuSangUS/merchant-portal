import React, { useRef, useState } from 'react';
import { ProForm, FormText, FormSelect, FormCheckbox } from "@/components"
import { translate } from "@/utils";
import { requiredField } from "@/utils/rules";
import type { FormInstance } from 'antd';
import { Modal, Row, Button, message, Form, Input } from "antd";
import { DISBURSEMENT_SUPPORT_CURRENCY } from "@/constants/local-storage.const"
import { getUser } from '@/utils/storage';




interface IProps {
  onCancel: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined,
  onSubmit?:any
}
export default function ModalConfirmDisbursementRegistration(props: IProps) {

  const { onCancel, onSubmit } = props;
  const userData = getUser();

  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const disbursementSupportCurrencyOptions = userData?.[DISBURSEMENT_SUPPORT_CURRENCY];
  return (
    <Modal open={true} title={translate('disbursement.Disbursement_Active')} footer={null} onCancel={onCancel}>
      <ProForm
        formRef={formRef}

        initialValues={{
          currencies: ["VND"]
        }}
        submitter={{

          render: (props, dom) => <Row justify='space-between'>
            <Button danger onClick={onCancel}>{translate("form.button.close")}</Button>
            <Button loading={loading} type='primary' onClick={() => { props?.submit() }}>{translate("form.button.submit")}</Button>

          </Row>,

        }}
        onFinish={onSubmit}
        layout='horizontal'>
        <FormSelect
          mode='multiple'
          name="currencies"
          label={translate("disbursement.Foreign_Currency")}
          placeholder={translate("form.placeholder.pleaseSelect")}
          rules={[requiredField]}
          options={disbursementSupportCurrencyOptions}
          fieldProps={{
            getPopupContainer: (triggerNode) => {
              return triggerNode.parentNode as any;
            }
          }}
        />
      </ProForm>

    </Modal>
  )
}
