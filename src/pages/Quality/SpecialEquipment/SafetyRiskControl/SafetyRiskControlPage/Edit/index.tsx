import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Select } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode, SYMBOLS } from "@/common/const";
import _ from "lodash"; // 引入 Lodash

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 特种设备质量安全风险管控清单编辑
 * @param props 
 * @returns 
 */
const SafetyRiskControlEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord, title, special_equip_type } = props;
  const { formatMessage } = useIntl();
  const [initTableData, setInitTableData] = useState<any>([]);
  // 特种设备职务
  const [postName, setPostName] = useState<any[]>([]);

  // 获取表格体数据
  useEffect(() => {
    if (visible && selectedRecord?.main_id) {
      dispatch({
        type: "SafetyRiskControl/getBody",
        payload: {
          sort: 'id',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'main_id', Val: selectedRecord.main_id, Operator: '=' },
          ]),
        },
        callback: (res: any) => {
          setInitTableData(_.get(res, 'rows', []));
        },
      });
    }
  }, [visible, selectedRecord]);

  // 获取配置项数据
  useEffect(() => {
    dispatch({
      type: "RiskControlConfig/getInfo",
      payload: { sort: "id" },
      callback: (res: any) => {
        setPostName(_.get(res, 'rows', []));
      }
    });
  }, []);

  // 提取父级（风险类别）
  const parentOptions = useMemo(() => {
    return _.filter(postName, (item) => !item.parent_id || String(item.parent_id) === "0");
  }, [postName]);

  // 获取对应的子级（控制环节）
  const getChildOptions = (parentId: string | number) => {
    if (_.isNil(parentId)) return [];
    return _.filter(postName, (item) => String(item.parent_id) === String(parentId));
  };

  const getTableColumns = () => {
    return new BasicEditableColumns(configColumns)
      .initTableColumns([
        {
          title: 'SafetyRiskControl.risk_category_config_id',
          dataIndex: "risk_category_config_id",
          width: 240,
          editable: true,
          align: 'center',
          renderSelfEditable: (record: any, handleSave: any) => (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择风险类别"
              options={parentOptions}
              fieldNames={{ label: "dict_name", value: "id" }}
              value={record.risk_category_config_id || undefined}
              onChange={(val) => {
                handleSave({
                  ...record,
                  risk_category_config_id: val,
                  control_process_config_id: null
                });
              }}
            />
          ),
        },
        {
          title: 'SafetyRiskControl.control_process_config_id',
          dataIndex: "control_process_config_id",
          width: 240,
          editable: true,
          align: 'center',
          renderSelfEditable: (record: any, handleSave: any) => (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择控制环节"
              allowClear
              showSearch
              optionFilterProp="dict_name"
              options={getChildOptions(record.risk_category_config_id)}
              fieldNames={{ label: "dict_name", value: "id" }}
              value={record.control_process_config_id || undefined}
              onChange={(val) => handleSave({ ...record, control_process_config_id: val })}
              disabled={!record.risk_category_config_id}
            />
          ),
        },
        // 勾选列渲染
        ...['principal', 'quality_safety_majordomo', 'quality_safety_officer'].map(field => ({
          title: formatMessage({ id: "SafetyRiskControl." + field }),
          dataIndex: field,
          width: 120,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择人员"
              allowClear
              showSearch
              options={Object.values(SYMBOLS).map(item => ({
                label: item,
                value: item
              }))}
              value={record[field] || undefined}
              onChange={(val) => handleSave({ ...record, [field]: val })}
            />
          ),
        })),
      ])
      .getNeedColumns()
      .map((col: any) => ({ ...col, title: formatMessage({ id: col.title }) }));
  };

  const toolBarRender = (handleAdd: any) => [
    <Button key="add" type="primary" onClick={() => handleAdd()}>新增</Button>
  ];

  return (
    <CrudEditModal
      title={"编辑" + title}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={selectedRecord}
      formColumns={[]}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, delItems, dataSource } = data;

        return new Promise((resolve) => {
          if (_.isEmpty(dataSource)) {
            message.warning("清单不能为空");
            return resolve(false);
          }

          // 清除无效字段
          const clean = (items: any[]) => _.map(items, (item) =>
            _.omit(item, ['key', 'isEditRow', 'isAddRow', 'RowNumber', 'risk_category_control_process_config', '_index'])
          );

          dispatch({
            type: "SafetyRiskControl/updateInfo",
            payload: {
              ...selectedRecord,
              special_equip_type,
              AddItems: JSON.stringify(clean(addItems)),
              UpdateItems: JSON.stringify(clean(editItems)),
              DelItems: JSON.stringify(_.map(delItems, 'id')),
            },
            callback: (res: any) => {
              resolve(true);
              if (_.get(res, 'errCode') === ErrorCode.ErrOk) {
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

export default connect()(SafetyRiskControlEdit);