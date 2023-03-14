import React from 'react';
import { Tree as Comp } from 'antd';

const Tree = (props: any) => {
  return <Comp {...props} />;
};

const TreeNode = (props: any) => {
  return <Comp.TreeNode {...props} />;
};

const DirectoryTree = (props: any) => {
  return <Comp.DirectoryTree {...props} />;
};

export { Tree, TreeNode, DirectoryTree };
