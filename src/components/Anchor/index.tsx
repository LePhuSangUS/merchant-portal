import React from 'react';
import { Anchor as Comp } from 'antd';

const Anchor = (props: any) => {
  return <Comp {...props} />;
};

const AnchorLink = (props: any) => {
  return <Comp.Link {...props} />;
};

export { Anchor, AnchorLink };
