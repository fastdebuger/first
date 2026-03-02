import React from "react";
import { Button, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增供应商合同得分
 * @param props
 * @returns
 */
const SupplierContractScoreAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'h_id',
        'wbs_code',
        'year',
        'phone_number',
        'create_ts',
        'create_tz',
        'create_user_code',
        'create_user_name',
        'modify_ts',
        'modify_tz',
        'modify_user_code',
        'modify_user_name',
      ])
      .setFormColumnToInputNumber([
        {value: 'year', valueType: 'digit', min: 0},
        {value: 'phone_number', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "wbs_code",
        "year",
        "phone_number",
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
        'h_id',
        'id',
        'contract_id',
        'product_quality',
        'service_ability',
        'contract_performance',
        'price_level',
        'technological_level',
        'integrity_management',
        'total_score',
        'delivery_amount',
      ])
      .setTableColumnToInputNumber([
        {value: 'product_quality', valueType: 'digit', min: 0},
        {value: 'service_ability', valueType: 'digit', min: 0},
        {value: 'contract_performance', valueType: 'digit', min: 0},
        {value: 'price_level', valueType: 'digit', min: 0},
        {value: 'technological_level', valueType: 'digit', min: 0},
        {value: 'integrity_management', valueType: 'digit', min: 0},
        {value: 'total_score', valueType: 'digit', min: 0},
        {value: 'delivery_amount', valueType: 'digit', min: 0},
      ])
      .needToRules([
        "contract_id",
        "product_quality",
        "service_ability",
        "contract_performance",
        "price_level",
        "technological_level",
        "integrity_management",
        "total_score",
        "delivery_amount",
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
      title={"新增供应商合同得分"}
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
            type: "supplierContractScore/addSupplierContractScoreHead",
            payload: {
              ...values,
              Items: JSON.stringify(addItems)
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

export default connect()(SupplierContractScoreAdd);
