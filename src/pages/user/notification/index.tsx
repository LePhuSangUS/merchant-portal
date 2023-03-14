import React, { useState, useEffect, FC } from 'react';
import {
  Container, Row, Col, Card, PageLoading, List, ListItem,
  ListItemMeta, Modal, Button, Status, Space, Icons
} from '@/components';
import { getNotifications, getNoticesCount, setNoticeRead } from '@/services/user/api';
import { parseValue, translate, format, notification } from '@/utils';
import { TRANSACTION_STATUS_LIST } from '@/constants';
import styles from './index.less';
import { connect } from 'dva'
import NotificationItemModal from './components/NotificationItemModal';
import { Link } from 'react-router-dom'
const { SendOutlined, UserOutlined } = Icons;

let currentPage = 1

const MyNotification: FC<{ [key: string]: any }> = ({ dispatch }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalItems, setTotal] = useState<number>(0)
  const [noticesList, setNoticesList] = useState<any[]>([])
  const [noticeItem, setNoticeItem] = useState<any>(null)
  const [isDetail, setIsDetail] = useState<boolean>(false)
  const [count, setCount] = useState<any>(null)

  // use to sync read notice
  const handleFetchNotices = () => {
    dispatch({
      type: 'global/fetchNotices',
    })
  }

  const getList = async (current?: number, size?: number) => {
    setLoading(true)
    const params = {
      pageIndex: current || pageIndex,
      pageSize: size || pageSize
    }
    const resp = await getNotifications(params)
    if (!resp?.success)
      notification.error(resp?.message || translate('my-notification.message.list.failed'))
    setNoticesList(resp?.data || [])
    setPageIndex(resp?.pageIndex || 1)
    currentPage = resp?.pageIndex || 1
    setPageSize(resp?.pageSize || size)
    setTotal(resp?.total)
    setLoading(false)
    return resp?.success
  }

  const getCounts = async () => {
    const resp = await getNoticesCount()
    setCount(resp?.data)
    return resp
  }

  useEffect(() => {
    getCounts().then()
    getList().then()
  }, [])

  useEffect(() => {
    const notifyListener = () => {
      getCounts().then()
      if (currentPage === 1)
        getList().then()

      handleFetchNotices()
    }
    window.socket?.on('notify', notifyListener)
    return () => {
      window.socket?.off('notify', notifyListener)
    }
  }, [window.socket])

  const detailToggle = async (item: any) => {
    setLoading(true)
    handleSeen(item)
    setNoticeItem(item)
    setIsDetail(true)
    setLoading(false)
  }
  const handleSeen = async (item: any) => {
    if (item?.status !== 'READ') {
      const resp = await setNoticeRead(item?._id)
      if (resp?.success) {
        getCounts().then()
        getList().then()
      }
      handleFetchNotices()
    }
  }
  const modalClose = () => {
    setIsDetail(false)
    setNoticeItem(null)
  }

  const renderNotiItem = (item: any) => {
    switch (item.data?.type) {
      case "PAYMENT":
        return <Link to={`/pg/transaction/${item.data?.billId}`} target="_blank">
          <ListItem
            key={item?._id}
            className='list-item'
            onClick={() => handleSeen(item)}
          >
            <ListItemMeta
              title={
                <div
                  className={`item-title icon-${item?.status !== 'READ'
                      ? 'unread'
                      : 'read'
                    }`}
                  title={item.notification?.title}
                >
                  {item.notification?.title}
                </div>
              }
              description={
                <Row gutter={20}>
                  <Col>
                    <Space
                      size='small'
                      title={translate('my-notification.field.sendBy')}
                    >
                      <UserOutlined />
                      {item?.appChannel || "-"}
                    </Space>
                  </Col>
                  <Col>
                    <Space
                      size='small'
                      title={translate('my-notification.field.sendAt')}
                    >
                      <SendOutlined />
                      {
                        item?.createdAt
                          ? format.datetimes(item.createdAt)
                          : "-"
                      }
                    </Space>
                  </Col>
                </Row>
              }
            />
            <div className='item-content'>
              {item.notification?.body}
            </div>
          </ListItem>
        </Link>
      default:
        return <ListItem
        key={item?._id}
        className='list-item'
      >
        <ListItemMeta
          title={
            <div
              className={`item-title icon-${
                item?.status !== 'READ'
                  ? 'unread'
                  : 'read'
              }`}
              onClick={() => detailToggle(item)}
              title={item.notification?.title}
            >
              {item.notification?.title}
            </div>
          }
          description={
            <Row gutter={20}>
              <Col>
                <Space
                  size='small'
                  title={translate('my-notification.field.sendBy')}
                >
                  <UserOutlined />
                  {item?.appChannel || "-"}
                </Space>
              </Col>
              <Col>
                <Space
                  size='small'
                  title={translate('my-notification.field.sendAt')}
                >
                  <SendOutlined />
                  {
                    item?.createdAt
                      ? format.datetimes(item.createdAt)
                      : "-"
                  }
                </Space>
              </Col>
            </Row>
          }
        />
        <div className='item-content'>
          <div dangerouslySetInnerHTML={{ __html: item.notification?.body?.replace(/(<([^>]+)>)/ig, '')?.replace(/\r\n[A-Z][^>]+/ig, '') }} />
        </div>
          </ListItem>
    }

  }

  return (
    <Container className={styles.container}>
      <PageLoading active={isLoading} />
      <Card>
        <div className='card-header'>
          <div>
            {translate('my-notification.text.total')}
            {`: `}
            {count?.total > 0 ? count.total : 0}
          </div>
          <div className='icon-unread'>
            {translate('my-notification.text.totalUnread')}
            {`: `}
            {count?.totalUnread > 0 ? count.totalUnread : 0}
          </div>
          <div className='icon-read'>
            {translate('my-notification.text.totalRead')}
            {`: `}
            {count?.totalRead > 0 ? count.totalRead : 0}
          </div>
        </div>
        <List
          itemLayout='vertical'
          className='list-wrap'
          dataSource={noticesList}
          pagination={
            noticesList?.length ? {
              pageSize: pageSize,
              current: pageIndex,
              total: totalItems,
              showSizeChanger: true,
              onChange: getList,
              onShowSizeChange: getList,
            } : null
          }
          renderItem={(item: any) => renderNotiItem(item)}
        />
      </Card>


      {
        (noticesList?.length && isDetail) && <NotificationItemModal noticeItem={noticeItem} onCancel={modalClose} />
      }

    </Container>
  );
};

export default connect(() => ({}))(MyNotification);
