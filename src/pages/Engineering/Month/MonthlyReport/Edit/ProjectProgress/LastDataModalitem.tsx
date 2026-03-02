import { Table, Typography } from "antd";
import React, { useEffect, useState } from 'react';
import ProjectProgressItem from "@/pages/Engineering/Month/MonthlyReport/Common/ProjectProgressItem";

const { Text } = Typography;

const LastDataModalItem = (props: any) => {

  const { lastMonthRecord } = props;
  const [dataSource, setDataSource] = useState(() => {
    return ['设计', '采购', '施工', '试运'].map(type => new ProjectProgressItem(type));
  })

  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlyProProgress) {
      const {monthlyEngineeringPhaseList} = lastMonthRecord.MonthlyProProgress;
      if (monthlyEngineeringPhaseList && monthlyEngineeringPhaseList.length > 0) {
        // dataSource
        if (monthlyEngineeringPhaseList && monthlyEngineeringPhaseList.length > 0) {
          dataSource.forEach(item => {
            const findObj = monthlyEngineeringPhaseList.find(r => r.phase === item.phase)
            if (findObj) Object.assign(item, findObj);
          })
          setDataSource([...dataSource]);
        }
      }
    }
  }, []);

  const lastColumns = [
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
          title: '下月计划（%）',
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
          title: '下月计划产值（万元）',
          dataIndex: 'next_month_output',
          align: 'center',
          width: 100,
          valueType: 'number',
        },
      ]
    },
  ]

  /**
   * 获取配置列
   * 根据 columns里的 valueType 渲染不同的组件展示
   */
  const getColumns = () => {

    const getCols = (arr: any[]) => {
      arr.forEach((item) => {
        Object.assign(item, {
          render: (_: any, record: ProjectProgressItem) => (
            <Text>{record.getField(item.dataIndex)}</Text>
          )
        })
        // if (['next_month_plan', 'next_month_output'].includes(item.dataIndex)) {
        //   Object.assign(item, {
        //     title: item.title.replace('（）', `（${nextMonthNumber}）`)
        //   })
        // }
        if (item.children && item.children.length > 0) {
          getCols(item.children);
        }
      })
    }
    getCols(lastColumns)
    return lastColumns;
  }

  const calculateGrandTotal = () => {
    const total = {
      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,
      total6: 0,
      total7: 0,
      total8: 0,
      total9: 0,
    }

    dataSource.forEach(item => {
      total.total1 += item.getField('weight');
      total.total2 += (item.getField('curr_month_plan'));
      total.total3 += (item.getField('curr_month_reality'));
      total.total4 += (item.getField('curr_month_difference'));
      total.total5 += (item.getField('curr_month_plan_output'));
      total.total6 += (item.getField('curr_month_reality_output'));
      total.total7 += (item.getField('next_month_plan'));
      total.total8 += (item.getField('cumulative_plan'));
      total.total9 += (item.getField('next_month_output'));
    })
    return total;
  }


  return (
    <Table
      style={{marginTop: 16}}
      size="small"
      bordered
      scroll={{x: 1000}}
      dataSource={dataSource}
      columns={[
        // @ts-ignore
        ...getColumns(),
      ]}
      pagination={false}
      summary={pageData => {
        const grandTotal = calculateGrandTotal();
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} align="center">总计</Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center"><Text>{grandTotal.total1}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center"><Text>{grandTotal.total2.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center"><Text>{grandTotal.total3.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center"><Text>{grandTotal.total4.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="center"><Text>{grandTotal.total5.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="center"><Text>{grandTotal.total6.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={7} align="center"><Text>{grandTotal.total7.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={8} align="center"><Text>{grandTotal.total8.toFixed(2)}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={9} align="center"><Text>{grandTotal.total9.toFixed(2)}</Text></Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  )
}

export default LastDataModalItem;
