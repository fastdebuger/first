import { ColumnsType } from 'antd/es/table';

/**
 * 获取分公司表格列
 * @param dataSource 表格数据源，用于计算单元格合并
 * @returns 表格列配置
 */
export const getBranchCompanyColumns = (dataSource: any[]): ColumnsType<any> => {
  // 计算每个分公司的行数，用于单元格合并
  const branchRowCountMap = new Map<string, number>();
  const branchFirstIndexMap = new Map<string, number>();

  dataSource.forEach((item: any, index: number) => {
    if (item.branchCompany && item.branchCompany !== '合计') {
      const branchName = item.branchCompany;
      if (!branchFirstIndexMap.has(branchName)) {
        branchFirstIndexMap.set(branchName, index);
      }
      branchRowCountMap.set(branchName, (branchRowCountMap.get(branchName) || 0) + 1);
    }
  });

  return [
    {
      title: '分公司',
      dataIndex: 'branchCompany',
      key: 'branchCompany',
      width: 200,
      align: 'center',
      onCell: (record: any, index: number) => {
        // 合计行不合并
        if (record.branchCompany === '合计') {
          return { rowSpan: 1 };
        }

        const firstIndex = branchFirstIndexMap.get(record.branchCompany);
        const rowCount = branchRowCountMap.get(record.branchCompany) || 0;

        // 如果是该分公司的第一条数据，合并 rowCount 行
        if (firstIndex !== undefined && index === firstIndex) {
          return { rowSpan: rowCount };
        }

        // 其他行隐藏
        return { rowSpan: 0 };
      },
    },
    {
      title: '时间段',
      dataIndex: 'timePeriod',
      key: 'timePeriod',
      width: 200,
      align: 'center',
      onCell: (record: any, index: number) => {
        // 合计行不合并
        if (record.branchCompany === '合计') {
          return { rowSpan: 1 };
        }

        const firstIndex = branchFirstIndexMap.get(record.branchCompany);
        const rowCount = branchRowCountMap.get(record.branchCompany) || 0;

        // 如果是该分公司的第一条数据，合并 rowCount 行
        if (firstIndex !== undefined && index === firstIndex) {
          return { rowSpan: rowCount };
        }

        // 其他行隐藏
        return { rowSpan: 0 };
      },
    },
    {
      title: '问题类型',
    dataIndex: 'problemType',
    key: 'problemType',
    width: 120,
    align: 'center',
  },
  {
    title: '问题总数',
    dataIndex: 'totalProblems',
    key: 'totalProblems',
    width: 100,
    align: 'center',
  },
  {
    title: '较大及以上问题数量',
    dataIndex: 'levelNum',
    key: 'levelNum',
    width: 150,
    align: 'center',
  },
  ];
};

/**
 * 原有表格列
 */
export const columns: ColumnsType<any> = [
  {
    title: '问题类型',
    dataIndex: 'problemType',
    key: 'problemType',
    width: 120,
    align: 'center',
  },
  {
    title: '时间段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    width: 200,
    align: 'center',
  },
  {
    title: '问题总数',
    dataIndex: 'totalProblems',
    key: 'totalProblems',
    width: 100,
    align: 'center',
  },
  {
    title: '轻微问题数量',
    dataIndex: 'severityLevelNum3',
    key: 'severityLevelNum3',
    width: 120,
    align: 'center',
  },
  {
    title: '一般问题数量',
    dataIndex: 'severityLevelNum2',
    key: 'severityLevelNum2',
    width: 120,
    align: 'center',
  },
  {
    title: '较大问题数量',
    dataIndex: 'severityLevelNum1',
    key: 'severityLevelNum1',
    width: 120,
    align: 'center',
  },
  {
    title: '严重问题数量',
    dataIndex: 'severityLevelNum0',
    key: 'severityLevelNum0',
    width: 120,
    align: 'center',
  },
];

