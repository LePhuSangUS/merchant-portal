import React from 'react';
import { Form as Comp } from 'antd';

const Form = (props: any) => {
  return <Comp {...props} />;
};

const FormItem = (props: any) => {
  return <Comp.Item {...props} />;
};

const FormList = (props: any) => {
  return <Comp.List {...props} />;
};

const FormErrorList = (props: any) => {
  return <Comp.ErrorList {...props} />;
};

const FormProvider = (props: any) => {
  return <Comp.Provider {...props} />;
};

export { Form, FormItem, FormList, FormErrorList, FormProvider };
