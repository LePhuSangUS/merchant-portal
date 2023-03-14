import styles from './Table.less';
import { Table, Form, Row, Col } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useEffect, useState,useCallback, Fragment, ReactNode } from 'react';
import * as queryString from 'query-string';
import _, { isString, set } from 'lodash';
import { format, translate } from '@/utils';
import { icSearch, icEmpty } from '@/assets/icons/table';
import { connect } from 'dva';
import { useLocation } from 'react-router-dom';
import ButtonAction from './ButtonAction';
import ButtonFilter from './ButtonFilter';
import { useToggle, useDebounce } from 'react-use';
import { FormItem } from '@/components';
import { DateRangePicker, FormText } from '@/new_components';
import moment from 'moment';
import { Spin } from 'antd';

const isEqual = require('react-fast-compare');

const initParams = {
  pageSize: 20,
  pageIndex: 1,
};
interface ITableProps extends TableProps<any> {
  defaultParams?: {
    pageSize?: number;
    pageIndex?: number;
  };
  filterable?: boolean;
  renderSearchFilter?: () => ReactNode;
  locale?: any;
  getDataFromAPI?: (params?: any) => {};
  showActionRow?: boolean;
  renderActionRow?: (value?: any, record?: any) => ReactNode;
  tableTitle: string;
  renderTableAction?: () => ReactNode;
  global: any;
  localeTableEmpty?: ReactNode | null;
  isTableEmpty?: boolean;
}

