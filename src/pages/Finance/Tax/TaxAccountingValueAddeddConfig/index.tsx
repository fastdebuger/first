import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Button, Col, Form, Input, message, Row, Select, Space, Tabs } from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'umi';
import {queryAccountingValueAddeddConfig, updateAccountingValueAddeddConfig} from "@/services/finance/taxConfig";
import AccountingSubjectList from "@/components/CommonList/AccountingSubjectList";
import FormulaBuilder from "@/components/FormulaBuilder";
import { hasPermission } from '@/utils/authority';

const TabContent = (props: any) => {
  const { activeKey, authority } = props;
  const [list, setList] = useState([])

  const [form] = Form.useForm();

  const fetchList = async () => {
    const res = await queryAccountingValueAddeddConfig({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'type', Val: activeKey, Operator: '='}
      ])
    })
    form.setFieldsValue({
      options: res.rows,
    })
    setList(res.rows || []);
  }

  useEffect(() => {
    fetchList()
  }, []);

  const onFinish = async (values: any) => {
    console.log('Received values of form:', values);
    if (values.options.length < 1) {
      message.warn("至少新增一条配置")
      return;
    }
    const res = await updateAccountingValueAddeddConfig({
      type: activeKey,
      options: JSON.stringify(values.options),
    })
    if (res.errCode === 0) {
      message.success('配置成功');
      fetchList()
    }
  };

  return (
    <div key={activeKey}>
      <strong>1. 列展示配置</strong>
      <div style={{padding: 8}}>
        <Form form={form} name="tax_config" onFinish={onFinish} autoComplete="off">
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} style={{ display: 'flex', marginBottom: 8 }}>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value_added_tax_item']}
                        rules={[{ required: true, message: '请输入单位应纳增值税项目' }]}
                      >
                        <Input placeholder="单位应纳增值税项目：销项" style={{width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'accounting_subject']}
                        rules={[{ required: true, message: '请选择会计科目' }]}
                      >
                        <AccountingSubjectList style={{width: '100%' }}/>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'total_field_name']}
                        rules={[{ required: true, message: '请选择合计字段' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'beginning_month_amount',
                              label: '月初金额 合计',
                            },
                            {
                              value: 'debit_amount',
                              label: '借方 合计',
                            },
                            {
                              value: 'creditor_amount',
                              label: '贷方 合计',
                            },
                            {
                              value: 'ending_month_amount',
                              label: '月末金额 合计',
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{textAlign: 'center'}}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}  style={{width: 660}}>
                    新增单位应纳增值税项目与会计科目的关系
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button style={{display: hasPermission(authority, '保存配置') ? 'inline' : 'none'}} type="primary" htmlType="submit">
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <strong>2. 应纳税额 公式配置</strong>
      <div style={{padding: 8}} key={activeKey}>
        <FormulaBuilder activeKey={activeKey} list={list.map(l => ({label: l.value_added_tax_item, value: l.value_added_tax_item}))}/>
      </div>
    </div>
  )
}


/**
 * 单位应纳增值税项目与会计科目的关系
 * @constructor
 */
const AccountingValueAddeddConfigPage: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const [activeKey, setActiveKey] = useState('一般计税合计');

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={(activeKey: string) => setActiveKey(activeKey)}>
        {['一般计税合计', '简易计税合计'].map((item, index) => {
          return (
            <Tabs.TabPane key={item} tab={item}>
              <TabContent authority={authority} activeKey={activeKey}/>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}
export default connect()(AccountingValueAddeddConfigPage);
