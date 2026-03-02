import {useEffect, useImperativeHandle, useState } from 'react';
import {Table, Typography } from 'antd';
import {columns} from "./HumanResourceColumns";

const { Text } = Typography;

/**
 * 定义单独用户对象，运用对象的原理
 * 可以非常方便的计算 小计，总计
 */
class PersonnelItem {
  person_type: string;
  // 投入人员情况
  chinese_count_yy_1_1: number;
  foreign_count_yy_1_1: number;
  chinese_count_yy_1_2: number;
  foreign_count_yy_1_2: number;
  chinese_count_yy_1_3: number;
  foreign_count_yy_1_3: number;
  chinese_count_yy_1_t: number;
  foreign_count_yy_1_t: number;
  // 缺口人员情况
  chinese_count_yy_2_1: number;
  foreign_count_yy_2_1: number;
  chinese_count_yy_2_2: number;
  foreign_count_yy_2_2: number;
  chinese_count_yy_2_3: number;
  foreign_count_yy_2_3: number;
  chinese_count_yy_2_t: number;
  foreign_count_yy_2_t: number;

  constructor(personType: string) {
    this.person_type = personType;
    // 投入人员情况
    this.chinese_count_yy_1_1 = 0;
    this.foreign_count_yy_1_1 = 0;
    this.chinese_count_yy_1_2 = 0;
    this.foreign_count_yy_1_2 = 0;
    this.chinese_count_yy_1_3 = 0;
    this.foreign_count_yy_1_3 = 0;
    this.chinese_count_yy_1_t = 0;
    this.foreign_count_yy_1_t = 0;
    // 缺口人员情况
    this.chinese_count_yy_2_1 = 0;
    this.foreign_count_yy_2_1 = 0;
    this.chinese_count_yy_2_2 = 0;
    this.foreign_count_yy_2_2 = 0;
    this.chinese_count_yy_2_3 = 0;
    this.foreign_count_yy_2_3 = 0;
    this.chinese_count_yy_2_t = 0;
    this.foreign_count_yy_2_t = 0;

    this.calculateTotal();
  }

  // 计算“合计”列（小计）
  calculateTotal() {
    // 投入人员小计
    this.chinese_count_yy_1_t = this.chinese_count_yy_1_1 + this.chinese_count_yy_1_2 + this.chinese_count_yy_1_3;
    this.foreign_count_yy_1_t = this.foreign_count_yy_1_1 + this.foreign_count_yy_1_2 + this.foreign_count_yy_1_3;
    // 缺口人员小计
    this.chinese_count_yy_2_t = this.chinese_count_yy_2_1 + this.chinese_count_yy_2_2 + this.chinese_count_yy_2_3;
    this.foreign_count_yy_2_t = this.foreign_count_yy_2_1 + this.foreign_count_yy_2_2 + this.foreign_count_yy_2_3;
  }

  updateField(field: string, value: number) {
    // @ts-ignore
    this[field] = value;
    this.calculateTotal();
  }

  getField(field: string): number {
    // @ts-ignore
    return this[field]
  }
}

/**
 * 人力资源投入模块
 * @constructor
 */
