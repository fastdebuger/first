import React, { useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG, PROP_KEY } from '@/common/const';
import { message } from 'antd';
import type { ConnectState } from '@/models/connect';
import AddIncomeContract, { SelectedIncomeContract } from '@/components/AddIncomeContract';
import UserSelect from '@/components/UserSelect';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';

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
  const [record, setRecord] = useState<SelectedIncomeContract | null>(null)
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'costControl.contract_income_id',
          subTitle: "收入合同信息",
          dataIndex: "contract_income_id",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <AddIncomeContract
                record={record}
                onChange={(data) => {
                  setRecord(data);
                  if (data) {
                    form.setFieldsValue({
                      "contract_income_id": data.id,
                      "branch_comp_name": data.branch_comp_name,
                      "dep_name": data.dep_name,
                      "wbs_code": data.wbs_code,
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
                width={300}
              />
            )
          }
        },
        "branch_comp_name",
        "dep_name",
        "wbs_code",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "visa_code",
        "visa_major",
        "visa_content",
        "visa_budget_amount",
        {
          title: 'costControl.visa_prepared_by',
          subTitle: '编制人',
          dataIndex: 'visa_prepared_by',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <UserSelect
              placeholder="请选择编制人"
              modalTitle="选择编制人"
              value={form.getFieldValue?.('visa_prepared_by')}
              onChange={(name) => {
                console.log(name,'visa_prepared_by');

                form.setFieldsValue({ visa_prepared_by: name });
              }}
            />
          ),
        },
        {
          title: 'costControl.visa_agent_by',
          subTitle: '经办人',
          dataIndex: 'visa_agent_by',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <UserSelect
              placeholder="请选择经办人"
              modalTitle="选择经办人"
              value={form.getFieldValue?.('visa_agent_by')}
              onChange={(name) => {
                form.setFieldsValue({ visa_agent_by: name });
              }}
            />
          ),
        },
        "reporting_date",
        "visa_date",
        // "file_url",
        {
          title: "contract.file_url",
          dataIndex: "file_url",
          subTitle: "附件",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            console.log('form :>> ', form);
            return (
              <HuaWeiOBSUploadSingleFile
                // listType="text"
                // buttonType={true}
                accept=".doc,.docx,.xls,.xlsx,.pdf"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/CostControl/Visa/MainContractVisa"
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
      .setFormColumnToInputNumber([
        {
          value: "visa_budget_amount",
          valueType: "digit"
        },
        {
          value: "visa_review_amount",
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
        {
          value: 'reporting_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
      ])
      .needToHide([
        "branch_comp_name",
        "dep_name",
        "wbs_code",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
      ])
      .needToRules([
        'contract_income_id',
        "visa_code",
        "visa_budget_amount",
        "visa_review_amount",
        "visa_prepared_by",
        "visa_agent_by",
        "reporting_date",
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'contract_income_id',
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
          columns: ['contract_income_id'],
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
        title={'新增主合同签证'}
        visible={true}
        onCancel={onCancel}
        columns={getFormColumns()}
        initialValue={{}}
        onCommit={(values: any) => {
          return new Promise((resolve: any) => {
            dispatch({
              type: 'visa/addEngineeringVisa',
              payload: {
                ...values
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
