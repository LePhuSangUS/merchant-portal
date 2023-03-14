import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Switch, Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { connect } from "dva";
//src
import { FormSelect, Row, Space, Title } from '@/components';
import { parseOptions, translate, message } from '@/utils';
import styles from "./index.less";
import { checkMaxLength, rejectOnlySpace, requiredField, requiredSelect } from '@/utils/rules';
import { COLLECTION_SFTP_CONNECTION_TYPE } from '@/constants/collection-service.constant';
import PrivateKeyFileUpload from './PrivateKeyFileUpload';
import { checkSFTPConnection } from '@/services/collection-service/api';
import _ from 'lodash';

const SFTPRegister = (props: ObjectType) => {
    const { data, dispatch } = props;
    const formRef = useRef<FormInstance>(null);
    const [sftpConfigData, setSftpConfigData] = useState<ObjectType>({});
    const [checkingConnection, setCheckingConnection] = useState<boolean>(false);

    const onFinish = (values: ObjectType) => {
        let params = {...values};
        if(!values?.revReconcileSFTP) {
            params = {...data, ...values};
        }
        
        dispatch({ type: 'collectionService/saveSFTPConfig', payload: params });
        return Promise.resolve(true);
    }

    useEffect(() => {
        if (_.isEmpty(data))
            formRef?.current?.resetFields();
        else
            formRef?.current?.setFieldsValue({ ...data, port: data?.port?.toString?.() });
        setSftpConfigData(data);
    }, [data, formRef]);

    const isKeypair = (connectType: string) => connectType === 'KEYPAIR';
    const isAccount = (connectType: string) => connectType === 'ACCOUNT';

    const handleCheckSFTPConnection = async (sftpConfig: ObjectType) => {
        try {
            setCheckingConnection(true);
            const resp = await checkSFTPConnection(_.omitBy({ ...sftpConfig, isActive: sftpConfig?.revReconcileSFTP }, item => item === null));
            if (resp.success) {
                message.success(translate("collection-service.message.Test_SFTP_Success"));
            } else {
                message.error(translate("collection-service.message.Test_SFTP_Fail", "", {
                    reason: resp?.data?.errorMessage || resp?.message
                }));
            }
            setCheckingConnection(false);
        } catch (error) {
            setCheckingConnection(false);
            console.log('CheckSFTPConnection ERROR:', error);
            message.error(translate("form.message.error"));
        }

    }

    return (
        <div className={styles.component} >
            <Form
                layout="horizontal"
                style={{ width: "100%", }}
                onFinish={onFinish}
                ref={formRef}
                autoComplete={'off'}
                onValuesChange={(value, allValues) => {
                    setSftpConfigData(allValues)
                }}
            >
                <div className={styles.formContent}>
                    <Title level={4}>{translate("collection-service.sftp-register.title")}</Title>
                    <div className="active-block">
                        <Form.Item name="revReconcileSFTP" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <span style={{ marginLeft: 5 }}>{translate("collection-service.sftp-register.field.switchButtonLabel")}</span>
                    </div>
                    <Form.Item noStyle shouldUpdate={(prevVal: ObjectType, currVal: ObjectType) => prevVal?.revReconcileSFTP !== currVal?.revReconcileSFTP}>
                        {
                            ({ getFieldValue }) => (
                                getFieldValue('revReconcileSFTP') &&
                                <Fragment>
                                    <Form.Item
                                        name="host"
                                        label={translate("collection-service.sftp-register.field.hostName")}
                                        rules={[requiredField, checkMaxLength(50), rejectOnlySpace]}
                                        labelCol={{ span: 7 }}
                                        labelAlign="left"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="port"
                                        label={translate("collection-service.sftp-register.field.portNumber")}
                                        rules={[requiredField, checkMaxLength(50)]}
                                        labelCol={{ span: 7 }}
                                        labelAlign="left"
                                        normalize={value => (value?.replace(/[^0-9]/g, ''))}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="directory"
                                        label={translate("collection-service.sftp-register.field.directoryLocation")}
                                        rules={[requiredField, checkMaxLength(255), rejectOnlySpace]}
                                        labelCol={{ span: 7 }}
                                        labelAlign="left"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <FormSelect
                                        options={parseOptions(COLLECTION_SFTP_CONNECTION_TYPE)}
                                        name="connectType"
                                        label={translate("collection-service.sftp-register.field.connectionMethod")}
                                        rules={[requiredField, checkMaxLength(255), rejectOnlySpace]}
                                        labelCol={{ span: 7 }}
                                        labelAlign="left"
                                        placeholder=""
                                    />
                                    <Form.Item
                                        name="username"
                                        label={translate("collection-service.sftp-register.field.username")}
                                        rules={[requiredField, checkMaxLength(150), rejectOnlySpace]}
                                        labelCol={{ span: 7 }}
                                        labelAlign="left"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate={(prevVal: ObjectType, currVal: ObjectType) => prevVal?.connectType !== currVal?.connectType}>
                                        {
                                            ({ getFieldValue: getFieldVal }) => (
                                                isAccount(getFieldVal('connectType')) &&
                                                <Form.Item
                                                    name="password"
                                                    label={translate("collection-service.sftp-register.field.password")}
                                                    rules={[requiredField]}
                                                    labelCol={{ span: 7 }}
                                                    labelAlign="left"
                                                >
                                                    <Input.Password />
                                                </Form.Item>
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate={(prevVal: ObjectType, currVal: ObjectType) => prevVal?.connectType !== currVal?.connectType}>
                                        {
                                            ({ getFieldValue: getFieldVal, setFieldsValue }) => (
                                                isKeypair(getFieldVal('connectType')) &&
                                                <Fragment>

                                                    <Form.Item
                                                        label={<><span className='sftp-required-mark'></span>{translate("collection-service.sftp-register.field.privateKeyFile")}</>}
                                                        labelCol={{ span: 7 }}
                                                        labelAlign="left"
                                                    >
                                                        <div style={{ display: 'flex' }}>
                                                            <Form.Item
                                                                name="privateKeyFileDir"
                                                                noStyle
                                                                rules={[requiredSelect, checkMaxLength(255)]}
                                                            >
                                                                <Input placeholder={translate('collection-service.sftp-register.field.supportFile')} readOnly />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="privateKeyFileName"
                                                                noStyle
                                                                hidden
                                                            >
                                                                <Input readOnly />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="upload"
                                                                noStyle
                                                            >
                                                                <PrivateKeyFileUpload
                                                                    anonymous
                                                                    single
                                                                    acceptTypeList={['file/pem']}
                                                                    accept='.pem'
                                                                    maxSize={2}
                                                                    maxCount={1}
                                                                    // error={getFieldError('avatar')}
                                                                    onChange={(privateData: ObjectType) => {
                                                                        setFieldsValue({
                                                                            privateKeyFileDir: privateData?.data?.filePath,
                                                                            privateKeyFileName: privateData?.data?.filename,
                                                                        })
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="passphrase"
                                                        label={translate("collection-service.sftp-register.field.passphrase")}
                                                        rules={[requiredField]}
                                                        labelCol={{ span: 7 }}
                                                        labelAlign="left"
                                                    >
                                                        <Input.Password />
                                                    </Form.Item>
                                                </Fragment>
                                            )
                                        }
                                    </Form.Item>
                                </Fragment>
                            )
                        }
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prevVal: ObjectType, currVal: ObjectType) => prevVal?.revReconcileSFTP !== currVal?.revReconcileSFTP}>
                        {
                            ({ getFieldValue }) => (

                                <Row justify="center">
                                    <Space size={30}>
                                        {
                                            getFieldValue('revReconcileSFTP') &&
                                            <Button htmlType="button" onClick={() => handleCheckSFTPConnection(sftpConfigData)} disabled={checkingConnection}> {translate('collection-service.button.checkConnection')} </Button>
                                        }
                                        <Button type="primary" htmlType="submit" > {translate('form.button.save')} </Button>
                                    </Space>
                                </Row>
                            )
                        }
                    </Form.Item>

                </div>
            </Form >
        </div >
    )
}

export default connect((props: any) => ({
    ...props,
}))(SFTPRegister);
