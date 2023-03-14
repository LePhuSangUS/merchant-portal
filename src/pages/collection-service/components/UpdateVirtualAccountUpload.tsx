import React, { useState, useEffect } from 'react';
import { Icons, Modal, Button } from '@/components';
import { Upload } from 'antd';
import { message, translate, parseValue } from '@/utils';
import styles from '@/components/CustomUpload/style.less';
import type { RcFile } from 'antd/lib/upload';
import { propertyNotEqual, trim } from '@/utils/curry';
import { getBase64, getBase64v2, getHeaders } from '@/components/CustomUpload/fns';
import { EditOutlined } from '@ant-design/icons';
import dftAvatar from '@/assets/dft_avatar.jpeg';
import { env } from "@/env";

const { InboxOutlined, LoadingOutlined } = Icons;

interface UploadProps {
    value?: ObjectType[],
    onChange?: (fileList: any) => void,
    showUploadList?: boolean,
    fileList?: any,
    className?: string,
    maxCount?: number,
    accept?: string,
    single?: boolean,
    anonymous?: boolean | false,
    maxSize?: number,
    multiple?: boolean,
    acceptTypeList?: string[],
    error?: string,
    uploadApi?: string,
    disabled?: boolean,
    initImage?: string,
    showMessage?: boolean;
    label?: React.ReactNode;
}
const UpdateVirtualAccountUpload: React.FC<UploadProps> = ({ value, initImage, onChange, uploadApi, maxCount = 8, single = false, maxSize, acceptTypeList = [], showMessage = false, label, ...props }) => {
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<any>('');
    const [currentImageList, setCurrentImageList] = useState<any>([])
    const config = {
        action: (
            props?.anonymous
                ? `${env.FILE_API_URL}/upload-temp/file`
                : `${env.FILE_API_URL}/upload/file`
        ),
        headers: getHeaders(),
    };

    useEffect(() => {
        setImageUrl(initImage)
    }, [initImage])

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleCancel = () => setPreviewVisible(false);

    const closeMessage = () => {
        message.destroy();
    }

    const handleChange = async (info: any) => {
        const { fileList, file } = info;
        const { status, response } = file;
        let output = '';
        const dataRes = {
            data: response?.[0]?.data || {},
            success: response?.[0]?.code === 1,
            message: response?.[0]?.message
        }
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (status === 'done') {
            if (dataRes.success) {
                if (showMessage)
                    message.success(`${info.file.name} ${translate('message.upload.success')}`);
                // Get this url from response in real world.
                getBase64v2(info.file.originFileObj, (iUrl: any) => {
                    setImageUrl(iUrl)
                });
            } else {
                if (showMessage)
                    // message.error({
                    //     content: <div className="errorContent">{dataRes?.message || translate("message.upload.error")} <Button type="link" onClick={closeMessage}><CloseOutlined /></Button></div>,
                    //     className: styles.customErrorMessage
                    // });
                    message.error(translate("message.upload.error"));
                file.status = 'error'
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} ${translate('message.upload.error')}`);
        }

        setLoading(false);

        const fileListSuccess = fileList?.filter(propertyNotEqual('status', 'error'))
        setCurrentImageList(fileListSuccess)
        output = fileListSuccess?.map((item: any) => item?.response?.[0].data?.filename)
        if (single) output = output[0]
        if (onChange) onChange(output);
    }

    const beforeUpload = (file: RcFile, fileList: RcFile[]) => {

        // check accept file type
        const acceptList = props?.accept?.split(',').map(trim) || acceptTypeList
        if (acceptList?.length) {
            const isAcceptedImg = acceptList?.includes(file.type)
            if (!isAcceptedImg) {
                message.error(translate('message.upload.fileType.error'))
                return Upload.LIST_IGNORE
            }
        }

        // check image size
        let isExceedSize = false
        if (maxSize) {
            isExceedSize = file.size / 1024 / 1024 > maxSize
            if (isExceedSize) {
                message.error(translate('message.upload.maxSize', parseValue({
                    vi: 'Kích thước hình ảnh quá lớn',
                    en: 'Image size too big'
                }), { maxSize }))
                return Upload.LIST_IGNORE
            }
        }

        // check max image
        const maxImg = single ? 1 : maxCount
        const isMax = currentImageList?.length + fileList?.length > maxImg && file.uid === fileList[fileList?.length - 1]?.uid
        if (isMax && !single) {
            message.error(
                translate('message.upload.maximum', 'Số hình upload đã đạt tối đa', { maxCount: maxImg })
            )
            return Upload.LIST_IGNORE
        }

        return file
    }
    const uploadButton = (
        <div style={{ width: '100%' }}>
            {loading ? <LoadingOutlined /> : <div className={styles.uploadButton}>
                <p className={styles.uploadIcon}>
                    <InboxOutlined />

                </p>
                <p className={styles.uploadText} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
                    {translate('locale.upload.dragger.headline')}
                </p>
                <p className={styles.uploadHint} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
                    {translate('locale.upload.dragger.note')}
                </p>
            </div>
            }
        </div>
    );

    return (
        <div className={styles.customUpload} style={{ width: 250 }}>
            <label>{label}</label>
            <Upload
                {...config}
                {...props}
                listType="picture-card"
                className={styles.avatarUpload}
                maxCount={maxCount}
                defaultFileList={value ? value : []}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                showUploadList={false}
            >
                <div className='kyc-upload--img-container' style={{ width: 200, height: 198 }}>
                    <img src={imageUrl || dftAvatar} alt="avatar" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                </div>

                <Button><EditOutlined /></Button>
            </Upload>

            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="review image" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default UpdateVirtualAccountUpload;
