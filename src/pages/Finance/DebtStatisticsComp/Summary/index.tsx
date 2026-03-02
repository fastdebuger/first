import React from 'react';
import { Table } from 'antd';

/**
 * 结算状态配置
 */
export const SETTLEMENT_STATUS_CONFIG = [
  { label: '与业主、分包全部结算完', value: '1' },
  { label: '与业主、分包全部未结算完', value: '2' },
  { label: '与业主结算完，分包未结算完', value: '3' },
  { label: '与业主未结算完，分包结算完', value: '4' },
  { label: '在建工程未结算', value: '5' },
  { label: '其他', value: '6' },
];

/**
 * 需要合计的数值字段
 */
const NUMERIC_FIELDS = [
  'contract_say_price',
  'expected_settlement_amount',
  'progress_settlement_current_year',
  'progress_settlement_total',
  'received_cash',
  'received_bill',
  'received_material',
  'received_other',
  'received_subtotal',
  'book_receivable_balance',
  'advance_receipt_balance',
  'net_receivable_amount',
  'net_receivable_recover_in_year',
  'net_receivable_recover_after_year',
  'net_receivable_bad_debt',
  'expected_receivable_amount',
  'total_invoice_count',
];

/**
 * 表格列的顺序（用于对齐合计行）
 */
const COLUMN_ORDER = [
  'wbs_code',
  'contract_name',
  'contract_no',
  'relative_person_code',
  'owner_unit_name',
  'settlement_status_str',
  'contract_say_price',
  'expected_settlement_amount',
  'progress_settlement_current_year',
  'progress_settlement_total',
  'received_cash',
  'received_bill',
  'received_material',
  'received_other',
  'received_subtotal',
  'book_receivable_balance',
  'advance_receipt_balance',
  'net_receivable_amount',
  'net_receivable_recover_in_year',
  'net_receivable_recover_after_year',
  'net_receivable_bad_debt',
  'expected_receivable_amount',
  'total_invoice_count',
  'collection_plan_reason',
  'responsible_person',
  'account_name',
  'profit_center_code',
  'counterparty_risk',
  'create_ts_str',
  'create_user_name',
  'modify_ts_str',
  'modify_user_name',
];

interface DebtStatisticsSummaryProps {
  dataSource: any[];
  columns: any[];
}

/**
 * 债权填报表合计组件
 * @param props
 * @returns
 */
