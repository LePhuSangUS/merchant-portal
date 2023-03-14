import React from 'react';
import { Typography as Comp } from 'antd';

const Typography = (props: any) => {
  return <Comp {...props} />;
};

const Title = (props: any) => {
  return <Comp.Title {...props} />;
};

const Text = (props: any) => {
  return <Comp.Text {...props} />;
};

const TextLink = (props: any) => {
  return <Comp.Link {...props} />;
};

const Paragraph = (props: any) => {
  return <Comp.Paragraph {...props} />;
};

export { Typography, Title, Text, TextLink, Paragraph };
