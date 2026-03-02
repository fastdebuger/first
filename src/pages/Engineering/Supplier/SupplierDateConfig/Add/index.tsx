import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import moment from "moment";


const { CrudAddModal } = SingleTable;

/**
 * 新增供应商打分日期配置
 * @param props
 * @constructor
 */
const SupplierDateConfigAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
        // 'id',
        'year',
        "upload_date_start",
        "upload_date_end",
        // 'score_date_start',
        // 'score_date_end',
        // 'create_ts',
        // 'create_tz',
        // 'create_user_code',
        // 'create_user_name',
        // 'modify_ts',
        // 'modify_tz',
        // 'modify_user_code',
        // 'modify_user_name',
      ])
      .setFormColumnToDatePicker([
        {value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year'},
        {value: 'upload_date_start', valueType: 'dateTs', needValueType: 'date'},
        {value: 'upload_date_end', valueType: 'dateTs', needValueType: 'date'},
        // {value: 'score_date_start', valueType: 'dateTs', needValueType: 'timestamp'},
        // {value: 'score_date_end', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "year",
        "upload_date_start",
        "upload_date_end",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增供应商打分日期配置"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: moment().format("YYYY"),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierDateConfig/addSupplierDateConfig",
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

export default connect()(SupplierDateConfigAdd);
