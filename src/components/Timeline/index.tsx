import React from 'react';
import { Timeline as Comp } from 'antd';

const Timeline = (props: any) => {
  return <Comp {...props} />;
};

const TimelineItem = (props: any) => {
  return <Comp.Item {...props} />;
};

export { Timeline, TimelineItem };
