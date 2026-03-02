import React, { useEffect, useState } from 'react';
import { Space, Table } from "antd";
import { connect, useIntl } from 'umi';
import DateSelfToolbar from "@/components/DateSelfToolbar";
import { StatisticalColumns } from "./columns";
import { ErrorCode, WBS_CODE, PROP_KEY } from "@/common/const";

/**
 * 监视和测量设备记录统计
 */
const MonitoringMeasuringStatistical: React.FC<any> = (props) => {
  const { dispatch } = props;
  // 当前默认筛选年份状态
  const [defaultYear, setDefaultYear] = React.useState<any>(new Date().getFullYear());
  // 当前默认筛选月份状态
  const [defaultMonth, setDefaultMonth] = React.useState<any>(new Date().getMonth() + 1);
  // 初始化分类统计数据
  const [rawData, setRawData] = useState<any>({});
  // 加载中状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 两个统计值（周检率、一次合格率）
  const [statistics, setStatistics] = useState({
    weeklyInspectionRate: 0,
    weeklyPassRate: 0
  });

  useEffect(() => {
    fetchData();
  }, [defaultYear, defaultMonth]);

  // 请求获取当前年月的统计数据
  const fetchData = () => {
    const basePayload: any = {
      sort: 'modify_ts',
      order: 'desc',
      year: defaultYear || new Date().getFullYear(),
      month: defaultMonth || new Date().getMonth() + 1,
    }
    if(PROP_KEY === 'subComp'){
      basePayload.sub_comp_code = WBS_CODE
    }
    setIsLoading(true);
    dispatch({
      type: 'workLicenseRegister/getMeasureDeviceStatistics',
      payload: basePayload,
      callback: (res: any) => {
        setIsLoading(false);
        if (res.errCode === ErrorCode.ErrOk) {
          setRawData(res.result || {});
          calculateStatistics(res.result || {});
        }
      }
    });
  };

  /**
   * 根据 后台返回数据计算小计和总计以及排列字段
   * @param data 计算 A/B/C 三级设备的汇总值，不区分等级
   */
  const calculateStatistics = (data: any) => {
    const categories = ['长度', '热工', '力学', '电磁', '化学', '其它'];
    // 全部类别+全部等级的应检总数
    let totalRequiredInspections = 0;
    // 全部类别+全部等级的实检总数
    let totalActualInspections = 0;
    // 全部类别+全部等级的合格总数
    let totalQualifiedInspections = 0;

    categories.forEach((category) => {
      const categoryData = data[category] || {
        A_设备数: 0, B_设备数: 0, C_设备数: 0,
        A_应检数: 0, B_应检数: 0, C_应检数: 0,
        A_实检数: 0, B_实检数: 0, C_实检数: 0,
        A_合格数: 0, B_合格数: 0, C_合格数: 0,
      };

      totalRequiredInspections += categoryData.A_应检数 + categoryData.B_应检数 + categoryData.C_应检数;
      totalActualInspections += categoryData.A_实检数 + categoryData.B_实检数 + categoryData.C_实检数;
      totalQualifiedInspections += categoryData.A_合格数 + categoryData.B_合格数 + categoryData.C_合格数;
    });

    // 计算周检率：实检总数/应检总数（保留一位小数）
    const weeklyInspectionRate = totalRequiredInspections === 0 ? 0 : (totalActualInspections / totalRequiredInspections) * 100;
    // 计算周检一次合格率：合格总数/实检总数（保留一位小数）
    const weeklyPassRate = totalActualInspections === 0 ? 0 : (totalQualifiedInspections / totalActualInspections) * 100;

    setStatistics({
      weeklyInspectionRate: parseFloat(weeklyInspectionRate.toFixed(1)),
      weeklyPassRate: parseFloat(weeklyPassRate.toFixed(1))
    });
  };

  const categories = ['长度', '热工', '力学', '电磁', '化学', '其它'];

  // 处理后的数据
  const rows: any[] = [];
  const totals = {
    deviceCount: 0, // 设备数
    requiredInspections: 0, // 应检数
    actualInspections: 0, // 实检数
    qualifiedInspections: 0, // 合格数
    newAdded: 0, // 新增
    scrapped: 0, // 报废
    sealed: 0, // 封存
    unsealed: 0, // 启封
    transferred: 0, // 转移
  };

  /**
   * 逐个类别生成表格行
   * 每个类别下生成 A、B、C 三级各一行
   * 每个类别后追加一行「小计」
   * 所有类别处理完后追加「合计」行
   */
  categories.forEach((category) => {
    // 如果后端没有返回该类数据，则使用全 0 默认值
    const categoryData = rawData[category] || {
      A_设备数: 0, A_应检数: 0, A_实检数: 0, A_合格数: 0, A_新增: 0, A_报废: 0, A_封存: 0, A_启封: 0, A_转移: 0,
      B_设备数: 0, B_应检数: 0, B_实检数: 0, B_合格数: 0, B_新增: 0, B_报废: 0, B_封存: 0, B_启封: 0, B_转移: 0,
      C_设备数: 0, C_应检数: 0, C_实检数: 0, C_合格数: 0, C_新增: 0, C_报废: 0, C_封存: 0, C_启封: 0, C_转移: 0,
    };

    // A, B, C 三级
    ['A', 'B', 'C'].forEach((level) => {
      const isLevelA = level === 'A';
      rows.push({
        key: `${category}-${level}`,
        category: isLevelA ? category : undefined, // 只有A行才有类别名，用于合并
        level: level,
        deviceCount: categoryData[`${level}_设备数`],
        requiredInspections: categoryData[`${level}_应检数`],
        actualInspections: categoryData[`${level}_实检数`],
        qualifiedInspections: categoryData[`${level}_合格数`],
        newAdded: categoryData[`${level}_新增`],
        scrapped: categoryData[`${level}_报废`],
        sealed: categoryData[`${level}_封存`],
        unsealed: categoryData[`${level}_启封`],
        transferred: categoryData[`${level}_转移`],
        rowType: isLevelA ? 'first' : 'data',
      });
    });

    // 台件数小计
    const subtotalDeviceCount = categoryData.A_设备数 + categoryData.B_设备数 + categoryData.C_设备数;
    // 应检数小计
    const subtotalRequiredInspections = categoryData.A_应检数 + categoryData.B_应检数 + categoryData.C_应检数;
    // 实检数小计
    const subtotalActualInspections = categoryData.A_实检数 + categoryData.B_实检数 + categoryData.C_实检数;
    // 合格数小计
    const subtotalQualifiedInspections = categoryData.A_合格数 + categoryData.B_合格数 + categoryData.C_合格数;
    // 新增小计
    const subtotalNewAdded = categoryData.A_新增 + categoryData.B_新增 + categoryData.C_新增;
    // 报废小计
    const subtotalScrapped = categoryData.A_报废 + categoryData.B_报废 + categoryData.C_报废;
    // 封存小计
    const subtotalSealed = categoryData.A_封存 + categoryData.B_封存 + categoryData.C_封存;
    // 启封小计
    const subtotalUnsealed = categoryData.A_启封 + categoryData.B_启封 + categoryData.C_启封;
    // 转移小计
    const subtotalTransferred = categoryData.A_转移 + categoryData.B_转移 + categoryData.C_转移;

    rows.push({
      key: `${category}-subtotal`,
      category: '小计',
      level: '',
      deviceCount: subtotalDeviceCount,
      requiredInspections: subtotalRequiredInspections,
      actualInspections: subtotalActualInspections,
      qualifiedInspections: subtotalQualifiedInspections,
      newAdded: subtotalNewAdded,
      scrapped: subtotalScrapped,
      sealed: subtotalSealed,
      unsealed: subtotalUnsealed,
      transferred: subtotalTransferred,
      rowType: 'subtotal',
    });

    // 累计总计
    totals.deviceCount += subtotalDeviceCount;
    totals.requiredInspections += subtotalRequiredInspections;
    totals.actualInspections += subtotalActualInspections;
    totals.qualifiedInspections += subtotalQualifiedInspections;
    totals.newAdded += subtotalNewAdded;
    totals.scrapped += subtotalScrapped;
    totals.sealed += subtotalSealed;
    totals.unsealed += subtotalUnsealed;
    totals.transferred += subtotalTransferred;
  });

  // 合计行
  rows.push({
    key: 'total',
    category: '合计',
    level: '',
    deviceCount: totals.deviceCount,
    requiredInspections: totals.requiredInspections,
    actualInspections: totals.actualInspections,
    qualifiedInspections: totals.qualifiedInspections,
    newAdded: totals.newAdded,
    scrapped: totals.scrapped,
    sealed: totals.sealed,
    unsealed: totals.unsealed,
    transferred: totals.transferred,
    rowType: 'total',
  });

  return (
    <div style={{ padding: 16, background: '#fff' }}>
      <Space style={{ marginBottom: 16 }}>
        <DateSelfToolbar
          defaultYear={defaultYear}
          defaultMonth={defaultMonth}
          setDefaultYear={setDefaultYear}
          setDefaultMonth={setDefaultMonth}
        />
      </Space>

      <Table
        scroll={{ y: 'calc(100vh - 350px)' }}
        columns={StatisticalColumns || []}
        dataSource={rows}
        pagination={false}
        bordered
        loading={isLoading}
        size="small"
      />

      <div style={{ padding: '16px 0' }}>
        <strong>周检率：</strong> {statistics.weeklyInspectionRate || 0}%
        <strong style={{ marginLeft: '16px' }}>周检一次合格率：</strong> {statistics.weeklyPassRate || 0}%
      </div>
    </div>
  );
};

export default connect()(MonitoringMeasuringStatistical);