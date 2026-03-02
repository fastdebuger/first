import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑供应商打分日期配置
 * @param props
 * @constructor
 */
const SupplierDateConfigEdit: React.FC<any> = (props) => {
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
        'upload_date_start',
        'upload_date_end',
        'score_date_start',
        'score_date_end',
      ])
      .setFormColumnToInputNumber([
        {value: 'year', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        {value: 'score_date_start', valueType: 'dateTs', needValueType: 'date'},
        {value: 'score_date_end', valueType: 'dateTs', needValueType: 'date'},
      ])
      .needToHide([
        'id'
      ])
      .needToDisabled([
        'year',
        'upload_date_start',
        'upload_date_end',
      ])
      .needToRules([
        "year",
        'upload_date_start',
        'upload_date_end',
        'score_date_start',
        'score_date_end',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑供应商打分日期配置"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierDateConfig/addSupplierDateConfig",
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

export default connect()(SupplierDateConfigEdit);
