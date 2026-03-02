import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Form } from "antd";
import {
  transformOperationBehaviorData,
} from "../qualitySafetyUtils";

const { CrudEditModal } = SingleTable;

/**
 * 编辑安全监督检查问题清单
 * @param props
 * @constructor
 */
const QualitySafetyInspectionEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;

  const { formatMessage } = useIntl();
  // 创建表单实例
  const [form] = Form.useForm();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'hour_num',
      ])
      .setFormColumnToInputNumber([
        {
          value: "hour_num",
          valueType: "digit",
          min: 0
        }
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <>
      <CrudEditModal
        title={"批量填写问题清单"}
        visible={visible}
        onCancel={onCancel}
        initialValue={{}}
        columns={getFormColumns()}
        form={form}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            dispatch({
              type: "qualitySafetyInspection/updateBatchHourNum",
              payload: {
                ...values,
                ids: selectedRecord?.map(item => item.id).join(","),
              },
              callback: (res: any) => {
                resolve(true);
                // 判断编辑操作是否成功，如果成功则提示并执行回调
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
    </>
  );
};

export default connect()(QualitySafetyInspectionEdit);
