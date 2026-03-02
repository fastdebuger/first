import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// 仅导入需要的函数（如 evaluate 用于公式计算）
import { evaluate } from 'mathjs';
import _ from 'lodash'; // 可以用 lodash 的深拷贝，或自己实现
import moment from "moment";

type Report = {
  meta?: {
    title?: string;
    unit?: string;
  };
  schema: ColumnNode[];
  rows: ReportRow[];
};

type ColumnNode =
  | {
  type: "group";
  key: string;
  title: string;
  children: ColumnNode[];
}
  | {
  type: "leaf";
  key: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
  valueType?: "text" | "number";
  excel?: { numFmt?: string };
};

type ReportRow = {
  key: string;
  rowType: "detail" | "subtotal" | "total" | "groupHeader";
  cells: Record<string, any>;
};

type AggBase = {
  branch: string;
  center: string;
  code: string;
  // 其他固定属性（比如monthAmount等）可以加在这里
};

type ShowMapFields = Record<
  Exclude<string, keyof AggBase>, // 键：排除branch/center/code的自定义字段
  Record<string, number>          // 值：月份→数值的映射
>;


/** =======================
 *  2) 模拟后端一维数组数据
 *  - 你用真实接口替换它即可
 * ======================= */

type ApiItem = {
  branchName: string;   // 分公司
  centerName: string;   // 责任中心
  code: string;         // 代码
  month: string;        // '2025-11' 这种
};

/** =======================
 *  3) 工具：schema 遍历/展平
 * ======================= */

function flattenLeafColumns(schema: ColumnNode[]): ColumnNode[] {
  const out: ColumnNode[] = [];
  const dfs = (n: ColumnNode) => {
    if (n.type === "leaf") out.push(n);
    else n.children.forEach(dfs);
  };
  schema.forEach(dfs);
  return out;
}

/**
 * 根据结构化公式和行数据，计算目标列值
 * @param {Array} formula 结构化公式（JSON.parse后的数组）
 * @param {Object} rowData 行数据（比如{ sales: 100, price: 20, cost: 500 }）
 * @returns {number} 计算结果
 */
const calculateByFormula = (formula, rowData) => {
  try {
    // 1. 将公式转换为“值+运算符”的表达式（替换字段为实际值）
    const expressionParts = formula.map(item => {
      if (item.type === 'field') {
        // 替换字段为行数据中的值（确保是数字）
        return Number(rowData[`${item.value}_total`]) || 0;
      } else if (item.type === 'operator') {
        // 直接返回运算符
        return item.value;
      }
      return '';
    });
    // 拼接为表达式字符串（比如"100 * 20 - 500"）
    const expression = expressionParts.join(' ');
    // 2. 安全计算表达式（避免eval的风险，可改用math.js）
    // 推荐用math.js处理（支持四则运算、优先级），需先安装：npm i mathjs
    const result = evaluate(expression);
    return formatNumber(result);
  } catch (e) {
    console.error('公式计算失败：', e);
    return 0; // 异常时返回默认值
  }
};


/**
 * 上期留底 是上个月的 负的 应纳税额
 * 根据结构化公式和行数据，计算目标列值
 * @param {Array} formula 结构化公式（JSON.parse后的数组）
 * @param {Object} rowData 行数据（比如{ sales: 100, price: 20, cost: 500 }）
 * @returns {number} 计算结果
 */
const calculateByFormulaShangQiLiuDi = (formula, rowData) => {
  const lastMonth = moment().subtract(1, 'months').format('YYYY_MM');
  try {
    // 1. 将公式转换为“值+运算符”的表达式（替换字段为实际值）
    const expressionParts = formula.map(item => {
      if (item.type === 'field') {
        // 替换字段为行数据中的值（确保是数字）
        return Number(rowData[`${item.value}_${lastMonth}`]) || 0;
      } else if (item.type === 'operator') {
        // 直接返回运算符
        return item.value;
      }
      return '';
    });
    // 拼接为表达式字符串（比如"100 * 20 - 500"）
    const expression = expressionParts.join(' ');
    // 2. 安全计算表达式（避免eval的风险，可改用math.js）
    // 推荐用math.js处理（支持四则运算、优先级），需先安装：npm i mathjs
    const result = evaluate(expression);
    const showResult = ((result || 0) * (-1)) + 0;
    return formatNumber(showResult);
  } catch (e) {
    console.error('公式计算失败：', e);
    return 0; // 异常时返回默认值
  }
};


/** =======================
 *  4) 生成 schema（动态月份列）
 *  - 你也可以让后端直接给 months 列表
 * ======================= */

