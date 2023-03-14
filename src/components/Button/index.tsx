import React from 'react';
import { Button as AButton } from 'antd';
import { Link as ALink } from 'umi';

const Button = (props: any) => {
  return <AButton {...props} />;
};

const Link = (props: any) => {
  return <ALink {...props} />;
};

export { Button, Link };
