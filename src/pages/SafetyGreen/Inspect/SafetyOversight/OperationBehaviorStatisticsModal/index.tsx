import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Modal, DatePicker, Space, Button, message, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { getDateProblemTypeStatistics } from '@/services/safetyGreen/inspect/qualitySafetyOversight';
import { getChartOption } from './chartOptions';

const { RangePicker } = DatePicker;

interface OperationBehaviorStatisticsModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 用户层级常量
 */
const USER_LEVEL = {
  /** 公司层级：显示所有分公司 */
  COMP: 'comp',
  /** 公司层级（另一种标识） */
  BRANCH_COMP: 'branchComp',
  /** 分公司层级：显示所有项目部 */
  SUB_COMP: 'subComp',
  /** 项目部层级：直接显示折线图 */
  DEP: 'dep',
} as const;

/**
 * 返回操作类型常量
 */
const BACK_ACTION_TYPE = {
  /** 从项目部返回分公司 */
  FROM_PROJECT_TO_BRANCH: 'fromProjectToBranch',
  /** 从分公司返回所有分公司 */
  FROM_BRANCH_TO_ALL: 'fromBranchToAll',
  /** 从项目部返回所有项目部（分公司层级） */
  FROM_PROJECT_TO_ALL: 'fromProjectToAll',
} as const;

/** 返回操作类型 */
type BackActionType = typeof BACK_ACTION_TYPE[keyof typeof BACK_ACTION_TYPE];

/**
 * 作业行为统计分析弹窗
 * 支持三级下钻：公司 -> 分公司 -> 项目部
 */
