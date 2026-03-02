import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, useIntl } from 'umi';
import { ErrorCode } from '@/common/const';
import { message } from 'antd';
import moment from 'moment'

import { configColumns } from './columns';

const { CrudAddModal } = SingleTable;

interface AddProgressPaymentProps {
  dispatch: Dispatch;
  selectedRecord?: any;
  onSuccess?: () => void;
  style?: React.CSSProperties;
}

/**
 * 审核
 * @constructor
 */
const AddProgressPayment: React.FC<AddProgressPaymentProps> = (props) => {
  const {
    dispatch,
    selectedRecord,
    onSuccess,
    style = {}
  } = props;
  // 检查 approval_schedule${selectedRecord?.number} 的值
  const approvalScheduleKey = `approval_schedule${selectedRecord?.number}`;

  const [isVisible, setIsVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [modalTitle, setModalTitle] = useState('项目部主审人审核');
  const { formatMessage } = useIntl();

  /**
   * 获取弹窗名称
   * @param num 当前修改次数
   * @returns
   */
  const getStageNameByNumber = (num: number | string | undefined) => {
    const n = Number(num);
    if (n === 2) return '项目部主审人审核';
    if (n === 3) return '项目部经营负责人审核';
    if (n === 4) return '项目经理审核';
    if (n === 5) return '分公司总经济师审核';
    if (n === 6) return '公司预结算费控中心审核';
    if (n === 7) return '华中审计审核';
    return '审核';
  };

  const getFormColumns = () => {
    // 根据当前状态确定要显示的审核阶段
    const currentNumber = selectedRecord?.number ? Number(selectedRecord.number) : 0;
    // 根据 number_status 判断：0 为修改，1 为追加
    const numberStatus = selectedRecord?.number_status;
    const targetNumber = numberStatus === '0'
      ? (currentNumber === 0 ? 1 : currentNumber)
      : (currentNumber === 0 ? 1 : currentNumber + 1);

    // 基础字段：审批进度和审批意见
    const baseColumns = ['approval_schedule', 'approval_opinion'];

    // 构建表单字段数组
    let formColumns = [...baseColumns];

    // 只有当 number 为 5、6、7 时才添加审核金额
    if (targetNumber === 5 || targetNumber === 6 || targetNumber === 7) {
      formColumns.push('approval_amount');
    }

    // 只有第7阶段才添加上报金额
    if (targetNumber === 7) {
      formColumns.push('report_amount');
    }

    const cols = new BasicFormColumns(configColumns)
      .initFormColumns(formColumns)
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
      .setFormColumnToSelect([
        {
          value: 'approval_schedule',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '审批中', value: '0' },
            { label: '审批完成', value: '1' },
          ] as any,
        },
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'approval_opinion'
        }
      ])
      .needToRules(formColumns)
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const handleAdd = () => {
    const numberStatus = selectedRecord?.number_status;
    const currentNumber = selectedRecord?.number ? Number(selectedRecord.number) : 0;

    // 判断如果为华中审计审核且已审批完那么不触发新增弹窗
    if ((numberStatus === '1' || numberStatus === null) && Number(currentNumber) === 7) {
      Modal.warning({
        title: '提示',
        content: '所有审核均已完成，无需继续审核',
      });
      return
    }

    // 如果 number_status 为 0，则是修改，显示弹窗提示并回显数据
    if (numberStatus === '0') {
      Modal.warning({
        title: '提示',
        content: '当前审核未审批完，请审批完成之后再追加下一次审核，点击知道了修改当前审核',
        onOk: () => {
          // 回显数据
          const initialData: any = {
            approval_schedule: selectedRecord?.[approvalScheduleKey] || '0',
            approval_opinion: selectedRecord[`approval_opinion${selectedRecord?.number}`] || '',
          };
          // 只有当 number 为 5、6、7 时才回显审核金额
          if (currentNumber === 5 || currentNumber === 6 || currentNumber === 7) {
            initialData.approval_amount = selectedRecord[`approval_amount${selectedRecord?.number}`] || 0;
          }
          // 只有第7阶段才回显上报金额
          if (currentNumber === 7) {
            initialData.report_amount = selectedRecord[`report_amount${selectedRecord?.number}`] || 0;
          }
          setInitialValues(initialData);
          setModalTitle(`修改${getStageNameByNumber(selectedRecord?.number)}`);
          setIsVisible(true);
        }
      });
    } else {
      // 如果 number_status 为 1，则是追加，不回显数据
      setInitialValues({});
      const nextNumber = currentNumber === 0 ? 1 : currentNumber + 1;
      console.log(nextNumber,'nextNumber');

      setModalTitle(nextNumber === 7 ? '追加华中审计审核' : `追加${getStageNameByNumber(nextNumber)}`);
      setIsVisible(true);
    }
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
        {`审核`}
      </Button>
      {selectedRecord && (<CrudAddModal
        title={modalTitle}
        visible={isVisible}
        onCancel={handleCancel}
        initialValue={initialValues}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            // 第7阶段需要验证审核金额不能大于上报金额
            const currentNumber = selectedRecord?.number ? Number(selectedRecord.number) : 0;
            const numberStatus = selectedRecord?.number_status;
            const targetNumber = numberStatus === '0'
              ? (currentNumber === 0 ? 1 : currentNumber)
              : (currentNumber === 0 ? 1 : currentNumber + 1);

            if (targetNumber === 7 && values.approval_amount && values.report_amount) {
              if (values.approval_amount > values.report_amount) {
                message.warning('审核金额不能大于上报金额');
                resolve(true);
                return;
              }
            }
            dispatch({
              type: 'subcontractorSettlement/updateSubSettlementManagement',
              payload: {
                ...values,
                approval_date: values.approval_schedule === '1' ? moment().unix() : '',
                number: numberStatus === '0' ? selectedRecord?.number : (currentNumber === 0 ? 1 : currentNumber + 1),
                id: selectedRecord?.id,
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
      />)}
    </>
  );
};

export default connect()(AddProgressPayment);