export function buildSchemaFromMonths(months: string[], showMap: ShowMapFields): ColumnNode[] {
  // months: ['2025-11','2025-10',...]
  // 当月
  // const currMonth = moment().format("YYYY-MM");
  const getMonthLeafs = (key: string) => {
    const localLeafs: ColumnNode[] = months.map((m) => {
      const mm = m.split("-")[1]; // '11'
      return {
        type: "leaf",
        key: `${key}_${m.replace("-", "_")}`, // m_2025_11
        title: `${parseInt(mm, 10)}月`,
        width: 160,
        align: "right",
        valueType: "number",
        excel: { numFmt: "#,##0.00" },
      };
    });
    return localLeafs;
  }

  const getMonthAreaTitle = () => {
    const titleArr = months.map((m) => {
      const mm = m.split("-")[1]; // '11'
      return parseInt(mm, 10);
    });
    return titleArr.sort((a, b) => a - b).join("-");
  }

  const dynamicCols: any[] = [];

  Object.keys(showMap).forEach((key) => {
    const _localLeafs = getMonthLeafs(key);
    const _monthAreaTitle = getMonthAreaTitle();
    dynamicCols.push({
      type: "group",
      key: key,
      title: key,
      children: [
        ..._localLeafs,
        {
          type: "leaf",
          key: key + '_total',
          title: `${_monthAreaTitle}月合计`,
          width: 160,
          align: "right",
          valueType: "number",
          excel: { numFmt: "#,##0.00" },
        },
      ],
    })
  })

  const schema: ColumnNode[] = [
    { type: "leaf", key: "idx", title: "序号", width: 60, align: "center", valueType: "text" },
    { type: "leaf", key: "branch", title: "分公司", width: 120, align: "left", valueType: "text" },
    { type: "leaf", key: "center", title: "责任中心", width: 220, align: "left", valueType: "text" },
    { type: "leaf", key: "code", title: "利润中心", width: 160, align: "center", valueType: "text" },
    ...dynamicCols,
    { type: "leaf", key: "上期留底", title: "上期留底", width: 160, align: "center", valueType: "text" },
    { type: "leaf", key: "应纳税额", title: "应纳税额", width: 160, align: "center", valueType: "text" },
  ];
  return schema;
}

/** =======================
 *  5) 一维数组 -> rows（明细 + 分组小计 + 总计）
 *  - 这里把同一个(分公司+责任中心+代码)聚合成一行
 * ======================= */

export function buildReportRows(api: ApiItem[], months: string[], showMap: ShowMapFields, formulaField: any): ReportRow[] {
  // 聚合明细：key = branch|center|code
  type Agg = AggBase & ShowMapFields;

  const map = new Map<string, Agg>();

  for (const it of api) {
    const k = `${it.branchName}||${it.centerName}||${it.code}`;
    const agg = map.get(k) ?? {
      branch: it.branchName,
      center: it.centerName,
      code: it.code,
      // 深拷贝 showMap，确保每个 agg 的 进项/销项 是独立对象
      ..._.cloneDeep(showMap),
      // ...showMap,
    };

    // 按月份拼接
    Object.keys(showMap).forEach((key) => {
      agg[key][it.month] = (agg[key][it.month] ?? 0) + (it[key] ?? 0);
    })

    map.set(k, agg);
  }

  // 明细行列表
  const details: ReportRow[] = Array.from(map.values())
    .sort((a, b) => (a.branch + a.center + a.code).localeCompare(b.branch + b.center + b.code, "zh"))
    .map((agg, i) => {
      const cells: Record<string, any> = {
        idx: i + 1,
        branch: agg.branch,
        center: agg.center,
        code: agg.code,
      };

      // 每个月填值
      Object.keys(showMap).forEach((key) => {
        for (const m of months) {
          cells[`${key}_${m.replace("-", "_")}`] = agg[key][m] ?? 0;
        }
      })

      // 合计
      Object.keys(showMap).forEach((key) => {
        cells[`${key}_total`]  = months.reduce((s, m) => s + (agg[key][m] ?? 0), 0);
      })

      // 计算公式
      if (Object.keys(formulaField).length > 0) {
        for (const [key, val] of Object.entries(formulaField)) {
          if (key === '上期留底') {
            const _result = calculateByFormulaShangQiLiuDi(val, cells);
            cells[key] = _result;
          } else {
            const _result = calculateByFormula(val, cells);
            cells[key] = _result;
          }
        }
      }

      return { key: `d-${agg.branch}-${agg.center}-${agg.code}`, rowType: "detail", cells };
    });

  // 按分公司分组生成小计行
  const byBranch = new Map<string, ReportRow[]>();
  for (const r of details) {
    const b = r.cells.branch;
    if (!byBranch.has(b)) byBranch.set(b, []);
    byBranch.get(b)!.push(r);
  }

  const rows: ReportRow[] = [];

  // 总计（放第一行）
  rows.push(calcTotalRow(details, months, "total", showMap, formulaField));

  // 每个分公司：先明细后小计
  const branchNames = Array.from(byBranch.keys()).sort((a, b) => a.localeCompare(b, "zh"));
  for (const b of branchNames) {
    const groupRows = byBranch.get(b)!;
    // 可选：分组标题行（不需要可删）
    rows.push({
      key: `hdr-${b}`,
      rowType: "groupHeader",
      cells: { idx: "", branch: b, center: "", code: "" },
    });

    rows.push(...groupRows);
    rows.push(calcSubtotalRow(groupRows, months, b, showMap, formulaField));
  }

  return rows;
}

