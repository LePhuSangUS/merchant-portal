import style from "./WalletBoxContainer.less";
import classNames from "classnames";

interface WalletBoxContainerProps {
    htmlAttributes?: React.HTMLAttributes<HTMLElement>;
}

const WalletBoxContainer: React.FC<WalletBoxContainerProps> = ({ children, htmlAttributes, ...props }) => {
    return (
        <div {...htmlAttributes} className={classNames(style['wallet-box-container'], htmlAttributes?.className)} {...props}>
            {children}
        </div>
    )
}

export default WalletBoxContainer;