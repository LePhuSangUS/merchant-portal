import React from 'react';
import { TimePicker as Comp } from 'antd';

const TimePicker = (props: any) => {
  return <Comp {...props} />;
};

const TimeRangePicker = (props: any) => {
  return <Comp.RangePicker {...props} />;
};

export { TimePicker, TimeRangePicker };
