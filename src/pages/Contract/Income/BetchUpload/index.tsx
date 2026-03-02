import React from 'react';
import { configColumns } from '../columns';
import { BasicEditableColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { message } from 'antd';
import useSysDict from '@/utils/useSysDict';

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
        "Val": "'OWNER_GROUP','CONTRACT_MODE','BIDDING_MODE','VALUATION_MODE','PROJECT_LEVEL','REVENUE_METHOD','CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE','PROJECT_CATEGORY','SPECIALTY_TYPE'",
        "Operator": "in"
      }
    ]
  })


  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        "wbs_code",
        "contract_no",
        "user_code",
        "owner_name",
        "owner_group",
        "owner_unit_name",
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode",
        "bidding_mode",
        "valuation_mode",
        "contract_start_date",
        "contract_end_date",
        'contract_say_price',
        'contract_un_say_price',
        "contract_sign_date",
        "project_level",
        "project_category",
        "specialty_type",
        "revenue_method",
        {
          title: 'contract.scanning_file_url',
          dataIndex: "file_url",
          width: 300,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              handleRemove={() => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  file_url: ""
                });
              }}
              onChange={(file) => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  file_url: file?.response?.url
                });
                handleSave(copyRecord)
              }}
            />
        },
        {
          title: 'contract.others_file_url',
          dataIndex: "others_file_url",
          width: 300,
          editable: true,
          align: 'center',
          renderSelfEditable: (record, handleSave) =>
            <HuaWeiOBSUploadSingleFile
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              handleRemove={() => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  others_file_url: ""
                });
              }}
              onChange={(file) => {
                const copyRecord = { ...record };
                Object.assign(copyRecord, {
                  others_file_url: file?.response?.url
                });
                handleSave(copyRecord)
              }}
            />
        },
        "remark",
        "relative_person_code",
      ])
      .setTableColumnToDatePicker([
        { value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_sign_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .setTableColumnToSelect([
        {
          value: 'owner_group',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.OWNER_GROUP || [],
          valueAlias: 'id',
        },
        {
          value: 'bidding_mode',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.BIDDING_MODE || [],
          valueAlias: 'id',
        },
        {
          value: 'contract_mode',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.CONTRACT_MODE || [],
          valueAlias: 'id'
        },
        {
          value: 'project_category',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PROJECT_CATEGORY || [],
          valueAlias: 'id',
        },
        {
          value: 'specialty_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.SPECIALTY_TYPE || [],
          valueAlias: 'id',
        },
        {
          value: 'project_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PROJECT_LEVEL || [],
          valueAlias: 'id',
        },
        {
          value: 'revenue_method',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.REVENUE_METHOD || [],
          valueAlias: 'id',
        },
        {
          value: 'valuation_mode',
          name: 'dict_name',
          valueType: "multiple",
          data: configData?.VALUATION_MODE || [],
          valueAlias: 'id',
        },
      ])
      .needToRules([
        "wbs_code",
        "contract_no",
        "user_code",
        "owner_name",
        "owner_group",
        "owner_unit_name",
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode",
        "bidding_mode",
        "valuation_mode",
        "contract_start_date",
        "contract_end_date",
        'contract_say_price',
        'contract_un_say_price',
        "contract_sign_date",
        "project_level",
        "project_category",
        "specialty_type",
        "revenue_method",
        "file_url",
        // "remark",
        "relative_person_code",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  return (
    <CrudAddModal
      title={'导入收入合同台账'}
      visible={visible}
      onCancel={onCancel}
      initFormValues={{}}
      initDataSource={[...importedList]}
      formColumns={[]}
      tableColumns={getTableColumns()}
      toolBarRender={() => []}
      onCommit={(values: any) => {
        const { dataSource } = values;
        const datas = dataSource
          .map((i: any) => {
            delete i.id;
            delete i.key;
            delete i.isEditRow;
            delete i.isAddRow;
            delete i.RowNumber;
            return i;
          })

        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }

          dispatch({
            type: 'income/batchAddIncomeInfo',
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
