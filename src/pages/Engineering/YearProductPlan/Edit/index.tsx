import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ContractNoModal from "../ProjectInfoModal";

const { CrudEditModal } = SingleTable;

/**
 * 编辑年度生产计划
 * @param props
 * @constructor
 */
const WorkLicenseRegisterEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '项目信息',
          subTitle: '项目信息',
          width: 160,
          align: 'center',
          dataIndex: 'contract',
          renderSelfForm: (form, dataSource, _updateDataSource) => {
            return (
              <ContractNoModal
                disabled
                dataSource={dataSource || []}
                handleChange={async (data: any) => {
                  const contractList = data || {};
                  if(data){
                    form.setFieldsValue({
                      contract_start_date: contractList.contract_start_date || null,
                      contract_end_date: contractList.contract_end_date || null,
                      contract_start_date_format: contractList.contract_start_date_format || null,
                      contract_end_date_format: contractList.contract_end_date_format || null,
                      actual_start_date: contractList.actual_start_date || null,
                      plan_end_date: contractList.plan_finish_date || null,
                    })
                  }else {
                    form?.setFieldsValue({
                      contract_start_date: null,
                      contract_end_date: null,
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
        'belong_year',
        'actual_start_date',
        'plan_end_date',
      ])
      .needToHide([
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
    <CrudEditModal
      title={formatMessage({ id: 'base.user.list.edit' }) + formatMessage({ id: 'yearProductPlan' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        belong_year: String(selectedRecord.belong_year)
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
        };
        /**
         * 创建一个Promise实例
         */
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateProjectAnnualPlan",
            payload,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("修改成功");
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

export default connect()(WorkLicenseRegisterEdit);
