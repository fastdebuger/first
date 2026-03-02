import { Form, Input, InputNumber, Table } from 'antd';
import React, {useEffect, useImperativeHandle, useState } from 'react';

interface Item {
  num: string;
  subcontractor_name: string;
  subcontracted_content: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
   editing,
   dataIndex,
   title,
   inputType,
   record,
   index,
   children,
   ...restProps
 }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
/**
 * 分包资源投入模块
 * @constructor
 */
const SubcontractorResource = (props: any) => {

  const { cRef, lastMonthRecord } = props;

  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlySubcontractors) {
      lastMonthRecord.MonthlySubcontractors.forEach((item: any, index: number) => {
        Object.assign(item, {
          num: index + 1,
        })
      })
      setData(lastMonthRecord.MonthlySubcontractors);
    }
  }, [lastMonthRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: () => {
        return data;
      }
    };
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      align: 'center',
      width: 200,
    },
    {
      title: '分包商名称',
      dataIndex: 'subcontractor_name',
      align: 'center',
      width: 200,
      // editable: true,
    },
    {
      title: '分包内容',
      dataIndex: 'subcontracted_content',
      align: 'center',
      width: 500,
      // editable: true,
    }
  ]


  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        size={'small'}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        pagination={false}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
      />
    </Form>
  )
}

export default SubcontractorResource;
