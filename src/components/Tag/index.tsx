import React from 'react';
import { Tag as Comp } from 'antd';

const Tag = (props: any) => {
  return <Comp {...props} />;
};

const CheckableTag = (props: any) => {
  return <Comp.CheckableTag {...props} />;
};

export { Tag, CheckableTag };
