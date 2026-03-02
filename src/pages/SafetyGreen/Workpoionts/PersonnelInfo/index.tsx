import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { Form, message } from "antd";

const { CrudEditModal } = SingleTable;

/**
 * 人员维护组件
 * @param props
 * @constructor
 */
const PersonnelInfo: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, allUserListList } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm()
  // 存放维护信息
  const [maintenanceInfo, setMaintenanceInfo] = useState<any[]>([])

  // 初始化数据
  useEffect(() => {
    if (dispatch) {
      //allUserListList没有数据的时候，请求数据
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

      // 获取详情
      dispatch({
        type: "workpoionts/getDetailInfo",
        payload: {
          main_id: selectedRecord.main_id,
          sort: "main_id",
          order: 'desc',
        },
        callback: (res: any) => {
          setMaintenanceInfo(res?.rows || [])
        }
      });

    }
  }, [])

  // 查询维护人员信息
  useEffect(() => {
    if (maintenanceInfo.length > 0) {
      form.setFieldsValue({
        oneItems: maintenanceInfo.filter(f => String(f.main_workpoints) === "1").map(m => m.user_code),
        twoItems: maintenanceInfo.filter(f => String(f.main_workpoints) === "2").map(m => m.user_code),
        threeItems: maintenanceInfo.filter(f => String(f.main_workpoints) === "3").map(m => m.user_code),
      })

    }
  }, [maintenanceInfo.length])

  /**
   * 表单数据
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "oneItems",
        'twoItems',
        'threeItems',
      ])
      .setFormColumnToSelect([
        {
          value: 'oneItems',
          name: 'all_user_info',
          valueType: 'multiple',
          valueAlias: "user_code",
          data: allUserListList
        },
        {
          value: 'twoItems',
          name: 'all_user_info',
          valueType: 'multiple',
          valueAlias: "user_code",
          data: allUserListList
        },
        {
          value: 'threeItems',
          name: 'all_user_info',
          valueType: 'multiple',
          valueAlias: "user_code",
          data: allUserListList
        },
      ])
      .needToRules([
        'oneItems',
        'twoItems',
        'threeItems',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };
  return (
    <CrudEditModal
      title={"人员维护"}
      visible={visible}
      onCancel={onCancel}
      form={form}
      initialValue={{
        ...selectedRecord,

      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        console.log('values :>> ', values);
        return new Promise((resolve) => {
          dispatch({
            // 如果维护人员有数据 调用更新接口 否则调用新增接口
            type: maintenanceInfo.length > 0 ? "workpoionts/updateDetail" : "workpoionts/saveDetail",
            payload: {
              main_id: selectedRecord.main_id,
              oneItems: JSON.stringify(values.oneItems.map(o => ({ user_code: o }))),
              twoItems: JSON.stringify(values.twoItems.map(o => ({ user_code: o }))),
              threeItems: JSON.stringify(values.threeItems.map(o => ({ user_code: o }))),
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

export default connect(({ common }): any => {
  return {
    allUserListList: common?.allUserListList
  }
})(PersonnelInfo);
