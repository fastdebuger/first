import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import CommonSysDict from "@/components/CommonList/CommonSysDict";
import UserFetchList from "@/components/CommonList/UserFetchList";

const { CrudAddModal } = SingleTable;

/**
 * 新增讲师表
 * @param props
 * @constructor
 */
const HrLecturerAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
        // "id",
        // "user_code",
        {
          title: 'compinfo.lecturer.user_code',
          subTitle: '讲师名称',
          dataIndex: 'user_code',
          width: 160,
          align: 'center',
          renderSelfForm(form){
            const onChange = (value: any, name: string, record: any) => {
              form.setFieldsValue({
                project_organizer: name,
              })
            }
            return (
              <UserFetchList onChange={onChange}/>
            )
          }
        },
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
        'is_use'
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
    <CrudAddModal
      title={"新增讲师表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        is_use: '1'
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrLecturer/addHrLecturer",
            payload: values,
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

export default connect()(HrLecturerAdd);
