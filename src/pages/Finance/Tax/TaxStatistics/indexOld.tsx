import React, { useMemo } from "react";
import { Button, Table, Typography, Space } from "antd";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

const { Title } = Typography;

/** =======================
 *  1) 统一的报表 JSON 结构
 * ======================= */

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

/** =======================
 *  2) 模拟后端一维数组数据
 *  - 你用真实接口替换它即可
 * ======================= */

type ApiItem = {
  branchName: string;   // 分公司
  centerName: string;   // 责任中心
  code: string;         // 代码
  month: string;        // '2025-11' 这种
  amount: number;       // 销项税额
  localPrepay11?: number; // 示例：当地预交税金11（你可按真实字段扩展）
};

const mockApiData: ApiItem[] = [
  { branchName: "一分公司", centerName: "大连石化", code: "P21N", month: "2025-11", amount: 1200, localPrepay11: 50 },
  { branchName: "一分公司", centerName: "大连石化", code: "P21N", month: "2025-10", amount: 800, localPrepay11: 50 },
  { branchName: "一分公司", centerName: "天津石化", code: "P21M", month: "2025-11", amount: 600, localPrepay11: 20 },
  { branchName: "一分公司", centerName: "天津石化", code: "P21M", month: "2025-09", amount: 300, localPrepay11: 20 },

  { branchName: "二分公司", centerName: "广州石化", code: "P22A", month: "2025-11", amount: 900, localPrepay11: 35 },
  { branchName: "二分公司", centerName: "广州石化", code: "P22A", month: "2025-10", amount: 200, localPrepay11: 35 },
];

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

/** =======================
 *  4) 生成 schema（动态月份列）
 *  - 你也可以让后端直接给 months 列表
 * ======================= */

function buildSchemaFromMonths(months: string[]): ColumnNode[] {
  // months: ['2025-11','2025-10',...]
  // 显示标题：11月、10月...
  const monthLeafs: ColumnNode[] = months.map((m) => {
    const mm = m.split("-")[1]; // '11'
    return {
      type: "leaf",
      key: `m_${m.replace("-", "_")}`, // m_2025_11
      title: `${parseInt(mm, 10)}月`,
      width: 110,
      align: "right",
      valueType: "number",
      excel: { numFmt: "#,##0.00" },
    };
  });

  console.log('-------monthLeafs', monthLeafs)

  const schema: ColumnNode[] = [
    { type: "leaf", key: "idx", title: "序号", width: 60, align: "center", valueType: "text" },
    { type: "leaf", key: "branch", title: "分公司", width: 120, align: "left", valueType: "text" },
    { type: "leaf", key: "center", title: "责任中心", width: 220, align: "left", valueType: "text" },
    { type: "leaf", key: "code", title: "代码", width: 90, align: "center", valueType: "text" },

    {
      type: "group",
      key: "tax",
      title: "销项税额",
      children: [
        ...monthLeafs,
        {
          type: "leaf",
          key: "sum_3_11",
          title: "销项3-11合计",
          width: 140,
          align: "right",
          valueType: "number",
          excel: { numFmt: "#,##0.00" },
        },
      ],
    },
    {
      type: "group",
      key: "tax1",
      title: "当地预交税金",
      children: [
        ...monthLeafs,
        {
          type: "leaf",
          key: "sum_3_11",
          title: "当地预交税金11",
          width: 160,
          align: "right",
          valueType: "number",
          excel: { numFmt: "#,##0.00" },
        },
      ],
    },
  ];
  console.log('--123123------schema', schema)
  return schema;
}

/** =======================
 *  5) 一维数组 -> rows（明细 + 分组小计 + 总计）
 *  - 这里把同一个(分公司+责任中心+代码)聚合成一行
 * ======================= */

function buildReportRows(api: ApiItem[], months: string[]): ReportRow[] {
  // 聚合明细：key = branch|center|code
  type Agg = {
    branch: string;
    center: string;
    code: string;
    monthAmount: Record<string, number>;
    localPrepay11: number; // 示例字段：这里按行固定（你可按业务改成求和/取最大等）
  };

  const map = new Map<string, Agg>();

  for (const it of api) {
    const k = `${it.branchName}||${it.centerName}||${it.code}`;
    const agg = map.get(k) ?? {
      branch: it.branchName,
      center: it.centerName,
      code: it.code,
      monthAmount: {},
      localPrepay11: 0,
    };

    console.log('-------agg', agg)

    agg.monthAmount[it.month] = (agg.monthAmount[it.month] ?? 0) + (it.amount ?? 0);
    // 示例：当地预交税金11，按明细行累加（你可调整逻辑）
    agg.localPrepay11 += it.localPrepay11 ?? 0;

    map.set(k, agg);
  }

  console.log('-------map', map)

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
      for (const m of months) {
        cells[`m_${m.replace("-", "_")}`] = agg.monthAmount[m] ?? 0;
      }

      console.log('-------cells', cells);

      // 合计：示例按 months 全部求和（你也可以仅求 3-11 的子集）
      const sum311 = months.reduce((s, m) => s + (agg.monthAmount[m] ?? 0), 0);
      cells["sum_3_11"] = sum311;

      // 示例列
      cells["local_prepay_11"] = agg.localPrepay11;

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
  rows.push(calcTotalRow(details, months, "total"));

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
    rows.push(calcSubtotalRow(groupRows, months, b));
  }

  return rows;
}

