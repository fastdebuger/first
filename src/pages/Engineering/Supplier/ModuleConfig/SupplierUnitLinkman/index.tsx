import { addSupplierUnitLinkman, getUnitLinkman, updateSupplierUnitLinkman } from '@/services/engineering/supplierContractScore';
import { Button, Form, Input, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';

const SupplierUnitLinkman = () => {

  const [fields, setFields] = useState(null);
  const wbsCode = localStorage.getItem('auth-default-wbsCode');
  const [form] = Form.useForm();

  const fetchList = async () => {
    const res = await getUnitLinkman({
      sort: 'wbs_code',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'wbs_code', Val: wbsCode, Operator: '='}
      ])
    })
    if (res.rows.length > 0) {
      setFields(res.rows[0])
      form.setFieldsValue(res.rows[0])
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    if (fields) {
      const res = await updateSupplierUnitLinkman({
        ...values,
        wbs_code: wbsCode,
      })
      if (res.errCode === 0) {
        message.success('更新成功');
      }
    } else {
      const res = await addSupplierUnitLinkman({
        ...values,
        wbs_code: wbsCode,
      })
      if (res.errCode === 0) {
        message.success('新增成功');
      }
    }
  };

  return (
    <div>
      <h4>二级单位联系信息</h4>
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="联系人"
          name="linkman"
          rules={[{ required: true, message: '必填!' }]}
        >
          <Input style={{width: 220}}/>
        </Form.Item>

        <Form.Item
          label="联系方式"
          name="phone_number"
          rules={[{ required: true, message: '必填!' }]}
        >
          <Input style={{width: 220}}/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SupplierUnitLinkman;
