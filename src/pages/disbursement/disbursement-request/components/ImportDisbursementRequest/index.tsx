import React, { Fragment, useEffect, useState } from 'react'
import { Upload, Modal as AntModal, Space } from 'antd';
import { CheckCircleFilled, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import classNames from 'classnames';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import type { ModalFormProps } from '@ant-design/pro-form';
import { useExport, useGetSysConfig } from '@/hooks';
import { create_UUID } from '@/utils/utils';
import { Button, Modal, Form, FormItem, Dragger } from '@/components'
import { translate, message, parseValue } from '@/utils'
import { trim } from '@/utils/curry';
import { isMeaninglessMessage } from '@/utils/utils';
import { validateRowData, FILE_COLUMNS } from './handler';
import style from './index.less';
import _ from "lodash"
import { exportTemplate, importImportDisbursementRequest } from '@/services/disbursement/api';
const { warning } = AntModal;

const MAX_SIZE_IMPORT = 10 //MB
const IMPORT_ACCEPT_TYPE = '.xls,.xlsx'
const LENGTH_SPREAD_ARRAY = 50000
const LENGTH_IMPORT = 1000
const ERRORS = {
    WRONG_COLUMN: 'Disbursement_Request.lineError',
}
const ERROR_TYPE = {
    WRONG_COLUMN: 'WRONG_COLUMN'
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
    const templateFile = useGetSysConfig('TEMPLATE_FILE')
    const hasExcelData = excelData.length > 0;
    const isRenderData = hasExcelData && canImport && !isProcessing;

    const showWarning = (msg: string, key?: string) => {
        warning({
            title: <div>{parseValue({ vi: 'Thông báo', en: 'Notice' })}</div>,
            icon: null,
            content: <div>{msg}</div>,
            okText: translate("Disbursement_Request.Understand"),
            className: 'neo-confirm-modal',
            onOk: () => {
                if (!error) {
                    setTimeout(() => {
                        props?.reloadList?.();
                        if (key === "SUCCESS") {
                            props?.onCancel();
                        }
                    }, 500)
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
                const requestId = create_UUID();
                setIsImporting(true)
                if (data.length > LENGTH_IMPORT) {
                    setIsImporting(true);
                    for (let i = 0; i < data.length; i += LENGTH_IMPORT) {
                        resp = await importImportDisbursementRequest({
                            requestId,
                            transactions: data.slice(i, i + LENGTH_IMPORT)
                        })
                        if (!resp?.success) break
                    }
                    setIsImporting(false)
                } else {
                    setIsImporting(true);

                    resp = await importImportDisbursementRequest({
                        requestId,
                        transactions: data
                    })
                    setIsImporting(false)

                }
                if (resp?.success) {
                    showWarning(translate('Disbursement_Request.Import_Success'), "SUCCESS");
                } else {
                    showWarning(resp?.message || translate('Disbursement_Request.Get_List_Failed'));

                }
            } catch (err) {
                message.error(translate('Disbursement_Request.Get_List_Failed'))
                console.error('Import data error:', err)
            }
        }
    }

    const handleDataBeforeImport = (data: ObjectType[]) => {
        const newData = [];
        const errors: any = [];

        for (let i = 0; i < data?.length; i++) {
            const row:any = data[i];
            let rowString : any = {};
            for (let key in row) {
                const dataKey = `${row?.[key]}`?.trim();
                rowString[key] = dataKey;
            }
            const newRow = {
                requestTransId:rowString?.requestTransId ?`${row?.requestTransId}`: create_UUID(),
                amount: (rowString?.amount && parseInt(row?.amount)) ? parseInt(row?.amount) : "",
                bankAccountName: rowString?.bankAccountName || "",
                bankSwiftCode: rowString?.bankSwiftCode || "",
                bankAccountNumber: rowString?.bankAccountNumber || "",
                description: rowString?.description || "NeoX chi ho",
                bankBranchName: rowString?.bankBranchName || ""
            }
            newData.push({ ...newRow })




        }
        if (errors.length > 0)
            setRowError(errors);
        return newData;
    }

    const handleFile = (file: RcFile | undefined) => {
        if (!file) return
        clearDataAndError()
        setIsProcessing(true)
        const reader = new FileReader();
        reader.onload = (e) => {
            const ab = e?.target?.result;
            const wb = XLSX.read(ab);
            const excelArr = XLSX.utils.sheet_to_json<ObjectType>(wb.Sheets[wb.SheetNames[0]], { header: FILE_COLUMNS });
            const header: ObjectType = excelArr.shift() || {};
            let newData: any;
            if (excelArr.length > LENGTH_SPREAD_ARRAY) {
                for (let i = 0; i < excelArr.length; i += LENGTH_SPREAD_ARRAY) {
                    const sliced = excelArr.slice(i, i + LENGTH_SPREAD_ARRAY)
                    const handled = handleDataBeforeImport(sliced)
                    newData = !newData ? handled : [...newData, ...handled]
                }
            } else {
                newData = handleDataBeforeImport(excelArr)
            }
            setIsProcessing(false)
            setData(newData);
            console.log(header)
            setExcelHeader(Object.values({
                requestTransId: "MerchantTransaction ID",
                amount: "Amount",
                bankAccountName: "Receiver",
                bankSwiftCode: "Bank ID",
                bankAccountNumber: "Bank Account Number",
                description: "Description",
                bankBranchName: "Bank Branch Name",

            }));

            setExcelData(newData);

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
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess?.("ok")
            }, 0)
        },
        onChange(info) {
            const { status } = info.file;
            setIsProcessing(true)

            if (status !== 'uploading') {

            }
            if (status === 'done') {
                handleFile(info.file.originFileObj)
                setIsProcessing(false);

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }

            if (status === "removed") {
                clearDataAndError()
                setIsProcessing(false);

            }
        },
        async onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
            handleBeforeUpload(e.dataTransfer.files[0])

        },
        beforeUpload: async (file: RcFile, fileList: RcFile[]) => {
            return await handleBeforeUpload(file)
        }
    }

    return (
        <Modal
            {...props}
            closable={true}
            maskClosable={false}
            footer={null}
            style={{
                minWidth: "800px",
                oveflow: "auto"
            }}
            title={parseValue({ vi: 'Tạo yêu cầu chi hộ', en: 'Create Disbursement Request' })}
        >
            <Form
                name="import-excel"
                labelCol={{ span: 7 }}
                labelAlign="left"
                wrapperCol={{ span: 14 }}
                initialValues={{}}
                onFinish={onFinish}
                autoComplete="off"
                // style={{ marginTop: '20px' }}
                requiredMark={false}
            >

                <div style={{ textAlign: 'center', marginBottom: 20 }}><Button onClick={() => {
                    const fileName = templateFile?.find((item) => item?.key === "DISBURSEMENT_REQUEST")?.value || "KEY_NOT_FOUND"
                    exportTemplate({
                        fileName
                    })

                }}>{translate('form.field.downloadTemplate')}</Button></div>
                {/* <DragDropFile handleFile={handleFile} /> */}

                {
                    !isRenderData ?
                        <Fragment>
                            <Dragger {...props1} disabled={isImporting} itemRender={() => null}>
                                <p className={classNames('ant-upload-drag-icon', style['import-modal__upload-text'])}>
                                    <UploadOutlined /> <span>{translate('form.field.uploadFile')}</span>
                                </p>
                            </Dragger>

                            {/* {error && <div style={{ color: 'red', marginTop: 15 }}>{error}</div>} */}
                            {isProcessing && <div style={{ color: 'blue', marginTop: 15, textAlign: 'center' }}>{translate('guarantee-account-transaction.text.processingData')}</div>}
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
                    hasExcelData &&
                    <FormItem style={{ textAlign: 'right', marginTop: '15px' }} wrapperCol={{ span: 24 }}>
                        <Space size={15}>
                            <Upload {...props1} disabled={isImporting} itemRender={() => null}>
                                <Button type="secondary" icon={<UploadOutlined />}>
                                    {parseValue({ vi: 'Up lại file', en: 'Re-up file' })}
                                </Button>
                            </Upload>
                            <Button type="secondary" htmlType="submit" icon={<CheckCircleFilled />} disabled={(!canImport && !isProcessing) || isImporting} >
                                {parseValue({ vi: 'Gửi yêu cầu', en: 'Send request' })}
                            </Button>
                        </Space>
                    </FormItem>
                }
            </Form>
        </Modal>
    )
}

export default ImportVirtualAccount