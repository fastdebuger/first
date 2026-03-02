import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ContractSelectInput from "@/components/ContractSelect";


const { CrudAddModal } = SingleTable;

/**
 * 新增HSE重大风险清单
 * @param props
 * @constructor
 */
const TechnologyHseRiskControlListAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, timeType } = props;
  const { formatMessage } = useIntl();
  const propKey = localStorage.getItem('auth-default-wbs-prop-key')

  const riskLevelOptions = () => {
    switch (propKey) {
      case 'dep':
        return [{ name: '项目部', value: '0' }];
      case 'subComp':
        return [{ name: '项目部', value: '0' }, { name: '分公司', value: '1' }];
      case 'branchComp':
        return [{ name: '项目部', value: '0' }, { name: '分公司', value: '1' }, { name: '公司', value: '2' }];
      default:
        return [];
    }
  }



  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '工程名称',
          subTitle: '工程名称',
          dataIndex: 'contract_out_name',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <ContractSelectInput
              placeholder="请选择工程名称"
              displayField="contract_name"
              onChange={(record: any) => {
                form.setFieldsValue({
                  contract_out_name: record?.contract_name || record,
                });
              }}
            />
          ),
        },
        "level1_process",
        "level2_process",
        "level3_process",
        "major_risk_detail",
        "equipment_tool",
        "hazard_type",
        "company_area_supervisor",
        "risk_level",
        "plan_execute_time",
      ])
      .setFormColumnToDatePicker([
        { value: 'plan_execute_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToSelect([
        { value: 'risk_level', valueType: 'select', valueAlias: 'value', name: 'name', data: riskLevelOptions() },
      ])
      .needToRules([
        "contract_out_name",
        "level1_process",
        "level2_process",
        "level3_process",
        "major_risk_detail",
        "equipment_tool",
        "hazard_type",
        "company_area_supervisor",
        "risk_level",
        "plan_execute_time",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增HSE重大风险清单"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        risk_level: riskLevelOptions().length === 1 ? riskLevelOptions()[0].value : undefined,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "technologyHseRiskControlList/addTechnologyHseRiskControlList",
            payload: {
              ...values,
              type_code: timeType,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(TechnologyHseRiskControlListAdd);
