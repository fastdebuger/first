import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Button, Modal, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { ErrorCode } from '@/common/const';
import SearchForm from './SearchForm';
import { buildApiParams, generateChartData, processTableData, TableDataItem } from './problemTrendStatisticsUtils';
import { useInitData } from './hooks';
import { downloadChart, getDefaultTimePeriod } from '../problemStatisticsUtils';
import { getQualitySafetyInspectionProblemTrend } from '@/services/safetyGreen/inspect/problemStatistics';

/**
 * 搜索参数类型定义
 */
interface SearchParams {
  timePeriod: [moment.Moment, moment.Moment] | undefined;
  problemSource: string | undefined;
  examineUnit: string | undefined;
  problemType: string | undefined;
  severityLevel: string | undefined;
  problemCategory: string | undefined;
  branchCompCode: string | undefined;
}

/**
 * 问题发展趋势统计
 * 支持年度、季度、月度统计，以折线图展示趋势
 */
const ProblemTrendStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [timeType, setTimeType] = useState<'year' | 'quarter' | 'month'>('month');
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{ timeLabels: string[]; problemCounts: number[] }>({
    timeLabels: [],
    problemCounts: [],
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    timePeriod: getDefaultTimePeriod(),
    problemSource: undefined,
    examineUnit: undefined,
    problemType: undefined,
    severityLevel: undefined,
    problemCategory: undefined,
    branchCompCode: undefined,
  });

  /** 初始化数据 */
  const { obsCodeAllData, wbsOptions, branchCompOptions } = useInitData(dispatch);

  /** 处理图表下载 */
  const handleChartDownload = useCallback(() => {
    downloadChart(chartRef, '问题发展趋势');
  }, []);

  /** 处理图表点击事件 */
  const handleChartClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  /** 表格列定义 */
  const columns = [
    { title: '序号', dataIndex: 'serialNumber', key: 'serialNumber', width: 80, align: 'center' as const },
    {
      title: '时间周期 (年度、季度、月度)',
      dataIndex: 'timePeriod',
      key: 'timePeriod',
      width: 200
    },
    {
      title: '问题总数',
      dataIndex: 'totalProblems',
      key: 'totalProblems',
      width: 120,
      align: 'right' as const
    },
  ];

  /**
   * 检查接口响应是否成功
   * @param res 接口响应对象
   * @returns 是否成功且有数据
   */
  const isResponseSuccess = (res: any): boolean => {
    return Boolean(res && res.errCode === ErrorCode.ErrOk && res.result);
  };

  /**
   * 处理接口返回的数据
   * @param res 接口返回结果
   */
  const handleDataResponse = (res: any) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 失败时直接返回，不更新数据
    if (!isSuccess) {
      return;
    }

    // 成功时：生成图表数据和表格数据
    const chartDataResult = generateChartData(res.result);
    setChartData(chartDataResult);
    const processedTableData = processTableData(res.result);
    setTableData(processedTableData);
    // 更新图表key以强制重新渲染图表
    setChartKey(prev => prev + 1);
  };

  /**
   * 获取统计数据
   * @param customParams 自定义搜索参数，不传则使用当前搜索参数
   * @param customTimeType 自定义时间类型，不传则使用当前时间类型
   */
  const fetchData = async (customParams?: SearchParams, customTimeType?: 'year' | 'quarter' | 'month') => {
    setLoading(true);
    const currentParams = customParams || searchParams;
    const currentTimeType = customTimeType || timeType;
    const params = buildApiParams(currentParams, currentTimeType);

    // 使用 async/await 方式调用接口
    const res = await getQualitySafetyInspectionProblemTrend({
      ...params,
      sort: 'check_date_str',
    });
    handleDataResponse(res);
    setLoading(false);
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 处理查询 */
  const handleSearch = () => {
    fetchData();
  };

  /**
   * 重置搜索条件
   * 将所有搜索参数重置为初始值并重新获取数据
   */
  const handleReset = () => {
    const resetParams: SearchParams = {
      timePeriod: getDefaultTimePeriod(),
      problemSource: undefined,
      examineUnit: undefined,
      problemType: undefined,
      severityLevel: undefined,
      problemCategory: undefined,
      branchCompCode: undefined,
    };
    setSearchParams(resetParams);
    // 使用重置后的参数重新获取数据
    fetchData(resetParams);
  };

  /**
   * 处理时间类型变化
   * @param type 时间类型：年度、季度或月度
   */
  const handleTimeTypeChange = (type: 'year' | 'quarter' | 'month') => {
    setTimeType(type);
    // 时间类型变化时使用新的时间类型重新获取数据
    fetchData(undefined, type);
  };

  /**
   * 生成折线图配置
   * x轴：时间周期（check_date_str）
   * y轴：问题总数（item_num）
   */
  const lineOption = {
    title: {
      text: '问题发展趋势 (折线图)',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['问题总数'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.timeLabels,
      axisLabel: {
        // 月度数据标签较多，需要旋转45度避免重叠
        rotate: timeType === 'month' ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '问题总数',
        type: 'line',
        data: chartData.problemCounts,
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  return (
    <div>
      <Card>
        <SearchForm
          searchParams={searchParams}
          timeType={timeType}
          obsCodeAllData={obsCodeAllData}
          wbsOptions={wbsOptions}
          branchCompOptions={branchCompOptions}
          onSearchParamsChange={setSearchParams}
          onTimeTypeChange={handleTimeTypeChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <Card
          title="问题发展趋势 (折线图)"
          size="small"
          style={{ marginTop: 16 }}
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
              key={`problem-trend-chart-${chartKey}`}
              option={lineOption}
              style={{ height: '400px', cursor: 'pointer' }}
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
        title="问题发展趋势详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: 'calc(100vh - 55px)', padding: '24px', overflow: 'auto' }}
        destroyOnClose
      >
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Modal>
    </div>
  );
};

export default connect()(ProblemTrendStatistics);
