import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import moment from "moment";


const { CrudEditModal } = SingleTable;

/**
 * 编辑特种设备每周质量安全检查记录信息
 * @param props
 * @constructor
 */
const QualitySafetyWeekCheckEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, title, special_equip_type } = props;
  const { formatMessage } = useIntl();


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'this_week',
        'last_week_question',
        'this_week_question',
        'this_week_evaluate',
        'next_week_task',
        "remark",
      ])
      .setFormColumnToInputNumber([
        { value: 'this_week', valueType: 'digit', min: 0, max: 5 },
      ])
      .setFormColumnToSelect([
        {
          value: 'this_week_evaluate',
          valueType: "select",
          name: "this_week_evaluate",
          data: [
            {
              this_week_evaluate: "质量安全风险可控，无较大质量安全风险隐患",
            },
            {
              this_week_evaluate: "存在质量安全风险隐患，需尽快采取防范措施",
            }
          ]
        },
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'last_week_question',
        },
        {
          value: 'this_week_question',
        },
        {
          value: 'next_week_task',
        },
        {
          value: 'remark',
        },
      ])
      .needToRules([
        'this_week',
        'last_week_question',
        'this_week_question',
        'this_week_evaluate',
        'next_week_task',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑" + title}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        this_week: selectedRecord.this_week?.split("/")?.at(-1),
        this_week_evaluate: selectedRecord.this_week_evaluate ? selectedRecord.this_week_evaluate.split(",") : selectedRecord.this_week_evaluate,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "qualitySafetyWeekCheck/updateInfo",
            payload: {
              ...selectedRecord,
              ...values,
              special_equip_type,
              this_week: moment().format('YYYY-MM') + "/" + values.this_week,
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

export default connect()(QualitySafetyWeekCheckEdit);
