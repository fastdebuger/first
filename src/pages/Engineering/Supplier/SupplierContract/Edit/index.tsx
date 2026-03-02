import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑供应商合同
 * @param props
 * @constructor
 */
const SupplierContractEdit: React.FC<any> = (props) => {
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
        'year',
        'contract_no',
        'procurement_content',
        'wbs_code',
        'buyer',
        'supplier_name',
        'supplier_code',
        'supplier_type',
        'contract_amount',
        // 'create_ts',
        // 'create_tz',
        // 'create_user_code',
        // 'create_user_name',
        // 'modify_ts',
        // 'modify_tz',
        // 'modify_user_code',
        // 'modify_user_name',
      ])
      .setFormColumnToInputNumber([
        {value: 'contract_amount', valueType: 'digit', min: 0},
        {value: 'year', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        // {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        // {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToHide([
        'id',
        'year',
        'wbs_code',
      ])
      .needToDisabled([
        'contract_no',
      ])
      .needToRules([
        "year",
        "contract_no",
        "procurement_content",
        "wbs_code",
        "buyer",
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "contract_amount",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑供应商合同"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierContract/updateSupplierContract",
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

export default connect()(SupplierContractEdit);