const DebtStatisticsSummary: React.FC<DebtStatisticsSummaryProps> = (props) => {
  const { dataSource = [] } = props;

  /**
   * 精确累加数值，避免浮点数精度问题
   * @param numbers 数值数组
   * @returns 累加结果
   */
  const preciseSum = (numbers: number[]): number => {
    // 将所有数值转换为整数（乘以100）进行累加，避免浮点数精度问题
    const sum = numbers.reduce((acc, num) => {
      const intValue = Math.round((num || 0) * 100);
      return acc + intValue;
    }, 0);
    // 除以100并四舍五入，如果原始数据都是整数，结果也应该是整数
    return Math.round(sum) / 100;
  };

  /**
   * 计算指定数据的合计值
   * @param data 数据数组
   * @returns 合计对象
   */
  const calculateTotals = (data: any[]) => {
    const totals: any = {};
    NUMERIC_FIELDS.forEach((field) => {
      const values = data.map((record) => Number(record[field]) || 0);
      totals[field] = preciseSum(values);
    });
    return totals;
  };

  /**
   * 根据结算状态分组数据
   * @param data 数据数组
   * @param status 结算状态值
   * @returns 过滤后的数据
   */
  const getDataByStatus = (data: any[], status: string) => {
    return data.filter((record) => String(record.settlement_status) === status);
  };

  // 计算总合计
  const totalSummary = calculateTotals(dataSource);

  // 计算各状态分组合计
  const statusSummaries = SETTLEMENT_STATUS_CONFIG.map((config) => {
    const statusData = getDataByStatus(dataSource, config.value);
    return {
      ...config,
      data: statusData,
      totals: calculateTotals(statusData),
    };
  });

  /**
   * 格式化数值显示：千分位，保留两位小数
   * @param value 数值
   * @returns 格式化后的字符串
   */
  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }
    return value.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // 如果没有数据，返回空
  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  // 按分公司分组数据（使用 up_wbs_code 作为分组键）
  const groupByBranch = (data: any[]) => {
    const groups: Record<string, any[]> = {};
    data.forEach((record) => {
      const branchKey = record.up_wbs_code || 'default';
      if (!groups[branchKey]) {
        groups[branchKey] = [];
      }
      groups[branchKey].push(record);
    });
    return groups;
  };

  // 从数据源中按顺序提取分公司，保持它们在数据中出现的顺序
  const getBranchKeysInOrder = (data: any[]) => {
    const seen = new Set<string>();
    const orderedKeys: string[] = [];
    data.forEach((record) => {
      const branchKey = record.up_wbs_code || 'default';
      if (!seen.has(branchKey)) {
        seen.add(branchKey);
        orderedKeys.push(branchKey);
      }
    });
    return orderedKeys;
  };

  const branchGroups = groupByBranch(dataSource);
  // 使用数据中的顺序，而不是 Object.keys 的顺序
  const branchKeys = getBranchKeysInOrder(dataSource);

  // 如果只有一个分公司，使用原来的逻辑（保持向后兼容）
  if (branchKeys.length === 1) {
    const firstRecordUpWbsName = dataSource[0]?.up_wbs_name || '';
    const totalLabel = firstRecordUpWbsName ? `${firstRecordUpWbsName}合计` : '合计';

    return (
      <Table.Summary fixed>
        {/* 总合计行（绿色） */}
        <Table.Summary.Row style={{ backgroundColor: '#d4edda' }}>
          {/* 跳过第一列（复选框/编号列） */}
          <Table.Summary.Cell index={0} align="center" />
          {COLUMN_ORDER.map((dataIndex, index) => {
            const cellIndex = index + 1; // 从第二列开始
            if (dataIndex === 'settlement_status_str') {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                  <strong style={{ display: 'block', textAlign: 'center' }}>{totalLabel}</strong>
                </Table.Summary.Cell>
              );
            } else if (NUMERIC_FIELDS.includes(dataIndex)) {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                  <strong style={{ display: 'block', textAlign: 'center' }}>{formatNumber(totalSummary[dataIndex])}</strong>
                </Table.Summary.Cell>
              );
            } else {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center" />
              );
            }
          })}
        </Table.Summary.Row>

        {/* 各状态分组合计行（黄色） */}
        {statusSummaries.map((statusSummary) => (
          <Table.Summary.Row key={statusSummary.value} style={{ backgroundColor: '#fff3cd' }}>
          {/* 跳过第一列（复选框/编号列） */}
          <Table.Summary.Cell index={0} align="center" />
          {COLUMN_ORDER.map((dataIndex, index) => {
            const cellIndex = index + 1; // 从第二列开始
            if (dataIndex === 'settlement_status_str') {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                  <span style={{ display: 'block', textAlign: 'center' }}>{statusSummary.label}</span>
                </Table.Summary.Cell>
              );
            } else if (NUMERIC_FIELDS.includes(dataIndex)) {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                  <span style={{ display: 'block', textAlign: 'center' }}>{formatNumber(statusSummary.totals[dataIndex])}</span>
                </Table.Summary.Cell>
              );
            } else {
              return (
                <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center" />
              );
            }
          })}
        </Table.Summary.Row>
        ))}
      </Table.Summary>
    );
  }

  // 多个分公司的情况：为每个分公司生成合计行和状态分组行
  return (
    <Table.Summary fixed>
      {branchKeys.map((branchKey) => {
        const branchData = branchGroups[branchKey];
        const branchName = branchData[0]?.up_wbs_name || '未知分公司';
        const branchTotalSummary = calculateTotals(branchData);

        // 计算该分公司各状态分组合计
        const branchStatusSummaries = SETTLEMENT_STATUS_CONFIG.map((config) => {
          const statusData = getDataByStatus(branchData, config.value);
          return {
            ...config,
            data: statusData,
            totals: calculateTotals(statusData),
          };
        });

        return (
          <React.Fragment key={branchKey}>
            {/* 分公司合计行（绿色） */}
            <Table.Summary.Row style={{ backgroundColor: '#d4edda' }}>
              {/* 跳过第一列（复选框/编号列） */}
              <Table.Summary.Cell index={0} align="center" />
              {COLUMN_ORDER.map((dataIndex, index) => {
                const cellIndex = index + 1; // 从第二列开始
                if (dataIndex === 'settlement_status_str') {
                  return (
                    <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                      <strong style={{ display: 'block', textAlign: 'center' }}>{`${branchName}合计`}</strong>
                    </Table.Summary.Cell>
                  );
                } else if (NUMERIC_FIELDS.includes(dataIndex)) {
                  return (
                    <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                      <strong style={{ display: 'block', textAlign: 'center' }}>{formatNumber(branchTotalSummary[dataIndex])}</strong>
                    </Table.Summary.Cell>
                  );
                } else {
                  return (
                    <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center" />
                  );
                }
              })}
            </Table.Summary.Row>

            {/* 该分公司各状态分组合计行（黄色） */}
            {branchStatusSummaries.map((statusSummary) => (
              <Table.Summary.Row key={`${branchKey}-${statusSummary.value}`} style={{ backgroundColor: '#fff3cd' }}>
                {/* 跳过第一列（复选框/编号列） */}
                <Table.Summary.Cell index={0} align="center" />
                {COLUMN_ORDER.map((dataIndex, index) => {
                  const cellIndex = index + 1; // 从第二列开始
                  if (dataIndex === 'settlement_status_str') {
                    return (
                      <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                        <span style={{ display: 'block', textAlign: 'center' }}>{statusSummary.label}</span>
                      </Table.Summary.Cell>
                    );
                  } else if (NUMERIC_FIELDS.includes(dataIndex)) {
                    return (
                      <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center">
                        <span style={{ display: 'block', textAlign: 'center' }}>{formatNumber(statusSummary.totals[dataIndex])}</span>
                      </Table.Summary.Cell>
                    );
                  } else {
                    return (
                      <Table.Summary.Cell key={dataIndex} index={cellIndex} align="center" />
                    );
                  }
                })}
              </Table.Summary.Row>
            ))}
          </React.Fragment>
        );
      })}
    </Table.Summary>
  );
};

export default DebtStatisticsSummary;

