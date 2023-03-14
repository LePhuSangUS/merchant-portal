import React from 'react';
import { Checkbox as Comp } from 'antd';

const Checkbox = (props: any) => {
  return <Comp {...props} />;
};

const CheckboxGroup = (props: any) => {
  return <Comp.Group {...props} />;
};

export { Checkbox, CheckboxGroup };
