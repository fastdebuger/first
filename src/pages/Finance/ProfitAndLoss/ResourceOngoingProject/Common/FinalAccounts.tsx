import React, {useEffect, useImperativeHandle, useState } from 'react';
import {ConnectState} from "@/models/connect";
import { connect } from 'umi';
import {Alert, Button, Col, Form, Input, InputNumber, Modal, Row, Space } from 'antd';
import {queryResourceOngoingProjectBeforeJueCaiData} from "@/services/finance/resourceOngoingProject";
import moment from 'moment';

const FinalAccounts = (props: any) => {
  const { cRef, operate = '', disabled = false, selectedRecord, sysBasicDictList } = props;
  // 获取去年的年份
  const lastYear = moment().subtract(1, 'years').year();
  const [form] = Form.useForm();

  let parseArr: any[] = [];
  if (selectedRecord && selectedRecord.finalData) {
    try {
      parseArr = JSON.parse(selectedRecord.finalData);
      // console.log('---12312-----parseArr', parseArr)
      if(parseArr.length > 0) {
        parseArr.forEach(item => {
          Object.assign(item, {
            contract_price: Number(item.contract_price) || 0,
            operating_revenue: Number(item.operating_revenue) || 0,
            cost_price: Number(item.cost_price) || 0,
            finance_price: Number(item.finance_price) || 0,
            profit_total_price: Number(item.profit_total_price) || 0,
            income_tax: Number(item.income_tax) || 0,
            net_profix: Number(item.net_profix) || 0,
            net_profix_rate: Number(item.net_profix_rate) || 0,
          })
        })
      }
    } catch (e) {
      parseArr = [];
    }
  }



  /**
   * 在新增模式下 查询去年的决策数据
   */
  const fetchResourceOngoingProjectBeforeJueCaiData = async () => {
    const res = await queryResourceOngoingProjectBeforeJueCaiData({
      year: lastYear,
      wbs_define_code: selectedRecord.wbs_define_code,
    })
    if (res.result) {
      const _obj = {
        contract_price: Number(res.result.contract_price) || 0,
        operating_revenue: Number(res.result.operating_revenue) || 0,
        cost_price: Number(res.result.cost_price) || 0,
        finance_price: Number(res.result.finance_price) || 0,
        profit_total_price: Number(res.result.profit_total_price) || 0,
        income_tax: Number(res.result.income_tax) || 0,
        net_profix: Number(res.result.net_profix) || 0,
        net_profix_rate: Number(res.result.net_profix_rate) || 0,
      }
      form.setFieldsValue({
        before: [_obj],
      })
    }
  }

  useEffect(() => {
    if (operate === 'add') {
      fetchResourceOngoingProjectBeforeJueCaiData()
    }
  }, []);


  const finalTitleList = sysBasicDictList.filter(r => r.type === 'JUE_SUAN');
  const finalTitleExtraFields = {
    contract_price: 0,
    operating_revenue: 0,
    cost_price: 0,
    finance_price: 0,
    profit_total_price: 0,
    income_tax: 0,
    net_profix: 0,
    net_profix_rate: 0,
  };
  const finalTitleExtraList = [
    {value: 'contract_price', label: '合同额'},
    {value: 'operating_revenue', label: '营业收入'},
    {value: 'cost_price', label: '成本费用'},
    {value: 'finance_price', label: '财务费用'},
    {value: 'profit_total_price', label: '利润总额'},
    {value: 'income_tax', label: '所得税'},
    {value: 'net_profix', label: '净利润'},
    {value: 'net_profix_rate', label: '净利润率'}
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
            title: '决算数据有必填项未填写'
          });
        }
      }
    };
  });

  // 合并并相加相同属性的函数
  function mergeAndSum(obj1, obj2) {
    // 获取所有属性（包含两个对象的所有key）
    const allKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];

    // 遍历属性，计算总和
    return allKeys.reduce((result, key) => {
      // 处理属性不存在的情况（默认值为0）
      const val1 = obj1[key] ?? 0;
      const val2 = obj2[key] ?? 0;
      result[key] = val1 + val2;
      return result;
    }, {});
  }

  const handleOnChange = (_val: number, item:any, dataIndex: string) => {
    if ('begin_curr' == item.value) {
      const beginCurr = form.getFieldValue('begin_curr');
      const beforeDate = form.getFieldValue('before');
      const nextEnd = form.getFieldValue('next_end');
      if (beginCurr && nextEnd) {
        const _beginCurr = beginCurr[0];
        const _endCurr = nextEnd[0];
        console.log('_beginCurr', _beginCurr);
        console.log('_endCurr', _endCurr);
        // 影响当年数据
        const mergeAndSum1 = mergeAndSum(_beginCurr, _endCurr);
        form.setFieldsValue({
          curr: [mergeAndSum1],
        })

        // 影响去年数据
       // 如果是第一年填写 去年没数据
        const contract_price = beforeDate[0].contract_price + beginCurr[0].contract_price;
        const operating_revenue = beforeDate[0].operating_revenue + beginCurr[0].operating_revenue;
        const cost_price = beforeDate[0].cost_price + beginCurr[0].cost_price;
        const finance_price = beforeDate[0].finance_price + beginCurr[0].finance_price;
        const profit_total_price = beforeDate[0].profit_total_price + beginCurr[0].profit_total_price;
        const income_tax = beforeDate[0].income_tax + beginCurr[0].income_tax;
        const net_profix = beforeDate[0].net_profix + beginCurr[0].net_profix;
        const net_profix_rate = beforeDate[0].net_profix_rate + beginCurr[0].net_profix_rate;

        const obj = {
          contract_price,
          operating_revenue,
          cost_price,
          finance_price,
          profit_total_price,
          income_tax,
          net_profix,
          net_profix_rate,
          h_id: beforeDate[0].h_id,
          id: beforeDate[0].id,
        }
        form.setFieldsValue({
          before: [obj],
        })
      }
    }
    if ('next_end' === item.value) {
      const beginCurr = form.getFieldValue('begin_curr');
      const nextEnd = form.getFieldValue('next_end');
      const beforeDate = form.getFieldValue('before');
      if (beginCurr && nextEnd) {
        const _beginCurr = beginCurr[0];
        const _endCurr = nextEnd[0];
        console.log('_beginCurr', _beginCurr);
        console.log('_endCurr', _endCurr);
        // 影响当年数据
        const mergeAndSum1 = mergeAndSum(_beginCurr, _endCurr);
        form.setFieldsValue({
          curr: [mergeAndSum1],
        })

        // 影响去年数据
        // 如果是第一年填写 去年没数据
        const contract_price = beforeDate[0].contract_price + nextEnd[0].contract_price;
        const operating_revenue = beforeDate[0].operating_revenue + nextEnd[0].operating_revenue;
        const cost_price = beforeDate[0].cost_price + nextEnd[0].cost_price;
        const finance_price = beforeDate[0].finance_price + nextEnd[0].finance_price;
        const profit_total_price = beforeDate[0].profit_total_price + nextEnd[0].profit_total_price;
        const income_tax = beforeDate[0].income_tax + nextEnd[0].income_tax;
        const net_profix = beforeDate[0].net_profix + nextEnd[0].net_profix;
        const net_profix_rate = beforeDate[0].net_profix_rate + nextEnd[0].net_profix_rate;

        const obj = {
          contract_price,
          operating_revenue,
          cost_price,
          finance_price,
          profit_total_price,
          income_tax,
          net_profix,
          net_profix_rate,
          h_id: beforeDate[0].h_id,
          id: beforeDate[0].id,
        }
        form.setFieldsValue({
          before: [obj],
        })
      }
    }
  }

  return (
    <div>
      <Form disabled={disabled} layout={'vertical'} form={form} name="resource_b1">
        {finalTitleList.map(item => {
          let _initialValue: any[] = []
          if(parseArr.length > 0) {
            const filterArr = parseArr.filter(r => r.type_code === item.value);
            _initialValue =  filterArr;
          } else {
            _initialValue = [finalTitleExtraFields]
          }
          console.log(_initialValue)
          return (
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h3>{item.label}</h3>
              {item.value === 'before' && (
                <Alert type={'info'} message={'根据上年12月份数据默认自动计算=上年及以前决算数据+当年预计数据，也可手工修改'}/>
              )}
              {item.value === 'curr' && (
                <Alert type={'info'} message={'自动计算=当年1月-当月实际 （本年累计）+ 当年下月-当年12月预算 （本年剩余月份累计）'}/>
              )}
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
                              {disabled ? (
                                <InputNumber
                                  disabled={true} style={{width: '100%'}} placeholder={r.label}
                                />
                              ) : (
                                <InputNumber
                                  onChange={(_value) => handleOnChange(_value, item, r.value)}
                                  disabled={['curr'].includes(item.value)} style={{width: '100%'}} placeholder={r.label}
                                />
                              )}

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
}))(FinalAccounts);
