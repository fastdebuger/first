import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑不合格品汇总
 * @param props
 * @constructor
 */
const NonconformitySummaryEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'source',
        'notice_no',
        'level',
        'description',
        'event_time',
        'event_location',
        'disposal_result',
        'remark',
      ])
      .setFormColumnToSelect([
        { value: 'level', valueAlias: 'value', name: 'name', valueType: 'select', data: [{ value: 0, name: '一般' }, { value: 2, name: '轻微' }, { value: 1, name: '严重' }] },//0:一般,1:严重,2:轻微
      ])
      .setFormColumnToDatePicker([
        { value: 'event_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }])
      .needToRules([
        "source",
        "notice_no",
        "level",
        "description",
        "event_time",
        "event_location",
        "disposal_result",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑不合格品汇总"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "nonconformitySummary/updateTechnologyQcNonconformitySummary",
            payload: { ...selectedRecord, ...values },
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

export default connect()(NonconformitySummaryEdit);
