import React, { Component } from 'react';
import type { ConnectProps } from 'umi';
import { connect } from 'umi';
import { Tag, message } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import type { NoticeItem } from '@/models/global';
import type { CurrentUser } from '@/models/user';
import type { ConnectState } from '@/models/connect';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { parseValue } from '@/utils';

export type GlobalHeaderRightProps = {
  notices?: NoticeItem[];
  currentUser?: CurrentUser;
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
} & Partial<ConnectProps>;

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  changeReadState = (clickedItem: NoticeItem): void => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title: string, key: string) => {
    const { dispatch } = this.props;
    message.success(`${'Đã xóa'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = (): Record<string, NoticeItem[]> => {
    const { notices = [] } = this.props;

    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime as string).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = (noticeData: Record<string, NoticeItem[]>) => {
    const unreadMsg: Record<string, number> = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { currentUser, fetchingNotices, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={currentUser && currentUser.unreadCount}
        onItemClick={(item) => {
          this.changeReadState(item as NoticeItem);
        }}
        loading={fetchingNotices}
        clearText={
          parseValue({
            vi: 'Xóa',
            en: 'Clear'
          })
        }
        viewMoreText={
          parseValue({
            vi: 'Xem thêm',
            en: 'View more'
          })
        }
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => (
          message.info(
            parseValue({
              vi: 'Bấm để xem thêm',
              en: 'Click on view more'
            })
          )
        )}
        clearClose
      >
        <NoticeIcon.Tab
          showViewMore
          tabKey="notification"
          count={unreadMsg.notification}
          list={noticeData.notification}
          title={
            parseValue({
              vi: 'Thông báo',
              en: 'Notification'
            })
          }
          emptyText={
            parseValue({
              vi: 'Không có thông báo mới',
              en: 'No new announcements'
            })
          }
        />
        <NoticeIcon.Tab
          showViewMore
          tabKey="message"
          count={unreadMsg.message}
          list={noticeData.message}
          title={
            parseValue({
              vi: 'Tin nhắn',
              en: 'Message'
            })
          }
          emptyText={
            parseValue({
              vi: 'Không có tin nhắn mới',
              en: 'No new messages'
            })
          }
        />
        <NoticeIcon.Tab
          showViewMore
          tabKey="event"
          count={unreadMsg.event}
          list={noticeData.event}
          title={
            parseValue({
              vi: 'Sự kiện',
              en: 'Event'
            })
          }
          emptyText={
            parseValue({
              vi: 'Không có sự kiện mới',
              en: 'No new events'
            })
          }
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
