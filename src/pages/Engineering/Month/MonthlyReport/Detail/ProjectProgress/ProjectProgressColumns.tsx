export const columns = [
  {
    title: '工程阶段',
    dataIndex: 'phase',
    align: 'center',
    width: 120,
  },
  {
    title: '权重（%）',
    dataIndex: 'weight',
    align: 'center',
    width: 120,
    valueType: 'number',
  },
  {
    title: '本月完成',
    children: [
      {
        title: '计划（%）',
        dataIndex: 'curr_month_plan',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '实际（%）',
        dataIndex: 'curr_month_reality',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '自开工累计（%）',
        dataIndex: 'cumulative_reality',
        align: 'center',
        width: 100,
        valueType: 'cha',
      },
      {
        title: '差值',
        dataIndex: 'curr_month_difference',
        align: 'center',
        width: 100,
        valueType: 'cha',
      },
      {
        title: '本月计划产值（万元）',
        dataIndex: 'curr_month_plan_output',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '本月实际完成产值（万元）',
        dataIndex: 'curr_month_reality_output',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
    ]
  },
  {
    title: '下月计划',
    children: [
      {
        title: '（）月计划（%）',
        dataIndex: 'next_month_plan',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '累计计划（%）',
        dataIndex: 'cumulative_plan',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '（）月计划产值（万元）',
        dataIndex: 'next_month_output',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
    ]
  },
];
