import { Form, Select, Button, Space, Tooltip, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {queryFormula, updateFormula} from "@/services/finance/base";
import { useEffect } from 'react';

// 可参与计算的字段列表（比如从接口获取的列名）
// const fieldOptions = [
//   { label: '销量', value: 'sales' },
//   { label: '单价', value: 'price' },
//   { label: '成本', value: 'cost' },
// ];

// 运算符列表
const operatorOptions = [
  { label: '+', value: '+' },
  { label: '-', value: '-' },
  { label: '*', value: '*' },
  { label: '/', value: '/' },
];

interface FormulaBuilderProps {
  list: Array<{label: string; value: string}>;
  activeKey: string;
}

/**
 * 将后台返回的扁平公式结构转换为 Form.List 所需的对象数组
 * @param {Array} structuredFormula 后台返回的公式结构
 * @returns {Array} 适用于 Form.List 的对象数组
 */
const transformFormulaToFormValues = (structuredFormula: any) => {
  const formValues = [];
  let currentSegment = null;

  for (const item of structuredFormula) {
    if (item.type === 'field') {
      // 如果当前正在处理一个片段，先把它存入结果
      if (currentSegment) {
        formValues.push(currentSegment);
      }
      // 开始一个新的片段
      currentSegment = { field: item.value };
    } else if (item.type === 'operator' && currentSegment) {
      // 如果是运算符，并且有正在处理的片段，则添加运算符
      currentSegment.operator = item.value;
    }
  }

  // 循环结束后，将最后一个片段也存入结果
  if (currentSegment) {
    formValues.push(currentSegment);
  }

  return formValues;
};

// 公式输入组件
const FormulaBuilder = (props: FormulaBuilderProps) => {

  const { list, activeKey } = props;
  const [form] = Form.useForm();

  const fetchList = async () => {
    const res = await queryFormula({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'module', Val: activeKey, Operator: '='},
        {Key: 'field', Val: '应纳税额', Operator: '='},
      ])
    })
    if(res.rows.length > 0) {
      const row = res.rows[0];
      try {
        const content = JSON.parse(row.content);
        const initValues = transformFormulaToFormValues(content);
        form.setFieldsValue({
          content: initValues
        })
      } catch (e) {

      }
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  const onFinish = async (values: any) => {
    console.log('Received values of form:', values);
    // 从Form.List中提取segments
    const segments: any[] = values.content;
    // 拼接为结构化公式
    const structuredFormula: any[] = [];
    segments.forEach((seg, index) => {
      structuredFormula.push({ type: 'field', value: seg.field });
      // 非最后一个seg，添加运算符
      if (index < segments.length - 1) {
        structuredFormula.push({ type: 'operator', value: seg.operator });
      }
    });
    const res = await updateFormula({
      module: activeKey,
      field: '应纳税额',
      content: JSON.stringify(structuredFormula),
    })
    if (res.errCode === 0) {
      message.success('配置成功');
    }
  };

  return (
    <Form form={form} name="ormula_config" onFinish={onFinish} autoComplete="off">
      <Form.List name="content">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Space key={key} align="center" style={{ marginBottom: 8 }}>
                {/* 字段选择器 */}
                <Form.Item
                  {...restField}
                  name={[name, 'field']}
                  rules={[{ required: true, message: '请选择字段' }]}
                >
                  <Select options={list} placeholder="选择字段" style={{width: 160}} />
                </Form.Item>

                {/* 运算符选择器（最后一个片段不需要） */}
                {index < fields.length - 1 && (
                  <Form.Item
                    {...restField}
                    name={[name, 'operator']}
                    rules={[{ required: true, message: '请选择运算符' }]}
                  >
                    <Select options={operatorOptions} placeholder="选择运算" />
                  </Form.Item>
                )}

                {/* 删除按钮 */}
                {fields.length > 1 && (
                  <Tooltip title="删除此运算">
                    <DeleteOutlined style={{fontSize: 12, marginRight: 4, color: '#f40'}} onClick={() => remove(name)}/>
                  </Tooltip>
                )}
              </Space>
            ))}

            {/* 新增公式片段 */}
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
              style={{ marginTop: 8 }}
            >
              添加字段/运算
            </Button>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button disabled={list.length === 0} style={{marginTop: 12}} type="primary" htmlType="submit">
          保存配置
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormulaBuilder;
