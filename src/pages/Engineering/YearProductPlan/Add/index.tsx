import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ContractNoModal from "../ProjectInfoModal";

const { CrudAddModal } = SingleTable;

/**
 * 新增年度生产计划
 * @param props
 * @constructor
 */
const WorkLicenseRegisterAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, yearParams } = props;
  const { formatMessage } = useIntl();

   /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'project_id',
        {
          title: 'yearProductPlan.project_name',
          subTitle: '项目名称',
          width: 160,
          align: 'center',
          dataIndex: 'project_name',
          renderSelfForm: (form, dataSource, _updateDataSource) => {
            return (
              <ContractNoModal
                dataSource={dataSource || []}
                form={form}
                handleChange={async (data: any) => {
                  const contractList = data || {};
                  if(data){
                    form.setFieldsValue({
                      project_name: contractList.project_name || null,
                      contract_start_date: contractList.contract_start_date || null,
                      contract_end_date: contractList.contract_end_date || null,
                      project_id: contractList.project_id,
                      contract_start_date_format: contractList.contract_start_date_format || null,
                      contract_end_date_format: contractList.contract_end_date_format || null,
                      actual_start_date: contractList.actual_start_date || null,
                      plan_end_date: contractList.plan_finish_date || null,
                    })
                  }else {
                    form?.setFieldsValue({
                      project_name: null,
                      contract_start_date: null,
                      contract_end_date: null,
                      project_id: null,
                      contract_start_date_format: null,
                      contract_end_date_format: null,
                      actual_start_date: null,
                      plan_end_date: null,
                    })
                  }
                  
                }} />
            )
          }
        },
        'contract_start_date',
        'contract_start_date_format',
        'contract_end_date',
        'contract_end_date_format',
        // 作业许可证编号
        'belong_year',
        
        // 实际开工日期
        'actual_start_date',
        // 计划完工日期
        'plan_end_date',
        // 年计划产值（万元）
        'plan_output_value',
        'progress_description',
        'remark',
      ])
      
      .setFormColumnToInputTextArea([
        { value: 'remark' },
        { value: 'progress_description' },
      ])
      .setFormColumnToInputNumber([
        { value: 'plan_output_value', valueType: 'digit' }
      ])
      .setFormColumnToDatePicker([
        { value: 'belong_year', valueType: 'dateTs',needValueType: 'date',picker: 'year' },
        { value: 'actual_start_date', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'plan_end_date', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'contract_start_date_format', valueType: 'dateTs',needValueType: 'date' },
        { value: 'contract_end_date_format', valueType: 'dateTs',needValueType: 'date' },
      ])
      .needToDisabled([
        'contract_start_date',
        'contract_end_date',
        'contract_start_date_format',
        'contract_end_date_format',

        'actual_start_date',
        'plan_end_date',
      ])
      .needToHide([
        'project_id',
        'contract_start_date',
        'contract_end_date',
      ])
      .needToRules([
        'belong_year',
        'actual_start_date',
        'plan_end_date',
        'plan_output_value',
        'contract_start_date_format',
        'contract_end_date_format',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={formatMessage({ id: 'base.user.list.add' })+formatMessage({ id: 'yearProductPlan' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        belong_year: yearParams || null
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addProjectAnnualPlan",
            payload: {
              ...values,
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

export default connect()(WorkLicenseRegisterAdd);