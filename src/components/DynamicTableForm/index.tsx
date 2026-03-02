import React, {useImperativeHandle, useRef, useEffect, useMemo} from "react";
import {Form, Input, InputNumber, Select, Radio} from "antd";
import { buildDynamicTableInitialValues, BuildInitialValuesConfig } from '@/utils/formDataTransform';

type FieldType = "input" | "number" | "textarea" | "select" | "radio" | "custom";

export interface DynamicFormColumn {
  /** 列标题 */
  title: React.ReactNode;
  /** 列宽度 */
  width?: number | string;
  /**
   * 纯展示字段键名（当未配置 formField 时展示该字段值）
   */
  dataIndex?: string;
  /** 自定义展示渲染函数（只读内容） */
  render?: (row: any, rowIndex: number) => React.ReactNode;
  /**
   * 表单项配置（配置后本单元格渲染为表单控件）
   */
  formField?: {
    /**
     * 每行唯一字段名；若不传且存在 dataIndex，则默认使用 `${dataIndex}_${行主键}`
     */
    name?: (row: any, rowIndex: number) => string;
    /** 控件类型（可以是函数，根据行数据动态返回类型） */
    type: FieldType | ((row: any, rowIndex: number) => FieldType);
    /** 是否禁用（可按行动态计算） */
    disabled?: boolean | ((row: any) => boolean);
    /** 下拉等控件的可选项（可按行动态计算） */
    options?: { label: React.ReactNode; value: any }[] | ((row: any) => { label: React.ReactNode; value: any }[]);
    /** 表单校验规则（可以是函数，根据行数据动态返回规则） */
    rules?: any[] | ((row: any, rowIndex: number) => any[]);
    /** 自定义控件渲染（当 type 为 custom 时生效） */
    render?: (args: { row: any; rowIndex: number; disabled: boolean }) => React.ReactNode;
  };
}

/** 分组级字段配置（一个分组只有一个输入框，但值会应用到该分组的所有行） */
export interface GroupFieldConfig {
  /** 字段名（根据分组名生成） */
  name: (groupName: string) => string;
  /** 字段标题（显示在表格中） */
  title: React.ReactNode;
  /** 字段类型 */
  type: FieldType;
  /** 字段宽度 */
  width?: number | string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 下拉等控件的可选项 */
  options?: { label: React.ReactNode; value: any }[];
  /** 表单校验规则 */
  rules?: any[];
  /** 自定义控件渲染（当 type 为 custom 时生效） */
  render?: (args: { groupName: string; disabled: boolean }) => React.ReactNode;
  /** 插入位置索引（指定该分组字段应该插入到 columns 的哪个位置，从0开始。如果不指定，则插入到所有列之后） */
  insertIndex?: number;
  /**
   * 自动计算函数（如果提供，则字段值会根据此函数自动计算，且字段会被禁用）
   * @param formValues 当前表单的所有值
   * @param groupRows 该分组的所有行数据
   * @param groupName 分组名
   * @returns 计算后的字段值
   */
  calculate?: (formValues: Record<string, any>, groupRows: any[], groupName: string) => any;
  /**
   * 需要监听的字段名模式（用于自动计算，支持函数返回字段名数组）
   * 例如：['perf_1_score', 'perf_2_score'] 或 (groupRows) => groupRows.map(row => `perf_${row.id}_score`)
   */
  dependencies?: string[] | ((groupRows: any[]) => string[]);
}

/** 数据合并配置（用于自动合并接口返回的明细数据到行数据中，并自动构建 initialValues） */
export interface DataMergeConfig {
  /** 接口返回的明细数据数组（例如 basicItems 或 performanceItems） */
  items: any[];
  /** 明细数据中的ID字段名（用于匹配，如 'basic_id', 'performance_id'） */
  idFieldName: string;
  /** 行数据中的ID字段名（默认 'id'） */
  rowIdFieldName?: string;
  /** 需要合并到行数据的字段映射，如 { assess_score: 'assess_score', remark: 'remark' } */
  mergeFields?: Record<string, string>;
  /** 是否自动构建 initialValues，如果提供配置则自动构建 */
  buildInitialValues?: Omit<BuildInitialValuesConfig, 'items'>;
}

