import React, { useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { message, Form } from 'antd';
import type { ConnectState } from '@/models/connect';
import AddIncomeContract, { SelectedIncomeContract } from '@/components/AddIncomeContract';
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
    visible,
    onCancel,
    callbackAddSuccess
  } = props;
  const { formatMessage } = useIntl();

  const [record, setRecord] = useState<SelectedIncomeContract | null>(null)
  const [form] = Form.useForm()

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "contract_say_price",
        {
          title: 'costControl.contract_income_id',
          subTitle: "收入合同信息",
          dataIndex: "contract_income_id",
          width: 300,
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
                  setRecord(null);
                }}
                width={300}
                filter={[{ Key: 'progress_payment_id', Val: '0', Operator: '=' }]}
                // progressType={'costControl/queryProgressPaymentBody'}
              />
            )
          }
        },
        "prepay_approval_amount",
        "prepay_is_arrival",
        {
          title: '附件',
          subTitle: "附件",
          dataIndex: "prepay_file_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/CostControl/Progress"
              handleRemove={() => form.setFieldsValue({ file_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ prepay_file_url: file?.response?.url })
              }}
            />
        },
      ])
      .needToHide([
        "contract_say_price",
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
      .setFormColumnToInputNumber([
        {
          min: 0,
          value: 'prepay_approval_amount',
          valueType: "digit",
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['contract_income_id', 'contract_say_price'],
        },
        {
          title: '预付款',
          columns: ['prepay_approval_amount', 'prepay_is_arrival','prepay_file_url'],
        }
      ])
      .setFormColumnToSelect([
        {
          value: 'prepay_is_arrival',
          valueAlias: 'value',
          valueType: 'radio',
          name: 'label',
          data: [
            { label: '是', value: '1' },
            { label: '否', value: '0' },
          ]
        },
      ])
      .needToRules([
        'contract_income_id',
        "prepay_approval_amount",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <>
      <CrudAddModal
        form={form}
        title={'新增主合同进度款'}
        visible={visible}
        onCancel={onCancel}
        initialValue={{
          prepay_approval_amount: 0
        }}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          console.log(values, 'valuesvalues');
          if (Number(values.contract_say_price) * 10000 < Number(values.prepay_approval_amount)) {
            message.error('预付款金额不能大于合同金额');
            return new Promise((resolve) => {
              resolve(true);
            });
          }

          return new Promise((resolve) => {
            dispatch({
              type: 'costControl/addProgressPayment',
              payload: {
                ...values,
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
    </>

  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(MainContractProgressAdd);
