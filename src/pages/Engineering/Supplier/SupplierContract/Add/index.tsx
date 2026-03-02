import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增供应商合同
 * @param props
 * @constructor
 */
const SupplierContractAdd: React.FC<any> = (props) => {
  const { dispatch, visible, year, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const wbsCode = localStorage.getItem('auth-default-wbsCode');
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
        // 'id',
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
        'year',
        'wbs_code',
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
    <CrudAddModal
      title={"新增供应商合同"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: year,
        wbs_code: wbsCode
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierContract/addSupplierContract",
            payload: values,
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

export default connect()(SupplierContractAdd);
