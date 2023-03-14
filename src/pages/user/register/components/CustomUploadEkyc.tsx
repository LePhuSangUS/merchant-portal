import React, { useState } from 'react';
import { Icons, Modal, Button } from '@/components';
import { Upload } from 'antd';
import { message, translate, parseValue } from '@/utils';
import styles from './CustomUploadEkyc.less';
import { RcFile } from 'antd/lib/upload';
import { propertyNotEqual, trim } from '@/utils/curry';
import { getBase64, getBase64v2, getHeaders } from '@/components/CustomUpload/fns';
import { useIsMobile } from '@/hooks';
import WebcamCapture from './WebcamCapture';

const { InboxOutlined, LoadingOutlined, CloseOutlined } = Icons;

interface UploadProps {
  value?: any[],
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
  uploadApi: string,
  disabled?: boolean,
  initUrl?: string,
  onAfterChange?: (data: any) => void,
  onCaptureChange?: (...args: any[]) => void,
}
const CustomUpload: React.FC<UploadProps> = ({ value, onChange, onAfterChange, uploadApi, maxCount = 8, single = false, maxSize, acceptTypeList = [], initUrl, onCaptureChange, ...props }) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>(initUrl || '');
  const [currentImageList, setCurrentImageList] = useState<any>([])
  const isMobile = useIsMobile()
  const [isOpenCapture, setIsOpenCapture] = useState<boolean>(false);

  const config = {
    action: uploadApi,
    headers: getHeaders(),
  };



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
      data: response?.object || {},
      success: response?.object ? true : false,
      message: response?.message
    }
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (status === 'done') {
      if (dataRes.success) {
        message.success(`${info.file.name} ${translate('message.upload.success')}`);
        // Get this url from response in real world.
        getBase64v2(info.file.originFileObj, (iUrl: any) => {
          setImageUrl(iUrl)
        });
      } else {
        message.error({
          content: <div className="errorContent">{dataRes?.message || translate("message.upload.error")} <Button type="link" onClick={closeMessage}><CloseOutlined /></Button></div>,
          className: styles.customErrorMessage
        });
        file.status = 'error'
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} ${translate('message.upload.error')}`);
    }

    setLoading(false);

    const fileListSuccess = fileList?.filter(propertyNotEqual('status', 'error'))
    setCurrentImageList(fileListSuccess)
    output = fileListSuccess?.map((item: any) => item?.response?.object?.hash)
    let outputObject = fileListSuccess?.map((item: any) => item?.response?.object)
    if (single) {
      output = output[0]
      outputObject = outputObject[0]
    }
    if (onChange) onChange(output);
    if (onAfterChange) onAfterChange(outputObject);
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
    <div className={styles.customUpload}>
      {
        !isOpenCapture &&
        <Upload
          {...config}
          {...props}
          // accept='iamge/*'
          // name='upload-kyc'
          listType="picture-card"
          className={styles.avatarUpload}
          maxCount={maxCount}
          defaultFileList={value ? value : []}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ height: '100%' }} /> : uploadButton}
        </Upload>
      }

      {
        isMobile ?
          <Upload
            {...config}
            {...props}
            // listType="picture-card"
            // name='upload-kyc'
            className='kyc-capture-upload'
            maxCount={maxCount}
            defaultFileList={value ? value : []}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
            capture='environment'
          >
            <Button>{translate('user.register.button.captureImage')}</Button>
          </Upload>
          :
          (
            isOpenCapture ?
              <WebcamCapture
                onAfterCapture={(imageUrl, hash, object) => {
                  setImageUrl(imageUrl)
                  onCaptureChange?.(hash)
                  onAfterChange?.(object)
                  setIsOpenCapture(false)
                }}
                onCaptureError={() => {
                  setIsOpenCapture(false)
                }}
                config={config}
              />
              :
              <Button className='capture-btn' onClick={() => {
                setIsOpenCapture(true)
              }}>
                {translate('user.register.button.captureImage')}
              </Button>
          )

      }


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

export default CustomUpload;
