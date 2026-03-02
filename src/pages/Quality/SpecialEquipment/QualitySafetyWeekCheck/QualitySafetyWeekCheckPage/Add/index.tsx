import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import moment from "moment";


const { CrudAddModal } = SingleTable;

/**
 * 新增特种设备每周质量安全检查记录信息
 * @param props
 * @constructor
 */
const QualitySafetyWeekCheckAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, title, special_equip_type } = props;
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
    <CrudAddModal
      title={"新增" + title}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "qualitySafetyWeekCheck/saveInfo",
            payload: {
              ...values,
              this_week: moment().format('YYYY-MM') + "/" + values.this_week,
              this_week_evaluate: Array.isArray(values.this_week_evaluate) ? values.this_week_evaluate.join(",") : values.this_week_evaluate,
              special_equip_type
            },
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

export default connect()(QualitySafetyWeekCheckAdd);
