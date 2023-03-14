import React, { useState, useEffect, useRef } from "react";
import { Icons, Button } from "@/components";
import { Upload } from "antd";
import { connect } from "dva"
import { FolderOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/lib/upload";
//src
import { message, translate, parseValue } from "@/utils";
import { propertyNotEqual } from "@/utils/curry";
import { getBase64, getBase64v2, getHeaders } from "@/components/CustomUpload/fns";
import type { ConnectState } from "@/models/connect";
import style from "./PrivateKeyFileUpload.less";
import { env } from "@/env";

const { CloseOutlined } = Icons;

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
  uploadApi?: string,
  disabled?: boolean,
  initImage?: string,
  currentMerchant: any;
  showMessage?: boolean;
}
const PrivateKeyFileUpload: React.FC<UploadProps> = ({ value, initImage, onChange, uploadApi, maxCount = 8, single = false, maxSize, acceptTypeList = [], showMessage = false, ...props }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>('');
  const [currentImageList, setCurrentImageList] = useState<any>([])

  const acceptType = acceptTypeList.map((item) => {
    const path = item.split('/');
    if (path.length > 1) {
      return path[1];
    }
  });

  const config = {
    action: `${env.FILE_API_URL}/collection/sftp/upload`,
    headers: getHeaders(),
  };


  const closeMessage = () => {
    message.destroy();
  }

  const handleChange = async (info: any) => {
    const { fileList, file } = info;
    const { status, response } = file;
    let output = '';
    const dataRes = {
      data: response?.data || {},
      success: response?.code === 1,
      message: response?.message
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
          message.error({
            content: <div className="errorContent">{dataRes?.message || translate("message.upload.error")} <Button type="link" onClick={closeMessage}><CloseOutlined /></Button></div>,
            // className: styles.customErrorMessage
          });
        file.status = 'error'
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} ${translate('message.upload.error')}`);
    }

    setLoading(false);

    const fileListSuccess = fileList?.filter(propertyNotEqual('status', 'error'))
    setCurrentImageList(fileListSuccess)
    // output = fileListSuccess?.map((item: any) => item?.response?.[0].data?.filename)

    // if (single) output = output[0]
    if (onChange) {
      onChange(dataRes);
    }
  }

  const beforeUpload = (file: RcFile, fileList: RcFile[]) => {

    // check accept file type
    if (acceptType?.length) {
      const fileExt = typeof file?.name === 'string' ? file.name.split('.').pop()?.toLowerCase() : ''
      const isAcceptedImg = acceptType?.includes(fileExt);
      if (!isAcceptedImg) {
        message.error(translate('message.upload.fileType.error'));
        return Upload.LIST_IGNORE;
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

  return (
    <Upload
      {...config}
      {...props}
      className={style['private-key-upload']}
      maxCount={maxCount}
      defaultFileList={value ? value : []}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      showUploadList={false}
    >
      <FolderOutlined />
    </Upload>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentMerchant: user.currentMerchant,
}))(PrivateKeyFileUpload);
