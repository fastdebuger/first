import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import type { Dispatch } from 'umi';
import { useIntl } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { message } from 'antd';
import { numberToChinese } from '@/utils/utils';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

import { configColumns } from './columns';

const { CrudAddModal } = SingleTable;

interface AddSettlementPaymentProps {
  dispatch: Dispatch;
  selectedRecord?: any;
  onSuccess?: () => void;
  style?: React.CSSProperties;
}

/**
 * 追加审核：仅用于追加下一笔审核（1→2→3→4），根据 approval_amount{x} 是否为空判断下一笔
 */
const AddSettlementPayment: React.FC<AddSettlementPaymentProps> = (props) => {
  const { dispatch, selectedRecord, onSuccess, style = {} } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [modalTitle, setModalTitle] = useState('追加审核');
  const [nextNumber, setNextNumber] = useState<number>(1);
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'report_amount',
        'approval_amount',
        {
          title: '附件',
          subTitle: '审核附件',
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
        { min: 0, value: 'approval_amount', valueType: 'digit' },
        { min: 0, value: 'report_amount', valueType: 'digit' },
      ])
      .needToRules(['approval_amount', 'report_amount'])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const handleAdd = () => {
    const next = ([1, 2, 3, 4] as const).find((i) => {
      const v = selectedRecord?.[`approval_amount${i}`];
      return v === undefined || v === null || v === '';
    });
    if (next == null) {
      Modal.warning({ title: '提示', content: '已全部审核完成，无需追加' });
      return;
    }
    setNextNumber(next);
    setInitialValues({ report_amount: 0, approval_amount: 0, file_url: undefined });
    setModalTitle(next === 4 ? '追加审计审定' : `追加${numberToChinese(next)}审审核`);
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
        追加审核
      </Button>
      {selectedRecord && (
        <CrudAddModal
          title={modalTitle}
          visible={isVisible}
          onCancel={handleCancel}
          initialValue={initialValues}
          columns={getFormColumns()}
          onCommit={(values: any) => {
            return new Promise((resolve) => {
              if (Number(values.approval_amount) > Number(values.report_amount)) {
                message.warning('审核金额不能大于上报金额');
                resolve(true);
                return;
              }
              const num = nextNumber;
              const payload: any = {
                id: selectedRecord?.id,
                number: num,
                ...values
              };
              dispatch({
                type: 'settlementManagement/updateSettlementManagement',
                payload,
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
        />
      )}
    </>
  );
};

export default connect()(AddSettlementPayment);
