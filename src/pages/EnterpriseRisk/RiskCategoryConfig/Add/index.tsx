import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增风险类别配置信息
 * @param props
 * @constructor
 */
const RiskCategoryConfigAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedNode } = props;
  const { formatMessage } = useIntl();
  console.log('selectedNode :>> ', selectedNode);
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "category_name",
      ])
      .needToRules([
        "category_name",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增风险类别配置信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values = {}) => {
        const payload = {
          ...values,
          // 1,2,3 都有可能
          risk_category_type: (selectedNode?.risk_category_type || 0) + 1,
        };
        if (selectedNode?.risk_category_type < 3) {
          Object.assign(payload, { parent_id: selectedNode.id })
        }
        // console.log('values :>> ', payload);
        //  return new Promise((r) => {r(!0)})
        return new Promise((resolve) => {
          dispatch({
            type: "RiskCategoryConfig/saveInfo",
            payload,
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

export default connect()(RiskCategoryConfigAdd);
