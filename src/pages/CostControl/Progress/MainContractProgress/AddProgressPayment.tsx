import React, { useState } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, useIntl } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { numberToChinese } from '@/utils/utils';
import { message } from 'antd';
import AddIncomeContract from '@/components/AddIncomeContract';


import { configColumns } from './columns';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudAddModal } = SingleTable;
interface AddProgressPaymentProps {
  dispatch: Dispatch;
  selectedRecord?: any;
  onSuccess?: () => void;
  style?: React.CSSProperties;
}

/**
 * 追加进度款组件
 * @constructor
 */
const AddProgressPayment: React.FC<AddProgressPaymentProps> = (props) => {
  const {
    dispatch,
    selectedRecord,
    onSuccess,
    style = {}
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'approval_amount',
        'is_arrival',
        {
          title: '附件',
          subTitle: "附件",
          dataIndex: "file_url",
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
                form.setFieldsValue({ file_url: file?.response?.url })
              }}
            />
        },
      ])
      .setFormColumnToInputNumber([
        {
          min: 0,
          value: 'approval_amount',
          valueType: "digit",
        }
      ])
      .setFormColumnToSelect([
        {
          value: 'is_arrival',
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
        'approval_amount',
        'is_arrival',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const handleAdd = () => {
    setModalKey((k) => k + 1);
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handleSuccess = () => {
    if (onSuccess) {
      setIsVisible(false);
      onSuccess();
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleAdd} style={style}>
        追加进度款
      </Button>
      {selectedRecord && (<CrudAddModal
        title={`追加第${numberToChinese(Number(selectedRecord.number) + 1)}笔进度款`}
        visible={isVisible}
        onCancel={handleCancel}
        key={modalKey}
        initialValue={{}}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          if (Number(selectedRecord?.surplus_price) * 10000 < values.approval_amount) {
            message.error('追加金额不能大于剩余金额，当前剩余金额为' + selectedRecord?.surplus_price + '元');
            return Promise.resolve(true);
          }
          return new Promise((resolve) => {
            dispatch({
              type: 'costControl/addProgressPaymentNumber',
              payload: {
                ...values,
                maxNumber: selectedRecord.maxNumber,
                form_no: selectedRecord?.form_no,
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  handleSuccess();
                } else {
                  message.error(res.errMsg || '追加失败');
                }
              },
            });
          });
        }}
      >
        <AddIncomeContract
          record={null}
          selectedRows={{
            contract_income_id: selectedRecord.contract_income_id,
            form_no: selectedRecord.form_no,
            prepay_approval_amount: selectedRecord.prepay_approval_amount,
            prepay_is_arrival_str: selectedRecord.prepay_is_arrival_str,
            prepay_ratio: selectedRecord.prepay_ratio,
            prepay_file_url: selectedRecord.prepay_file_url,
          }}
          width={300}
          progressType={'costControl/queryProgressPaymentBody'}
          isReadonly={true}
        />
      </CrudAddModal>
      )}
    </>
  );
};

export default connect()(AddProgressPayment);
