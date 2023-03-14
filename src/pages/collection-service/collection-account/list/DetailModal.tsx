import React, { useCallback } from 'react';
import type { ModalFuncProps } from 'antd';
import QRCode from 'qrcode.react';

import { Icons, Modal, Row, Col } from '@/components';
import { translate } from '@/utils';
import { useRequestAPI } from '@/hooks';
import { getMerchantVirtualAccountsDetail } from '@/services/collection-service/api';
import style from './DetailModal.less';

const { DownloadOutlined } = Icons;

interface DetailModalProps extends ModalFuncProps {
    // exportExcelFunc: (params: any) => void;
    // detail: ObjectType | undefined;
    id: React.ReactText;
}

const DetailModal: React.FC<DetailModalProps> = ({ onCancel, id, ...props }) => {

    const downloadQrCode = useCallback(() => {
        const canvas: any = document.querySelector(".dowload-qr-code > canvas");
        const anchor = document.createElement("a");
        anchor.href = canvas.toDataURL();
        anchor.download = `qr-code-${Date.now()}.jpg`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }, []);

    const { resp } = useRequestAPI<ObjectType>({
        requestFn: () => getMerchantVirtualAccountsDetail(id),
        internalCall: true,
        callDepndencies: [id]
    });

    const detail = resp?.data;

    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            footer={null}
            title={translate('collection-service.account.detail.title')}
            className={style['collection-account-detail-modal']}
        >
            <div>
                <div style={{ textAlign: "center" }} className="dowload-qr-code">
                    <QRCode
                        value={detail?.qrText || '-'}
                        width={100}
                        height={100}
                        style={{ margin: "auto", marginBottom: 10 }}
                    />
                    <a onClick={downloadQrCode}><DownloadOutlined /> {translate('collection-service.account.button.download')}</a>
                </div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={12}>{translate('collection-service.transaction.receiverBank')}</Col>
                    <Col span={12}><strong>{detail?.bankName || "-"}</strong></Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={12}>{translate('collection-service.transaction.bankAccount')}</Col>
                    <Col span={12}><strong>{detail?.bankAccountNumber || "-"}</strong></Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={12}>{translate('collection-service.transaction.receiver')}</Col>
                    <Col span={12}><strong>{detail?.accountName || "-"}</strong></Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={12}>{translate('collection-service.transaction.transNote')}</Col>
                    <Col span={12}><strong>{detail?.transferNote}</strong></Col>
                </Row>
            </div>
        </Modal>
    )
}

export default DetailModal;