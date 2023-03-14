import React from 'react';
import { Statistic as Comp } from 'antd';

const Statistic = (props: any) => {
  return <Comp {...props} />;
};

const Countdown = (props: any) => {
  return <Comp.Countdown {...props} />;
};

const StatisticCountdown = (props: any) => {
  return <Comp.Countdown {...props} />;
};

export { Statistic, Countdown, StatisticCountdown };
