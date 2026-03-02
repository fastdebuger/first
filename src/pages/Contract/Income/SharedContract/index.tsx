import React from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { message } from 'antd';
import WbsTreeSelect from './WbsTreeSelect';

const { CrudAddModal } = SingleTable;

interface SharedContractProps {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  selectedRecord: any
}

/**
 * 共享主合同
 * @param props 
 * @returns 
 */
const SharedContract: React.FC<SharedContractProps> = (props) => {
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
        {
          title: 'contract.shared_dep_code',
          subTitle: "项目部",
          width: 160,
          align: 'center',
          dataIndex: "shared_dep_code",
          renderSelfForm: () => <WbsTreeSelect />
        },
      ])

      .needToRules([
        "shared_dep_code",
      ])
      .getNeedColumns();

    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'共享主合同'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const shared_dep_code = Array.isArray(values?.shared_dep_code) ? values?.shared_dep_code.join(",") : values?.shared_dep_code
        const payload = {
          //  selectedRecord.dep_code + "," +
          items_dep_code: shared_dep_code,
          id: selectedRecord.id
        }
        return new Promise((resolve) => {
          dispatch({
            type: 'income/synContractIncomeInfo',
            payload,
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

export default connect()(SharedContract);
