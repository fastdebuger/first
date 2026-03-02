import {PERSON_TYPE} from "@/common/const";

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
    title: '上周累计（%）',
    children: [
      {
        title: '计划',
        dataIndex: 'last_week_plan',
        align: 'center',
        width: 100,
        valueType: 'number',
        disabled: true,
      },
      {
        title: '实际',
        dataIndex: 'last_week_reality',
        align: 'center',
        width: 100,
        valueType: 'number',
        disabled: true,
      },
      {
        title: '差值',
        dataIndex: 'last_week_difference',
        align: 'center',
        width: 100,
        valueType: 'cha',
      },
    ]
  },
  {
    title: '本周累计（%）',
    children: [
      {
        title: '计划',
        dataIndex: 'curr_week_plan',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '实际',
        dataIndex: 'curr_week_reality',
        align: 'center',
        width: 100,
        valueType: 'number',
      },
      {
        title: '差值',
        dataIndex: 'curr_week_difference',
        align: 'center',
        width: 100,
        valueType: 'cha',
      },
    ]
  },
];
