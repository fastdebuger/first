import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增工程占比配置
 * @param props
 * @constructor
 */
const EngineeringAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, config_type, title } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "engineering_name",
        "engineering_value",
      ])
      .setFormColumnToInputNumber([
        {
          value: "engineering_value",
          valueType: "digit"
        }
      ])
      .needToRules([
        "engineering_name",
        "engineering_value",
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
            type: "engineering/saveInfo",
            payload: {
              ...values,
              config_type
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

export default connect()(EngineeringAdd);
