import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Container, ProForm, Card, Row, FormText, FormItem, FormSelect, PageLoading } from '@/components';
import { parseOptions, translate, getLanguageKey } from '@/utils';
import { Switch, Upload, Button, Typography, Input, message } from 'antd';
import styles from "./APIUse.less";
import { requiredField,requiredSelect,checkDirectory, checkHostName } from '@/utils/rules';
import { useRequestAPI } from "@/hooks";
import { connect } from "dva";
import { CheckCircleFilled, UploadOutlined, FolderFilled } from '@ant-design/icons';
import { getToken } from '@/utils/storage';

import { disbursementConfigSFTP, getConfigSFTP, checkConfigSFTP } from "@/services/disbursement/api"
import { SFTP_METHOD_CONNECT } from "@/constants/disbursement.constants"
const { Title } = Typography;
import type { UploadProps } from 'antd';
import { env } from "@/env";

const RegistrationSFTP = (props: any) => {
    const formRef = useRef<any>(null);
    const [onOffSFTP, setOnOffSFTP] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleSubmit: any = async (values: any) => {
        setIsProcessing(true)
        const resp = await disbursementConfigSFTP({ ...values,isActive:values?.isActiveSFTP});
        setIsProcessing(false)

        if (resp.success) {
            return message.success(translate("disbursement.SFTP_Registration_Success"));
        }
        else {
            return message.error(resp.message || translate("form.message.error"));

        }

    }
    const handleTest: any = async () => {
        formRef.current.validateFields().then(async (result: any) => {
            setIsProcessing(true)
            
            const resp = await checkConfigSFTP({...result,isActive:result?.isActiveSFTP});
            setIsProcessing(false)

            if (resp.success) {
                return message.success(translate("disbursement.Test_SFTP_Success"));

            }
            else {
                return message.error(resp.message ? translate("disbursement.Test_SFTP_Fail", "", {
                    reason: resp?.data?.errorMessage || resp?.message
                }) : translate("form.message.error"));

            }
        })

    }
    const getHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': getLanguageKey()
    });
    const props1: UploadProps = {
        name: 'file',
        maxCount: 1,
        multiple: false,
        accept: ".pem",
        action: `${env.FILE_API_URL}/disbursement/sftp/upload`,
        headers: getHeaders(),


        onChange(info) {
            const { status } = info.file;
            console.log(info.file)

            if (status !== 'uploading') {

            }
            if (status === 'done') {
                const fileNameUpload = info?.file?.response?.data?.filename;
                formRef?.current?.setFieldValue("privateKeyFileName", fileNameUpload)
                formRef?.current?.validateFields(["privateKeyFileName"])
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }

            if (status === "removed") {

            }
        },
    }
    const { isLoading }: any = useRequestAPI({
        requestFn: getConfigSFTP,
        internalCall: true,
        handleSuccess: (resp) => {
            const dataResp = resp?.data;
            formRef?.current?.setFieldsValue({
                ...dataResp,
                isActiveSFTP:dataResp.isActive
            })
            setOnOffSFTP(dataResp?.isActive)
        },
    });

    return (<div className={styles.component} >
        <PageLoading active={isProcessing || isLoading} />
        <ProForm
            key='CreateForm'
            layout="horizontal"
            labelAlign='left'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
                width: "100%",
            }}
            onFinish={handleSubmit}
            syncToInitialValues={true}
            formRef={formRef}
            submitter={{
                render: () => (
                    <Row justify="center">
                        <Button
                            onClick={handleTest}
                            disabled={!onOffSFTP}
                            style={{ marginRight: "50px" }}>{translate("disbursement.Check_Connection")}</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            {translate('form.button.save')}
                        </Button>
                    </Row>
                ),
            }}
        >
            <div className={styles.formContent}>
                <Title level={4}>{translate("disbursement.SFTP_Registration_Title")}</Title>
                <FormItem
                    shouldUpdate
                    name="isActiveSFTP"
                    label={translate("disbursement.Recive_SFTP")}
                >
                    <Switch
                        checked={formRef?.current?.getFieldValue('isActiveSFTP')}
                        onChange={(checked: any) => {
                            console.log(checked)
                            setOnOffSFTP(checked);
                            if (!checked) {
                                formRef.current.resetFields();
                            }
                        }}
                    />
                </FormItem>
                <FormItem shouldUpdate noStyle>
                    {(form: any) => (formRef?.current?.getFieldValue('isActiveSFTP') && <Fragment>
                        <FormItem
                            name="host"
                            label={translate("disbursement.Host_Name")}
                            rules={[
                                requiredField, {
                                max: 50,
                                message: translate("form.message.field.max", "", { max: 50 })
                            },...checkHostName()]}
                        >
                            <Input
                                placeholder={translate('form.placeholder.pleaseEnter')}
                            />
                        </FormItem>
                        <FormText
                            name="port"
                            label={translate("disbursement.Port_Number")}
                            rules={[
                                requiredField,
                                {
                                    max: 50,
                                    message: translate("form.message.field.max", "", { max: 50 })
                                },
                                {
                                    pattern: /^\d+$/,
                                    message: translate("disbursement.Contains_Only_Numbers")

                                }
                            ]}
                            placeholder={translate('form.placeholder.pleaseEnter')}

                        >

                        </FormText>
                        <FormItem
                            name="directory"
                            label={translate("disbursement.Directory_Path")}
                            rules={[
                                requiredField,
                                {
                                    max: 255,
                                    message: translate("form.message.field.max", "", { max: 255 })
                                },
                                ...checkDirectory()
                            
                            ]}
                        >
                            <Input
                                placeholder={translate('form.placeholder.pleaseEnter')}
                            />
                        </FormItem>
                        <FormItem
                            name="username"
                            label={translate("disbursement.Account")}
                            rules={[requiredField,
                                {
                                    max: 150,
                                    message: translate("form.message.field.max", "", { max: 150 })
                                }]}
                        >
                            <Input
                                placeholder={translate('form.placeholder.pleaseEnter')}
                            />
                        </FormItem>
                        <FormSelect
                            name="connectType"
                            options={parseOptions(SFTP_METHOD_CONNECT)}
                            label={translate("disbursement.Connect_Method")}
                            rules={[requiredSelect]}
                        />

                        <FormItem shouldUpdate noStyle>
                            {(form: any) => (
                                <>
                                    {formRef?.current?.getFieldValue('connectType') === 'ACCOUNT' &&
                                        <Fragment>

                                            <FormItem
                                                name="password"
                                                label={translate("disbursement.Password")}
                                                rules={[requiredField]}
                                            >
                                                <Input.Password
                                                    autoComplete="new-password"
                                                    placeholder={translate('form.placeholder.pleaseEnter')}
                                                />
                                            </FormItem>
                                        </Fragment>
                                    }
                                    {formRef?.current?.getFieldValue('connectType') === 'KEYPAIR' &&
                                        <Fragment>
                                            <FormItem       
                                                shouldUpdate
                                                name="privateKeyFileName"
                                                label={translate("disbursement.Private_Key_API")}
                                                rules={[requiredField]}
                                            >
                                                <Input   value={formRef?.current?.getFieldValue('privateKeyFileName')}
                                                    
                                                     placeholder={translate('form.placeholder.pleaseSelect')}
                                                    
                                                    
                                                    addonAfter={<Upload {...props1} itemRender={() => null}>
                                                    <Button type="primary" size="small" icon={<FolderFilled />}></Button>
                                                </Upload>} />
                                                <p className={styles.supportFile}>({translate("disbursement.Support_File")})</p>
                                            </FormItem>
                                            <FormItem
                                                shouldUpdate
                                                name="passphrase"

                                                label={translate("disbursement.Passphrase")}
                                                rules={[requiredField]}
                                            >
                                                <Input.Password

                                                    autoComplete="new-password"

                                                    placeholder={translate('form.placeholder.pleaseEnter')}
                                                />
                                            </FormItem>
                                        </Fragment>
                                    }    </>
                            )}
                        </FormItem>
                    </Fragment>
                    )}
                </FormItem>


            </div>




        </ProForm>
    </div>
    )
}
export default connect((props: any) => ({
    ...props,
}))(RegistrationSFTP);
