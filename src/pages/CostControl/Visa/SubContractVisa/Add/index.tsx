import React, { useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { message } from 'antd';
import type { ConnectState } from '@/models/connect';
import AddExpenditureContract, { SelectedExpenditureContract } from '@/components/AddExpenditureContract';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[]
}

const MainContractProgressAdd: React.FC<Income> = (props) => {
  const {
    dispatch,
    onCancel,
    callbackAddSuccess
  } = props;

  const { formatMessage } = useIntl();
  const [record, setRecord] = useState<SelectedExpenditureContract | null>(null)

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'costControl.out_info_id',
          subTitle: "支出合同名称",
          dataIndex: "out_info_id",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <AddExpenditureContract
                record={record}
                onChange={(data) => {
                  setRecord(data);
                  if (data) {
                    form.setFieldsValue({
                      "out_info_id": data.id,
                      "branch_comp_name": data.branch_comp_name,
                      "dep_name": data.dep_name,
                      "contract_name": data.contract_name,
                      "contract_no": data.contract_no,
                      "contract_out_name": data.contract_out_name,
                      "contract_sign_date_str": data.contract_sign_date_str,
                      "contract_start_date_str": data.contract_start_date_str,
                      "contract_end_date_str": data.contract_end_date_str,
                      "contract_say_price": data.contract_say_price,
                    });
                  }
                }}
                onClear={()=>{
                  setRecord(null);
                }}
              />

            )
          }
        },
        "branch_comp_name",
        "dep_name",
        "contract_name",
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",

        'visa_code',
        'visa_major',
        'visa_content',
        'visa_budget_amount',
        'visa_date',
        {
          title: "contract.file_url",
          dataIndex: "file_url",
          subTitle: '附件',
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                // listType="text"
                // buttonType={true}
                accept=".doc,.docx,.xls,.xlsx,.pdf"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/CostControl/visaSub/MainContractVisa"
                handleRemove={() => {
                  form.setFieldsValue({ file_url: null })
                }}
                onChange={(file) => {
                  form.setFieldsValue({ file_url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      .needToHide([
        "branch_comp_name",
        "dep_name",
        "contract_name",
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
      ])
      .needToRules([
        'out_info_id',
        "visa_code",
        "visa_budget_amount",
        "visa_date",
      ])
      .setFormColumnToInputNumber([
        {
          value: "visa_budget_amount",
          valueType: "digit"
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'visa_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'out_info_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['out_info_id'],
        },
        {
          title: '附件',
          columns: ['file_url'],
        }
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };



  return (
    <>
      <CrudAddModal
        title={'新增分包合同签证'}
        visible={true}
        onCancel={onCancel}
        columns={getFormColumns()}
        initialValue={{}}
        onCommit={(values: any) => {
          return new Promise((resolve: any) => {
            dispatch({
              type: 'visaSub/addSubEngineeringVisa',
              payload: {
                ...values,
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success(formatMessage({ id: 'common.list.add.success' }));
                  setTimeout(() => {
                    callbackAddSuccess();
                  }, 200);
                }
              },
            });
          });
        }}
      >
      </CrudAddModal>

    </>
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(MainContractProgressAdd);
