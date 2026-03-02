import React, { useEffect } from 'react';
import { Form, Row, Col, Button, Divider, Input, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import CustomSelect from '@/components/CommonList/FocusSelect';
import { connect } from "umi";
import FocusPaginationSelect from '@/components/CommonList/FocusSelect';

// 定义基础表单项类型
interface BaseFormField {
  name: string;
  label: string;
  span: number;
  placeholder?: string;
  rules?: any[];
}

// 定义不同类型的表单项
interface InputFormField extends BaseFormField {
  type: 'input';
}

interface SelectFormField extends BaseFormField {
  type: 'select';
  // 定义 options 类型（支持数组或函数）
  options?: {
    label: string;
    value: string;
  }[] | (
    // 函数参数类型（含当前行数据获取能力）
    (params: {
      getFieldValue: (fieldName: string) => any;
      rowIndex: number; // 当前行索引（0,1,2...）
      rowData: Record<string, any>; // 当前行数据
    }) => { label: string; value: string }[]
  );
  clearFields?: string[];
}

interface DateFormField extends BaseFormField {
  type: 'date';
}
// 远程搜索分页下拉（FocusPaginationSelect）字段
interface FocusSelectFormField extends BaseFormField {
  type: 'focus-select';
  /** 传递给 FocusPaginationSelect 的完整配置 */
  focusSelectProps: {
    /** 请求接口的 type（umi dispatch 使用） */
    fetchType: string; // 必需属性
    /** 额外请求参数 */
    payload?: any;
    /** 自定义 label/value 字段名 */
    fieldNames?: { label: string; value: string };
    /** 每页条数 */
    pageSize?: number;
    /** 防抖时间（毫秒） */
    debounceTimeout?: number;
    /** 缓存时间（毫秒） */
    cacheTimeout?: number;
    /** 自定义选项渲染 */
    renderOption?: (item: any) => React.ReactNode;
    /** 搜索关键词字段名（默认 search） */
    searchKey?: string;
  };
}

// 联合类型
type FormField = InputFormField | SelectFormField | DateFormField | FocusSelectFormField;

interface DynamicFormListProps {
  /** Form.List 的字段名（如 'milestones', 'contacts'） */
  name: string;
  /** 区块标题（如 “里程碑计划”、“联系人”） */
  title: string;
  /** 当前区块所有列的配置数组 */
  fieldsList: FormField[];
  /** 新增时的初始值（默认 [{}]） */
  initialValue?: any[];
  /** Antd Form 实例（由父组件 Form.useForm() 提供） */
  form: any;
  /** 当前表单数据（可选，用于联动） */
  dataSource?: any;
  /** 数据更新回调（可选） */
  updateDataSource?: (data: any) => void;
  /** umi 的 dispatch 函数（用于 FocusPaginationSelect 请求） */
  dispatch: any;
  /** 是否为禁用状态（可选） */
  disabled?: boolean
}

/**
 * 动态增减表单项组件
 * - 支持动态添加/删除行
 *   - 支持四种字段类型：输入框、下拉框、日期选择器、远程分页下拉
 *   - 自动处理 Form.List 的 name 路径嵌套
 *   - 至少保留一行（防止全部删光）
 *   - 完全类型安全（TypeScript）
 */
const DynamicFormList = ({
  name,
  title,
  fieldsList,
  initialValue = [{}],
  form,
  dataSource,
  updateDataSource,
  dispatch,
  disabled
}: DynamicFormListProps) => {

  /**
   * 修复一个常见问题：
   * 当父组件初次渲染时，form.getFieldValue(name) 可能是 undefined
   * Antd Form.List 要求必须是数组，否则会报错
   * 此 useEffect 确保字段始终是一个数组（即使初始为空）
   */
  useEffect(() => {
    const current = form.getFieldValue(name);
    if (!Array.isArray(current)) {
      form.setFieldsValue({ [name]: [] });
    }
  }, [name, form]);
  return (
    <Form.List name={name} initialValue={initialValue}>
      {(fields, { add, remove }) => (
        <div>
          <Divider orientation="left">
            <Button
              type="dashed"
              disabled={disabled}
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              添加{title}
            </Button>
          </Divider>
          {/* 遍历每一行动态表单行 */}
          {fields.map((field, index) => (
            <Row key={field.key} gutter={16} style={{ alignItems: 'center', marginBottom: 8 }}>
              {fieldsList.map(formField => {
                // 正确生成 name 路径数组
                const itemNamePath = [field.name, formField.name];
                return (
                  <Col span={formField.span} key={formField.name}>
                    {/**
                     * 动态渲染表单项组件
                     *
                     * 根据 formField 的配置动态生成不同类型的表单控件，包括下拉选择、远程分页下拉、日期选择和普通输入框。
                     * 支持根据字段类型自动处理选项数据源、禁用状态、占位符及联动清空逻辑。
                     *
                     * @param field 表单项字段配置，通常来自 Form.List 的字段迭代器
                     * @param formField 当前表单项的详细配置对象，包含 label、type、rules、options 等属性
                     * @param itemNamePath 表单项在表单中的路径名称，用于标识该字段
                     * @param disabled 是否禁用当前表单项
                     * @param name 表单列表的主键名，用于获取或设置嵌套字段值
                     * @param form 表单实例，用于操作表单数据如 getFieldValue 和 setFieldsValue
                     * @param dispatch 用于触发远程分页下拉组件的数据请求
                */}
                    <Form.Item
                      {...field}
                      label={formField.label}
                      name={itemNamePath}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      rules={formField.rules}
                    >
                      {
                        // 渲染不同类型表单控件
                        formField.type === 'select' ? (
                          <Select
                            showSearch
                            disabled={disabled}
                            optionFilterProp="label"
                            placeholder={formField.placeholder || `请选择${formField.label}`}
                            options={
                              typeof formField.options === 'function'
                                ? formField.options({
                                  getFieldValue: (fieldName: string) =>
                                    form.getFieldValue([name, field.name, fieldName]),
                                  rowIndex: field.name,
                                  rowData: form.getFieldValue([name, field.name]) || {},
                                })
                                : Array.isArray(formField.options)
                                  ? formField.options
                                  : []
                            }
                            // 选择后自动清空指定的后续字段
                            onChange={() => {
                              if (formField.clearFields && Array.isArray(formField.clearFields)) {
                                const update: any = {};
                                formField.clearFields.forEach(field => {
                                  update[field] = undefined;
                                });
                                form.setFieldsValue({
                                  [name]: {
                                    [field.name]: update,
                                  },
                                });
                              }
                            }}
                          />
                        ) : formField.type === 'focus-select' ? (
                          // 远程分页搜索下拉（支持分页）
                          <CustomSelect
                            disabled={disabled}
                            placeholder={formField.placeholder || `请选择${formField.label}`}
                            dispatch={dispatch}
                            fetchType={formField.focusSelectProps.fetchType}
                            payload={formField.focusSelectProps.payload}
                            fieldNames={formField.focusSelectProps.fieldNames || { label: 'dict_name', value: 'id' }}
                            // 直接通过 value 和 onChange 控制，不再传递 form 和 fieldName
                            value={form.getFieldValue([name, field.name, formField.name])}
                            onChange={(value, option) => {
                              // 手动更新表单值
                              const currentRow = form.getFieldValue([name, field.name]) || {};
                              const newRow = {
                                ...currentRow,
                                [formField.name]: value
                              };
                              
                              // 更新整个表单列表
                              const listValues = form.getFieldValue(name) || [];
                              listValues[field.name] = newRow;
                              form.setFieldsValue({ [name]: listValues });
                              
                              // 如果有 updateDataSource 回调，也更新数据源
                              if (updateDataSource) {
                                const newData = [...(dataSource || [])];
                                newData[field.name] = {
                                  ...newData[field.name],
                                  [formField.name]: value
                                };
                                updateDataSource(newData);
                              }
                            }}
                            allowClear={true}
                          />  
                        ) : formField.type === 'date' ? (
                          <DatePicker
                            disabled={disabled}
                            placeholder={formField.placeholder || `请选择${formField.label}`}
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <Input disabled={disabled} placeholder={formField.placeholder || `请输入${formField.label}`} />
                        )
                      }
                    </Form.Item>
                  </Col>
                )

              })}
              {/* 删除按钮列 */}
              <Col span={4}>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)} // 删除当前行
                    style={{
                      fontSize: '16px',
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      marginBottom: '16px'
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </Form.List>
  );
};

export default connect()(DynamicFormList);