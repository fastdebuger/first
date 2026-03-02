import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Button, Modal, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ReactECharts from 'echarts-for-react';
import { downloadChart } from '../problemStatisticsUtils';
import SearchForm from './SearchForm';
import { useInitData, useFetchData } from './hooks';
import { getChartOption } from './chartConfig';
import { SearchParams, ChartData } from './types';
import { getDefaultSearchParams, isBranchStatistics } from './problemLevelStatisticsUtils';
import { DEFAULT_CHART_DATA } from './constants';

/**
 * 获取表格列定义 - 分公司统计模式
 * @returns 表格列配置数组
 */
const getBranchColumns = () => [
  { title: '分公司', dataIndex: 'branchCompany', key: 'branchCompany', width: 150 },
  { title: '轻微问题', dataIndex: 'minor', key: 'minor', width: 100, align: 'right' as const },
  { title: '一般问题', dataIndex: 'general', key: 'general', width: 100, align: 'right' as const },
  { title: '较大问题', dataIndex: 'major', key: 'major', width: 100, align: 'right' as const },
  { title: '严重问题', dataIndex: 'serious', key: 'serious', width: 100, align: 'right' as const },
];

/**
 * 获取表格列定义 - 默认模式
 * @returns 表格列配置数组
 */
const getDefaultColumns = () => [
  { title: '问题级别', dataIndex: 'level', key: 'level', width: 100 },
  { title: '质量问题', dataIndex: 'quality', key: 'quality', width: 100, align: 'right' as const },
  { title: 'HSE问题', dataIndex: 'hse', key: 'hse', width: 100, align: 'right' as const },
];

/**
 * 获取表格列定义
 * @param queryParams 查询参数
 * @returns 表格列配置数组
 */
const getColumns = (queryParams: SearchParams) => {
  const branchStatistics = isBranchStatistics(queryParams);
  return branchStatistics ? getBranchColumns() : getDefaultColumns();
};

/**
 * 生成表格合计行 - 默认模式
 * @param pageData 当前页数据
 * @param queryParams 查询参数
 * @returns 合计行JSX或null
 */
const generateTableSummary = (pageData: readonly any[], queryParams: SearchParams): React.ReactNode => {
  const branchStatistics = isBranchStatistics(queryParams);
  const isBranchMode = Boolean(branchStatistics);

  // 分公司模式直接返回null，不显示合计行（合计行已在数据中）
  const shouldShowSummary = !isBranchMode;

  return shouldShowSummary ? (() => {
    // 默认模式：按问题级别分布，计算合计并显示合计行
    const totalQuality = pageData.reduce((sum, record) => sum + (record.quality || 0), 0);
    const totalHse = pageData.reduce((sum, record) => sum + (record.hse || 0), 0);

    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
          <Table.Summary.Cell index={0} align="center">
            <strong>合计</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">
            <strong>{totalQuality}</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="right">
            <strong>{totalHse}</strong>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  })() : null;
};

/**
 * 问题分级统计组件
 * 统计问题按级别（轻微、一般、较大、严重）的分布情况
 * 支持按问题类型（质量/HSE）和分公司进行统计
 */
const ProblemLevelStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<SearchParams>(getDefaultSearchParams());

  // 图表相关状态
  const [chartData, setChartData] = useState<ChartData>(DEFAULT_CHART_DATA);
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<any>(null);

  // 表格相关状态
  const [tableData, setTableData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 保存上一次查询的参数，用于确定图表显示模式
  const [lastQueryParams, setLastQueryParams] = useState<SearchParams | null>(null);

  // 标记是否已经自动设置过分公司和项目部
  const autoSetBranchCompRef = useRef(false); // 标记是否已经自动设置过分公司
  const autoSetProjectRef = useRef(false); // 标记是否已经自动设置过项目部

  // 初始化数据（问题来源、检查单位、分公司等下拉选项）
  const {
    obsCodeAllData,
    wbsOptions,
    branchCompOptions,
    projectWbsOptions,
  } = useInitData(dispatch, searchParams.branchCompCode);

  // 数据获取hooks
  const { loading, fetchData } = useFetchData(
    searchParams,
    setChartData,
    setTableData,
    setLastQueryParams
  );

  /**
   * 自动设置分公司（当选项只有一个时）
   * @param singleOption 唯一的选项
   */
  const autoSetBranchComp = (singleOption: { value: string; label: string }) => {
    // 如果已经有值且不是这个唯一选项，则不自动赋值（可能是用户手动选择的）
    if (searchParams.branchCompCode && searchParams.branchCompCode !== singleOption.value) {
      return;
    }
    // 如果还没有值，则自动赋值
    if (!searchParams.branchCompCode) {
      autoSetBranchCompRef.current = true;
      const newParams = {
        ...searchParams,
        branchCompCode: singleOption.value,
        selectWbsCode: undefined, // 清空项目部，因为分公司变了
      };
      setSearchParams(newParams);
      // 自动赋值后触发查询
      setTimeout(() => {
        fetchData(newParams);
      }, 100);
    }
  };

  /**
   * 自动设置项目部（当选项只有一个时）
   * @param singleOption 唯一的选项
   */
  const autoSetProject = (singleOption: { value: string; label: string }) => {
    // 如果已经有值且不是这个唯一选项，则不自动赋值（可能是用户手动选择的）
    if (searchParams.selectWbsCode && searchParams.selectWbsCode !== singleOption.value) {
      return;
    }
    // 如果还没有值，则自动赋值
    if (!searchParams.selectWbsCode) {
      autoSetProjectRef.current = true;
      const newParams = {
        ...searchParams,
        selectWbsCode: singleOption.value,
      };
      setSearchParams(newParams);
      // 自动赋值后触发查询
      setTimeout(() => {
        fetchData(newParams);
      }, 100);
    }
  };

  // 当分公司选项只有一个时，自动赋值并禁用
  useEffect(() => {
    // 检查选项是否存在
    const hasOptions = branchCompOptions && branchCompOptions.length > 0;
    // 检查选项是否只有一个
    const hasSingleOption = hasOptions && branchCompOptions.length === 1;
    // 检查是否已经自动设置过
    const notAutoSetYet = !autoSetBranchCompRef.current;

    // 如果选项只有一个且未设置过，则自动设置
    if (hasSingleOption && notAutoSetYet) {
      autoSetBranchComp(branchCompOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchCompOptions]);

  // 当分公司变化时，重置项目部的自动设置标记
  useEffect(() => {
    // 当分公司变化时，重置项目部的自动设置标记，以便新的分公司下的项目部可以自动设置
    autoSetProjectRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.branchCompCode]);

  // 当项目部选项只有一个时，自动赋值并禁用
  useEffect(() => {
    // 检查选项是否存在
    const hasOptions = projectWbsOptions && projectWbsOptions.length > 0;
    // 检查选项是否只有一个
    const hasSingleOption = hasOptions && projectWbsOptions.length === 1;
    // 检查是否已选择分公司
    const hasBranchComp = Boolean(searchParams.branchCompCode);
    // 检查是否已经自动设置过
    const notAutoSetYet = !autoSetProjectRef.current;

    // 如果选项只有一个、已选择分公司且未设置过，则自动设置
    if (hasSingleOption && hasBranchComp && notAutoSetYet) {
      autoSetProject(projectWbsOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectWbsOptions, searchParams.branchCompCode]);

  /**
   * 初始化数据获取
   */
  useEffect(() => {
    setLastQueryParams({ ...searchParams });
    fetchData();
    setChartKey(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 监听chartData变化，更新图表
   */
  useEffect(() => {
    const hasData = chartData && (
      'qualityData' in chartData ||
      'hseData' in chartData ||
      'branchNames' in chartData
    );
    hasData && setChartKey(prev => prev + 1);
  }, [chartData]);

  /**
   * 处理图表下载
   */
  const handleChartDownload = useCallback(() => {
    downloadChart(chartRef, '问题级别分布');
  }, []);

  /**
   * 处理图表点击事件
   */
  const handleChartClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  /**
   * 处理搜索参数变化
   */
  const handleSearchParamsChange = useCallback((params: SearchParams) => {
    setSearchParams(params);
  }, []);

  /**
   * 查询数据
   */
  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 重置搜索条件
   */
  const handleReset = useCallback(() => {
    // 重置自动设置标记
    autoSetBranchCompRef.current = false;
    autoSetProjectRef.current = false;
    const resetParams = getDefaultSearchParams();
    setSearchParams(resetParams);
    fetchData(resetParams);
  }, [fetchData]);

  /**
   * 获取当前查询参数（用于确定图表和表格显示模式）
   * 优先使用 searchParams，如果数据已加载则使用 lastQueryParams 来确定显示模式
   */
  const currentQueryParams = searchParams.problemType !== undefined ? searchParams : (lastQueryParams || searchParams);

  return (
    <div>
      <Card>
        <SearchForm
          searchParams={searchParams}
          obsCodeAllData={obsCodeAllData}
          wbsOptions={wbsOptions}
          branchCompOptions={branchCompOptions}
          projectWbsOptions={projectWbsOptions}
          onSearchParamsChange={handleSearchParamsChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <Card
          title="问题级别分布（柱状图）"
          size="small"
          extra={
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={handleChartDownload}
            >
              下载图表
            </Button>
          }
        >
          <Spin spinning={loading} tip="加载中...">
            <ReactECharts
              ref={chartRef}
              key={`level-bar-${chartKey}`}
              option={getChartOption(chartData, currentQueryParams)}
              style={{ height: '400px', width: '100%', cursor: 'pointer' }}
              opts={{ renderer: 'canvas' }}
              onChartReady={(chart: any) => {
                chartRef.current = chart;
              }}
              onEvents={{ click: handleChartClick }}
            />
          </Spin>
        </Card>
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
          columns={getColumns(currentQueryParams)}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          summary={(pageData) => generateTableSummary(pageData, currentQueryParams)}
        />
      </Modal>
    </div>
  );
};

export default connect()(ProblemLevelStatistics);
