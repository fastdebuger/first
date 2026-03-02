import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Space, message, Tree, Row, Col, DatePicker, InputNumber } from 'antd';
import { ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';
import './index.less';
import { getConfigColumns } from './columns';
import type { DataType } from './columns';
import { ErrorCode } from '@yayang/constants';
import { connect } from 'umi';
import { updateNetCreditFundForecast } from '@/services/finance/debtStatistics';
import { WBS_CODE } from '@/common/const';

const FundForecast: React.FC = (props: any) => {
  const { dispatch } = props;
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 从本地存储获取默认的 wbsCode
  const defaultWbsCode = localStorage.getItem('auth-default-wbsCode') || '';
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(defaultWbsCode ? [defaultWbsCode] : []);
  const [selectedWbsCode, setSelectedWbsCode] = useState<string>(defaultWbsCode);
  const [selectedYear, setSelectedYear] = useState<string>(moment().format('YYYY'));
  const [summaryData, setSummaryData] = useState<any>(null);
  const [selectedNodeTitle, setSelectedNodeTitle] = useState<string>(''); // 当前选中节点的中文名称
  const tableRef = useRef<any>(null);
  // 编辑状态：记录正在编辑的单元格，格式为 "depCode-dataIndex"
  const [editingKey, setEditingKey] = useState<string>('');
  // 编辑值：记录正在编辑的值
  const [editingValue, setEditingValue] = useState<string | number>('');

  // 获取数据
  const fetchData = () => {
    if (!dispatch) return;

    setLoading(true);
    dispatch({
      type: "debtStatistics/getNetCreditFundForecast",
      payload: {
        sort: 'dep_name',
        order: 'asc',
        year: selectedYear,
        sumCols: JSON.stringify([
          'amount_of_funds_deposited',
          'base_fund_dynamic_balance',

          'copy_net_receivable_bad_debt',
          'copy_net_receivable_bad_debt1',
          'copy_net_receivable_bad_debt2',
          'copy_net_receivable_bad_debt3',
          'copy_net_receivable_bad_debt4',
          'copy_net_receivable_bad_debt5',
          'copy_net_receivable_bad_debt6',
          'expected_net_receivable',
          'expected_net_receivable1',
          'expected_net_receivable2',
          'expected_net_receivable3',
          'expected_net_receivable4',
          'expected_net_receivable5',
          'expected_net_receivable6',
          'expected_receivable_amount',
          'expected_receivable_amount1',
          'expected_receivable_amount2',
          'expected_receivable_amount3',
          'expected_receivable_amount4',
          'expected_receivable_amount5',
          'expected_receivable_amount6',
          'expected_remaining_payable',
          'expected_remaining_payable1',
          'expected_remaining_payable2',
          'expected_remaining_payable3',
          'expected_remaining_payable4',
          'expected_remaining_payable5',
          'expected_remaining_payable6',
          'forward_fund_dynamic_balance',

          'internal_loan_and_upper_fund',

          'net_payable_after_year',
          'net_payable_after_year1',
          'net_payable_after_year2',
          'net_payable_after_year3',
          'net_payable_after_year4',
          'net_payable_after_year5',
          'net_payable_after_year6',
          'net_payable_amount',
          'net_payable_amount1',
          'net_payable_amount2',
          'net_payable_amount3',
          'net_payable_amount4',
          'net_payable_amount5',
          'net_payable_amount6',
          'net_payable_current_year_available',
          'net_payable_current_year_available1',
          'net_payable_current_year_available2',
          'net_payable_current_year_available3',
          'net_payable_current_year_available4',
          'net_payable_current_year_available5',
          'net_payable_current_year_available6',
          'net_payable_quality_and_deposit',
          'net_payable_quality_and_deposit1',
          'net_payable_quality_and_deposit2',
          'net_payable_quality_and_deposit3',
          'net_payable_quality_and_deposit4',
          'net_payable_quality_and_deposit5',
          'net_payable_quality_and_deposit6',
          'net_receivable_amount',
          'net_receivable_amount1',
          'net_receivable_amount2',
          'net_receivable_amount3',
          'net_receivable_amount4',
          'net_receivable_amount5',
          'net_receivable_amount6',
          'net_receivable_bad_debt',
          'net_receivable_bad_debt1',
          'net_receivable_bad_debt2',
          'net_receivable_bad_debt3',
          'net_receivable_bad_debt4',
          'net_receivable_bad_debt5',
          'net_receivable_bad_debt6',
          'net_receivable_payable_diff',
          'net_receivable_payable_diff1',
          'net_receivable_payable_diff2',
          'net_receivable_payable_diff3',
          'net_receivable_payable_diff4',
          'net_receivable_payable_diff5',
          'net_receivable_payable_diff6',
          'net_receivable_recover_after_year',
          'net_receivable_recover_after_year1',
          'net_receivable_recover_after_year2',
          'net_receivable_recover_after_year3',
          'net_receivable_recover_after_year4',
          'net_receivable_recover_after_year5',
          'net_receivable_recover_after_year6',
          'net_receivable_recover_in_year',
          'net_receivable_recover_in_year1',
          'net_receivable_recover_in_year2',
          'net_receivable_recover_in_year3',
          'net_receivable_recover_in_year4',
          'net_receivable_recover_in_year5',
          'net_receivable_recover_in_year6',
          'year_after_recoverable_minus_payable',
          'year_after_recoverable_minus_payable1',
          'year_after_recoverable_minus_payable2',
          'year_after_recoverable_minus_payable3',
          'year_after_recoverable_minus_payable4',
          'year_after_recoverable_minus_payable5',
          'year_after_recoverable_minus_payable6',
          'year_in_recoverable_minus_payable',
          'year_in_recoverable_minus_payable1',
          'year_in_recoverable_minus_payable2',
          'year_in_recoverable_minus_payable3',
          'year_in_recoverable_minus_payable4',
          'year_in_recoverable_minus_payable5',
          'year_in_recoverable_minus_payable6',
        ]),
        filter: selectedWbsCode
          ? JSON.stringify([{
            "Key": "dep_code",
            "Val": `${selectedWbsCode}%`,
            "Operator": "like"
          }])
          : JSON.stringify([]),
      },
      callback: (res: any) => {
        setLoading(false);
        console.log('资金预测数据:', res);
        if (res.errCode === ErrorCode.ErrOk) {
          if (res.rows) {
            setDataSource(res.rows);
          }
          if (res.sum) {
            setSummaryData(res.sum);
          }
        }
      },
    });
  };

  // 合计行配置
  const SUMMARY_ROWS = [
    { label: 'XX合计', suffix: '', bgColor: '#92D050', textColor: '#000' },
    { label: '与业主、分包全部结算完', suffix: '1', bgColor: '#FFFF00', textColor: '#000' },
    { label: '与业主、分包全部未结算完', suffix: '2', bgColor: '#FFFF00', textColor: '#000' },
    { label: '与业主结算完、分包未结算完', suffix: '3', bgColor: '#FFFF00', textColor: '#000' },
    { label: '与业主未结算完、分包结算完', suffix: '4', bgColor: '#FFFF00', textColor: '#000' },
    { label: '在建工程未结算', suffix: '5', bgColor: '#FFFF00', textColor: '#000' },
    { label: '其他', suffix: '6', bgColor: '#FFFF00', textColor: '#000' },
  ] as const;

  // 递归获取所有列的dataIndex
  const getAllDataIndexes = (cols: any[]): string[] => {
    const indexes: string[] = [];
    cols.forEach((col: any) => {
      if (col.dataIndex) indexes.push(col.dataIndex);
      if (col.children) indexes.push(...getAllDataIndexes(col.children));
    });
    return indexes;
  };


  // 获取表头颜色配置（与页面样式保持一致）
  const getHeaderColor = (className: string) => {
    const colorMap: Record<string, { bg: string; fg: string }> = {
      'blue-header-cell': { bg: '8DB4E2', fg: '000000' },        // 蓝色：#8DB4E2，黑色文字
      'yellow-header-cell': { bg: 'FFFF00', fg: '000000' },      // 黄色：#FFFF00，黑色文字
      'orange-header-cell': { bg: 'FFC000', fg: '000000' },      // 橙色：#FFC000，黑色文字
      'green-header-cell': { bg: '92D050', fg: '000000' },       // 绿色：#92D050，黑色文字
      'light-blue-header-cell': { bg: '5B9BD5', fg: 'FFFFFF' },  // 浅蓝色：#5B9BD5，白色文字
      'beige-header-cell': { bg: 'FDE9D9', fg: '000000' },       // 米色：#FDE9D9，黑色文字
      'red-header-cell': { bg: 'DA9694', fg: '000000' },         // 红色：#DA9694，黑色文字
    };
    return colorMap[className] || { bg: 'FFFFFF', fg: '000000' };
  };

  /**
   * 扁平化列结构 - 递归获取所有叶子列
   */
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

  /**
   * 将 Ant Design 列配置转换为带颜色信息的 schema
   */
  const convertColumnsToSchema = (cols: any[]): any[] => {
    return cols.map((col: any) => {
      if (col.children && col.children.length > 0) {
        // 有子列，转换为 group 类型
        return {
          type: 'group',
          key: col.key || col.dataIndex || `group-${Math.random()}`,
          title: col.title,
          className: col.onHeaderCell?.()?.className || col.className || '',
          children: convertColumnsToSchema(col.children),
        };
      } else {
        // 叶子节点，转换为 leaf 类型
        // 项目列（dep_name）是文本类型，其他列是数字类型
        const isTextColumn = col.dataIndex === 'dep_name';
        return {
          type: 'leaf',
          key: col.dataIndex || col.key || `leaf-${Math.random()}`,
          title: col.title,
          width: col.width || 120,
          align: col.align || 'center',
          valueType: isTextColumn ? 'text' : 'number',
          excel: isTextColumn ? undefined : { numFmt: '#,##0.00' },
          className: col.onHeaderCell?.()?.className || col.className || '',
        };
      }
    });
  };


  /**
   * 自定义导出函数 - 支持多色表头和合计行第一列特殊颜色
   *
   * 功能说明：
   * 1. 将 Ant Design 表格的多级列配置转换为 Excel 多级表头
   * 2. 根据列的 className 设置表头的背景色和文字颜色（蓝色、黄色、橙色、绿色等）
   * 3. 导出所有数据行，保持数据格式和对齐方式
   * 4. 导出合计行，第一列设置特殊背景色（绿色或黄色）
   * 5. 设置列宽、边框、对齐等格式
   * 6. 冻结表头，方便查看数据
   * 7. 生成 Excel 文件并触发浏览器下载
   *
   * 参考 exportReportToExcel 的结构，但添加了颜色支持
   */
  const handleExport = async () => {
    try {
      // ========== 第一步：初始化加载状态 ==========
      setLoading(true); // 显示加载状态，防止用户重复点击

      // ========== 第二步：获取并转换列配置 ==========
      // 获取当前年份的列配置（包含多级表头结构和颜色信息）
      const columns = getConfigColumns(selectedYear);

      // 将 Ant Design 的列配置转换为带颜色信息的 schema 格式
      // schema 包含 type（'group' 或 'leaf'）、title、className 等信息
      const schema = convertColumnsToSchema(columns);

      // ========== 第三步：获取所有叶子列（按顺序） ==========
      // 用途：Excel 的数据列是扁平的一维结构，需要按顺序获取所有叶子列（没有子列的列）
      // 这样在写入数据时，可以按照正确的列顺序填充数据
      const allLeafsOrdered: any[] = [];
      /**
       * 递归函数：按 schema 的顺序将所有叶子列添加到 allLeafsOrdered 数组中
       * @param nodes - 当前层级的节点数组（可能是 group 或 leaf）
       */
      const pushLeafsInOrder = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'leaf') {
            // 如果是叶子节点，直接添加到结果数组
            allLeafsOrdered.push(node);
          } else if (node.type === 'group' && node.children) {
            // 如果是分组节点，递归处理其子节点
            pushLeafsInOrder(node.children);
          }
        }
      };
      pushLeafsInOrder(schema); // 执行递归，获取所有叶子列

      // ========== 第四步：创建 Excel 工作簿和工作表 ==========
      const wb = new ExcelJS.Workbook(); // 创建新的 Excel 工作簿
      wb.created = new Date(); // 设置工作簿创建时间
      const ws = wb.addWorksheet('净债权资金预测'); // 添加工作表，名称为"净债权资金预测"

      // ========== 第五步：判断表头层级 ==========
      // 检查是否存在分组列（group 类型），如果存在则表头有两层，否则只有一层
      const hasGroup = schema.some((n) => n.type === 'group');

      // ========== 第六步：构建表头行数据（带颜色信息） ==========
      // headerRow1: 第一层表头（如果有分组，则包含分组标题；如果是单层，则包含所有列标题）
      // headerRow2: 第二层表头（仅在有分组时使用，包含分组下的子列标题）
      // merges: 记录需要合并的单元格信息（用于后续合并单元格）
      const headerRow1: { title: string; className?: string }[] = [];
      const headerRow2: { title: string; className?: string }[] = [];
      const merges: { startCol: number; endCol: number; className?: string }[] = [];

      let colIndex = 1; // 当前列索引（从1开始，Excel列号从1开始）

      // 遍历 schema，构建表头行数据
      for (const n of schema) {
        if (n.type === 'leaf') {
          // ========== 情况1：叶子节点（没有子列的列） ==========
          // 将列标题添加到第一层表头
          headerRow1.push({ title: n.title, className: n.className });
          // 如果有分组列，第二层表头需要填充空字符串（用于对齐）
          if (hasGroup) headerRow2.push({ title: '', className: n.className });
          colIndex += 1; // 列索引+1
          continue;
        }

        // ========== 情况2：分组节点（有子列的列） ==========
        const start = colIndex; // 记录分组起始列索引
        // 计算该分组下有多少个叶子列（用于确定合并单元格的列数）
        const leafCount = flattenLeafColumns([n]).filter((x: any) => x.type === 'leaf').length;

        // 第一层表头：添加分组标题，并填充占位符（用于后续合并单元格）
        headerRow1.push({ title: n.title, className: n.className });
        // group 的其它占位：除了第一个单元格显示标题外，其他单元格填充空字符串
        // 这样在合并单元格时，可以正确覆盖这些占位单元格
        for (let i = 1; i < leafCount; i++) {
          headerRow1.push({ title: '', className: n.className });
        }

        // 第二层表头：填充分组下的所有子列标题
        const groupLeafs = flattenLeafColumns(n.children).filter((c: any) => c.type === 'leaf');
        for (const lf of groupLeafs) {
          // 子列使用自己的 className，如果没有则使用父级的 className
          headerRow2.push({ title: lf.title, className: lf.className || n.className });
        }

        // 记录合并信息：起始列、结束列、颜色类名
        const end = start + leafCount - 1;
        merges.push({ startCol: start, endCol: end, className: n.className });

        // 更新列索引，跳过该分组占用的所有列
        colIndex += leafCount;
      }

      // ========== 第七步：写入表头行到 Excel ==========
      // 将构建好的表头数据写入 Excel 工作表
      if (hasGroup) {
        // 如果有分组，写入两层表头
        ws.addRow(headerRow1.map((h) => h.title)); // 第一层：分组标题
        ws.addRow(headerRow2.map((h) => h.title)); // 第二层：子列标题
      } else {
        // 如果没有分组，只写入一层表头
        ws.addRow(allLeafsOrdered.map((c) => c.title));
      }

      // ========== 第八步：合并表头单元格并设置颜色 ==========
      // 根据表头结构合并单元格，并根据 className 设置背景色和文字颜色
      if (hasGroup) {
        // ========== 情况1：有分组的多层表头 ==========
        let c = 1; // 当前列索引
        for (let i = 0; i < schema.length; i++) {
          const n = schema[i];
          if (n.type === 'leaf') {
            // ========== 子情况1.1：叶子节点（单列） ==========
            // 纵向合并：将第一行和第二行合并为一个单元格
            ws.mergeCells(1, c, 2, c);
            // 设置颜色：根据 className 获取颜色配置，并应用到合并后的两个单元格
            const headerInfo = headerRow1[c - 1];
            if (headerInfo?.className) {
              const colors = getHeaderColor(headerInfo.className);
              const cell1 = ws.getCell(1, c); // 第一行单元格
              const cell2 = ws.getCell(2, c); // 第二行单元格
              // 设置背景色和文字颜色
              cell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
              cell1.font = { ...cell1.font, color: { argb: colors.fg }, bold: true };
              cell2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
              cell2.font = { ...cell2.font, color: { argb: colors.fg }, bold: true };
            }
            c += 1; // 列索引+1
          } else {
            // ========== 子情况1.2：分组节点 ==========
            const currentCol = c; // 保存当前列索引，避免在 find 回调中使用循环变量
            // 查找该分组的合并信息
            const mergeInfo = merges.find((m) => m.startCol === currentCol);
            if (mergeInfo) {
              // 横向合并：将第一行的多个单元格合并为一个（分组标题跨越多列）
              ws.mergeCells(1, mergeInfo.startCol, 1, mergeInfo.endCol);
              // 设置第一行颜色：为合并范围内的所有单元格设置相同的背景色和文字颜色
              if (mergeInfo.className) {
                const colors = getHeaderColor(mergeInfo.className);
                const startColNum = mergeInfo.startCol;
                const endColNum = mergeInfo.endCol;
                for (let col = startColNum; col <= endColNum; col++) {
                  const cell = ws.getCell(1, col);
                  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
                  cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
                }
              }
            }
            // 设置第二行颜色：为分组下的每个子列设置颜色
            const groupLeafs = flattenLeafColumns(n.children).filter((x: any) => x.type === 'leaf');
            const startColForGroup = c; // 保存起始列索引
            for (let j = 0; j < groupLeafs.length; j++) {
              const colNum = startColForGroup + j; // 计算当前子列的列号
              const headerInfo = headerRow2[colNum - 1];
              if (headerInfo?.className) {
                const colors = getHeaderColor(headerInfo.className);
                const cell = ws.getCell(2, colNum);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
                cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
              }
            }
            c += groupLeafs.length; // 更新列索引，跳过该分组占用的所有列
          }
        }
      } else {
        // ========== 情况2：单层表头（没有分组） ==========
        // 直接为每个列设置颜色
        headerRow1.forEach((h, i) => {
          if (h.className) {
            const colors = getHeaderColor(h.className);
            const cell = ws.getCell(1, i + 1);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } };
            cell.font = { ...cell.font, color: { argb: colors.fg }, bold: true };
          }
        });
      }

      // ========== 第九步：设置表头样式（边框、对齐、行高等） ==========
      // 为所有表头行设置统一的样式：行高、边框、对齐方式、字体加粗等
      const headerRowsCount = hasGroup ? 2 : 1; // 表头行数：有分组为2行，无分组为1行
      for (let r = 1; r <= headerRowsCount; r++) {
        const row = ws.getRow(r); // 获取当前行
        row.height = 25; // 设置行高为25
        row.eachCell((cell) => {
          // 如果单元格没有设置背景色，则设置为白色
          if (!cell.fill) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
          }
          // 如果单元格字体没有加粗，则设置为加粗
          if (!cell.font?.bold) {
            cell.font = { ...cell.font, bold: true };
          }
          // 设置对齐方式：垂直居中、水平居中、自动换行
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          // 设置边框：上下左右都是细线
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      // ========== 第十步：设置列宽和数字格式 ==========
      // 为每一列设置宽度、数字格式（如果是数字列）和对齐方式
      allLeafsOrdered.forEach((col, i) => {
        const xcol = ws.getColumn(i + 1); // 获取列对象（Excel列号从1开始）
        // 设置列宽：将像素宽度转换为Excel列宽单位（约10像素=1Excel单位），最小宽度为8
        xcol.width = col.width ? Math.max(8, Math.floor(col.width / 10)) : 14;
        // 如果是数字列，设置数字格式（千分位分隔符，保留两位小数）
        if (col.valueType === 'number') {
          xcol.numFmt = col.excel?.numFmt ?? '#,##0.00';
        }
        // 设置列的对齐方式：垂直居中，水平对齐方式根据列配置（默认为居中）
        xcol.alignment = { vertical: 'middle', horizontal: col.align ?? 'center' };
      });

      // ========== 第十一步：写入数据行 ==========
      // 遍历数据源，将每一行数据写入 Excel
      dataSource.forEach((item: any) => {
        // 按照列的顺序，从数据项中提取对应的值
        const values = allLeafsOrdered.map((c) => {
          const value = item[c.key]; // 根据列的 key 获取数据值
          // 如果值为空、null 或 undefined，显示为 "-"
          return value === null || value === undefined || value === '' ? '-' : value;
        });
        // 将数据行添加到工作表
        const excelRow = ws.addRow(values);
        excelRow.height = 20; // 设置行高为20
        // 为每个单元格设置格式：居中对齐、边框
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

      // ========== 第十二步：写入合计行 ==========
      // 如果有合计数据，则添加合计行（包括"XX合计"和各种分类合计）
      if (summaryData) {
        SUMMARY_ROWS.forEach((summaryRow) => {
          // 如果是第一行（XX合计），使用选中节点的中文名称替换XX
          const displayLabel = summaryRow.label === 'XX合计' && selectedNodeTitle
            ? `${selectedNodeTitle}合计`
            : summaryRow.label;

          // 按照列的顺序，构建合计行的数据
          const values = allLeafsOrdered.map((c) => {
            if (c.key === 'dep_name') {
              // 第一列（项目列）显示合计行标签（如"XX合计"、"与业主、分包全部结算完"等）
              return displayLabel;
            } else {
              // 其他列：根据合计行类型构建字段名
              // 如果 suffix 为空，使用原字段名；否则在原字段名后添加 suffix（如"0"、"1"等）
              const fieldName = summaryRow.suffix ? `${c.key}${summaryRow.suffix}` : c.key;
              // 从 summaryData 中获取对应字段的值
              const value = summaryData[fieldName];
              // 如果值为空，显示为 "-"
              return value === null || value === undefined || value === '' ? '-' : value;
            }
          });
          // 将合计行添加到工作表
          const excelRow = ws.addRow(values);
          excelRow.height = 20; // 设置行高为20
          excelRow.font = { bold: true }; // 设置整行字体为加粗
          // 为每个单元格设置格式
          excelRow.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            // ========== 第一列设置特殊背景色和文字颜色 ==========
            // 根据合计行类型设置不同的背景色：
            // - "XX合计"：绿色背景（#92D050），黑色文字
            // - 其他合计行：黄色背景（#FFFF00），黑色文字
            if (colNumber === 1) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                // 移除颜色值中的#号，因为Excel需要ARGB格式（不含#）
                fgColor: { argb: summaryRow.bgColor.replace('#', '') },
              };
              cell.font = { ...cell.font, color: { argb: summaryRow.textColor.replace('#', '') }, bold: true };
            }
          });
        });
      }

      // ========== 第十三步：冻结表头 ==========
      // 冻结第一列和表头行，方便在滚动时查看表头和第一列（项目列）
      // xSplit: 冻结左侧列数（1表示冻结第一列）
      // ySplit: 冻结上方行数（headerRowsCount 表示冻结所有表头行）
      ws.views = [{ state: 'frozen', xSplit: 1, ySplit: headerRowsCount }];

      // ========== 第十四步：生成 Excel 文件并触发下载 ==========
      // 将工作簿转换为二进制数据（Buffer）
      const buf = await wb.xlsx.writeBuffer();
      // 生成文件名：净债权资金预测_年份_时间戳.xlsx
      const fileName = `净债权资金预测_${selectedYear}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      // 创建 Blob 对象（二进制大对象），指定MIME类型为Excel格式
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // 使用 file-saver 库触发浏览器下载
      saveAs(blob, fileName);

      message.success('导出成功');
      setLoading(false);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后再试');
      setLoading(false);
    }
  };

  // 从树形数据中根据 key 查找节点的 title 和 profit_wbs_code
  const findNodeByKey = (nodes: any[], key: string): any => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 获取树形数据
  const fetchTreeData = () => {
    if (!dispatch) return;
    dispatch({
      type: 'profitCenter/queryProfitCenter',
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          {Key: 'profit_wbs_code', Val: WBS_CODE + "%", Operator: 'like'},
        ]),
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk && res.rows) {
          // 根据 profit_belong_wbs_code 和 profit_belong_wbs_name 分组
          const groupedMap = new Map<string, any[]>();

          res.rows.forEach((item: any) => {
            const belongKey = item.profit_belong_wbs_code || '';

            if (!groupedMap.has(belongKey)) {
              groupedMap.set(belongKey, []);
            }

            groupedMap.get(belongKey)?.push({
              ...item,
              title: item.profit_center_code
                ? `${item.profit_wbs_name || ''} (${item.profit_center_code})`
                : item.profit_wbs_name || '',
              key: item.profit_wbs_code || '',
              profit_center_code: item.profit_center_code,
            });
          });

          // 构建树形结构
          const formattedTreeData: any[] = [];
          groupedMap.forEach((children, belongKey) => {
            const firstItem = children[0];
            const belongName = firstItem.profit_belong_wbs_name || '';

            formattedTreeData.push({
              key: belongKey,
              title: belongName,
              profit_belong_wbs_code: belongKey,
              profit_belong_wbs_name: belongName,
              children: children.map((child: any) => ({
                key: child.key,
                title: child.title,
                profit_center_code: child.profit_center_code,
                profit_wbs_code: child.profit_wbs_code,
                profit_wbs_name: child.profit_wbs_name,
                profit_belong_wbs_code: belongKey, // 子节点也保存父节点的 code
                profit_belong_wbs_name: belongName,
              })),
            });
          });

          // 在最顶层添加"公司"节点
          const companyNode = {
            key: 'company',
            title: '公司',
            isCompany: true, // 标记这是公司节点
            children: formattedTreeData,
          };

          const finalTreeData = [companyNode];
          setTreeData(finalTreeData);

          // 默认展开所有父节点（包括公司节点）
          const allParentKeys = ['company', ...Array.from(groupedMap.keys())];
          setExpandedKeys(allParentKeys);

          // 检查 auth-default-wbs-prop-key，如果是 branchComp 则默认选中公司节点
          const storedPropKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
          if (storedPropKey === 'branchComp') {
            // 选中公司节点
            setSelectedKeys(['company']);
            setSelectedWbsCode(''); // 公司节点不传过滤条件
            setSelectedNodeTitle('公司');
          } else {
            // 检查默认的 wbsCode 是否在树中，如果在则选中对应的节点
            const storedWbsCode = localStorage.getItem('auth-default-wbsCode') || '';
            if (storedWbsCode) {
              // 先查找是否有利润中心的 profit_wbs_code 匹配
              let foundChild: any = null;
              for (const group of formattedTreeData) {
                if (group.children) {
                  foundChild = group.children.find((child: any) => child.profit_wbs_code === storedWbsCode);
                  if (foundChild) {
                    // 选中子节点，使用 profit_wbs_code
                    setSelectedKeys([foundChild.key]);
                    setSelectedWbsCode(foundChild.profit_wbs_code);
                    setSelectedNodeTitle(foundChild.title);
                    break;
                  }
                }
              }

              // 如果没有找到利润中心，查找是否有分公司的 profit_belong_wbs_code 匹配
              if (!foundChild) {
                const foundParent = formattedTreeData.find((group) => group.profit_belong_wbs_code === storedWbsCode);
                if (foundParent) {
                  // 选中父节点，使用 profit_belong_wbs_code
                  setSelectedKeys([foundParent.key]);
                  setSelectedWbsCode(foundParent.profit_belong_wbs_code);
                  setSelectedNodeTitle(foundParent.title);
                } else if (formattedTreeData.length > 0) {
                  // 如果都没找到，尝试选中第一个父节点
                  const firstParent = formattedTreeData[0];
                  setSelectedKeys([firstParent.key]);
                  setSelectedWbsCode(firstParent.profit_belong_wbs_code);
                  setSelectedNodeTitle(firstParent.title);
                }
              }
            } else {
              // 如果没有存储的 wbsCode，默认选中公司节点
              setSelectedKeys(['company']);
              setSelectedWbsCode('');
              setSelectedNodeTitle('公司');
            }
          }
        } else {
          message.error(res.errMsg || '获取树形数据失败');
        }
      },
    });
  };

  // 重新加载
  const handleReload = () => {
    fetchData();
  };

  // 年份改变处理
  const handleYearChange = (date: any, dateString: string) => {
    setSelectedYear(dateString);
  };

  // 树形组件选择处理
  const handleTreeSelect = (keys: React.Key[]) => {
    if (keys.length > 0) {
      const selectedKey = keys[0] as string;
      setSelectedKeys(keys);

      // 如果选中的是公司节点
      if (selectedKey === 'company') {
        setSelectedWbsCode(''); // 公司节点不传过滤条件
        setSelectedNodeTitle('公司');
        return;
      }

      // 查找选中的节点
      const selectedNode = findNodeByKey(treeData, selectedKey);
      if (selectedNode) {
        // 判断是父节点还是子节点
        if (selectedNode.profit_wbs_code) {
          // 选中的是子节点（项目部/利润中心），使用 profit_wbs_code
          setSelectedWbsCode(selectedNode.profit_wbs_code);
          setSelectedNodeTitle(selectedNode.title || selectedNode.profit_wbs_name || '');
        } else {
          // 选中的是父节点（分公司），使用 profit_belong_wbs_code
          setSelectedWbsCode(selectedNode.profit_belong_wbs_code || selectedKey);
          setSelectedNodeTitle(selectedNode.title || selectedNode.profit_belong_wbs_name || '');
        }
      } else {
        setSelectedWbsCode(selectedKey);
        setSelectedNodeTitle('');
      }
    } else {
      setSelectedKeys([]);
      setSelectedWbsCode('');
      setSelectedNodeTitle('');
    }
  };

  // 检查是否有编辑权限（auth-default-wbs-prop-key 为 dep）
  const canEdit = () => {
    const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
    return propKey === 'dep';
  };

  // 检查是否为项目部层级（auth-default-wbs-prop-key 为 dep）
  const isDepLevel = () => {
    const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
    return propKey === 'dep';
  };

  // 获取行的唯一标识符
  const getDepCode = (record: DataType) => {
    return record.key || record.dep_code || record.dep_name || '';
  };

  // 处理单元格点击，进入编辑模式
  const handleCellClick = (record: DataType, dataIndex: string) => {
    if (!canEdit()) return;
    const depCode = getDepCode(record);
    const key = `${depCode}-${dataIndex}`;
    setEditingKey(key);
    setEditingValue(record[dataIndex] || '');
  };

  // 处理失去焦点，退出编辑模式并保存值
  const handleCellBlur = async (record: DataType, dataIndex: string) => {
    const depCode = getDepCode(record);
    const key = `${depCode}-${dataIndex}`;
    if (editingKey === key) {
        // 先保存当前编辑值，避免异步操作时值被清除
        const valueToSave = editingValue;

        // 立即清除编辑状态，让输入框消失
        setEditingKey('');
        setEditingValue('');

        // 构建请求参数：dataIndex 作为 key，editingValue 作为 value，year 作为年份
        const params: any = {
          dep_code: depCode,
          year: selectedYear,
        };
        // 使用保存的值
        params[dataIndex] = valueToSave;
        // 调用接口保存数据
        const res = await updateNetCreditFundForecast(params);

        if (res.errCode === ErrorCode.ErrOk) {
          message.success('保存成功');
          // 刷新数据
          fetchData();
        }
    }
  };

  // 处理输入值变化
  const handleCellChange = (value: string | number) => {
    setEditingValue(value);
  };

  // 渲染可编辑单元格
  const renderEditableCell = (record: DataType, dataIndex: string, value: any) => {
    if (!canEdit()) {
      return value === null || value === undefined || value === '' ? '-' : value;
    }

    const depCode = getDepCode(record);
    const key = `${depCode}-${dataIndex}`;
    const isEditing = editingKey === key;

    if (isEditing) {
      return (
        <InputNumber
          value={editingValue}
          onChange={(val) => handleCellChange(val || '')}
          onBlur={() => handleCellBlur(record, dataIndex)}
          style={{ width: '100%' }}
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => handleCellClick(record, dataIndex)}
        style={{
          cursor: 'pointer',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value === null || value === undefined || value === '' ? '-' : value}
      </div>
    );
  };

  // 渲染合计行
  const renderSummary = () => {
    if (!summaryData) return null;

    const columns = getConfigColumns(selectedYear);
    const allDataIndexes = getAllDataIndexes(columns);
    const dataIndexes = allDataIndexes.slice(1); // 排除第一列（项目列）

    return (
      <Table.Summary>
        {SUMMARY_ROWS.map((row) => {
          const depCode = row.suffix || 'total';
          const getFieldName = (baseName: string) => row.suffix ? `${baseName}${row.suffix}` : baseName;

          // 如果是第一行（XX合计），使用选中节点的中文名称替换XX
          const displayLabel = row.label === 'XX合计' && selectedNodeTitle
            ? `${selectedNodeTitle}合计`
            : row.label;

          return (
            <Table.Summary.Row key={`summary-${depCode}`}>
              <Table.Summary.Cell
                index={0}
                align="center"
                className={`fund-forecast-summary-label-cell fund-forecast-summary-${depCode}`}
              >
                <strong>{displayLabel}</strong>
              </Table.Summary.Cell>
              {dataIndexes.map((dataIndex, idx) => {
                const fieldName = getFieldName(dataIndex);
                const value = summaryData[fieldName];
                const displayValue = value === null || value === undefined || value === '' ? '-' : value;
                return (
                  <Table.Summary.Cell
                    key={`${depCode}-${dataIndex}`}
                    index={idx + 1}
                    align="center"
                  >
                    {displayValue}
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          );
        })}
      </Table.Summary>
    );
  };

  useEffect(() => {
    fetchData();
    fetchTreeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当年份或选中节点改变时，重新获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedWbsCode]);

  return (
    <div className="fund-forecast-container">

      <Row gutter={16}>
        {!isDepLevel() && (
          <Col span={6}>
            <div className="fund-forecast-tree">
              {treeData.length > 0 ? (
                <Tree
                  treeData={treeData}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  onSelect={handleTreeSelect}
                  showLine={{ showLeafIcon: false }}
                />
              ) : null}
            </div>
          </Col>
        )}
        <Col span={isDepLevel() ? 24 : 18}>
          <Table
            ref={tableRef}
            title={() => (
              <div>
                <div className="fund-forecast-table-title">
                  净债权资金预测 {selectedYear}
                  <Space>
                    <DatePicker
                      picker="year"
                      value={moment(selectedYear, 'YYYY')}
                      onChange={handleYearChange}
                      format="YYYY"
                      placeholder="选择年份"
                    />
                    <Button
                      type="primary"
                      icon={<ExportOutlined />}
                      onClick={handleExport}
                    >
                      导出
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReload}
                      title="重新加载"
                    />
                  </Space>
                </div>
                {canEdit() && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff' }}>
                    提示：点击&ldquo;资金存量&rdquo;和&ldquo;内部贷款及上级拨入资金&rdquo;下方单元格即可进行修改
                  </div>
                )}
              </div>
            )}
            columns={getConfigColumns(selectedYear, renderEditableCell)}
            dataSource={dataSource}
            bordered
            scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
            pagination={false}
            size="small"
            className="fund-forecast-table"
            loading={loading}
            summary={renderSummary}
          />
        </Col>
      </Row>
    </div>
  );
};

export default connect()(FundForecast);

