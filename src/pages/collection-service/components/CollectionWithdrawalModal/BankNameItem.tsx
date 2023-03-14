
import React, { } from 'react'
import { Icons, Space } from '@/components'
import styles from "./BankNameItem.less";
const { BankTwoTone } = Icons;

interface IProps {
    bankAccount: string,
    bankName: string,
    icon?: any,


}

const BankNameItem: React.FC<any> = (props: IProps) => {

    const { bankAccount, bankName, icon } = props
    return (
        <Space className={styles.component}>
            {icon ? icon : <BankTwoTone />}
            <span className={styles.bankName}>{bankName}</span> 
            <span className={styles.separator}>-</span>
            <span>{bankAccount}</span>
        </Space>

    )
}

export default BankNameItem