import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Empty, message, Modal, Row, Space, Tree } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleMultiHeaderTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import moment from 'moment';
import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';

import { configColumns, formatAmount } from "./columns";
import DebtPaymentStatisticsAdd from "./Add";
import DebtPaymentStatisticsDetail from "./Detail";
import DebtPaymentStatisticsEdit from "./Edit";
import DebtPaymentStatisticsSummary from "./Summary";

/**
 * 债务填报表
 * @constructor
 */
const DebtPaymentStatisticsPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const { formatMessage } = useIntl();
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [treeData, setTreeData] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  /**
   * 检查是否可以填写表单
   * 只能在当前季度，且当前日期在当前季度28号之前可以填写
   */
  const checkCanFill = () => {
    if (selectedKeys.length === 0) {
      return { canFill: false, message: '请选择季度' };
    }

    const selectedQuarter = selectedKeys[0];
    const currentYear = moment().year();
    const currentQuarter = moment().quarter();
    const currentQuarterKey = `${currentYear}Q${currentQuarter}`;

    // 检查选中的季度是否是当前季度
    if (selectedQuarter !== currentQuarterKey) {
      const quarterMap: Record<string, string> = {
        'Q1': '第一季度',
        'Q2': '第二季度',
        'Q3': '第三季度',
        'Q4': '第四季度'
      };
      const match = String(selectedQuarter).match(/^(\d{4})(Q\d)$/);
      if (match) {
        const [, year, quarter] = match;
        return {
          canFill: false,
          message: `当前为${currentYear}年第${['', '一', '二', '三', '四'][currentQuarter]}季度，只能在该季度内填写，您选择的是${year}年${quarterMap[quarter]}`
        };
      }
      return {
        canFill: false,
        message: `当前为${currentYear}年第${['', '一', '二', '三', '四'][currentQuarter]}季度，只能在该季度内填写`
      };
    }

    // 检查当前日期是否在当前季度28号之前
    const now = moment();

    // 获取当前季度最后一个月的28号
    // 季度最后一个月：Q1(3月)、Q2(6月)、Q3(9月)、Q4(12月)
    const quarterLastMonth = currentQuarter * 3; // 3, 6, 9, 12
    const deadline = moment().year(currentYear).month(quarterLastMonth - 1).date(28);

    // 如果当前日期在28号之后（不包括28号当天），则不能填写
    if (now.isAfter(deadline, 'day')) {
      return {
        canFill: false,
        message: `当前表单仅能在${currentYear}年第${['', '一', '二', '三', '四'][currentQuarter]}季度28号之前填写，当前日期已超过填写期限`
      };
    }

    return {
      canFill: true,
      message: `当前表单仅能在${currentYear}年第${['', '一', '二', '三', '四'][currentQuarter]}季度28号之前填写`
    };
  };

  /**
   * 初始化季度树形数据
   */
  const initQuarterTreeData = () => {
    const arr: any[] = [];
    const currentYear = moment().year();
    const nextYear = moment().add(1, 'year').year();
    const prevYear = moment().subtract(1, 'year').year();
    const currentQuarter = moment().quarter();
    const currentQuarterKey = `${currentYear}Q${currentQuarter}`;

    [prevYear, currentYear, nextYear].forEach(year => {
      const _children: any[] = [];
      const quarterMap: Record<string, string> = {
        'Q1': '第一季度',
        'Q2': '第二季度',
        'Q3': '第三季度',
        'Q4': '第四季度'
      };
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
        _children.push({
          key: `${year}${quarter}`,
          title: quarterMap[quarter]
        })
      })
      arr.push({
        key: year,
        title: `${year}年`,
        children: _children,
      })
    })
    setSelectedKeys([currentQuarterKey])
    setTreeData(arr);
  };

  useEffect(() => {
    // 初始化季度树形数据
    initQuarterTreeData();
  }, [])

  // 从 Summary 组件导入的配置
  const NUMERIC_FIELDS = [
    'contract_say_price',
    'final_or_expected_settlement_amount',
    'progress_settlement_current_year',
    'progress_settlement_total',
    'received_cash',
    'received_bill',
    'received_material',
    'received_other',
    'received_subtotal',
    'book_payable_balance',
    'advance_payment_balance',
    'net_payable_amount',
    'net_payable_current_year_available',
    'net_payable_quality_and_deposit',
    'net_payable_after_year',
    'net_payable_pending_writeoff',
    'expected_remaining_payable',
    'two_arrears_total_invoiced',
    'two_arrears_cost_not_invoiced',
    'two_arrears_remaining_by_ratio',
    'two_arrears_within_1_year',
    'two_arrears_1_to_3_years',
    'two_arrears_over_3_years',
    'two_arrears_due_to_funds_shortage',
  ];

  const SETTLEMENT_STATUS_CONFIG = [
    { label: '与业主、分包全部结算完', value: '1' },
    { label: '与业主、分包全部未结算完', value: '2' },
    { label: '与业主结算完，分包未结算完', value: '3' },
    { label: '与业主未结算完，分包结算完', value: '4' },
    { label: '在建工程未结算', value: '5' },
    { label: '其他', value: '6' },
  ];

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

  // 计算合计数据
  const calculateTotals = (data: any[]) => {
    const totals: any = {};
    NUMERIC_FIELDS.forEach((field) => {
      const values = data.map((record) => Number(record[field]) || 0);
      totals[field] = preciseSum(values);
    });
    return totals;
  };

  const getDataByStatus = (data: any[], status: string) => {
    return data.filter((record) => String(record.settlement_status) === status);
  };

  // 扁平化列结构 - 递归获取所有叶子列
  const flattenLeafColumns = (cols: any[]): any[] => {
    const result: any[] = [];
    cols.forEach((col: any) => {
      if (col.children && col.children.length > 0) {
        result.push(...flattenLeafColumns(col.children));
      } else {
        result.push(col);
      }
    });
    return result;
  };

  // 获取表头颜色配置
  const getHeaderColor = (className: string) => {
    const colorMap: Record<string, { bg: string; fg: string }> = {
      'blue-header-cell': { bg: '8DB4E2', fg: '000000' },
      'yellow-header-cell': { bg: 'FFFF00', fg: '000000' },
      'orange-header-cell': { bg: 'FFC000', fg: '000000' },
      'green-header-cell': { bg: '92D050', fg: '000000' },
      'light-blue-header-cell': { bg: '5B9BD5', fg: 'FFFFFF' },
      'beige-header-cell': { bg: 'FDE9D9', fg: '000000' },
      'red-header-cell': { bg: 'DA9694', fg: '000000' },
    };
    return colorMap[className] || { bg: 'FFFFFF', fg: '000000' };
  };

  // 将 Ant Design 列配置转换为带颜色信息的 schema，并转换国际化
  const convertColumnsToSchema = (cols: any[]): any[] => {
    return cols.map((col: any) => {
      // 转换国际化标题
      const translatedTitle = col.title ? formatMessage({ id: col.title }, col.title) : col.title;

      if (col.children && col.children.length > 0) {
        return {
          type: 'group',
          key: col.key || col.dataIndex || `group-${Math.random()}`,
          title: translatedTitle,
          className: col.onHeaderCell?.()?.className || col.className || '',
          children: convertColumnsToSchema(col.children),
        };
      } else {
        const isTextColumn = ['wbs_code', 'contract_name', 'contract_no', 'relative_person_code',
          'subletting_enroll_name', 'settlement_status_str', 'account_name', 'profit_center_code',
          'contract_category', 'counterparty_risk', 'create_ts_str', 'create_user_name',
          'modify_ts_str', 'modify_user_name', 'two_arrears_reason_analysis'].includes(col.dataIndex);
        return {
          type: 'leaf',
          key: col.dataIndex || col.key || `leaf-${Math.random()}`,
          title: translatedTitle,
          width: col.width || 120,
          align: col.align || 'center',
          valueType: isTextColumn ? 'text' : 'number',
          excel: isTextColumn ? undefined : { numFmt: '#,##0.00' },
          className: col.onHeaderCell?.()?.className || col.className || '',
        };
      }
    });
  };

  const getTableColumns = () => {
    // 从选中的季度中提取年份（格式：2025Q4）
    const selectedQuarter = selectedKeys.length > 0 ? selectedKeys[0] : '';
    const selectedYear = String(selectedQuarter)?.match(/^(\d{4})/)?.[1] || selectedQuarter;

    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "wbs_code",
      "income_info_contract_no",
      {
        title: "compinfo.debtStatisticsContractName",
        subTitle: "工程名称",
        dataIndex: "contract_name",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return <a onClick={() => {
            setSelectedRecord(record);
            setOpen(true);
          }}>{text}</a>;
        },
      },
      "contract_no",
      "relative_person_code",
      "subletting_enroll_name",
      "settlement_status_str",
      "contract_say_price",
      "final_or_expected_settlement_amount",
      "progress_settlement_current_year",
      "progress_settlement_total",
      "received_cash",
      "received_bill",
      "received_material",
      "received_other",
      "received_subtotal",
      "book_payable_balance",
      "advance_payment_balance",
      "net_payable_amount",
      "net_payable_current_year_available",
      "net_payable_quality_and_deposit",
      {
        title: `${selectedYear}年后可付款（元）`,
        subTitle: `${selectedYear}年后付款金额`,
        dataIndex: "net_payable_after_year",
        width: 160,
        align: "center",
        render: (text: any) => formatAmount(text),
      },
      "net_payable_pending_writeoff",
      "expected_remaining_payable",
      "two_arrears_total_invoiced",
      "two_arrears_cost_not_invoiced",
      "two_arrears_expected_payment_ratio",
      "two_arrears_actual_payment_ratio",
      "two_arrears_remaining_by_ratio",
      "two_arrears_within_1_year",
      "two_arrears_1_to_3_years",
      "two_arrears_over_3_years",
      "two_arrears_due_to_funds_shortage",
      "two_arrears_reason_analysis",
      "contract_payment_clause",
      "contract_progress_ratio_contract",
      "contract_progress_ratio_budget",
      "account_name",
      "profit_center_code",
      "contract_category",
      "counterparty_risk",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        { value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .setTableColumnsToMultiHeader([
        {
          title: '进度结算情况（实际）',
          children: ['progress_settlement_current_year', 'progress_settlement_total'],
        },
        {
          title: '累计付款情况（不包括预付款余额）',
          children: ['received_cash', 'received_bill', 'received_material', 'received_other', 'received_subtotal'],
        },
        {
          title: '应付款项净额分析',
          children: ['net_payable_current_year_available', 'net_payable_quality_and_deposit', 'net_payable_after_year', 'net_payable_pending_writeoff'],
        },
        {
          title: '两拖欠相关分析',
          children: ["two_arrears_total_invoiced",
            "two_arrears_cost_not_invoiced",
            "two_arrears_expected_payment_ratio",
            "two_arrears_actual_payment_ratio",
            "two_arrears_remaining_by_ratio",
            "two_arrears_within_1_year",
            "two_arrears_1_to_3_years",
            "two_arrears_over_3_years",
            "two_arrears_due_to_funds_shortage",
            "two_arrears_reason_analysis"],
        },
        {
          title: '合同执行情况分析',
          children: ["contract_payment_clause",
            "contract_progress_ratio_contract",
            "contract_progress_ratio_budget"],
        }
      ])
      .needToExport([
        "wbs_code",
        "income_info_contract_no",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "subletting_enroll_name",
        "settlement_status_str",
        "contract_say_price",
        "final_or_expected_settlement_amount",
        "progress_settlement_current_year",
        "progress_settlement_total",
        "received_cash",
        "received_bill",
        "received_material",
        "received_other",
        "received_subtotal",
        "book_payable_balance",
        "advance_payment_balance",
        "net_payable_amount",
        "net_payable_current_year_available",
        "net_payable_quality_and_deposit",
        "net_payable_after_year",
        "net_payable_pending_writeoff",
        "expected_remaining_payable",
        "two_arrears_total_invoiced",
        "two_arrears_cost_not_invoiced",
        "two_arrears_expected_payment_ratio",
        "two_arrears_actual_payment_ratio",
        "two_arrears_remaining_by_ratio",
        "two_arrears_within_1_year",
        "two_arrears_1_to_3_years",
        "two_arrears_over_3_years",
        "two_arrears_due_to_funds_shortage",
        "two_arrears_reason_analysis",
        "contract_payment_clause",
        "contract_progress_ratio_contract",
        "contract_progress_ratio_budget",
        "account_name",
        "profit_center_code",
        "contract_category",
        "counterparty_risk",
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        "modify_user_name",
      ])
    return cols.getNeedMultiColumns();
  };

  // 自定义导出函数
  const handleExport = async () => {
    try {
      setExportLoading(true);

      // 先获取所有数据（不分页）
      const selectedQuarter = selectedKeys.length > 0 ? selectedKeys[0] : '';
      const filter = [
        { Key: 'quarter', Val: selectedQuarter + '%', Operator: 'like' },
        { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
      ];

      const response = await dispatch({
        type: "debtPaymentStatistics/queryDebtPaymentStatistics",
        payload: {
          sort: 'create_ts',
          order: 'desc',
          filter: JSON.stringify(filter),
          // 不分页，获取所有数据
          offset: 0,
          limit: 999999,
        },
      });

      const exportDataSource = response?.rows || [];

      // 获取列配置
      const columns = getTableColumns();
      const schema = convertColumnsToSchema(columns);

      // 获取所有叶子列（按顺序）
      const allLeafsOrdered: any[] = [];
      const pushLeafsInOrder = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'leaf') {
            allLeafsOrdered.push(node);
          } else if (node.type === 'group' && node.children) {
            pushLeafsInOrder(node.children);
          }
        }
      };
      pushLeafsInOrder(schema);

      // 创建 Excel 工作簿和工作表
      const wb = new ExcelJS.Workbook();
      wb.created = new Date();
      const ws = wb.addWorksheet(`债务填报表_${selectedQuarter}`);

      // 判断表头层级
      const hasGroup = schema.some((n) => n.type === 'group');

      // 构建表头行数据
      const headerRow1: { title: string; className?: string }[] = [];
      const headerRow2: { title: string; className?: string }[] = [];
      const merges: { startCol: number; endCol: number; className?: string }[] = [];

      let colIndex = 1;

      for (const n of schema) {
        if (n.type === 'leaf') {
          headerRow1.push({ title: n.title, className: n.className });
          if (hasGroup) headerRow2.push({ title: '', className: n.className });
          colIndex += 1;
          continue;
        }

        const start = colIndex;
        const leafCount = flattenLeafColumns([n]).filter((x: any) => x.type === 'leaf').length;

        headerRow1.push({ title: n.title, className: n.className });
        for (let i = 1; i < leafCount; i++) {
          headerRow1.push({ title: '', className: n.className });
        }

        const groupLeafs = flattenLeafColumns(n.children).filter((c: any) => c.type === 'leaf');
        for (const lf of groupLeafs) {
          headerRow2.push({ title: lf.title, className: lf.className || n.className });
        }

        const end = start + leafCount - 1;
        merges.push({ startCol: start, endCol: end, className: n.className });

        colIndex += leafCount;
      }

      // 写入表头行到 Excel
      if (hasGroup) {
        ws.addRow(headerRow1.map((h) => h.title));
        ws.addRow(headerRow2.map((h) => h.title));
      } else {
        ws.addRow(allLeafsOrdered.map((c) => c.title));
      }

      // 合并表头单元格并设置颜色
      const headerRowsCount = hasGroup ? 2 : 1;
      if (hasGroup) {
        let c = 1;
        for (let i = 0; i < schema.length; i++) {
          const n = schema[i];
          if (n.type === 'leaf') {
            ws.mergeCells(1, c, 2, c);
            // 设置颜色
            const headerInfo = headerRow1[c - 1];
            if (headerInfo?.className) {
              const colors = getHeaderColor(headerInfo.className);
              const cell1 = ws.getCell(1, c);
              const cell2 = ws.getCell(2, c);
              cell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
              cell1.font = { ...cell1.font, color: { argb: colors.fg }, bold: true };
              cell2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
              cell2.font = { ...cell2.font, color: { argb: colors.fg }, bold: true };
            }
            c += 1;
          } else {
            const currentCol = c;
            const mergeInfo = merges.find((m) => m.startCol === currentCol);
            if (mergeInfo) {
              ws.mergeCells(1, mergeInfo.startCol, 1, mergeInfo.endCol);
              // 设置第一行颜色
              if (mergeInfo.className) {
                const colors = getHeaderColor(mergeInfo.className);
                for (let col = mergeInfo.startCol; col <= mergeInfo.endCol; col++) {
                  const cell = ws.getCell(1, col);
                  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
                  cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
                }
              }
            }
            // 设置第二行颜色
            const groupLeafs = flattenLeafColumns(n.children).filter((x: any) => x.type === 'leaf');
            const startColForGroup = c;
            for (let j = 0; j < groupLeafs.length; j++) {
              const colNum = startColForGroup + j;
              const headerInfo = headerRow2[colNum - 1];
              if (headerInfo?.className) {
                const colors = getHeaderColor(headerInfo.className);
                const cell = ws.getCell(2, colNum);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
                cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
              }
            }
            c += groupLeafs.length;
          }
        }
      } else {
        // 单层表头，直接为每个列设置颜色
        headerRow1.forEach((h, i) => {
          if (h.className) {
            const colors = getHeaderColor(h.className);
            const cell = ws.getCell(1, i + 1);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
            cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
          }
        });
      }

      // 设置表头样式（边框、对齐、行高等）
      for (let r = 1; r <= headerRowsCount; r++) {
        const row = ws.getRow(r);
        row.height = 25;
        row.eachCell((cell) => {
          // 如果单元格没有设置背景色，则设置为白色
          if (!cell.fill) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
          }
          // 如果单元格字体没有加粗，则设置为加粗
          if (!cell.font?.bold) {
            cell.font = { ...cell.font, bold: true };
          }
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      // 设置列宽和数字格式
      allLeafsOrdered.forEach((col, i) => {
        const xcol = ws.getColumn(i + 1);
        xcol.width = col.width ? Math.max(8, Math.floor(col.width / 10)) : 14;
        if (col.valueType === 'number') {
          xcol.numFmt = col.excel?.numFmt ?? '#,##0.00';
        }
        xcol.alignment = { vertical: 'middle', horizontal: col.align ?? 'center' };
      });

      // 写入数据行
      exportDataSource.forEach((item: any) => {
        const values = allLeafsOrdered.map((c) => {
          const value = item[c.key];
          return value === null || value === undefined || value === '' ? '-' : value;
        });
        const excelRow = ws.addRow(values);
        excelRow.height = 20;
        excelRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // 写入合计行
      if (exportDataSource && exportDataSource.length > 0) {
        // 总合计行
        const totalSummary = calculateTotals(exportDataSource);
        // 获取第一条数据的 up_wbs_name 字段，用于合计行显示
        const firstRecordUpWbsName = exportDataSource[0]?.up_wbs_name || '';
        const totalLabel = firstRecordUpWbsName ? `${firstRecordUpWbsName}合计` : '合计';
        const totalValues = allLeafsOrdered.map((c) => {
          if (c.key === 'settlement_status_str') {
            return totalLabel;
          } else if (NUMERIC_FIELDS.includes(c.key)) {
            const value = totalSummary[c.key];
            return value === null || value === undefined || value === '' ? '-' : value;
          } else {
            return '';
          }
        });
        const totalRow = ws.addRow(totalValues);
        totalRow.height = 20;
        totalRow.font = { bold: true };
        totalRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          // 为整行设置绿色背景
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D4EDDA' },
          };
        });

        // 各状态分组合计行
        SETTLEMENT_STATUS_CONFIG.forEach((config) => {
          const statusData = getDataByStatus(exportDataSource, config.value);
          const statusTotals = calculateTotals(statusData);
          const statusValues = allLeafsOrdered.map((c) => {
            if (c.key === 'settlement_status_str') {
              return config.label;
            } else if (NUMERIC_FIELDS.includes(c.key)) {
              const value = statusTotals[c.key];
              return value === null || value === undefined || value === '' ? '-' : value;
            } else {
              return '';
            }
          });
          const statusRow = ws.addRow(statusValues);
          statusRow.height = 20;
          statusRow.font = { bold: true };
          statusRow.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            // 为整行设置黄色背景
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF3CD' },
            };
          });
        });
      }

      // 冻结表头
      ws.views = [{ state: 'frozen', xSplit: 0, ySplit: headerRowsCount }];

      // 生成 Excel 文件并触发下载
      const buf = await wb.xlsx.writeBuffer();
      const fileName = `债务填报表_${selectedQuarter}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);

      message.success('导出成功');
      setExportLoading(false);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后再试');
      setExportLoading(false);
    }
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    const { canFill } = checkCanFill();

    return [
      <Space key="button-space">
        <Button
          key="add"
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          disabled={!canFill}
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
      </Space>,
      <a
        key="export"
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={handleExport}
      >{exportLoading ? '导出中...' : '导出'}</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    const { canFill } = checkCanFill();

    return [
      <Button
        key="edit"
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        disabled={!canFill}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        key="delete"
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "debtPaymentStatistics/delDebtPaymentStatistics",
                payload: {
                  id: selectedRows[0].id,
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
    ]
  }

  const onSelect = (_selectedKeys: any) => {
    setSelectedKeys(_selectedKeys);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={4}>
          <strong style={{ fontSize: 18 }}>债务填报</strong>
          {treeData.length > 0 ? (
            <Tree
              style={{ marginTop: 8 }}
              selectedKeys={selectedKeys}
              defaultExpandedKeys={[moment().year()]}
              onSelect={onSelect}
              treeData={treeData}
            />
          ) : (
            <Empty />
          )}
        </Col>
        <Col span={20}>
          {selectedKeys.length > 0 && (
            <div key={selectedKeys[0]}>
              <BaseCurdSingleTable
                cRef={actionRef}
                rowKey="id"
                tableTitle={`债务填报表 ${selectedKeys[0]}`}
                type="debtPaymentStatistics/queryDebtPaymentStatistics"
                importType="debtPaymentStatistics/importDebtPaymentStatistics"
                tableColumns={getTableColumns()}
                funcCode={authority + '债务填报'}
                tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
                tableDefaultFilter={[
                  { Key: 'quarter', Val: selectedKeys[0]+'%', Operator: 'like' }, { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
                ]}
                buttonToolbar={renderButtonToolbar}
                selectedRowsToolbar={renderSelectedRowsToolbar}
                summary={(record: any) => <DebtPaymentStatisticsSummary dataSource={record} columns={getTableColumns()} />}
                renderSelfToolbar={() => {
                  const { canFill, message: fillMessage } = checkCanFill();
                  return (
                    <Alert
                      type={canFill ? "info" : "warning"}
                      message={fillMessage}
                    />
                  )
                }}
              />
            </div>
          )}
        </Col>
      </Row>
      {open && selectedRecord && selectedKeys && (
        <DebtPaymentStatisticsDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
          selectedKeys={selectedKeys}
        />
      )}
      {addVisible && (
        <DebtPaymentStatisticsAdd
          visible={addVisible}
          selectedQuarter={selectedKeys.length > 0 ? selectedKeys[0] : ''}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {visible && (
        <BaseImportModal
          visible={visible}
          maxCount={1}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {editVisible && (
        <DebtPaymentStatisticsEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          selectedQuarter={selectedKeys.length > 0 ? selectedKeys[0] : ''}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(DebtPaymentStatisticsPage);
