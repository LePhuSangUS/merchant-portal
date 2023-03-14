import React from 'react';
import { ConfigProvider as Comp } from 'antd';

const ConfigProvider = (props: any) => {
  return <Comp {...props} />;
};

export { ConfigProvider };
