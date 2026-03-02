import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { CURR_USER_CODE, CURR_USER_NAME, ErrorCode, PROP_KEY } from "@/common/const";
import { message } from "antd";
import CommonPaginationSelect from "@/components/CommonList/CommonPaginationSelect";

const { CrudAddModal } = SingleTable;

/**
 * 新增用户分组
 * @param props
 * @constructor
 */
const TodoGroupAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
      .needToHide([
        'push_groups'
      ])
      .needToRules([
        "group_name",
        "push_group",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增用户分组"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          const payload = {
            push_group: JSON.stringify(values.push_groups),
            group_name: values.group_name,
            func_code: "",
            currUserCode: CURR_USER_CODE,
            currUserName: CURR_USER_NAME,
          };
          dispatch({
            type: "todoGroup/saveInfo",
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

export default connect()(TodoGroupAdd);
