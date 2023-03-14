import React from 'react';
import { Input as Comp, InputNumber as Number } from 'antd';

const Input = (props: any) => {
  return <Comp {...props} />;
};

const InputGroup = (props: any) => {
  return <Comp.Group {...props} />;
};

const TextArea = (props: any) => {
  return <Comp.TextArea {...props} />;
};

const Search = (props: any) => {
  return <Comp.Search {...props} />;
};

const Password = (props: any) => {
  return <Comp.Password {...props} />;
};

const InputTextArea = (props: any) => {
  return <Comp.TextArea {...props} />;
};

const InputSearch = (props: any) => {
  return <Comp.Search {...props} />;
};

const InputPassword = (props: any) => {
  return <Comp.Password {...props} />;
};

const InputNumber = (props: any) => {
  return <Number {...props} />;
};

export {
  Input,
  InputGroup,
  TextArea,
  Search,
  Password,
  InputNumber,
  InputTextArea,
  InputSearch,
  InputPassword,
};
