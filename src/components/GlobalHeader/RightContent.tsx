import React, { useState, useEffect, useRef } from 'react';
import type { ConnectState } from '@/models/connect';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import type { ConnectProps } from 'umi';
import { connect, history } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { Icons, Badge } from '@/components';
import { parseValue } from "@/utils";
import { getNoticesCount } from "@/services/user/api";
import classNames from 'classnames';
import SwitchLanguage from './SwitchLanguage';
import NeoIcon from '@/assets/icons/custom';
import { useBoolean } from 'react-use';
import { useOutsideAlerter } from '@/hooks';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
} & Partial<ConnectProps> & Partial<ProSettings>

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props: any) => {
  const { theme, layout } = props
  const [count, setCount] = useState<any>(null)
  const [trigger, toggle] = useBoolean(false);
  const wrapperRef = useRef(null);

  const pathname = history.location.pathname;
  const handler = () => {
    setTimeout(toggle, 100);
  }
  useOutsideAlerter(wrapperRef, handler);

  let className = styles.right

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`
  }

  const getCounts = async () => {
    const resp = await getNoticesCount()
    setCount(resp?.data)
    return resp?.data
  }

  useEffect(() => {
    getCounts().then()
  }, [])

  useEffect(() => {
    const notifyListener = () => getCounts().then()
    window.socket?.on('notify', notifyListener)
    window.socket?.on('refreshNotify', notifyListener)
    return () => {
      window.socket?.off('notify', notifyListener)
      window.socket?.off('refreshNotify', notifyListener)
    }
  }, [window.socket])

  return (
    <div className={className} style={{ gap: 10 }}>
      <SwitchLanguage className={classNames(styles.action, styles['header__switch-language'])} />
      <div style={{ padding: '0 0', display: 'flex' }}>
        <div onClick={toggle} ref={wrapperRef} className={classNames(styles.action, styles['header__noti-icon'], { [styles['header__noti-icon--active']]: pathname === '/my-notification' })}>
          <Badge
            count={
              count?.totalUnread > 0
                ? count.totalUnread
                : 0
            }
            overflowCount={99}
            onClick={() => history.push('/my-notification')}
            title={
              parseValue({
                vi: 'Thông báo',
                en: 'Notification'
              })}
          >
            <NeoIcon id="header_notification" style={{
              width: 22,
              height: 22,
            }} />
          </Badge>
        </div>
      </div>
      <Avatar menu />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
