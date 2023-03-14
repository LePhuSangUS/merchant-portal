export const FILE_COLUMNS = ['requestTransId', 'amount', 'bankAccountName', 'bankSwiftCode', 'bankAccountNumber', 'description', 'bankBranchName']
export const FILE_COLUMNS_TYPES = {
    'requestTransId': 'requestTransId',
    'amount': "amount",
    'bankAccountName': "bankAccountName",
    'bankSwiftCode': "bankSwiftCode",
    'bankAccountNumber': "bankAccountNumber",
    'description': "description",
    'bankBranchName': "bankBranchName",
}
// import { validate as isValidUUID } from 'uuid';
// import { parseCurrencyToIntNumber, parseNumberToCurrency } from "@/utils/parse";
// const minAmount = 50000;
// const maxAmount = 499999999;

// function isPositiveInteger(amount: any) {
//     return Number.isInteger(amount) && amount > 0
// }

export const validateRowData = (row: any) => {
console.log(row)
    for (let key in row) {
        if (!FILE_COLUMNS.includes(key)) {
            return false;
        }
    }

    return true;

}
