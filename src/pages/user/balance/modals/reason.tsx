import React from 'react';
import { Button, Modal } from "@/components";
import { translate } from "@/utils";

interface PageProps {
  visible?: boolean;
  onCancel?: () => void,
  note?: string
}

const ReasonModal: React.FC<PageProps> = (
  {
    visible,
    onCancel,
    note
  }
) => {
  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={translate('balance.title.reason')}
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>
          {translate('form.button.close')}
        </Button>
      ]}
    >
      <div
        style={{
          padding: '0 0 .5em',
          fontSize: '1.1em',
          textAlign: 'center'
        }}
      >
        {note || '-'}
      </div>
    </Modal>
  )
}

export default ReasonModal
