import React, { Suspense, useState, useEffect, FC } from 'react';
import type moment from "moment";
import { Container, PageLoading } from '@/components';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import IntroduceRow from './components/IntroduceRow';
import StatisticChartCard from './components/StatisticChartCard';
import YellowWalletBalance from './components/YellowWalletBalance';
import type { TimeType } from './components/StatisticChartCard';
import { getDashboardSummary, getSummaryBillsByTime } from '@/services/dashboard/api';
import { getTimeDistance } from './utils/utils';
import { Typography } from "antd"
import styles from './style.less';
import { useRequestAPI } from '@/hooks';
import { translate, message } from '@/utils';
import _ from "lodash"
const { Title } = Typography;
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
interface DashboardProps {
  route: Record<string, any>;
}
const Dashboard: FC<DashboardProps> = ({ route }) => {
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('month')
  )

  const initData = [{
    date: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    state: "NOT_PAID",
    total: 0
  },
  {
    date: rangePickerValue?.[1]?.format("YYYY-MM-DD"),
    state: "NOT_PAID",
    total: 0
  },
  {
    date: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    state: "PAID",
    total: 0
  },
  {
    date: rangePickerValue?.[1]?.format("YYYY-MM-DD"),
    state: "PAID",
    total: 0
  },
  {
    date: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    state: "EXPIRED",
    total: 0
  },
  {
    date: rangePickerValue?.[1]?.format("YYYY-MM-DD"),
    state: "EXPIRED",
    total: 0
  },
  {
    date: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    state: "CANCELED",
    total: 0
  },
  {
    date: rangePickerValue?.[1]?.format("YYYY-MM-DD"),
    state: "CANCELED",
    total: 0
  },
  {
    date: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    state: "PROCESSING",
    total: 0
  },
  {
    date: rangePickerValue?.[1]?.format("YYYY-MM-DD"),
    state: "PROCESSING",
    total: 0
  },
  ]

  const [sumByTimeData, setSumByTime] = useState<any[]>([...initData])
  const {isLoading }=useRequestAPI({
    requestFn: getSummaryBillsByTime,
    pageName: route?.name,
    handleSuccess: (resp) => {
      const respData = resp?.data;
      if (_.isArray(respData)) {
       
        const newData = [...initData, ...respData];
        const newDataFilter: any = newData?.filter((item: any) => {
          const filterResult = newData.find((subItem: any) => {
            return (item.date === subItem.date && item.state === subItem.state && subItem.total && item.total !== subItem.total) ;
          })
          return !filterResult
        })
        newDataFilter?.sort((a: any, b: any) => {
          const d1: any = a?.date ? new Date(a.date) : 0
          const d2: any = b?.date ? new Date(b.date) : 0
          return d1 - d2
        })        
        setSumByTime(newDataFilter)

      }
    },
    internalCall: true,
    callDepndencies: [rangePickerValue]
  },
  {
    type: 'DATE',
    fromDate: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
    toDate: rangePickerValue?.[1]?.format("YYYY-MM-DD")
  })



  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value)
  }

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) return ''
    const value = getTimeDistance(type)
    if (!value) return ''
    if (!rangePickerValue?.[0] || !rangePickerValue?.[1]) return ''
    if (
      rangePickerValue?.[0]?.isSame(value?.[0] as moment.Moment, 'day')
      && rangePickerValue?.[1]?.isSame(value?.[1] as moment.Moment, 'day')
    ) return styles.currentDate
    return ''
  }

  return (
    <Container>
      <Suspense fallback={<PageLoading active />}>
        <YellowWalletBalance />
        <Title className={styles.statisticTitle} level={2}>{ translate("Total current orders in systems Statistics")}</Title>
        <IntroduceRow pageName={route?.name} />
      </Suspense>
      <Suspense fallback={null}>
        <StatisticChartCard
          rangePickerValue={rangePickerValue}
          transData={sumByTimeData || []}
          isActive={isActive}
          handleRangePickerChange={handleRangePickerChange}
          loading={isLoading}
          selectDate={selectDate}
        />
      </Suspense>
    </Container>
  )
}

export default Dashboard
