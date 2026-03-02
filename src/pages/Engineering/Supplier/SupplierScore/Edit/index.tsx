import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑供应商得分
 * @param props
 * @constructor
 */
const SupplierScoreEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'id',
        'supplier_name',
        'supplier_code',
        'supplier_type',
        'product_quality',
        'service_ability',
        'contract_performance',
        'price_level',
        'market_shares',
        'technological_level',
        'integrity_management',
        'total_score',
        'delivery_amount',
        'year',
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
        {value: 'product_quality', valueType: 'digit', min: 0},
        {value: 'service_ability', valueType: 'digit', min: 0},
        {value: 'contract_performance', valueType: 'digit', min: 0},
        {value: 'price_level', valueType: 'digit', min: 0},
        {value: 'market_shares', valueType: 'digit', min: 0},
        {value: 'technological_level', valueType: 'digit', min: 0},
        {value: 'integrity_management', valueType: 'digit', min: 0},
        {value: 'total_score', valueType: 'digit', min: 0},
        {value: 'delivery_amount', valueType: 'digit', min: 0},
        {value: 'year', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "product_quality",
        "service_ability",
        "contract_performance",
        "price_level",
        "market_shares",
        "technological_level",
        "integrity_management",
        "total_score",
        "delivery_amount",
        "year",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑供应商得分"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierScore/updateSupplierScore",
            payload: {
              ...selectedRecord,
              ...values
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
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

export default connect()(SupplierScoreEdit);
