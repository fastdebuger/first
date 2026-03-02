import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { CURR_USER_CODE, CURR_USER_NAME, ErrorCode, PROP_KEY } from "@/common/const";
import { message } from "antd";
import CommonPaginationSelect from "@/components/CommonList/CommonPaginationSelect";
import _ from 'lodash';

const { CrudEditModal } = SingleTable;

/**
 * 编辑用户分组
 * @param props
 * @constructor
 */
const TodoGroupEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'group_name',
        // 'push_group',
        {
          title: 'TodoGroup.push_group',
          subTitle: "用户组",
          dataIndex: "push_group",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                onChange={(_: any, values: any) => {
                  form.setFieldsValue({
                    push_groups: values.map((item: any) => ({
                      "wbs_code": item.wbs_code ?? "",
                      "user_code": item.user_code ?? "",
                    }))
                  })
                }}
                mode="multiple"
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType='common/queryUserInfo'
                payload={{
                  sort: 'user_code',
                  order: 'desc',
                  filter: JSON.stringify([
                    {
                      "Key": "other_account",
                      "Operator": "=",
                      "Val": "01"
                    },
                  ]),
                  prop_key: PROP_KEY
                }}
              />
            )
          }
        },
        'push_groups'
      ])
      .needToRules([
        "group_name",
        "push_group",
      ])
      .needToHide([
        'push_groups'
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };
  return (
    <CrudEditModal
      title={"编辑用户分组"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        push_group: (selectedRecord.push_group_code || []).map((item: any) => item.user_code),
        push_groups: (selectedRecord.push_group_code || []).map((item: any) => ({
          "wbs_code": item.wbs_code ?? "",
          "user_code": item.user_code ?? "",
        }))
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          const combinedData = {
            ...selectedRecord,
            ...values,
            currUserCode: CURR_USER_CODE,
            currUserName: CURR_USER_NAME,
            push_group: JSON.stringify(values.push_groups || []),
          };

          const payload = _.omit(combinedData, ['detailList', 'push_groups', 'push_group_name', 'push_group_code']);

          dispatch({
            type: "todoGroup/updateInfo",
            payload,
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

export default connect()(TodoGroupEdit);
