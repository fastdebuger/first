import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {HUA_WEI_OBS_CONFIG} from "@/common/const";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

interface Item {
  num: number;
  key: string;
  name: string;
  age: string;
  address: string;
}

const EditableRow: React.FC<any> = (props) => <tr {...props} />;

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  form: any;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
   title,
   editable,
   children,
   dataIndex,
   record,
   handleSave,
   form,
   ...restProps
 }) => {
  const inputRef = useRef<InputRef>(null);

  const save = async () => {
    try {
      // 只校验当前单元格：['rows', record.num, dataIndex]
      await form.validateFields([['rows', record.num, dataIndex]]);
      const rowValues = form.getFieldValue(['rows', record.num]) || {};
      handleSave({ ...record, ...rowValues });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    //@ts-ignore
    if(dataIndex === 'image_url') {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={['rows', record.num, dataIndex]}
          initialValue={record[dataIndex]} // 关键：初始化表单值，回显 dataSource 数据
          rules={[{ required: true, message: '必填项' }]}
          getValueFromEvent={(e: any) => {
            // 兼容你组件可能传 file 或传 event
            const file = e?.file ?? e;
            return file?.response?.url ?? null;
          }}
        >
          <HuaWeiOBSUploadSingleFile
            accept=".png,.jpg,.jpeg,.gif,.bmp"
            sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
            limitSize={200}
            folderPath="/monthly"
            handleRemove={() => {
              form.setFieldsValue({ image_url: ''});
              save();
            }}
          />
        </Form.Item>
      )
    } else {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={['rows', record.num, dataIndex]}
          initialValue={record[dataIndex]} // 关键：初始化表单值，回显 dataSource 数据
          rules={[{ required: true, message: '必填项' }]}
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

const ImgProgress: React.FC = ({cRef, lastMonthRecord}: any) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlyProProgress) {
      setDataSource(lastMonthRecord.MonthlyProProgress.monthlyProImgProgressList || []);
    }
  }, [lastMonthRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: async () => {
        if (!dataSource?.length) return [];

        // ✅ 一次性校验整个表单
        await form.validateFields();

        // ✅ 拿到表单里所有行的值，并合并回 dataSource
        const rows = form.getFieldValue('rows') || {};
        return dataSource.map(r => ({ ...r, ...(rows[r.num] || {}) }));
      }
    };
  });

  const [count, setCount] = useState(1);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter(item => item.num !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '序号',
      dataIndex: 'num'
    },
    {
      title: '照片描述',
      dataIndex: 'image_des',
      editable: true,
    },
    {
      title: '照片附件（请上传原图）',
      dataIndex: 'image_url',
      editable: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record: { num: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.num)}>
            <a style={{color: '#f40'}}>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      num: count,
      main_issues: ``,
      solution: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

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
        form, // ✅ 透传
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <div key={dataSource.length} style={{ marginTop: 16 }}>
        <Button size={'small'} onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          新增
        </Button>
        <Table
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </div>
    </Form>
  );
};

export default ImgProgress;
