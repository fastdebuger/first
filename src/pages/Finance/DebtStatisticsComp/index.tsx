import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Empty, message, Row, Space, Table, Tree } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import { connect, useIntl } from 'umi';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import moment from 'moment';
import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';

import { configColumns } from "./columns";
import DebtStatisticsAdd from "./Add";
import DebtStatisticsDetail from "./Detail";
import DebtStatisticsEdit from "./Edit";

/**
 * 债权填报表
 * @constructor
 */
const DebtStatisticsPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const { formatMessage } = useIntl();
  const actionRef: any = useRef();

  const [treeData, setTreeData] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  const [profitCenterCode, setProfitCenterCode] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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

    // 查询利润中心编码
    if (dispatch) {
      dispatch({
        type: "debtStatistics/queryProfitCenter",
        payload: {
          sort: 'profit_center_code',
          order: 'asc',
          filter: JSON.stringify([{ Key: 'profit_wbs_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=', }])
        },
        callback: (res: any) => {
          console.log('res :>> ', res);

          if (res.errCode === ErrorCode.ErrOk && res.rows && res.rows.length > 0 && res.rows[0].profit_center_code) {
            setProfitCenterCode(res.rows[0].profit_center_code);
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 从 Summary 组件导入的配置
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
    const sum = numbers.reduce((acc, num) => {
      const intValue = Math.round((num || 0) * 100);
      return acc + intValue;
    }, 0);
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

  /**
   * 按分公司分组数据并插入合计行
   * @param rawData 原始数据
   * @returns 处理后的数据（包含合计行）
   */
  const processDataWithSummary = (rawData: any[]): any[] => {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    // 按分公司分组
    const branchGroups: Record<string, any[]> = {};
    const branchOrder: string[] = [];

    rawData.forEach((record) => {
      const branchKey = record.up_wbs_code || 'default';

      if (!branchGroups[branchKey]) {
        branchGroups[branchKey] = [];
        branchOrder.push(branchKey);
      }
      branchGroups[branchKey].push(record);
    });

    const result: any[] = [];

    // 遍历每个分公司
    branchOrder.forEach((branchKey) => {
      const branchData = branchGroups[branchKey];
      const branchName = branchData[0]?.up_wbs_name || '未知分公司';

      // 1. 添加明细数据行
      branchData.forEach((record) => {
        result.push({
          ...record,
          _rowType: 'detail',
          _branchKey: branchKey,
        });
      });

      // 2. 添加分公司合计行（绿色背景）
      const branchTotalSummary = calculateTotals(branchData);
      const totalRow: any = {
        id: `total-${branchKey}`,
        _rowType: 'total',
        _branchKey: branchKey,
        settlement_status_str: `${branchName}合计`,
        ...branchTotalSummary,
      };
      result.push(totalRow);

      // 3. 添加分公司分组合计行（黄色背景，按结算状态）
      SETTLEMENT_STATUS_CONFIG.forEach((config) => {
        const statusData = getDataByStatus(branchData, config.value);
        const statusTotals = calculateTotals(statusData);
        const statusRow: any = {
          id: `status-${branchKey}-${config.value}`,
          _rowType: 'subtotal',
          _branchKey: branchKey,
          settlement_status_str: config.label,
          ...statusTotals,
        };
        result.push(statusRow);
      });
    });

    return result;
  };

  /**
   * 获取表格数据
   */
  const fetchTableData = async (page = 1, pageSize = 10) => {
    if (selectedKeys.length === 0) {
      setDataSource([]);
      return;
    }

    setLoading(true);
    try {
      const selectedQuarter = selectedKeys[0];
      const filter = [
        { Key: 'quarter', Val: selectedQuarter + '%', Operator: 'like' },
        { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }];

      // 判断是否为公司级视图
      const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
      const isCompanyLevel = propKey === 'comp' || propKey === 'branchComp';

      const response = await dispatch({
        type: "debtStatistics/queryDebtStatistics",
        payload: {
          sort: isCompanyLevel ? 'up_wbs_code' : 'create_ts',
          order: isCompanyLevel ? 'asc' : 'desc',
          filter: JSON.stringify(filter),
          offset: isCompanyLevel ? 0 : (page - 1) * pageSize,
          limit: isCompanyLevel ? 999999 : pageSize,
        },
      });

      const rows = response?.rows || [];

      // 在公司级视图下，对数据进行排序
      if (isCompanyLevel && rows.length > 0) {
        rows.sort((a: any, b: any) => {
          const codeA = a.up_wbs_code || '';
          const codeB = b.up_wbs_code || '';
          if (codeA !== codeB) {
            return codeA.localeCompare(codeB);
          }
          const timeA = a.create_ts || 0;
          const timeB = b.create_ts || 0;
          return timeB - timeA;
        });
      }

      // 处理数据，插入合计行
      const processedData = processDataWithSummary(rows);

      setDataSource(processedData);
      setPagination({
        current: page,
        pageSize,
        total: response?.total || 0,
      });
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (selectedKeys.length > 0) {
        await fetchTableData(1, pagination.pageSize);
      } else {
        setDataSource([]);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  const getTableColumns = () => {
    // 从选中的季度中提取年份（格式：2025Q4）
    const selectedQuarter = selectedKeys.length > 0 ? selectedKeys[0] : '';
    const selectedYear = String(selectedQuarter)?.match(/^(\d{4})/)?.[1] || selectedQuarter;

    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "wbs_code",
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
      "owner_unit_name",
      "settlement_status_str",
      "contract_say_price",
      "expected_settlement_amount",
      "progress_settlement_current_year",
      "progress_settlement_total",
      "received_cash",
      "received_bill",
      "received_material",
      "received_other",
      "received_subtotal",
      "book_receivable_balance",
      "advance_receipt_balance",
      "net_receivable_amount",
      "net_receivable_analysis",
      {
        title: `${selectedYear}年内可回收（元）`,
        subTitle: `${selectedYear}年内可回收`,
        dataIndex: "net_receivable_recover_in_year",
        width: 160,
        align: "center",
        render: (text: any) => {
          return <span>{text}</span>;
        },
      },
      {
        title: `${selectedYear}年后可回收（元）`,
        subTitle: `${selectedYear}年后可回收`,
        dataIndex: "net_receivable_recover_after_year",
        width: 160,
        align: "center",
        render: (text: any) => {
          return <span>{text}</span>;
        },
      },
      "net_receivable_bad_debt",
      "expected_receivable_amount",
      "total_invoice_count",
      "collection_plan_reason",
      "responsible_person",
      "account_name",
      "profit_center_code",
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
          title: formatMessage({ id: 'compinfo.progressSettlementActual', defaultMessage: '进度结算情况（实际）' }),
          children: ['progress_settlement_current_year', 'progress_settlement_total'],
        },
        {
          title: formatMessage({ id: 'compinfo.cumulativeReceipts', defaultMessage: '累计收款情况' }),
          children: ['received_cash', 'received_bill', 'received_material', 'received_other', 'received_subtotal'],
        },
        {
          title: formatMessage({ id: 'compinfo.netReceivableAnalysis', defaultMessage: '应收款项净额分析' }),
          children: ['net_receivable_recover_in_year', 'net_receivable_recover_after_year', 'net_receivable_bad_debt'],
        },
      ])
      .needToExport([
        "wbs_code",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "owner_unit_name",
        "settlement_status_str",
        "contract_say_price",
        "expected_settlement_amount",
        "progress_settlement_current_year",
        "progress_settlement_total",
        "received_cash",
        "received_bill",
        "received_material",
        "received_other",
        "received_subtotal",
        "book_receivable_balance",
        "advance_receipt_balance",
        "net_receivable_amount",
        "net_receivable_analysis",
        "net_receivable_recover_in_year",
        "net_receivable_recover_after_year",
        "net_receivable_bad_debt",
        "expected_receivable_amount",
        "total_invoice_count",
        "collection_plan_reason",
        "responsible_person",
        "account_name",
        "profit_center_code",
        "counterparty_risk",
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        "modify_user_name",
      ]);

    // 获取所有列的 dataIndex，用于禁用排序图标
    const allDataIndexes = [
      "wbs_code",
      "contract_name",
      "contract_no",
      "relative_person_code",
      "owner_unit_name",
      "settlement_status_str",
      "contract_say_price",
      "expected_settlement_amount",
      "progress_settlement_current_year",
      "progress_settlement_total",
      "received_cash",
      "received_bill",
      "received_material",
      "received_other",
      "received_subtotal",
      "book_receivable_balance",
      "advance_receipt_balance",
      "net_receivable_amount",
      "net_receivable_analysis",
      "net_receivable_recover_in_year",
      "net_receivable_recover_after_year",
      "net_receivable_bad_debt",
      "expected_receivable_amount",
      "total_invoice_count",
      "collection_plan_reason",
      "responsible_person",
      "account_name",
      "profit_center_code",
      "counterparty_risk",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      "modify_user_name",
    ];

    // 禁用所有列的排序图标
    cols.noNeedToSorterIcon(allDataIndexes);

    // 获取处理后的列配置并应用国际化
    const processedColumns = cols.getNeedMultiColumns();

    // 递归处理列配置，确保所有标题都应用国际化，并禁用排序
    const processColumns = (columnList: any[]): any[] => {
      return columnList.map((col: any) => {
        if (col.children && col.children.length > 0) {
          return {
            ...col,
            title: col.title ? formatMessage({ id: col.title, defaultMessage: col.title }) : col.title,
            sorter: false, // 禁用排序
            children: processColumns(col.children),
          };
        } else {
          return {
            ...col,
            title: col.title ? formatMessage({ id: col.title, defaultMessage: col.title }) : col.title,
            sorter: false, // 禁用排序
          };
        }
      });
    };

    return processColumns(processedColumns);
  }

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
          'owner_unit_name', 'settlement_status_str', 'account_name', 'profit_center_code',
          'counterparty_risk', 'create_ts_str', 'create_user_name',
          'modify_ts_str', 'modify_user_name', 'collection_plan_reason', 'responsible_person'].includes(col.dataIndex);
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

  // 自定义导出函数
  const handleExport = async () => {
    try {
      setExportLoading(true);

      // 使用当前表格中已处理的数据（包含合计行）
      // 如果 dataSource 为空，则重新获取数据
      let exportDataSource = dataSource;

      if (!exportDataSource || exportDataSource.length === 0) {
        const selectedQuarter = selectedKeys.length > 0 ? selectedKeys[0] : '';
        const filter = String(selectedQuarter).match(/^\d{4}Q\d$/) ? [
          { Key: 'quarter', Val: selectedQuarter, Operator: '=' },
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ] : [{ Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }];

        const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
        const isCompanyLevel = propKey === 'comp' || propKey === 'branchComp';

        const response = await dispatch({
          type: "debtStatistics/queryDebtStatistics",
          payload: {
            sort: isCompanyLevel ? 'up_wbs_code' : 'create_ts',
            order: isCompanyLevel ? 'asc' : 'desc',
            filter: JSON.stringify(filter),
            offset: 0,
            limit: 999999,
          },
        });

        const rows = response?.rows || [];

        // 在公司级视图下，对数据进行排序
        if (isCompanyLevel && rows.length > 0) {
          rows.sort((a: any, b: any) => {
            const codeA = a.up_wbs_code || '';
            const codeB = b.up_wbs_code || '';
            if (codeA !== codeB) {
              return codeA.localeCompare(codeB);
            }
            const timeA = a.create_ts || 0;
            const timeB = b.create_ts || 0;
            return timeB - timeA;
          });
        }

        // 处理数据，插入合计行（与表格展示一致）
        exportDataSource = processDataWithSummary(rows);
      }

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
      const ws = wb.addWorksheet(`债权填报表_${selectedKeys.length > 0 ? selectedKeys[0] : ''}`);

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

      // 写入数据行（包括明细、合计和分组合计行）
      exportDataSource.forEach((item: any) => {
        const values = allLeafsOrdered.map((c) => {
          const value = item[c.key];
          // 对于合计行和分组合计行，非数值字段留空
          if ((item._rowType === 'total' || item._rowType === 'subtotal') && c.key !== 'settlement_status_str' && !NUMERIC_FIELDS.includes(c.key)) {
            return '';
          }
          return value === null || value === undefined || value === '' ? '-' : value;
        });
        const excelRow = ws.addRow(values);
        excelRow.height = 20;

        // 根据行类型设置样式
        if (item._rowType === 'total') {
          excelRow.font = { bold: true };
          excelRow.eachCell((cell) => {
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
        } else if (item._rowType === 'subtotal') {
          excelRow.font = { bold: true };
          excelRow.eachCell((cell) => {
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
        } else {
          // 明细行
          excelRow.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      });

      // 冻结表头
      ws.views = [{ state: 'frozen', xSplit: 0, ySplit: headerRowsCount }];

      // 生成 Excel 文件并触发下载
      const buf = await wb.xlsx.writeBuffer();
      const fileName = `债权填报表_${selectedKeys.length > 0 ? selectedKeys[0] : ''}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
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
   */
  const renderButtonToolbar = () => {
    return (
      <Space>
        <Button
          type="primary"
          onClick={handleExport}
          loading={exportLoading}
        >
          导出
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            fetchTableData(pagination.current, pagination.pageSize);
          }}
        >
          刷新
        </Button>
      </Space>
    );
  }


  const onSelect = (_selectedKeys: any) => {
    setSelectedKeys(_selectedKeys);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={4}>
          <strong style={{ fontSize: 18 }}>债权填报</strong>
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
              <div style={{ marginBottom: 16 }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>债权填报表 {selectedKeys[0]}</h3>
                  {renderButtonToolbar()}
                </Space>
                {(() => {
                  const { canFill, message: fillMessage } = checkCanFill();
                  return (
                    <Alert
                      style={{ marginTop: 12 }}
                      type={canFill ? "info" : "warning"}
                      message={fillMessage}
                    />
                  );
                })()}
              </div>
              <Table
                rowKey={(record) => {
                  if (record.id) return record.id;
                  if (record._rowType && record._branchKey) {
                    return `${record._rowType}-${record._branchKey}-${record.settlement_status_str || ''}`;
                  }
                  return Math.random().toString();
                }}
                columns={getTableColumns()}
                dataSource={dataSource}
                loading={loading}
                bordered
                size="small"
                scroll={{ x: 1400, y: 'calc(100vh - 300px)' }}
                pagination={(() => {
                  const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
                  const isCompanyLevel = propKey === 'comp' || propKey === 'branchComp';
                  if (isCompanyLevel) {
                    return false; // 公司级视图不分页
                  }
                  return {
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => {
                      fetchTableData(page, pageSize);
                    },
                  };
                })()}
                rowClassName={(record: any) => {
                  if (record._rowType === 'total') {
                    return 'row-total';
                  }
                  if (record._rowType === 'subtotal') {
                    return 'row-subtotal';
                  }
                  return '';
                }}
              />
              <style>{`
                .row-total td { 
                  font-weight: 700; 
                  background: #d4edda !important; 
                }
                .row-subtotal td { 
                  font-weight: 700; 
                  background: #fff3cd !important; 
                }
              `}</style>
            </div>
          )}
        </Col>
      </Row>
      {open && selectedRecord && selectedKeys && (
        <DebtStatisticsDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            fetchTableData(pagination.current, pagination.pageSize);
          }}
          selectedKeys={selectedKeys}
        />
      )}
      {addVisible && (
        <DebtStatisticsAdd
          visible={addVisible}
          selectedQuarter={selectedKeys.length > 0 ? selectedKeys[0] : ''}
          onCancel={() => setAddVisible(false)}
          profitCenterCode={profitCenterCode}
          callbackSuccess={() => {
            setAddVisible(false);
            fetchTableData(pagination.current, pagination.pageSize);
          }}
        />
      )}
      {visible && (
        <BaseImportModal
          visible={visible}
          maxCount={1}
          onCancel={() => setVisible(false)}
          startUploadFile={async () => {
            // TODO: 实现导入功能
            message.info('导入功能待实现');
            setVisible(false);
            return false;
          }}
          downLoadTemplate={() => {
            // TODO: 实现模板下载功能
            message.info('模板下载功能待实现');
          }}
        />
      )}
      {editVisible && (
        <DebtStatisticsEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          selectedQuarter={selectedKeys.length > 0 ? selectedKeys[0] : ''}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            fetchTableData(pagination.current, pagination.pageSize);
          }}
        />
      )}
    </div>
  )
}
export default connect()(DebtStatisticsPage);
