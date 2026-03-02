import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增特种设备职务配置表信息
 * @param props
 * @constructor
 */
const SEOnlineNotificationAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, special_equip_type, applicable_scenarios } = props;
  const { formatMessage } = useIntl();
  const [initData, setInitData] = useState([])

  /**
   * 获取数据
   */
  const loadData = () => {
    if (dispatch) {
      dispatch({
        type: 'SEPostConfig/getInfo',
        payload: {
          sort: 'id',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'special_equip_type', Val: special_equip_type, Operator: '=' },
            applicable_scenarios ? { Key: 'applicable_scenarios', Val: applicable_scenarios, Operator: '=' } : null,
          ].filter(Boolean))
        },
        callback: (res: any) => {
          if (res && res.rows) {
            const list = res.rows;
            setInitData(list);
          }
        },
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "parent_id",
        "post_name",
      ])
      .needToRules([
        "post_name",
      ])
      .setFormColumnToSelect([
        {
          value: 'parent_id',
          name: 'post_name',
          valueType: 'select',
          valueAlias: "id",
          data: initData.filter(item => item?.parent_id === null),
        }
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增特种设备职务配置表信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values = {}) => {
        const payload = {
          ...values,
          special_equip_type
        }
        if (applicable_scenarios) {
          Object.assign(payload, {
            applicable_scenarios
          })
        }
        return new Promise((resolve) => {
          dispatch({
            type: "SEPostConfig/saveInfo",
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

export default connect()(SEOnlineNotificationAdd);
