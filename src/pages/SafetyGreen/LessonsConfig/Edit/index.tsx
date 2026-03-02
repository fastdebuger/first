import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import useSysDict from "@/utils/useSysDict";


const { CrudEditModal } = SingleTable;

/**
 * 编辑经验分享上传
 * @param props
 * @constructor
 */
const ExperienceEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  // console.log('selectedRecord :>> ', selectedRecord);
  const { formatMessage } = useIntl();
  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'EXPERIENCE_SHARING_CONTENT_TYPE'",
        "Operator": "in"
      }
    ]
  })

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'title',
        'content_type',
        'publish_content',
        'scene',
        'keywords',
        {
          title: 'HSELegislation.file_path',
          subTitle: "附件",
          dataIndex: "file_path",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.mp4,.m4v,.mov,.avi,.wmv,.rmvb,.flv"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={500}
              folderPath="/LegalRequirements/HSELibrary"
              handleRemove={() => form.setFieldsValue({ file_path: null })}
              onChange={(file) => {
                form.setFieldsValue({ file_path: file?.response?.url })
              }}
            />
        },
      ])
      .needToRules([
        'title',
        "content_type"
      ])
      .setFormColumnToInputTextArea([
        { value: 'publish_content' },
      ])
      .setFormColumnToSelect([
        {
          value: 'content_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.EXPERIENCE_SHARING_CONTENT_TYPE || [],
          valueAlias: 'id',
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          order: 1,
          columns: [
            "file_path"
          ]
        }
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑经验分享上传"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "experience/updateInfo",
            payload: {
              ...selectedRecord,
              ...values
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

export default connect()(ExperienceEdit);
