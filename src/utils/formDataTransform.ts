/**
 * 表单数据转换配置
 */
export interface FormDataTransformConfig {
  /** 字段名前缀，用于筛选相关字段（如 'basic_', 'perf_'） */
  prefix: string;
  /** ID字段名（如 'basic_id', 'id'） */
  idFieldName: string;
  /** 字段映射规则：key为表单字段后缀，value为目标字段名 */
  fieldMapping: Record<string, string>;
  /** 自定义行数据构建函数（可选，用于更复杂的转换逻辑） */
  rowBuilder?: (id: string, fieldValues: Record<string, any>) => any;
}

/**
 * 将扁平化的表单数据对象转换为数组格式
 *
 * 示例：
 * 输入：{ "basic_1_satisfied": 1, "basic_2_satisfied": 0 }
 * 配置：{ prefix: "basic_", idFieldName: "basic_id", fieldMapping: { "satisfied": "is_satisfy" } }
 * 输出：[{ "basic_id": "1", "is_satisfy": "1" }, { "basic_id": "2", "is_satisfy": "0" }]
 *
 * @param formData 表单数据对象（扁平化格式）
 * @param config 转换配置
 * @returns 转换后的数组
 */
export const transformFormDataToArray = (
  formData: Record<string, any>,
  config: FormDataTransformConfig
): any[] => {
  const { prefix, idFieldName, fieldMapping, rowBuilder } = config;

  // 1. 筛选出以指定前缀开头的字段
  const relevantFields = Object.keys(formData).filter(key => key.startsWith(prefix));

  // 2. 按ID分组收集字段值
  const idMap = new Map<string, Record<string, any>>();

  relevantFields.forEach(fieldKey => {
    // 提取ID：移除前缀，然后提取第一个下划线前的部分作为ID
    // 例如：basic_1_satisfied -> 1
    const withoutPrefix = fieldKey.substring(prefix.length);
    const idMatch = withoutPrefix.match(/^(\d+)/);

    if (!idMatch) {
      console.warn(`无法从字段名 ${fieldKey} 中提取ID，跳过该字段`);
      return;
    }

    const id = idMatch[1];
    const suffix = withoutPrefix.substring(idMatch[0].length + 1); // 去掉ID和下划线后的部分

    // 初始化该ID的记录
    if (!idMap.has(id)) {
      idMap.set(id, {});
    }

    const record = idMap.get(id)!;

    // 根据字段映射规则转换字段名
    const targetFieldName = fieldMapping[suffix] || suffix;
    record[targetFieldName] = formData[fieldKey];
  });

  // 3. 转换为数组格式
  const result = Array.from(idMap.entries()).map(([id, fieldValues]) => {
    const row: any = {
      [idFieldName]: id,
      ...fieldValues,
    };

    // 如果提供了自定义构建函数，使用它
    if (rowBuilder) {
      return rowBuilder(id, fieldValues);
    }

    return row;
  });

  // 4. 按ID排序（确保顺序一致）
  return result.sort((a, b) => {
    const aId = parseInt(a[idFieldName] || '0', 10);
    const bId = parseInt(b[idFieldName] || '0', 10);
    return aId - bId;
  });
};

/**
 * 批量转换多组表单数据
 *
 * @param formData 表单数据对象
 * @param configs 多个转换配置数组
 * @returns 转换后的数据对象，key为配置的key（如果提供），否则使用prefix
 */
export const transformMultipleFormData = (
  formData: Record<string, any>,
  configs: Array<FormDataTransformConfig & { key?: string }>
): Record<string, any[]> => {
  const result: Record<string, any[]> = {};

  configs.forEach(config => {
    const key = config.key || config.prefix.replace(/_$/, '');
    result[key] = transformFormDataToArray(formData, config);
  });

  return result;
};

/**
 * 分组字段配置
 */
