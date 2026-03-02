import React, { useState, useEffect, useRef } from 'react';
import { Select, List, Spin, Empty } from 'antd';
import { debounce } from 'lodash';
import { connect } from "umi";

const { Item } = List;

// 类型声明
export interface CustomSelectProps {
  fetchConfig: {
    dispatch: any; // 发送请求的工具函数
    type: string; // 要调用的接口类型
    payload?: Record<string, any>; // 额外的参数
    searchKey?: string; // 搜索时要传给后台的字段名
  };
  // 字段映射
  fieldNames?: { label: string; value: string };
  // 自定义选项渲染 - 可以自己写下拉框的样式
  renderItem?: (item: any) => React.ReactNode;
  // 下拉框宽度
  dropdownWidth?: number | string;
  // 每页显示条数
  pageSize?: number;
  // 当前选中的值
  value?: any;
  // 值变化时的回调
  onChange?: (value: any, option: any) => void;
  // 表单实例
  form?: any;
  // 字段名 - label
  fieldName?: string;
  // 文本提示
  placeholder?: string;
  // 是否搜索
  showSearch?: boolean;
  // 是否允许清除
  allowClear?: boolean;
  // 自定义样式
  style?: React.CSSProperties;
}

/**
 * 自定义下拉框选择器组件
 * 该组件用于项目基本信息模块的《动态增减表单列的《内部施工单位
 * @param param - 包含所有传递给组件的props对象
 * @returns 返回自定义选择器的JSX元素
 */
