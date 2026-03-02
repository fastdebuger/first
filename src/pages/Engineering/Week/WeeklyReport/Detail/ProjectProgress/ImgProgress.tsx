import type { InputRef } from 'antd';
import { Form, Input, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
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

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
   title,
   editable,
   children,
   dataIndex,
   record,
   handleSave,
   ...restProps
 }) => {
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;


  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    //@ts-ignore
    if(dataIndex === 'image_url') {
      childNode = (
        <img src={record[dataIndex]} height={60}/>
      )
    } else {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
        >
          <Input.TextArea ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      )
    }

  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  num: React.Key;
  main_issues: string;
  solution: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ImgProgress: React.FC = ({cRef, lastWeekRecord}: any) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  useEffect(() => {
    if (lastWeekRecord && lastWeekRecord.WeeklyProProgress) {
      setDataSource(lastWeekRecord.WeeklyProProgress.weeklyProImgProgressList);
    }
  }, [lastWeekRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: () => {
        return dataSource;
      }
    };
  });

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '序号',
      dataIndex: 'num'
    },
    {
      title: '照片描述',
      dataIndex: 'image_des',
      // editable: true,
    },
    {
      title: '照片附件（请上传原图）',
      dataIndex: 'image_url',
      editable: true,
      width: 200,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.num === item.num);
    const item = newData[index];
    console.log(item);
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div style={{ marginTop: 16 }}>
      <Table
        components={components}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default ImgProgress;
