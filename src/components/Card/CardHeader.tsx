import { FC } from "react"

interface CardHeaderProps {
    title?: string;
    btns?: React.ReactNode;
}

const CardHeader: FC<CardHeaderProps> = ({ title, btns }) => (
    <div className="header">
        <div className="title">
            {title}
        </div>
        {btns && <div className="btns">{btns}</div>}
    </div>
)

export default CardHeader