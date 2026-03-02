/**
 * 数据处理工具函数
 */

/**
 * 处理分公司数据
 * 将接口返回的分公司统计数据转换为表格数据格式，确保每个分公司显示两行（质量问题和HSE问题）
 * @param result 接口返回的原始数据数组
 * @returns 处理后的表格数据数组，包含每个分公司的质量问题和HSE问题两行数据，以及合计行
 *
 * 处理规则：
 * - 按分公司名称（wbs_name）分组数据
 * - 根据 problem_type 字段判断问题类型：'质量问题'/'0'/0 为质量问题，'HSE问题'/'1'/1 为HSE问题
 * - 如果 problem_type 为 null 或空，按照数据顺序判断（第一条为质量问题，第二条为HSE问题）
 * - 每个分公司确保显示两行：第一行为质量问题，第二行为HSE问题
 * - 如果某个分公司只有一种问题类型，另一行数据为0
 * - 按分公司名称排序，确保同一分公司的两条数据相邻显示
 * - 计算合计行：问题总数、较大及以上问题数量
 */
export const processBranchCompanyData = (result: any[]) => {
  // 先按分公司名称分组，确保每个分公司的两条数据（质量问题和HSE问题）都显示
  const branchMap = new Map<string, { quality: any; hse: any }>();

  result.forEach((item: any) => {
    const branchName = item.wbs_name || '未知分公司';
    const problemType = item.problem_type;

    if (!branchMap.has(branchName)) {
      branchMap.set(branchName, { quality: null, hse: null });
    }

    const branchData = branchMap.get(branchName)!;

    // 判断问题类型
    if (problemType === '质量问题' || problemType === '0' || problemType === 0) {
      branchData.quality = item;
    } else if (problemType === 'HSE问题' || problemType === '1' || problemType === 1) {
      branchData.hse = item;
    } else {
      // 如果 problem_type 为 null 或空，按照数据顺序判断
      // 如果该分公司还没有质量问题数据，就当作质量问题；否则当作HSE问题
      if (!branchData.quality) {
        branchData.quality = item;
      } else if (!branchData.hse) {
        branchData.hse = item;
      } else {
        // 如果两个都有了，根据 sumNum 判断，有值的优先
        if (item.sumNum && item.sumNum > 0) {
          if (!branchData.quality.sumNum || branchData.quality.sumNum === 0) {
            branchData.quality = item;
          } else {
            branchData.hse = item;
          }
        }
      }
    }
  });

  // 将分组后的数据转换为表格数据，每个分公司两条记录
  const apiData: any[] = [];
  let id = 1;

  // 按分公司名称排序
  const sortedBranches = Array.from(branchMap.keys()).sort();

  sortedBranches.forEach((branchName) => {
    const branchData = branchMap.get(branchName)!;

    // 质量问题行
    if (branchData.quality) {
      apiData.push({
        id: id++,
        branchCompany: branchName,
        timePeriod: branchData.quality.time_range,
        problemType: '质量问题',
        totalProblems: branchData.quality.sumNum || 0,
        levelNum: (branchData.quality.severity_level_num0 || 0) + (branchData.quality.severity_level_num1 || 0),
      });
    } else {
      // 如果没有质量问题数据，也显示一行，数据为0
      apiData.push({
        id: id++,
        branchCompany: branchName,
        timePeriod: branchData.hse?.time_range || '',
        problemType: '质量问题',
        totalProblems: 0,
        levelNum: 0,
      });
    }

    // HSE问题行
    if (branchData.hse) {
      apiData.push({
        id: id++,
        branchCompany: branchName,
        timePeriod: branchData.hse.time_range,
        problemType: 'HSE问题',
        totalProblems: branchData.hse.sumNum || 0,
        levelNum: (branchData.hse.severity_level_num0 || 0) + (branchData.hse.severity_level_num1 || 0),
      });
    } else {
      // 如果没有HSE问题数据，也显示一行，数据为0
      apiData.push({
        id: id++,
        branchCompany: branchName,
        timePeriod: branchData.quality?.time_range || '',
        problemType: 'HSE问题',
        totalProblems: 0,
        levelNum: 0,
      });
    }
  });

  // 计算合计
  const totalProblems = apiData.reduce((sum: number, item: any) => sum + (item.totalProblems || 0), 0);
  const totalLevelNum = apiData.reduce((sum: number, item: any) => sum + (item.levelNum || 0), 0);

  const total = {
    id: id,
    branchCompany: '合计',
    timePeriod: apiData[0]?.timePeriod || '',
    problemType: '',
    totalProblems: totalProblems,
    levelNum: totalLevelNum,
  };

  return [...apiData, total];
};

