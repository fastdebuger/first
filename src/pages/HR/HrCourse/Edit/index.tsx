import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import {ErrorCode, HUA_WEI_OBS_CONFIG} from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import CommonSysDict from "@/components/CommonList/CommonSysDict";

const { CrudEditModal } = SingleTable;

/**
 * 编辑课程信息
 * @param props
 * @constructor
 */
const HrCourseEdit: React.FC<any> = (props) => {
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
        "wbs_code",
        "prop_key",
        "course_name",
        // "course_cover",
        {
          title: 'compinfo.course_cover',
          subTitle: "课程封面",
          dataIndex: "course_cover",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept="jpg,jpeg,png"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={10}
              folderPath="/hr/course"
              handleRemove={() => form.setFieldsValue({ course_cover: '' })}
              onChange={(file) => {
                form.setFieldsValue({ course_cover: file?.response?.url })
              }}
            />
        },
        "course_intro",
        "tree_id",
        "tree_name",
        // "course_tag",
        {
          title: "compinfo.course_tag",
          subTitle: "课程标签",
          dataIndex: "course_tag",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict isNeedColor title={'课程标签'} type={'course_tag'}/>
            )
          }
        },
        // "course_status",
        // "is_public",
        // "create_ts",
        // "create_tz",
        // "create_user_code",
        // "create_user_name",
        // "modify_ts",
        // "modify_tz",
        // "modify_user_code",
        // "modify_user_name",
      ])
      .setFormColumnToInputTextArea([
        {value: 'course_intro'}
      ])
      .setSplitGroupFormColumns([
        {title: '课程文件', columns: [
            "course_content",
            "course_cover",
          ], order: 1}
      ])
      .needToHide([
        "id",
        "wbs_code",
        "prop_key",
        "tree_id",
      ])
      .needToDisabled([
        'tree_name'
      ])
      .needToRules([
        "wbs_code",
        "prop_key",
        "course_name",
        "course_content",
        "course_cover",
        "course_intro",
        "course_category",
        "course_tag",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑课程信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrCourse/updateHrCourse",
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

export default connect()(HrCourseEdit);
