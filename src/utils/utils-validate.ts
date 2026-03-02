/*
  处理不同检验规则的工具类
 */
/**
 * 校验用户编码是否存在中文
 * @param rule
 * @param value
 */
export function checkChinese(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入用户编码'));
  }
  if (value) {
    for (let i = 0; i < value.length; i += 1) {
      if (value.charCodeAt(i) > 255) {
        return Promise.reject(new Error('用户编码不能存在中文'));
      }
    }
  }
  return Promise.resolve();
}

/**
 * 手机号码的检验
 * @param rule
 * @param value
 */
export function checkPhone(rule: any, value: any) {
  // if (!value) {
  //   return Promise.reject(new Error('请输入号码'));
  // }
  if (value) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
      return Promise.reject(new Error('号码有误'));
    }
  }
  return Promise.resolve();
}

/**
 * 请保留小数点后3位,必填
 * @param rule
 * @param value
 */
export function checkDecimalPoint(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入数字'));
  }
  if (value) {
    if (/^\d+\.\d+$/.test(value)) {
      if (value.toString().length - value.indexOf('.') > 4) {
        return Promise.reject(new Error('仅支持保留到小数点后3位'));
      }
    } else if (!/^\d{1,}$/.test(value)) {
      return Promise.reject(new Error('仅支持保留到小数点后3位'));
    }
  }
  return Promise.resolve();
}

/**
 * 请保留小数点后3位,非必填
 * @param rule
 * @param value
 */
export function checkDecimalPointNoRequired(rule: any, value: any) {
  if (value) {
    if (/^\d+\.\d+$/.test(value)) {
      if (value.toString().length - value.indexOf('.') > 4) {
        return Promise.reject(new Error('仅支持保留到小数点后3位'));
      }
    } else if (!/^\d{1,}$/.test(value)) {
      return Promise.reject(new Error('仅支持保留到小数点后3位'));
    }
  }
  return Promise.resolve();
}

/**
 * 仅支持数组字母下划线16位
 * @param rule
 * @param value
 */
export function numLetterUnderline(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入当前装置编码'));
  }
  if (value) {
    if (!/^[a-zA-Z0-9_-]{1,16}$/.test(value)) {
      return Promise.reject(new Error('仅允许为数字,字母,下划线组合'));
    }
  }
  return Promise.resolve();
}

/**
 * 仅支持 %整数
 * @param rule
 * @param value
 */
export function PercentageInteger(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入检测比例(%)'));
  }
  if (value) {
    if (!/^(100|[1-9]?\d?)%$|0$/.test(value)) {
      return Promise.reject(new Error('仅允许为%的整数'));
    }
  }
  return Promise.resolve();
}

/**
 * 仅支持0-100整数
 * @param rule
 * @param value
 */
export function Int(rule: any, value: any) {
  // if (!value) {
  //   return Promise.reject(new Error('这是必填项'));
  // }
  if (value) {
    if (!/^(?:0|[1-9][0-9]?|100)$/.test(value)) {
      return Promise.reject(new Error('仅允许为整数'));
    }
  }
  return Promise.resolve();
}
/**
 * 仅支持整数
 * @param rule
 * @param value
 */
export function AllInt(rule: any, value: any) {
  if (value === '' || value === undefined || value === null) {
    // 0不进入
    return Promise.reject(new Error('这是必填项'));
  }
  if (value) {
    if (!/^(0|[1-9]\d*)$/.test(value)) {
      return Promise.reject(new Error('仅允许为0或正整数'));
    }
  }
  return Promise.resolve();
}

/**
 * 校验装置编码是否存在中文
 * @param rule
 * @param value
 */
export function checkDevCode(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入装置编码'));
  }
  if (value) {
    for (let i = 0; i < value.length; i += 1) {
      if (value.charCodeAt(i) > 255) {
        return Promise.reject(new Error('当前装置编码不能存在中文'));
      }
    }
  }
  return Promise.resolve();
}

/**
 * 校验单元编码是否存在中文
 * @param rule
 * @param value
 */
