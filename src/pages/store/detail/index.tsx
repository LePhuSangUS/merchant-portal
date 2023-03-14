import React, { useState, useEffect } from 'react';
import { getMerchantStoreDetail, updateMerchantStore } from '@/services/merchantstore/api';
import { Container, PageLoading, TabPane, Tabs } from '@/components';
import { translate, notification, message } from '@/utils';
import StoresTab from './components/store.detail';
import UsersTab from './components/users.list';
import styles from './style.less';

interface StoreProps {
  match: any,
  history: any
}

const StoreDetail: React.FC<StoreProps> = ({ match, history }) => {
  const tabs = [
    {
      key: 'info',
      title: translate('merchantStore.title.storeInfo')
    },
    {
      key: 'user',
      title: translate('merchantStore.title.userInfo')
    }
  ]

  const id = match?.params?.id
  const [storeItem, setStoreItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<any>(tabs[0].key)
  const [isLoading, setLoading] = useState<boolean>(false)

  const getStoreDetail = async (storeId: any) => {
    if (!storeId) return
    setLoading(true)
    const resp = await getMerchantStoreDetail(storeId)
    setStoreItem(resp?.data || {})
    if (!resp?.success) {
      notification.error(resp?.message || translate('merchantStore.message.detail.failed'))
      history.push('/store/list')
    }
    setLoading(false)
  }

  const tabChange = (tabId: any) => {
    setActiveTab(tabId)
    const param = new URLSearchParams()
    if (tabId) param.append("tab", tabId)
    history.push({ search: param.toString() })
  }

  useEffect(() => {
    if (
      history?.location?.query?.tab
      && tabs.some((i: any) => i?.key === history.location.query.tab)
    ) setActiveTab(history.location.query.tab)
  }, [history])

  useEffect(() => {
    getStoreDetail(id).then()
  }, [id])

  const editSubmit = async (values: any) => {
    setLoading(true)
    const resp = await updateMerchantStore(values)
    if (!resp?.success)
      notification.error(translate('merchantStore.message.update.failed'))
    else {
      message.success(translate('merchantStore.message.update.success'))
      getStoreDetail(id).then()
    }
    setLoading(false)
  }

  return (
    <Container className={styles.container}>
      <PageLoading active={isLoading} />
      <Tabs
        type='card'
        activeKey={activeTab}
        defaultActiveKey={tabs[0].key}
        onChange={tabChange}
        tabBarStyle={{ margin: 0 }}
      >
        <TabPane
          key={tabs[0].key}
          tab={tabs[0].title}
        >
          <StoresTab
            store={storeItem}
            formSubmit={editSubmit}
          />
        </TabPane>
        <TabPane
          key={tabs[1].key}
          tab={tabs[1].title}
        >
          <UsersTab id={id} />
        </TabPane>
      </Tabs>
    </Container>
  )
}

export default StoreDetail
