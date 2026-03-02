import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Button, Modal, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { ErrorCode } from '@/common/const';
import SearchForm from './SearchForm';
import { getBarOption } from './chartOptions';
import { buildApiParams, generateChartData } from './branchProjectStatisticsUtils';
import { useInitData, useProjectWbsOptions } from './hooks';
import { downloadChart, getDefaultTimePeriod } from '../problemStatisticsUtils';
import { getBranchAndProjectStatistics } from '@/services/safetyGreen/inspect/problemStatistics';

/**
 * 搜索参数类型定义
 */
interface SearchParams {
  timePeriod: [moment.Moment, moment.Moment] | undefined;
  problemSource: string | undefined;
  examineUnit: string | undefined;
  problemType: string | undefined;
  problemCategory: string | undefined;
  branchCompCode: string | undefined;
  selectDepCode: string | undefined;
}

/**
 * 表格数据项类型定义
 */
interface TableDataItem {
  id: number;
  name: string;
  qualityTotal: number;
  qualityManagement: number;
  qualityEntity: number;
  hseTotal: number;
  safetyManagement: number;
  operationBehavior: number;
}

/**
 * 分公司、项目部问题统计
 * 统计各分公司和项目部的质量类和HSE类问题分布情况
 */
const BranchProjectStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>({});
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<any>(null);
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProjectData, setIsProjectData] = useState(false); // 标记是否为项目部数据
  const autoSetBranchCompRef = useRef(false); // 标记是否已经自动设置过分公司
  const autoSetProjectRef = useRef(false); // 标记是否已经自动设置过项目部
  const [searchParams, setSearchParams] = useState<SearchParams>({
    timePeriod: getDefaultTimePeriod(),
    problemSource: undefined,
    examineUnit: undefined,
    problemType: undefined,
    problemCategory: undefined,
    branchCompCode: undefined,
    selectDepCode: undefined,
  });

  /** 初始化数据 */
  const { obsCodeAllData, wbsOptions, branchCompOptions } = useInitData(dispatch);
  const projectWbsOptions = useProjectWbsOptions(searchParams.branchCompCode, dispatch);

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
        selectDepCode: undefined, // 清空项目部，因为分公司变了
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
    if (searchParams.selectDepCode && searchParams.selectDepCode !== singleOption.value) {
      return;
    }
    // 如果还没有值，则自动赋值
    if (!searchParams.selectDepCode) {
      autoSetProjectRef.current = true;
      const newParams = {
        ...searchParams,
        selectDepCode: singleOption.value,
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

  /** 处理图表下载 */
  const handleChartDownload = useCallback(() => {
    downloadChart(chartRef, '各分公司、项目部问题统计');
  }, []);

  /** 处理图表点击事件 */
  const handleChartClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  /**
   * 判断数据中是否有 wbs_name（项目部数据）
   * @param result 数据数组
   * @returns 是否有 wbs_name
   */
  const checkHasWbsName = (result: any[]): boolean => {
    return result.some((item: any) => item?.wbs_name);
  };

  /**
   * 获取数据项的名称（优先使用wbs_name，否则使用up_wbs_name）
   * @param item 数据项
   * @param hasWbsName 是否有 wbs_name
   * @returns 名称
   */
  const getItemName = (item: any, hasWbsName: boolean): string => {
    return hasWbsName ? (item?.wbs_name || '') : (item?.up_wbs_name || '');
  };

  /**
   * 初始化表格数据项
   * @returns 初始化的数据项
   */
  const createInitialTableItem = () => {
    return {
      qualityTotal: 0,
      qualityManagement: 0,
      qualityEntity: 0,
      hseTotal: 0,
      safetyManagement: 0,
      operationBehavior: 0,
    };
  };

  /**
   * 累加数据项到表格数据
   * @param nameData 表格数据项
   * @param item 原始数据项
   */
  const accumulateTableData = (nameData: ReturnType<typeof createInitialTableItem>, item: any) => {
    // 直接累加所有数值字段，不依赖problem_type判断
    nameData.qualityTotal += Number(item?.quality_all_num) || 0;
    nameData.qualityManagement += Number(item?.quality_factor_num) || 0;
    nameData.qualityEntity += Number(item?.entity_item_num) || 0;
    nameData.hseTotal += Number(item?.safety_all_num) || 0;
    nameData.safetyManagement += Number(item?.safety_factor_num) || 0;
    nameData.operationBehavior += Number(item?.operation_item_num) || 0;
  };

  /** 处理表格数据 */
  const processTableData = (result: any[]): TableDataItem[] => {
    // 数据为空时返回空数组
    if (!result || !Array.isArray(result)) {
      return [];
    }

    // 判断数据中是否有 wbs_name（项目部数据）
    const hasWbsName = checkHasWbsName(result);
    setIsProjectData(hasWbsName);

    // 按名称分组，合并质量问题和HSE问题数据
    const nameMap = new Map<string, ReturnType<typeof createInitialTableItem>>();

    result.forEach((item: any) => {
      // 获取数据项的名称
      const name = getItemName(item, hasWbsName);
      // 跳过没有名称的数据
      if (!name) {
        return;
      }

      // 如果该名称不存在，初始化数据项
      if (!nameMap.has(name)) {
        nameMap.set(name, createInitialTableItem());
      }

      // 累加数据
      const nameData = nameMap.get(name)!;
      accumulateTableData(nameData, item);
    });

    // 转换为数组，按名称排序
    const sortedNames = Array.from(nameMap.keys()).sort();
    return sortedNames.map((name, index) => {
      const nameData = nameMap.get(name)!;
      return {
        id: index + 1,
        name: name,
        qualityTotal: nameData.qualityTotal,
        qualityManagement: nameData.qualityManagement,
        qualityEntity: nameData.qualityEntity,
        hseTotal: nameData.hseTotal,
        safetyManagement: nameData.safetyManagement,
        operationBehavior: nameData.operationBehavior,
      };
    });
  };

  /**
   * 获取表格列定义
   * @returns 表格列配置数组
   */
  const getColumns = (): any[] => {
    const nameColumnTitle = isProjectData ? '项目部' : '分公司';
    return [
      { title: nameColumnTitle, dataIndex: 'name', key: 'name', width: 150, fixed: 'left' as const },
      {
        title: '质量类',
        children: [
          { title: '问题总数', dataIndex: 'qualityTotal', key: 'qualityTotal', width: 120, align: 'right' as const },
          { title: '质量管理类', dataIndex: 'qualityManagement', key: 'qualityManagement', width: 120, align: 'right' as const },
          { title: '质量实体类', dataIndex: 'qualityEntity', key: 'qualityEntity', width: 120, align: 'right' as const },
        ],
      },
      {
        title: 'HSE类',
        children: [
          { title: '问题总数', dataIndex: 'hseTotal', key: 'hseTotal', width: 120, align: 'right' as const },
          { title: '安全管理类', dataIndex: 'safetyManagement', key: 'safetyManagement', width: 120, align: 'right' as const },
          { title: '作业行为类', dataIndex: 'operationBehavior', key: 'operationBehavior', width: 120, align: 'right' as const },
        ],
      },
    ];
  };

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
    setChartData(generateChartData(res.result, currentParams.problemCategory));
    const processedTableData = processTableData(res.result);
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
    const res = await getBranchAndProjectStatistics(params);
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
      problemType: undefined,
      problemCategory: undefined,
      branchCompCode: undefined,
      selectDepCode: undefined,
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
          projectWbsOptions={projectWbsOptions}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <Card
          title="各分公司、项目部问题统计（柱状图）"
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
              key={`branch-project-chart-${chartKey}`}
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
        title="各分公司、项目部问题统计详情"
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
            const totals = pageData.reduce(
              (acc, record) => ({
                qualityTotal: acc.qualityTotal + (record.qualityTotal || 0),
                qualityManagement: acc.qualityManagement + (record.qualityManagement || 0),
                qualityEntity: acc.qualityEntity + (record.qualityEntity || 0),
                hseTotal: acc.hseTotal + (record.hseTotal || 0),
                safetyManagement: acc.safetyManagement + (record.safetyManagement || 0),
                operationBehavior: acc.operationBehavior + (record.operationBehavior || 0),
              }),
              {
                qualityTotal: 0,
                qualityManagement: 0,
                qualityEntity: 0,
                hseTotal: 0,
                safetyManagement: 0,
                operationBehavior: 0,
              }
            );
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                  <Table.Summary.Cell index={0} align="center">
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong>{totals.qualityTotal}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <strong>{totals.qualityManagement}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong>{totals.qualityEntity}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    <strong>{totals.hseTotal}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <strong>{totals.safetyManagement}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} align="right">
                    <strong>{totals.operationBehavior}</strong>
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

export default connect()(BranchProjectStatistics);
