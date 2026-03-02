import React, { useEffect, useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { Alert, message } from 'antd';
const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[]
}

const MoneyRateConfigAdd: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess
  } = props;
  const { formatMessage } = useIntl();
  const [moneyRateConfigList, setMoneyRateConfigList] = useState<any>([]);
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

  useEffect(() => {
    dispatch({
      type: 'moneyRateConfig/getCurrencyExchangeRateConfig',
      payload: {
        sort: 'id',
        order: 'desc'
      },
      callback: (res: any) => {
        if (res.rows && res.rows.length > 0) {
          setMoneyRateConfigList(res.rows || []);
        }
      }
    })
  }, [])

  return (

    <CrudAddModal
      title={'新增币种汇率'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        dep_code: localStorage.getItem('auth-default-cpecc-depCode')
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          if (moneyRateConfigList.length > 0) {
            message.warning('您已配置币种汇率无法添加，请删除后重新配置！');
            resolve(true);
            return
          }
          dispatch({
            type: 'moneyRateConfig/addCurrencyExchangeRateConfig',
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

  );
};

export default connect()(MoneyRateConfigAdd);
