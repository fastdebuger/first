import React from "react";
import { Button, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增重要环境因素及控制措施清单
 * @param props
 * @returns
 */
const TechnologyEnvironmentalControlListYearAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'form_make_time',
      ])
      .setFormColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp', picker: 'year' },
      ])
      .needToRules([
        'form_make_time'
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        'contract_out_name',
        'level1_flow',
        'level2_flow',
        'level3_flow',
        'detail_position',
        'equipment_tool',
        'hazard_category',
        'main_consequence',
        'control_measures',
        'responsible_person',
        'responsible_unit',
        'plan_implement_time',
        'remark',
      ])
      .setTableColumnToDatePicker([
        { value: 'plan_implement_time', valueType: 'dateTs' },
      ])
      .needToRules([
        'contract_out_name',
        'level1_flow',
        'level2_flow',
        'level3_flow',
        'detail_position',
        'equipment_tool',
        'hazard_category',
        'main_consequence',
        'control_measures',
        'responsible_person',
        'responsible_unit',
        'plan_implement_time',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <Button
        type="primary"
        onClick={() => {
          handleAdd();
        }}
      >新增</Button>
    ];
  };

  return (
    <CrudAddModal
      title={"新增重要环境因素及控制措施清单"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const { addItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!addItems.length) {
            return resolve(true);
          }
          dispatch({
            type: "technologyHseRiskControlListYear/addTechnologyHseRiskControlListYear",
            payload: {
              ...values,
              Items: JSON.stringify(addItems),
              type_code: 1
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(TechnologyEnvironmentalControlListYearAdd);