function calcSubtotalRow(groupRows: ReportRow[], months: string[], branchName: string): ReportRow {
  const cells: Record<string, any> = {
    idx: "",
    branch: branchName,
    center: `${branchName}合计`,
    code: "",
  };

  for (const m of months) {
    const k = `m_${m.replace("-", "_")}`;
    cells[k] = groupRows.reduce((s, r) => s + (Number(r.cells[k]) || 0), 0);
  }

  cells["sum_3_11"] = groupRows.reduce((s, r) => s + (Number(r.cells["sum_3_11"]) || 0), 0);
  cells["local_prepay_11"] = groupRows.reduce((s, r) => s + (Number(r.cells["local_prepay_11"]) || 0), 0);

  return { key: `sub-${branchName}`, rowType: "subtotal", cells };
}

function calcTotalRow(detailRows: ReportRow[], months: string[], key: string): ReportRow {
  const cells: Record<string, any> = {
    idx: "",
    branch: "",
    center: "总计",
    code: "",
  };

  for (const m of months) {
    const k = `m_${m.replace("-", "_")}`;
    cells[k] = detailRows.reduce((s, r) => s + (Number(r.cells[k]) || 0), 0);
  }
  cells["sum_3_11"] = detailRows.reduce((s, r) => s + (Number(r.cells["sum_3_11"]) || 0), 0);
  cells["local_prepay_11"] = detailRows.reduce((s, r) => s + (Number(r.cells["local_prepay_11"]) || 0), 0);

  return { key, rowType: "total", cells };
}

/** =======================
 *  6) schema -> Antd Table columns
 * ======================= */

function schemaToAntdColumns(schema: ColumnNode[]): any[] {
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
        if (n.valueType === "number") return formatNumber(v);
        // groupHeader 行只显示分公司名，其他列留空更清爽
        if (row.rowType === "groupHeader" && n.key !== "branch") return "";
        return v ?? "";
      },
      fixed: ["idx", "branch", "center", "code"].includes(n.key) ? "left" : undefined,
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

