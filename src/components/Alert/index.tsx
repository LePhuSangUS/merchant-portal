import React from 'react';
import { Alert as Custom } from 'antd';

const Alert = (props: any) => {
  return <Custom {...props} />;
};

const ErrorBoundary = (props: any) => {
  return <Custom.ErrorBoundary {...props} />;
};

export { Alert, ErrorBoundary };