/**
 * 处理原有统计数据
 * 将接口返回的普通统计数据转换为表格数据格式（非分公司统计）
 * @param result 接口返回的原始数据数组
 * @returns 处理后的表格数据数组，包含质量问题和HSE问题的数据，以及合计行
 *
 * 数据字段映射：
 * - problem_type -> problemType（问题类型）
 * - time_range -> timePeriod（时间段）
 * - sumNum -> totalProblems（问题总数）
 * - severity_level_num0 -> severityLevelNum0（严重问题数量）
 * - severity_level_num1 -> severityLevelNum1（较大问题数量）
 * - severity_level_num2 -> severityLevelNum2（一般问题数量）
 * - severity_level_num3 -> severityLevelNum3（轻微问题数量）
 *
 * 合计计算：
 * - 问题总数：所有行的 totalProblems 之和
 */
export const processNormalData = (result: any[]) => {
  const apiData = result.map((item: any, index: number) => ({
    id: index + 1,
    problemType: item.problem_type,
    timePeriod: item.time_range,
    totalProblems: item.sumNum,
    severityLevelNum0: item.severity_level_num0 || 0, // 严重问题
    severityLevelNum1: item.severity_level_num1 || 0, // 较大问题
    severityLevelNum2: item.severity_level_num2 || 0, // 一般问题
    severityLevelNum3: item.severity_level_num3 || 0, // 轻微问题
  }));

  // 计算合计
  const totalProblems = apiData.reduce((sum: number, item: any) => sum + item.totalProblems, 0);

  const total = {
    id: apiData.length + 1,
    problemType: '合计',
    timePeriod: apiData[0]?.timePeriod || '',
    totalProblems: totalProblems,
    severityLevelNum0: apiData.reduce((sum: number, item: any) => sum + item.severityLevelNum0, 0),
    severityLevelNum1: apiData.reduce((sum: number, item: any) => sum + item.severityLevelNum1, 0),
    severityLevelNum2: apiData.reduce((sum: number, item: any) => sum + item.severityLevelNum2, 0),
    severityLevelNum3: apiData.reduce((sum: number, item: any) => sum + item.severityLevelNum3, 0),
  };

  return [...apiData, total];
};

/**
 * 生成分公司柱状图数据
 * 将原始数据转换为分公司柱状图所需的数据格式
 * @param data 原始数据数组
 * @returns 柱状图数据对象，包含分公司名称数组、质量问题数据数组、HSE问题数据数组
 *
 * 处理规则：
 * - 按分公司名称分组，提取每个分公司的质量问题和HSE问题数量
 * - 返回格式：{ branchChart: { branches: 分公司名称数组, quality: 质量问题数量数组, hse: HSE问题数量数组 } }
 */
export const generateBranchCompanyChartData = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    return {
      branchChart: {
        branches: [],
        quality: [],
        hse: [],
      },
    };
  }

  // 按分公司分组
  const branchMap = new Map<string, { quality: number; hse: number }>();

  data.forEach((item: any) => {
    const branch = item.wbs_name || '未知分公司';
    const problemType = item.problem_type;
    const sumNum = item.sumNum || 0;

    if (!branchMap.has(branch)) {
      branchMap.set(branch, { quality: 0, hse: 0 });
    }
    const branchData = branchMap.get(branch)!;

    if (problemType === '质量问题' || problemType === '0' || problemType === 0) {
      branchData.quality = sumNum;
    } else if (problemType === 'HSE问题' || problemType === '1' || problemType === 1) {
      branchData.hse = sumNum;
    }
  });

  const branches = Array.from(branchMap.keys()).sort();
  const qualityData = branches.map(branch => branchMap.get(branch)!.quality);
  const hseData = branches.map(branch => branchMap.get(branch)!.hse);

  return {
    branchChart: {
      branches,
      quality: qualityData,
      hse: hseData,
    },
  };
};

/**
 * 生成普通统计图表数据
 * 将原始数据转换为饼状图和柱状图所需的数据格式（非分公司统计）
 * @param data 原始数据数组
 * @returns 图表数据对象，包含饼状图数据和柱状图数据
 *
 * 返回数据格式：
 * {
 *   pieData: 饼状图数据数组，包含四个级别的总和（轻微、一般、较大、严重）
 *   barData: 柱状图数据对象，包含质量问题和HSE问题的四个级别数据
 * }
 *
 * 处理规则：
 * - 饼状图：计算所有问题（质量问题+HSE问题）的四个级别总和
 * - 柱状图：分别提取质量问题和HSE问题的四个级别数据
 * - x轴顺序：轻微问题、一般问题、较大问题、严重问题
 * - 对应字段：severity_level_num3(轻微)、severity_level_num2(一般)、severity_level_num1(较大)、severity_level_num0(严重)
 */
