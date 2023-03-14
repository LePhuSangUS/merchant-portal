import React from 'react';
import { Card as Comp } from 'antd';

const Card = (props: any) => {
  return <Comp {...props} />;
};

const CardMeta = (props: any) => {
  return <Comp.Meta {...props} />;
};
const CardGrid = (props: any) => {
  return <Comp.Grid {...props} />;
};

export { Card, CardMeta, CardGrid };
export { default as CardHeader } from './CardHeader'
