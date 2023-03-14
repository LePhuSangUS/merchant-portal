import React from 'react';
import { Table as Comp } from 'antd';

const Table = (props: any) => {
  return <Comp {...props} />;
};

const TableColumn = (props: any) => {
  return <Comp.Column {...props} />;
};

const TableColumnGroup = (props: any) => {
  return <Comp.ColumnGroup {...props} />;
};

export { Table, TableColumn, TableColumnGroup };
