import { PROP_KEY } from "@/common/const";

// 问题分类的完整选项
export const allProblemCategories = [
  { value: '0', name: '质量管理类' },
  { value: '1', name: '质量实体类' },
  { value: '2', name: '作业行为类' },
  { value: '3', name: '安全管理类' },
];

/**
 * 根据 problem_type 获取可选的 problem_category 选项
 * @param type problem_type 的值 0:质量 1:HSE
 * @returns problem_category 的选项
 */
export const getProblemCategoryOptions = (type: string | undefined) => {
  // 判断如果类型为空，返回空数组
  if (!type) {
    return [];
  }
  // 判断如果类型为 '0'（质量），返回前两个选项
  if (type === '0') {
    // 质量：前两个选项
    return allProblemCategories.slice(0, 2);
  } else if (type === '1') {
    // 判断如果类型为 '1'（HSE），返回后两个选项
    // HSE：后两个选项
    return allProblemCategories.slice(2, 4);
  }
  return [];
};

/**
 * 根据 problem_category 获取字段的禁用状态
 * @param category problem_category 的值 0:质量管理类 1:质量实体类 2:作业行为类 3:安全管理类
 * @param fieldName 字段名称
 * @returns 是否禁用
 */
export const getFieldDisabled = (category: string | undefined, fieldName: string) => {
  // 判断如果分类为空，默认全部禁用
  if (!category) {
    // 默认全部禁用
    return true;
  }
  switch (category) {
    case '0': // 质量管理类
      // 启用：quality_factor1, quality_factor2
      // 禁用：其他所有
      return !['quality_factor1', 'quality_factor2'].includes(fieldName);

    case '1': // 质量实体类
      // 启用：entity_quality
      // 禁用：其他所有
      return fieldName !== 'entity_quality';

    case '2': // 作业行为类
      // 启用：operation_behavior_ids, hour_num
      // 禁用：其他所有
      return !['operation_behavior_ids', 'hour_num'].includes(fieldName);

    case '3': // 安全管理类
      // 启用：safety_factor1, safety_factor2, safety_radio
      // 禁用：其他所有
      return !['safety_factor1', 'safety_factor2', 'safety_radio'].includes(fieldName);

    default:
      return true;
  }
};

/**
 * 根据 problem_category 获取需要必填的字段列表
 * @param category problem_category 的值 0:质量管理类 1:质量实体类 2:作业行为类 3:安全管理类
 * @returns 需要必填的字段数组
 */
export const getRequiredFields = (category: string | undefined) => {
  // 基础必填字段（始终必填）
  const baseRequiredFields = [
    "problem_code",
    "upload_date",
    "branch_comp_code",
    "wbs_code",
    "project_name",
    "check_date",
    "problem_type",
    "problem_description",
    "problem_image_url",
    "problem_category",
    "responsible_unit",
    "violation_unit",
    "severity_level",
    "system_belong",
    "verify_user_code",
    "push_wbs_code",
    "push_user_code",
  ];
  // 根据 problem_category 添加对应的必填字段
  // 判断如果分类为空，返回基础必填字段
  if (!category) {
    return baseRequiredFields;
  }
  switch (category) {
    case '0': // 质量管理类
      return [...baseRequiredFields, 'quality_factor1', 'quality_factor2'];

    case '1': // 质量实体类
      return [...baseRequiredFields, 'entity_quality'];

    case '2': // 作业行为类
      return [...baseRequiredFields, 'operation_behavior_ids', 'operation_behavior_details','hour_num','question_category'];

    case '3': // 安全管理类
      return [...baseRequiredFields, 'safety_factor1', 'safety_factor2','safety_radio','question_category'];

    default:
      return baseRequiredFields;
  }
};

/**
 * 根据用户级别获取字段的禁用状态
 * @param fieldName 字段名称 'branch_comp_code' | 'wbs_code'
 * @returns 是否禁用
 *
 * 规则：
 * - 公司级别（branchComp）：branch_comp_code 和 wbs_code 全部显示且不禁用
 * - 分公司级别（subComp）：branch_comp_code 禁用
 * - 项目部级别（dep）：wbs_code 禁用
 */
export const getFieldDisabledByUserLevel = (fieldName: 'branch_comp_code' | 'wbs_code'): boolean => {
  const propKey = PROP_KEY;

  // 判断公司级别（branchComp）：全部不禁用
  if (propKey === 'branchComp') {
    return false;
  }

  // 判断分公司级别（subComp）：branch_comp_code 禁用
  if (propKey === 'subComp') {
    return fieldName === 'branch_comp_code';
  }

  // 判断项目部级别（dep）：wbs_code 禁用
  if (propKey === 'dep') {
    return true;
  }

  // 其他情况默认不禁用
  return false;
};

/**
 * 处理问题归类配置数据，提取一级和二级要素选项
 * @param data 问题归类配置原始数据
 * @param type 类型：'质量' | 'HSE'
 * @param factor1Value 一级要素的值（用于过滤二级要素）
 * @returns { factor1Options: 一级要素选项, factor2Options: 二级要素选项 }
 */
