import React from "react";
import { configColumns } from "./columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { CURR_USER_CODE, CURR_USER_NAME, ErrorCode } from "@/common/const";
import { Checkbox, Divider, Form, message, TreeSelect } from "antd";
import { useWbsUsers } from "./fetch";
import WbsTreeSelect from "./WbsTreeSelect";
import _ from 'lodash';

const { CrudAddModal } = SingleTable;

/**
 * 公司风险管理文件
 * @param props
 * @constructor
 */
const SharedFile: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const {
    wbsUserList,
    // observationObsCode,
    // setObservationObsCode,
  } = useWbsUsers();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'SharedFileByType.shared_wbs_code',
          subTitle: "共享层级",
          dataIndex: "shared_wbs_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <WbsTreeSelect />
            )
          }
        },
        // "user_code",
        {
          title: 'SharedFileByType.shared_user_code',
          subTitle: "共享用户",
          dataIndex: "shared_user_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <TreeSelect
                style={{ width: '100%' }}
                placeholder="请选择人员"
                allowClear
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeData={wbsUserList}
                fieldNames={{
                  label: "label",
                  value: "value",
                }}
                showSearch
                filterTreeNode={(input, node) =>
                  String(node.label).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                maxTagCount={1}
                dropdownRender={(menu) => (
                  <>
                    <div style={{ padding: '4px 12px' }}>
                      <Checkbox
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const allKeys = wbsUserList
                            .filter(item => !item.disabled && item.value !== "暂无数据")
                            .map(item => item.value);
                          // 使用 form.setFieldsValue 实现一键操作
                          form.setFieldsValue({ user_code: isChecked ? allKeys : [] });
                        }}
                      >
                        全选
                      </Checkbox>
                    </div>
                    <Divider style={{ margin: '4px 0' }} />
                    {menu}
                  </>
                )}
              />
            )
          }
        },
      ])
      .needToRules([])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      form={form}
      title={"共享文件"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          // console.log("valuesvalues>>>>", values)
          const shared_user_code = Array.isArray(values.shared_user_code) ? values.shared_user_code.join(",") : "";
          const shared_wbs_code = Array.isArray(values.shared_wbs_code) ? values.shared_wbs_code.join(",") : "";
          const cleanedRecord = _.omit(selectedRecord, ['detailList']);
          // return resolve(true);
          dispatch({
            type: "sharedFileByType/updateInfo",
            payload: {
              ...cleanedRecord,
              ...values,
              shared_user_code: selectedRecord.shared_user_code + ',' + shared_user_code,
              shared_wbs_code: selectedRecord.shared_wbs_code + ',' + shared_wbs_code,
              currUserCode: CURR_USER_CODE,
              currUserName: CURR_USER_NAME,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("共享成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    >
    </CrudAddModal>
  );
};

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(SharedFile);
