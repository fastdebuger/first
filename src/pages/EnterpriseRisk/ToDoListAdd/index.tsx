import React from "react";
import { baseModuleList, configColumns } from "./columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { Checkbox, Divider, Form, message, TreeSelect } from "antd";
import { useWbsUsers, useObsTree, useFilteredRiskUsers } from "./fetch";

const { CrudAddModal } = SingleTable;

/**
 * 新增待办事项
 * @param props
 * @constructor
 */
const AnnualAssessmentAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, funcCode, hasReportingTime = false, title } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const {
    wbsUserList,
    observationObsCode,
    setObservationObsCode
  } = useWbsUsers();


  // const { userList, setQueryParams } = useFilteredRiskUsers()
  // console.log('userList>>>', userList)
  const { responsList } = useObsTree()

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'AnnualAssessment.push_dep_code',
          subTitle: "推送项目部",
          dataIndex: "dep_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <TreeSelect
                // multiple
                showSearch
                value={observationObsCode}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                placeholder="选择层级"
                allowClear
                treeDefaultExpandAll
                treeNodeFilterProp="label"
                onChange={(value: any, label, extra) => {

                  // setQueryParams({
                  //   obs_codes: value,
                  //   wbs_codes: [],
                  // })
                  setObservationObsCode({
                    obs_code: value,
                    prop_key: extra.triggerNode.props.prop_key
                  })
                  form.setFieldsValue({
                    dep_code: value,
                    'user_code': [],
                  })
                }}
                treeData={responsList}
              />
            )
          }
        },
        // "user_code",
        {
          title: 'AnnualAssessment.push_user_code',
          subTitle: "推送用户",
          dataIndex: "user_code",
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
                          // 提取所有非禁用的 key
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
        "funcCode",
        "sys_code",
        hasReportingTime ? "report_start_date" : "",
        hasReportingTime ? "report_end_date" : "",
      ])
      .needToHide([
        "sys_code",
        "funcCode",
      ])
      .setFormColumnToSelect([
        {
          value: 'funcCode',
          name: 'moduleName',
          valueType: 'select',
          data: baseModuleList?.filter(item => item.isCustomEncoding) || [],
          valueAlias: "moduleCode"
        },
        // {
        //   value: "user_code",
        //   valueType: "multiple",
        //   name: "user_name",
        //   data: allUserListList
        // },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'report_start_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
        {
          value: 'report_end_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
      ])
      .needToRules([
        "user_code",
        "dep_code",
        "funcCode",
        "sys_code",
        hasReportingTime ? "report_start_date" : "",
        hasReportingTime ? "report_end_date" : "",
      ])
      .setSplitGroupFormColumns([
        hasReportingTime ?
          {
            columns: [
              "report_start_date",
              "report_end_date",
            ],
            title: '日期范围',
            order: 1
          } : null
      ].filter(Boolean) as any[])
      .needToDisabled([
        // "funcCode",
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
      title={title || "新增待办任务"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        sys_code: "D51",
        funcCode,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const list = baseModuleList.find(item => item.moduleCode === values.funcCode)
        const type = list?.type;
        // 发起日期填报的接口
        if (!type) {
          return new Promise(resolve => {
            message.info("请配置请求接口！")
            resolve(true)
          })
        }
        return new Promise((resolve) => {
          resolve(true);
          dispatch({
            type,//sendRiskAssessmentTask
            payload: {
              ...values,
              user_code: Array.isArray(values.user_code) ? values.user_code.join(",") : ""
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
    >
    </CrudAddModal>
  );
};

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(AnnualAssessmentAdd);
