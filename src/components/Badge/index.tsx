import React from 'react';
import { Badge as Comp } from 'antd';

const Badge = (props: any) => {
  return <Comp {...props} />;
};

const BadgeRibbon = (props: any) => {
  return <Comp.Ribbon {...props} />;
};

export { Badge, BadgeRibbon };
