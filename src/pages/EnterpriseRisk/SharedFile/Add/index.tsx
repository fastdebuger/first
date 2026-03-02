import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudAddModal } = SingleTable;

/**
 * 新增共享文件
 * @param props
 * @constructor
 */
const SharedFileAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'ProjectRiskGovernance.committee_file',
          subTitle: "项目风险管理委员会成立文件",
          dataIndex: "committee_file",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SharedFile"
              handleRemove={() => form.setFieldsValue({ committee_file: null })}
              onChange={(file) => {
                form.setFieldsValue({ committee_file: file?.response?.url })
              }}
            />
        },
        {
          title: 'ProjectRiskGovernance.meeting_file',
          subTitle: "会议纪要文件",
          dataIndex: "meeting_file",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SharedFile"
              handleRemove={() => form.setFieldsValue({ meeting_file: null })}
              onChange={(file) => {
                form.setFieldsValue({ meeting_file: file?.response?.url })
              }}
            />
        },
        {
          title: 'ProjectRiskGovernance.project_risk_file',
          subTitle: "项目风险管理文件",
          dataIndex: "project_risk_file",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SharedFile"
              handleRemove={() => form.setFieldsValue({ project_risk_file: null })}
              onChange={(file) => {
                form.setFieldsValue({ project_risk_file: file?.response?.url })
              }}
            />
        },
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增共享文件"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "sharedFile/file",
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

export default connect()(SharedFileAdd);
