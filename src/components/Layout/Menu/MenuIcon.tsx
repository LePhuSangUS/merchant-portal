import React from "react";
import NeoMenuIcon from '@/assets/icons/menu';

type CustomIconType = {
    id: React.ReactText;
    icon?: React.ReactText;
}

const MenuIcon: React.FC<CustomIconType> = ({ id, icon }) => (
    <>
        <NeoMenuIcon id={id} icon={icon} type="gray" />
        <NeoMenuIcon id={id} icon={icon} type="purple" />
    </>
)

export const MenuIconCollapse: React.FC<CustomIconType> = ({ id }) => (
    <>
      <NeoMenuIcon id={id} type="right" />
      <NeoMenuIcon id={id} type="down" />
    </>
  )

export default MenuIcon;