export const generateChartData = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    return {
      pieData: [],
      barData: {
        quality: { minor: 0, general: 0, major: 0, serious: 0 },
        hse: { minor: 0, general: 0, major: 0, serious: 0 },
      },
    };
  }

  const qualityData = data.find(item => item.problem_type === '质量问题' || item.problem_type === '0' || item.problem_type === 0);
  const hseData = data.find(item => item.problem_type === 'HSE问题' || item.problem_type === '1' || item.problem_type === 1);

  // 计算四个级别的总和
  const totalMinor = data.reduce((sum: number, item: any) => sum + (item.severity_level_num3 || 0), 0);      // 轻微问题总和
  const totalGeneral = data.reduce((sum: number, item: any) => sum + (item.severity_level_num2 || 0), 0);    // 一般问题总和
  const totalMajor = data.reduce((sum: number, item: any) => sum + (item.severity_level_num1 || 0), 0);      // 较大问题总和
  const totalSerious = data.reduce((sum: number, item: any) => sum + (item.severity_level_num0 || 0), 0);     // 严重问题总和

  // 饼状图数据 - 问题级别分布（总和）
  const pieData = [
    { value: totalMinor, name: '轻微问题' },
    { value: totalGeneral, name: '一般问题' },
    { value: totalMajor, name: '较大问题' },
    { value: totalSerious, name: '严重问题' },
  ];

  // 柱状图数据 - 质量问题 vs HSE问题对比
  // x轴顺序：轻微问题、一般问题、较大问题、严重问题
  // 对应数据：severity_level_num3, severity_level_num2, severity_level_num1, severity_level_num0
  const barData = {
    quality: {
      minor: qualityData?.severity_level_num3 || 0,      // 轻微问题
      general: qualityData?.severity_level_num2 || 0,    // 一般问题
      major: qualityData?.severity_level_num1 || 0,      // 较大问题
      serious: qualityData?.severity_level_num0 || 0,    // 严重问题
    },
    hse: {
      minor: hseData?.severity_level_num3 || 0,           // 轻微问题
      general: hseData?.severity_level_num2 || 0,        // 一般问题
      major: hseData?.severity_level_num1 || 0,           // 较大问题
      serious: hseData?.severity_level_num0 || 0,        // 严重问题
    },
  };

  return { pieData, barData };
};

/**
 * 构建接口参数
 * 将前端搜索参数转换为接口所需的参数格式
 * @param searchParams 前端搜索参数对象
 * @param searchParams.timePeriod 时间段数组 [moment对象, moment对象]
 * @param searchParams.problemSource 问题来源（可选）
 * @param searchParams.examineUnit 检查单位（可选）
 * @returns 接口参数对象
 *
 * 参数映射规则：
 * - selectWbsCode: 从 localStorage 获取 'auth-default-wbsCode'
 * - problemObsCode: 来自 searchParams.problemSource（问题来源）
 * - examineWbsCode: 来自 searchParams.examineUnit（检查单位）
 * - mints: 时间段开始时间的时间戳（秒级），来自 searchParams.timePeriod[0]
 * - maxts: 时间段结束时间的时间戳（秒级），来自 searchParams.timePeriod[1]
 *
 * 时间戳转换：
 * - 使用 moment 的 unix() 方法转换为秒级时间戳
 * - 如果 timePeriod 不存在或长度不为2，则不添加时间戳参数
 */
export const buildApiParams = (searchParams: any) => {
  const params: any = {
    selectWbsCode: localStorage.getItem('auth-default-wbsCode'),
  };

  // 问题来源
  if (searchParams.problemSource) {
    params.problemObsCode = searchParams.problemSource;
  }

  // 检查单位
  if (searchParams.examineUnit) {
    params.examineWbsCode = searchParams.examineUnit;
  }

  // 时间戳转换
  if (searchParams.timePeriod && searchParams.timePeriod.length === 2) {
    params.mints = searchParams.timePeriod[0]?.unix(); // moment转时间戳（秒）
    params.maxts = searchParams.timePeriod[1]?.unix(); // moment转时间戳（秒）
  }

  return params;
};