// async function exportReportToExcel(report: Report) {
//   const wb = new ExcelJS.Workbook();
//   wb.created = new Date();
//   const ws = wb.addWorksheet(report.meta?.title || "Report");
//
//   const leafs = flattenLeafColumns(report.schema).filter((c): c is Extract<ColumnNode, { type: "leaf" }> => c.type === "leaf");
//
//   // 计算表头层级（最多两层：group + leaf；若你未来要更多层，也可以扩展）
//   const hasGroup = report.schema.some((n) => n.type === "group");
//
//   // 第一行：group 标题（或 leaf 标题）
//   // 第二行：leaf 标题（若有 group）
//   const headerRow1: string[] = [];
//   const headerRow2: string[] = [];
//
//   // 为了做合并，需要知道每个 group 覆盖的列范围
//   type MergeInfo = { startCol: number; endCol: number; title: string };
//   const merges: MergeInfo[] = [];
//
//   let colIndex = 1;
//
//   for (const n of report.schema) {
//     if (n.type === "leaf") {
//       headerRow1.push(n.title);
//       if (hasGroup) headerRow2.push(""); // 对齐
//       colIndex += 1;
//       continue;
//     }
//
//     // group
//     const start = colIndex;
//     const leafCount = flattenLeafColumns([n]).filter((x) => x.type === "leaf").length;
//
//     headerRow1.push(n.title);
//     // group 的其它占位（Excel 需要补空单元格）
//     for (let i = 1; i < leafCount; i++) headerRow1.push("");
//
//     // 第二行填子列标题
//     const groupLeafs = flattenLeafColumns(n.children).filter((c): c is Extract<ColumnNode, { type: "leaf" }> => c.type === "leaf");
//     for (const lf of groupLeafs) headerRow2.push(lf.title);
//
//     const end = start + leafCount - 1;
//     merges.push({ startCol: start, endCol: end, title: n.title });
//
//     colIndex += leafCount;
//   }
//
//   // 写表头
//   if (hasGroup) {
//     ws.addRow(headerRow1);
//     ws.addRow(headerRow2);
//   } else {
//     ws.addRow(leafs.map((c) => c.title));
//   }
//
//   // 合并 group 表头
//   if (hasGroup) {
//     // 非 group 的 leaf 列，第一行要纵向合并（两行）
//     let c = 1;
//     for (const n of report.schema) {
//       if (n.type === "leaf") {
//         ws.mergeCells(1, c, 2, c);
//         c += 1;
//       } else {
//         const leafCount = flattenLeafColumns([n]).filter((x) => x.type === "leaf").length;
//         ws.mergeCells(1, c, 1, c + leafCount - 1);
//         c += leafCount;
//       }
//     }
//   }
//
//   // 设置列宽/格式
//   const allLeafsOrdered: Extract<ColumnNode, { type: "leaf" }>[] = [];
//   // 按 schema 顺序展平（而不是全局 leafs 的 DFS 顺序不一定一致）
//   const pushLeafsInOrder = (nodes: ColumnNode[]) => {
//     for (const node of nodes) {
//       if (node.type === "leaf") allLeafsOrdered.push(node);
//       else pushLeafsInOrder(node.children);
//     }
//   };
//   pushLeafsInOrder(report.schema);
//
//   allLeafsOrdered.forEach((col, i) => {
//     const xcol = ws.getColumn(i + 1);
//     xcol.width = col.width ? Math.max(8, Math.floor(col.width / 10)) : 14;
//     if (col.valueType === "number") {
//       xcol.numFmt = col.excel?.numFmt ?? "#,##0.00";
//     }
//     xcol.alignment = { vertical: "middle", horizontal: col.align ?? "left" };
//   });
//
//   // 表头样式
//   const headerRowsCount = hasGroup ? 2 : 1;
//   for (let r = 1; r <= headerRowsCount; r++) {
//     const row = ws.getRow(r);
//     row.height = 20;
//     row.eachCell((cell) => {
//       cell.font = { bold: true };
//       cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFEFEFEF" },
//       };
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });
//   }
//
//   // 写数据行
//   for (const r of report.rows) {
//     // 按列顺序取值
//     const values = allLeafsOrdered.map((c) => r.cells[c.key]);
//     const excelRow = ws.addRow(values);
//
//     // 行样式：总计/小计
//     if (r.rowType === "total") {
//       excelRow.font = { bold: true };
//       excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEBF7" } }; // 浅蓝
//     } else if (r.rowType === "subtotal") {
//       excelRow.font = { bold: true };
//       excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F4EA" } }; // 浅绿
//     } else if (r.rowType === "groupHeader") {
//       excelRow.font = { bold: true };
//       excelRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F7F7" } }; // 浅灰
//     }
//
//     excelRow.eachCell((cell) => {
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });
//   }
//
//   ws.views = [{ state: "frozen", xSplit: 4, ySplit: headerRowsCount }]; // 冻结：左4列+表头
//
//   const buf = await wb.xlsx.writeBuffer();
//   saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${report.meta?.title || "report"}.xlsx`);
// }

/** =======================
 *  8) DEMO 组件：组装 report -> 渲染 Table + 导出
 * ======================= */

export default function TaxStatistics() {
  const report = useMemo<Report>(() => {
    // 1) 动态抽取 months 并排序（从新到旧）
    const months = Array.from(new Set(mockApiData.map((x) => x.month)))
      .sort((a, b) => b.localeCompare(a));
    console.log('--------months', months)
    // 2) schema
    const schema = buildSchemaFromMonths(months);

    // 3) rows
    const rows = buildReportRows(mockApiData, months);

    return {
      meta: { title: "销项税额统计-DEMO", unit: "元" },
      schema,
      rows,
    };
  }, []);

  const columns = useMemo(() => schemaToAntdColumns(report.schema), [report.schema]);
  console.log('---------columns', columns)
  console.log('--------report.rows', report.rows);
  return (
    <div style={{ padding: 16 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Title level={4} style={{ margin: 0 }}>
          {report.meta?.title}
        </Title>
        <Button type="primary" onClick={() => {
          // exportReportToExcel(report)
        }}>
          导出 Excel
        </Button>
      </Space>

      <Table
        style={{ marginTop: 12 }}
        bordered
        size="small"
        columns={columns}
        dataSource={report.rows}
        rowKey="key"
        pagination={false}
        scroll={{ x: 1400 }}
        rowClassName={(row: ReportRow) => {
          if (row.rowType === "total") return "row-total";
          if (row.rowType === "subtotal") return "row-subtotal";
          if (row.rowType === "groupHeader") return "row-group";
          return "";
        }}
      />

      {/* 简单行样式 */}
      <style>{`
        .row-total td { font-weight: 700; background: #ddebf7 !important; }
        .row-subtotal td { font-weight: 700; background: #e6f4ea !important; }
        .row-group td { font-weight: 700; background: #f7f7f7 !important; }
      `}</style>
    </div>
  );
}
