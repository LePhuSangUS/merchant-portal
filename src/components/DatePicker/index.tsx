import React from 'react';
import { DatePicker as Comp } from 'antd';

const DatePicker = (props: any) => {
  return <Comp {...props} />;
};

const DateRangePicker = (props: any) => {
  return <Comp.RangePicker {...props} />;
};

export { DatePicker, DateRangePicker };