const CustomTable = (props: ITableProps) => {
  const {
    filterable = false,
    dataSource = [],
    getDataFromAPI,
    defaultParams = {},
    showActionRow = false,
    renderActionRow,
    renderTableAction,
    tableTitle,
    columns = [],
    renderSearchFilter,
    global = {},
    isTableEmpty = false,
    localeTableEmpty,
    locale = {
      emptyText: (
        <Row className={styles.empty}>
          <img src={icEmpty} alt="icons" />
          <p>{translate('Information not found, please try again.')}</p>
        </Row>
      ),
    },
    ...rest
  } = props;
  let location = useLocation();

  const { pathname } = location;
  const parsed = queryString.parse(location.search);
  const [params, setParams] = useState<any>({ ...initParams, ...defaultParams, ...parsed });
  const [dataSourceState, setDataSourceState] = useState(dataSource);
  const [totalPagesState, setTotalPagesState] = useState(1);
  const [totalDocsState, setTotalDocsState] = useState(0);
  const [showFilter, toggleShowFilter] = useToggle(false);
  const [searchFilterValues, setSearchFilterValues] = useState({});
  const [loading, toggleLoading] = useToggle(true);
  const [isEmptyData, setIsEmptyData] = useToggle(true);
  const { reloadTable } = global;

  const renderSearchFilterDefault = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <FormText
            name="keyword"
            fieldProps={{
              prefix: <img style={{ marginRight: '10px' }} src={icSearch} />,
              size: 'large',
            }}
            placeholder={translate('Placeholder: Enter search keywords')}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <FormItem name="DATE_RANGE">
            <DateRangePicker style={{ width: '100%' }} size="large" />
          </FormItem>
        </Col>
      </Row>
    );
  };

  const checkFilterEmpty = (searchFilterValues = {}) => {
    const paramsOmitFalsy = _.pickBy(searchFilterValues, (value) => {
      if (_.isString(value)) {
        return !_.isEmpty(value?.trim());
      }
      return !_.isEmpty(value);
    });
    return _.isEmpty(paramsOmitFalsy);
  };

  //Start Map columns
  const mapColumnsFunc: any = () => {
    const cloneColumns = _.cloneDeep(columns);
    if (showActionRow) {
      cloneColumns?.push({
        title: '',
        dataIndex: 'action',
        key: 'action',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (value: any, record: any) => (
          <ButtonAction value={value} record={record} renderActionRow={renderActionRow} />
        ),
      });
    }
    return cloneColumns;
  };
  //End map Column
  //Get Data From Server
  useEffect(() => {
    if (getDataFromAPI) {
      const getData = async () => {
        try {
          const paramsOmitFalsy = _.pickBy(params, (value) => {
            if (_.isString(value)) {
              return !_.isEmpty(value?.trim());
            }
            return !_.isEmpty(value);
          });
          console.log('paramsTrim.', paramsOmitFalsy);
          toggleLoading(true);
          const response: any = await getDataFromAPI(paramsOmitFalsy);
          // console.log(response);
          setDataSourceState(response?.data?.docs);
          const docs = response?.data?.docs;
          const page = response?.data?.page;
          const totalPages = response?.data?.totalPages;
          const totalDocs = response?.data?.totalDocs;
          setTotalPagesState(totalPages);
          setTotalDocsState(totalDocs);
          if (_.isArray(docs)) {
            setDataSourceState(docs);
          }
          console.log('searchFilterValues', searchFilterValues);

          if (_.isEmpty(docs) && checkFilterEmpty(searchFilterValues)) {
            setIsEmptyData(true);
            toggleShowFilter(false);
          } else {
            setIsEmptyData(false);
          }
        } catch (error) {
          console.error(error);
        } finally {
          toggleLoading(false);
        }
      };
      getData();
    }
  }, [params, reloadTable]);

  //End get data
  //Start Pagination
  const handleChangeParams = (pagination: any, filters: any, sorter: any) => {
    console.log('pagination', pagination);
    console.log('sorter', sorter);
    console.log('filters', filters);
    console.log('params', params);
    const pageIndex = pagination.current;
    if (pageIndex !== params.pageIndex) {
      setParams({ ...params, ...searchFilterValues, pageIndex });
    }
  };
  const paginationFunc: any = () => {
    return totalDocsState <= (defaultParams?.pageSize || 20)
      ? false
      : {
          pageSize: params?.pageSize,
          total: totalDocsState,
        current: params.pageIndex,
        showTotal:(total:number, range:any) => `${range[0]}-${range[1]} ${translate("Out of")} ${total}`
        };
  };
  //End Pagination

  console.log('==========PARAMS TABLE============', params);
  //Start Search Filter
  const debounceSearch = useCallback(_.debounce((searchFilterValues) => setParams({ ...defaultParams, ...searchFilterValues }), 800), [])

  const handleSearchFilter = (values: any) => {
    console.log(values);
    let filterDate = {};
    if (
      values?.DATE_RANGE &&
      moment(values?.DATE_RANGE?.[0]).isValid() &&
      moment(values?.DATE_RANGE?.[1]).isValid()
    ) {
      filterDate = {
        dateFr: moment(values?.DATE_RANGE?.[0]).startOf('date').toISOString(),
        dateTo: moment(values?.DATE_RANGE?.[1]).endOf('date').toISOString(),
      };
    } else {
      filterDate = { ...values };
    }
    setSearchFilterValues({ ...filterDate });
    debounceSearch({ ...filterDate })
  };

  const handleToggleFilter = () => {
    toggleShowFilter();
    if (!isEqual(params, defaultParams)) {
      setParams({...defaultParams})
        
      }
    setSearchFilterValues({}); //if close filter => clear data
  };

  const renderTitle = () => {
    return (
      <Fragment>
        <Row
          gutter={[0, 16]}
          className={styles.titleBlock}
          align={'middle'}
          justify={'space-between'}
        >
          <Col xs={24} sm={24} md={12} className={styles.title}>
            {tableTitle}
          </Col>
          <Col xs={24} sm={24} md={12} className={styles.filterActionBlock}>
            {!isEmptyData && !isTableEmpty && (
              <Fragment>
                {filterable && (
                  <ButtonFilter toggleShowFilter={() => handleToggleFilter()}></ButtonFilter>
                )}
                {renderTableAction && renderTableAction()}
              </Fragment>
            )}
          </Col>
        </Row>
        {filterable && showFilter && !isEmptyData && !isTableEmpty && (
          <Form
            className={styles.searchForm}
            name="basic"
            onValuesChange={handleSearchFilter}
            autoComplete="off"
            // fields={itemsRender?.filter(item => !item.search)?.map(item => item.name)}
          >
            {_.isFunction(renderSearchFilter) ? renderSearchFilter() : renderSearchFilterDefault()}
          </Form>
        )}
      </Fragment>
    );
  };

  const renderLocale = () => {
    if (isTableEmpty) return localeTableEmpty;
    if (loading)
      return {
        emptyText: (
          <Row className={styles.empty}>
            <Spin size="large" />
          </Row>
        ),
      };
    if (isEmptyData) return localeTableEmpty;
    return locale;
  };
  const checkShowHeader = () => {
    if (isTableEmpty) return false;
    if (isEmptyData) return false;
    return true;
  };

  //Render UI
  return (
    <div className={styles.component}>
      <Table
        {...rest}
        title={renderTitle}
        columns={mapColumnsFunc()}
        dataSource={dataSourceState}
        pagination={paginationFunc()}
        onChange={handleChangeParams}
        locale={renderLocale()}
        showHeader={checkShowHeader()}
      ></Table>
    </div>
  );
};

export default connect(({ global }: any) => ({
  global,
}))(CustomTable);