export function checkUnitCode(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入单元编码'));
  }
  if (value) {
    for (let i = 0; i < value.length; i += 1) {
      if (value.charCodeAt(i) > 255) {
        return Promise.reject(new Error('当前单元编码不能存在中文'));
      }
    }
  }
  return Promise.resolve();
}

/**
 * 校验是否是中文姓名
 * @param rule
 * @param value
 */
export function checkChineseName(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入姓名'));
  }
  if (value) {
    if (!/^(?:[\u4e00-\u9fa5·]{2,16})$/.test(value)) {
      return Promise.reject(new Error('请输入正确姓名'));
    }
  }
  return Promise.resolve();
}

/**
 * 只允许输入数字字母下划线组合
 * @param rule
 * @param value
 */
export function checkWbsCode(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入WBS编码'));
  }
  if (value) {
    if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
      return Promise.reject(new Error('编码仅允许为数字字母下划线组合'));
    }
  }
  return Promise.resolve();
}

/**
 * 只允许输入：数字、字母、下划线和减号
 * @param rule
 * @param value
 */
export function checkUnitProjectCode(rule: any, value: any) {
  if (!value) {
    return Promise.reject(new Error('请输入Wbs编码'));
  }
  if (value) {
    if (!/^[0-9a-zA-Z_-]{1,}$/.test(value)) {
      return Promise.reject(new Error('编码仅允许为数字字母下划线短横线组合'));
    }
  }
  return Promise.resolve();
}

/**
 * 只允许输入 字母、数字和/ 组合
 * @param rule
 * @param value
 */
export function checkSpecialRequire(rule: any, value: any) {
  // if (!value) {
  //   return Promise.reject(new Error('请输入WBS编码'));
  // }
  if (value) {
    if (!/^[0-9a-zA-Z/\u4e00-\u9fa5]*$/.test(value)) {
      return Promise.reject(new Error('只能输入/作为分割符号'));
    }
  }
  return Promise.resolve();
}

/**
 * 校验下拉数组数据
 * @param rule
 * @param value
 * @param max
 * @param required
 */
export const checkArrCount = (rule: any, value: any[], max: number, required: boolean = true) => {
  if (!value && required) {
    return Promise.reject(new Error('这是必填项'));
  }
  if (value?.length < 1 && required) {
    return Promise.reject(new Error('这是必填项'));
  }
  if (value?.length > 0 && value?.length > max) {
    return Promise.reject(new Error(`最多只能选择${max}项`));
  }
  return Promise.resolve();
};

/**
 * 校验是否是身份证
 * @param rule
 * @param value
 */
export function checkID(rule: any, value: any) {
  return new Promise((resolve, reject) => {
    if (!value) {
      reject(new Error('请输入身份证号'));
    }
    if (value) {
      if (
        !/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(
          value,
        )
      ) {
        reject(new Error('请输入正确身份证号'));
      }
    }
    resolve(true);
  });
}


