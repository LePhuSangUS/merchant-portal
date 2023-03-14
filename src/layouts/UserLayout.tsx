import React from 'react';
import type { ConnectState } from '@/models/connect';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle, DefaultFooter } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps } from 'umi';
import { connect, SelectLang, useIntl } from 'umi';
import { ConfigProvider, Space } from 'antd';
import { getLanguage } from '@ant-design/pro-layout/es/locales';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import {logoWhiteHorizontal} from "@/assets"
import styles from './UserLayout.less';
import { useEventListener, useIsClient } from '@/hooks';

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>;

const UserLayout: React.FC<UserLayoutProps> = (props: any) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  const currentLocale = { 'vi-VN': viVN, 'en-US': enUS }[getLanguage()];
  if(!localStorage.getItem('umi_locale')) localStorage.setItem('umi_locale', 'vi-VN')

  // calculate vh for responsive
  // TODO: need copy to BasicLayout when responsive inside pages
  const isClient = useIsClient()
  useEventListener('resize', () => {
    if(isClient) {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  })
  return (
    <ConfigProvider locale={currentLocale}>
      <HelmetProvider>
        <Helmet>
          {/* <title>{title}</title> */}
          <meta name="description" content={title} />
        </Helmet>
        <div className={styles.container}>
        <div className={styles.BgGradient} style={{ borderRadius:"0 0 50% 50% / 0 0 100% 100%" }} />
          {/* <div className={styles.lang}>
            <SelectLang />
          </div> */}
          <div className={styles.content}>
            <div className={styles.header}>
                <img className="logo" alt="Merchant" src={logoWhiteHorizontal} />
         
            </div>
            <div className={styles.children}>
              {children}
            </div>
          </div>
          <DefaultFooter
            links={false}
            copyright={`${new Date().getFullYear()} Merchant Portal. All rights reserved.`}
            className={styles.footer}
          />
        </div>
      </HelmetProvider>
    </ConfigProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
