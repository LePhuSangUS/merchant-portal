import React, { Fragment, useEffect, useState } from 'react'
import { Upload, Modal as AntModal, Space } from 'antd';
import { CheckCircleFilled, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import classNames from 'classnames';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import type { ModalFormProps } from '@ant-design/pro-form';
import _ from 'lodash';

import { Button, Modal, Form, FormItem, Dragger } from '@/components'
import { translate, message, parseValue } from '@/utils'
import { trim } from '@/utils/curry';
import { isMeaninglessMessage, nonAccentVietnamese } from '@/utils/utils';
import { exportImportVirtualAccountTemplate, importImportVirtualAccounts } from '@/services/collection-service/api';

import { validateRowData, FILE_COLUMNS, fileColumnsValues, validateDataByFieldName } from './handler';
import style from './index.less';

const { warning } = AntModal;

const MAX_SIZE_IMPORT = 10 //MB
const IMPORT_ACCEPT_TYPE = '.xls,.xlsx'
const LENGTH_SPREAD_ARRAY = 50000
const LENGTH_IMPORT = 1000
const ERRORS = {
    WRONG_COLUMN: 'collection-service.message.createVirtualAccount.lineError',
    WRONG_ACCOUNT_NAME: 'collection-service.message.createVirtualAccount.accountNameError',
}
const ERROR_TYPE = {
    WRONG_COLUMN: 'WRONG_COLUMN',
    WRONG_ACCOUNT_NAME: 'WRONG_ACCOUNT_NAME'
}

const ImportVirtualAccount: React.FC<ModalFormProps & ObjectType> = (props) => {
    const [data, setData] = useState<any>();
    const [error, setError] = useState<string>();
    const [popupError, setPopupError] = useState<string>();
    const [rowError, setRowError] = useState<number[]>([]);
    const [canImport, setCanImport] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [typeError, setTypeError] = useState<string>();
    const [excelData, setExcelData] = useState<ObjectType[]>([]);
    const [excelHeader, setExcelHeader] = useState<string[]>([]);

    const hasExcelData = excelData.length > 0;
    const isRenderData = hasExcelData && canImport && !isProcessing;

    const showWarning = (msg: string) => {
        warning({
            title: <div>{parseValue({ vi: 'Thông báo', en: 'Notice' })}</div>,
            icon: null,
            content: <div className={style['line-clamp-notice']}>{msg}</div>,
            className: 'neo-confirm-modal',
            onOk: () => {
                if (!error) {
                    setTimeout(() => {
                        props?.reloadList?.()
                    }, 2000)
                }
            }
        })
    }

    useEffect(() => {
        if (!!data)
            setCanImport(!error && !popupError)
        else
            setCanImport(false)
    }, [error, data, popupError])

    useEffect(() => {
        if (rowError.length > 0 && typeError)
            setPopupError(translate(ERRORS[typeError], '', { row: rowError.join(', ') }))
    }, [rowError])

    useEffect(() => {
        if (popupError)
            showWarning(popupError)
    }, [popupError])

    const clearDataAndError = () => {
        setData(undefined)
        setError('')
        setPopupError('')
    }

    const onFinish = async () => {
        if (!error && canImport) {
            try {
                let resp;
                if (data.length > LENGTH_IMPORT) {
                    setIsImporting(true)
                    for (let i = 0; i < data.length; i += LENGTH_IMPORT) {
                        resp = await importImportVirtualAccounts({ virtualAccounts: data.slice(i, i + LENGTH_IMPORT) })
                        if (!resp?.success) break
                    }
                    setIsImporting(false)
                } else {
                    resp = await importImportVirtualAccounts({ virtualAccounts: data })
                }

                if (!resp?.success) {
                    message.error(isMeaninglessMessage(resp?.message) ? translate('guarantee-account-transaction.message.importFailed') : resp?.message)
                } else {
                    if (resp?.data?.status === 'FAILED') {
                        const respMessage: string = resp?.data?.message || '';
                        const isMatchedErr = !!respMessage?.match("ERROR_DUPLICATE")?.[0];
                        showWarning(translate('collection-service.message.createVirtualAccount.lineError', '', { row: isMatchedErr ? respMessage.replace('ERROR_DUPLICATE', '') : '' }));
                    } else {
                        showWarning(translate('collection-service.message.createVirtualAccount.createSubmit'));
                        props?.onCancel()
                    }
                }
            } catch (err) {
                message.error(translate('guarantee-account-transaction.message.importFailed'))
                console.error('Import data error:', err)
            }
        }
    }

    const validateSpecialCharacter = (text: string): boolean => {
        const regex = /[^a-zA-Z\s]/g;
        return !regex.test(nonAccentVietnamese(text));
    }

    const parseNumberToString = (number: number): string => _.isNumber(number) ? number.toString() : number

    const handleDataBeforeImport = (rowData: ObjectType[]) => {
        const newData = [];
        const errors = [];

        for (let i = 0; i < rowData?.length; i++) {
            const row = rowData[i];
            const lineOrder = i + 1;

            // check wrong data
            if (!validateRowData(row)) {
                errors.push(lineOrder);
                setTypeError(ERROR_TYPE.WRONG_COLUMN);
                continue;
            }
            // check wrong account name
            if (!validateDataByFieldName(row, FILE_COLUMNS.ACCOUNT_NAME, validateSpecialCharacter)) {
                errors.push(lineOrder);
                setTypeError(ERROR_TYPE.WRONG_ACCOUNT_NAME);
                continue;
            }

            newData.push({
                ...fileColumnsValues?.reduce((res, item) => ({
                    ...res, ...({ [item]: parseNumberToString(row[item]) })
                }), {})
            })
        }
        if (errors.length > 0)
            setRowError(errors);
        return newData;
    }

    const handleExcelData = (row: ObjectType) => {
        const result = {
            ...row,
            [FILE_COLUMNS.ACCOUNT_NAME]: nonAccentVietnamese(row[FILE_COLUMNS.ACCOUNT_NAME]).toUpperCase()
        }

        return result;
    }

    const handleFile = (file: RcFile | undefined) => {
        if (!file) return
        clearDataAndError()
        setIsProcessing(true)
        const reader = new FileReader();
        reader.onload = (e) => {
            const ab = e?.target?.result;
            const wb = XLSX.read(ab);
            const excelArr = XLSX.utils.sheet_to_json<ObjectType>(wb.Sheets[wb.SheetNames[0]], { header: fileColumnsValues });
            const header: ObjectType = excelArr.shift() || {};
            setExcelHeader(Object.values(header));
            setExcelData(excelArr.map(handleExcelData));
            let newData;
            if (excelArr.length > LENGTH_SPREAD_ARRAY) {
                for (let i = 0; i < excelArr.length; i += LENGTH_SPREAD_ARRAY) {
                    const sliced = excelArr.slice(i, i + LENGTH_SPREAD_ARRAY)
                    const handled = handleDataBeforeImport(sliced)
                    newData = !newData ? handled : [...newData, ...handled]
                }
            } else {
                newData = handleDataBeforeImport(excelArr)
            }
            setIsProcessing(false);
            setData(newData?.map(handleExcelData))
        };
        reader.readAsArrayBuffer(file);
    }

    const handleBeforeUpload = async (file: RcFile | File) => {
        // check accept file type by file extension
        const acceptList = IMPORT_ACCEPT_TYPE?.split(',').map(trim);
        const fileExt = file?.name?.includes('.') ? file?.name?.split('.')?.pop() : undefined
        if (acceptList?.length) {
            const isAcceptedType = acceptList?.includes(`.${fileExt?.toLowerCase()}`);
            if (!isAcceptedType) {
                message.error(translate('message.upload.fileType.error'));
                return Upload.LIST_IGNORE;
            }
        }

        // check file size
        let isExceedSize = false;
        if (MAX_SIZE_IMPORT) {
            isExceedSize = file.size / 1024 / 1024 > MAX_SIZE_IMPORT;
            if (isExceedSize) {
                setError(translate('guarantee-account-transaction.message.importExceedSize', 'Tệp tin vượt quá dụng lượng cho phép (>10MB)', { maxSize: MAX_SIZE_IMPORT }))
                return Upload.LIST_IGNORE;
            }
        }

        return file;
    }

    const props1: UploadProps = {
        name: 'file',
        maxCount: 1,
        multiple: true,
        accept: IMPORT_ACCEPT_TYPE,
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                onSuccess?.("ok")
            }, 0)
        },
        onChange(info) {
            const { status } = info.file;

            if (status !== 'uploading') {
            }
            if (status === 'done') {
                handleFile(info.file.originFileObj);

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }

            if (status === "removed") {
                clearDataAndError();
            }
        },
        async onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
            handleBeforeUpload(e.dataTransfer.files[0])

        },
        beforeUpload: async (file: RcFile) => {
            return await handleBeforeUpload(file)
        }
    }

    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            footer={null}
            title={parseValue({ vi: 'Tạo virtual account', en: 'Create virtual account' })}
        >
            <Form
                name="import-excel"
                labelCol={{ span: 7 }}
                labelAlign="left"
                wrapperCol={{ span: 14 }}
                initialValues={{}}
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
            >

                <div style={{ textAlign: 'center', marginBottom: 20 }}><Button onClick={() => { exportImportVirtualAccountTemplate({}) }}>{translate('form.field.downloadTemplate')}</Button></div>
                {
                    !isRenderData ?
                        <Fragment>
                            <Dragger {...props1} disabled={isImporting} itemRender={() => null}>
                                <p className={classNames('ant-upload-drag-icon', style['import-modal__upload-text'])}>
                                    <UploadOutlined /> <span>{translate('form.field.uploadFile')}</span>
                                </p>
                            </Dragger>

                            {error && <div style={{ color: 'red', marginTop: 15 }}>{error}</div>}
                            {isProcessing && <div style={{ color: 'blue', marginTop: 15, textAlign: 'center' }}>{parseValue({ vi: 'Đang xử lý dữ liệu', en: 'Processing data' })}</div>}
                        </Fragment>
                        :
                        <table className={style['import-modal__excel-table']}>
                            <thead>
                                {
                                    excelHeader?.map((item: string, index: number) => <th key={item + index.toString()}>{item}</th>)
                                }
                            </thead>
                            <tbody>
                                { /* generate row for each president */
                                    excelData.map((excelItem: ObjectType, index: number) => {
                                        const mapKey = `${excelItem[0]}-${index}`;
                                        return (<tr key={mapKey}>
                                            {Object.values(excelItem)?.map((val, idx: number) => <td key={mapKey + idx.toString()}>{val}</td>)}
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                }

                {
                    isRenderData &&
                    <FormItem style={{ textAlign: 'right', marginTop: '15px' }} wrapperCol={{ span: 24 }}>
                        <Space size={15}>
                            <Upload {...props1} disabled={isImporting} itemRender={() => null}>
                                <Button type="secondary" icon={<UploadOutlined />}>
                                    {parseValue({ vi: 'Up lại file', en: 'Re-up file' })}
                                </Button>
                            </Upload>
                            <Button type="secondary" htmlType="submit" icon={<CheckCircleFilled />} disabled={!canImport && !isProcessing} loading={isImporting}>
                                {parseValue({ vi: 'Tạo', en: 'Create' })}
                            </Button>
                        </Space>
                    </FormItem>
                }
            </Form>
        </Modal>
    )
}

export default ImportVirtualAccount