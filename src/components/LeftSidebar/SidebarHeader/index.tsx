import classNames from "classnames";
import style from "./index.less";

const SidebarHeader: React.FC<ObjectType> = ({ children }) => <div className={classNames(style['sidebar-header'], 'sidebar-header')}>{children}</div>
export default SidebarHeader;