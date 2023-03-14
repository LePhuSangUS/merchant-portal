import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Avatar, Menu } from 'antd';
import type { ConnectProps } from 'umi';
import { connect, history } from 'umi';
import classNames from 'classnames';
// src
import type { ConnectState } from '@/models/connect';
import type { CurrentUser, CurrentMerchant } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { Translate, Icons } from '@/components';
import { hasBalanceManagement } from '@/utils/utils';
import { parseImgUrl } from '@/utils/parse';
import NeoIcon from '@/assets/icons/custom';
import {icStoreDefault} from "@/assets/icons";
import { useOutsideAlerter } from '@/hooks';
import { useBoolean } from 'react-use';

export type GlobalHeaderRightProps = {
  currentUser?: CurrentUser;
  currentMerchant?: CurrentMerchant;
  menu?: boolean;
} & Partial<ConnectProps>;

type MenuClickEvent = {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = (props) => {
  const { dispatch } = props;
  const [_menu, setMenu] = useState<React.Key>();
  const [trigger, toggle] = useBoolean(false);
  const wrapperRef = useRef(null);
  const { menu, currentMerchant, } = props;
  const pathname = history?.location?.pathname;

  const handler = () => {
      setTimeout(toggle, 100);
  }
  useOutsideAlerter(wrapperRef, handler);

  const onMenuClick = (event: MenuClickEvent) => {
    const { key } = event;

    if (key === 'logout') {
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    setMenu(key);

    history.push(`/${key}`);
  };


  useEffect(() => {
    if (dispatch) dispatch({ type: 'user/fetchCurrentMerchant' })
  }, []);

  

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={(e: any) => onMenuClick(e)}
    >
      {
        menu &&
        <Fragment>
          <Menu.Item key="my-profile" className={classNames('menu__item', { 'menu__item--active': pathname === '/my-profile' })}>
            <NeoIcon id="header_account" />
            <Translate id="menu.account.myProfile" />
          </Menu.Item>
          {hasBalanceManagement() && (
            <Menu.Item key="balance-management" className={classNames('menu__item', { 'menu__item--active': pathname === '/balance-management' })}>
              <NeoIcon id="header_wallet" />
              <Translate id="menu.account.balanceManagement" />
            </Menu.Item>
          )}
          <Menu.Item key="payment-page-config" className={classNames('menu__item', { 'menu__item--active': pathname === '/payment-page-config' })}>
            <NeoIcon id="header_pg_setting" />
            <Translate id="menu.account.paymentPageConfig" />
          </Menu.Item>
          <Menu.Item key="disbursement" className={classNames('menu__item', { 'menu__item--active': pathname === '/disbursement' })}>
            <NeoIcon id="header_disbursement" />
            <Translate id="menu.disbursement" />
          </Menu.Item>
          <Menu.Item key="collection-service-registration" className={classNames('menu__item', { 'menu__item--active': pathname === '/collection-service-registration' })}>
            <NeoIcon id="header_collection" />
            <Translate id="menu.collection-service" />
          </Menu.Item>
          <Menu.Item key="change-password" className={classNames('menu__item', { 'menu__item--active': pathname === '/change-password' })}>
            <NeoIcon id="header_change_password" />
            <Translate id="menu.account.changePassword" />
          </Menu.Item>
        </Fragment>
      }
      <Menu.Item key="logout" className="menu__item">
        <NeoIcon id="header_logout" />
        <Translate id="menu.account.logout" />
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span ref={wrapperRef} className={`${styles.action} ${styles.account} ${styles['header-avatar-dropdown']}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={parseImgUrl(currentMerchant?.visibleAvatar,icStoreDefault)}
          alt="avatar"
        />
      </span>
    </HeaderDropdown>
  );
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
  currentMerchant: user.currentMerchant,
}))(AvatarDropdown);
