import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Card, Typography, DatePicker, Button, Space, message } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { create, all } from 'mathjs';
import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';
import {
  queryRiskAnalysisInfo,
} from '@/services/enterpriseRisk/projectRiskGovernance';

import {
  getInfo,
} from '@/services/enterpriseRisk/riskCategoryConfig';
import dayjs from 'dayjs';

const { Text } = Typography;

/**
 * 项目风险评估结果
 * @returns 
 */
const ProjectRiskAssessment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tempYear, setTempYear] = useState<number>(dayjs().year());
  const [searchYear, setSearchYear] = useState<number>(dayjs().year());

  const [rawData, setRawData] = useState<any[]>([]);
  const [categoryConfig, setCategoryConfig] = useState<any[]>([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取数据与配置
  const handleFetchData = useCallback(async (targetYear: number, page: number, size: number) => {
    setLoading(true);
    const calculatedOffset = (page - 1) * size + 1;

    try {
      // 请求：1. 风险明细数据  2. 表头配置数据
      const [resInfo, resConfig] = await Promise.all([
        queryRiskAnalysisInfo({
          offset: calculatedOffset,
          limit: size,
          sort: "weight",
          order: "desc",
          filter: JSON.stringify([
            { Key: 'create_date_str', Val: targetYear + "%", Operator: 'like' },
          ])
        }),
        getInfo({
          sort: 'id',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'risk_category_type', Val: 2, Operator: '=' },
          ])
        })
      ]);

      // 1. 处理分类配置：过滤 risk_category_type = 2
      const filteredConfigs = (resConfig?.rows || resConfig || []).filter(
        (item: any) => item.risk_category_type === 2
      );
      setCategoryConfig(filteredConfigs);

      // 2. 处理明细行数据
      const rows = resInfo?.rows || [];
      setRawData(rows);
      setPagination(prev => ({ ...prev, current: page, pageSize: size, total: resInfo.total || 0 }));
      setSearchYear(targetYear);
    } catch (error) {
      message.error("数据或配置获取失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchData(searchYear, pagination.current!, pagination.pageSize!);
  }, []);


  // 初始化 mathjs，配置精度以避免 0.1+0.2 !== 0.3 的问题
  const math = create(all, {
    number: 'BigNumber',
    precision: 64
  });

  const pageSummary = useMemo(() => {
    if (rawData.length === 0 || categoryConfig.length === 0) return null;

    const summaryResults: Record<number, { p: string, i: string }> = {};

    categoryConfig.forEach((config) => {
      const code = config.id;

      // 按权重分组存储
      const weightGroups: Record<string, { pSum: any, iSum: any, rowCount: number }> = {};

      rawData.forEach(item => {
        const w = (item.weight || 0).toFixed(2);
        if (!weightGroups[w]) {
          weightGroups[w] = { pSum: math.bignumber(0), iSum: math.bignumber(0), rowCount: 0 };
        }

        // 只有分类匹配时才累加分数
        if (item.risk_category === code) {
          weightGroups[w].pSum = math.add(weightGroups[w].pSum, math.bignumber(item.risk_possibility || 0));
          weightGroups[w].iSum = math.add(weightGroups[w].iSum, math.bignumber(item.risk_incidence || 0));
        }

        // 分母是当前页中属于该权重组的所有行数
        weightGroups[w].rowCount += 1;
      });

      // 2. 执行公式 Σ( (组内总分 * 权重) / 组内总行数 )
      let finalP: any = math.bignumber(0);
      let finalI: any = math.bignumber(0);

      Object.keys(weightGroups).forEach((weightStr) => {
        const group = weightGroups[weightStr];
        const weight = math.bignumber(weightStr);
        const count = math.bignumber(group.rowCount);

        if (group.rowCount > 0) {
          const pTerm = math.divide(math.multiply(group.pSum, weight), count);
          const iTerm = math.divide(math.multiply(group.iSum, weight), count);

          finalP = math.add(finalP, pTerm);
          finalI = math.add(finalI, iTerm);
        }
      });

      summaryResults[code] = {
        p: math.format(finalP, { notation: 'fixed', precision: 3 }),
        i: math.format(finalI, { notation: 'fixed', precision: 3 })
      };
    });

    return summaryResults;
  }, [rawData, categoryConfig]);

  const columns: ColumnsType<any> = useMemo(() => {
    const base: ColumnsType<any> = [
      { title: '序号', dataIndex: 'RowNumber', width: 70, align: 'center', fixed: 'left' },
      { title: '项目部', dataIndex: 'wbs_name', width: 180, ellipsis: true, align: 'center', fixed: 'left' },
      { title: '项目名称', dataIndex: 'project_name', width: 150, ellipsis: true, align: 'center', fixed: 'left' },
      { title: '用户', dataIndex: 'user_name', align: 'center', width: 120, fixed: 'left', render: (v) => v || "-" },
      { title: '权重', dataIndex: 'weight', width: 80, align: 'center', fixed: 'left', render: (v) => v?.toFixed(2) },
    ];

    const dynamic = categoryConfig.map((config) => ({
      title: config.category_name,
      children: [
        {
          title: '可能性',
          width: 90,
          align: 'center' as const,
          render: (_: any, record: any) => record.risk_category === config.id ? record.risk_possibility : '-'
        },
        {
          title: '影响程度',
          width: 90,
          align: 'center' as const,
          render: (_: any, record: any) => record.risk_category === config.id ? record.risk_incidence : '-'
        },
      ],
    }));

    return [...base, ...dynamic];
  }, [categoryConfig]);

  // footer渲染
  const renderSummary = () => {
    if (!pageSummary || categoryConfig.length === 0) return null;

    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
          <Table.Summary.Cell index={0} colSpan={5} align="right">
            <Text strong>最终评分 (P/I)</Text>
          </Table.Summary.Cell>

          {categoryConfig.map((config, i) => (
            <React.Fragment key={`summary-pi-${config.id}`}>
              <Table.Summary.Cell index={5 + i * 2} align="center">
                <Text type="secondary" style={{ fontSize: '10px' }}>P:</Text>
                {pageSummary[config.id]?.p || '0.000'}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6 + i * 2} align="center">
                <Text type="secondary" style={{ fontSize: '10px' }}>I:</Text>
                {pageSummary[config.id]?.i || '0.000'}
              </Table.Summary.Cell>
            </React.Fragment>
          ))}
        </Table.Summary.Row>

        <Table.Summary.Row style={{ backgroundColor: '#f0f5ff' }}>
          <Table.Summary.Cell index={0} colSpan={5} align="right">
            <Text strong type="danger">最终风险值 (R = P × I)</Text>
          </Table.Summary.Cell>

          {categoryConfig.map((config, i) => {
            const p = pageSummary[config.id]?.p || '0';
            const iVal = pageSummary[config.id]?.i || '0';

            const rValue = math.multiply(math.bignumber(p), math.bignumber(iVal));
            const rStr = math.format(rValue, { notation: 'fixed', precision: 3 });

            return (
              <Table.Summary.Cell
                key={`summary-r-${config.id}`}
                index={5 + i * 2}
                colSpan={2}
                align="center"
              >
                <Text strong style={{ color: '#1890ff' }}>
                  {rStr}
                </Text>
              </Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
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
   * 导出Excel函数
   * 处理动态列配置的导出
   */
  const handleExport = async () => {
    try {
      // 检查数据与配置
      if (!categoryConfig || categoryConfig.length === 0) {
        message.warning('暂无分类配置，无法导出');
        return;
      }

      setLoading(true);

      const allColumns = columns;
      if (!allColumns || allColumns.length === 0) {
        message.warning('暂无列配置，无法导出');
        setLoading(false);
        return;
      }

      const allLeafsOrdered = flattenLeafColumns(allColumns);

      const wb = new ExcelJS.Workbook();
      wb.created = new Date();
      const ws = wb.addWorksheet('项目风险评估结果');

      const hasGroup = allColumns.some((col: any) => col.children && col.children.length > 0);

      // --- 构建表头数据 ---
      const headerRow1: any[] = [];
      const headerRow2: any[] = [];
      let colIndex = 1;

      for (const col of allColumns) {
        const colAny = col as any;
        if (colAny.children && colAny.children.length > 0) {
          const start = colIndex;
          const leafCount = flattenLeafColumns([colAny]).length;
          headerRow1.push(String(colAny.title || ''));
          for (let i = 1; i < leafCount; i++) headerRow1.push('');

          const groupLeafs = flattenLeafColumns(colAny.children);
          for (const lf of groupLeafs) {
            headerRow2.push(String(lf.title || ''));
          }
          colIndex += leafCount;
        } else {
          headerRow1.push(String(colAny.title || ''));
          if (hasGroup) headerRow2.push('');
          colIndex += 1;
        }
      }

      if (hasGroup) {
        ws.addRow(headerRow1);
        ws.addRow(headerRow2);
      } else {
        ws.addRow(allLeafsOrdered.map((c) => String(c.title || '')));
      }

      if (hasGroup) {
        let c = 1;
        for (let i = 0; i < allColumns.length; i++) {
          const col = allColumns[i] as any;
          if (col.children && col.children.length > 0) {
            ws.mergeCells(1, c, 1, c + col.children.length - 1);
            c += col.children.length;
          } else {
            ws.mergeCells(1, c, 2, c);
            c += 1;
          }
        }
      }

      // --- 设置列宽 ---
      allLeafsOrdered.forEach((col, i) => {
        const xcol = ws.getColumn(i + 1);
        const titleLength = String(col.title).length * 2.5;
        const definedWidth = col.width ? Math.floor(col.width / 6) : 12;
        xcol.width = Math.max(titleLength, definedWidth, 12);
      });

      // 设置表头通用样式 (已移除 fill)
      const headerRowsCount = hasGroup ? 2 : 1;
      for (let r = 1; r <= headerRowsCount; r++) {
        const row = ws.getRow(r);
        row.height = 30;
        row.eachCell((cell) => {
          // 这里不再设置 cell.fill
          cell.font = { bold: true, size: 10 };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
          };
        });
      }

      // --- 写入数据行 ---
      rawData.forEach((item: any) => {
        const values = allLeafsOrdered.map((c, idx) => {
          if (idx < 5) {
            const val = item[c.dataIndex];
            if (c.dataIndex === 'weight') return typeof val === 'number' ? val.toFixed(2) : val;
            return val ?? '-';
          }
          const dynamicIdx = idx - 5;
          const cat = categoryConfig[Math.floor(dynamicIdx / 2)];
          if (item.risk_category === cat.id) {
            return dynamicIdx % 2 === 0 ? (item.risk_possibility ?? '-') : (item.risk_incidence ?? '-');
          }
          return '-';
        });
        const dataRow = ws.addRow(values);
        dataRow.height = 22;
        dataRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
          };
        });
      });

      // --- 写入并合并合计行 ---
      if (pageSummary && categoryConfig.length > 0) {
        const summary1 = allLeafsOrdered.map((_, idx) => {
          if (idx === 0) return '最终评分 (P/I)';
          if (idx < 5) return '';
          const dIdx = idx - 5;
          const conf = categoryConfig[Math.floor(dIdx / 2)];
          const val = dIdx % 2 === 0 ? pageSummary[conf.id]?.p : pageSummary[conf.id]?.i;
          return `${dIdx % 2 === 0 ? 'P:' : 'I:'} ${val || '0.000'}`;
        });
        const sRow1 = ws.addRow(summary1);
        ws.mergeCells(sRow1.number, 1, sRow1.number, 5);

        const summary2 = allLeafsOrdered.map((_, idx) => {
          if (idx === 0) return '最终风险值 (R = P × I)';
          if (idx < 5) return '';
          const dIdx = idx - 5;
          const conf = categoryConfig[Math.floor(dIdx / 2)];
          if (dIdx % 2 === 0) {
            const r = math.multiply(math.bignumber(pageSummary[conf.id]?.p || 0), math.bignumber(pageSummary[conf.id]?.i || 0));
            return math.format(r, { notation: 'fixed', precision: 3 });
          }
          return '';
        });
        const sRow2 = ws.addRow(summary2);
        ws.mergeCells(sRow2.number, 1, sRow2.number, 5);
        categoryConfig.forEach((_, i) => ws.mergeCells(sRow2.number, 6 + i * 2, sRow2.number, 7 + i * 2));

        [sRow1, sRow2].forEach((row) => {
          row.height = 28;
          row.font = { bold: true };
          row.eachCell((cell, colNumber) => {
            // 这里不再设置 cell.fill
            cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'right' : 'center' };
            cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' },
              bottom: { style: 'thin' }, right: { style: 'thin' },
            };
          });
        });
      }

      ws.views = [{ state: 'frozen', xSplit: 5, ySplit: headerRowsCount }];

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `风险评估结果_${searchYear}_${dayjs().format('YYYYMMDD')}.xlsx`);
      message.success('导出成功');
    } catch (error) {
      console.error(error);
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="项目风险评估结果"
      bordered={false}
      bodyStyle={{
        overflowY: "auto",
        height:"calc(100vh - 180px)"
      }}
      extra={
        <Space>
          <DatePicker
            picker="year"
            // @ts-ignore
            value={dayjs(`${tempYear}-01-01`)}
            onChange={(d) => d && setTempYear(d.year())}
            allowClear={false}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleFetchData(tempYear, 1, pagination.pageSize!)}
          >
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => handleFetchData(searchYear, pagination.current!, pagination.pageSize!)}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={rawData}
        rowKey="RowNumber"
        bordered
        size="small"
        scroll={{ x: 'max-content', y: "auto" }}
        pagination={{
          ...pagination,
          onChange: (page, size) => handleFetchData(searchYear, page, size),
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条明细记录`,
        }}
        summary={renderSummary}
      />
    </Card>
  );
};

export default ProjectRiskAssessment;