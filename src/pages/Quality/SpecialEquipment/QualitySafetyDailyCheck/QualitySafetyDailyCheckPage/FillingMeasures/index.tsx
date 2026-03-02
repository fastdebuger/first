import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { ErrorCode, PROP_KEY, QUALIFIED } from "@/common/const";
import { message } from "antd";
import _ from "lodash";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 特种设备每日质量安全检查记录填报措施
 * @param props 
 * @returns 
 */
const QualitySafetyDailyCheckEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord, title, special_equip_type, allUserListList } = props;
  const { formatMessage } = useIntl();
  const [initTableData, setInitTableData] = useState<any>([]);
  // 特种设备职务
  const [postName, setPostName] = useState<any[]>([]);
  // 是否允许填写才去的防范措施 true 允许 false 不允许
  const [isPreventiveMeasures, setIsPreventiveMeasures] = useState(false)

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "QualitySafetyDailyCheck/getBody",
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'main_id', Val: selectedRecord.main_id, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        const result = res?.rows?.map((item: any) => ({
          ...item,
          risk_category_config_id: item.risk_category_config_id ? String(item.risk_category_config_id) : item.risk_category_config_id,
          control_process_config_id: item.control_process_config_id ? String(item.control_process_config_id) : item.control_process_config_id
        }))
        const isFlag = result.some(item => String(item.is_qualified) === '0' || String(item.is_qualified) === '1')
        setIsPreventiveMeasures(isFlag)
        if (!isFlag) {
          message.warning({
            content: "当前记录未填报，请填报后再完善防范措施",
            duration: 0,
            key: "is_qualified_flag"
          });
        }
        setInitTableData(result);
      },
    });

    if (allUserListList?.length === 0) {
      // 查看人员
      dispatch({
        type: "common/queryUserInfo",
        payload: {
          sort: 'user_code',
          order: 'desc',
          filter: JSON.stringify([
            { "Key": "other_account", "Operator": "=", "Val": "01" }
          ]),
          prop_key: PROP_KEY
        }
      });
    }

    // 特种设备职务配置表查询
    dispatch({
      type: "RiskControlConfig/getInfo",
      payload: {
        sort: "id",
      },
      callback: (res: any) => {
        setPostName(res?.rows?.map((item: any) => ({ ...item, id: String(item.id) })) || [])
      }
    })
  }, []);


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "preventive_measures"
      ])
      .needToDisabled([
        isPreventiveMeasures ? "" : "preventive_measures"
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        {
          title: 'SafetyRiskControl.risk_category_config_id',
          dataIndex: "risk_category_name",
          width: 240,
          editable: true,
          align: 'center',
          renderSelfEditable: (record: any, handleSave: any) => (
            <div style={{ padding: 8 }}>
              {record.risk_category_name}
            </div>
          ),
        },
        'control_process_name',
        // {
        //   title: 'SafetyRiskControl.control_process_config_id',
        //   dataIndex: "control_process_config_id",
        //   width: 240,
        //   editable: true,
        //   align: 'center',
        //   renderSelfEditable: (record: any, handleSave: any) => (
        //     <Select
        //       style={{ width: '100%' }}
        //       placeholder="请选择控制环节"
        //       allowClear
        //       showSearch
        //       optionFilterProp="dict_name"
        //       options={getChildOptions(record.risk_category_config_id)}
        //       fieldNames={{ label: "dict_name", value: "id" }}
        //       value={record.control_process_config_id || undefined}
        //       onChange={(val) => {
        //         handleSave({ ...record, control_process_config_id: val })
        //       }}
        //       disabled={!record.risk_category_config_id}
        //     />
        //   ),
        // },
        'check_result',
        'handle_result',
        'quality_officer_name',
        'remark',
      ])
      .setTableColumnToAutoComplete([
        {
          value: 'check_result',
          data: [
            {
              value: QUALIFIED,
            }
          ],
        },
      ])
      .setTableColumnToSelect([
        {
          value: 'risk_category_config_id',
          name: 'dict_name',
          valueType: 'select',
          valueAlias: "id",
          data: postName.filter(item => item.parent_id === null),
        },
        {
          value: "quality_officer",
          valueType: "select",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList
        },
      ])
      .noNeedToEditable([
        // "risk_category_config_id",
        // "control_process_config_id",
        // 'risk_category_name',
        'control_process_name',
        'check_result',
        'handle_result',
        'quality_officer_name',
        'remark',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [];
  };

  return (
    <CrudEditModal
      title={"编辑" + title}
      visible={visible}
      onCancel={() => {
        message.destroy("is_qualified_flag");
        onCancel()
      }}
      toolBarRender={toolBarRender}
      initFormValues={{
        ...selectedRecord
      }}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      renderOperator={() => <>-</>}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form?.getFieldsValue?.() || {};
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          dispatch({
            type: "QualitySafetyDailyCheck/updateInfo",
            payload: {
              ...selectedRecord,
              ...values,
              special_equip_type,
              AddItems: JSON.stringify(addItems?.map((item: any) => ({ ...item, is_qualified: item.check_result === QUALIFIED ? "1" : "0", }))),
              UpdateItems: JSON.stringify(editItems?.map((item: any) => ({ ...item, is_qualified: item.check_result === QUALIFIED ? "1" : "0", }))),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.id)
                return result;
              }, [])),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(QualitySafetyDailyCheckEdit);