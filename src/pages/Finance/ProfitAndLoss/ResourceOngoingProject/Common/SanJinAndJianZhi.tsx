import React, { useImperativeHandle } from 'react';
import {ConnectState} from "@/models/connect";
import { connect } from 'umi';
import {Button, Col, Form, Input, InputNumber, Modal, Row, Space } from 'antd';

const SanJinAndJianZhi = (props: any) => {
  const { cRef, disabled = false, selectedRecord, sysBasicDictList } = props;

  const [form] = Form.useForm();

  let parseArr: any[] = [];
  if (selectedRecord && selectedRecord.sanJinData) {
    try {
      parseArr = JSON.parse(selectedRecord.sanJinData);
    } catch (e) {
      parseArr = [];
    }
  }

  console.log(parseArr, 'parseArr');

  const finalTitleList = sysBasicDictList.filter(r => r.type === 'SAN_JIN_JIAN_ZHI');
  const finalTitleExtraFields = {
    contract_price: 0,
    actual_price: 0,
    save_amount: 0,
  };
  const finalTitleExtraList = [
    {value: 'contract_price', label: '合同资产'},
    {value: 'actual_price', label: '应收款项'},
    {value: 'save_amount', label: '存货'}
  ]

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: async () => {
        try {
          return await form.validateFields();
        } catch (err) {
          Modal.error({
            title: '三金数据有必填项未填写'
          });
        }
      }
    };
  });

  return (
    <div>
      <Form disabled={disabled} layout={'vertical'} form={form} name="resource_b2">
        {finalTitleList.map(item => {
          let _initialValue: any[] = []
          if(parseArr.length > 0) {
            const filterArr = parseArr.filter(r => r.type === item.value);
            _initialValue =  filterArr;
          } else {
            _initialValue = [finalTitleExtraFields]
          }
          console.log(_initialValue)

          return (
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h3>{item.label}</h3>
              {/* Form.List 绑定到 item.value，同时设置initialValue */}
              <Form.List
                name={item.value}
                initialValue={_initialValue} // 关键：初始化1行
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} style={{ marginBottom: '10px' }}>
                        {finalTitleExtraList.map(r => (
                          <Col key={r.value} span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, r.value]}
                              label={r.label}
                              // rules={[{ required: true, message: `请输入${r.label}` }]}
                            >
                              <InputNumber style={{width: '100%'}} placeholder={r.label} />
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          )
        })}
      </Form>
    </div>
  );
}


export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(SanJinAndJianZhi);
