import React, { useEffect, useState } from 'react';
import {PageLoading, Tabs, TabPane, ProForm, FormText, Button, Icons, Link} from '@/components';
import { verifyToken, resetPassword, getPasswordPolicy } from '@/services/user/api';
import { translate, checkPasswordPolicy, parseValue } from '@/utils';
import { APP_ID } from '@/constants';
import styles from './index.less';

const { LockOutlined } = Icons;

export type PageProps = {
  match: any;
  history: any;
};

const ResetPassword: React.FC<PageProps> = ({ match, history }) => {
  const { id, token } = match.params;
  const [isLoading, setLoading]  = useState<boolean>(true);
  const [isSuccess, setSuccess]  = useState<boolean>(false);
  const [isValid, setValid]  = useState<boolean>(true);
  const [respMsg, setMessage] = useState<string>('');
  const [second, setSecond] = useState<number>(10);
  const [countdown, setCountdown] = useState<any>();
  const [pwdPolicy, setPwdPolicy] = useState<any>(null);

  const handleCountdown = () => {
    const interval: any = setInterval(() => {
      setSecond(s => s - 1);
    }, 1000);
    setCountdown(interval);
  }

  const validateToken = async () => {
    setLoading(true);
    const resp = await verifyToken({ id, token, appId: APP_ID });
    setValid(resp?.success);
    if (!resp?.success) {
      handleCountdown();
    }
    setLoading(false);
  }

  useEffect(() => {
    getPasswordPolicy().then((resp: any) => setPwdPolicy(resp?.data || {}))
    return () => {
      clearInterval(countdown);
    }
  }, []);

  useEffect(() => {
    validateToken().then();
  }, [token]);

  useEffect(() => {
    if (second <= 0) {
      clearInterval(countdown);
      history.push('/user/login');
    }
  }, [second]);

  const handleSubmit = async (formData: any) => {
    if (
      !isLoading
      && formData?.newPassword === formData?.confirmPassword
    ) {
      setLoading(true);
      setMessage('');
      const resp = await resetPassword({ appId: APP_ID, id, token, newPassword: formData.newPassword });
      setSuccess(!!resp?.success);
      if (resp?.success) handleCountdown();
      else setMessage(resp?.data?.message);
      setLoading(false);
    }
  }

  const validatePassword = (_: any, val: any) => {
    if (val && pwdPolicy) {
      // check before check policy from iam, deny 2 byte character and \, ~, <
      const otherCharPatterm = /[^a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"|,.\/?>]/
      const hasStrangeCharacter = otherCharPatterm.test(val)
      if (hasStrangeCharacter) {
        return Promise.reject(new Error(parseValue({
          vi: `Mật khẩu không sử dụng các ký tự \\, ~, < hoặc các ký tự ngôn ngữ đặc biệt`,
          en: `Password now allowed character \\, ~, < or other special language character`,
        })));
      }

      const checkPwd = checkPasswordPolicy(pwdPolicy, val);
      if (!checkPwd?.valid)
        return Promise.reject(new Error(parseValue(checkPwd?.messages?.[0])));
    }
    return Promise.resolve();
  }

  return (
    <div className={styles.main}>
      <PageLoading active={isLoading} />
      <Tabs
        centered
        size='large'
      >
        {/* Login form */}
        <TabPane
          key='resetPassword'
          tab={translate('form.title.changePassword')}
          style={{ padding: '10px 0' }}
        >
          {
            !isValid ? (
              <div className='msg invalid'>
                {translate('form.message.verifyToken.invalid', 'Invalid token', { second })}
              </div>
            ) : (
              <>
                {
                  isSuccess ? (
                    <div className='msg'>
                      {translate('form.message.resetPassword.success', 'Change password successfully', { second })}
                    </div>
                  ) : (
                    <ProForm
                      submitter={false}
                      onFinish={handleSubmit}
                      onValuesChange={() => setMessage('')}
                    >
                      <FormText.Password
                        name="newPassword"
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined className='icon' />,
                        }}
                        placeholder={translate('form.field.password')}
                        rules={[
                          { required: true, message: translate('form.message.field.required') },
                          { validator: validatePassword }
                        ]}
                      />
                      <FormText.Password
                        name="confirmPassword"
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined className='icon' />,
                        }}
                        placeholder={translate('form.field.confirmPassword')}
                        rules={[
                          {
                            required: true,
                            message: translate('form.message.field.required'),
                          },
                          ({ getFieldValue }) => ({
                            validator(_: any, val: any) {
                              if (val && val !== getFieldValue('newPassword')) {
                                return Promise.reject(
                                  new Error(translate('pages.changePassword.message.nomatch')),
                                );
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                        dependencies={['newPassword']}
                      />
                      {
                        respMsg ? (
                          <div className='error-msg'>
                            {respMsg}
                          </div>
                        ) : null
                      }
                      <div className='btn-wrap'>
                        <Button
                          block
                          htmlType='submit'
                          type='primary'
                          size='large'
                          loading={isLoading}
                        >
                          {translate('form.button.submit')}
                        </Button>
                        <Link to='/user/login' className='home-btn'>
                          {translate('user.register.button.backLogin')}
                        </Link>
                      </div>
                    </ProForm>
                  )
                }
              </>
            )
          }
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResetPassword;
