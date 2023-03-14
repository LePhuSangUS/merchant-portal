import React from 'react';
import { Row as ARow, Col as ACol } from 'antd';
import { PageContainer as AContainer } from '@ant-design/pro-layout';

const Container = (props: any) => {
  return <AContainer {...props} />;
};

const Row = (props: any) => {
  return <ARow {...props} />;
};

// xs	screen < 576px and also default setting, could be a span value or an object containing above props
// sm	screen ≥ 576px, could be a span value or an object containing above props
// md	screen ≥ 768px, could be a span value or an object containing above props
// lg	screen ≥ 992px, could be a span value or an object containing above props
// xl	screen ≥ 1200px, could be a span value or an object containing above props
// xxl screen ≥ 1600px, could be a span value or an object containing above props
const Col = (props: any) => {
  return <ACol {...props} />;
};

export { Container, Row, Col };
