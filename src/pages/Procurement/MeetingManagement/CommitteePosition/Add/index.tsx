import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import { getCurrDay } from "@/utils/utils-date";


const { CrudAddModal } = SingleTable;

/**
 * 新增委员会职务档案信息
 * @param props
 * @constructor
 */
const PositionAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
        'position_code',
        'position_name',
        'isSecretary',
        'create_time',
        'create_person',
      ])
      .needToHide([
        "dep_code",
        'create_time',
        'create_person',
      ])
      .needToDisabled([
        'dep_name'
      ])
      .setFormColumnToDatePicker([
        { value: 'create_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToSelect([
        {
          value: 'isSecretary',
          valueAlias: 'value',
          name: 'label',
          valueType: 'select',
          data: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ]
        },
      ])
      .needToRules([
        'dep_name',
        "position_code",
        "position_name",
        "isSecretary",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增委员会职务档案信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        dep_name: localStorage.getItem('auth-default-wbsName'),
        dep_code: localStorage.getItem('auth-default-wbsCode'),
        create_time: getCurrDay(),
        create_person: localStorage.getItem('auth-default-userName'),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "position/addPosition",
            payload: values,
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

export default connect()(PositionAdd);
