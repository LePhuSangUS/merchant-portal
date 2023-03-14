import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import type { BasicLayoutProps as ProLayoutProps, MenuDataItem, Settings, } from '@ant-design/pro-layout';
import { Button, Result, ConfigProvider } from 'antd';
import { connect, history, Link, useIntl, createIntl, getLocale } from 'umi';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { getMatchMenu } from '@umijs/route-utils';
import type { Dispatch } from 'umi';
import { getLanguage } from '@ant-design/pro-layout/es/locales';
import classNames from "classnames";
// src
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { notification } from '@/utils';
import { getToken } from '@/utils/storage';
import Authorized from '@/utils/Authorized';
import { logoPurpleHorizontal, logoPurple } from "@/assets"
import SidebarHeaderLogo from '@/components/LeftSidebar/SidebarHeader/SidebarHeaderLogo';
import SidebarHeader from '@/components/LeftSidebar/SidebarHeader';
import style from "./BasicLayout.less";
import { SidebarProfile } from '@/components/LeftSidebar';
import { useInterval, useModal } from '@/hooks';
import { compose, indexOf } from '@/utils/curry';
import { getNotifications } from '@/services/user/api';
import moment from 'moment';
import NotificationItemModal from '@/pages/user/notification/components/NotificationItemModal';
import NeoIcon from "@/assets/icons/custom";
import NeoMenuIcon from '@/assets/icons/menu';
import { env } from "@/env";

const INTERVAL_TIME_CHECK_SWITCH_LANGUAGE = 5000;
const MODULE_DISBURSEMENT_PATH = "/disbursement-management";
const MODULE_COLLECTION_SERVICE_PATH = "/collection-service";
const COLLECTION_SERVICE_REGISTRATION_PATH = "/collection-service-registration";