export const scoreCheckValid = {
  // 产品质量
  validateProductQualityScore: (_, value) => {
    // 1. 空值校验（可根据业务需求调整为必填/非必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 类型转换与有效性校验（兼容手动输入字符串的场景）
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return Promise.reject(new Error('请输入有效的数字'));
    }

    // 3. 区间校验（0 ≤ 分数 ≤ 20）
    if (numValue < 0 || numValue > 20) {
      return Promise.reject(new Error('分数需在0-20分之间'));
    }

    // 4. 偶数校验（核心规则：能被2整除且为整数）
    // 先判断是否为整数（避免如 2.0 之外的小数，如 2.2 这类伪偶数）
    if (!Number.isInteger(numValue)) {
      return Promise.reject(new Error('分数需为整数'));
    }
    // 判断是否为偶数
    if (numValue % 2 !== 0) {
      return Promise.reject(new Error('分数需为0-20范围内的偶数（如0、2、4...20）'));
    }

    // 所有校验通过
    return Promise.resolve();
  },
  // 服务能力
  validateSeviceAbilityScore: (_, value) => {
    // 1. 空值校验（可根据业务需求调整为必填/非必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 类型转换与有效性校验（兼容手动输入字符串的场景，如"8"）
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return Promise.reject(new Error('请输入有效的数字'));
    }

    // 3. 区间校验（核心：0 ≤ 分数 ≤ 15）
    if (numValue < 0 || numValue > 15) {
      return Promise.reject(new Error('分数需在0-15分之间'));
    }

    // 4. 整数校验（核心规则：必须为整数，杜绝小数如 5.5 这类无效值）
    if (!Number.isInteger(numValue)) {
      return Promise.reject(new Error('分数需为整数（如0、1、2...15）'));
    }

    // 所有校验通过
    return Promise.resolve();
  },
  // 合同
  validateContractScore: (_, value) => {
    // 1. 空值校验（可根据业务需求调整为必填/非必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 类型转换与有效性校验（兼容手动输入字符串的场景，如"8"）
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return Promise.reject(new Error('请输入有效的数字'));
    }

    // 3. 区间校验（核心：0 ≤ 分数 ≤ 15）
    if (numValue < 0 || numValue > 15) {
      return Promise.reject(new Error('分数需在0-15分之间'));
    }

    // 4. 整数校验（核心规则：必须为整数，杜绝小数如 5.5 这类无效值）
    if (!Number.isInteger(numValue)) {
      return Promise.reject(new Error('分数需为整数（如0、1、2...15）'));
    }

    // 所有校验通过
    return Promise.resolve();
  },
  // 价格水平
  validatePriceLevelScore: (_, value) => {
    // 1. 空值校验（根据业务需求决定是否必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 区间校验（0-15分）
    if (value < 5 || value > 15) {
      return Promise.reject(new Error('分数需在5-15分之间'));
    }

    // 3. 大于等于5分且为0.1的整数倍校验
    if (value >= 5) {
      // 乘以10后取整，判断是否等于原数（验证是否为0.1的整数倍）
      const multiplied = value * 10;
      if (!Number.isInteger(multiplied)) {
        return Promise.reject(new Error('5分及以上需为0.1分的整数倍（如5.0、5.1、5.2...）'));
      }
    }

    // 校验通过
    return Promise.resolve();
  },
  // 技术水平
  validateTechnologicalLevelScore: (_, value) => {
    // 1. 空值校验（可根据业务需求调整为必填/非必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 类型转换与有效性校验（兼容手动输入字符串的场景，如"8"）
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return Promise.reject(new Error('请输入有效的数字'));
    }

    // 3. 区间校验（核心：0 ≤ 分数 ≤ 10）
    if (numValue < 0 || numValue > 10) {
      return Promise.reject(new Error('分数需在0-10分之间'));
    }

    // 4. 整数校验（核心规则：必须为整数，杜绝小数如 5.5 这类无效值）
    if (!Number.isInteger(numValue)) {
      return Promise.reject(new Error('分数需为整数（如0、1、2...15）'));
    }

    // 所有校验通过
    return Promise.resolve();
  },
  // 诚信经营
  validateIntegrityManagementScore: (_, value) => {
    // 1. 空值校验（可根据业务调整为必填/非必填）
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请输入分数'));
    }

    // 2. 类型转换与有效性校验（兼容字符串格式输入，如"7.5"）
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return Promise.reject(new Error('请输入有效的数字'));
    }

    // 3. 区间校验（核心：0 ≤ 分数 ≤ 10）
    if (numValue < 0 || numValue > 10) {
      return Promise.reject(new Error('分数需在0-10分之间'));
    }

    // 4. 规则一：所有数必须是0.5的整数倍
    // 验证逻辑：乘以2后为整数 → 说明是0.5的倍数（如5.0×2=10、7.5×2=15，8.2×2=16.4非整数）
    const multiplied = numValue * 2;
    if (!Number.isInteger(multiplied)) {
      return Promise.reject(new Error('分数需为0.5分的整数倍（如0.0、0.5、1.0...10.0）'));
    }

    // 5. 规则二：禁止出现8.5、9.5
    const forbiddenValues = [8.5, 9.5];
    if (forbiddenValues.includes(numValue)) {
      return Promise.reject(new Error('分数不能为8.5或9.5'));
    }

    // 所有校验通过
    return Promise.resolve();
  }
}