const OperationBehaviorStatisticsModal: React.FC<OperationBehaviorStatisticsModalProps> = ({
  visible,
  onClose,
}) => {
  // ========== 状态管理 ==========
  
  /** 加载状态：控制数据加载时的 loading 显示 */
  const [loading, setLoading] = useState(false);
  
  /** 图表数据：存储处理后的图表数据（柱状图或折线图） */
  const [chartData, setChartData] = useState<any>(null);
  
  /** 图表 key：用于强制刷新图表组件 */
  const [chartKey, setChartKey] = useState(0);
  
  /** 月份范围：用户选择的查询月份范围 */
  const [monthRange, setMonthRange] = useState<[moment.Moment | null, moment.Moment] | null>(null);

  /** 下钻状态：记录当前选中的分公司信息（用于公司层级的下钻） */
  const [selectedBranchComp, setSelectedBranchComp] = useState<{ wbsCode: string; wbsName: string } | null>(null);
  
  /** 下钻状态：记录当前选中的项目部信息（用于分公司层级的下钻） */
  const [selectedProject, setSelectedProject] = useState<{ wbsCode: string; wbsName: string } | null>(null);

  /** 返回操作 ref：用于存储返回时需要的信息，避免异步状态问题 */
  const backActionRef = useRef<{
    type: BackActionType;
    branchCompWbsCode?: string;
  } | null>(null);

  // ========== 用户层级判断（使用 useMemo 优化） ==========
  
  /**
   * 用户层级判断：根据 localStorage 中的 prop-key 判断用户层级
   * @returns {Object} 用户层级标识对象
   *   - isComp: 是否为公司层级（显示所有分公司）
   *   - isSubComp: 是否为分公司层级（显示所有项目部）
   *   - isDep: 是否为项目部层级（直接显示折线图）
   */
  const userLevel = useMemo(() => {
    const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
    return {
      // 判断是否为公司层级：comp 或 branchComp
      isComp: propKey === USER_LEVEL.COMP || propKey === USER_LEVEL.BRANCH_COMP,
      // 判断是否为分公司层级：subComp
      isSubComp: propKey === USER_LEVEL.SUB_COMP,
      // 判断是否为项目部层级：dep
      isDep: propKey === USER_LEVEL.DEP,
    };
  }, []);

  // ========== 工具函数 ==========

  /**
   * 获取默认月份范围：当前月份往前推12个月
   * @returns {[moment.Moment, moment.Moment]} 返回 [起始月份, 结束月份] 的数组
   */
  const getDefaultMonths = (): [moment.Moment, moment.Moment] => {
    const now = moment();
    // 起始月份：当前月份往前推12个月
    const startMonth = moment(now).subtract(12, 'months').startOf('month');
    // 结束月份：当前月份
    const endMonth = moment(now).startOf('month');
    return [startMonth, endMonth];
  };

  /**
   * 按 wbs_code 分组数据，计算每个分组的总数
   * 用于生成柱状图数据（分公司列表或项目部列表）
   * @param {any[]} data - 原始数据数组
   * @returns {Object} 分组后的数据对象
   *   - projectNames: 名称数组（用于 X 轴）
   *   - totalNums: 总数数组（用于 Y 轴）
   *   - projectListData: 完整数据数组（用于点击事件）
   */
  const groupDataByWbsCode = useCallback((data: any[]) => {
    const groupedMap = new Map<string, { wbsCode: string; wbsName: string; totalNum: number }>();

    data.forEach((item: any) => {
      const wbsCode = item.wbs_code || '';
      // 如果 wbs_code 为空，跳过该条数据
      if (!wbsCode) return;

      const wbsName = item.wbs_name || wbsCode;
      const itemNum = item.item_num || 0;
      const existing = groupedMap.get(wbsCode);

      // 如果该 wbs_code 已存在，累加总数
      if (existing) {
        existing.totalNum += itemNum;
      } else {
        // 如果不存在，创建新项
        groupedMap.set(wbsCode, { wbsCode, wbsName, totalNum: itemNum });
      }
    });

    const listData = Array.from(groupedMap.values());
    return {
      projectNames: listData.map(item => item.wbsName),
      totalNums: listData.map(item => item.totalNum),
      projectListData: listData,
    };
  }, []);

  /**
   * 使用 useRef 存储最新的状态和函数，避免依赖循环
   * 作用：在 useEffect 中访问最新的状态值，而不需要将其加入依赖数组
   */
  type FetchDataFn = (range?: [moment.Moment | null, moment.Moment | null] | null, customSelectWbsCode?: string, isProjectLevel?: boolean) => Promise<void>;
  
  /** 状态 ref：存储最新的月份范围、选中的项目和 fetchData 函数 */
  const stateRef = useRef<{
    monthRange: typeof monthRange;
    selectedProject: typeof selectedProject;
    fetchData: FetchDataFn;
  }>({
    monthRange,
    selectedProject,
    fetchData: (async () => Promise.resolve()) as FetchDataFn,
  });

  /**
   * 同步 ref 的值：当 monthRange 或 selectedProject 变化时，更新 ref 中的值
   * 这样在异步回调中可以访问到最新的状态值
   */
  useEffect(() => {
    stateRef.current.monthRange = monthRange;
    stateRef.current.selectedProject = selectedProject;
  }, [monthRange, selectedProject]);

  /**
   * 处理折线图数据：提取 dict_name 和 item_num
   * @param {any[]} data - 原始数据数组
   */
  const processLineChartData = (data: any[]) => {
    // 如果数据为空或不是数组，清空图表数据
    if (!Array.isArray(data) || data.length === 0) {
      setChartData(null);
      return;
    }
    // 提取 dict_name 作为 X 轴，item_num 作为 Y 轴
    setChartData({
      dictNames: data.map(item => item.dict_name || ''),
      itemNums: data.map(item => item.item_num || 0),
    });
  };

  /**
   * 处理柱状图数据：按 wbs_code 分组
   * @param {any[]} data - 原始数据数组
   */
  const processBarChartData = (data: any[]) => {
    // 如果数据为空或不是数组，清空图表数据
    if (!Array.isArray(data) || data.length === 0) {
      setChartData(null);
      return;
    }
    // 按 wbs_code 分组并计算总数
    const groupedData = groupDataByWbsCode(data);
    setChartData(groupedData);
  };

  /**
   * 根据当前状态决定使用哪种图表类型处理数据
   * @param {any[]} data - 原始数据数组
   * @param {boolean} [isProjectLevel] - 是否明确标识为项目部层级
   */
  const processChartDataByState = (data: any[], isProjectLevel?: boolean) => {
    const currentSelectedProject = stateRef.current.selectedProject;
    
    // 判断条件1：明确标识为项目部层级或已选中项目部，显示折线图
    if (isProjectLevel || currentSelectedProject) {
      processLineChartData(data);
      return;
    }

    // 判断条件2：项目部层级用户，直接显示折线图
    if (userLevel.isDep) {
      processLineChartData(data);
      return;
    }

    // 判断条件3：公司层级或分公司层级，显示柱状图
    if (userLevel.isComp || userLevel.isSubComp) {
      processBarChartData(data);
      return;
    }

    // 默认情况：显示柱状图
    processBarChartData(data);
  };

  /**
   * 获取数据：调用接口获取统计数据
   * @param {[moment.Moment | null, moment.Moment] | null} [range] - 月份范围，不传则使用当前 monthRange
   * @param {string} [customSelectWbsCode] - 自定义的 wbs_code（用于下钻时指定查询范围）
   * @param {boolean} [isProjectLevel] - 是否明确标识为项目部层级
   */
  const fetchData = useCallback(async (
    range?: [moment.Moment | null, moment.Moment | null] | null,
    customSelectWbsCode?: string,
    isProjectLevel?: boolean
  ) => {
    // 获取月份范围：优先使用传入的值，否则使用 ref 中存储的最新值
    const [startM, endM] = range || stateRef.current.monthRange || [null, null];

    // 判断：如果起始月份或结束月份为空，提示用户并返回
    if (!startM || !endM) {
      message.warning('请选择起始月份和结束月份');
      return;
    }

    setLoading(true);
    // 获取 wbs_code：优先使用传入的值，否则从 localStorage 获取，最后使用空字符串
    const selectWbsCode = customSelectWbsCode ?? localStorage.getItem('auth-default-wbsCode') ?? '';

    // 构建接口参数
    const params = {
      sort: 'wbs_code',
      mints: startM.startOf('month').unix(), // 起始月份的时间戳（月初）
      maxts: endM.endOf('month').unix(),     // 结束月份的时间戳（月末）
      selectWbsCode,
    };

    // 调用接口获取数据，捕获错误
    const response = await getDateProblemTypeStatistics(params).catch((error) => {
      console.error('获取统计数据失败:', error);
      message.error('获取统计数据失败');
      setChartData(null);
      setLoading(false);
      return null;
    });

    // 判断：如果接口调用失败（返回 null），直接返回
    if (!response) {
      return;
    }

    // 判断：如果接口返回错误码不为 0，显示错误信息并返回
    if (response.errCode !== 0) {
      message.error(response.errMsg || '获取数据失败');
      setChartData(null);
      setLoading(false);
      return;
    }

    // 处理成功返回的数据
    const data = response.rows || [];
    processChartDataByState(data, isProjectLevel);
    setChartKey(prev => prev + 1); // 更新图表 key，强制刷新图表
    setLoading(false);
  }, [userLevel, groupDataByWbsCode]);

  /**
   * 同步 fetchData 到 ref：当 fetchData 函数变化时，更新 ref 中的引用
   * 这样在异步回调中可以访问到最新的函数
   */
  useEffect(() => {
    stateRef.current.fetchData = fetchData;
  }, [fetchData]);

  // ========== 事件处理函数 ==========

  /**
   * 查询按钮点击事件：使用当前月份范围重新获取数据
   */
  const handleSearch = useCallback(() => {
    fetchData(monthRange);
  }, [fetchData, monthRange]);

  /**
   * 重置按钮点击事件：重置月份范围和下钻状态，重新获取数据
   */
  const handleReset = useCallback(() => {
    const defaultRange = getDefaultMonths();
    setMonthRange([defaultRange[0], defaultRange[1]]);
    setSelectedBranchComp(null);
    setSelectedProject(null);
    fetchData([defaultRange[0], defaultRange[1]]);
  }, [fetchData]);

  /**
   * 点击分公司下钻事件（公司层级第一层）
   * @param {string} wbsCode - 分公司的 wbs_code
   * @param {string} wbsName - 分公司的名称
   */
  const handleBranchCompClick = useCallback((wbsCode: string, wbsName: string) => {
    setSelectedBranchComp({ wbsCode, wbsName });
    setSelectedProject(null); // 清空项目部选择
    fetchData(monthRange, wbsCode, false); // 获取该分公司下的数据
  }, [fetchData, monthRange]);

  /**
   * 点击项目部下钻事件
   * @param {string} wbsCode - 项目部的 wbs_code
   * @param {string} wbsName - 项目部的名称
   */
  const handleProjectClick = useCallback((wbsCode: string, wbsName: string) => {
    setSelectedProject({ wbsCode, wbsName });
    fetchData(monthRange, wbsCode, true); // 获取该项目部的数据，标识为项目部层级
  }, [fetchData, monthRange]);

  /**
   * 柱状图点击事件：根据当前层级和下钻状态决定下钻到哪一级
   * @param {any} params - echarts 点击事件参数
   */
  const handleBarChartClick = useCallback((params: any) => {
    // 判断：如果图表数据或项目列表数据不存在，直接返回
    if (!chartData?.projectListData) return;

    const item = chartData.projectListData[params.dataIndex];
    // 判断：如果点击的项目项不存在，直接返回
    if (!item) return;

    // 判断：公司层级的下钻逻辑
    if (userLevel.isComp) {
      // 判断：第一层（未选中分公司和项目部），点击分公司下钻
      if (!selectedBranchComp && !selectedProject) {
        handleBranchCompClick(item.wbsCode, item.wbsName);
        return;
      }
      // 判断：第二层（已选中分公司但未选中项目部），点击项目部下钻
      if (selectedBranchComp && !selectedProject) {
        handleProjectClick(item.wbsCode, item.wbsName);
        return;
      }
      return;
    }

    // 判断：分公司层级的下钻逻辑（未选中项目部时，点击项目部下钻）
    if (userLevel.isSubComp && !selectedProject) {
      handleProjectClick(item.wbsCode, item.wbsName);
    }
  }, [chartData, userLevel, selectedBranchComp, selectedProject, handleBranchCompClick, handleProjectClick]);

  /**
   * 返回按钮：从当前层级返回上一级
   */
  const handleBack = useCallback(() => {
    // 公司层级：三级返回逻辑
    if (userLevel.isComp) {
      if (selectedProject && selectedBranchComp) {
        // 从项目部返回分公司
        setSelectedProject(null);
        backActionRef.current = {
          type: BACK_ACTION_TYPE.FROM_PROJECT_TO_BRANCH,
          branchCompWbsCode: selectedBranchComp.wbsCode,
        };
        return;
      }
      if (selectedBranchComp) {
        // 从分公司返回所有分公司
        setSelectedBranchComp(null);
        backActionRef.current = { type: BACK_ACTION_TYPE.FROM_BRANCH_TO_ALL };
        return;
      }
      return;
    }

    // 分公司层级：二级返回逻辑
    if (userLevel.isSubComp && selectedProject) {
      // 从项目部返回所有项目部
      setSelectedProject(null);
      backActionRef.current = { type: BACK_ACTION_TYPE.FROM_PROJECT_TO_ALL };
    }
  }, [userLevel, selectedProject, selectedBranchComp]);

  // ========== 图表配置 ==========

  /**
   * 获取图表配置（调用外部工具函数）
   */
  const chartConfig = useMemo(() => {
    return getChartOption({
      chartData,
      isComp: userLevel.isComp,
      isSubComp: userLevel.isSubComp,
      selectedProject,
      selectedBranchComp,
    });
  }, [chartData, userLevel, selectedProject, selectedBranchComp]);

  // ========== 计算属性 ==========

  /**
   * 弹窗标题：根据下钻状态显示不同标题
   * @returns {string} 弹窗标题文本
   */
  const modalTitle = useMemo(() => {
    // 判断：如果选中了项目部，显示项目部名称
    if (selectedProject) {
      return `查看作业行为统计分析 - ${selectedProject.wbsName}`;
    }
    // 判断：如果选中了分公司，显示分公司名称
    if (selectedBranchComp) {
      return `查看作业行为统计分析 - ${selectedBranchComp.wbsName}`;
    }
    // 默认标题
    return "查看作业行为统计分析";
  }, [selectedProject, selectedBranchComp]);

  /**
   * 是否有数据可显示
   * @returns {boolean} 是否有数据
   */
  const hasData = useMemo(() => {
    // 判断：公司/分公司层级且未选中项目部，检查是否有柱状图数据
    if ((userLevel.isComp || userLevel.isSubComp) && !selectedProject) {
      return (chartData?.projectNames?.length ?? 0) > 0;
    }
    // 判断：项目部层级，检查是否有折线图数据
    return (chartData?.dictNames?.length ?? 0) > 0;
  }, [userLevel, selectedProject, chartData]);

  /**
   * 是否可点击（柱状图可点击下钻）
   * @returns {boolean} 是否可点击
   */
  const isClickable = useMemo(() => {
    // 判断：公司或分公司层级，且未选中项目部时，柱状图可点击
    return (userLevel.isComp || userLevel.isSubComp) && !selectedProject;
  }, [userLevel, selectedProject]);

  // ========== 初始化 ==========

  /**
   * 弹窗打开时初始化：重置状态并加载数据
   * 当弹窗打开时，重置所有状态并加载默认数据
   */
  useEffect(() => {
    // 判断：如果弹窗不可见，直接返回
    if (!visible) return;

    const defaultRange = getDefaultMonths();
    setMonthRange([defaultRange[0], defaultRange[1]]);
    setSelectedBranchComp(null);
    setSelectedProject(null);
    backActionRef.current = null;
    fetchData([defaultRange[0], defaultRange[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]); // 只在 visible 变化时执行，fetchData 使用 ref 访问最新状态

  /**
   * 返回操作处理映射表：根据返回操作类型执行相应的数据获取逻辑
   */
  const backActionHandlers: Record<BackActionType, (branchCompWbsCode?: string) => void> = {
    // 从项目部返回分公司：获取分公司的数据
    [BACK_ACTION_TYPE.FROM_PROJECT_TO_BRANCH]: (branchCompWbsCode?: string) => {
      // 判断：如果分公司 wbs_code 不存在，直接返回
      if (!branchCompWbsCode) return;
      const { monthRange, fetchData } = stateRef.current;
      fetchData(monthRange, branchCompWbsCode, false);
    },
    // 从分公司返回所有分公司：获取所有分公司的数据
    [BACK_ACTION_TYPE.FROM_BRANCH_TO_ALL]: () => {
      const { monthRange, fetchData } = stateRef.current;
      fetchData(monthRange, undefined, false);
    },
    // 从项目部返回所有项目部（分公司层级）：获取所有项目部的数据
    [BACK_ACTION_TYPE.FROM_PROJECT_TO_ALL]: () => {
      const { monthRange, fetchData } = stateRef.current;
      fetchData(monthRange, undefined, false);
    },
  };

  /**
   * 监听返回操作：当状态更新后执行返回逻辑
   * 当 selectedProject 或 selectedBranchComp 变化时，检查是否有待执行的返回操作
   */
  useEffect(() => {
    const action = backActionRef.current;
    // 判断：如果没有待执行的返回操作，直接返回
    if (!action) return;

    backActionRef.current = null; // 清空 ref，避免重复执行
    const handler = backActionHandlers[action.type];
    
    // 判断：如果找到对应的处理函数，执行它
    if (handler) {
      handler(action.branchCompWbsCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, selectedBranchComp]); // fetchData 和 monthRange 通过 ref 访问最新值

  /**
   * 处理月份范围变化事件
   * @param {[moment.Moment | null, moment.Moment] | null} dates - 选择的日期范围
   */
  const handleMonthRangeChange = useCallback((dates: [moment.Moment | null, moment.Moment | null] | null) => {
    // 判断：如果选择了有效的日期范围，更新状态
    if (dates?.[0] && dates?.[1]) {
      setMonthRange([dates[0], dates[1]]);
    } else {
      // 否则清空月份范围
      setMonthRange(null);
    }
  }, []);

  /**
   * 处理弹窗关闭事件：清空下钻状态并关闭弹窗
   */
  const handleModalClose = useCallback(() => {
    setSelectedBranchComp(null);
    setSelectedProject(null);
    onClose();
  }, [onClose]);

  /**
   * 是否显示返回按钮：当选中了分公司或项目部时显示
   */
  const showBackButton = selectedProject || selectedBranchComp;

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <div style={{ padding: '20px 0' }}>
        {/* 月份范围选择器 */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Space>
              <span>月份范围：</span>
              <RangePicker
                picker="month"
                value={monthRange as [moment.Moment, moment.Moment] | null}
                onChange={handleMonthRangeChange}
                format="YYYY-MM"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current.isAfter(moment(), 'month')}
              />
            </Space>
          </Col>
          <Col span={16}>
            <Space>
              <Button type="primary" onClick={handleSearch} loading={loading}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              {/* 判断：如果在下钻状态，显示返回按钮 */}
              {showBackButton && (
                <Button onClick={handleBack}>返回</Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* 图表区域 */}
        <div style={{ minHeight: '400px' }}>
          {/* 判断：如果正在加载，显示加载提示 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>加载中...</div>
          ) : hasData ? (
            // 判断：如果有数据，显示图表
            <ReactECharts
              key={`operation-behavior-chart-${chartKey}`}
              option={chartConfig}
              style={{
                height: '400px',
                width: '100%',
                cursor: isClickable ? 'pointer' : 'default' // 判断：如果可点击，显示手型光标
              }}
              opts={{ renderer: 'canvas' }}
              onEvents={isClickable ? { click: handleBarChartClick } : {}} // 判断：如果可点击，绑定点击事件
            />
          ) : (
            // 判断：如果没有数据，显示无数据提示
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
              暂无数据
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OperationBehaviorStatisticsModal;