/**
 * 小计
 * @param groupRows
 * @param months
 * @param branchName
 * @param showMap
 */
function calcSubtotalRow(groupRows: ReportRow[], months: string[], branchName: string, showMap: ShowMapFields, formulaField: any): ReportRow {
  const cells: Record<string, any> = {
    idx: "",
    branch: branchName,
    center: `${branchName}合计`,
    code: "",
  };

  // 有几个列
  Object.keys(showMap).forEach((key) => {
    // 小计的月份列求和
    for (const m of months) {
      const k = `${key}_${m.replace("-", "_")}`;
      cells[k] = groupRows.reduce((s, r) => s + (Number(r.cells[k]) || 0), 0);
    }

    // 小计的所有月份求和
    cells[`${key}_total`] = groupRows.reduce((s, r) => s + (Number(r.cells[`${key}_total`]) || 0), 0);

    // 计算公式
    // if (Object.keys(formulaField).length > 0) {
    //   for (const [key, val] of Object.entries(formulaField)) {
    //     const _result = calculateByFormula(val, cells);
    //     cells[key] = _result;
    //   }
    // }

    // 计算公式
    if (Object.keys(formulaField).length > 0) {
      for (const [key, val] of Object.entries(formulaField)) {
        if (key === '上期留底') {
          const _result = calculateByFormulaShangQiLiuDi(val, cells);
          cells[key] = _result;
        } else {
          const _result = calculateByFormula(val, cells);
          cells[key] = _result;
        }
      }
    }
  })

  return { key: `sub-${branchName}`, rowType: "subtotal", cells };
}

/**
 * 总计
 * @param detailRows
 * @param months
 * @param key
 * @param showMap
 */
function calcTotalRow(detailRows: ReportRow[], months: string[], key: string, showMap: ShowMapFields, formulaField: any): ReportRow {
  const cells: Record<string, any> = {
    idx: "",
    branch: "",
    center: "总计",
    code: "",
  };

  // 有几个列
  Object.keys(showMap).forEach((key) => {
    // 总计的每一个月份列求和
    for (const m of months) {
      const k = `${key}_${m.replace("-", "_")}`;
      cells[k] = detailRows.reduce((s, r) => s + (Number(r.cells[k]) || 0), 0);
    }

    // 总计的所有月份列求和
    cells[`${key}_total`] = detailRows.reduce((s, r) => s + (Number(r.cells[`${key}_total`]) || 0), 0);

    // 计算公式
    // if (Object.keys(formulaField).length > 0) {
    //   for (const [key, val] of Object.entries(formulaField)) {
    //     const _result = calculateByFormula(val, cells);
    //     cells[key] = _result;
    //   }
    // }
    // 计算公式
    if (Object.keys(formulaField).length > 0) {
      for (const [key, val] of Object.entries(formulaField)) {
        if (key === '上期留底') {
          const _result = calculateByFormulaShangQiLiuDi(val, cells);
          cells[key] = _result;
        } else {
          const _result = calculateByFormula(val, cells);
          cells[key] = _result;
        }
      }
    }
  })

  return { key, rowType: "total", cells };
}

/** =======================
 *  6) schema -> Antd Table columns
 * ======================= */

export function schemaToAntdColumns(schema: ColumnNode[]): any[] {
  const mapNode = (n: ColumnNode): any => {
    if (n.type === "group") {
      return {
        title: n.title,
        key: n.key,
        children: n.children.map(mapNode),
      };
    }
    return {
      title: n.title,
      key: n.key,
      width: n.width,
      align: n.align,
      // 从 row.cells[leaf.key] 取值
      dataIndex: ["cells", n.key],
      render: (v: any, row: ReportRow) => {
        if (n.valueType === "number") {
          if (row.rowType === "detail") {
            return (
              <a style={{color: 'black'}} onClick={() => {
                console.log('----row', row, n)
              }}>{formatNumber(v)}</a>
            )
          }
          return formatNumber(v)
        }
        // groupHeader 行只显示分公司名，其他列留空更清爽
        if (row.rowType === "groupHeader" && n.key !== "branch") return "";
        return v ?? "";
      },
      fixed: ["idx", "branch", "center"].includes(n.key) ? "left" : undefined,
    };
  };

  return schema.map(mapNode);
}

