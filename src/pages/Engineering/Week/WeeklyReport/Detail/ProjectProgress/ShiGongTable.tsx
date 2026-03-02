import { Form,Table, } from 'antd';
import React, { useContext, useState} from 'react';
import type { FormInstance } from 'antd/es/form';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  num: string;
  single_project: string;
  unit: string;
  major_workload: number; // 主要工作量
  complete_workload: number; // 完成工作量
  this_week_complete_workload: number; // 本周完成工作量
  next_week_complete_workload: number; // 下周计划工作量
  planned_completion_time: string, // 计划完工时间
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface Item {
  num: string;
  single_project: string;
  unit: string;
  major_workload: number; // 主要工作量
  complete_workload: number; // 完成工作量
  this_week_complete_workload: number; // 本周完成工作量
  next_week_complete_workload: number; // 下周计划工作量
  planned_completion_time: string, // 计划完工时间
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
  handleSave: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
   editing,
   dataIndex,
   title,
   inputType,
   record,
   index,
   children,
   handleSave,
   ...restProps
 }) => {
  const form = useContext(EditableContext)!;

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  return (
    <td {...restProps}>
      {children}
    </td>
  );
};
/**
 * 施工管理附加模块
 * @constructor
 */
const ShiGongTable = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      align: 'center',
      width: 80,
    },
    {
      title: '单体工程',
      dataIndex: 'single_project',
      align: 'center',
      width: 200,
      // editable: true,
      inputType: 'input',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      width: 100,
      // editable: true,
      inputType: 'input',
    },
    {
      title: '主要工作量',
      dataIndex: 'major_workload',
      align: 'center',
      width: 100,
      // editable: true,
      inputType: 'number',
    },
    {
      title: '完成工作量',
      dataIndex: 'complete_workload',
      align: 'center',
      width: 100,
      // editable: true,
      inputType: 'number',
    },
    {
      title: '剩余工作量',
      dataIndex: 'rest_num',
      align: 'center',
      width: 100,
    },
    {
      title: '本周完成工作量',
      dataIndex: 'this_week_complete_workload',
      align: 'center',
      width: 100,
      // editable: true,
      inputType: 'number',
    },
    {
      title: '下周计划工作量',
      dataIndex: 'next_week_complete_workload',
      align: 'center',
      width: 100,
      // editable: true,
      inputType: 'number',
    },
    {
      title: '计划完工时间',
      dataIndex: 'planned_completion_time',
      align: 'center',
      width: 200,
      // editable: true,
      inputType: 'date',
    },
    {
      title: '累计百分比',
      dataIndex: 'rest_rate',
      align: 'center',
      width: 100,
    },
  ]

  const handleSave = (row: any) => {
    const newData = [...data];
    const index = newData.findIndex(item => row.num === item.num);
    const item = newData[index];
    console.log(item);
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    newData.forEach(_item => {
      Object.assign(_item, {
        rest_num: _item.complete_workload - _item.major_workload,
      })
      Object.assign(_item, {
        rest_rate: Math.abs(_item.rest_num) * 100,
      })
    })
    setData(newData);
  };

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
        handleSave,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        style={{marginTop: 8}}
        size={'small'}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        scroll={{x: 1000}}
        bordered
        pagination={false}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
      />
    </Form>
  )
}

export default ShiGongTable;
