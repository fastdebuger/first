import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { CURR_USER_CODE, CURR_USER_NAME, ErrorCode, HUA_WEI_OBS_CONFIG, WBS_CODE } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import useSysDict from "@/utils/useSysDict";

const { CrudAddModal } = SingleTable;

/**
 * 新增HSE法律法规库
 * @param props
 * @constructor
 */
const SupplierInfoAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const { configData } = useSysDict({
    filter: [
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
        // "publish_content",
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
        },
        {
          value: "element",
          valueType: "select",
          name: "element_name",
          data: [
            {
              element_name: "健康",
              element: "1",
            },
            {
              element_name: "安全",
              element: "2",
            },
            {
              element_name: "环保",
              element: "3",
            },
            {
              element_name: "综合",
              element: "4",
            },
            {
              element_name: "其他",
              element: "5",
            }
          ]
        }
      ])
      .setSplitGroupFormColumns([
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
      .needToRules([
        "file_path",
        "law_name",
        "element",
        "law_level",
        "keywords",
        "version_no",
        // "publish_content",
        "publish_date",
        "effective_date",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增HSE法律法规库"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "LegalRequirements/addLawInfo",
            payload: {
              ...values,
              wbs_code: WBS_CODE,
              currUserCode: CURR_USER_CODE,
              currUserName: CURR_USER_NAME,
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

export default connect()(SupplierInfoAdd);
