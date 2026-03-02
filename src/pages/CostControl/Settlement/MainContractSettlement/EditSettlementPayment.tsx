import React, { useState } from 'react';
import { Button, Modal, message, Select } from 'antd';
import type { Dispatch } from 'umi';
import { connect, useIntl } from 'umi';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { configColumns } from './columns';
import { numberToChinese } from '@/utils/utils';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudEditModal } = SingleTable;

const SETTLEMENT_LEVEL_NAMES: Record<number, string> = {
  1: '一审审核',
  2: '二审审核',
  3: '三审审核',
  4: '审计审定',
};

interface EditSettlementPaymentProps {
  dispatch: Dispatch;
  selectedRecord?: any;
  onSuccess?: () => void;
  style?: React.CSSProperties;
}

/**
 * 修改主合同结算：与追加审核同风格，用 CrudEditModal + BasicFormColumns；先选第几笔审核，再编辑；提交字段为 report_amount、approval_amount、file_url + number（无后缀）
 */
const EditSettlementPayment: React.FC<EditSettlementPaymentProps> = (props) => {
  const { dispatch, selectedRecord, onSuccess, style = {} } = props;
  const [visible, setVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const { formatMessage } = useIntl();

  /** 已追加的审核序号（approval_amount{x} 非空） */
  const getIndices = (): number[] => {
    if (!selectedRecord) return [];
    return ([1, 2, 3, 4] as const).filter((i) => {
      const v = selectedRecord[`approval_amount${i}`];
      return v !== undefined && v !== null && v !== '';
    });
  };

  const indices = getIndices();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '选择修改第几笔审核',
          subTitle: '选择修改第几笔审核',
          dataIndex: 'number',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              options={indices.map((i) => ({
                label: SETTLEMENT_LEVEL_NAMES[i] || `第${numberToChinese(i)}审审核`,
                value: i,
              }))}
              value={form.getFieldValue?.('number')}
              onChange={(val: number) => {
                form.setFieldsValue?.({
                  number: val,
                  report_amount: selectedRecord?.[`report_amount${val}`] ?? 0,
                  approval_amount: selectedRecord?.[`approval_amount${val}`] ?? 0,
                  file_url: selectedRecord?.[`file_url${val}`] ?? undefined,
                });
              }}
            />
          ),
        },
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
              handleRemove={() => form.setFieldsValue?.({ file_url: null })}
              onChange={(file: any) => {
                const url = file?.response?.url;
                form.setFieldsValue?.({ file_url: url });
              }}
            />
          ),
        },
      ])
      .setFormColumnToInputNumber([
        { min: 0, value: 'approval_amount', valueType: 'digit' },
        { min: 0, value: 'report_amount', valueType: 'digit' },
      ])
      .needToRules(['number', 'approval_amount', 'report_amount'])
      .getNeedColumns();
    cols.forEach((item: any) => {
      if (item.title && (item.title.startsWith('costControl.') || item.title.startsWith('compinfo.'))) {
        item.title = formatMessage({ id: item.title });
      }
    });
    return cols;
  };

  const buildInitialValues = () => {
    if (!selectedRecord || indices.length === 0) return {};
    const n = indices[0];
    return {
      number: n,
      report_amount: selectedRecord[`report_amount${n}`] ?? 0,
      approval_amount: selectedRecord[`approval_amount${n}`] ?? 0,
      file_url: selectedRecord[`file_url${n}`] ?? undefined,
    };
  };

  const handleOpen = () => {
    if (indices.length === 0) {
      Modal.warning({
        title: '提示',
        content: '当前暂无已追加的审核，请先进行追加审核',
      });
      return;
    }
    setModalKey((k) => k + 1);
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);

  const handleSuccess = () => {
    setVisible(false);
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen} style={style}>
        修改审核
      </Button>
      {selectedRecord && (
        <CrudEditModal
          key={modalKey}
          title="修改主合同结算"
          visible={visible}
          onCancel={handleCancel}
          initialValue={buildInitialValues()}
          columns={getFormColumns()}
          onCommit={(values: any) => {
            return new Promise((resolve) => {
              if (Number(values.approval_amount) > Number(values.report_amount)) {
                message.warning('审核金额不能大于上报金额');
                resolve(true);
                return;
              }
              dispatch({
                type: 'settlementManagement/updateSettlementManagement',
                payload: {
                  id: selectedRecord?.id,
                  number: values.number,
                  report_amount: values.report_amount,
                  approval_amount: values.approval_amount,
                  file_url: values.file_url,
                },
                callback: (res: any) => {
                  resolve(true);
                  if (res.errCode === ErrorCode.ErrOk) {
                    handleSuccess();
                  } else {
                    message.error(res.errMsg || '修改失败');
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

export default connect()(EditSettlementPayment);
