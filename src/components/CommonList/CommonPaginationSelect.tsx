import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect, Dispatch } from 'umi';
import { Pagination, Select, SelectProps } from 'antd';

export interface DataSourceItem {
  label: string;
  value: string | number;
  [key: string]: any; // 允许其他字段
}

interface FilterItem {
  Key: string;
  Val: string | number;
}

export interface CommonPaginationSelectProps {
  fieldNames?: { label: string, value: string };
  placeholder?: string;
  options?: DataSourceItem[]; // 如果提供了静态数据，则不发起请求
  allowClear?: boolean;
  optionFilterProp?: string;
  showSearch?: boolean;
  dispatch: Dispatch; // 明确 Dispatch 类型
  payload?: Record<string, any>; // 初始过滤条件
  fetchType: string; // DVA model type
  onChange?: (value: any, values: any) => void;
  value?: any;
  size?: 'large' | 'middle' | 'small';
  selectProps?: SelectProps<any>;
  isExpand?: boolean,
  mode?: "multiple" | "tags",
  disabled?: boolean,
  style?:any
}

/**
 * 防抖
 * @param fn 
 * @param delay 
 * @returns 
 */
const debounce = (fn: Function, delay: number) => {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const CommonPaginationSelect: React.FC<CommonPaginationSelectProps> = (props) => {
  const {
    fieldNames = { label: 'label', value: 'value' },
    placeholder = '请输入内容，可实时查询',
    allowClear = true,
    showSearch = true,
    optionFilterProp = 'label',
    dispatch,
    fetchType,
    payload,
    onChange = () => { },
    value,
    size = 'middle',
    selectProps = {},
    isExpand = true,
    mode,
    disabled = false,
    style,
  } = props;
  // console.log(payload, ';payload');
  // console.log('value123111 :>> ', value);
  // 每页数量固定为 50
  const limit = 50;

  if (mode) {
    Object.assign(selectProps, mode)
  }
  if (style) {
    Object.assign(selectProps, style)
  }

  // 状态管理
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState<Record<string, any>>({});

  useEffect(() => {
    let initialFilter = payload || {};

    if (initialFilter.filter) {
      try {
        const data: FilterItem[] = JSON.parse(initialFilter.filter);
        const validFilter = data.filter((item) => item.Val && item.Val !== 'null');
        initialFilter.filter = JSON.stringify(validFilter);
      } catch (e) {
        initialFilter.filter = JSON.stringify([]);
      }
    }

    setFilterState(initialFilter);
  }, [JSON.stringify(payload)]);


  const getData = useCallback(() => {
    setLoading(true);

    dispatch({
      type: fetchType,
      payload: {
        ...payload,
        ...filterState,
        offset: (currPage - 1) * limit + 1,
        limit,
      },
      callback(res: { rows?: DataSourceItem[]; result?: DataSourceItem[]; total: number; }) {
        setLoading(false);

        let fetchedData: DataSourceItem[] = [];
        if (res.rows && res.rows.length > 0) {
          fetchedData = res.rows?.map(i => ({
            ...i,
            id: String(i.id)
          }));
        } else if (res.result && res.result.length > 0) {
          fetchedData = res.result?.map(i => ({
            ...i,
            id: String(i.id)
          }));
        }

        if (fetchedData.length > 0) {
          // 数据是否带上code编码
          if (isExpand) {
            setDataSource(fetchedData.map(i => ({
              ...i,
              [fieldNames.label]: i[fieldNames.label] + '(' + i[fieldNames.value] + ')'
            })));
          }
          else {
            setDataSource(fetchedData)
          }
        } else {
          setDataSource([]);
        }
        setTotalNum(res.total || 0);
      },
    });
  }, [currPage, filterState]);

  useEffect(() => {
    getData();
  }, [getData]);


  const handlePaginationChange = useCallback((page: number) => {
    setCurrPage(page);
  }, []);

  const handleChange = useCallback((val: any, vals: any) => {
    onChange(val, vals);
  }, [onChange]);

  const handleSearch = useMemo(() => debounce((value: string) => {
    setCurrPage(1);

    setFilterState(prevFilterState => {
      const copyValues = { ...prevFilterState };
      let filter: FilterItem[] = [];

      if (copyValues.filter) {
        try {
          filter = JSON.parse(copyValues.filter) as FilterItem[];
          filter = filter.filter(item => item.Key !== optionFilterProp);
        } catch (e) {
          filter = [];
        }
      }

      if (value) {
        filter.push({ Key: optionFilterProp, Val: value });
      }

      copyValues.filter = JSON.stringify(filter);
      return copyValues;
    });
  }, 300), [optionFilterProp]);


  return (
    <Select
      {...selectProps}
      loading={loading}
      size={size}
      disabled={disabled}
      mode={mode}
      showSearch={showSearch}
      fieldNames={fieldNames}
      placeholder={placeholder}
      options={dataSource}
      allowClear={allowClear}
      optionFilterProp={optionFilterProp}
      onSearch={handleSearch}
      onChange={handleChange}
      onClear={() => {
        handleSearch('');
      }}
      value={value}
      dropdownRender={menu => (
        <>
          {menu}
          {(totalNum > limit || currPage > 1) && (
            <div style={{ padding: '8px 0 0', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0' }}>
              <Pagination
                size={"small"}
                onChange={handlePaginationChange}
                simple
                current={currPage}
                defaultPageSize={limit}
                total={totalNum}
                showTotal={total => `总数 ${total}`}
              />
            </div>
          )}
        </>
      )}
    />
  );
};

export default connect()(CommonPaginationSelect);