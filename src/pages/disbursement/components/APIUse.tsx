import React, { useEffect, useRef, useState } from 'react';
import { Container, ProForm, Card, Row, Col, FormItem, Input, } from '@/components';
import { translate } from '@/utils';
import { Switch, Modal, Button, Tooltip } from 'antd';
import styles from "./APIUse.less";
import { requiredField } from '@/utils/rules';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect} from "dva"

const APIUse = (props: any) => {

    const { data, dispatch } = props;
    const formRef = useRef<any>(null);
console.log(data);

    const [onOffApi, setOnOffAPI] = useState(false);
    const confirmAfterSubmit: any = (values: any) => {
        if (values?.isActive) {
            dispatch({
                type: 'disbursement/configUseApi',
                payload: { ...values }
            })
        } else {
            dispatch({
                type: 'disbursement/configUseApi',
                payload: { isActive: false }
            })
        }
    }

    useEffect(() => {
        setOnOffAPI(data?.isActive);
        formRef?.current?.setFieldsValue({
            isActive:data?.isActive,
            url:data?.url,
            secretKey:data?.secretKey,
        })

    }, [data])
    return (<div className={styles.component} >
        <ProForm
            key='CreateForm'
            layout="horizontal"
            labelAlign='left'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}            
            style={{
                width: "100%",
            }}
            onFinish={confirmAfterSubmit}
            syncToInitialValues={true}
            formRef={formRef}
            submitter={{
                render: () => (
                    <Row justify="center">
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
                <FormItem                    
                    name="isActive"
                    label={translate("disbursement.use_api")}
                >
                    <Switch
                        checked={onOffApi}
                        onChange={(checked: any) => {
                        setOnOffAPI(checked);
                        if (!checked) {
                            formRef.current.validateFields()    
                        }
                    }} />
                </FormItem>
                <FormItem
                    name="url"
                    label={translate("disbursement.url_receive_limit_fluctuations")}
                    rules={onOffApi&&[requiredField, {
                        pattern: /^((https?)(:\/\/))([-a-zA-Z0-9@:%._\+~#=]{1,256}((\.[a-zA-Z0-9()]{2,6})|(:[0-9]{1,4})))\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/g,
                        message: translate("disbursement.urlInvalid")
                    }]}
                >
                    <Input
                        disabled={!onOffApi}
                        placeholder={translate('form.placeholder.pleaseEnter')}
                    />
                </FormItem>
                <FormItem
                    name="secretKey"
                    label={<Row   style={{alignItems:"center"}}> <div style={{marginRight:"5px"}}>{translate("disbursement.secret_key")}</div><Tooltip title={translate("disbursement.secret_key_Noted")} ><QuestionCircleOutlined /></Tooltip></Row>}
                    disabled={!onOffApi}
                    rules={onOffApi&&[requiredField]}
                >
                    <Input
                        disabled={!onOffApi}
                        placeholder={translate('form.placeholder.pleaseEnter')}
                    />
                </FormItem>
            </div>




        </ProForm>
    </div>
    )
}


export default connect((props: any) => ({
 ...props,
  }))(APIUse);
  