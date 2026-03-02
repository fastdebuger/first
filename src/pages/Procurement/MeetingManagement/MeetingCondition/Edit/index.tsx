import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑会议上会条件设置
 * @param props
 * @constructor
 */
const ConfigEdit: React.FC<any> = (props) => {
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
        'dep_name',
        'dep_code',
        'meeting_type',
        'meeting_item',
        'start_price',
        'end_price',
        'remark',
      ])
      .needToHide([
        "dep_code",
      ])
      .needToDisabled([
        'dep_name'
      ])
      .setFormColumnToSelect([
        {
          value: 'meeting_type',
          valueAlias: 'value',
          name: 'label',
          valueType: 'select',
          data: [
            { label: 'TC会议', value: 1 },
            { label: '执行董事会议', value: 2 },
          ]
        },
      ])
      .needToRules([
        "dep_code",
        "meeting_type",
        "meeting_item",
        "start_price",
        "end_price",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑会议上会条件设置"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        meeting_type: String(selectedRecord.meeting_type)
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "config/updateConfig",
            payload: {
              ...selectedRecord,
              ...values,
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

export default connect()(ConfigEdit);
