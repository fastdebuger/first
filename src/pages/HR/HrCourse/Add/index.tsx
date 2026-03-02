import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import {ErrorCode, HUA_WEI_OBS_CONFIG} from "@/common/const";
import { message } from "antd";
import CommonSysDict from "@/components/CommonList/CommonSysDict";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudAddModal } = SingleTable;

/**
 * 新增课程信息
 * @param props
 * @constructor
 */
const HrCourseAdd: React.FC<any> = (props) => {
  const { dispatch, selectedTreeInfo, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const wbsCode = localStorage.getItem('auth-default-wbsCode') || '';
  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "";

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
    <CrudAddModal
      title={"新增课程信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        wbs_code: wbsCode,
        prop_key: propKey,
        tree_id: selectedTreeInfo.id,
        tree_name: selectedTreeInfo.full_path,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrCourse/addHrCourse",
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

export default connect()(HrCourseAdd);