export interface DynamicTableFormProps {
  rows: any[];
  rowKey?: string | ((row: any, rowIndex: number) => string);
  columns: DynamicFormColumn[];
  /** 表格标题（居中显示在表格上方） */
  title?: React.ReactNode;
  /** 行分组生成器（返回分组名） */
  groupBy?: (row: any) => string | undefined;
  /** 将分组名渲染为左侧列（用 rowSpan 合并单元格） */
  showGroupAsLeft?: boolean;
  /** 左侧分组列的表头标题（仅在 showGroupAsLeft=true 生效） */
  groupTitleHeader?: React.ReactNode;
  /** 分组级字段配置（一个分组只有一个输入框，值会应用到该分组的所有行） */
  groupFields?: GroupFieldConfig[];
  /** 表单初始值（如果提供了 dataMerge.buildInitialValues，此值会被自动构建的值覆盖） */
  initialValues?: Record<string, any>;
  /** 数据合并配置（自动合并明细数据到行数据，并自动构建 initialValues） */
  dataMerge?: DataMergeConfig;
  /** 透出 Form 实例的 ref */
  cRef?: any;
  /** 是否整体禁用 */
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onValuesChange?: any;
}

const DynamicTableForm: React.FC<DynamicTableFormProps> = (props) => {
  const {
    rows,
    rowKey = (r: any, i: number) => (r.id ?? i).toString(),
    columns,
    title,
    groupBy,
    showGroupAsLeft = false,
    groupTitleHeader,
    groupFields = [],
    initialValues: externalInitialValues,
    dataMerge,
    cRef,
    disabled = false,
    style,
    className,
    onValuesChange = undefined
  } = props;
  const formRef: any = useRef();

  useImperativeHandle(cRef, () => formRef.current);

  // 自动合并数据并构建 initialValues
  const { mergedRows, computedInitialValues } = useMemo(() => {
    if (!dataMerge) {
      return { mergedRows: rows, computedInitialValues: externalInitialValues };
    }

    const { items, idFieldName, rowIdFieldName = 'id', mergeFields = {}, buildInitialValues } = dataMerge;

    // 合并数据到行数据中
    const merged = rows.map((row: any) => {
      const rowId = String(row[rowIdFieldName] ?? row.id ?? '');
      if (!rowId) return row;

      const item = items.find((it: any) => String(it[idFieldName] ?? it.id ?? '') === rowId);
      if (!item) return row;

      // 合并指定字段
      const mergedData: any = { ...row };
      Object.keys(mergeFields).forEach((sourceField) => {
        const targetField = mergeFields[sourceField] || sourceField;
        if (item[sourceField] !== undefined && item[sourceField] !== null) {
          mergedData[targetField] = item[sourceField];
        }
      });

      return mergedData;
    });

    // 自动构建 initialValues
    let computed = externalInitialValues;
    if (buildInitialValues && items.length > 0) {
      computed = buildDynamicTableInitialValues({
        items,
        ...buildInitialValues,
        rows: buildInitialValues.rows ?? rows, // 如果没有提供 rows，使用原始 rows
      });
    }

    return { mergedRows: merged, computedInitialValues: computed };
  }, [rows, dataMerge, externalInitialValues]);

  // initialValues 变更时（例如异步加载后），主动写入表单
  useEffect(() => {
    if (formRef.current && computedInitialValues && Object.keys(computedInitialValues).length > 0) {
      formRef.current.setFieldsValue(computedInitialValues);
    }
  }, [computedInitialValues]);

  /**
   * 将原始行数据根据分组函数进行分组
   *
   */
  const getGroupedRows = () => {
    if (!groupBy) return [{ key: "__all__", title: undefined, rows: mergedRows }];
    const map = new Map<string, any[]>();
    mergedRows.forEach((r) => {
      const g = groupBy(r) ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    });
    return Array.from(map.entries()).map(([key, value]) => ({ key, title: key, rows: value }));
  };

  /**
   * 计算当前单元格对应的表单字段名
   * 规则：
   * 1) 若列配置了 formField.name（函数），优先调用并返回其结果；
   * 2) 否则在存在 dataIndex 时，以 dataIndex 和行主键拼接成 `${dataIndex}_${rowKeyValue}`；
   * 3) 若均不满足，返回 undefined（代表该单元格不是表单项或无法自动命名）。
   * @param col 列配置对象
   * @param row 当前行数据对象
   * @param ri  当前行索引
   */
  const getFieldName = (col: DynamicFormColumn, row: any, ri: number): string | undefined => {
    if (!col.formField) return undefined;
    if (col.formField.name) return col.formField.name(row, ri);
    if (col.dataIndex) {
      const keyVal = typeof rowKey === "function" ? rowKey(row, ri) : row[rowKey];
      return `${col.dataIndex}_${keyVal}`;
    }
    return undefined;
  };

  /**
   * 渲染单元格：根据是否配置了 formField 决定是表单控件还是纯展示
   * @param col 列配置对象，决定该单元格的标题、展示字段以及表单控件类型等
   * @param row 当前行数据对象，用于读取展示值或按行生成控件的 name、options、disabled 等
   * @param ri  当前行在当前分组中的索引，用于生成唯一字段名或做条件判断
   * @returns   返回 React 节点：若配置了表单项则返回对应控件，否则返回纯文本展示
   */
  const renderCell = (col: DynamicFormColumn, row: any, ri: number) => {
    if (!col.formField) {
      if (col.render) {
        // 如果配置了 dataIndex，先获取对应的值，然后传给 render
        // 这样 render 可以接收单个值，也可以接收 (row, ri) 两个参数
        if (col.dataIndex) {
          const value = row[col.dataIndex];
          // 检查 render 函数的参数数量
          if (col.render.length === 1) {
            return (col.render as any)(value);
          } else {
            return col.render(row, ri);
          }
        } else {
          return col.render(row, ri);
        }
      }
      if (col.dataIndex) return row[col.dataIndex] ?? '-';
      return null;
    }

    const fieldName = getFieldName(col, row, ri)!;
    const computedDisabled = typeof col.formField.disabled === "function" ? col.formField.disabled(row) : (col.formField.disabled ?? false) || disabled;
    const options = typeof col.formField.options === "function" ? col.formField.options(row) : (col.formField.options ?? []);

    // 获取实际的控件类型（支持函数动态返回）
    const fieldType = typeof col.formField.type === "function"
      ? col.formField.type(row, ri)
      : col.formField.type;

    // 获取实际的校验规则（支持函数动态返回）
    const fieldRules = typeof col.formField.rules === "function"
      ? col.formField.rules(row, ri)
      : (col.formField.rules ?? []);

    /** 根据表单项类型返回对应控件 */
    const control = (() => {
      switch (fieldType) {
        case "input":
          return <Input disabled={computedDisabled} />;
        case "number":
          return <InputNumber disabled={computedDisabled} style={{ width: "100%" }} />;
        case "textarea":
          return <Input.TextArea disabled={computedDisabled} autoSize />;
        case "select":
          return (
            <Select disabled={computedDisabled} allowClear>
              {options.map((op: any) => (
                <Select.Option key={op.value} value={op.value}>
                  {op.label}
                </Select.Option>
              ))}
            </Select>
          );
        case "radio":
          return (
            <Radio.Group disabled={computedDisabled} style={{ display: "flex", justifyContent: "center" }}>
              {options.map((op: any) => (
                <Radio key={op.value} value={op.value}>
                  {op.label}
                </Radio>
              ))}
            </Radio.Group>
          );
        case "custom":
          return col.formField!.render?.({ row, rowIndex: ri, disabled: computedDisabled }) ?? null;
        default:
          return <Input disabled={computedDisabled} />;
      }
    })();

    return (
      <Form.Item
        name={fieldName}
        style={{ marginBottom: 0, textAlign: "center" }}
        rules={fieldRules}
        hasFeedback
      >
        {control}
      </Form.Item>
    );
  };

  /**
   * 渲染分组级字段（一个分组只有一个输入框，值会应用到该分组的所有行）
   * @param groupField 分组字段配置
   * @param groupName 分组名
   * @param groupRows 该分组的所有行数据
   */
  const renderGroupField = (groupField: GroupFieldConfig, groupName: string, groupRows: any[]) => {
    const fieldName = groupField.name(groupName);
    const hasCalculate = !!groupField.calculate;
    const computedDisabled = hasCalculate || (groupField.disabled ?? false) || disabled;
    const options = groupField.options || [];

    // 获取需要监听的字段列表
    const dependencyFields = groupField.dependencies
      ? (typeof groupField.dependencies === 'function'
          ? groupField.dependencies(groupRows)
          : groupField.dependencies)
      : [];

    /** 根据字段类型返回对应控件 */
    const control = (() => {
      switch (groupField.type) {
        case "input":
          return <Input disabled={computedDisabled} />;
        case "number":
          return <InputNumber disabled={computedDisabled} style={{ width: "100%" }} />;
        case "textarea":
          return <Input.TextArea disabled={computedDisabled} autoSize />;
        case "select":
          return (
            <Select disabled={computedDisabled} allowClear>
              {options.map((op: any) => (
                <Select.Option key={op.value} value={op.value}>
                  {op.label}
                </Select.Option>
              ))}
            </Select>
          );
        case "radio":
          return (
            <Radio.Group disabled={computedDisabled} style={{ display: "flex", justifyContent: "center" }}>
              {options.map((op: any) => (
                <Radio key={op.value} value={op.value}>
                  {op.label}
                </Radio>
              ))}
            </Radio.Group>
          );
        case "custom":
          return groupField.render?.({ groupName, disabled: computedDisabled }) ?? null;
        default:
          return <Input disabled={computedDisabled} />;
      }
    })();

    // 如果有计算函数，使用 Form.Item 的 dependencies 和 shouldUpdate 来监听变化并自动更新
    if (hasCalculate) {
      // 创建一个自定义组件来处理自动计算
      const CalculatedFieldWrapper: React.FC = () => {
        const [lastCalculatedValue, setLastCalculatedValue] = React.useState<any>(null);

        // 使用 useEffect 在组件挂载后设置初始值
        useEffect(() => {
          if (formRef.current) {
            const formValues = formRef.current.getFieldsValue();
            const calculatedValue = groupField.calculate!(formValues, groupRows, groupName);
            const currentValue = formValues[fieldName];

            // 如果当前值为空或未定义，设置初始值
            if (currentValue === undefined || currentValue === null) {
              formRef.current.setFieldsValue({
                [fieldName]: calculatedValue
              });
            }
            setLastCalculatedValue(calculatedValue);
          }
        }, []); // 只在组件挂载时执行一次

        return (
          <>
            {/* 监听依赖字段变化，自动更新计算值 */}
            <Form.Item
              noStyle
              dependencies={dependencyFields.length > 0 ? dependencyFields : undefined}
              shouldUpdate={(prevValues, currentValues) => {
                // 检查依赖字段是否有变化
                if (dependencyFields.length > 0) {
                  return dependencyFields.some(field => {
                    const prevVal = prevValues[field];
                    const currVal = currentValues[field];
                    return prevVal !== currVal;
                  });
                }
                // 如果没有指定依赖字段，监听所有字段变化（性能较差，但更通用）
                return true;
              }}
            >
              {({ getFieldsValue, setFieldsValue }) => {
                const formValues = getFieldsValue();
                const calculatedValue = groupField.calculate!(formValues, groupRows, groupName);

                // 如果计算值变化了，更新字段值
                if (calculatedValue !== lastCalculatedValue) {
                  setLastCalculatedValue(calculatedValue);
                  // 使用 setTimeout 避免在渲染过程中更新状态
                  setTimeout(() => {
                    setFieldsValue({
                      [fieldName]: calculatedValue
                    });
                  }, 0);
                }

                return null;
              }}
            </Form.Item>

            {/* 显示计算后的值 */}
            <Form.Item
              name={fieldName}
              style={{ marginBottom: 0, textAlign: "center" }}
              rules={groupField.rules}
              hasFeedback
            >
              {control}
            </Form.Item>
          </>
        );
      };

      return <CalculatedFieldWrapper />;
    }

    // 普通情况，没有计算函数
    return (
      <Form.Item
        name={fieldName}
        style={{ marginBottom: 0, textAlign: "center" }}
        rules={groupField.rules}
        hasFeedback
      >
        {control}
      </Form.Item>
    );
  };

  /**
   * 构建表头列数组（包含普通列和分组字段列，按插入位置排序）
   */
  const buildHeaderColumns = () => {
    const result: Array<{ type: 'column' | 'groupField', index: number, data: any }> = [];

    // 添加普通列
    columns.forEach((c, idx) => {
      result.push({ type: 'column', index: idx, data: c });
    });

    // 添加分组字段列（如果有指定插入位置）
    if (groupBy && groupFields.length > 0) {
      groupFields.forEach((gf, idx) => {
        const insertIndex = gf.insertIndex !== undefined ? gf.insertIndex : columns.length;
        result.push({ type: 'groupField', index: insertIndex + idx * 0.001, data: gf });
      });
    }

    // 按索引排序
    result.sort((a, b) => a.index - b.index);

    return result;
  };

  /**
   * 构建表体单元格数组（包含普通列和分组字段列，按插入位置排序）
   */
  const buildBodyCells = (row: any, ri: number, groupRows: any[]) => {
    const result: Array<{ type: 'column' | 'groupField', index: number, data: any, isFirstRow: boolean }> = [];

    // 添加普通列
    columns.forEach((col, ci) => {
      result.push({ type: 'column', index: ci, data: col, isFirstRow: false });
    });

    // 添加分组字段列（如果有指定插入位置）
    if (groupBy && groupFields.length > 0) {
      groupFields.forEach((gf, idx) => {
        const insertIndex = gf.insertIndex !== undefined ? gf.insertIndex : columns.length;
        result.push({ type: 'groupField', index: insertIndex + idx * 0.001, data: gf, isFirstRow: ri === 0 });
      });
    }

    // 按索引排序
    result.sort((a, b) => a.index - b.index);

    return result;
  };

  return (
    <Form ref={formRef} onValuesChange={onValuesChange} initialValues={computedInitialValues} component={false}>
      <div style={style} className={className}>
        {title && (
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 600, marginBottom: 16, padding: "12px 0" }}>
            {title}
          </div>
        )}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr>
            {groupBy && showGroupAsLeft && (
              <th style={{ textAlign: "center", padding: 8, border: "1px solid #d9d9d9", background: "#fafafa" }}>{groupTitleHeader}</th>
            )}
            {buildHeaderColumns().map((item, idx) => {
              if (item.type === 'column') {
                const c = item.data;
                return (
                  <th key={`col-${idx}`} style={{ textAlign: "center", padding: 8, width: c.width, border: "1px solid #d9d9d9", background: "#fafafa" }}>{c.title}</th>
                );
              } else {
                const gf = item.data;
                return (
                  <th key={`group-field-${idx}`} style={{ textAlign: "center", padding: 8, width: gf.width, border: "1px solid #d9d9d9", background: "#fafafa" }}>{gf.title}</th>
                );
              }
            })}
          </tr>
          </thead>
          <tbody>
          {getGroupedRows().map((g) => (
            <React.Fragment key={g.key}>
              {g.title && !showGroupAsLeft && (
                <tr>
                  <td colSpan={columns.length + (groupFields.length > 0 ? groupFields.length : 0)} style={{ fontWeight: 600, background: "#fafafa", padding: 6, border: "1px solid #d9d9d9" }}>
                    {g.title}
                  </td>
                </tr>
              )}
              {g.rows.map((row, ri) => (
                <tr key={typeof rowKey === "function" ? rowKey(row, ri) : row[rowKey] ?? ri}>
                  {groupBy && showGroupAsLeft && ri === 0 && (
                    <td style={{ padding: 8, border: "1px solid #d9d9d9", fontWeight: 600, textAlign: "center" }} rowSpan={g.rows.length}>
                      {g.title}
                    </td>
                  )}
                  {buildBodyCells(row, ri, g.rows).map((item, idx) => {
                    if (item.type === 'column') {
                      const col = item.data;
                      return (
                        <td key={`col-${idx}`} style={{ padding: 8, border: "1px solid #d9d9d9", textAlign: "center" }}>
                          {renderCell(col, row, ri)}
                        </td>
                      );
                    } else {
                      const gf = item.data;
                      if (item.isFirstRow) {
                        return (
                          <td key={`group-field-${idx}`} style={{ padding: 8, border: "1px solid #d9d9d9", textAlign: "center" }} rowSpan={g.rows.length}>
                            {renderGroupField(gf, g.title || "", g.rows)}
                          </td>
                        );
                      }
                      return null;
                    }
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    </Form>
  );
};

export default DynamicTableForm;


