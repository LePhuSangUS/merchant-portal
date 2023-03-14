import React from 'react';
import { Radio as Comp } from 'antd';

const Radio = (props: any) => {
  return <Comp {...props} />;
};

const RadioGroup = (props: any) => {
  return <Comp.Group {...props} />;
};

const RadioButton = (props: any) => {
  return <Comp.Button {...props} />;
};

export { Radio, RadioGroup, RadioButton };
