import React, { useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { message } from 'antd';
import type { ConnectState } from '@/models/connect';
import AddIncomeContract from '@/components/AddIncomeContract';
import { SelectedIncomeContract } from '@/components/AddIncomeContract';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { HUA_WEI_OBS_CONFIG } from '@/common/const';

const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[]
}

const MainContractSettlementAdd: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess
  } = props;
  const [record, setRecord] = useState<SelectedIncomeContract | null>(null)

  const { formatMessage } = useIntl();
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'contract_say_price',
        {
          title: 'costControl.contract_income_id',
          subTitle: "项目经理",
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
                      contract_income_id: data.id,
                      contract_say_price: data.contract_say_price,
                    });
                  }
                }}
                onClear={() => {
                  setRecord(null)
                }}
                width={300}
                selectedRows={{
                  contract_income_id: record?.id?.toString() || '',
                  form_no: ''
                }}
                progressType={'costControl/queryProgressPaymentBody'}
                visaType={'visa/queryEngineeringVisa'}
                showEmptyState={true}
              />
            )
          }
        },
        'report_amount',
        'approval_amount',
        {
          title: '附件',
          subTitle: '一审审核附件',
          dataIndex: 'file_url',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/CostControl/Settlement"
              handleRemove={() => form.setFieldsValue({ file_url: null })}
              onChange={(file: any) => {
                const url = file?.response?.url;
                form.setFieldsValue({ file_url: url });
              }}
            />
          ),
        },
      ])
      .setFormColumnToInputNumber([
        {
          min: 0,
          value: 'approval_amount',
          valueType: "digit",
        },
        {
          min: 0,
          value: 'report_amount',
          valueType: "digit",
        }
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
      .needToHide([
        'contract_say_price'
      ])
      .setSplitGroupFormColumns([
        {
          title: '一审审核',
          columns: ['report_amount', 'approval_amount', 'file_url'],
        },
        {
          title: '合同信息',
          columns: ['contract_income_id', 'contract_say_price'],
        },

      ])
      .needToRules([
        'contract_income_id',
        'approval_amount',
        'report_amount'
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'新增主合同结算'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        approval_amount: 0,
        report_amount: 0
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          if (values.approval_amount > values.report_amount) {
            message.warning('审核金额不能大于上报金额');
            resolve(true);
            return
          }
          dispatch({
            type: 'settlementManagement/addSettlementManagement',
            payload: {
              ...values,
              number: 1
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('新增成功');
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(MainContractSettlementAdd);
