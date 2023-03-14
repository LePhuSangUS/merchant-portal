import React from 'react';
import { TreeSelect as Comp } from 'antd';

const TreeSelect = (props: any) => {
  return <Comp {...props} />;
};

const TreeSelectNode = (props: any) => {
  return <Comp.TreeNode {...props} />;
};

export { TreeSelect, TreeSelectNode };
