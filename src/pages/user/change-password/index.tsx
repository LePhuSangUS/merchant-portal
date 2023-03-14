import React, { useState, useRef } from 'react';
import { Container, ProForm, FormText, Icons } from '@/components';
import { storage, getLanguageKey, translate, message, checkPasswordPolicy, parseValue } from '@/utils';
import { handleChangePassword } from '@/services/user/api';
import type { FormInstance } from 'antd';
import styles from './index.less';

const { LockOutlined } = Icons;

interface PageProps {
  submitting: any;
}

const ChangePassword: React.FC<PageProps> = ({ submitting }) => {
  const formRef = useRef<FormInstance>();
  const [initValues, setInitValues] = useState({});

  const userProfile = storage.getProfile();

  const submit = async (params: any) => {
    const resp = await handleChangePassword(params);
    if (resp?.success) {
      setInitValues({});
      formRef?.current?.resetFields?.();
      return message.success(translate('pages.changePassword.message.success'));
    }
    message.error(translate('pages.changePassword.message.failed'));
  };

  const validatePassword = (_: object, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    // check before check policy from iam, deny 2 byte character and \, ~, <
    const otherCharPatterm = /[^a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"|,.\/?>]/
    const hasStrangeCharacter = otherCharPatterm.test(value)
    if (hasStrangeCharacter) {
      return Promise.reject(new Error(parseValue({
        vi: `Mật khẩu không sử dụng các ký tự \\, ~, < hoặc các ký tự ngôn ngữ đặc biệt`,
        en: `Password now allowed character \\, ~, < or other special language character`,
      })));
    }

    if (!userProfile?.app?.setting?.security?.passwordPolicy) {
      return Promise.resolve();
    }
    const checkPasswordResult = checkPasswordPolicy(
      userProfile.app.setting.security.passwordPolicy,
      value,
    );
    if (!checkPasswordResult.valid) {
      return Promise.reject(new Error(checkPasswordResult.messages[0][getLanguageKey()]));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Container className={styles.page}>
      <div className="form-wrapper">
        <ProForm
          formRef={formRef}
          initialValues={initValues}
          className="form"
          submitter={{
            searchConfig: {
              submitText: translate('pages.changePassword.button.submit'),
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            submit(values);
            return Promise.resolve();
          }}
        >
          <div style={{ paddingBottom: '.5em' }}>
            <FormText.Password
              name="oldPassword"
              label={translate('Current password')}
              placeholder={translate('pages.changePassword.placeholder.oldPassword')}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: translate('pages.changePassword.message.required'),
                },
              ]}
            />
            <FormText.Password
              name="newPassword"
              label={translate('pages.changePassword.field.newPassword')}
              placeholder={translate('pages.changePassword.placeholder.newPassword')}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: translate('pages.changePassword.message.required'),
                },
                { validator: validatePassword },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value === getFieldValue('oldPassword')) {
                      return Promise.reject(
                        new Error(translate('pages.changePassword.message.matchOldPassword')),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
            <FormText.Password
              hasFeedback
              name="confirmPassword"
              label={translate('pages.changePassword.field.confirmPassword')}
              placeholder={translate('pages.changePassword.placeholder.confirmPassword')}
              dependencies={['newPassword']}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: translate('pages.changePassword.message.required'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value !== getFieldValue('newPassword')) {
                      return Promise.reject(
                        new Error(translate('pages.changePassword.message.nomatch')),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </div>
        </ProForm>
      </div>
    </Container>
  );
};

export default ChangePassword;