function formatNumber(v: any): string {
  const num = Number(v);
  if (!Number.isFinite(num)) return v ?? "";
  return num.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


/** =======================
 *  7) schema + rows -> ExcelJS 导出
 *  - 不追求像素级：只做表头合并、数字格式、小计/总计加粗与底色
 * ======================= */

export async function exportReportToExcel(report: Report) {
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();
  const ws = wb.addWorksheet(report.meta?.title || "Report");

  const leafs = flattenLeafColumns(report.schema).filter((c): c is Extract<ColumnNode, { type: "leaf" }> => c.type === "leaf");

  // 计算表头层级（最多两层：group + leaf；若你未来要更多层，也可以扩展）
  const hasGroup = report.schema.some((n) => n.type === "group");

  // 第一行：group 标题（或 leaf 标题）
  // 第二行：leaf 标题（若有 group）
  const headerRow1: string[] = [];
  const headerRow2: string[] = [];

  // 为了做合并，需要知道每个 group 覆盖的列范围
  type MergeInfo = { startCol: number; endCol: number; title: string };
  const merges: MergeInfo[] = [];

  let colIndex = 1;

  for (const n of report.schema) {
    if (n.type === "leaf") {
      headerRow1.push(n.title);
      if (hasGroup) headerRow2.push(""); // 对齐
      colIndex += 1;
      continue;
    }

    // group
    const start = colIndex;
    const leafCount = flattenLeafColumns([n]).filter((x) => x.type === "leaf").length;

    headerRow1.push(n.title);
    // group 的其它占位（Excel 需要补空单元格）
    for (let i = 1; i < leafCount; i++) headerRow1.push("");

    // 第二行填子列标题
    const groupLeafs = flattenLeafColumns(n.children).filter((c): c is Extract<ColumnNode, { type: "leaf" }> => c.type === "leaf");
    for (const lf of groupLeafs) headerRow2.push(lf.title);

    const end = start + leafCount - 1;
    merges.push({ startCol: start, endCol: end, title: n.title });

    colIndex += leafCount;
  }

  // 写表头
  if (hasGroup) {
    ws.addRow(headerRow1);
    ws.addRow(headerRow2);
  } else {
    ws.addRow(leafs.map((c) => c.title));
  }

  // 合并 group 表头
  if (hasGroup) {
    // 非 group 的 leaf 列，第一行要纵向合并（两行）
    let c = 1;
    for (const n of report.schema) {
      if (n.type === "leaf") {
        ws.mergeCells(1, c, 2, c);
        c += 1;
      } else {
        const leafCount = flattenLeafColumns([n]).filter((x) => x.type === "leaf").length;
        ws.mergeCells(1, c, 1, c + leafCount - 1);
        c += leafCount;
      }
    }
  }

  // 设置列宽/格式
  const allLeafsOrdered: Extract<ColumnNode, { type: "leaf" }>[] = [];
  // 按 schema 顺序展平（而不是全局 leafs 的 DFS 顺序不一定一致）
  const pushLeafsInOrder = (nodes: ColumnNode[]) => {
    for (const node of nodes) {
      if (node.type === "leaf") allLeafsOrdered.push(node);
      else pushLeafsInOrder(node.children);
    }
  };
  pushLeafsInOrder(report.schema);

  allLeafsOrdered.forEach((col, i) => {
    const xcol = ws.getColumn(i + 1);
    xcol.width = col.width ? Math.max(8, Math.floor(col.width / 10)) : 14;
    if (col.valueType === "number") {
      xcol.numFmt = col.excel?.numFmt ?? "#,##0.00";
    }
    xcol.alignment = { vertical: "middle", horizontal: col.align ?? "left" };
  });

  // 表头样式
  const headerRowsCount = hasGroup ? 2 : 1;
  for (let r = 1; r <= headerRowsCount; r++) {
    const row = ws.getRow(r);
    row.height = 20;
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEFEFEF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // 写数据行
  for (const r of report.rows) {
    // 按列顺序取值
    const values = allLeafsOrdered.map((c) => r.cells[c.key]);
    const excelRow = ws.addRow(values);

    // 行样式：总计/小计
    if (r.rowType === "total") {
      excelRow.font = { bold: true };
      excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEBF7" } }; // 浅蓝
    } else if (r.rowType === "subtotal") {
      excelRow.font = { bold: true };
      excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F4EA" } }; // 浅绿
    } else if (r.rowType === "groupHeader") {
      excelRow.font = { bold: true };
      excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F7F7" } }; // 浅灰
    }

    excelRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  ws.views = [{ state: "frozen", xSplit: 4, ySplit: headerRowsCount }]; // 冻结：左4列+表头

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${report.meta?.title || "report"}.xlsx`);
}
