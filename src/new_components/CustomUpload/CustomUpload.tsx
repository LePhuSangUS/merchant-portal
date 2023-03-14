import { Upload, Button, message, Avatar } from 'antd';
import { FormAddress, FormItem, FormText, ProForm } from '@/components';
import { icClose, icCamera } from '@/assets/icons/my-profile';
import { env } from '@/env';
import { getLanguageKey, getToken } from '@/utils';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import classNames from 'classnames';
import styles from './CustomUpload.less';
import type { UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { translate } from '@/utils';
import { parseImgUrl } from '@/utils/parse';

interface ICustomUploadProps extends UploadProps {
  className?: any;
  uploadType: 'avatar' | null | undefined;
  maxSize?: number;
  defaultImage?: any;
}

const MAX_SIZE_DEFAULT = 1024; // tính theo đơn vị KB
const CustomUpload = (props: ICustomUploadProps) => {
  const {
    accept ="image/png, image/jpeg",
    className,
    uploadType,
    name,
    defaultImage,
    maxSize = MAX_SIZE_DEFAULT,
    ...rest } = props;
  const checkMaxSize = (size: number) => {
    return size > maxSize * 1024;
  };
  const validationBeforeUpload:any=(file: any, fileList: any[]): boolean => {
    //Start Validation size
    console.log(file)
    const fileSize = file.size;
    const type = file?.type;
    if (!accept?.includes(type)){
       message.error(
        translate('Invalid file format. Please upload {accept} format', '', {
          accept,
        }),
       );
       return false;
      }
    if (checkMaxSize(fileSize)) {
       message.error(
        translate('Please choose an image that is less than {size}kb', '', {
          size: maxSize,
        }),
      );
      return false;
    }
    //End Validation size
    return true;
  }
  const renderUpload = (form?: any) => {
    //Common Props
    const uploadProps: UploadProps = {
      name: 'file',
      accept,
      action: `${env.FILE_API_URL}/upload/file`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': getLanguageKey(),
      },
      onChange: async (info) => {
        const { fileList, file } = info;
        console.log(info);
        const { status, response } = file;
        let output = '';
        const dataRes = {
          data: response?.[0]?.data || {},
          success: response?.[0]?.code === 1,
          message: response?.[0]?.message,
        };
        if (info.file.status === 'uploading') {
          return;
        }
        if (status === 'done') {
          if (dataRes.success) {
            message.success(`${info.file.name} ${translate('Upload success')}`);
            // Get this url from response in real world.
            console.log(dataRes, name);
            const filename = dataRes?.data?.filename;
            form.setFieldsValue({ [name as string]: filename });
          } else {
            message.error(`${info.file.name} ${translate('Upload fail')}`);
            file.status = 'error';
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} ${translate('Upload fail')}`);
        }
      },
      // beforeUpload: (file: RcFile, fileList: RcFile[]) => {
      //   //Start Validation size
      //   const fileSize = file.size;
      //   if (checkMaxSize(fileSize)) {
      //     message.error(
      //       translate('Please choose an image that is less than {size}kb', '', { size: maxSize }),
      //     );
      //     return Upload.LIST_IGNORE;
      //   }
      //   //End Validation size
      //   return file;
      // },
      ...rest,
    };

    //=================================
    switch (uploadType) {
      case 'avatar':
        const customUploadProps = {
          ...uploadProps,
          showUploadList: false,
        };
        return (
          <ImgCrop
            modalTitle={translate("Edit photo")}
            beforeCrop={validationBeforeUpload}
          >
            <Upload {...customUploadProps}>
              <div className={styles.avatar}>
                <Avatar size={100} src={parseImgUrl(form?.getFieldValue(name), defaultImage)} />
                <div className={styles.iconCamera}>
                  <img src={icCamera} />
                </div>
              </div>
            </Upload>
          </ImgCrop>
        );
      default:
        return (
          <Upload {...uploadProps}>
            <Button>Upload</Button>
          </Upload>
        );
    }
  };

  return (
    <div className={styles.component}>
      <FormItem noStyle shouldUpdate>
        {(form: any) => (
          <FormItem noStyle name={name}>
            {renderUpload(form)}
          </FormItem>
        )}
      </FormItem>
    </div>
  );
};

export default CustomUpload;
