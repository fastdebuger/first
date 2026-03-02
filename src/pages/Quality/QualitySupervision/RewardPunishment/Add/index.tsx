import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { Form, message } from "antd";

const { CrudAddModal } = SingleTable;

/**
 * 新增质量奖惩情况
 * @param props
 * @constructor
 */
const RewardPunishmentAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // "second_level_unit",
        "reward_punish_type",
        "stat_period",
        "reward_amount",
        "reward_reason",
        "punish_amount",
        "punish_reason",
      ])
      .setFormColumnToSelect([
        {
          value: 'reward_punish_type',
          name: 'reward_punish_type_str',
          valueType: 'select',
          data: [
            {
              reward_punish_type_str: "内部",
              reward_punish_type: "内部",
            },
            {
              reward_punish_type_str: "外部",
              reward_punish_type: "外部",
            },
          ],
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'stat_period',
          valueType: 'dateTs',
          needValueType: 'date',
          picker: "month"
        },
      ])
      .setFormColumnToInputNumber([
        {
          value: "reward_amount",
          valueType: "digit"
        },
        {
          value: "punish_amount",
          valueType: "digit"
        },
      ])
      .needToRules([
        "reward_punish_type",
        "stat_period",
        // "reward_amount",
        // "reward_reason",
        // "punish_amount",
        // "punish_reason",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      form={form}
      title={"新增质量奖惩情况"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        reward_amount: 0,
        punish_amount: 0
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        // 数据值为undefined和null设置为""
        for (const key in values) {
          if (!Object.hasOwn(values, key)) continue;
          const element = values[key];
          if (element === undefined || element === null) {
            values[key] = ""
          }
        }
        // 如果是项目部需要处理二级单位
        values.second_level_unit = PROP_KEY === 'dep' && WBS_CODE ? WBS_CODE?.split('.').slice(0, 2).join('.') : WBS_CODE
        return new Promise((resolve) => {
          dispatch({
            type: "rewardPunishment/saveBatch",
            payload: {
              Items: JSON.stringify([values])
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

export default connect()(RewardPunishmentAdd);
