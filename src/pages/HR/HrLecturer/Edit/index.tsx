import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import CommonSysDict from "@/components/CommonList/CommonSysDict";
import UserFetchList from "@/components/CommonList/UserFetchList";

const { CrudEditModal } = SingleTable;

/**
 * 编辑讲师表
 * @param props
 * @constructor
 */
const HrLecturerEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "id",
        "user_code",
        "user_name",
        // "lecturer_type",
        {
          title: "compinfo.lecturer_type",
          subTitle: "讲师类型",
          dataIndex: "lecturer_type",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict title={'讲师类型'} type={'lecturer_type'}/>
            )
          }
        },
        // "lecturer_level",
        {
          title: "compinfo.lecturer_level",
          subTitle: "讲师级别",
          dataIndex: "lecturer_level",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict title={'讲师级别'} type={'lecturer_level'}/>
            )
          }
        },
        "is_use",
        // "create_ts",
        // "create_tz",
        // "create_user_code",
        // "create_user_name",
        // "modify_ts",
        // "modify_tz",
        // "modify_user_code",
        // "modify_user_name",
      ])
      .needToHide([
        "id",
        'is_use'
      ])
      .needToDisabled([
        "user_code",
        "user_name",
      ])
      .needToRules([
        "user_code",
        "lecturer_type",
        "lecturer_level",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑讲师表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrLecturer/updateHrLecturer",
            payload: values,
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

export default connect()(HrLecturerEdit);
