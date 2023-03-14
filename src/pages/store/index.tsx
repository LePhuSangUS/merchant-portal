import React from 'react';
import { Tag, Status } from '@/components';
import { STORE_STATUS_LIST } from '@/constants';
import TransactionList from '@/pages/transaction/list';
import TransactionDetail from '@/pages/transaction/detail';

export const renderChannels = (item: any) => (
  <>
    {
      !item?.userMobileRef
      && !item?.userPortalRef
      && '-'
    }
    {
      !!item?.userMobileRef && (
        <Tag key='AppChannel' className='customTag'>
          APP
        </Tag>
      )
    }
    {
      !!item?.userPortalRef && (
        <Tag key='WebChannel' className='customTag'>
          WEB
        </Tag>
      )
    }
  </>
)

export const renderTimes = (item: any) => (
  item?.workingTimes?.length ?
    item.workingTimes.map((i: any) => (
        <Tag
          key={`${i?.startTime}${i?.endTime}`}
          className="customTag"
        >
          {`${i?.startTime} - ${i?.endTime}`}
        </Tag>
      )
    ) : '-'
)

export const renderStatus = (item: any) => (
  <Status
    value={String(!!item?.isActive)}
    options={STORE_STATUS_LIST}
  />
)

export default {
  TransactionList,
  TransactionDetail
}
