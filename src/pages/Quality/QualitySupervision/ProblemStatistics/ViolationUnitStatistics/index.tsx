import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Button, Space, DatePicker, Select, Row, Col, Modal, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { WBS_CODE } from '@/common/const';
import { ErrorCode } from '@/common/const';
import { downloadChart, getDefaultTimePeriod, buildTimeParams } from '../problemStatisticsUtils';
import { getQualitySafetyInspectionObsNameStatistics } from '@/services/safetyGreen/inspect/problemStatistics';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 违章单位数据统计
 * 统计各违章单位（安装分公司/承包商）的质量类和HSE类问题分布情况
 */
const ViolationUnitStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>({
    unitNames: [],
    qualityData: [],
    hseData: [],
    detailData: [],
  });
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [violationUnitOptions, setViolationUnitOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [obsCodeAllData, setObsCodeAllData] = useState<ObsCodeItem[]>([]);
  const [wbsOptions, setWbsOptions] = useState<Array<{ value: string; label: string }>>([]);

  const [searchParams, setSearchParams] = useState<{
    timePeriod: [moment.Moment, moment.Moment] | undefined;
    violationUnit: string | undefined;
    problemSource: string | undefined;
    examineUnit: string | undefined;
  }>({
    timePeriod: getDefaultTimePeriod(),
    violationUnit: undefined,
    problemSource: undefined,
    examineUnit: undefined,
  });

  /** 初始化下拉选项数据 */
  useEffect(() => {
    // console.log('dispatch :>> ', dispatch);
    if (dispatch) {
      dispatch({
        type: 'problemStatistics/getQualitySafetyInspectionObsName',
        payload: {
          sort: 'obs_name',
        },
        callback: (res: any) => {
          // console.log('res :>> ', res);
          if (res && res.errCode === ErrorCode.ErrOk && res.rows) {
            setViolationUnitOptions(
              res.rows.filter(i => i.obs_code).map((item: any) => ({
                value: item.obs_code,
                label: item.obs_name,
              }))
            );
          }
        },
      });

      // 获取obs数据（问题来源数据）
      dispatch({
        type: 'user/getObsCode',
        payload: {
          sort: 'obs_code',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
          ])
        },
        callback: (res: any) => {
          if (res && res.rows) {
            setObsCodeAllData(res.rows.map((item: any) => ({
              wbs_code: item.wbs_code,
              obs_code: item.obs_code,
              obs_name: item.obs_name,
              prop_key: item.prop_key,
              RowNumber: item.RowNumber,
            })));
          }
        }
      });

      // 获取所有项目部数据（检查单位）
      dispatch({
        type: 'user/queryWBS',
        payload: {
          sort: 'wbs_code',
          order: 'asc',
          filter: JSON.stringify([{ Key: 'prop_key', Val: 'dep', Operator: '=' }])
        },
        callback: (res: any) => {
          if (res && res.rows) {
            setWbsOptions(
              res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
            );
          }
        }
      });
    }
  }, []);

  /** 处理图表下载 */
  const handleChartDownload = useCallback(() => {
    downloadChart(chartRef, '违章单位问题统计');
  }, []);

  /** 处理图表点击事件 */
  const handleChartClick = useCallback(() => {
    setModalVisible(true);
  }, []);

  /** 处理表格数据 */
  const processTableData = (result: any[]) => {
    if (!result || !Array.isArray(result)) {
      return [];
    }

    const tableData = result.map((item: any, index: number) => ({
      id: index + 1,
      unitName: item.obs_name || '',
      qualityTotal: Number(item.quality_item_num) || 0,
      qualityManagement: Number(item.item_num0) || 0,
      qualityEntity: Number(item.item_num1) || 0,
      qualityMajor: Number(item.quality_severity_level_num) || 0,
      hseTotal: Number(item.safety_item_num) || 0,
      safetyManagement: Number(item.item_num3) || 0,
      operationBehavior: Number(item.item_num4) || 0,
      hseMajor: Number(item.safety_severity_level_num) || 0,
      total: (Number(item.quality_item_num) || 0) + (Number(item.safety_item_num) || 0),
    }));

    return tableData;
  };

  /** 表格列定义 */
  const columns: any[] = [
    { title: '违章单位', dataIndex: 'unitName', key: 'unitName', width: 150, fixed: 'left' as const },
    {
      title: '质量类',
      children: [
        { title: '问题总数', dataIndex: 'qualityTotal', key: 'qualityTotal', width: 100, align: 'right' as const },
        { title: '质量管理类', dataIndex: 'qualityManagement', key: 'qualityManagement', width: 120, align: 'right' as const },
        { title: '质量实体类', dataIndex: 'qualityEntity', key: 'qualityEntity', width: 120, align: 'right' as const },
        { title: '较大以上', dataIndex: 'qualityMajor', key: 'qualityMajor', width: 100, align: 'right' as const },
      ],
    },
  ];

  /** 构建接口参数 */
  const buildApiParams = (currentParams: typeof searchParams) => {
    const params: any = {};
    if (currentParams.violationUnit) params.violation_unit = currentParams.violationUnit;
    if (currentParams.problemSource) params.problemObsCode = currentParams.problemSource;
    if (currentParams.examineUnit) params.examineWbsCode = currentParams.examineUnit;
    Object.assign(params, buildTimeParams(currentParams.timePeriod));
    return params;
  };

  /** 处理接口返回的数据，转换为图表所需格式 */
  const processChartData = (result: any[]) => {
    if (!result || !Array.isArray(result)) {
      return {
        unitNames: [],
        qualityData: [],
        hseData: [],
        detailData: [],
      };
    }

    const unitNames: string[] = [];
    const qualityData: number[] = [];
    const hseData: number[] = [];
    const detailData: any[] = [];

    result.forEach((item: any) => {
      const unitName = item.obs_name || '';
      const qualityItemNum = Number(item.quality_item_num) || 0;
      const safetyItemNum = Number(item.safety_item_num) || 0;

      unitNames.push(unitName);
      qualityData.push(qualityItemNum);
      hseData.push(safetyItemNum);
      detailData.push({
        obs_name: unitName,
        quality_item_num: qualityItemNum,
        item_num0: Number(item.item_num0) || 0, // 质量管理类
        item_num1: Number(item.item_num1) || 0, // 质量实体类
        quality_severity_level_num: Number(item.quality_severity_level_num) || 0, // 质量较大以上问题数量
        // safety_item_num: safetyItemNum,
        // item_num3: Number(item.item_num3) || 0, // 安全管理类
        // item_num4: Number(item.item_num4) || 0, // 作业行为类
        // safety_severity_level_num: Number(item.safety_severity_level_num) || 0, // 安全较大以上问题数量
      });
    });

    return { unitNames, qualityData, hseData, detailData };
  };


  useEffect(() => {
    fetchData();
  }, []);

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
   */
  const handleDataResponse = (res: any) => {
    // 判断响应是否成功
    const isSuccess = isResponseSuccess(res);

    // 成功时：处理图表数据和表格数据
    const processedChartData = isSuccess ? processChartData(res.rows) : { unitNames: [], qualityData: [], hseData: [], detailData: [] };
    const processedTableData = isSuccess ? processTableData(res.rows) : [];

    // 更新图表和表格数据
    setChartData(processedChartData);
    setTableData(processedTableData);

    // 成功时刷新图表
    isSuccess && setChartKey(prev => prev + 1);
  };

  /**
   * 获取统计数据
   * @param customParams 自定义搜索参数，不传则使用当前搜索参数
   */
  const fetchData = async (customParams?: typeof searchParams) => {
    setLoading(true);
    const currentParams = customParams || searchParams;
    const params = buildApiParams(currentParams);

    // 使用 async/await 方式调用接口
    const res = await getQualitySafetyInspectionObsNameStatistics({
      ...params,
      sort: 'obs_name',
    });
    handleDataResponse(res);
    setLoading(false);
  };

  const handleSearch = () => {
    fetchData();
  };

  /** 重置搜索条件 */
  const handleReset = () => {
    const resetParams = {
      timePeriod: getDefaultTimePeriod(),
      violationUnit: undefined,
      problemSource: undefined,
      examineUnit: undefined,
    };
    setSearchParams(resetParams);
    fetchData(resetParams);
  };

  /** 生成柱状图配置 */
  const getChartOption = () => {
    const unitNames = chartData.unitNames || [];
    const qualityData = chartData.qualityData || [];
    const hseData = chartData.hseData || [];
    const detailData = chartData.detailData || [];

    return {
      title: {
        text: '违章单位问题统计',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          // 判断参数是否有效
          const isValidParams = params && Array.isArray(params) && params.length > 0;
          if (!isValidParams) {
            return '';
          }

          const index = params[0].dataIndex;
          const detail = detailData[index];

          // 判断是否有详情数据：没有详情则只显示基础信息
          const hasDetail = Boolean(detail);
          if (!hasDetail) {
            let result = `${params[0].name}<br/>`;
            params.forEach((item: any) => {
              result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
            });
            return result;
          }

          let result = `${params[0].name}<br/>`;
          params.forEach((item: any) => {
            result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
          });

          result += `<div style="margin-top: 5px; border-top: 1px solid #eee; padding-top: 5px;">`;

          // 显示质量类详情
          result += `
            <div style="font-weight: bold; margin-bottom: 3px;">质量类详情:</div>
            <div style="padding-left: 10px;">
              <div>质量管理类: ${detail.item_num0}</div>
              <div>质量实体类: ${detail.item_num1}</div>
              <div>较大以上问题数量: ${detail.quality_severity_level_num}</div>
            </div>
          `;

          // // 显示HSE类详情
          // result += `
          //   <div style="font-weight: bold; margin-bottom: 3px; margin-top: 8px;">HSE类详情:</div>
          //   <div style="padding-left: 10px;">
          //     <div>安全管理类: ${detail.item_num3}</div>
          //     <div>作业行为类: ${detail.item_num4}</div>
          //     <div>较大以上问题数量: ${detail.safety_severity_level_num}</div>
          //   </div>
          // `;

          result += `</div>`;
          return result;
        },
      },
      legend: {
        data: ['质量类'],
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
        data: unitNames,
        name: '违章单位',
        axisLabel: {
          rotate: unitNames.length > 5 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: '问题数量',
      },
      series: [
        {
          name: '质量类',
          type: 'bar',
          data: qualityData,
          barMaxWidth: 50,
          barCategoryGap: '50%',
          itemStyle: {
            color: '#5470c6',
          },
        },
      ],
    };
  };

  return (
    <div>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <RangePicker
              value={searchParams.timePeriod}
              onChange={(dates) => setSearchParams({ ...searchParams, timePeriod: dates as any })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="违章单位"
              allowClear
              showSearch
              value={searchParams.violationUnit}
              onChange={(value) => setSearchParams({ ...searchParams, violationUnit: value })}
              style={{ width: '100%' }}
              filterOption={(input, option) => {
                const label = option?.label || option?.children;
                return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {violationUnitOptions.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <ObsCodeTreeSelect
              placeholder="请选择问题来源"
              value={searchParams.problemSource}
              onChange={(val) => {
                const value = Array.isArray(val) ? val[0] : val;
                setSearchParams({ ...searchParams, problemSource: value });
              }}
              data={obsCodeAllData}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="检查单位"
              allowClear
              showSearch
              value={searchParams.examineUnit}
              onChange={(value) => setSearchParams({ ...searchParams, examineUnit: value })}
              style={{ width: '100%' }}
              filterOption={(input, option) => {
                const label = option?.label || option?.children;
                return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {wbsOptions.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card
              title="违章单位问题统计（柱状图）"
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
                  key={`violation-unit-chart-${chartKey}`}
                  option={getChartOption()}
                  style={{ height: '400px', cursor: 'pointer' }}
                  opts={{ renderer: 'canvas' }}
                  onChartReady={(chart: any) => {
                    chartRef.current = chart;
                  }}
                  onEvents={{ click: handleChartClick }}
                />
              </Spin>
            </Card>
          </Col>
        </Row>

      </Card>

      {/* 表格弹窗 */}
      <Modal
        title="违章单位数据统计"
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

export default connect()(ViolationUnitStatistics);
