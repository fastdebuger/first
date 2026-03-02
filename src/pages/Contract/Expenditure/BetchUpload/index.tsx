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
    filterVal: "'CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE'",
  })

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        "contract_no",
        "obs_code",
        "user_code",
        // "income_info_wbs_code",
        'contract_type',
        // 'contract_name',
        'contract_out_name',
        "subletting_enroll_code",// 乙方单位名称
        'y_signatory_user',// 乙方签约人
        'y_site_user',// 乙方现场负责人
        // "contract_out_name",
        'contract_scope',
        'pur_way',
        'contract_start_date',
        'contract_end_date',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date',
        'materials_type',
        'remark',
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
        "relative_person_code",
        // "contract_income_id",
      ])
      .setTableColumnToInputNumber([
        { value: 'contract_say_price', valueType: 'digit' },
        { value: 'contract_un_say_price', valueType: 'digit' }
      ])
      .setTableColumnToDatePicker([
        { value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_sign_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .setTableColumnToSelect([
        {
          value: 'contract_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.CONTRACT_TYPE || [],
          valueAlias: 'id',
        },
        {
          value: 'pur_way',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PUR_WAY || [],
          valueAlias: 'id',
        },
        {
          value: 'materials_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.MATERIALS_TYPE || [],
          valueAlias: 'id',
        }
      ])
      .needToRules([
        "contract_no",
        "obs_code",
        "user_code",
        // "income_info_wbs_code",
        'contract_type',
        // 'contract_name',
        'contract_out_name',
        "subletting_enroll_code",// 乙方单位名称
        'y_signatory_user',// 乙方签约人
        'y_site_user',// 乙方现场负责人
        // "contract_out_name",
        'contract_scope',
        'pur_way',
        'contract_start_date',
        'contract_end_date',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date',
        // 'materials_type',
        // 'remark',
        "file_url",
        // "others_file_url",
        "relative_person_code",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  return (
    <CrudAddModal
      title={'导入支出合同台账'}
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
            type: 'income/batchAddOutInfo',
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
