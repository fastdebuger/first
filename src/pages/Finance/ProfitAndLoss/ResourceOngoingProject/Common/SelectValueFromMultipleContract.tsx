import React, { useEffect } from 'react';
import {getIncomeInfo} from "@/services/contract/income";
import {configColumns as showContractColumns} from "@/pages/Contract/Income/columns";
import {getDepTitle} from "@/utils/utils";
import {Alert, Button, Descriptions, Form, Input, Modal } from 'antd';
import { BasicTableColumns } from "yayang-ui";
import SysDict from "@/components/CommonList/SysDict";
import FormItemIsDatePicker from "@/pages/Engineering/Week/WeeklyReport/FormItem/FormItemIsDatePicker";

const SelectValueFromMultipleContract = (props: any) => {
  const { type = 'input', sysTypeCode = '', title, form, onChange, dataIndex } = props;

  const wbsDefineCode = Form.useWatch('wbs_define_code', form);

  const depCode = localStorage.getItem('auth-default-wbsCode') || '';
  // 项目定义对应查询出的合同数量 有一对多的情况
  const [contractList, setContractList] = React.useState<any[]>([]);
  const [leftValue, setLeftValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const fetchList = async () => {
    const res = await getIncomeInfo({
      order: 'desc',
      sort: 'id',
      filter: JSON.stringify([
        { Key: 'wbs_code', Val: wbsDefineCode, Operator: '=' },
        { Key: 'dep_code', Val: depCode, Operator: '=' },
      ]),
    })
    setContractList(res.rows || []);
  }

  useEffect(() => {
    if(visible) {
      fetchList()
    }
  }, [wbsDefineCode, dataIndex, visible]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(showContractColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        "contract_no",
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "specialty_type_str",
        "revenue_method_str",
        "relative_person_code",
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToFixed([
        {
          value: "settlement_management_id_str",
          fixed: "right"
        }
      ])
    return cols.getNeedColumns();
  };

  console.log('------leftValue', leftValue);

  return (
    <>
      <Input.Group compact style={{width:'100%'}}>
        {type === 'input' && (
          <Input
            style={{ width: 'calc(100% - 88px)' }}
            placeholder="点击右侧获取" value={leftValue}
            onChange={(e) => {
              const _value = e.target.value;
              setLeftValue(_value);
              onChange(_value)
            }}
          />
        )}
        {type === 'date' && (
          <div style={{ width: 'calc(100% - 88px)' }}>
            <FormItemIsDatePicker value={leftValue} onChange={(_value: string) => {
              setLeftValue(_value)
              onChange(_value);
            }}/>
          </div>
        )}
        {type === 'select' && (
          <div style={{ width: 'calc(100% - 88px)' }}>
            <SysDict style={{width: '100%'}} value={leftValue} sysTypeCode={sysTypeCode} onChange={(_value, findDictNameObj) => {
              setLeftValue(_value)
              onChange(_value, findDictNameObj);
            }}/>
          </div>
        )}
        <Button style={{width: 88}} type="primary" onClick={() => {
          setVisible(true);
        }}>点击获取</Button>
      </Input.Group>
      {visible && (
        <Modal
          width={'80%'}
          title={'获取' + title}
          visible={visible}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Alert type={'info'} message={'从下方合同中选择 ' + title}/>
          <div style={{marginTop: 8, overflowY: 'scroll', height: 'calc(100vh - 120px)'}}>
            {contractList.map((item, index) => {
              return (
                <Descriptions title={<span>
                  合同{index + 1}：{item.contract_no}
                  <Button type={'primary'} style={{marginLeft: 16}} onClick={() => {
                    onChange(item[dataIndex], item);
                    setLeftValue(item[dataIndex]);
                    setVisible(false);
                  }}>
                    选择此合同
                  </Button>
                </span>}>
                  {getTableColumns().map((column: any) => {
                    return (
                      <Descriptions.Item label={column.subTitle}>
                        {item[column.dataIndex] || '--'}
                      </Descriptions.Item>
                    )
                  })}
                </Descriptions>
              )
            })}
          </div>
        </Modal>
      )}
    </>
  )
}

export default SelectValueFromMultipleContract;
