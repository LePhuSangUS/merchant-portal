import React, { } from 'react';
import { renderField, translate } from '@/utils';
import styles from "./BankInfoItem.less";
import QRCode from 'qrcode.react';
const FieldItem = (props: any) => {
    const { label, content } = props;
    return <div className={styles.fieldItem} >
        <div className={styles.label}>
            {label}
        </div>
        <div className={styles.content} >
            {content || '-'}
        </div>
    </div>
}



const BankInfoItem = (props: any) => {


    const { data } = props;

    const bankInfoMapping = [
        {
            id: "1",
            label: translate("disbursement.bank_name"),
            content: renderField(data?.bankName),
        },
        {
            id: "1",
            label: translate("disbursement.account_number"),
            content: renderField(data?.accountNumber),
        },
        {
            id: "1",
            label: translate("disbursement.beneficiary_unit"),
            content: renderField(data?.accountName),

        },
        {
            id: "1",
            label: translate("disbursement.transfer_content"),
            content: renderField(data?.remark),

        },
    ]

    return (<div className={styles.component} >
        <img style={{
            height:"120px"
        }} src={data?.logo} alt="Bank Logo" />
        <QRCode
            value={data?.qrCode || "-"}
            width={100}
            height={100}
        />

        <div className={styles.bankInfo}>
            {
                bankInfoMapping?.map((item: any) => {
                    return <FieldItem
                        {...item}
                       />
                })
            }
        </div>
    </div>
    )
}

export default (BankInfoItem);