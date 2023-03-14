import React, { useEffect, useState } from "react";
import {
    FormDatePicker,
    FormSelect,
    FormText,
    Icons,
} from '@/components';
import _ from "lodash"
import style from './EKycField.less'


const FORMAT_DATE_DISPLAY = 'DD/MM/YYYY'

const { CheckCircleOutlined, ExclamationCircleOutlined } = Icons;

const STATUS_ICON = {
    success: <CheckCircleOutlined className="ekyc-field--icon" style={{ color: '#389e0d' }} />,
    warning: <ExclamationCircleOutlined className="ekyc-field--icon" style={{ color: '#faad14' }} />
}

const EKycField: React.FC<any> = (props: any) => {
    const { defaultValue, getDataField, onChange, type, setFieldsValue, isEdited: edited, ...rest } = props;
    const [isEdited, setIsEdited] = useState<boolean>(false);

    useEffect(() => {
        setIsEdited(edited)
    }, [edited])

    const dataField = _.isFunction(getDataField) ? getDataField() : {}
    const status: string = dataField?.trust && !isEdited ? 'success' : 'warning'

    let Comp
    const extraProps: Record<string, any> = {}
    switch (type) {
        case 'text':
            Comp = FormText
            break;
        case 'select':
            Comp = FormSelect
            break;
        case 'date':
            Comp = FormDatePicker
            extraProps.fieldProps = {
                format: FORMAT_DATE_DISPLAY
            }
            break;

        default:
            Comp = FormText
            break;
    }

    return (
        <div className={style['ekyc-field']}>
            <Comp
                {...rest}
                fieldProps={{
                    onChange(e) {
                        const val = e?.target?.value || e
                        onChange?.(val)
                        if (!isEdited) setIsEdited(true)
                    },
                    ...rest?.fieldProps,
                    ...extraProps?.fieldProps
                }}
            />
            {
                STATUS_ICON[status]
            }
        </div>
    )
}

export default EKycField