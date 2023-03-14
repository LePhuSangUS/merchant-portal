import React from 'react';
import { Breadcrumb as Comp } from 'antd';

const Breadcrumb = (props: any) => {
  return <Comp {...props} />;
};

const BreadcrumbItem = (props: any) => {
  return <Comp.Item {...props} />;
};

const BreadcrumbSeparator = (props: any) => {
  return <Comp.Separator {...props} />;
};

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator };
