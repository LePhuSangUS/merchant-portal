import React from 'react';
import { Layout as Comp } from 'antd';

const Layout = (props: any) => {
  return <Comp {...props} />;
};

const LayoutHeader = (props: any) => {
  return <Comp.Header {...props} />;
};
const LayoutContent = (props: any) => {
  return <Comp.Content {...props} />;
};

const LayoutFooter = (props: any) => {
  return <Comp.Footer {...props} />;
};

export { Layout, LayoutHeader, LayoutContent, LayoutFooter };
export * from "./Menu";
export * from "./CustomLayout";