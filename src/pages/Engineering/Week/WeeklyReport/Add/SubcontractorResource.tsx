import {Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Table, Typography } from 'antd';
import React, {useEffect, useImperativeHandle, useState } from 'react';
import {deepArr} from "@/utils/utils-array";

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

  const { cRef, lastWeekRecord } = props;

  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (lastWeekRecord && lastWeekRecord.WeeklySubcontractors) {
      lastWeekRecord.WeeklySubcontractors.forEach((item: any, index: number) => {
        Object.assign(item, {
          num: index + 1,
        })
      })
      setData(lastWeekRecord.WeeklySubcontractors);
    }
  }, [lastWeekRecord]);

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

  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.num === editingKey;

  const edit = (record: Partial<Item> & { num: React.Key }) => {
    form.setFieldsValue({ subcontractor_name: '', subcontracted_content: '', ...record });
    setEditingKey(record.num);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.num);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


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
      editable: true,
    },
    {
      title: '分包内容',
      dataIndex: 'subcontracted_content',
      align: 'center',
      width: 500,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.num)} style={{ marginRight: 8 }}>
              保存修改
            </Typography.Link>
            <Popconfirm title="确定取消修改?" onConfirm={cancel}>
              <a style={{color: 'orange'}}>取消修改</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              修改
            </Typography.Link>
            <Divider type={'vertical'} />
            <Popconfirm title="确定删除?" onConfirm={() => {
              const deepCopyData: any[] = deepArr(data);
              const filterArr = deepCopyData.filter(item => {
                return item.num !== record.num;
              })
              setData(filterArr);
            }}>
              <a style={{color: '#f40'}}>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
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
      <Button type="primary" onClick={() => {
        const newData: any = {
          num: data.length + 1,
          subcontractor_name: ``,
          subcontracted_content: '',
        };
        setData([...data, newData]);
      }}>
        新增
      </Button>
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
