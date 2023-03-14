import React from 'react'
import { Row } from '@/components'
import styles from './styles.less'

export const DetailContent = (props: { children?: React.ReactNode, className?: string }) => (
    <div className={`${styles?.detailContent} ${props?.className || ''}`}><Row gutter={15}>{props?.children}</Row></div>
)