import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Container, ProForm, Card, Row, FormText, FormItem, FormSelect, PageLoading } from '@/components';
import { parseOptions, translate, getLanguageKey } from '@/utils';
import { Switch, Upload, Button, Typography, Input, message } from 'antd';
import styles from "./RegistrationSFTP.less";
import { requiredField, requiredWithMessage,requiredSelect, checkDirectory, checkHostName } from '@/utils/rules';
import { useRequestAPI } from "@/hooks";
import { connect } from "dva";
import {  FolderFilled } from '@ant-design/icons';
import { getToken } from '@/utils/storage';

import { paymentsConfigSFTP, getConfigSFTP, checkConfigSFTP } from "@/services/pg-config/api"
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
        const resp = await paymentsConfigSFTP({ ...values, isActive: values?.isActiveSFTP });
        setIsProcessing(false)

        if (resp.success) {
            return message.success(translate("Message: success"));
        }
        else {
            return message.error(resp.message || translate("Message: An error occurred"));

        }

    }
    const handleTest: any = async () => {
        formRef.current.validateFields().then(async (result: any) => {
            setIsProcessing(true)

            const resp = await checkConfigSFTP({ ...result, isActive: result?.isActiveSFTP });
            setIsProcessing(false)

            if (resp.success) {
                return message.success(translate("Message: Successful connection"));

            }
            else {
                return message.error(resp.message ? translate("Message: Failed connection. Reason {reason}", "", {
                    reason: resp?.data?.errorMessage || resp?.message
                }) : translate("Message: An error occurred"));

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
        action: `${env.FILE_API_URL}/payment/sftp/upload`,
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
                isActiveSFTP: dataResp.isActive
            })
            setOnOffSFTP(dataResp?.isActive)
        },
    });

    return (<Card className={styles.component} >
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
                            style={{ marginRight: "50px" }}>{translate("Check connection")}</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            {translate('Save')}
                        </Button>
                    </Row>
                ),
            }}
        >
            <div className={styles.formContent}>
                <Title level={4}>{translate("Register to receive payment gateway service reconcile results via SFTP")}</Title>
                <FormItem
                    shouldUpdate
                    name="isActiveSFTP"
                    label={translate("Receive reconcile files via SFTP")}
                >
                    <Switch
                        checked={formRef?.current?.getFieldValue('isActiveSFTP')}
                        onChange={(checked: any) => {
                            setOnOffSFTP(checked);
                        }}
                    />
                </FormItem>
                <FormItem shouldUpdate noStyle>
                    {(form: any) => (formRef?.current?.getFieldValue('isActiveSFTP') && <Fragment>
                        <FormItem
                            name="host"
                            label={translate("Host name")}
                            rules={[
                                requiredWithMessage(translate("Validation: Please enter {name}","",{name:translate("Host name")})),
                                {
                                    max: 50,
                                    message: translate("Validation: {name} maximum {max} character", "", {
                                        name: translate("Host name"),
                                        max: 50
                                    })
                                },
                                ...checkHostName()
                            ]}
                        >
                            <Input
                                placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Host name") })}
                            />
                        </FormItem>
                        <FormText
                            name="port"
                            label={translate("Port number")}
                            rules={[
                                requiredWithMessage(translate("Validation: Please enter {name}","",{name:translate("Port number")})),
                                {
                                    max: 50,
                                    message: translate("Validation: {name} maximum {max} character", "", {
                                        name: translate("Port number"),
                                        max: 50
                                    })
                                },
                                {
                                    pattern: /^\d+$/,
                                    message: translate("Validation: {name} contains only numbers","",{name:translate("Port number")})

                                }
                            ]}
                            placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Port number") })}

                        >

                        </FormText>
                        <FormItem
                            name="directory"
                            label={translate("Directory path")}
                            rules={[
                                requiredWithMessage(translate("Validation: Please enter {name}","",{name:translate("Directory path")})),
                                {
                                    max: 255,
                                    message: translate("Validation: {name} maximum {max} character", "", {
                                        name: translate("Directory path"),
                                        max: 255
                                    })
                                },
                                ...checkDirectory()

                            ]}
                        >
                            <Input
                                placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Directory path") })}
                            />
                        </FormItem>
                        <FormItem
                            name="username"
                            label={translate("Account")}
                            rules={[
                                requiredWithMessage(translate("Validation: Please enter {name}","",{name:translate("Account")})),
                                {
                                    max: 150,
                                    message: translate("Validation: {name} maximum {max} character", "", {
                                        name: translate("Account"),
                                        max: 150
                                    })
                                }]}
                        >
                            <Input
                                placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Account") })}
                            />
                        </FormItem>
                        <FormSelect
                            name="connectType"
                            options={parseOptions(SFTP_METHOD_CONNECT)}
                            label={translate("Connection method")}
                            rules={[
                                requiredWithMessage(translate("Validation: Please select {name}","",{name:translate("Connection method")})),

                            ]}
                        />

                        <FormItem shouldUpdate noStyle>
                            {(form: any) => (
                                <>
                                    {formRef?.current?.getFieldValue('connectType') === 'ACCOUNT' &&
                                        <Fragment>

                                            <FormItem
                                                name="password"
                                                label={translate("Password")}
                                                rules={[
                                                    requiredWithMessage(translate("Validation: Please enter {name}","",{name:translate("Password")})),
                                                ]}
                                            >
                                                <Input.Password
                                                    autoComplete="new-password"
                                                    placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Password") })}
                                                />
                                            </FormItem>
                                        </Fragment>
                                    }
                                    {formRef?.current?.getFieldValue('connectType') === 'KEYPAIR' &&
                                        <Fragment>
                                            <FormItem
                                                shouldUpdate
                                                name="privateKeyFileName"
                                                label={translate("Private key file")}
                                                rules={[
                                                    requiredWithMessage(translate("Validation: Please select {name}", "", { name: translate("Private key file") })),
                                            ]}
                                            >
                                                <Input value={formRef?.current?.getFieldValue('privateKeyFileName')}
                                                    placeholder={translate('Placeholder: Enter {name}', "", { name: translate("Private key file") })}
                                                    addonAfter={<Upload {...props1} itemRender={() => null}>
                                                        <Button type="primary" size="small" icon={<FolderFilled />}></Button>
                                                    </Upload>} />
                                                <p className={styles.supportFile}>({translate("Only support file {name}", "",{name: ".pem"})})</p>
                                            </FormItem>
                                            <FormItem
                                                shouldUpdate
                                                name="passphrase"
                                                label={translate("Passphrase")}
                                                rules={[
                                                    requiredWithMessage(translate("Validation: Please select {name}", "", { name: translate("Passphrase") })),

                                                ]}
                                            >
                                                <Input.Password
                                                    autoComplete="new-password"
                                                    placeholder={translate('Placeholder: Enter {name}', "", { name: translate("passphrase") })}
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
    </Card>
    )
}
export default connect((props: any) => ({
    ...props,
}))(RegistrationSFTP);
