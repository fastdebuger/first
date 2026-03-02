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
 * HSE法律法规版本迭代
 * @param props
 * @constructor
 */
const VersionIterationEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const { configData } = useSysDict({ // 调用系统字典 Hook 获取数据
    dispatch,
    filter: [ // 过滤条件，获取合同类型、采购方式、物资类型
      {
        "Key": "sys_type_code",
        "Val": "'LAW_LEVEL'",
        "Operator": "in"
      }
    ]
  })
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "law_name",
        "element",
        "law_level",
        "keywords",
        "version_no",
        "publish_content",
        "publish_date",
        "effective_date",
        {
          title: 'HSELegislation.file_path',
          subTitle: "附件",
          dataIndex: "file_path",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/LegalRequirements/HSELibrary"
              handleRemove={() => form.setFieldsValue({ file_path: null })}
              onChange={(file) => {
                form.setFieldsValue({ file_path: file?.response?.url })
              }}
            />
        },
      ])
      .setFormColumnToSelect([ // 设置为 Select 选择框的列
        {
          value: 'law_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.LAW_LEVEL || [],
          valueAlias: 'id',
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '描述',
          order: 1,
          columns: [
            "publish_content"
          ]
        },
        {
          title: '附件',
          order: 2,
          columns: [
            "file_path"
          ]
        }
      ])
      .setFormColumnToDatePicker([
        {
          value: 'publish_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
        {
          value: 'effective_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        }
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'publish_content'
        }
      ])
      .needToRules([
        "law_name",
        "element",
        "law_level",
        "keywords",
        "version_no",
        "publish_content",
        "publish_date",
        "effective_date",
        "file_path",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"HSE法律法规版本迭代"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        law_level: String(selectedRecord.law_level)
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "LegalRequirements/updateLawVersion",
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

export default connect()(VersionIterationEdit);
