import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Result, ConfigProvider, Menu, Layout, Breadcrumb, Drawer } from 'antd';
import { connect, history, Link, useIntl, createIntl, getLocale } from 'umi';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import { getMatchMenu } from '@umijs/route-utils';
import { getLanguage } from '@ant-design/pro-layout/es/locales';
import classNames from "classnames";
import _ from 'lodash';
import moment from 'moment';
import { Content, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import type { BasicLayoutProps as ProLayoutProps, MenuDataItem, Settings, } from '@ant-design/pro-layout';
import type { Dispatch } from 'umi';
import type { SiderProps } from 'antd/lib/layout/Sider';
// src
import type { ConnectState } from '@/models/connect';
import RightContent from '@/components/GlobalHeader/RightContent';
import { notification } from '@/utils';
import { getToken } from '@/utils/storage';
import Authorized from '@/utils/Authorized';
import { logoPurpleHorizontal, logoPurple } from "@/assets"
import SidebarHeaderLogo from '@/components/LeftSidebar/SidebarHeader/SidebarHeaderLogo';
import SidebarHeader from '@/components/LeftSidebar/SidebarHeader';
import style from "./CustomLayout.less";
import { SidebarProfile } from '@/components/LeftSidebar';
import { useInterval, useIsMobile, useModal, useWindowSize } from '@/hooks';
import { compose, getProperty, indexOf, isExists } from '@/utils/curry';
import { getNotifications } from '@/services/user/api';
import NotificationItemModal from '@/pages/user/notification/components/NotificationItemModal';
import NeoIcon from "@/assets/icons/custom";
import { env } from "@/env";
import { CustomLayoutFooter, MenuIconCollapse, MenuItem, SubMenuTitle } from '@/components/Layout';
import { renderBreadcrumItem } from '@/components/Layout/CustomLayout/render';
import { filterUnregisterMenu } from '@/components/Layout/CustomLayout/handler';

const INTERVAL_TIME_CHECK_SWITCH_LANGUAGE = 5000;
const MODULE_DISBURSEMENT_PATH = "/disbursement-management";
const MODULE_COLLECTION_SERVICE_PATH = "/collection-service";
const COLLECTION_SERVICE_REGISTRATION_PATH = "/collection-service-registration";

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

export type CustomLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;

export type CustomLayoutContext = { [K in 'location']: CustomLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/** Use Authorized check all menu item */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item: any) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };

    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });


// COMPONENTS
const MenuWraper: React.FC<ObjectType> = ({ children, isMobile, closeDrawer, showDrawer, collapsed, siderProps }) => {
  return (
    isMobile ?
      <Drawer className="custom-drawer" getContainer={false} placement="left" width={256} onClose={closeDrawer} visible={showDrawer}>
        {children}
      </Drawer>
      :
      <Sider breakpoint="md" trigger={null} collapsible collapsed={collapsed} {...siderProps}>
        {children}
      </Sider>
  )
}

