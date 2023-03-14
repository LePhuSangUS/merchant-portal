import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const UploadImageCrop = ({ selectMulti, url }) => {
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        className="avatar-uploader"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        multiple={selectMulti}
        maxCount={1}
      ></Upload>
    </ImgCrop>
  );
};

export default UploadImageCrop;
