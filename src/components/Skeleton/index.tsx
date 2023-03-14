import React from 'react';
import { Skeleton as Comp } from 'antd';

const Skeleton = (props: any) => {
  return <Comp {...props} />;
};

const SkeletonInput = (props: any) => {
  return <Comp.Input {...props} />;
};

const SkeletonImage = (props: any) => {
  return <Comp.Image {...props} />;
};

const SkeletonAvatar = (props: any) => {
  return <Comp.Avatar {...props} />;
};

const SkeletonButton = (props: any) => {
  return <Comp.Button {...props} />;
};

export { Skeleton, SkeletonInput, SkeletonImage, SkeletonAvatar, SkeletonButton };