export interface GroupFieldMergeConfig {
  /** 分组字段名生成函数 */
  fieldName: (groupName: string) => string;
  /** 目标字段名（合并到每行数据中的字段名） */
  targetFieldName: string;
  /** 值转换函数（可选，用于格式化值，如转换为字符串） */
  valueTransform?: (value: any) => any;
}

/**
 * 带分组字段合并的表单数据转换配置
 */
export interface FormDataTransformWithGroupFieldsConfig extends Omit<FormDataTransformConfig, 'rowBuilder'> {
  /** 原始行数据数组（用于获取分组信息） */
  rows: any[];
  /** 分组函数（从行数据中提取分组名） */
  groupBy: (row: any) => string | undefined;
  /** 分组字段配置数组 */
  groupFields: GroupFieldMergeConfig[];
  /**
   * 需要从原始 items 数据中保留的字段配置
   * 用于在编辑场景中，需要保留原始数据中的某些字段（如 record_id）到转换后的数据中
   *
   * @example
   * preserveFieldsFromItems: {
   *   items: examinationItems,  // 原始数据数组
   *   idFieldName: 'examination_config_id',  // 用于匹配的字段名
   *   fields: ['record_id'],  // 需要保留的字段名数组
   *   targetFieldMapping: { record_id: 'id' }  // 可选：字段名映射，如将 record_id 映射为 id
   * }
   */
  preserveFieldsFromItems?: {
    /** 原始数据数组（通常是从接口获取的详情数据） */
    items: any[];
    /** 用于匹配的字段名（在 items 和转换后的数据中都存在） */
    idFieldName: string;
    /** 需要保留的字段名数组 */
    fields: string[];
    /** 可选：字段名映射，将原始字段名映射为目标字段名 */
    targetFieldMapping?: Record<string, string>;
  };
}

/**
 * 将分组字段值合并到每行数据中
 *
 * 示例：
 * 输入：
 * - formData: { "group_组织实施_subtotal": 100 }
 * - rows: [{ id: 1, indicator_name: "组织实施" }, { id: 2, indicator_name: "组织实施" }]
 * - groupBy: (row) => row.indicator_name
 * - configs: [{ fieldName: (g) => `group_${g}_subtotal`, targetFieldName: "subtotal" }]
 * 输出：
 * - [{ id: 1, indicator_name: "组织实施", subtotal: 100 }, { id: 2, indicator_name: "组织实施", subtotal: 100 }]
 *
 * @param formData 表单数据对象（包含分组字段值）
 * @param rows 原始行数据数组
 * @param groupBy 分组函数
 * @param configs 分组字段合并配置数组
 * @returns 合并后的行数据数组
 */
export const mergeGroupFieldsToRows = (
  formData: Record<string, any>,
  rows: any[],
  groupBy: (row: any) => string | undefined,
  configs: GroupFieldMergeConfig[]
): any[] => {
  // 按分组名收集分组字段值
  const groupValuesMap = new Map<string, Record<string, any>>();

  // 遍历所有分组字段配置，收集每个分组的字段值
  configs.forEach(config => {
    // 遍历所有行，找到每个分组
    rows.forEach(row => {
      const groupName = groupBy(row) ?? "";
      if (!groupName) return;

      // 如果该分组还没有记录，初始化
      if (!groupValuesMap.has(groupName)) {
        groupValuesMap.set(groupName, {});
      }

      // 获取分组字段值
      const fieldName = config.fieldName(groupName);
      const fieldValue = formData[fieldName];

      // 如果字段值存在，记录到该分组的值中
      if (fieldValue !== undefined && fieldValue !== null) {
        groupValuesMap.get(groupName)![config.targetFieldName] = fieldValue;
      }
    });
  });

  // 将分组字段值合并到每行数据中
  return rows.map(row => {
    const groupName = groupBy(row) ?? "";
    const groupValues = groupValuesMap.get(groupName) || {};
    return {
      ...row,
      ...groupValues, // 合并分组字段值
    };
  });
};

