import React, { useEffect, useImperativeHandle, useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";
import {ConnectState} from "@/models/connect";
import {BasicTaskForm} from "yayang-ui";
import {Alert, Button, Form, Modal } from "antd";
import SysDict from "@/components/CommonList/SysDict";
import InSideOutSideGroup from "@/components/CommonList/InSideOutSideGroup";
import InCompanyJiaName from "@/components/CommonList/InCompanyJiaName";
import SelectValueFromMultipleContract
  from "./SelectValueFromMultipleContract";

/**
 * 新增在建项目资源结转情况
 * @param props
 * @constructor
 */
const BasicData: React.FC<any> = (props) => {
  const { cRef, contractCountStr = 'single', disabled = false, operate = 'add', selectedRecord, sysBasicDictList, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const formRef: any = useRef();


  console.log('--123---selectedRecord', selectedRecord)

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: async () => {
        try {
          return await formRef.current.validateFields();
        } catch (err) {
          Modal.error({
            title: '基础数据有必填项未填写'
          });
        }
      }
    };
  });

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // "id",
        "wbs_define_code",
        "wbs_define_name",
        "contract_sign_year",
        // "profit_center_code",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (val, fields) => {
              form.setFieldsValue({
                profit_center_code: val,
                inOrOut: fields.inOrOut,
              })
            }
            return(
              <ProfitCenterList disabled={disabled} onChange={onChange}/>
            )
          }
        },
        "inOrOut",
        "relative_person_code",
        contractCountStr === 'multiple' ? {
          title: "PerformanceLedger.contract_type",
          subTitle: "合同类型",
          dataIndex: "contract_type",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                contract_type: _val
              })
            }
            return (
              <SelectValueFromMultipleContract
                title={'合同类型'}
                type={'select'}
                sysTypeCode={'CONTRACT_MODE'}
                form={form}
                onChange={onChange}
                dataIndex={'contract_mode'}
              />
            )
          }
        } : {
          title: "PerformanceLedger.contract_type",
          subTitle: "合同类型",
          dataIndex: "contract_type",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                contract_type: _val
              })
            }
            return (
              <SysDict sysTypeCode={'CONTRACT_MODE'} onChange={onChange}/>
            )
          }
        },
        contractCountStr === 'multiple' ? {
          title: "compinfo.owner_name",
          subTitle: "业主名称",
          dataIndex: "owner_name",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                owner_name: _val
              })
            }
            return (
              <SelectValueFromMultipleContract
                title={'业主名称'}
                form={form}
                onChange={onChange}
                dataIndex={'owner_name'}
              />
            )
          }
        } : "owner_name",
        {
          title: "compinfo.inside_outside_group",
          subTitle: "集团内外",
          dataIndex: "inside_outside_group",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <InSideOutSideGroup form={form}/>
            )
          }
        },
        "income_method",
        contractCountStr === 'multiple' ? {
          title: "compinfo.project_location",
          subTitle: "项目部所在地",
          dataIndex: "project_location",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                project_location: _val
              })
            }
            return (
              <SelectValueFromMultipleContract
                title={'项目部所在地'}
                form={form}
                onChange={onChange}
                dataIndex={'project_location'}
              />
            )
          }
        } : "project_location",
        "contract_say_price",
        "after_change_price_en",
        "rate",
        "change_price_zh",
        "hetong_shouru_cha",
        "add_rate",
        "is_finish_no_close",
        // "in_company_jia_name",
       {
          title: "compinfo.in_company_jia_name",
          subTitle: "公司内部项目甲方名称(数据来自 往来单位)",
          dataIndex: "in_company_jia_name",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <InCompanyJiaName form={form}/>
            )
          }
        },
        // "contract_sign_date",
        // "contract_start_date",
        contractCountStr === 'multiple' ? {
          title: "compinfo.contract_sign_date",
          subTitle: "合同签订日期",
          dataIndex: "contract_sign_date",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                contract_sign_date: _val
              })
            }
            return (
              <SelectValueFromMultipleContract
                title={'合同签订日期'}
                type={'date'}
                form={form}
                onChange={onChange}
                dataIndex={'contract_sign_date'}
              />
            )
          }
        } : "contract_sign_date",
        contractCountStr === 'multiple' ? {
          title: "compinfo.profitLoss.contract_start_date",
          subTitle: "项目开工日期",
          dataIndex: "contract_start_date",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                contract_start_date: _val
              })
            }
            return (
              <SelectValueFromMultipleContract
                title={'项目开工日期'}
                type={'date'}
                form={form}
                onChange={onChange}
                dataIndex={'contract_start_date'}
              />
            )
          }
        } : "contract_start_date",
        "contract_area",
        "project_jiexie_date",
        "project_finish_date",
        // "company_a_b",
        {
          title: "compinfo.company_a_b",
          subTitle: "当年公司AB类标注",
          dataIndex: "company_a_b",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                company_a_b: _val
              })
            }
            return (
              <SysDict sysTypeCode={'PROJECT_LEVEL'} onChange={onChange}/>
            )
          }
        },
        "expected_revenue_price",
        "expected_cost",
        "gross_profit",
        "operating_revenue",
        "cost_price",
        "finance_price",
        "profit_total_price",
        "income_tax",
        "net_profix",
        "net_profix_rate",
        "remark",
      ])
      .setSplitGroupFormColumns([
        {title: '合同额（美元需折成人民币) （含税金额，单位元）', columns: [
            "contract_say_price",
            "after_change_price_en",
            "rate",
            "change_price_zh",
          ], order: 2},
        {title: '项目责任预算', columns: [
            "expected_revenue_price",
            "expected_cost",
            "gross_profit",
          ], order: 3},
        {title: ' 合计（万元人民币） ', columns: [
            "operating_revenue",
            "cost_price",
            "finance_price",
            "profit_total_price",
            "income_tax",
            "net_profix",
            "net_profix_rate",
          ], order: 4}
      ])
      .setFormColumnToInputNumber([
        {value: 'contract_say_price', valueType: 'digit', min: 0},
        {value: 'after_change_price_en', valueType: 'digit', min: 0},
        {value: 'rate', valueType: 'digit', min: 0},
        {value: 'change_price_zh', valueType: 'digit', min: 0},
        {value: 'add_rate', valueType: 'digit', min: 0},
        {value: 'expected_revenue_price', valueType: 'digit', min: 0},
        {value: 'expected_cost', valueType: 'digit', min: 0},
        {value: 'gross_profit', valueType: 'digit', min: 0},
        {value: 'operating_revenue', valueType: 'digit', min: 0},
        {value: 'cost_price', valueType: 'digit', min: 0},
        {value: 'finance_price', valueType: 'digit', min: 0},
        {value: 'profit_total_price', valueType: 'digit', min: 0},
        {value: 'income_tax', valueType: 'digit', min: 0},
        {value: 'net_profix', valueType: 'digit', min: 0},
        {value: 'net_profix_rate', valueType: 'digit', min: 0},
        {value: 'contract_area', valueType: 'digit', min: 0},

      ])
      .setFormColumnToSelect([
        {value: 'contract_sign_year', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'CONTRACT_SIGN_TYPE')},
        {value: 'is_finish_no_close', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'IS_FINISHED_NO_CLOSE_PRO')},
        {value: 'income_method', valueAlias: 'value', valueType:"select", name: 'value', data: sysBasicDictList.filter(r => r.type === 'FINANCE_INCOME_METHOD')},
      ])
      .setFormColumnToDatePicker(contractCountStr === 'multiple' ? [
        {value: 'project_jiexie_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'project_finish_date', valueType: 'dateTs', needValueType: 'timestamp'},
      ] : [
        {value: 'contract_sign_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'project_jiexie_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'project_finish_date', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .setFormColumnToInputTextArea([
        {value: 'remark'},
      ])
      .needToRules([
        "wbs_define_code",
        "contract_say_price",
        "after_change_price_en",
        "change_price_zh",
        "hetong_shouru_cha",
        "is_finish_no_close",
        // "in_company_jia_name",
        "project_jiexie_date",
        "project_finish_date",
        "company_a_b",
        "expected_revenue_price",
        "expected_cost",
        "gross_profit",
        "operating_revenue",
        "cost_price",
        "finance_price",
        "profit_total_price",
        "income_tax",
        "net_profix",
        "net_profix_rate",
        "profit_center_code",
      ])
      .needToDisabled(disabled ? [
        "wbs_define_code",
        "wbs_define_name",
        "contract_sign_year",
        "profit_center_code",
        "inOrOut",
        "relative_person_code",
        "contract_type",
        "owner_name",
        "inside_outside_group",
        "income_method",
        "project_location",
        "contract_say_price",
        "after_change_price_en",
        "rate",
        "change_price_zh",
        "hetong_shouru_cha",
        "add_rate",
        "is_finish_no_close",
        "in_company_jia_name",
        "contract_sign_date",
        "contract_start_date",
        "contract_area",
        "project_jiexie_date",
        "project_finish_date",
        "company_a_b",
        "expected_revenue_price",
        "expected_cost",
        "gross_profit",
        "operating_revenue",
        "cost_price",
        "finance_price",
        "profit_total_price",
        "income_tax",
        "net_profix",
        "net_profix_rate",
        "remark",
      ] :[
        "wbs_define_code",
        "relative_person_code",
        'inOrOut'
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <>
      {contractCountStr === 'multiple' && (
        <Alert type={'warning'} message={'该项目定义 包含多份合同，有些属性需要确定从哪份合同中取得'}/>
      )}
      <div style={{marginTop: 16}}>
        <BasicTaskForm
          cRef={formRef}
          labelCol={{span: 24}}
          layout={'vertical'}
          formColumns={getFormColumns()}
          footerBarRender={() => []}
          initialValue={{
            ...selectedRecord,
            company_a_b: `${selectedRecord.company_a_b}`
          }}
        />
      </div>
    </>
  );
};


export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(BasicData);
