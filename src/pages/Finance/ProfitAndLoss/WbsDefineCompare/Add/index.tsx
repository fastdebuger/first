import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";
import InfoCard from "@/pages/Contract/Expenditure/Add/InfoCard";
import AddIncomeContract from "@/components/AddIncomeContract";

const { CrudAddModal } = SingleTable;

/**
 * 新增对照表
 * @param props
 * @constructor
 */
const WbsDefineCompareAdd: React.FC<any> = (props) => {
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
        // "id",
        "temporary_wbs_define_code",
        // "wbs_define_code",
        "wbs_define_name",
        "wbs_major_category",
        "wbs_medium_category",
        "wbs_minor_category",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (val, fields) => {
              form.setFieldsValue({
                profit_center_code: val,
                profit_wbs_name: fields.profit_wbs_name,
                profit_belong_wbs_name: fields.profit_belong_wbs_name,
              })
            }
            return(
              <ProfitCenterList onChange={onChange}/>
            )
          }
        },
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
    <CrudAddModal
      title={"新增对照表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "wbsDefineCompare/addWbsDefineCompare",
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

export default connect()(WbsDefineCompareAdd);