/**
 * 将表单数据转换为数组，并自动合并分组字段值
 *
 * 这是一个便捷函数，封装了 transformFormDataToArray 和分组字段合并的逻辑，
 * 无需手动编写 rowBuilder 函数。
 *
 * 示例：
 * ```typescript
 * const result = transformFormDataWithGroupFields(formData, {
 *   prefix: 'perf_',
 *   idFieldName: 'performance_id',
 *   fieldMapping: {
 *     'score': 'assess_score',
 *     'reason': 'remark',
 *   },
 *   rows: performanceData,
 *   groupBy: (row) => row.indicator_name,
 *   groupFields: [
 *     {
 *       fieldName: (groupName) => `group_${groupName}_subtotal`,
 *       targetFieldName: 'subtotal',
 *       valueTransform: (val) => val !== undefined && val !== null ? String(val) : undefined,
 *     },
 *   ],
 * });
 * ```
 *
 * @param formData 表单数据对象
 * @param config 转换配置（包含分组字段配置）
 * @returns 转换后的数组，每行数据都包含分组字段值
 */
export const transformFormDataWithGroupFields = (
  formData: Record<string, any>,
  config: FormDataTransformWithGroupFieldsConfig
): any[] => {
  const { rows, groupBy, groupFields, preserveFieldsFromItems, ...transformConfig } = config;

  // 先转换表单数据为数组
  const transformedData = transformFormDataToArray(formData, transformConfig);

  // 创建 ID 到行数据的映射，用于快速查找
  const idToRowMap = new Map<string, any>();
  rows.forEach(row => {
    const id = String(row.RowNumber ?? row[transformConfig.idFieldName] ?? '');
    if (id) {
      idToRowMap.set(id, row);
    }
  });

  // 创建 ID 到原始 items 数据的映射（用于保留字段）
  const idToItemMap = new Map<string, any>();
  if (preserveFieldsFromItems) {
    const { items, idFieldName } = preserveFieldsFromItems;
    items.forEach((item: any) => {
      const itemId = String(item[idFieldName] ?? item.RowNumber ?? '');
      if (itemId) {
        idToItemMap.set(itemId, item);
      }
    });
  }

  // 按分组名收集分组字段值
  const groupValuesMap = new Map<string, Record<string, any>>();

  groupFields.forEach(groupField => {
    // 遍历所有行，找到每个分组
    rows.forEach(row => {
      const groupName = groupBy(row) ?? "";
      if (!groupName) return;

      // 如果该分组还没有记录，初始化
      if (!groupValuesMap.has(groupName)) {
        groupValuesMap.set(groupName, {});
      }

      // 获取分组字段值
      const fieldName = groupField.fieldName(groupName);
      let fieldValue = formData[fieldName];

      // 应用值转换函数（如果提供）
      if (fieldValue !== undefined && fieldValue !== null && groupField.valueTransform) {
        fieldValue = groupField.valueTransform(fieldValue);
      }

      // 如果字段值存在，记录到该分组的值中
      if (fieldValue !== undefined && fieldValue !== null) {
        groupValuesMap.get(groupName)![groupField.targetFieldName] = fieldValue;
      }
    });
  });

  // 将分组字段值合并到每行数据中
  return transformedData.map(item => {
    const id = String(item[transformConfig.idFieldName] ?? '');
    const originalRow = idToRowMap.get(id);

    if (!originalRow) {
      return item;
    }

    const groupName = groupBy(originalRow) ?? "";
    const groupValues = groupValuesMap.get(groupName) || {};

    // 合并分组字段值
    let result = {
      ...item,
      ...groupValues,
    };

    // 如果需要保留原始 items 中的字段
    if (preserveFieldsFromItems && idToItemMap.has(id)) {
      const originalItem = idToItemMap.get(id)!;
      const { fields, targetFieldMapping = {} } = preserveFieldsFromItems;

      fields.forEach(fieldName => {
        const value = originalItem[fieldName];
        if (value !== undefined && value !== null) {
          // 如果提供了字段映射，使用映射后的字段名；否则使用原字段名
          const targetFieldName = targetFieldMapping[fieldName] || fieldName;
          result[targetFieldName] = value;
        }
      });
    }

    return result;
  });
};

