import React from "react";

const SidebarHeaderLogo: React.FC<{ logo: React.ReactNode, simpleLogo?: string, isSimpleLogo?: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ logo, isSimpleLogo, simpleLogo, ...props }) => {
    return (
        <div {...props} className="sidebar-header__logo">
            {isSimpleLogo ? <img className="sidebar-header__logo--collapsed" src={simpleLogo} alt="" /> : logo}
        </div>
    )
}
export default SidebarHeaderLogo;