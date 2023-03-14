import React from 'react';
import { List as Comp } from 'antd';

const List = (props: any) => {
  return <Comp {...props} />;
};

const ListItem = (props: any) => {
  return <Comp.Item {...props} />;
};

const ListItemMeta = (props: any) => {
  return <Comp.Item.Meta {...props} />;
};

export { List, ListItem, ListItemMeta };
