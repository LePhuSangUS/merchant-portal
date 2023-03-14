import React from 'react';
import { Collapse as Comp } from 'antd';

const Collapse = (props: any) => {
  return <Comp {...props} />;
};

const CollapsePanel = (props: any) => {
  return <Comp.Panel {...props} />;
};

export { Collapse, CollapsePanel };
