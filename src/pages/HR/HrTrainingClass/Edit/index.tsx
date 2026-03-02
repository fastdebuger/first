import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";

const { CrudEditModal } = SingleTable;

/**
 * 编辑培训班
 * @param props
 * @constructor
 */
const HrTrainingClassEdit: React.FC<any> = (props) => {
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
        "wbs_code",
        "prop_key",
        "plan_id",
        "year",
        "organizer",
        "class_name",
        "training_target",
        "training_type",
        "start_time",
        "end_time",
        "monitor",
        "create_ts",
        "create_tz",
        "create_user_code",
        "create_user_name",
        "modify_ts",
        "modify_tz",
        "modify_user_code",
        "modify_user_name",
      ])
      .setFormColumnToDatePicker([
        {value: 'year', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'start_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'end_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "wbs_code",
        "prop_key",
        "plan_id",
        "year",
        "organizer",
        "class_name",
        "training_target",
        "training_type",
        "monitor",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑培训班"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrTrainingClass/updateHrTrainingClass",
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

export default connect()(HrTrainingClassEdit);
