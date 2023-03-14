import React, { useState, useEffect } from 'react';
import { Icons, Modal, Button } from '@/components';
import { Upload } from 'antd';
import { message, translate, parseValue } from '@/utils';
import styles from './style.less';
import DragableUploadListItem from './DragableUploadListItem';
import { RcFile } from 'antd/lib/upload';
import { propertyNotEqual, trim } from '@/utils/curry';
import { getBase64, getBase64v2, getHeaders } from './fns';
import { env } from "@/env";

const { Dragger } = Upload;
const { InboxOutlined, PlusOutlined, LoadingOutlined, CloseOutlined } = Icons;

interface UploadProps {
  type?: 'avatar' | 'dragger' | 'upload' | undefined;
  defaultFileList?: string,
  value?: any[],
  onChange?: (fileList: any) => void,
  listType?: "text" | "picture" | 'picture-card',
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
  error?: string
}

const beforeUploadAvatar = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('message.uploadAvatar.errorFile');
    return
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('message.uploadAvatar.errorSize1M');
    return
  }
  return isJpgOrPng && isLt1M;
}

const CustomUpload: React.FC<UploadProps> = ({value, onChange, listType = 'picture', type = 'dragger', maxCount = 8, single = false, maxSize, acceptTypeList = [], ...props}) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>(value || '');
  const [data, setData] = useState<any>([]);
  const [currentImageList, setCurrentImageList] = useState<any>([])

  useEffect(() => {
    (async () => {
      if (!value) return;
      if(single) {
        const res = await fetch(`${env.FILE_API_URL}/img/${value}`);
        if(res.status === 200) {
          setData([{
            id: value,
            name: value,
            status: 'done',
            url: `${env.FILE_API_URL}/img/${value}`,
          }]);
        } else {
          setData([{
            id: value,
            name: value,
            status: 'error'
          }]);
        }
      } else {
        // map every url to the promise of the fetch
        const requests = value?.map(url => fetch(`${env.FILE_API_URL}/img/${url}`));
        // Promise.all waits until all jobs are resolved
        Promise.all(requests)
        .then(responses => {
          const parseObj:any = [];
          responses?.map((item, index) => {
            if(item.status === 200) {
              parseObj.push({
                name: value[index],
                status: 'done',
                url: `${env.FILE_API_URL}/img/${value[index]}`,
              })
            } else {
              parseObj.push({
                name: value[index],
                status: 'error'
              })
            }
          });
          return parseObj;
        }).then(values => setData(values));
      }
    })();
  }, [])

  const config = {
    action: (
      props?.anonymous
        ? `${env.FILE_API_URL}/upload-temp/file`
        : `${env.FILE_API_URL}/upload/file`
    ),
    headers: getHeaders(),
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined style={{ color: '#59c3ad' }}/> : <PlusOutlined/>}
      <div style={{ marginTop: 8 }}>{translate('component.upload')}</div>
    </div>
  );

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
      if(dataRes.success) {
        message.success(`${info.file.name} ${translate('message.upload.success')}`);
        // Get this url from response in real world.
        getBase64v2(info.file.originFileObj, (iUrl: any) => {
          setLoading(false);
          setImageUrl(iUrl)
        });
      } else {
        message.error({
          content: <div className="errorContent">{dataRes?.message} <Button type="link" onClick={closeMessage}><CloseOutlined /></Button></div>,
          className: styles.customErrorMessage
        });
        file.status = 'error'
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} ${translate('message.upload.error')}`);
    }
    const fileListSuccess = fileList?.filter(propertyNotEqual('status', 'error'))
    setCurrentImageList(fileListSuccess)
    output = fileListSuccess?.map((item: any) => item?.response?.[0]?.data?.filename || item?.name)
    if (single) output = output[0]
    if (onChange) onChange(output);
  }

  const beforeUpload = (file: RcFile, fileList: RcFile[]) => {

    // check accept file type
    const acceptList = props?.accept?.split(',').map(trim) || acceptTypeList
    if(acceptList?.length) {
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
        }), {maxSize}))
        return Upload.LIST_IGNORE
      }
    }

    // check max image
    const maxImg = single ? 1 : maxCount
    const isMax = currentImageList?.length + fileList?.length > maxImg && file.uid === fileList[fileList?.length - 1]?.uid
    if (isMax) {
      message.error(
        translate( 'message.upload.maximum', 'Số hình upload đã đạt tối đa', { maxCount: maxImg } )
      )
      return Upload.LIST_IGNORE
    }

    return file
  }

  const isEdit = data.length > 0

  return (
    <div className={styles.customUpload}>
      {
        type === 'avatar' && (
          <Upload
            {...config}
            {...props}
            maxCount={maxCount}
            defaultFileList={value ? value : []}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUploadAvatar}
            showUploadList={false}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        )
      }
      {
        type === 'upload' && (
          <Upload
            {...config}
            {...props}
            maxCount={maxCount}
            defaultFileList={value ? value : []}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            {
              value && value?.length < maxCount ? uploadButton : null
            }
          </Upload>
        )
      }
      {
        type === 'dragger' && (
          <Dragger
            key={`${isEdit ? 'edit' : 'add'}`}
            {...config}
            {...props}
            maxCount={maxCount}
            onPreview={handlePreview}
            listType={listType}
            defaultFileList={isEdit ? [...data] : []}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            itemRender={(originNode: any, file: any) => (
              <DragableUploadListItem
                originNode={originNode}
                file={file}
              />
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
              {translate('locale.upload.dragger.headline')}
            </p>
            <p className="ant-upload-hint" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
              {translate('locale.upload.dragger.note')}
            </p>
          </Dragger>
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
