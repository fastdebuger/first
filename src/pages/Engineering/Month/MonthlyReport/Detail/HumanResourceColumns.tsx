import {PERSON_TYPE} from "@/common/const";

export const columns = [
  {
    title: '人员类别',
    dataIndex: 'person_type',
    align: 'center',
    width: 106,
    render: (text: string) => {
      if (text) {
        // @ts-ignore
        return PERSON_TYPE[text]
      }
      return '--'
    }
  },
  {
    title: '投入人员情况',
    children: [
      {
        title: '自有人员(合同化+市场化)',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_1_1',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_1_1',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '劳务用工人员',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_1_2',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_1_2',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '分包商人员',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_1_3',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_1_3',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '合计',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_1_t',
            align: 'center',
            width: 100,
            valueType: 'total',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_1_t',
            align: 'center',
            width: 100,
            valueType: 'total',
          },
        ]
      },
    ]
  },
  {
    title: '缺口人员情况',
    children: [
      {
        title: '自有人员(合同化+市场化)',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_2_1',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_2_1',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '劳务用工人员',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_2_2',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_2_2',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '分包商人员',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_2_3',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_2_3',
            align: 'center',
            width: 100,
            valueType: 'number',
          },
        ]
      },
      {
        title: '合计',
        children: [
          {
            title: '中方人员',
            dataIndex: 'chinese_count_yy_2_t',
            align: 'center',
            width: 100,
            valueType: 'total',
          },
          {
            title: '外方人员',
            dataIndex: 'foreign_count_yy_2_t',
            align: 'center',
            width: 100,
            valueType: 'total',
          },
        ]
      },
    ]
  },
];
