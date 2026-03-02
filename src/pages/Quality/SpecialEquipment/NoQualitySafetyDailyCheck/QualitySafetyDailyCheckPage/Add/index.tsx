import React, { useEffect, useState } from "react";
import { Button, message, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";
import { PROP_KEY, QUALIFIED } from "@/common/const";
import _ from "lodash"
const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增特种设备每日质量安全检查记录
 * @param props
 * @returns
 */
const QualitySafetyDailyCheckAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, special_equip_type, title, allUserListList } = props;
  const { formatMessage } = useIntl();

  // 特种设备职务
  const [postName, setPostName] = useState<any[]>([]);

  // 特种设备职务配置表查询
  useEffect(() => {
    dispatch({
      type: "RiskControlConfig/getInfo",
      payload: {
        sort: "id",
      },
      callback: (res: any) => {
        setPostName(res?.rows || [])
      }
    })

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
  }, [])

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
          data: allUserListList,
        },

      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <Space>
        <Button
          type="primary"
          onClick={() => {
            handleAdd({
              quality_officer: localStorage.getItem("auth-default-userCode")
            });
          }}
        >新增</Button>
      </Space>
    ];
  };

  return (
    <CrudAddModal
      title={"新增" + title}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const { addItems, dataSource, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!addItems.length) {
            return resolve(true);
          }
          const datas = dataSource.map((item: any) => {
            const cleanItem = _.omit(item, [
              "id",
              "key",
              "isEditRow",
              "isAddRow",
              "RowNumber"
            ]);
            return {
              ...cleanItem,
              is_qualified: item.check_result === QUALIFIED ? "1" : "0",
            };
          });
          dispatch({
            type: "QualitySafetyDailyCheck/saveInfo",
            payload: {
              ...values,
              special_equip_type,
              Items: JSON.stringify(datas)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
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
}))(QualitySafetyDailyCheckAdd);
