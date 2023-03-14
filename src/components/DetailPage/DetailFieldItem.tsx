import React from 'react'
import { Row, Col } from '@/components'
import styles from './styles.less'

interface ChildColConfig {
    label?: object,
    content?: object
}

interface DetailFieldItemProps {
    label: string;
    content?: any;
    hidden?: boolean;
    noBorder?: boolean;
    colConfig?: object;
    childColConfig?: ChildColConfig;
}

export const DetailFieldItem = (props: DetailFieldItemProps = {
    label: '',
    content: '',
    hidden: false,
    noBorder: false,
    colConfig: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24
    },
    childColConfig: {
        label: {
            xs: 24,
            sm: 10,
            md: 8,
            lg: 6,
            xxl: 4,
        },
        content: {
            xs: 24,
            sm: 14,
            md: 16,
            lg: 18,
            xxl: 20
        }
    }
}) => (
    <Col {...props?.colConfig} hidden={props?.hidden} className={styles?.detailFieldContainer}>
        <Row gutter={15} hidden={!!props?.hidden} className={styles?.detailFieldItem}>
            <Col {...props?.childColConfig?.label}> {props?.label} </Col>
            <Col {...props?.childColConfig?.content}>
                <div className="detail-field---content"> {props?.content} </div>
            </Col>
        </Row>
        <hr hidden={props?.noBorder} />
    </Col>
)