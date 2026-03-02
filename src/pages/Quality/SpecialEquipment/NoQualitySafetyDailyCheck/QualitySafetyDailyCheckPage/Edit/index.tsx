import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { ErrorCode, PROP_KEY, QUALIFIED } from "@/common/const";
import { Button, message } from "antd";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 特种设备每日质量安全检查记录编辑
 * @param props 
 * @returns 
 */
const QualitySafetyDailyCheckEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord, title, special_equip_type, allUserListList } = props;
  const { formatMessage } = useIntl();
  const [initTableData, setInitTableData] = useState<any>([]);
  // 特种设备职务
  const [postName, setPostName] = useState<any[]>([]);

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
          risk_category_config_id: item.risk_category_config_id ? String(item.risk_category_config_id) : item.risk_category_config_id
        }))
        
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
        setPostName(res?.rows || [])
      }
    })
  }, []);


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "preventive_measures"
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
        'risk_category_config_id',
        // 'control_process_config_id',
        'check_result',
        'handle_result',
        'quality_officer',
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
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <Button
        type="primary"
        onClick={() => {
          handleAdd();
        }}
      >新增</Button>
    ];
  };

  return (
    <CrudEditModal
      title={"编辑" + title}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={{
        ...selectedRecord
      }}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems } = data;
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          dispatch({
            type: "QualitySafetyDailyCheck/updateInfo",
            payload: {
              ...selectedRecord,
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