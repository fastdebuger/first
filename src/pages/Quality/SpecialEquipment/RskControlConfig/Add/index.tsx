import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增特种设备质量安全风险管控清单配置表信息
 * @param props
 * @constructor
 */
const SEOnlineNotificationAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [initData, setInitData] = useState([])

  /**
   * 获取数据
   */
  const loadData = () => {
    if (dispatch) {
      dispatch({
        type: 'RiskControlConfig/getInfo',
        payload: {
          sort: 'id',
          order: 'asc',
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
        "dict_name",
      ])
      .needToRules([
        "dict_name",
      ])
      .setFormColumnToSelect([
        {
          value: 'parent_id',
          name: 'dict_name',
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
      title={"新增特种设备质量安全风险管控清单配置表信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values = {}) => {
        return new Promise((resolve) => {
          dispatch({
            type: "RiskControlConfig/saveInfo",
            payload: {
              ...values,
              // 判断用户是否选择父级节点
              // 如果有父节点 传控制环节 2
              // 没有父节点  传风险类别 1
              dict_type: values.parent_id ? "2" : "1",
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
    />
  );
};

export default connect()(SEOnlineNotificationAdd);
