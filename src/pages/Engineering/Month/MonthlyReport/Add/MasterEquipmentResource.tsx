import {useEffect, useImperativeHandle, useState } from 'react';
import { Table, Typography } from 'antd';
import { columns } from './MasterEquipmentResourceColumns';
import AddInputNumber from "@/pages/Engineering/Month/MonthlyReport/Common/AddInputNumber";
import AddInput from "@/pages/Engineering/Month/MonthlyReport/Common/AddInput";

const { Text } = Typography;

class EquipmentItem {
  equipment_type: string; // 设备分类
  equipment_name: string; // 设备名称
  equipment_index: number; // 设备排序
  own_equipment_count: number; // 自有/台(套)
  leasing_equipment_count: number; // 租赁/台(套)
  leasing_company: string; //  租赁公司
  shared_equipment_count: number; // 共享/台(套)
  shared_company: string; // 共享单位
  remark: string; // 备注

  constructor(equipmentType: string, equipmentName: string, index: number) {
    this.equipment_type = equipmentType;
    this.equipment_name = equipmentName;
    this.equipment_index = index + 1;
    this.own_equipment_count = 0;
    this.leasing_equipment_count = 0;
    this.leasing_company = '';
    this.shared_equipment_count = 0;
    this.shared_company = '';
    this.remark = '';
  }

  updateField(dataIndex: string, value: number | string) {
    // @ts-ignore
    this[dataIndex] = value;
  }

  getField(dataIndex: string) {
    // @ts-ignore
    return this[dataIndex];
  }
}

/**
 * 主要设备资源录入
 * @constructor
 */
const MasterEquipmentResource = ({ cRef, lastMonthRecord }: any) => {

  const [dataSource, setDataSource] = useState<any[]>(() => {
    return ['起重机', '挖掘机', '发电机组', '高空作业平台', '空气压缩机', '其他通用设备'].map((name, index) => new EquipmentItem('通用设备', name, index));
  })

  const [dataSource2, setDataSource2] = useState<any[]>(() => {
    return ['吊管机', '水平定向钻机', '直辅管机、盾构机', '管道全自动焊接设备', '其他专用设备'].map((name, index) => new EquipmentItem('管道专用设备', name, index));
  })

  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlyEquipments) {
      console.log("lastMonthRecord.MonthlyEquipments", lastMonthRecord.MonthlyEquipments);
      const filterArr1 = lastMonthRecord.MonthlyEquipments.filter(r => r.equipment_type === '通用设备')
      dataSource.forEach(item => {
        const findObj = filterArr1.find(r => (r.equipment_name === item.equipment_name && r.equipment_index === item.equipment_index));
        if (findObj) Object.assign(item, findObj);
      })
      setDataSource([...dataSource])
      const filterArr2 = lastMonthRecord.MonthlyEquipments.filter(r => r.equipment_type === '管道专用设备')
      dataSource2.forEach(item => {
        const findObj = filterArr2.find(r => (r.equipment_name === item.equipment_name && r.equipment_index === item.equipment_index));
        if (findObj) Object.assign(item, findObj);
      })
      setDataSource2([...dataSource2])
    }
  }, [lastMonthRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: () => {
        return [...dataSource, ...dataSource2]
      }
    };
  });

  /**
   * 通过数值的变化，对应的自有，租赁，共享数据发生变化
   * 1，给当前属性赋值
   * 2，调用 PersonnelItem 类里的更新小计的方法，更新小计的值
   * 3，setDataSource([...dataSource]) 时 小计根据 {record.getField(item.dataIndex)} 获取最新的值展示
   * @param value
   * @param record
   * @param item
   */
  const onChange = (value: number | null, record: any, item: any) => {
    const _value = value || 0;
    record.updateField(item.dataIndex, _value);
    setDataSource([...dataSource]);
    setDataSource2([...dataSource2]);
  }

  /**
   * 通过数值的变化，对应的单位，租赁公司 和 备注发生变化
   * 1，给当前属性赋值
   * 2，调用 PersonnelItem 类里的更新小计的方法，更新小计的值
   * 3，setDataSource([...dataSource]) 时 小计根据 {record.getField(item.dataIndex)} 获取最新的值展示
   * @param value
   * @param record
   * @param item
   */
  const onChangeInput = (value: string | null, record: any, item: any) => {
    const _value = value || '';
    record.updateField(item.dataIndex, _value);
    setDataSource([...dataSource]);
    setDataSource2([...dataSource2]);
  }

  const getColumns = () => {
    columns.forEach((col, index) => {
      if (col.valueType === 'input') {
        Object.assign(col, {
          render: (text: string, record: any) => {
            return (
              <AddInput
                value={text}
                onChange={(e) => onChangeInput(e.target.value, record, col)}
              />
            )
          }
        })
      }
      // 数值类型的展示
      if (col.valueType === 'number') {
        Object.assign(col, {
          render: (text: string, record: any) => {
            return (
              <AddInputNumber
                value={text}
                onChange={(_value) => onChange(_value, record, col)}
              />
            )
          }
        })
      }
    })
    return columns;
  }

  /**
   * 通用设备 总计计算逻辑
   */
  const calculateGrandTotal = () => {
    const total = {
      own_equipment_count: 0,
      leasing_equipment_count: 0,
      shared_equipment_count: 0,
    }
    dataSource.forEach(item => {
      total.own_equipment_count += item.getField('own_equipment_count');
      total.leasing_equipment_count += item.getField('leasing_equipment_count');
      total.shared_equipment_count += item.getField('shared_equipment_count');
    });
    return total;
  }

  /**
   * 管道专用设备 总计计算逻辑
   */
  const calculateGrandTotal2 = () => {
    const total = {
      own_equipment_count: 0,
      leasing_equipment_count: 0,
      shared_equipment_count: 0,
    }
    dataSource2.forEach(item => {
      total.own_equipment_count += item.getField('own_equipment_count');
      total.leasing_equipment_count += item.getField('leasing_equipment_count');
      total.shared_equipment_count += item.getField('shared_equipment_count');
    });
    return total;
  }

  return (
    <div>
      <Table
        title={() => <h3>通用设备</h3>}
        size="small"
        bordered
        pagination={false}
        scroll={{x: 1000}}
        dataSource={dataSource}
        // @ts-ignore
        columns={getColumns()}
        summary={pageData => {
          const grandTotal = calculateGrandTotal();
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center">总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><Text>{grandTotal.own_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><Text>{grandTotal.leasing_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><Text>{grandTotal.shared_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />

      <Table
        style={{marginTop: 16}}
        title={() => <h3>管道专用设备</h3>}
        size="small"
        bordered
        pagination={false}
        scroll={{x: 1000}}
        dataSource={dataSource2}
        // @ts-ignore
        columns={getColumns()}
        summary={pageData => {
          const grandTotal = calculateGrandTotal2();
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center">总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><Text>{grandTotal.own_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><Text>{grandTotal.leasing_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><Text>{grandTotal.shared_equipment_count}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  )
}

export default MasterEquipmentResource;
