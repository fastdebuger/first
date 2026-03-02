import { ColumnsType } from 'antd/es/table';

/**
 * 表格列配置
 */
export const columns: ColumnsType<any> = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    width: 80,
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
    title: '分公司',
    dataIndex: 'branchCompany',
    key: 'branchCompany',
    width: 150,
    align: 'center',
  },
  {
    title: '项目部',
    dataIndex: 'projectDepartment',
    key: 'projectDepartment',
    width: 150,
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
    title: '质量类',
    children: [
      {
        title: '问题总数',
        dataIndex: 'qualityTotal',
        key: 'qualityTotal',
        width: 100,
        align: 'center',
      },
      {
        title: '质量管理类',
        dataIndex: 'qualityManagement',
        key: 'qualityManagement',
        width: 120,
        align: 'center',
      },
      {
        title: '质量实体类',
        dataIndex: 'qualityEntity',
        key: 'qualityEntity',
        width: 120,
        align: 'center',
      },
    ],
  },
  {
    title: 'HSE类',
    children: [
      {
        title: '问题总数',
        dataIndex: 'hseTotal',
        key: 'hseTotal',
        width: 100,
        align: 'center',
      },
      {
        title: '安全管理类',
        dataIndex: 'safetyManagement',
        key: 'safetyManagement',
        width: 120,
        align: 'center',
      },
      {
        title: '作业行为类',
        dataIndex: 'operationBehavior',
        key: 'operationBehavior',
        width: 120,
        align: 'center',
      },
    ],
  },
];

