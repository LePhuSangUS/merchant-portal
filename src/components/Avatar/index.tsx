import React from 'react';
import { Avatar as Comp } from 'antd';

const Avatar = (props: any) => {
  return <Comp {...props} />;
};

const AvatarGroup = (props: any) => {
  return <Comp.Group {...props} />;
};

export { Avatar, AvatarGroup };
