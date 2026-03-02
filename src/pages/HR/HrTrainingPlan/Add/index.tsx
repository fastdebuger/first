import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import moment from "moment";
import CommonSysDict from "@/components/CommonList/CommonSysDict";

const { CrudAddModal } = SingleTable;

/**
 * 新增培训计划
 * @param props
 * @constructor
 */
const HrTrainingPlanAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const wbsCode = localStorage.getItem('auth-default-wbsCode') || '';
  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "";
  const currYear = moment().format("YYYY");

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
        "wbs_code",
        "prop_key",
        "year",
        "start_date",
        "plan_name",
        {
          title: "compinfo.master_organizer",
          subTitle: "主办单位",
          dataIndex: "master_organizer",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict title={'主办单位'} type={'master_organizer'}/>
            )
          }
        },
        "plan_total_persons",
        {
          title: "compinfo.plan_type",
          subTitle: "培训类型",
          dataIndex: "plan_type",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict title={'培训类型'} type={'plan_type'}/>
            )
          }
        },
      ])
      .setFormColumnToDatePicker([
        {value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year'},
        {value: 'approval_date', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .setFormColumnToInputNumber([
        {value: 'plan_total_persons', valueType: 'digit', min: 0},
      ])
      .needToHide([
        "wbs_code",
        "prop_key",
      ])
      .needToRules([
        "wbs_code",
        "prop_key",
        "year",
        "start_date",
        "plan_name",
        "master_organizer",
        "plan_total_persons",
        "plan_type",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增培训计划"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        wbs_code: wbsCode,
        prop_key: propKey,
        year: currYear,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrTrainingPlan/addHrTrainingPlan",
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

export default connect()(HrTrainingPlanAdd);