const CustomLayout: React.FC<CustomLayoutProps> = (props: any) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    user,
    route: _route
  } = props;
  const menuDataRef = useRef<MenuDataItem[]>([]);
  const [language] = useState<string>(getLocale());
  const [collapsed, setCollapsed] = useState(false);
  const [noticeItem, setNoticeItem] = useState<ObjectType | null>();
  const [showNotificationModal, openNotificationModal, closeNotificationModal] = useModal();
  const [showDrawer, openDrawer, closeDrawer] = useModal();
  const [isMobile, setIsMobile] = useState(useIsMobile());
  const windowSize = useWindowSize();

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

  // set isMobile with window size
  useEffect(() => {
    const isMobileSize = windowSize.width <= 767;
    setIsMobile(isMobileSize);
  }, [windowSize]);

  // reset collapsed in mobile
  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
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
  }, []);

  /** HANDLE MENU DATA */
  const filterPublishMenu = (menu: ObjectType) => !menu.hideInMenu && menu.id;
  const menuDataFiltered = useMemo(() => {
    const menuFiltered = filterUnregisterMenu(_route?.routes.filter(filterPublishMenu), user?.currentMerchant);
    menuDataRef.current = menuFiltered;
    return menuFiltered;
  }, [_route?.routes, user?.currentMerchant]);
  const menuData = useMemo(() => menuDataRender(menuDataFiltered), [menuDataFiltered]);

  const flatRoute = _.flatten(_route?.routes.map((route: ObjectType) => [route].concat(route.routes)));
  const pathnameArr = history.location.pathname.split("/") || [];

  const getBreadcrum = () => {
    const br: any[] = [];
    const newPathArr = [...pathnameArr];
    while (newPathArr.length > 1) {

      let closestRoute = flatRoute.filter((route: any) => {
        const arrPath = route?.path?.split("/") || [];
        return arrPath.length === newPathArr.length && arrPath[1] === newPathArr[1];
      });

      closestRoute = closestRoute.map((route: any) => {
        const arrPath = route?.path?.split("/") || [];

        return {
          ...route,
          difference: _.difference(arrPath, newPathArr).length
        }
      })

      br.push(_.minBy(closestRoute, 'difference'));
      newPathArr.pop();
    }

    return br;
  }

  // HANDLE BREADCRUM
  const breadcrumArr = () => {
    const last = getBreadcrum();

    return [
      {
        path: '/',
        breadcrumbName: formatMessage({
          id: 'menu.home',
        }),
      },
      ...last.reverse().filter(item => !!item).map((item: any) => {
        return ({
          ...(item || {}),
          path: item?.component ? item?.path : '',
          breadcrumbName: formatMessage({
            id: `menu.${item?.name}`,
            defaultMessage: item?.name
          }),
          children: null,
          routes: null,
        })
      })
    ]
  }

  const breadcrumRoute = breadcrumArr();

  const currentMenuKey = (flatRoute.find((menu: any) => menu?.path === history.location.pathname) as ObjectType)?.id;
  const openKeys: string[] = breadcrumRoute.map(getProperty('id'));
  const selectedKeys = _.compact([currentMenuKey, ...openKeys.filter(isExists)]);

  /** STYLES & PROPS CONFIG */
  const siderStyle: React.CSSProperties = {
    overflow: 'hidden',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  }
  const siderProps: SiderProps & React.RefAttributes<HTMLDivElement> = {
    style: siderStyle,
    width: settings.siderWidth,
    collapsedWidth: 61,
    theme: 'light',
  }

  const headerStyle: React.CSSProperties = {
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 9,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px'
  }

  const collapsedIconStyle: React.CSSProperties = {
    width: 22,
    height: 22,
    cursor: 'pointer'
  }

  const siteLayoutStyle: React.CSSProperties = {
    flexDirection: 'column',
    marginLeft: isMobile ? 0 : (collapsed ? siderProps.collapsedWidth : siderProps.width)
  }

  const breadcrumStyles: React.CSSProperties = { padding: '12px 24px 16px', background: '#fff' };

  return (
    <ConfigProvider locale={currentLocale}>
      <Layout className={style['neo-custom-layout']} hasSider style={{ flexDirection: 'row' }}>
        <MenuWraper isMobile={isMobile} closeDrawer={closeDrawer} showDrawer={showDrawer} collapsed={collapsed} siderProps={siderProps}>
          <div className="logo" >
            <SidebarHeader>
              <SidebarHeaderLogo logo={<img src={logoPurpleHorizontal} alt="" />} onClick={() => history.push('/')} isSimpleLogo={collapsed} simpleLogo={logoPurple} />
            </SidebarHeader>
          </div>
          <div className="sider__menu-container" data-simplebar>
            <div className="sider__menu-extra" >
              <SidebarProfile user={user} hiddenEmail={collapsed} hiddenName={collapsed} simpleAvatar={collapsed} />
            </div>
            <Menu
              theme="light"
              mode="inline"
              // defaultSelectedKeys={selectedKeys}
              defaultOpenKeys={openKeys}
              selectedKeys={selectedKeys}
              // openKeys={openKeys}
              inlineCollapsed={collapsed}
              className="sider__menu"
              expandIcon={collapsed ? null : <MenuIconCollapse id='collapse' />}
            >
              {
                menuData?.map((menu: ObjectType) => {
                  const childrenMenu = menu?.routes?.filter(filterPublishMenu) || [];

                  return (
                    childrenMenu.length > 1 ?
                      <Menu.SubMenu key={menu.id} title={<SubMenuTitle route={menu} />}>
                        <Menu.ItemGroup title={menu.name}>
                          {
                            childrenMenu?.map((child: ObjectType) => <MenuItem key={child.id} route={child} />)
                          }
                        </Menu.ItemGroup>
                      </Menu.SubMenu>
                      :
                      <MenuItem key={menu.id} route={menu} />
                  )
                })
              }
            </Menu>
          </div>
        </MenuWraper>
        <Layout className={classNames('site-layout', style['neo-site-layout'])} style={siteLayoutStyle}>
          <Header className={style['neo-header']} style={headerStyle}>
            <span
              onClick={isMobile ? openDrawer : () => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                fontSize: '16px',
                padding: '24px 0',
              }}
            >
              {collapsed ? <NeoIcon id="menu_right_arrow" style={collapsedIconStyle} /> : <NeoIcon id="menu" style={collapsedIconStyle} />}
            </span>

            <RightContent />
          </Header>
          <Breadcrumb itemRender={renderBreadcrumItem} routes={breadcrumRoute} style={breadcrumStyles} />
          <Content style={{ minHeight: 280, }} >
            <Authorized authority={authorized!.authority} noMatch={noMatch}>
              {children}
            </Authorized>
            {showNotificationModal && <NotificationItemModal noticeItem={noticeItem} onCancel={compose(closeNotificationModal, () => setNoticeItem(null))} />}
          </Content>
          <CustomLayoutFooter />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default connect(({ global, settings, user, ...rest }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  user,
  ...rest
}))(CustomLayout);
