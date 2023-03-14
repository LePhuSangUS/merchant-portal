import { format, translate } from "@/utils";
import { parseCurrencyToIntNumber, parseNumberToCurrency } from "@/utils/parse";
import { Form, Input } from "antd";
import { FC } from "react";

interface FormAmountProps {
    minAmount?: number;
    maxAmount?: number;
    rules?: any[];
    isReplaceRules?: boolean;
    disabled?: boolean;
    [key: string]: any
}

const FormAmount: FC<FormAmountProps> = ({
    minAmount = 0,
    maxAmount = 9999999999,
    rules = [],
    isReplaceRules = false,
    name,
    disabled = false,
    messageMaxAmount,
    ...props
}) => {
    const localRules = [
        () => ({
            validator(_: any, value: any) {
                const amount = parseCurrencyToIntNumber(value)
                if (!amount || (amount && amount < minAmount)) {
                    return Promise.reject(new Error(translate('form.message.amount.min', '', { minAmount: format.currency(minAmount) })))
                }
                if (amount && maxAmount && amount > maxAmount) {
                    return Promise.reject(new Error(messageMaxAmount||translate('form.message.amount.max', '', { maxAmount: format.currency(maxAmount) })))
                }
                return Promise.resolve();
            },
        })
    ]
    const composdRules = isReplaceRules ? [...rules] : [...localRules, ...rules]
    const handleNormalizeAmount = (value: any, prevValue: any, prevValues: any) => {
        // parser
        const parserValue = parseCurrencyToIntNumber(value)
        const hasNotNumber = /[^0-9]/g.test(`${parserValue}`)
        // formatter
        const formatterValue = parseNumberToCurrency(parserValue)
        return hasNotNumber ? prevValue || '' : formatterValue
    }

    return (
        <Form.Item
            label={translate('balance.field.amount')}
            name="amount"
            rules={composdRules}
            normalize={handleNormalizeAmount}
            {...props}
        >
            <Input
                placeholder={translate('balance.placeholder.amount', `Số tiền tối thiểu ${format.currency(minAmount)}`, { minValue: format.currency(minAmount) })}
                maxLength={13}
                disabled={disabled}
            />
        </Form.Item>
    )
}

export default FormAmount