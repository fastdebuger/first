import React from "react";
import { Button, message, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@yayang/constants";
import _ from "lodash"
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import { CURR_USER_CODE, CURR_USER_NAME, WBS_CODE } from "@/common/const";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增公司风险管理文件
 * @param props
 * @returns
 */
const SharedFileByTypeAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "file_type",
        "remark"
      ])
      .needToRules([
        'file_type',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };


  const getBodyTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        'file_belong',
        {
          title: 'SharedFileByType.file_path',
          dataIndex: "file_path",
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SharedFileByType"
              handleRemove={() => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  file_path: ""
                });
              }}
              onChange={(file) => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  file_path: file?.response?.url
                });
                handleSave(copyRecord)
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

  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <Space>
        <Button
          type="primary"
          onClick={() => {
            handleAdd();
          }}
        >新增</Button>
      </Space>
    ];
  };



  return (
    <CrudAddModal
      title={"新增公司风险管理文件"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getBodyTableColumns()}
      onCommit={(data: any) => {
        const { form, dataSource } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!dataSource.length) {
            message.info('请添加数据')
            return resolve(true);
          }

          const datas = dataSource.map((item: any) => _.omit(item, ["id", "key", "isEditRow", "isAddRow", "RowNumber"]))

          dispatch({
            type: "sharedFileByType/saveInfo",
            payload: {
              ...values,
              shared_wbs_code: WBS_CODE,
              shared_user_code: CURR_USER_CODE,
              Items: JSON.stringify(datas),
              currUserCode: CURR_USER_CODE,
              currUserName: CURR_USER_NAME,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(SharedFileByTypeAdd);
