import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import CommonPaginationSelect from "@/components/CommonList/CommonPaginationSelect";
import AddEmergencyPlan from "../AddEmergencyPlan";


const { CrudEditModal } = SingleTable;

/**
 * 编辑应急预案
 * @param props
 * @constructor
 */
const EmergencyResponsibilityEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, authority } = props;
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
              <AddEmergencyPlan
                record={{ form_no: selectedRecord?.plan_config_id }}
                authority={authority}
                form={form}
              />
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
    <CrudEditModal
      title={"编辑应急预案"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "emergencyplan/updateContingencyPlanB",
            payload: {
              ...selectedRecord,
              ...values
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

export default connect()(EmergencyResponsibilityEdit);
