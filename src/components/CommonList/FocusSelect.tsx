import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from "umi";

const { Option } = Select;

// 组件接收的属性定义
export interface SimplePaginationSelectProps {
  // 数据获取配置（必传）
  dispatch: any; // 用于触发数据请求的Umi dispatch方法（核心数据操作入口）
  fetchType: string; // 数据请求类型（如 'fetch/list'，对应后端API路径）
  payload?: Record<string, any>; // 请求附加参数（如分页参数、过滤条件）
  // 字段映射配置（决定数据如何展示）
  fieldNames?: { label: string; value: string }; // label=显示文本字段, value=唯一值字段（默认{label:'label', value:'value'}）
  // 下拉框基础配置
  placeholder?: string; // 输入框提示文字（默认'请输入内容，可实时查询'）
  allowClear?: boolean; // 是否显示清除按钮（默认true）
  // 值管理（与表单联动）
  value?: any; // 当前选中的值（优先级高于表单值）
  onChange?: (value: any, option: any) => void; // 值变化回调（外部处理逻辑）
  form?: any; // 父级表单实例（用于联动表单）
  fieldName?: string; // 表单字段名（如 'product_id'）
  // 其他原生Select属性（如disabled）
  [key: string]: any;
}

/**
 * 分页下拉选择框组件
 * 该组件用于少量字典表的数据查询 下拉框如：项目基本信息《基本信息《合同状态和 三新分类上
 */
const SimplePaginationSelect: React.FC<SimplePaginationSelectProps> = ({
  dispatch,
  fetchType,
  payload = {},
  fieldNames = { label: 'label', value: 'value' },
  placeholder = '请选择',
  allowClear = true,
  size = 'middle',
  value,
  onChange,
  form,
  fieldName,
  ...restProps
}) => {
  // ========== 状态管理 ==========
  const [dataSource, setDataSource] = useState<any[]>([]); // 当前下拉选项数据列表（数组）
  const [isLoading, setIsLoading] = useState(false);        // 是否正在加载数据（控制加载状态）

  /**
 * 获取显示值
 * 该函数用于获取组件的显示值，遵循以下优先级顺序：
 * 1. 使用直接传入的value值
 * 2. 使用表单中对应字段的值
 * 3. 默认返回undefined
 * @returns 显示值，可能为任意类型或undefined
 */
  const getDisplayValue = () => {
    // 优先使用传入的value，其次使用表单值
    if (value !== undefined) {
      return value;
    }
    // 其次使用表单字段值（如果存在表单和字段名）
    if (form && fieldName) {
      return form.getFieldValue(fieldName);
    }
    // 最后无值情况下返回 undefined
    return undefined;
  };
  /**
 * 该函数用于加载数据，并更新组件状态
 */
  const loadData = async () => {
    if (!dispatch) {
      console.warn('请求失败！');
      return;
    }
    setIsLoading(true);

    try {
      // 构建请求参数（合并外部payload）
      const requestPayload = { ...payload };
      // 发起数据请求（使用Umi dispatch调用后端API）
      const res = await dispatch({
        type: fetchType,
        payload: requestPayload
      });

      // 从响应中提取数据列表（兼容不同后端返回结构）
      let list = res.rows || res.result || res.data || [];

      // 更新数据源（替换为新数据）
      setDataSource(list);
    } catch (err) {
      console.error('数据加载失败:', err);
      setDataSource([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 首次加载数据
    loadData();
  }, []); // 组件挂载时执行一次

  /**
 * 处理变化事件的回调函数
 * @param val - 选中的值
 * @param option - 选项参数包含下拉框上下文信息 {value:"",label:""}
 */
  const handleChange = (val: any, option: any) => {
    // 1. 通知外部组件值已变化
    if (onChange) onChange(val, option);

    // 2. 同步到表单（如果存在表单关联）
    if (form && fieldName) {
      form.setFieldsValue({ [fieldName]: val });
    }
  };

  /** 清空处理函数 */
  const handleClear = () => {
    if (onChange) onChange(undefined, undefined);
    if (form && fieldName) {
      form.setFieldsValue({ [fieldName]: undefined });
    }
  };

  return (
    <Select
      // 传递所有原生Select属性（如disabled）
      {...restProps}
      placeholder={placeholder}
      allowClear={allowClear}
      filterOption={false} // 禁用默认过滤（使用自定义搜索逻辑）
      loading={isLoading}  // 显示加载状态
      size={size}
      value={getDisplayValue()} // 当前选中值
      onChange={handleChange}
      onClear={handleClear}
    >
      {/* 渲染下拉选项 */}
      {dataSource.map(item => (
        <Option
          key={item[fieldNames.value]} // 用唯一值作为key（避免重复）
          value={item[fieldNames.value]} // 选项的值
        >
          {item[fieldNames.label] || item.dict_name}
        </Option>
      ))}
    </Select>
  );
};

export default connect()(SimplePaginationSelect);