const NeoMenuIconCombo = ({ id }) => (
  <>
    <NeoMenuIcon id={id} type="gray" />
    <NeoMenuIcon id={id} type="purple" />
  </>
)
const NeoMenuIconComboCollapse = ({ id }) => (
  <>
    <NeoMenuIcon id={id} type="right" />
    <NeoMenuIcon id={id} type="down" />
  </>
)

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/** Use Authorized check all menu item */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item: any) => {
    // if(item?.id === 'DASHBOARD')
    // let NeoIcon: JSX.Element;
    // if(customIcon[item?.id]) {
    //   NeoIcon = customIcon[item?.id]
    // }

    // const MenuIcon =<CustomIcon />;
    const localItem = {
      ...item,
      icon: null,
      children: item.children ? menuDataRender(item.children) : undefined,
    };

    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Merchant Portal. All rights reserved.`}
    links={[
      {
        key: 'Merchant Portal',
        title: '',
        href: 'https://portal.neopay.vn/neopay/portal',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props: any) => {
  // const [isWallet, setIsWallet] = useState<boolean>(false);
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    user
  } = props;
  const menuDataRef = useRef<MenuDataItem[]>([]);
  const [language] = useState<string>(getLocale());
  const [collapsed, setCollapsed] = useState(false);
  const [noticeItem, setNoticeItem] = useState<ObjectType | null>();
  const [showNotificationModal, openNotificationModal, closeNotificationModal] = useModal();

  // reload page when the language has changed in other tabs
  const handleCheckSwitchLanguage = () => {
    const isReload = language !== getLocale()
    if (isReload) {
      window.location.reload()
    }
  }

  useInterval(() => {
    handleCheckSwitchLanguage()
  }, INTERVAL_TIME_CHECK_SWITCH_LANGUAGE)

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    // const currentUser = getUser();
    // setIsWallet(hasBalanceManagement() && currentUser?.wallet?.canLink && !currentUser?.wallet?.isLinked);
    const socketUrl = new URL(env.SOCKET_IO_URL)
    window.socket = io(socketUrl?.origin, {
      path: socketUrl?.pathname,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false, // [2] Please don't set this to true
      upgrade: false
    });
    window.socket.on('connect', () => {
      // initial socket - send token to server
      window.socket.emit('getListNotice', {
        headers: {
          method: 'GET',
          authorization: `Bearer ${getToken()}`,
        },
        body: {},
      });
      window.socket.on('notify', (data: any) => {
        if (data?.actionType !== 'MERCHANT_LINK_WALLET') {
          notification.success({
            title: data?.notification?.title,
            content: data?.notification?.body,
            duration: 5,
          });
        }
      });
    });
    window.socket.on('error', (err: any) => {
      throw err;
    });
    window.socket.on('connect_error', (err: any) => {
      throw err;
    });
    return () => {
      window.socket?.close();
    };
  }, [dispatch]);

  const handleMenuCollapse = (payload: boolean): void => {
    setCollapsed(!collapsed)
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const { formatMessage } = createIntl({ ...useIntl(), onError: () => { } });
  const currentLocale = { 'vi-VN': viVN, 'en-US': enUS }[getLanguage()];

  const isContainInPathName = useCallback((...args: any[]) => indexOf(location.pathname)(...args), [location.pathname]);
  const redirectDashboardOrNot = useCallback((isRedirect: boolean) => {
    if (typeof isRedirect === 'boolean' && isRedirect) {
      history.replace({ pathname: '/dashboard' });
    }
  }, [])
  // check disbursement
  redirectDashboardOrNot(isContainInPathName(MODULE_DISBURSEMENT_PATH) && typeof user.currentMerchant.isRegisteredDisbursement === 'boolean' && !user.currentMerchant.isRegisteredDisbursement);
  // check collection
  redirectDashboardOrNot((isContainInPathName(MODULE_COLLECTION_SERVICE_PATH) && location.pathname !== COLLECTION_SERVICE_REGISTRATION_PATH) && typeof user.currentMerchant.isRegisteredCollection === 'boolean' && !user.currentMerchant.isRegisteredCollection);

  // notification in the first login
  useEffect(() => {
    (async () => {
      try {
        const resp = await getNotifications({});
        if (resp.success) {
          const showNoti = resp?.data?.filter((notify: ObjectType) => notify?.data?.type === 'FIRST_LOGIN' && notify?.status === 'NEW' && moment().diff(notify?.createdAt, 'seconds') < 30);

          showNoti?.forEach((item: ObjectType) => {
            notification.success({
              title: item?.notification?.title,
              content: item?.notification?.body?.replace(/(<([^>]+)>)/ig, '')?.replace(/\r\n[A-Z][^>]+/ig, ''),
              duration: 5,
              onClick: () => {
                setNoticeItem(item);
                openNotificationModal();
                notification.destroy();
              },
              style: { cursor: 'pointer' }
            });
          })
        }
      } catch (error) {
        console.error('[first_notification]', error);
      }
    })();

    document.getElementsByClassName("ant-pro-sider-extra")[0].append(document.getElementsByClassName("ant-layout-sider-children")[0].children[2])
  }, []);

  const collapsedIconStyle: React.CSSProperties = {
    width: 22,
    height: 22,
  }

  return (
    <ConfigProvider locale={currentLocale}>
      <ProLayout
        logo={logoPurpleHorizontal}
        className={classNames(style['basic-layout'], { [style['layout-sidebar-collapsed']]: collapsed })}
        formatMessage={formatMessage}
        {...props}
        {...settings}
        // header render
        headerContentRender={() => {
          return (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: collapsed ? '0 24px' : '0 8px'
                }}
              >
                {collapsed ? <NeoIcon id="menu_right_arrow" style={collapsedIconStyle} /> : <NeoIcon id="menu" style={collapsedIconStyle} />}
              </div>
            </div>
          );
        }}
        // handle left sidebar
        collapsed={collapsed}
        onCollapse={handleMenuCollapse}
        // onMenuHeaderClick={() => history.push('/')}
        // render left sidebar
        menuHeaderRender={(logo) => (
          <SidebarHeader>
            <SidebarHeaderLogo logo={logo} onClick={() => history.push('/')} isSimpleLogo={collapsed} simpleLogo={logoPurple} />
          </SidebarHeader>
        )}
        menuExtraRender={() => <SidebarProfile user={user} hiddenEmail={collapsed} hiddenName={collapsed} simpleAvatar={collapsed} />}
        collapsedButtonRender={false} // button in bottom sidebar
        menuItemRender={(menuItemProps: any, defaultDom: React.ReactNode) => {
          const isDashboard = menuItemProps.isUrl || !menuItemProps.path || location.pathname === menuItemProps.path;
          return isDashboard ? <><NeoMenuIconCombo id={menuItemProps.id} />{defaultDom}</> : <Link to={menuItemProps.path}><NeoMenuIconCombo id={menuItemProps.id} />{defaultDom}</Link>;
        }}
        subMenuItemRender={(_, dom) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, }} ><NeoMenuIconCombo id={_.id} /> {dom} <NeoMenuIconComboCollapse id='collapse' /></div>
        )}
        menuFooterRender={false}
        // render breadcrumb
        breadcrumbRender={(routers: any[] = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers.map((route) => ({ ...route, path: route?.component ? route?.path : '' })),
        ]}
        itemRender={(route: any, params: any, routes: any[], paths: any) => {
          if (routes.indexOf(route) < routes?.length - 1 && route?.path.length > 0) {
            return <Link to={`/${paths}`}>{route.breadcrumbName}</Link>;
          }
          return <span>{route.breadcrumbName}</span>;
        }}
        footerRender={() => {
          if (settings.footerRender || settings.footerRender === undefined) {
            return defaultFooterDom;
          }
          return null;
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData: any) => {
          let menuDataFiltered = menuData.filter((item: any) => {
            return item.path !== MODULE_DISBURSEMENT_PATH || user.currentMerchant.isRegisteredDisbursement
          })
          menuDataFiltered = menuDataFiltered.filter((item: any) => {
            return item.path !== MODULE_COLLECTION_SERVICE_PATH || user.currentMerchant.isRegisteredCollection
          })
          menuDataRef.current = menuDataFiltered || [];

          return menuDataFiltered || [];
        }}
        pageTitleRender={false}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
        {showNotificationModal && <NotificationItemModal noticeItem={noticeItem} onCancel={compose(closeNotificationModal, () => setNoticeItem(null))} />}
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({ global, settings, user }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  user
}))(BasicLayout);
