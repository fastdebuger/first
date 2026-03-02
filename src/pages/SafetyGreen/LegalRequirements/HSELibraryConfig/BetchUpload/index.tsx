import React from 'react';
import { configColumns } from '../columns';
import { BasicEditableColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { message } from 'antd';
import useSysDict from '@/utils/useSysDict';
import _ from "lodash";

const { CrudAddModal } = HeaderAndBodyTable;

interface BetchUploadProps {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  importedList: any[]
}

/**
 * 批量上传
 * @param props 
 * @returns 
 */
const BetchUploadPage: React.FC<BetchUploadProps> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    importedList = []
  } = props;

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


  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
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
          dataIndex: "file_path",
          width: 300,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/HSELegislation"
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
      .setTableColumnToDatePicker([
        {
          value: 'publish_date',
          valueType: "dateTs",
          format: 'YYYY-MM-DD',
          // needValueType: "timestamp"
        },
        {
          value: 'effective_date',
          valueType: "dateTs",
          format: 'YYYY-MM-DD',
          // needValueType: "timestamp"
        }
      ])
      .setTableColumnToSelect([
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
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  return (
    <CrudAddModal
      title={'导入HSE法律法规库'}
      visible={visible}
      onCancel={onCancel}
      initFormValues={{}}
      initDataSource={[...importedList]}
      formColumns={[]}
      tableColumns={getTableColumns()}
      toolBarRender={() => []}
      onCommit={(values: any) => {
        const { dataSource } = values;

        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          // 将不需要的字段删除
          const datas = dataSource.map((item: Record<string, any>) =>
            _.omit(item, ['id', 'key', 'isEditRow', 'isAddRow', 'RowNumber'])
          );
          debugger

          dispatch({
            type: 'LegalRequirements/saveBatch',
            payload: {
              Items: JSON.stringify(datas)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('导入成功');
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    >
    </CrudAddModal>
  );
};

export default connect()(BetchUploadPage);
