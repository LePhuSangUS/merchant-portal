import React from 'react';
import { Menu as Comp } from 'antd';

const Menu = (props: any) => {
  return <Comp {...props} />;
};

const SubMenu = (props: any) => {
  return <Comp.SubMenu {...props} />;
};

const MenuItem = (props: any) => {
  return <Comp.Item {...props} />;
};

const MenuItemGroup = (props: any) => {
  return <Comp.ItemGroup {...props} />;
};

const MenuDivider = (props: any) => {
  return <Comp.Divider {...props} />;
};

export { Menu, SubMenu, MenuItem, MenuItemGroup, MenuDivider };
