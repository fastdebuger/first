import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { Form, message } from "antd";

const { CrudEditModal } = SingleTable;

/**
 * 编辑质量奖惩情况
 * @param props
 * @constructor
 */
const RewardPunishmentEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
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
    <CrudEditModal
      form={form}
      title={"编辑质量奖惩情况"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "rewardPunishment/updateInfo",
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

export default connect()(RewardPunishmentEdit);
