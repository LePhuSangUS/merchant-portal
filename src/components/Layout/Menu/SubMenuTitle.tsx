import React from "react";
import MenuIcon from "./MenuIcon";

interface SubMenuTitleProps {
    route: ObjectType;
}

const SubMenuTitle: React.FC<SubMenuTitleProps> = ({ route }) => {
    return (
        <>
            <MenuIcon id={route.id} icon={route.icon} />
            <span>{route.name}</span>
        </>
    )
}

export default SubMenuTitle;