import React, { useState, useEffect } from 'react';
import { Icons, Modal, Button } from '@/components';
import { Upload } from 'antd';
import { message, translate, getLanguageKey } from '@/utils';
import { getToken } from '@/utils/storage';
import styles from './style.less';
import { env } from "@/env";

const { Dragger } = Upload;
const { InboxOutlined, PlusOutlined, LoadingOutlined, CloseOutlined } = Icons;

interface UploadProps {
  type?: 'avatar' | 'dragger' | 'upload' | undefined;
  defaultFileList?: string,
  value?: string[],
  onChange?: (fileList: any) => void,
  listType?: "text" | "picture" | 'picture-card',
  showUploadList?: boolean,
  fileList?: any,
  className?: string,
  maxCount?: number,
  accept?: string,
  single?: boolean,
  anonymous?: boolean | false,
}

function getBase64v2(img: Blob, callback: (data: any) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
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

const CustomUpload: React.FC<UploadProps> = (props) => {
  const {value, onChange, listType = 'picture', type = 'dragger', maxCount = 8, single = false } = props;
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>(value || '');
  const [data, setData] = useState<any>([]);

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
        let requests = value?.map(url => fetch(`${env.FILE_API_URL}/img/${url}`));
        // Promise.all waits until all jobs are resolved
        Promise.all(requests)
          .then(responses => {
            let parseObj:any = [];
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

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Accept-Language': getLanguageKey()
  });

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

  const handleChange = (info: any) => {
    const { fileList, file } = info;
    const { status, response } = file;
    const fileRes = file?.response?.[0]?.data;
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
        getBase64v2(info.file.originFileObj, (imageUrl : any) => {
          setLoading(false);
          setImageUrl(imageUrl)
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
    if (single) {
      output = fileRes?.filename;
    } else {
      output = fileList?.map((item: any) => {
        if (item?.status === 'error') {
          return item?.name
        } else {
          return item?.response?.[0]?.data?.filename
        }
      });
    }
    if (onChange) {
      onChange(output);
    }
  }

  const DragableUploadListItem = ({ originNode, file }) => {
    const ref = React.useRef();
    // const errorNode = <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>;
    return (
      <div
        ref={ref}
        className="ant-upload-draggable-list-item"
        style={{ cursor: 'move' }}
      >
        {/* only render file tiem uploaded successful */}
        {file.status !== 'error' && originNode}
      </div>
    );
  };

  return (
    <div className={styles.customUpload}>
      {type === 'avatar' &&
      <Upload
        {...config}
        {...props}
        defaultFileList={value ? value : []}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUploadAvatar}
        showUploadList={false}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      }
      {type === 'upload' &&
      <Upload
        {...config}
        {...props}
        defaultFileList={value ? [value] : []}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={false}
      >
        {value && value?.length >= maxCount ? null : uploadButton}
      </Upload>
      }
      {(type === 'dragger' && data.length > 0) ?
        <Dragger
          key="edit"
          {...config}
          {...props}
          onPreview={handlePreview}
          listType={listType}
          defaultFileList={[...data]}
          onChange={handleChange}
          itemRender={(originNode, file, currFileList) => (
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
        </Dragger> :
        <Dragger
          key="add"
          {...config}
          {...props}
          onPreview={handlePreview}
          listType={listType}
          onChange={handleChange}
          itemRender={(originNode, file, currFileList) => (
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
