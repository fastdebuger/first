import React, { useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { message } from 'antd';
import type { ConnectState } from '@/models/connect';
import type { Dispatch, ISteelMemberCategoryStateType } from 'umi';
import AddExpenditureContract from '@/components/AddExpenditureContract';
import type { SelectedExpenditureContract } from '@/components/AddExpenditureContract';

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


  const [record, setRecord] = useState<SelectedExpenditureContract | null>(null)

  const { formatMessage } = useIntl();
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'contract_say_price',
        {
          title: 'compinfo.subcontractName',
          subTitle: "分包合同信息",
          dataIndex: "out_info_id",
          width: 300,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <AddExpenditureContract
                record={record}
                onChange={(data: SelectedExpenditureContract) => {
                  setRecord(data);
                  if (data) {
                    form.setFieldsValue({
                      out_info_id: data.id,
                      contract_say_price: data.contract_say_price,
                    });
                  }
                }}
                onClear={() => {
                  setRecord(null);
                }}
                width={300}
                selectedRows={{
                  out_info_id: record?.id?.toString() || '',
                  form_no: ''
                }}
                progressType={'subcontractorProgress/querySubProgressPaymentBody'}
                visaType={'visaSub/querySubEngineeringVisa'}
                showEmptyState={true}
              />
            )
          }
        },
        {
          "title": "compinfo.reportAmountSubcontractor",
          "subTitle": "分包商上报金额",
          "dataIndex": "report_amount",
          "width": 160,
          "align": "center"
        },
        {
          "title": "分包商上报日期",
          "subTitle": "分包商上报日期",
          "dataIndex": "report_date",
          "width": 160,
          "align": "center"
        },
        // {
        //   "title": "compinfo.approvalAmountDep",
        //   "subTitle": "项目部审核金额",
        //   "dataIndex": "approval_amount",
        //   "width": 160,
        //   "align": "center"
        // },
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
          value: 'out_info_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setFormColumnToDatePicker([
        { value: 'report_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToHide([
        'contract_say_price'
      ])
      .needToRules([
        'out_info_id',
        'approval_amount',
        'report_amount',
        'report_date'
      ])
      .setSplitGroupFormColumns([
        {
          title: '分包商审核',
          columns: ['report_amount', 'approval_amount', 'report_date'],
        },
        {
          title: '合同信息',
          columns: ['out_info_id', 'contract_say_price'],
        },

      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'新增分包合同结算'}
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
            type: 'subcontractorSettlement/addSubSettlementManagement',
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
