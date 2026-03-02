export const configColumns = [
  {
    title: '作业描述',
    dataIndex: 'description',
    key: 'description',
    width: 230,
    align: "center",
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
    render: (text: string, record: any) => {
      // 如果是父行且有子行，可以添加标记
      if (record.children && record.children.length > 0) {
        return <span>{text} ({record.children.length}项)</span>;
      }
      return text;
    }
  },
  // {
  //   title: '工程代码',
  //   dataIndex: 'contract_no',
  //   key: 'contract_no',
  //   onHeaderCell: () => ({
  //     style: { fontSize: '12px' }
  //   }),
  // },
  {
    title: '合同开工日期',
    dataIndex: 'contract_start_date_format',
    key: 'contract_start_date_format',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '合同完工日期',
    dataIndex: 'contract_end_date_format',
    key: 'contract_end_date_format',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '实际开工日期',
    dataIndex: 'actual_start_date_format',
    key: 'actual_start_date_format',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '预计完工日期',
    dataIndex: 'plan_finish_date_format',
    key: 'plan_finish_date_format',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '合同价款（万元）',
    dataIndex: 'contract_price',
    key: 'contract_price',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '合同类型',
    dataIndex: 'contract_mode_name',
    key: 'contract_mode_name',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '项目等级',
    dataIndex: 'project_level_name',
    key: 'project_level_name',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '已经累计完成(%)',
    dataIndex: 'cumulative_month_reality',
    key: 'cumulative_month_reality',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '本月计划(%)',
    dataIndex: 'next_month_plan',
    key: 'next_month_plan',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '月计划产值（万元）',
    dataIndex: 'output_value',
    key: 'output_value',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
  {
    title: '计划形象进度描述',
    dataIndex: 'progress_desc',
    key: 'progress_desc',
    onHeaderCell: () => ({
      style: { fontSize: '12px' }
    }),
  },
];