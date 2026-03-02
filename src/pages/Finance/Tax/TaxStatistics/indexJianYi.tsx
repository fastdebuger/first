import React, { useEffect } from "react";
import { Button, Table, Typography, Space, Empty, Skeleton, DatePicker, Alert } from "antd";
import { queryTaxStatistics } from "@/services/finance/taxBook";
import {buildReportRows, buildSchemaFromMonths, exportReportToExcel, schemaToAntdColumns} from "@/utils/utils-tax";
import {queryAccountingValueAddeddConfig} from "@/services/finance/taxConfig";
import moment from "moment";
import {queryFormula, updateFormula} from "@/services/finance/base";

const { Title } = Typography;
const { RangePicker } = DatePicker;

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
 *  8) DEMO 组件：组装 report -> 渲染 Table + 导出
 * ======================= */

export default function TaxStatistics() {

  const [report, setReport] = React.useState<Report>({});
  const [columns, setColumns] = React.useState<ColumnNode[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [startMonth, setStartMonth] = React.useState<any>(moment().subtract(1, 'month'));
  const [endMonth, setEndMonth] = React.useState<any>(moment());
  const [randomKey, setRandomKey] = React.useState(0);

  const fetchList = async () => {
    setLoading(true);
    const resFormula: any = await queryFormula({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'module', Val: '简易计税合计', Operator: '='},
        {Key: 'field', Val: '应纳税额', Operator: '='},
      ])
    })
    const _formulaField = resFormula.rows.length > 0 ? resFormula.rows[0] : null;
    const formulaField = {};
    if (_formulaField) {
      try {
        const parse = JSON.parse(_formulaField.content);
        formulaField['应纳税额'] = parse;
        formulaField['上期留底'] = parse;
      } catch (e) {

      }
    }
    ;
    const resConfig = await queryAccountingValueAddeddConfig({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'type', Val: '简易计税合计', Operator: '='}
      ])
    })
    const configList: any[] = resConfig.rows || [];
    const res: any[] = await queryTaxStatistics({
      sort: 'month',
      order: 'asc',
      startMonth: startMonth.format('YYYY-MM'),
      endMonth: endMonth.format('YYYY-MM'),
      type: '简易计税合计'
    })
    setLoading(false);
    if(configList.length > 0) {
      const result: any[] = [];
      res.forEach(r => {
        const map: any = {};
        configList.forEach(item => {
          map[item.value_added_tax_item] = r[item.total_field_name];
        })
        result.push({
          branchName: r.branch_name,
          centerName: r.dep_name,
          code: r.profit_center_code,
          month: r.month,
          ...map,
        },)
      })
      // 0) 根据配置 获取展示值的属性名：比如要展示的是 {销项税额: {}， 当地预交税金： {}}
      const showMap: any = {};
      configList.forEach(item => {
        showMap[item.value_added_tax_item] = {};
      })
      // 1) 动态抽取 months 并排序（从新到旧）
      const months = Array.from(new Set(result.map((x) => x.month)))
        .sort((a, b) => b.localeCompare(a));

      // 2) schema
      const schema = buildSchemaFromMonths(months, showMap);

      // 3) rows
      const rows = buildReportRows(result, months, showMap, formulaField);

      const _report = {
        meta: { title: "进销平衡台账（简易计税合计）", unit: "元" },
        schema,
        rows,
      }

      setReport(_report) ;
      const columns = () => schemaToAntdColumns(_report.schema);
      setColumns(columns);

      console.log("dataSource", _report.rows);
      console.log("columns", columns);
    }
  }

  useEffect(() => {
    fetchList()
  }, [randomKey])

  return (
    <Skeleton loading={loading}>
      {columns.length > 0 ? (
        <>
          <div style={{ padding: 16 }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Title level={4} style={{ margin: 0 }}>
                {report.meta?.title}
              </Title>
              <Button type="primary" onClick={() => {
                exportReportToExcel(report)
              }}>
                导出 Excel
              </Button>
            </Space>
            <Space align="baseline">
              <Alert style={{height: 32}} type="info" message={`当前月份：${moment().format('YYYY-MM')}`} />
              <RangePicker
                style={{ marginTop: 12 }}
                value={[startMonth, endMonth]}
                picker="month"
                onChange={(date: any[], dateString) => {
                  if (date) {
                    setStartMonth(date[0]);
                    setEndMonth(date[1]);
                  } else {
                    setStartMonth(moment().subtract(1, 'month'));
                    setEndMonth(moment());
                  }
                }}
                onOpenChange={(open) => {
                  if (!open) setRandomKey(Math.random());
                }}
              />
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
        </>
        ) : (
        <Empty/>
      )}
    </Skeleton>
  );
}
