import React, { useEffect, useState, useCallback } from 'react';
import { Card, message, Modal, Table, Spin } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import SearchForm from './SearchForm';
import BranchCompanyChart from './BranchCompanyChart';
import NormalCharts from './NormalCharts';
import { useInitData } from './hooks';
import { buildApiParams, generateBranchCompanyChartData, generateChartData, processNormalData, processBranchCompanyData } from './problemGradingStatisticsUtils';
import { getDefaultTimePeriod } from '../problemStatisticsUtils';
import { getBranchCompanyColumns, columns } from './columns';
import { getProblemGradingStatistics, getIfCloseStatistics, getSubProblemGradingStatistics } from '@/services/safetyGreen/inspect/problemStatistics';

/**
 * 问题分级统计组件
 * 功能：统计质量问题、HSE问题的分级情况（轻微、一般、较大、严重）
 * 包含两个统计维度：
 * 1. 普通统计：按问题类型和分级统计
 * 2. 分公司统计：按分公司维度统计问题分布
 */
const ProblemGradingStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;

  // 加载状态
  const [loading, setLoading] = useState(false);

  // 普通统计数据：用于展示问题分级统计图表和表格
  const [normalChartData, setNormalChartData] = useState<any>({});
  const [normalTableData, setNormalTableData] = useState<any[]>([]);

  // 分公司统计数据：用于展示分公司维度的问题分布
  const [branchChartData, setBranchChartData] = useState<any>({});
  const [branchTableData, setBranchTableData] = useState<any[]>([]);

  // 图表刷新key：用于强制重新渲染图表
  const [chartKey, setChartKey] = useState(0);

  // 弹窗状态：控制详情表格弹窗的显示
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'normal' | 'branch'>('normal');

  // 搜索参数：时间范围、问题来源、检查单位
  const [searchParams, setSearchParams] = useState<{
    timePeriod: [moment.Moment, moment.Moment] | undefined;
    problemSource: string | undefined;
    examineUnit: string | undefined;
  }>({
    timePeriod: getDefaultTimePeriod(),
    problemSource: undefined,
    examineUnit: undefined,
  });

  /** 初始化数据（获取下拉选项） */
  const { obsCodeAllData, wbsOptions } = useInitData(dispatch);

  /** 处理普通图表点击事件：打开普通统计详情弹窗 */
  const handleNormalChartClick = useCallback(() => {
    setModalType('normal');
    setModalVisible(true);
  }, []);

  /** 处理分公司图表点击事件：打开分公司统计详情弹窗 */
  const handleBranchChartClick = useCallback(() => {
    setModalType('branch');
    setModalVisible(true);
  }, []);

  /**
   * 检查接口响应是否成功
   * @param res 接口响应对象
   * @returns 是否成功且有数据
   */
  const isResponseSuccess = (res: any): boolean => {
    return Boolean(res && res.errCode === 0 && res.result);
  };

  /**
   * 处理普通统计数据响应
   * @param res 接口响应对象
   */
  const handleProblemGradingResponse = (res: any) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 成功时：生成图表数据和表格数据
    const normalChartData = isSuccess ? generateChartData(res.result) : null;
    const normalTableData = isSuccess ? processNormalData(res.result) : [];

    // 更新图表数据：保留之前的关闭状态饼图数据
    setNormalChartData((prev: any) => ({
      ...(normalChartData || {}),
      closeStatusPieData: prev?.closeStatusPieData || [],
    }));

    // 更新表格数据
    setNormalTableData(normalTableData);

    // 成功时刷新图表，失败时显示错误提示
    isSuccess ? setChartKey(prev => prev + 1) : message.error(res?.errMsg || '获取普通统计数据失败');

    // 失败时清空图表数据
    !isSuccess && setNormalChartData((prev: any) => ({
      ...prev,
      pieData: [],
      barData: {},
    }));
  };

  /**
   * 处理关闭状态统计数据响应
   * @param res 接口响应对象
   */
  const handleIfCloseResponse = (res: any) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 成功时：将关闭状态数据转换为饼图所需格式
    const closeStatusPieData = isSuccess
      ? (res.result || []).map((item: any) => ({
          value: item.sumNum || 0,
          name: item.if_close === '关闭' ? '关闭' : item.if_close === '未关闭' ? '未关闭' : item.if_close || '未知',
        }))
      : [];

    // 更新图表数据中的关闭状态饼图数据
    setNormalChartData((prev: any) => ({
      ...prev,
      closeStatusPieData,
    }));

    // 成功时刷新图表，失败时显示错误提示
    isSuccess ? setChartKey(prev => prev + 1) : message.error(res?.errMsg || '获取关闭状态统计数据失败');
  };

  /**
   * 处理分公司统计数据响应
   * @param res 接口响应对象
   */
  const handleSubProblemGradingResponse = (res: any) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 成功时：生成分公司图表数据和表格数据
    const branchTableData = isSuccess ? processBranchCompanyData(res.result) : [];
    const branchChartData = isSuccess ? generateBranchCompanyChartData(res.result) : {};

    // 更新分公司图表和表格数据
    setBranchChartData(branchChartData);
    setBranchTableData(branchTableData);

    // 成功时刷新图表，失败时显示错误提示并清空数据
    isSuccess
      ? setChartKey(prev => prev + 1)
      : (message.error(res?.errMsg || '获取分公司统计数据失败'), setBranchChartData({}), setBranchTableData([]));
  };

  /**
   * 获取统计数据
   * 并行请求三个接口：问题分级统计、关闭状态统计、分公司统计
   * @param customParams 自定义搜索参数，不传则使用当前搜索参数
   */
  const fetchData = async (customParams?: typeof searchParams) => {
    setLoading(true);
    const currentParams = customParams || searchParams;
    const params = buildApiParams(currentParams);

    // 并行获取三个统计数据：提高加载效率
    const [problemGradingRes, ifCloseRes, subProblemGradingRes] = await Promise.all([
      getProblemGradingStatistics(params),
      getIfCloseStatistics(params),
      getSubProblemGradingStatistics(params),
    ]);

    // 分别处理三个接口的响应数据
    handleProblemGradingResponse(problemGradingRes);
    handleIfCloseResponse(ifCloseRes);
    handleSubProblemGradingResponse(subProblemGradingRes);

    setLoading(false);
  };

  /** 组件加载时获取数据 */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 查询数据 */
  const handleSearch = () => {
    fetchData();
  };

  /** 重置搜索条件 */
  const handleReset = () => {
    const resetParams = {
      timePeriod: getDefaultTimePeriod(),
      problemSource: undefined,
      examineUnit: undefined,
    };
    setSearchParams(resetParams);
    fetchData(resetParams);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <SearchForm
          searchParams={searchParams}
          obsCodeAllData={obsCodeAllData}
          wbsOptions={wbsOptions}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </Card>

      {/* 第一个卡片：问题分级统计（普通统计） */}
      <Card
        title="问题分级统计"
        style={{ marginBottom: 16 }}
        headStyle={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        <Spin spinning={loading} tip="加载中...">
          <NormalCharts
            chartData={normalChartData}
            chartKey={chartKey}
            onChartClick={handleNormalChartClick}
          />
        </Spin>
      </Card>

      {/* 第二个卡片：分公司问题统计 */}
      <Card
        title="分公司问题统计"
        headStyle={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        <Spin spinning={loading} tip="加载中...">
          <BranchCompanyChart
            chartData={branchChartData}
            chartKey={chartKey}
            onChartClick={handleBranchChartClick}
          />
        </Spin>
      </Card>

      {/* 表格弹窗 */}
      <Modal
        title="问题统计详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: 'calc(100vh - 55px)', padding: '24px', overflow: 'auto' }}
        destroyOnClose
      >
        <Table
          columns={modalType === 'branch' ? getBranchCompanyColumns(branchTableData) : columns}
          dataSource={modalType === 'branch' ? branchTableData : normalTableData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowClassName={(record: any) => {
            // 根据弹窗类型判断合计行：分公司统计看 branchCompany，普通统计看 problemType
            const isTotalRow = modalType === 'branch'
              ? record.branchCompany === '合计'
              : record.problemType === '合计';
            return isTotalRow ? 'statistics-total-row' : '';
          }}
        />
      </Modal>
    </div>
  );
};

export default connect()(ProblemGradingStatistics);
