import { FormText, Status } from "@/components";
import { curry } from "./curry";
import { translate } from "./language";
import { parseValue } from "./parse";
import type { Moment } from "moment";
import * as format from "./format";

export const renderStatusOrigin = curry((replacement: string, options: any[], value: string) => value ? <Status value={value} options={options} /> : replacement);
export const renderStatus = renderStatusOrigin('-');
export const renderStatusNoReplacement = renderStatusOrigin('');

export const renderFormTextItem = (fieldName: string, handleValue?: (value: any) => void) => (item: any, config: any, form: any) => (
    <FormText
        placeholder={translate('form.placeholder.pleaseEnter')}
        fieldProps={{
            onBlur: (e: any) => {
                const value = e?.target?.value
                if (value) {
                    const trimValue = value?.trim?.()
                    form?.setFieldsValue({ [fieldName]: handleValue ? handleValue?.(trimValue) : trimValue })
                }
            },
        }}
    />
);

const renderField = (val: any, type?: string) => {
    if (val === 0) return 0;
    if (!val) return '-';
    return parseValue(type ? format[type]?.(val) : val);
}
export const renderFieldWrapper = (dom: React.ReactNode) => <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{dom}</div>;
export const renderCurrency = (val: React.ReactText) => renderField(val, 'currency');
export const renderDatetimes = (val: string | Moment) => renderField(val, 'datetimes');
export const renderDate = (val: string | Moment) => renderField(val, 'date');