/**
 * 将接口返回的明细数组转换为 DynamicTableForm 可用的 initialValues
 * 支持：
 * - 行字段：根据 `${prefix}${id}_${suffix}` 规则生成键名
 * - 分组字段：按组名生成 `group_${groupName}_xxx` 之类的键名
 */
export interface BuildInitialValuesConfig {
  /** 接口返回的明细数组（例如 basicItems 或 performanceItems） */
  items: any[];
  /** 行字段配置 */
  row: {
    /** 前缀，如 'basic_' 或 'perf_' */
    prefix: string;
    /** ID 字段名，如 'basic_id' 或 'performance_id' */
    idFieldName: string;
    /** 将接口里的字段名映射为 suffix，例如 { is_satisfy: 'satisfied' } */
    sourceToSuffix: Record<string, string>;
    /** 针对行字段的值转换器（可选）：(suffix, value) => value */
    valueTransform?: (suffix: string, value: any) => any;
  };
  /** 原始行数据，用于解析分组名（可选） */
  rows?: any[];
  /** 分组函数（可选） */
  groupBy?: (row: any) => string | undefined;
  /** 分组字段配置（可选） */
  groupFields?: Array<{
    /** 接口中对应的字段名（如 'subtotal'、'assess_person'） */
    sourceFieldName: string;
    /** 生成最终 initialValues 键名的函数，例如 groupName => `group_${groupName}_subtotal` */
    fieldName: (groupName: string) => string;
    /** 值转换器（可选） */
    valueTransform?: (value: any) => any;
  }>;
}

export const buildDynamicTableInitialValues = (config: BuildInitialValuesConfig): Record<string, any> => {
  const { items, row, rows = [], groupBy, groupFields = [] } = config;
  const initialValues: Record<string, any> = {};

  if (!Array.isArray(items) || items.length === 0) return initialValues;

  // 行字段：items -> `${prefix}${id}_${suffix}`
  items.forEach((it: any) => {
    const id = String(it[row.idFieldName] ?? it.id ?? '');
    if (!id) return;
    Object.keys(row.sourceToSuffix || {}).forEach((sourceName) => {
      const suffix = row.sourceToSuffix[sourceName];
      let val = it[sourceName];
      if (val === undefined || val === null) return;
      if (row.valueTransform) val = row.valueTransform(suffix, val);
      initialValues[`${row.prefix}${id}_${suffix}`] = val;
    });
  });

  // 分组字段：按组名聚合一次
  if (groupFields.length > 0 && groupBy) {
    const idToRowMap = new Map<string, any>();
    rows.forEach((r) => {
      const id = String(r.id ?? r[row.idFieldName] ?? '');
      if (id) idToRowMap.set(id, r);
    });
    const visitedGroup = new Set<string>();

    items.forEach((it: any) => {
      const id = String(it[row.idFieldName] ?? it.id ?? '');
      const relatedRow = id ? idToRowMap.get(id) : undefined;
      const groupName = relatedRow ? (groupBy(relatedRow) ?? '') : (it.groupName ?? it.indicator_name ?? '');
      if (!groupName) return;

      groupFields.forEach((gf) => {
        const gvRaw = it[gf.sourceFieldName];
        if (gvRaw === undefined || gvRaw === null) return;
        const key = gf.fieldName(groupName);
        // 避免重复覆盖，保留第一个出现的组值
        if (initialValues[key] !== undefined) return;
        initialValues[key] = gf.valueTransform ? gf.valueTransform(gvRaw) : gvRaw;
      });
      visitedGroup.add(groupName);
    });
  }

  return initialValues;
};