export const processProblemClassificationData = (
  data: any[],
  type: '质量' | 'HSE',
  factor1Value?: string
) => {
  // 判断如果数据为空或数组长度为0，返回空选项
  if (!data || data.length === 0) {
    return { factor1Options: [], factor2Options: [] };
  }

  // 过滤出对应类型的数据
  const filteredData = data.filter((item: any) => item.problem_type_str === type);

  // 提取一级要素（去重）
  const factor1Set = new Set<string>();
  filteredData.forEach((item: any) => {
    if (item.problem_name) {
      factor1Set.add(item.problem_name);
    }
  });
  const factor1Options = Array.from(factor1Set).map((name: string) => ({ value: name, name }));

  // 根据一级要素提取二级要素
  let factor2Options: any[] = [];
  // 判断如果有一级要素值，则提取对应的二级要素
  if (factor1Value) {
    const factor2Data = filteredData.filter((item: any) => item.problem_name === factor1Value);
    const factor2Set = new Set<string>();
    factor2Data.forEach((item: any) => {
      // 判断如果存在二级要素名称，则添加到集合中
      if (item.problem_b_name) {
        factor2Set.add(item.problem_b_name);
      }
    });
    factor2Options = Array.from(factor2Set).map((name: string) => ({ value: name, name }));
  }

  return { factor1Options, factor2Options };
};

/**
 * 转换作业行为详情数据为后台需要的格式
 * @param values 表单数据
 * @returns 转换后的数据，包含 items 和 items1
 */
export const transformOperationBehaviorData = (values: any) => {
  const processedValues = { ...values };

  // 判断如果作业行为ID和详情都存在且都是数组，则进行数据转换
  if (processedValues.operation_behavior_ids && Array.isArray(processedValues.operation_behavior_ids) &&
      processedValues.operation_behavior_details && Array.isArray(processedValues.operation_behavior_details)) {

    // 构建 items 数组（每个作业行为一个对象）
    const items: Array<{ id: string; number: number }> = [];

    // 构建 items1 数组（每个处理方式的下级选项一个对象）
    const items1: Array<{ id: string; value1: string; value2: string; radio: string }> = [];

    // 遍历每个作业行为
    processedValues.operation_behavior_ids.forEach((behaviorId: string, index: number) => {
      const detail = processedValues.operation_behavior_details[index];

      // 判断如果详情存在，则处理数据
      if (detail) {
        // 判断如果违反人数存在，添加 items（违反人数），id 使用 behaviorId
        if (detail.count !== undefined && detail.count !== null) {
          items.push({
            id: behaviorId,
            number: detail.count
          });
        }

        // 判断如果处理方式存在且为数组，添加 items1（处理方式、下级选项、符合程度），id 使用 behaviorId
        if (detail.treatmentMethods && Array.isArray(detail.treatmentMethods)) {
          detail.treatmentMethods.forEach((treatmentMethod: string) => {
            // 获取该处理方式的下级选项
            const subMethods = detail.treatmentSubMethods?.[treatmentMethod] || [];

            subMethods.forEach((subMethod: string) => {
              // 获取该下级选项的符合程度
              const compliance = detail.compliance?.[treatmentMethod]?.[subMethod];

              // 判断如果符合程度存在，则添加到 items1
              if (compliance !== undefined && compliance !== null) {
                items1.push({
                  id: behaviorId,
                  value1: treatmentMethod,
                  value2: subMethod,
                  radio: compliance
                });
              }
            });
          });
        }
      }
    });

    // 将转换后的数据添加到 payload
    processedValues.items = JSON.stringify(items);
    processedValues.items1 = JSON.stringify(items1);

    // 删除原始的 operation_behavior_details，因为已经转换了
    delete processedValues.operation_behavior_details;
  }

  return processedValues;
};

/**
 * 将接口返回的 items 和 items1 转换为表单需要的格式
 * @param items items 数组，格式: [{ id: string, number: number }]
 * @param items1 items1 数组，格式: [{ id: string, value1: string, value2: string, radio: string }]
 * @param operationBehaviorIds 作业行为ID数组，从 selectedRecord 中获取
 * @returns 表单格式数据 operation_behavior_details: any[]
 */
export const transformItemsToFormData = (
  items: Array<{ id: string; number: number }> = [],
  items1: Array<{ id: string; value1: string; value2: string; radio: string }> = [],
  operationBehaviorIds: string[] = []
) => {
  // 判断如果没有数据，返回空数组
  if (operationBehaviorIds.length === 0 || items.length === 0) {
    return [];
  }

  // 构建 operation_behavior_details 数组，按照 operationBehaviorIds 的顺序
  const operationBehaviorDetails = operationBehaviorIds.map((behaviorId) => {
    // 找到该作业行为对应的 count（使用字符串比较，因为 id 可能是字符串或数字）
    const item = items.find(i => String(i.id) === String(behaviorId));
    const count = item?.number;

    // 找到该作业行为对应的所有 items1 数据（使用字符串比较）
    const behaviorItems1 = items1.filter(i => String(i.id) === String(behaviorId));

    // 构建 treatmentMethods（所有唯一的处理方式）
    const treatmentMethods = Array.from(new Set(behaviorItems1.map(i => i.value1)));

    // 构建 treatmentSubMethods 和 compliance
    const treatmentSubMethods: Record<string, string[]> = {};
    const compliance: Record<string, Record<string, string>> = {};

    treatmentMethods.forEach((treatmentMethod) => {
      // 获取该处理方式下的所有下级选项
      const subMethods = Array.from(
        new Set(
          behaviorItems1
            .filter(i => i.value1 === treatmentMethod)
            .map(i => i.value2)
        )
      );

      treatmentSubMethods[treatmentMethod] = subMethods;

      // 构建符合程度数据
      compliance[treatmentMethod] = {};
      subMethods.forEach((subMethod) => {
        const item1 = behaviorItems1.find(
          i => i.value1 === treatmentMethod && i.value2 === subMethod
        );
        // 判断如果找到对应的符合程度数据，则设置
        if (item1?.radio) {
          compliance[treatmentMethod][subMethod] = item1.radio;
        }
      });
    });

    return {
      count,
      treatmentMethods,
      treatmentSubMethods,
      compliance,
    };
  });

  return operationBehaviorDetails;
};
