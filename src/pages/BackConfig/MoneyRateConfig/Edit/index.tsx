import React,{ useEffect } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { message } from 'antd';
const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  selectedRecord: any
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[]
}

const MoneyRateConfigEdit: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    selectedRecord
  } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'dep_code',
        'currency',
        'exchange_rate_rmb',
        'exchange_rate_dollar',
      ])
      
      .setFormColumnToInputNumber([
        { value: 'exchange_rate_rmb', valueType: 'digit' },
        { value: 'exchange_rate_dollar', valueType: 'digit' }
      ])
      .needToHide(['dep_code'])
      .needToRules([
        'currency',
        'exchange_rate_rmb',
        'exchange_rate_dollar',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'编辑币种汇率'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        dep_code: localStorage.getItem('auth-default-cpecc-depCode')
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: 'moneyRateConfig/updateCurrencyExchangeRateConfig',
            payload: {
              ...selectedRecord,
              ...values,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('编辑成功');
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

export default connect()(MoneyRateConfigEdit);
