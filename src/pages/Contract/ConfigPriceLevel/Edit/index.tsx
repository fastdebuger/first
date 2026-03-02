import React from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { InputNumber, message } from 'antd';
import type { ConnectState } from '@/models/connect';
import useSysDict from '@/utils/useSysDict';

const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  selectedRecord: any
}

const IncomeEdit: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    selectedRecord
  } = props;


  const { formatMessage } = useIntl();

  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'OWNER_GROUP','PROJECT_LEVEL','CONTRACT_MODE'",
        "Operator": "in"
      }
    ]
  })

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'contract.min_price',
          dataIndex: 'min_price',
          width: 160,
          subTitle: '最小合同金额(元)',
          align: 'center',
          renderSelfForm() {
            return (
              <InputNumber
                placeholder='请输入最小合同金额(元)'
                style={{ width: "100%" }}
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: 'contract.max_price',
          dataIndex: 'max_price',
          width: 160,
          subTitle: '最大合同金额(元)',
          align: 'center',
          renderSelfForm() {
            return (
              <InputNumber
                placeholder='请输入最大合同金额(元)'
                style={{ width: "100%" }}
                min={0}
                precision={2}
              />
            )
          }
        },
        "project_level",
        "contract_mode",
        "owner_group"
      ])
      .setFormColumnToSelect([
        {
          value: 'project_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PROJECT_LEVEL || [],
          valueAlias: 'id',
        },
        {
          value: 'contract_mode',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.CONTRACT_MODE || [],
          valueAlias: 'id',
        },
        {
          value: 'owner_group',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.OWNER_GROUP || [],
          valueAlias: 'id'
        },
      ])
      .needToRules([
        // "max_price",
        // "min_price",
        "project_level",
      ]).getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  return (
    <CrudAddModal
      title={'编辑等级配置'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: 'income/updatePriceLevel',
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

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(IncomeEdit);
