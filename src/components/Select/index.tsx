import React from 'react';
import { Select as Comp } from 'antd';

const Select = (props: any) => {
  return <Comp {...props} />;
};

const Option = (props: any) => {
  return <Comp.Option {...props} />;
};

const OptGroup = (props: any) => {
  return <Comp.OptGroup {...props} />;
};

const SelectOption = (props: any) => {
  return <Comp.Option {...props} />;
};

const OptionGroup = (props: any) => {
  return <Comp.OptGroup {...props} />;
};

export { Select, Option, OptGroup, OptionGroup, SelectOption };
