import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Select, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";
import _ from "lodash";
import { SYMBOLS } from "@/common/const";

const { CrudAddModal } = HeaderAndBodyTable;

const SafetyRiskControlAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, special_equip_type, title } = props;
  const { formatMessage } = useIntl();

  // 原始配置数据
  const [postName, setPostName] = useState<any[]>([]);

  // 获取配置表数据
  useEffect(() => {
    dispatch({
      type: "RiskControlConfig/getInfo",
      payload: { sort: "id" },
      callback: (res: any) => {
        setPostName(_.get(res, 'rows', []));
      }
    });
  }, []);

  // 提取父级选项：风险类别
  const parentOptions = useMemo(() => {
    return _.filter(postName, (item) => !item.parent_id || String(item.parent_id) === "0");
  }, [postName]);

  // 动态获取子级选项：控制环节
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
          align: "center",
          width: 260,
          editable: true,
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
                  control_process_config_id: null // 切换父级清理子级
                });
              }}
            />
          ),
        },
        {
          title: 'SafetyRiskControl.control_process_config_id',
          dataIndex: "control_process_config_id",
          width: 260,
          align: "center",
          editable: true,
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
        // 复选框列：主要负责人、质量安全总监、质量安全员  ★主管；●主相关；○相关
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
          )
        })),
      ])
      .getNeedColumns()
      .map((col: any) => ({ ...col, title: formatMessage({ id: col.title }) }));
  };

  const toolBarRender = (handleAdd: any) => [
    <Space key="action">
      <Button type="primary" onClick={() => handleAdd()}>新增</Button>
    </Space>
  ];

  return (
    <CrudAddModal
      title={"新增" + title}
      visible={visible}
      onCancel={onCancel}
      formColumns={[]}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const dataSource = _.get(data, 'dataSource', []);

        return new Promise((resolve) => {
          if (_.isEmpty(dataSource)) return resolve(true);

          // 根据 风险类别ID + 控制环节ID 组合判断
          // 排除掉没有填写的行，只校验已选的数据
          const validItems = _.filter(dataSource, item => item.risk_category_config_id);
          // 去重
          const uniqueItems = _.uniqBy(validItems, item =>
            `${item.risk_category_config_id}-${item.control_process_config_id}`
          );

          if (uniqueItems.length < validItems.length) {
            message.error("存在重复的风险类别与控制环节配置，请检查！");
            return resolve(true);
          }

          const cleanItems = _.map(dataSource, (item) => {
            const omited = _.omit(item, [
              'id', 'key', 'isEditRow', 'isAddRow', 'RowNumber',
              'risk_category_control_process_config', '_index'
            ]);
            return omited;
          });

          dispatch({
            type: "SafetyRiskControl/saveInfo",
            payload: {
              special_equip_type,
              Items: JSON.stringify(cleanItems)
            },
            callback: (res: any) => {
              if (_.get(res, 'errCode') === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                  resolve(true);
                }, 500);
              } else {
                resolve(false);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(SafetyRiskControlAdd);