import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import AddEmergencyPlan from "../AddEmergencyPlan";
import CommonPaginationSelect from "@/components/CommonList/CommonPaginationSelect";


const { CrudAddModal } = SingleTable;

/**
 * 新增应急预案
 * @param props
 * @constructor
 */
const EmergencyResponsibilityAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, authority } = props;
  const { formatMessage } = useIntl();


  /**
   * 表单配置
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'emergencyplan.plan_config_id',
          subTitle: "专项应急预案名称",
          dataIndex: "plan_config_id",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <AddEmergencyPlan authority={authority} form={form} />
            )
          }
        },
        {
          title: 'emergencyplan.receiver',
          subTitle: "接收人",
          dataIndex: "receiver",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType='common/queryUserInfo'
                payload={{
                  sort: 'user_code',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "other_account", "Operator": "=", "Val": "01" }]),
                  prop_key: "branchComp"
                }}
              />
            )
          }
        },
        // "receiver_tel_num",
        {
          title: 'emergencyplan.principal',
          subTitle: "负责人",
          dataIndex: "principal",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType='common/queryUserInfo'
                payload={{
                  sort: 'user_code',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "other_account", "Operator": "=", "Val": "01" }]),
                  prop_key: "branchComp"
                }}
              />
            )
          }
        },
        // "principal_tel_num",
        {
          title: 'emergencyplan.publisher',
          subTitle: "信息发布人",
          dataIndex: "publisher",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType='common/queryUserInfo'
                payload={{
                  sort: 'user_code',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "other_account", "Operator": "=", "Val": "01" }]),
                  prop_key: "branchComp"
                }}
              />
            )
          }
        },
        // "publisher_tel_num",
        "decision_info",
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'plan_config_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setFormColumnToInputTextArea([{
        value: "decision_info"
      }])
      .needToRules([
        "plan_config_id",
        "receiver",
        "principal",
        "publisher",
        "decision_info",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增应急预案"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "emergencyplan/addContingencyPlan",
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

export default connect()(EmergencyResponsibilityAdd);
