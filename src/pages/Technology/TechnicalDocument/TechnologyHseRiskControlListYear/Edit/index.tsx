import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { Button, message } from "antd";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * HSE重大风险及控制措施清单编辑
 * @param props
 * @returns
 */
const TechnologyHseRiskControlListYearEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const [initTableData, setInitTableData] = useState<any>([]);

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "technologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearBody",
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        setInitTableData(res.rows);
      },
    });
  }, []);


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
      .needToDisabled([
        'form_make_time',
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
    <CrudEditModal
      title={"编辑HSE重大风险及控制措施清单"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={selectedRecord}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          dispatch({
            type: "technologyHseRiskControlListYear/updateTechnologyHseRiskControlListYear",
            payload: {
              ...selectedRecord,
              ...values,
              AddItems: JSON.stringify(addItems),
              UpdateItems: JSON.stringify(editItems),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.form_no)
                return result;
              }, [])),
              type_code: 0,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(TechnologyHseRiskControlListYearEdit);
