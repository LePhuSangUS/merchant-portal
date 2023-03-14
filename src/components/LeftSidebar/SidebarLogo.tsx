// import style from "./SidebarLogo.less";

interface SidebarLogoProps {
    logo: React.ReactNode;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ logo }) => {
    return (
        <div className="left-sidebar__logo">
            {
                typeof logo === 'string' ? <img src={logo} /> : logo
            }
        </div>
    )
}

export default SidebarLogo;