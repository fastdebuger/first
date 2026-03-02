import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Button, Modal, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { ErrorCode } from '@/common/const';
import SearchForm from './SearchForm';
import { getBarOption } from './chartOptions';
import { buildApiParams, generateChartData, processTableData, TableDataItem } from './problemCategoryStatisticsUtils';
import { useInitData } from './hooks';
import { downloadChart, getDefaultTimePeriod } from '../problemStatisticsUtils';
import { getQualitySafetyInspectionProblemCategoryStatistics } from '@/services/safetyGreen/inspect/problemStatistics';

/**
 * 搜索参数类型定义
 */
interface SearchParams {
  timePeriod: [moment.Moment, moment.Moment] | undefined;
  problemSource: string | undefined;
  examineUnit: string | undefined;
  branchCompCode: string | undefined;
}

/**
 * 问题类别统计
 * 统计问题按问题类别的分布情况，以柱状图展示
 */
const ProblemCategoryStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>({});
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<any>(null);
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    timePeriod: getDefaultTimePeriod(),
    problemSource: undefined,
    examineUnit: undefined,
    branchCompCode: undefined,
  });

  /** 初始化数据 */
  const { obsCodeAllData, wbsOptions, branchCompOptions } = useInitData(dispatch);

  /** 处理图表下载 */
  const handleChartDownload = useCallback(() => {
    downloadChart(chartRef, '问题类别统计');
  }, []);

  /** 处理图表点击事件 */
  const handleChartClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  /**
   * 获取表格列定义
   * @returns 表格列配置数组
   */
  const getColumns = (): any[] => {
    return [
      { title: '序号', dataIndex: 'serialNumber', key: 'serialNumber', width: 80, align: 'center' as const },
      { title: '时间段', dataIndex: 'timePeriod', key: 'timePeriod', width: 200 },
      { title: '问题类别', dataIndex: 'questionCategory', key: 'questionCategory', width: 200 },
      { title: '问题总数', dataIndex: 'itemNum', key: 'itemNum', width: 120, align: 'right' as const },
    ];
  };

  /**
   * 检查接口响应是否成功
   * @param res 接口响应对象
   * @returns 是否成功且有数据
   */
  const isResponseSuccess = (res: any): boolean => {
    return Boolean(res && res.errCode === ErrorCode.ErrOk && res.rows);
  };

  /**
   * 处理接口返回的数据
   * @param res 接口返回结果
   * @param currentParams 当前搜索参数
   */
  const handleDataResponse = (res: any, currentParams: SearchParams) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 失败时清空数据并返回
    if (!isSuccess) {
      setChartData({});
      setTableData([]);
      return;
    }

    // 成功时：生成图表数据和表格数据
    setChartData(generateChartData(res.rows));
    const processedTableData = processTableData(res.rows, currentParams);
    setTableData(processedTableData);
    // 更新图表key以强制重新渲染
    setChartKey(prev => prev + 1);
  };

  /**
   * 获取统计数据
   * @param customParams 自定义搜索参数，不传则使用当前搜索参数
   */
  const fetchData = async (customParams?: SearchParams) => {
    setLoading(true);
    const currentParams = customParams || searchParams;
    const params = buildApiParams(currentParams);

    // 使用 async/await 方式调用接口
    const res = await getQualitySafetyInspectionProblemCategoryStatistics({
      ...params,
      sort: 'item_num',
    });
    handleDataResponse(res, currentParams);
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

  /** 重置搜索条件 */
  const handleReset = () => {
    const resetParams: SearchParams = {
      timePeriod: getDefaultTimePeriod(),
      problemSource: undefined,
      examineUnit: undefined,
      branchCompCode: undefined,
    };
    setSearchParams(resetParams);
    fetchData(resetParams);
  };

  return (
    <div>
      <Card>
        <SearchForm
          searchParams={searchParams}
          obsCodeAllData={obsCodeAllData}
          wbsOptions={wbsOptions}
          branchCompOptions={branchCompOptions}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <Card
          title="问题类别统计（柱状图）"
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
              key={`category-chart-${chartKey}`}
              option={getBarOption(chartData)}
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
        title="问题类别统计详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: 'calc(100vh - 55px)', padding: '24px', overflow: 'auto' }}
        destroyOnClose
      >
        <Table
          columns={getColumns()}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          summary={(pageData) => {
            const totalItemNum = pageData.reduce((sum, record) => sum + (record.itemNum || 0), 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                  <Table.Summary.Cell index={0} colSpan={3} align="center">
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong>{totalItemNum}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Modal>
    </div>
  );
};

export default connect()(ProblemCategoryStatistics);

