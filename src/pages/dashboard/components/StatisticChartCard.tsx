import React,{useState,useEffect} from 'react';
import type moment from 'moment';
import { Card, Col, DatePicker, Row, Tabs, Empty } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import { Line } from '@ant-design/charts';
import { translate, parseValue } from '@/utils';
import { BILL_STATUS_CHART } from '@/constants/dashboard.constant';
import styles from '../style.less';
import { getProperty } from '@/utils/curry';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

const { RangePicker }:any = DatePicker;
const { TabPane } = Tabs;

const mergeItemsFromResponseData = (items: any) => {
  return (items || []).reduce((acc: any, current: any) => {
    const x = (acc || []).find((item: any) => item?.state === current?.state);
    if (!x) return acc?.concat?.([current]);
    else return acc;
  }, []);
}

const legendItems = (transData: any) => {
  const filteredArr = mergeItemsFromResponseData(transData);
  return (
    filteredArr?.length
      ? filteredArr.map((item: any) => (
        BILL_STATUS_CHART.filter((i: any) => (
          i?.name === item?.state
        ))?.[0]
      )).sort((a: any, b: any) => (
        a?.order - b?.order
      )) : []
  )
}


const RenderChart = (props:any) => {
  const { transDataFiltered } = props;
  const config = {
    data: transDataFiltered,
    xField: 'date',
    yField: 'total',
    seriesField: 'state',
    smooth: true,
    yAxis: {
      label: {
        formatter: function formatter(v: any) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
    color: function color(_ref: any) {
      return BILL_STATUS_CHART.filter((i: any) => i?.name === _ref?.state)?.[0]?.color;
    },
    tooltip: {
      formatter: (item: any) => {
        const label = parseValue(BILL_STATUS_CHART.filter((i: any) => i?.name === item?.state)?.[0]?.label);
        return { name: label, value: item?.total };
      },
    },
    legend:{
      position: 'top',
      itemName: {
        // because we use custom chart, should be set value display on legend
        formatter: function formatter(name: string, item: any) {
          return parseValue(item?.label);
        }
      },
      // custom: true,
      items: BILL_STATUS_CHART.map((item:any) => {
        return {
          name: item.name,
          value: item.name,
          label:item.label,
          marker:item.marker
        }
      })       
    },
  };    

    return   <Line {...config} />
  }

interface CardProps {
  rangePickerValue: RangePickerValue;
  isActive: (key: TimeType) => string;
  transData: any;
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: TimeType) => void;
}

const StatisticChartCard: React.FC<CardProps> = ({
  rangePickerValue,
  transData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => {
  const currentStatus = BILL_STATUS_CHART?.map(getProperty('name'))
  const transDataFiltered = transData?.filter((item: any) => currentStatus?.includes(item?.state));
  

  return (
    <Card
      // loading={loading}
      bordered={false}
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.salesCard}>
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
            tab={translate('Statistics Chart')}
          >
            <Row>
              <Col xs={24}>
                <div className={styles.salesBar}>
                  {
                    transDataFiltered?.length  ? (
                      // @ts-ignore
                      <RenderChart transDataFiltered={ transDataFiltered} />
                    ) : (
                      <Empty />
                    )
                  }
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
}

export default StatisticChartCard;
