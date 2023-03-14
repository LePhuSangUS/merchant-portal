import React, { useState } from 'react';
import { Button, FormText, Link, ProForm, TabPane, Tabs, Alert } from '@/components';
import { icPassword,icUsername } from "@/assets/icons";
import type { ConnectState } from '@/models/connect';
import type { StateType } from '@/models/login';
import { requestForgotPassword } from '@/services/user/api';
import { translate } from '@/utils';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { APP_ID } from '@/constants';
import styles from './index.less';
import { checkEmailSpecialCharacter, requiredField } from '@/utils/rules';

export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const Login: React.FC<LoginProps> = (
  {
    dispatch,
    userLogin = {},
    submitting
  }
) => {
  const tabs = [
    {
      key: 'login',
      title: translate('Log in'),
    },
    {
      key: 'forgotPassword',
      title: translate('form.tab.forgotPassword'),
    }
  ];
  const { status, code, message } = userLogin;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [respMsg, setMessage] = useState<any>('');

  const loginSubmit = (values: any) => {
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        userName: values?.userName?.trim()
      },
    });
    return Promise.resolve();
  };

  const forgotSubmit = async (formData: any) => {
    if (!isLoading && formData) {
      setLoading(true);
      const resp = await requestForgotPassword({ ...formData, appId: APP_ID });
      setSuccess(resp?.success);
      if (resp?.success) setMessage('');
      else setMessage(resp?.data?.message);
      setLoading(false);
    }
  };

  const tabChange = () => {
    setMessage('');
    setSuccess(false);
  };

  return (
    <div className={styles.container}>
      <div className="wrapper">
        <div className={styles.title}
        >
                  Merchant Portal
                </div>
        <Tabs centered size="large" defaultActiveKey={tabs[0].key} onChange={tabChange}>
          {/* Login form */}
          <TabPane
            key={tabs[0].key}
            tab={tabs[0].title}
            disabled={isLoading}
            className="tab-content"
          >
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                render: () => (
                  <Button block
                  className="pwd-btn"
                  loading={submitting}
                  type="primary"
                  htmlType="submit"
                  size="large">
                    {translate('form.button.login')}
                  </Button>
                ),
              }}
              onFinish={loginSubmit}
            >
              { // Tài khoản đang bị khóa
                status === 'error'
                && !submitting
                && (
                  code === 1010 // user merchant disabled
                  || code === 2010 ? ( // otp disabled
                    <LoginMessage content={message || translate('pages.login.accountLogin.locked')} />
                  ) : (
                    <LoginMessage content={translate('pages.login.accountLogin.errorMessage')} />
                  )
                )
              }
              {
                status === 'failed'
                && !submitting && (
                  <LoginMessage content={translate('pages.login.accountLogin.failedMessage')} />
                )
              }
              <FormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <img className="icon" src={icUsername} />,
                }}
                placeholder={translate('form.field.username')}
                rules={[
                  {
                    required: true,
                    message: translate('form.message.field.required'),
                  },
                ]}
              />
              <FormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <img className="icon" src={icPassword} />,
                }}
                placeholder={translate('form.field.password')}
                rules={[
                  {
                    required: true,
                    message: translate('form.message.field.required'),
                  },
                ]}
              />
            </ProForm>
          </TabPane>

          {/* Forgot password form */}
          <TabPane
            key={tabs[1].key}
            tab={tabs[1].title}
            disabled={submitting}
            className="tab-content"
          >
            {isSuccess ? (
              <div className="success-msg">{translate('form.message.forgotPassword.success')}</div>
            ) : (
              <ProForm
                submitter={false}
                onFinish={async (values) => {
                  await forgotSubmit(values);
                  return Promise.resolve();
                }}
                onValuesChange={() => setMessage('')}
              >
                <FormText
                  name="email"
                  fieldProps={{
                    size: 'large',
                    prefix:  <img className="icon" src={icUsername} />,
                  }}
                  placeholder={translate('form.field.username')}
                  rules={[
                    requiredField,
                    checkEmailSpecialCharacter,
                    {
                      type: 'email',
                      message: translate('user.register.message.email.invalid'),
                    },
                  ]}
                />
                {
                  respMsg
                    ? (
                      <div className="error-msg">
                        {respMsg}
                      </div>
                    )
                    : null
                }
                <Button
                  htmlType="submit"
                  type="primary"
                  className="pwd-btn"
                  loading={isLoading}
                  size="large"
                >
                  {translate('form.button.send')}
                </Button>
              </ProForm>
            )}
          </TabPane>
        </Tabs>
        <LoginBottom />
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);


const LoginBottom: React.FC = () => (
  <div className='login-bottom'>
    {translate('login.text.accountQuestion')}
    &nbsp;
    <br className='login-bottom--break-line' />
    <Link to='/user/register' className='reg-btn'>
      {translate('login.text.signUpNow')}
    </Link>
  </div>
)

const LoginMessage: React.FC<{
  content?: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 22
    }}
    message={content}
    type="error"
    showIcon
  />
);