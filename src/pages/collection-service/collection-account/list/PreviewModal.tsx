import React from 'react';
import type { ModalFuncProps } from 'antd';

import { Modal, Button } from '@/components';
import { translate } from '@/utils';
import style from './PreviewModal.less';

interface PreviewModalProps extends ModalFuncProps {
    url: string | undefined;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ onCancel, url, ...props }) => {
    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            footer={false}
            className={style.previewModal}
        >
            <iframe src={url} style={{ width: 'calc(100% - 50px)', height: 'calc(100vh - 100px)' }} frameBorder={0} />
            <div className='btn-wrap'>
                <Button type='primary' onClick={onCancel} > {translate('form.button.close')} </Button>
            </div>
        </Modal>
    )
}

export default PreviewModal;