import React from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { CURR_USER_CODE, CURR_USER_NAME, ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Button, message, Space } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import _ from 'lodash';

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 公司风险管理文件编辑
 * @param props 
 * @returns 
 */
const SharedFileByTypeEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord } = props;
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
              value={record.file_path}
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
    <CrudEditModal
      title={"编辑公司风险管理文件"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={{
        ...selectedRecord,
      }}
      formColumns={getFormColumns()}
      tableColumns={getBodyTableColumns()}
      initDataSource={[...(selectedRecord?.detailList || [])]}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            message.info('请添加数据')
            return resolve(true);
          }
          const addItemsOmit = addItems.map((item: any) => _.omit(item, ["id", "key", "isEditRow", "isAddRow", "RowNumber"]))
          const editItemsOmit = editItems.map((item: any) => _.omit(item, ["id", "key", "isEditRow", "isAddRow", "RowNumber"]))
          const cleanedRecord = _.omit(selectedRecord, ['detailList']);

          dispatch({
            type: "sharedFileByType/updateInfo",
            payload: {
              ...cleanedRecord,
              ...values,
              AddItems: JSON.stringify(addItemsOmit),
              UpdateItems: JSON.stringify(editItemsOmit),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.id)
                return result;
              }, [])),
              currUserCode: CURR_USER_CODE,
              currUserName: CURR_USER_NAME,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(SharedFileByTypeEdit);