const HumanResource = ({cRef, lastMonthRecord}: any) => {

  // 表格内数据
  const [dataSource, setDataSource] = useState(() => {
    return ['1', '2', '3', '4'].map(type => new PersonnelItem(type));
  })

  useEffect(() => {
    // 初始化上月的数据
    console.log('---lastMonthRecord.MonthlyHumanResource', lastMonthRecord.MonthlyHumanResource)
    if (lastMonthRecord && lastMonthRecord.MonthlyHumanResource) {
      dataSource.forEach(item => {
        const filterArr: any[] = lastMonthRecord.MonthlyHumanResource.filter(r => Number(r.person_type) === Number(item.person_type));
        filterArr.forEach(r => {
          const key = 'chinese_count' + "_yy_" + r.person_situation + "_" + r.person_category;
          Object.assign(item, {
            [key]: r.chinese_count,
          })
        })
      })
      dataSource.forEach(item => {
        const filterArr: any[] = lastMonthRecord.MonthlyHumanResource.filter(r => Number(r.person_type) === Number(item.person_type));
        filterArr.forEach(r => {
          const key = 'foreign_count' + "_yy_" + r.person_situation + "_" + r.person_category;
          Object.assign(item, {
            [key]: r.foreign_count,
          })
        })
      })
      console.log('-------dataSource', dataSource)
      setDataSource([...dataSource])
    }
  }, [lastMonthRecord]);


  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: () => {
        return dataSource
      }
    };
  });

  /**
   * 获取配置列
   * 根据 columns里的 valueType 渲染不同的组件展示
   */
  const getColumns = () => {
    const getCols = (arr: any[]) => {
      arr.forEach((item) => {
        //  小计的写法 一定要写成这样的，要不然虽然底层数据变化了，但是页面没变化
        if (item.valueType === 'total') {
          Object.assign(item, {
            render: (_: any, record: PersonnelItem) => (
              <Text>{record.getField(item.dataIndex)}</Text>
            )
          })
        }
        // 数值类型的展示
        if (item.valueType === 'number') {
          Object.assign(item, {
            render: (text: string, record: any) => {
              return (
                <Text>{record.getField(item.dataIndex)}</Text>
              )
            }
          })
        }
        if (item.children && item.children.length > 0) {
          getCols(item.children);
        }
      })
    }
    getCols(columns)
    return columns;
  }


  // 计算总计
  const calculateGrandTotal = () => {
    const total = {
      chinese_count_yy_1_1: 0,
      foreign_count_yy_1_1: 0,
      chinese_count_yy_1_2: 0,
      foreign_count_yy_1_2: 0,
      chinese_count_yy_1_3: 0,
      foreign_count_yy_1_3: 0,
      chinese_count_yy_1_t: 0,
      foreign_count_yy_1_t: 0,

      chinese_count_yy_2_1: 0,
      foreign_count_yy_2_1: 0,
      chinese_count_yy_2_2: 0,
      foreign_count_yy_2_2: 0,
      chinese_count_yy_2_3: 0,
      foreign_count_yy_2_3: 0,
      chinese_count_yy_2_t: 0,
      foreign_count_yy_2_t: 0,
    };
    dataSource.forEach(item => {
      total.chinese_count_yy_1_1 += item.getField('chinese_count_yy_1_1');
      total.foreign_count_yy_1_1 += item.getField('foreign_count_yy_1_1');
      total.chinese_count_yy_1_2 += item.getField('chinese_count_yy_1_2');
      total.foreign_count_yy_1_2 += item.getField('foreign_count_yy_1_2');
      total.chinese_count_yy_1_3 += item.getField('chinese_count_yy_1_3');
      total.foreign_count_yy_1_3 += item.getField('foreign_count_yy_1_3');
      total.chinese_count_yy_1_t += item.getField('chinese_count_yy_1_t');
      total.foreign_count_yy_1_t += item.getField('foreign_count_yy_1_t');

      total.chinese_count_yy_2_1 += item.getField('chinese_count_yy_2_1');
      total.foreign_count_yy_2_1 += item.getField('foreign_count_yy_2_1');
      total.chinese_count_yy_2_2 += item.getField('chinese_count_yy_2_2');
      total.foreign_count_yy_2_2 += item.getField('foreign_count_yy_2_2');
      total.chinese_count_yy_2_3 += item.getField('chinese_count_yy_2_3');
      total.foreign_count_yy_2_3 += item.getField('foreign_count_yy_2_3');
      total.chinese_count_yy_2_t += item.getField('chinese_count_yy_2_t');
      total.foreign_count_yy_2_t += item.getField('foreign_count_yy_2_t');
    });
    return total;
  };

  return (
    <div>
      <Table
        size="small"
        bordered
        scroll={{x: 2000}}
        dataSource={dataSource}
        // @ts-ignore
        columns={getColumns()}
        summary={pageData => {
          const grandTotal = calculateGrandTotal();
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center">总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"><Text>{grandTotal.chinese_count_yy_1_1}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><Text>{grandTotal.foreign_count_yy_1_1}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><Text>{grandTotal.chinese_count_yy_1_2}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"><Text>{grandTotal.foreign_count_yy_1_2}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><Text>{grandTotal.chinese_count_yy_1_3}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"><Text>{grandTotal.foreign_count_yy_1_3}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"><Text>{grandTotal.chinese_count_yy_1_t}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center"><Text>{grandTotal.foreign_count_yy_1_t}</Text></Table.Summary.Cell>

              <Table.Summary.Cell index={9} align="center"><Text>{grandTotal.chinese_count_yy_2_1}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={10} align="center"><Text>{grandTotal.foreign_count_yy_2_1}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={11} align="center"><Text>{grandTotal.chinese_count_yy_2_2}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={12} align="center"><Text>{grandTotal.foreign_count_yy_2_2}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={13} align="center"><Text>{grandTotal.chinese_count_yy_2_3}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={14} align="center"><Text>{grandTotal.foreign_count_yy_2_3}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={15} align="center"><Text>{grandTotal.chinese_count_yy_2_t}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={16} align="center"><Text>{grandTotal.foreign_count_yy_2_t}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  )
}

export default HumanResource;