const CustomSelect: React.FC<CustomSelectProps> = ({
  fetchConfig,
  fieldNames = { label: 'label', value: 'value' },
  renderItem,
  dropdownWidth,
  pageSize = 10,  // 默认每页显示10条
  // 值相关参数
  value: propValue,
  onChange: propOnChange,
  // 表单相关参数
  form,
  fieldName,
  // UI相关参数
  placeholder = '请选择',
  showSearch = true,
  allowClear = true,
  style,

  // ...restProps Select原生组件属性
  ...restProps
}) => {
  // open: 下拉框是否打开
  const [open, setOpen] = useState(false);
  // options: 选项数据列表
  const [options, setOptions] = useState<any[]>([]);
  // isLoading: 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // total: 数据总数
  const [total, setTotal] = useState(0);
  // currentPage: 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // keyword: 搜索关键词
  const [keyword, setKeyword] = useState('');
  // displayValue: Select显示的值
  const [displayValue, setDisplayValue] = useState<any>(null);
  // selectRef: 保存Select组件的引用
  const selectRef = useRef<any>(null);
  // valueRef: 保存上一次的value值（避免重复操作）
  const valueRef = useRef<any>(null);

  /**
   * 优先级：propValue > form.getFieldValue > undefined
   * @returns 显示哪个值
   */
  const getCurrentValue = (): any => {
    if (propValue !== undefined) return propValue;
    if (form && fieldName) return form.getFieldValue(fieldName);
    return undefined;
  };

  const value = getCurrentValue();  // 当前选中的值

  // loadData函数：负责加载数据
  const loadData = async (searchValue = '', page = 1) => {
    // 检查有没有dispatch工具，没有就直接返回
    if (!fetchConfig?.dispatch) {
      console.warn('dispatch不存在');
      return;
    }

    setIsLoading(true);  // 开始加载loading
    try {
      // 准备要发送给后台的参数
      const payload: any = {
        ...(fetchConfig.payload || {}),  // 基础参数
        offset: (page - 1) * pageSize,   // 从第几条开始（用于分页）
        limit: pageSize,                 // 要几条数据
      };

      // 如果有搜索关键词，就加到参数里
      if (searchValue && fetchConfig.searchKey) {
        payload[fetchConfig.searchKey] = searchValue;
      }

      // 发送请求
      const res = await fetchConfig.dispatch({ type: fetchConfig.type, payload });

      // 处理返回的数据，兼容不同的后台返回格式
      let list = res.rows || res.result || res.data || [];
      let total = res.total || res.count || 0;

      // 更新组件的状态
      setOptions(list); // 保存数据列表
      setTotal(total); // 保存数据总数
      setCurrentPage(page); // 更新当前页码
      setKeyword(searchValue); // 保存搜索词

      // 检查当前选中的值是否在新加载的数据里
      if (value) {
        const exists = list.some(item => {
          const itemValue = item[fieldNames.value];
          return itemValue === value;
        });

        // 如果在，就更新显示的文字
        if (exists) {
          const foundItem = list.find(item => {
            const itemValue = item[fieldNames.value];
            return itemValue === value;
          });
          setDisplayValue(foundItem?.[fieldNames.label] || foundItem?.dict_name || value);
        }
      }
    } catch (err) {
      // 出错了就清空数据
      console.error('数据加载失败:', err);
      setOptions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);  // 结束加载，隐藏loading
    }
  };

  // 这个函数处理回显：比如表单编辑时，要显示之前选中的值
  const handleEcho = async (val: any) => {
    if (!val || !fetchConfig?.dispatch) {
      return;
    }

    // 先检查这个值是不是已经在选项列表里
    const exists = options.some(item => {
      const itemValue = item[fieldNames.value];
      return itemValue === val;
    });

    // 如果fieldNames.value在数据列表中有的话，直接使用现有的数据
    if (exists) {
      const foundItem = options.find(item => {
        const itemValue = item[fieldNames.value];
        return itemValue === val;
      });
      setDisplayValue(foundItem?.[fieldNames.label] || foundItem?.dict_name || val);
      return;
    }

    // 如果不在，需要调用接口单独请求这个值的数据
    const type = fetchConfig.type;
    const payload = {
      ...(fetchConfig.payload || {}),
      id: val,  // 告诉后台我要找这个ID的数据
    };

    try {
      // 单独请求这个值的数据
      const res = await fetchConfig.dispatch({ type, payload });

      // 处理返回数据
      let rawData = res?.data || res?.result || res?.row || res;

      if (Array.isArray(rawData)) {
        rawData = rawData[0];  // 如果是数组，取第一条
      }

      if (rawData && (rawData.rows || rawData.data)) {
        const list = rawData.rows || rawData.data;
        rawData = list && list[0] ? list[0] : null;
      }

      if (rawData) {
        // 设置显示的文字
        setDisplayValue(rawData[fieldNames.label] || rawData.dict_name || val);

        // 把这个数据也加到选项列表里，方便下次查找
        setOptions(prev => {
          const existsInPrev = prev.some(item => {
            const itemValue = item[fieldNames.value];
            return itemValue === val;
          });
          return existsInPrev ? prev : [...prev, rawData];
        });
      } else {
        // 没找到数据，就显示原始值
        setDisplayValue(val);
      }
    } catch (err) {
      console.warn('回显失败', err);
      setDisplayValue(val);
    }
  };

  // 防抖的回显函数：避免用户快速操作时频繁请求
  // 比如：如果100ms内连续调用，只执行最后一次
  const debouncedHandleEcho = debounce(handleEcho, 100);

  useEffect(() => {
    // 如果值没变化，就不处理
    if (valueRef.current === value) return;
    valueRef.current = value;  // 记录新的值

    if (!value) {
      // 值为空，清空显示
      setDisplayValue(null);
      return;
    }

    // 检查当前值是否在选项列表中
    const existsInOptions = options.some(item => {
      const itemValue = item[fieldNames.value];
      return itemValue === value;
    });

    if (existsInOptions) {
      // 在列表中，直接使用列表中的数据
      const foundItem = options.find(item => {
        const itemValue = item[fieldNames.value];
        return itemValue === value;
      });
      setDisplayValue(foundItem?.[fieldNames.label] || foundItem?.dict_name || value);
    } else {
      // 不在列表中，先显示原始值，然后去后台获取详细数据
      setDisplayValue(value);
      debouncedHandleEcho(value);
    }
  }, [value, options]);

  useEffect(() => {
    // 如果组件加载时有值，就去回显这个值
    if (value) {
      debouncedHandleEcho(value);
    }
  }, []); // 只在加载时执行一次

  // 搜索处理函数
  const handleSearch = (searchValue: string) => {
    loadData(searchValue, 1);  // 搜索时总是从第一页开始
  };

  // 防抖的搜索函数：用户输入时不会每打一个字就请求一次
  // 而是等用户停止输入300ms后才请求
  const debouncedSearch = useRef(
    debounce(handleSearch, 300)
  ).current;

  /**
 * 处理下拉框打开状态变化的回调函数
 * @param isOpen - 表示当前是否打开下拉框状态
 * 下拉框打开时返回true，否则返回false
 */
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    // 如果是第一次打开并且没有数据，就加载数据
    if (isOpen && options.length === 0) {
      loadData();
    }
  };

  /**
  * 处理选择项的回调函数
  * @param item - 选中的选项对象有value和label属性
  * 拿到用户选择的值，并赋值给表单或者父组件，并关闭下拉框
  */
  const handleSelect = (item: any) => {
    // 获取 item对象中的指定字段名对应的值 如：{value:"1",label:"a"}
    // selectedValue 这里拿的是1
    const selectedValue = item[fieldNames.value];
    // 通知父组件选择的值发生变化
    propOnChange?.(selectedValue, item);
    // 如果组件在表单中使用，需要更新对应表单字段的值
    if (form && fieldName) {
      form.setFieldsValue({ [fieldName]: selectedValue });
    }

    // 更新界面显示的文本内容
    setDisplayValue(item[fieldNames.label] || item.dict_name);
    // 选择完成后关闭下拉选择框
    setOpen(false);
  };
  /**
  * 处理清空操作的函数
  * @remarks
  * 该函数用于清空当前组件的值，并传递到父组件和表单
  * @param propOnChange - 父组件传入的onChange回调函数，用于通知父组件值已清空
  */
  const handleClear = () => {
    // 通知父组件清空操作
    propOnChange?.(undefined, undefined);
    // 如果组件在表单中使用，清空对应的表单字段值
    if (form && fieldName) {
      form.setFieldsValue({ [fieldName]: undefined });
    }

    // 清空界面显示的文本内容
    setDisplayValue(null);
  };

  /**
 * 处理页面切换事件
 * @param page - 要切换到的页码
 */
  const handlePageChange = (page: number) => {
    // 用户点了第几页，就加载第几页的数据
    loadData(keyword, page);
  };

  // 完全自定义的下拉框内容
  const customDropdown = (
    <div style={{
      width: '100%',
      maxHeight: 270,
      overflow: 'auto',   // 超出部分显示滚动条
    }}>
      {/* 加载时显示转圈圈 */}
      <Spin spinning={isLoading}>
        {/* Antd的List组件，用来显示列表 */}
        <List
          // 分页配置：数据多于一页时才显示分页
          pagination={total > pageSize ? {
            position: 'bottom',
            pageSize,
            current: currentPage,
            total,
            size: 'small',
            showSizeChanger: false,  // 不显示每页条数切换
            onChange: handlePageChange,  // 点击分页时的回调
          } : false}
          dataSource={options}
          // 空数据时显示的内容
          locale={{ emptyText: <Empty description="暂无数据" /> }}
          // 渲染每个列表项
          renderItem={(item) => (
            <Item
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                // 如果这个选项是当前选中的，就高亮显示
                backgroundColor: value === item[fieldNames.value] ? '#e6f7ff' : undefined,
              }}
              // 点击时选中这个选项
              onClick={() => handleSelect(item)}
            >
              {/* 如果有自定义渲染函数就用自定义的，否则用默认的 */}
              {renderItem ? renderItem(item) : (item[fieldNames.label] || item.dict_name)}
            </Item>
          )}
        />
      </Spin>
    </div>
  );

  return (
    <Select
      {...restProps}  // 传递其他所有参数
      ref={selectRef}
      open={open}
      value={displayValue}
      placeholder={placeholder}
      showSearch={showSearch} // 配置是否可搜索
      allowClear={allowClear}
      filterOption={false} // 是否根据输入项进行筛选。
      loading={isLoading} // 加载状态
      style={{ width: '100%', ...style }}
      onSearch={showSearch ? debouncedSearch : undefined} // 搜索时的回调
      onDropdownVisibleChange={handleOpenChange} // 下拉框开关时的回调
      onChange={handleClear}
      onClear={handleClear}
      dropdownRender={() => customDropdown} // 自定义下拉框内容
      // 设置下拉框的宽度（如果有传dropdownWidth就生效）
      dropdownStyle={dropdownWidth ? { minWidth: `${dropdownWidth}px` } : undefined}
    />
  );
};

export default connect()(CustomSelect);