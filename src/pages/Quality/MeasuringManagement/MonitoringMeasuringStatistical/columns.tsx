// columns.tsx
export const StatisticalColumns = [
  {
    title: '本月设备数量',
    children: [
      {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
        width: 100,
        fixed: 'left',
        render: (text: string, record: any) => {
          if (record.rowType === 'subtotal' || record.rowType === 'total') {
            return text;
          }
          if (record.rowType === 'first') {
            return { children: text, props: { rowSpan: 3 } };
          }
          return { children: '', props: { rowSpan: 0 } };
        },
      },
      {
        title: '',
        dataIndex: 'level',
        key: 'level',
        width: 60,
        align: 'center',
        render: (text: string) => text || '',
      },
      {
        title: '台（件）数',
        dataIndex: 'deviceCount',
        key: 'deviceCount',
        width: 100,
        align: 'center',
      },
    ],
  },
  {
    title: '本月设备检定情况',
    children: [
      { 
        title: '应检数', 
        dataIndex: 'requiredInspections', 
        key: 'requiredInspections', 
        width: 90, 
        align: 'center' 
      },
      { 
        title: '实检数', 
        dataIndex: 'actualInspections', 
        key: 'actualInspections', 
        width: 90, 
        align: 'center' 
      },
      { 
        title: '合格数', 
        dataIndex: 'qualifiedInspections', 
        key: 'qualifiedInspections', 
        width: 90, 
        align: 'center' 
      },
    ],
  },
  { 
    title: '本月新增设备数量', 
    dataIndex: 'newAdded', 
    key: 'newAdded', 
    width: 120, 
    align: 'center' 
  },
  { 
    title: '本月报废设备数量', 
    dataIndex: 'scrapped', 
    key: 'scrapped', 
    width: 120, 
    align: 'center' 
  },
  { 
    title: '本月封存设备数量', 
    dataIndex: 'sealed', 
    key: 'sealed', 
    width: 120, 
    align: 'center' 
  },
  { 
    title: '本月启封后启用设备数量', 
    dataIndex: 'unsealed', 
    key: 'unsealed', 
    width: 140, 
    align: 'center' 
  },
  { 
    title: '本月转移设备数量', 
    dataIndex: 'transferred', 
    key: 'transferred', 
    width: 120, 
    align: 'center' 
  },
];