import React, { useEffect, useState } from 'react';
import { Row, Col, Tag, Card } from '@/components';
import { ChartCard, Field } from './Charts';
import { format, translate } from '@/utils';
import { Tabs, DatePicker } from "antd";
import { getTimeDistance } from '../utils/utils';
import styles from '../style.less';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import { getDashboardSummary, getSummaryBillsByTime } from '@/services/dashboard/api';
import { useRequestAPI } from '@/hooks';

const { TabPane } = Tabs;
const { RangePicker }: any = DatePicker;
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

const KEY_ORDERS = ["PAID", "NOT_PAID", "PROCESSING", "EXPIRED", "CANCELED"]
const IntroduceRow: React.FC<any> = (props: any) => {
  const { pageName } = props;
  const [loading, setLoading] = useState<boolean>(true)
  const [sumData, setSumData] = useState([])




  const [rangePickerValue, setRangePickerValue] = useState<any>(
    getTimeDistance('month')
  )
  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value)
  }
  const configDataStatus = {
    "PAID": {
      tooltip: translate('pages.dashboard.status.paid.tooltip'),
      title: <Tag color="success">
        {translate('pages.dashboard.status.paid.label')}
      </Tag>
    },
    "NOT_PAID": {
      tooltip: translate('pages.dashboard.status.not_paid.tooltip'),
      title: <Tag color="warning">
        {translate('pages.dashboard.status.not_paid.label')}
      </Tag>
    },
    "PROCESSING": {
      tooltip: translate('pages.dashboard.status.processing.tooltip'),
      title: <Tag color="processing">
        {translate('pages.dashboard.status.processing.label')}
      </Tag>
    },
    "EXPIRED": {
      tooltip: translate('pages.dashboard.status.expired.tooltip'),
      title: <Tag color="warning">
        {translate('pages.dashboard.status.expired.label')}
      </Tag>
    },
    "CANCELED": {
      tooltip: translate('pages.dashboard.status.cancelled.tooltip'),
      title: <Tag color="default">
        {translate('pages.dashboard.status.cancelled.label')}
      </Tag>
    },

  }


  useRequestAPI({
    requestFn: getDashboardSummary,
    pageName,
    handleSuccess: (resp: any) => {
      const respData = resp?.data || []
      setLoading(false)
      setSumData(respData)
    },
    internalCall: true,
    callDepndencies: [rangePickerValue]
  },
    {
      type: 'DATE',
      fromDate: rangePickerValue?.[0]?.format("YYYY-MM-DD"),
      toDate: rangePickerValue?.[1]?.format("YYYY-MM-DD")
    })

  const mappingSumData = sumData?.map((item: any) => {
    return {
      totalAmount: item?.totalAmount,
      total: item.total,
      tooltip: configDataStatus?.[item?.state]?.tooltip,
      title: configDataStatus?.[item?.state]?.title,
      state: item.state,
    }
  })

  const sumDataWithOrders = KEY_ORDERS?.map((item) => {
    return mappingSumData?.find((subItem) => subItem?.state === item) || {
      ...configDataStatus?.[item],
      state: item,
      totalAmount: 0,
      total: 0,
    }
  })
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

    <Row >

      <Col sm={24}>
        <Card style={{ width: "100%", marginBottom: "20px" }}>
          <Tabs
            tabBarExtraContent={
              <div className={styles.salesExtraWrap}>
                <div className={styles.salesExtra}>
                  <a className={isActive('week')} onClick={() => selectDate('week')}>
                    {translate('pages.dashboard.chart.tab.weekly')}
                  </a>
                  <a className={isActive('month')} onClick={() => selectDate('month')}>
                    {translate('pages.dashboard.chart.tab.monthly')}
                  </a>
                  <a className={isActive('year')} onClick={() => selectDate('year')}>
                    {translate('pages.dashboard.chart.tab.yearly')}
                  </a>
                </div>
                <RangePicker
                  value={rangePickerValue}
                  onChange={handleRangePickerChange}
                  style={{ width: 256 }}
                />
              </div>
            }
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
          >
            <TabPane
              key="order"
              tab={translate('Statistics Overview')}
            >

              <Col sm={24}>
                <Row gutter={[6, 6]} style={{
                  justifyContent:"space-between"
                }} >
                  {
                    sumDataWithOrders?.map((item: any) => {
                      return <Col key={item?.id || item?.state} xs={24} md={12} lg={12} xl={4} style={{ marginBottom: '1em' }}>
                        <ChartCard
                          bordered={true}
                          title={item?.title}
                          toolTip={item?.tooltip}
                          loading={loading}
                          total={() => (
                            <div style={{
                              wordWrap: "break-word",
                              width: "100%",
                              display:"block"
                            }}>
                              {format.currency(item?.totalAmount || 0)}
                              {' VND'}
                              {/* <span className={styles.currency}>
                                VND
                              </span> */}
                            </div>
                          )}
                          footer={
                            <Field
                              label={translate('pages.dashboard.totalLabel')}
                              value={item?.total || 0}
                            />
                          }
                          contentHeight={50}
                        />
                      </Col>
                    })
                  }
                </Row>
              </Col>
            </TabPane>

          </Tabs>
        </Card>
      </Col>



    </Row>
  )
}

export default IntroduceRow
