import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";

const { CrudEditModal } = SingleTable;

/**
 * 编辑对照表
 * @param props
 * @constructor
 */
const WbsDefineCompareEdit: React.FC<any> = (props) => {
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
        "id",
        "temporary_wbs_define_code",
        "wbs_define_code",
        "wbs_define_name",
        "wbs_major_category",
        "wbs_medium_category",
        "wbs_minor_category",
        "profit_center_code",
        "profit_wbs_name",
        "profit_belong_wbs_name",
        "business_partner",
        "client_name",
        "trade_partner",
        "company_name",
        "company_size",
        "company_size_description",
        "operating_status",
        "operation_status_description",
        "project_year",
        "plan_start_time",
        "plan_finish_time",
        "project_system_status",
        "income_method",
        "fmis_self_six_code",
        "fmis_self_six_name",
        "project_level",
        "project_address",
        "project_location",
        "responsible_person",
        "contact_information",
        "main_workload",
        "inside_outside_group",
        "remark",
      ])
      .needToHide([
        'id'
      ])
      .setFormColumnToDatePicker([
        {value: 'plan_start_time', valueType: 'dateTs', needValueType: 'date', format: 'YYYY/MM/DD'},
        {value: 'plan_finish_time', valueType: 'dateTs', needValueType: 'date', format: 'YYYY/MM/DD'},
      ])
      .needToRules([
        "wbs_define_code",
        "profit_center_code",
        "business_partner",
        "income_method",
        "inside_outside_group",
      ])
      .needToDisabled([
        "wbs_define_code",
        "profit_center_code",
        "profit_wbs_name",
        "profit_belong_wbs_name",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑对照表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "wbsDefineCompare/updateWbsDefineCompare",
            payload: values,
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

export default connect()(WbsDefineCompareEdit);
