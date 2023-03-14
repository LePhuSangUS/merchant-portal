import React, { useEffect, useRef, useState } from 'react';
import { Switch, Button, Tooltip, Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";

import { Row } from '@/components';
import { translate } from '@/utils';
import styles from "./APIUse.less";
import { requiredField } from '@/utils/rules';

const APIUse = (props: any) => {
    const { data, dispatch } = props;
    const formRef = useRef<FormInstance>(null);
    const [currentActive, setCurrentActive] = useState<boolean>(false);

    const confirmAfterSubmit = (values: ObjectType) => {
        dispatch({ type: 'collectionService/updateCollectionServiceConfig', payload: values })
        return Promise.resolve(true);
    }

    useEffect(() => {
        setCurrentActive(data?.isActive)
        formRef?.current?.setFieldsValue({
            isActive: data?.isActive,
            url: data?.url,
            secretKey: data?.secretKey,
        })
    }, [data, formRef])

    return (
        <div className={styles.component} >
            <Form
                layout="horizontal"
                style={{ width: "100%", }}
                onFinish={confirmAfterSubmit}
                initialValues={data}
                ref={formRef}
                onValuesChange={({ isActive }) => {
                    if(isActive !== undefined) {
                        setCurrentActive(isActive)
                    }
                }}
            >
                <div className={styles.formContent}>
                    <div className="active-block">
                        <Form.Item name="isActive" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <span style={{ marginLeft: 5 }}>{translate("collection-service.use_api")}</span>
                    </div>
                    <Form.Item
                        name="url"
                        label={translate("collection-service.url_receive_limit_fluctuations")}
                        rules={currentActive ? [requiredField, {
                            pattern: /^((https?)(:\/\/))([-a-zA-Z0-9@:%._\+~#=]{1,256}((\.[a-zA-Z0-9()]{2,6})|(:[0-9]{1,4})))\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/g,
                            message: translate("collection-service.urlInvalid")
                        }] : []}
                        labelCol={{ span: 8 }}
                        labelAlign="left"
                    >
                        <Input
                            disabled={!currentActive}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="secretKey"
                        label={<Row style={{ alignItems: "center" }}>
                            <div style={{ marginRight: "5px" }}>{translate("collection-service.secret_key")}</div>
                            <Tooltip title={translate("collection-service.secret_key_Noted")} ><QuestionCircleOutlined /></Tooltip>
                        </Row>}
                        rules={currentActive ? [requiredField] : []}
                        labelCol={{ span: 8 }}
                        labelAlign="left"
                    >
                        <Input
                            disabled={!currentActive}
                            placeholder={translate('form.placeholder.pleaseEnter')}
                        />
                    </Form.Item>
                </div>
                <Row justify="center">
                    <Button type='primary' htmlType='submit' > {translate('form.button.save')} </Button>
                </Row>
            </Form>
        </div>
    )
}

export default connect((props: any) => ({
    ...props,
}))(APIUse);
