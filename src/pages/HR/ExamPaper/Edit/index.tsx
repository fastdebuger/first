import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑考卷管理
 * @param props
 * @constructor
 */
const ExamPaperEdit: React.FC<any> = (props) => {
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
        'wbs_code',
        'prop_key',
        'subComp',
        'dep',
        'paper_name',
        'module_code',
        'grade',
        'start_time',
        'end_time',
        'publish_status',
        'is_allow_apply',
        'total_score',
        'pass_score',
        'single_count',
        'single_score',
        'judge_count',
        'judge_score',
        'other_count',
        'other_score',
        'create_ts',
        'create_tz',
        'create_user_code',
        'create_user_name',
        'modify_ts',
        'modify_tz',
        'modify_user_code',
        'modify_user_name',
      ])
      .setFormColumnToDatePicker([
        {value: 'start_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'end_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .setFormColumnToInputNumber([
        {value: 'total_score', valueType: 'digit', min: 0},
        {value: 'pass_score', valueType: 'digit', min: 0},
        {value: 'single_count', valueType: 'digit', min: 0},
        {value: 'single_score', valueType: 'digit', min: 0},
        {value: 'judge_count', valueType: 'digit', min: 0},
        {value: 'judge_score', valueType: 'digit', min: 0},
        {value: 'other_count', valueType: 'digit', min: 0},
        {value: 'other_score', valueType: 'digit', min: 0},
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑考卷管理"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "examPaper/updateExamPaper",
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

export default connect()(ExamPaperEdit);
