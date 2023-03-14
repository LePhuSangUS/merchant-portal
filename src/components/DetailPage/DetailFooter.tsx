import React from 'react'
import styles from './styles.less'

interface DetailFooterProps {
    children?: React.ReactNode;
    content?: React.ReactNode;
    className?: string;
}

export const DetailFooter: React.FC<DetailFooterProps> = ({ children, content, ...rest }) => {
    return <div className={`${styles?.detailFooter} ${rest?.className || ''}`}>
        {children || content}
    </div>
}