import React, { useState, useRef, useEffect } from 'react';
import { ProForm, FormText, Icons, PageLoading, Button, Link, Tabs, TabPane } from '@/components';
import { getPasswordPolicy, verifyActivationToken, accountActivation } from '@/services/user/api';
import { translate, message, parseValue, checkPasswordPolicy } from '@/utils';
import type { FormInstance } from 'antd';
import styles from './index.less';

const { LockOutlined } = Icons;

interface PageProps {
  match: any,
  history: any,
}

const AccountActivation: React.FC<PageProps> = ({ match, history }) => {
  const { token } = match.params;
  const formRef = useRef<FormInstance>();
  const [form] = ProForm.useForm()
  const [pwdPolicy, setPwdPolicy] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isValid, setValid] = useState<boolean>(true);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [second, setSecond] = useState<number>(10);
  const [countdown, setCountdown] = useState<any>(null);

  const handleCountdown = () => {
    const interval = setInterval(() => {
      setSecond(s => s - 1);
    }, 1000);
    setCountdown(interval);
  }

  const validateToken = async () => {
    setLoading(true);
    const resp = await verifyActivationToken(token);
    setValid(resp?.success);
    if (!resp?.success) handleCountdown();
    setLoading(false);
  }

  useEffect(() => {
    getPasswordPolicy()
      .then((resp: any) => setPwdPolicy(resp?.data))
  }, [])

  useEffect(() => {
    if (second <= 0) {
      clearInterval(countdown);
      history.push('/user/login');
    }
  }, [second])

  useEffect(() => {
    validateToken().then();
  }, [token])

  const formSubmit = async (formData: any) => {
    setLoading(true);
    const { password } = formData || {};
    const resp = await accountActivation({ token, password });
    if (resp?.success) handleCountdown();
    else message.error(translate('form.message.activation.failed'));
    formRef?.current?.resetFields?.();
    setSuccess(resp?.success);
    setLoading(false);
    return false;
  };

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

  const handleValuesChange = (changedValues: any, allValues: any) => {
    form?.validateFields(['confirmPassword'])
  }

  return (
    <div className={styles.container}>
      <PageLoading active={isLoading} />
      <Tabs
        centered
        size='large'
        activeKey='activationTab'
      >
        {/* Login form */}
        <TabPane
          key='activationTab'
          tab={
            parseValue({
              vi: 'Kích hoạt tài khoản',
              en: 'Account activation'
            })
          }
          className='tab-content'
        >
          {
            !isValid ? (
              <div className='msg invalid'>
                {translate(
                  'form.message.verifyToken.invalid',
                  'Link bị lỗi hoặc đã hết hạn.\nTự động về trang đăng nhập sau {second}s',
                  { second }
                )}
              </div>
            ) : (
              <>
                {
                  isSuccess ? (
                    <div className='msg'>
                      {translate(
                        'form.message.activation.success',
                        'Kích hoạt tài khoản thành công.\nTự động về trang đăng nhập sau {second}s.',
                        { second }
                      )}
                    </div>
                  ) : (
                    <ProForm
                      formRef={formRef}
                      form={form}
                      onValuesChange={handleValuesChange}
                      submitter={{
                        render: () => (
                          <div className='btn-wrap'>
                            <Button
                              block
                              type="primary"
                              htmlType="submit"
                              size="large"
                              loading={isLoading}
                            >
                              {translate('form.button.submit')}
                            </Button>
                            <Link to='/user/login' className='home-btn'>
                              {translate('user.register.button.backLogin')}
                            </Link>
                          </div>
                        )
                      }}
                      onFinish={formSubmit}
                    >
                      <FormText.Password
                        name="password"
                        label={parseValue({
                          vi: 'Mật khẩu',
                          en: 'Password'
                        })}
                        placeholder={parseValue({
                          vi: 'Nhập mật khẩu',
                          en: 'Enter password'
                        })}
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined />,
                        }}
                        rules={[
                          {
                            required: true,
                            message: translate('pages.changePassword.message.required'),
                          },
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
                            message: translate('pages.changePassword.message.required'),
                          },
                          ({ getFieldValue }) => ({
                            validator(_: any, val: any) {
                              if (val && val !== getFieldValue('password')) {
                                return Promise.reject(
                                  new Error(translate('pages.changePassword.message.nomatch')),
                                );
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
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

export default AccountActivation;
