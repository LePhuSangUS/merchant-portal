import React, { useState } from 'react';

//styles
import classNames from 'classnames';
import styles from './styles.less';

//libs
import _ from 'lodash';

//components
import { Icons, Modal } from '@/components';
import { Upload } from 'antd';
const { Dragger } = Upload;
const { InboxOutlined } = Icons;

//utils
import { getLanguageKey, message, translate, validation } from '@/utils';
import { getToken } from '@/utils/storage';
import { env } from "@/env";

//interfaces
interface UploadProps {
  defaultFileList?: any[];
  value?: any[];
  onChange?: (fileList: any) => void;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean;
  fileList?: any;
  className?: string;
  maxCount?: number;
  acceptTypeList?: any[];
  maxSize?: number; // MB
  anonymous?: boolean | false;
  multiple?: boolean | false;
  maxHeight?: number;
  maxWidth?: number;
  error?: string[];
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
    reader.onerror = (error) => reject(error);
  });
};

const CustomUpload: React.FC<UploadProps> = (props) => {
  const {
    onChange,
    listType = 'picture',
    maxCount = 8,
    acceptTypeList = [],
    maxSize = 1,
    maxHeight,
    maxWidth,
    error,
  } = props;
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [data, setData] = useState<any>([]);

  const acceptType = acceptTypeList.map((item) => {
    const path = item.split('/');
    if (path.length > 1) {
      return path[1];
    }
  });

  const beforeUploadBase = async (file: any, fileList: any) => {
    // chỉ show duy nhất 1 thông báo
    if (
      data?.length + fileList?.length > maxCount &&
      file.uid === fileList[fileList?.length - 1]?.uid
    ) {
      message.error(
        translate('message.upload.maximum', 'Số hình upload đã đạt tối đa', { maxCount }),
      );
      return Upload.LIST_IGNORE;
    }

    if (!_.isEmpty(acceptTypeList) && !_.includes(acceptTypeList, _.toString(file.type))) {
      file.status = 'error';
      message.error(translate('message.upload.fileType.error'));
      return Upload.LIST_IGNORE;
    }

    if (!validation.validationFileSize(file.size, maxSize)) {
      file.status = 'error';
      message.error(translate('message.upload.maxSize', '', { maxSize }));
      return Upload.LIST_IGNORE;
    }
    if (file.type === 'application/json') {
      //TODO: kiểm tra height, width của json
    } else {
      if (maxHeight && maxWidth) {
        if (!(await validation.validationImageDimension({ file, maxHeight, maxWidth }))) {
          file.status = 'error';
          message.error(translate('locale.image.maxDimensions', '', { maxHeight, maxWidth }));
          return Upload.LIST_IGNORE;
        }
      }
    }
    return file;
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Accept-Language': getLanguageKey(),
  });

  const config = {
    action: props?.anonymous ? `${env.FILE_API_URL}/upload-temp/file` : `${env.FILE_API_URL}/upload/file`,
    headers: getHeaders(),
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChange = async (info: any) => {
    const { fileList, file } = info;
    const { status, response } = file;

    let output: any = '';
    const dataRes = {
      data: response?.[0]?.data || {},
      success: response?.[0]?.code === 1,
      message: response?.[0]?.message,
    };
    // if (!dataRes?.success) {
    //   message.error(`${info.file.name} ${translate('message.upload.error')}`);
    // }

    if (status === 'uploading') {
      return;
    }
    if (status === 'done') {
      if (dataRes.success) {
        message.success(`${info.file.name} ${translate('message.upload.success')}`);
        // Get this url from response in real world.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getBase64v2(info.file.originFileObj, (iUrl: any) => {});
      } else {
        message.error(`${info.file.name} ${translate('message.upload.error')}`);
        file.status = 'error';
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} ${translate('message.upload.error')}`);
    }

    const errIndex = _.findIndex(fileList, ['status', 'error']);
    if (errIndex >= 0) fileList.splice(errIndex, 1);

    output = fileList?.filter((item: any) => item?.status !== 'error')?.map((item: any) => {
      if (item?.status === 'error') {
        return item?.name
      } else {
        return item?.response?.[0]?.data?.filename
      }
    });
    if (!props.multiple) output = output[0]
    setData(output);
    if (onChange) onChange(output);
  };

  const DragableUploadListItem = ({ originNode, file }: any) => {
    return (
      <div className="ant-upload-draggable-list-item" style={{ cursor: 'move' }}>
        {file.status !== 'error' && originNode}
      </div>
    );
  };

  return (
    <div className={classNames({ [styles.customUpload]: true, [styles.error]: !_.isEmpty(error) })}>
      <Dragger
        key="edit"
        {...config}
        {...props}
        beforeUpload={beforeUploadBase}
        onPreview={handlePreview}
        listType={listType}
        defaultFileList={[]}
        onChange={handleChange}
        itemRender={(originNode: any, file: any) => (
          <DragableUploadListItem originNode={originNode} file={file} />
        )}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
          {translate('locale.upload.dragger.headline')}
        </p>
        <p className="ant-upload-hint" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
          {translate('locale.upload.dragger.acceptType', '', { acceptType: acceptType.join(', ') })}
        </p>
      </Dragger>

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="review image" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default CustomUpload;
