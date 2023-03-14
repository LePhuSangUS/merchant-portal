import React from 'react'
import styles from './styles.less'

interface DetailHeaderProps {
    title?: string
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ title }) => {
    return <div className={styles?.detailHeader}>
        <div className="header--title">
            {title}
        </div>
    </div>
}