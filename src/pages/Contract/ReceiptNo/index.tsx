
import React, { useState, useEffect } from 'react';
import BaseTaskForm from '@/components/BaseTaskForm';
import { BasicFormColumns } from 'qcx4-components';
import { Button, Select, Col, message, Row } from 'antd';
import { connect, useIntl } from 'umi';
import { FuncCode } from '@/common/const';
import { configColumns } from './columns';
import { hasPermission } from '@/utils/authority';

const { Option } = Select;

/**
 * 单据号配置
 * @param props
 * @constructor
 */
const FormNoShowAutoGenerateRules: React.FC<any> = (props: any) => {
  const { dispatch, route } = props;
  const authority = route.authority
  const [data, setData] = useState<any>(null);
  const { formatMessage } = useIntl();
  const [funcData, setFuncData] = useState<string>('');
  const module = [
    { No: 'SRHTTZ', funCode: FuncCode.SRHTTZ, funName: "收入合同台账" },
    { No: 'ZCHTTZ', funCode: FuncCode.ZCHTTZ, funName: "支出合同台账" },
    { No: 'WZJFWZTCGCL', funCode: FuncCode.WZJFWZTCGCL, funName: "物资及服务总体采购策略" },
  ];
  const options = [
    { value: '年份(如:2025)' },
    { value: '年份(如:25)' },
  ] as any;

  const getFuncOptions = () => {
    return options
  }

  /**
   * 根据funcCode 查询规则
   */
  const fetchRulesByCode = (code: string) => {
    if (dispatch && code) {
      dispatch({
        type: 'contractBasic/getZyyjImsFormNoConfig',
        payload: {
          sort: 'func_code',
          func_code: code,
        },
        callback: (res: any) => {
          if (res.rows && res.rows.length > 0) {
            setFuncData(res.rows[0].func_code)
            setData(res.rows[0]);
          } else {
            setData({
              func_code: '',
              sec_part1: '',
              sec_part2: '',
              sec_part3: '',
              sec_part4: '',
              sec_part5: '',
              sec_part6: '',
              sec_part7: '',
              sec_part8: '',
              sec_part9: '',
              serial_no_len: '',
            });
          }
        },
      });
    }
  };
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns);
    cols.initFormColumns([
      {
        title: 'material.module.number',
        subTitle: '模块号',
        dataIndex: 'func_code',
        width: 190,
        align: 'center',
        renderSelfForm: (form) => {
          const onChange = (value: string) => {
            setFuncData(value)
            dispatch({
              type: 'contractBasic/getZyyjImsFormNoConfig',
              payload: {
                sort: 'func_code',
                func_code: value,
              },
              callback: (res: any) => {
                if (res.rows && res.rows.length > 0) {
                  // console.log('res.rows :>> ', res.rows);
                  form.setFieldsValue({ ...res.rows[0] });
                } else {
                  form.setFieldsValue({
                    func_code: value,
                    sec_part1: '',
                    sec_part2: '',
                    sec_part3: '',
                    sec_part4: '',
                    sec_part5: '',
                    sec_part6: '',
                    sec_part7: '',
                    sec_part8: '',
                    sec_part9: '',
                    serial_no_len: '',
                  });
                }
              },
            });
          };

          return <Select
            showSearch
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: "material.please.select.module" })}
            optionFilterProp='children'
            onChange={onChange}
            filterOption={(input, option) =>
              // @ts-ignore
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {module.map(item => (
              <Option
                key={item.funCode}
                value={item.funCode}>
                {item.funName}
              </Option>)
            )}
          </Select>;
        },
      },
      // 'func_code',
      'sec_part1',
      'sec_part2',
      'sec_part3',
      'sec_part4',
      'sec_part5',
      'sec_part6',
      'sec_part7',
      'sec_part8',
      'sec_part9',
      'serial_no_len',
    ]).setFormColumnToAutoComplete(
      [
        { value: 'sec_part1', data: getFuncOptions() },
        { value: 'sec_part2', data: getFuncOptions() },
        { value: 'sec_part3', data: getFuncOptions() },
        { value: 'sec_part4', data: getFuncOptions() },
        { value: 'sec_part5', data: getFuncOptions() },
        { value: 'sec_part6', data: getFuncOptions() },
        { value: 'sec_part7', data: getFuncOptions() },
        { value: 'sec_part8', data: getFuncOptions() },
        { value: 'sec_part9', data: getFuncOptions() },
      ],
    )
      .needToRules([
        'func_code',
        'serial_no_len'
      ])
      .setFormColumnToInputNumber([
        {
          value: 'serial_no_len',
          min: 1,
          max: 5,
          valueType: 'digit'
        }
      ]);
    return cols.getNeedColumns();
  };
  const footerBarRender = (form: any) => {
    const handleSave = async (files: any) => {
      const values = await form.validateFields();
      // 如果是物资及服务总体采购策略 就去掉下划线
      const del_last_joint = values.func_code === "tbl_materials_service_purchase_strategy" ? 1 : 0
      dispatch({
        type: 'contractBasic/updateZyyjImsFormNoConfig',
        payload: {
          ...values,
          del_last_joint,
        },
        callback: (res: { errCode: number; }) => {
          if (res && res.errCode === 0) {
            message.success(formatMessage({ id: "common.set.success" }));
          }
        },
      });
      files.preventDefault();
    };
    return ([
      <Row justify='space-between'>
        <Col
          span={10}
        >
          <span style={{ color: '#f40' }}>
            *
            {formatMessage({
              id: 'material.document.number.configuration.generate.serial.number.at.the.end.and.number.can.have.up.to.5.digits',
            })}
          </span>
        </Col>
        <Col span={14} style={{ textAlign: 'right' }}>
          <Button
            type='primary'
            style={{
              display: hasPermission(authority, '保存') ? 'inline' : 'none' ,
              marginLeft: 8
            }}
            onClick={handleSave}>
            {formatMessage({ id: 'common.save' })}
          </Button>
        </Col>
      </Row>]
    );
  };

  useEffect(() => {
    fetchRulesByCode(FuncCode.SRHTTZ);
  }, []);
  return (
    <>
      <div style={{ padding: '45px 10px' }}>
        {data && <BaseTaskForm
          formColumns={getFormColumns()}
          footerBarRender={footerBarRender}
          initialValue={data}
        />}
      </div>
    </>
  );
};
export default connect()(FormNoShowAutoGenerateRules);
