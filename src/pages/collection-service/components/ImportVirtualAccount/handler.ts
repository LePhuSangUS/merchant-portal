import _ from "lodash";
import { isEmpty } from "@/utils/utils";

export const FILE_COLUMNS = {
    MERCHANT_ACCOUNT_ID: 'merchantAccountId',
    ACCOUNT_NAME: 'accountName',
    ACCOUNT_ADDRESS: 'accountAddress'
}

export const fileColumnsValues = Object.values(FILE_COLUMNS);

export const validateRowData = (row: any): boolean => {
    return fileColumnsValues?.every((field) => {
        return !isEmpty(row?.[field]) && !_.isBoolean(row?.[field])
    })
}

export const validateDataByFieldName = (row: any, fieldName: string, handler: (value: any) => boolean): boolean => {
    return fileColumnsValues?.every((field) => field !== fieldName ? true : handler(row?.[field]))
}