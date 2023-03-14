import React from "react";
import { Menu } from 'antd';
import { Link } from 'umi';
import MenuIcon from './MenuIcon';

type MenuItemProps = {
    route: ObjectType;
}

const MenuItem: React.FC<MenuItemProps> = ({ route, ...rest }) => (
    <Menu.Item {...rest}>
        <MenuIcon id={route.id} icon={route.icon} />
        <Link to={route.path}>{route.name}</Link>
    </Menu.Item>
)

export default MenuItem;