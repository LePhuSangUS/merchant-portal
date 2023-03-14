import { Space } from "antd";
import { renderCurrency } from "@/utils/render";
import style from "./index.less";

interface WalletBoxProps {
    balance: number;
    title: React.ReactNode;
    currencyUnit?: string;
    borderColor?: string;
    backgroundColor?: string;
}

const WalletBox: React.FC<WalletBoxProps> = ({ title, balance, currencyUnit = 'VND', borderColor, backgroundColor }) => {
    return (
        <div className={style['wallet-box']} style={{ borderColor, backgroundColor }}>
            <Space><span>{title}</span></Space>
            <span className={style['wallet-box--amount']}>{`${renderCurrency(balance)} ${currencyUnit}`}</span>
        </div>
    )
}

export default WalletBox;