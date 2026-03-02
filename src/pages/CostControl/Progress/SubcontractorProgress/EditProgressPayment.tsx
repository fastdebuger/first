import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { connect, Dispatch, useIntl } from 'umi';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { configColumns } from './columns';
import { numberToChinese } from '@/utils/utils';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';


const { CrudEditModal } = SingleTable;

interface EditProgressPaymentProps {
  dispatch: Dispatch;
  selectedRecord?: any;
  onSuccess?: () => void;
  style?: React.CSSProperties;
}

/**
 * 修改进度款组件（动态生成字段：is_arrivalX、approval_scheduleX、approval_amountX）
 * 仅当 approval_scheduleX 不为 null、undefined、空字符串时，生成对应一组字段
 */
const EditProgressPayment: React.FC<EditProgressPaymentProps> = (props) => {
  const { dispatch, selectedRecord, onSuccess, style = {} } = props;
  const [visible, setVisible] = useState(false);
  // 每次打开时递增 key，强制重挂载 Modal，避免使用上一次的 selectedRecord
  const [modalKey, setModalKey] = useState(0);
  const { formatMessage } = useIntl();

  /**
   * 计算需要渲染的序号集合
   * 只采集 approval_schedule{X} 不为 null、undefined、空字符串 且 is_arrival{X} 不为 1 的索引 X
   * @returns 按升序排序且去重后的序号集合
   */
  const getIndices = (): number[] => {
    if (!selectedRecord) return [];
    const result: number[] = [];
    Object.keys(selectedRecord).forEach((key) => {
      const match = key.match(/^approval_schedule(\d+)$/);
      if (match) {
        const idx = Number(match[1]);
        const approvalScheduleValue = selectedRecord[key];
        const isArrivalValue = selectedRecord[`is_arrival${idx}`];
        // 关键逻辑：当 approval_scheduleX 为空字符串（后台已改为空字符串替代null）或 is_arrivalX 为 1 时，则不生成对应的配置列
        if (approvalScheduleValue !== '' && approvalScheduleValue !== undefined && isArrivalValue !== '1') {
          result.push(idx);
        }
      }
    });
    // 去重并排序
    return Array.from(new Set(result)).sort((a, b) => a - b);
  };

  /**
   * 生成初始回显值
   * 根据传入的序号集合，回显 is_arrivalX、approval_scheduleX、approval_amountX
   * @param indicesInput 序号集合（来自 getIndices）
   * @returns 可用作表单 initialValue 的键值对
   */
  const buildInitialValues = (indicesInput: number[]) => {
    if (!selectedRecord) return {} as Record<string, any>;
    const init: Record<string, any> = {};
    indicesInput.forEach((i) => {
      const keys = [
        `is_arrival${i}`,
        `approval_amount${i}`,
        `file_url${i}`,
      ];
      keys.forEach((k) => {
        if (k in selectedRecord) init[k] = selectedRecord[k];
      });
    });
    return init;
  };

  /**
   * 构建表单列配置
   * 动态生成每个序号 X 对应的 4 个字段配置
   * @param indicesInput 序号集合（来自 getIndices）
   * @returns yayang-ui BasicFormColumns 生成的列配置数组
   */
  const buildColumns = (indicesInput: number[]) => {
    // 动态列的 value 列表
    const dynamicValues: { title: string; subTitle: string; dataIndex: string; width: number; align: string; }[] = [];
    indicesInput.forEach((i) => {
      dynamicValues.push({
        "title": "costControl.approval_amount",
        "subTitle": "审核金额",
        "dataIndex": `approval_amount${i}`,
        "width": 160,
        "align": "center",
      },);
      dynamicValues.push({
        "title": "costControl.is_arrival",
        "subTitle": "是否到账",
        "dataIndex": `is_arrival${i}`,
        "width": 160,
        "align": "center",
      },);
      dynamicValues.push({
        title: '附件',
        subTitle: '附件',
        dataIndex: `file_url${i}`,
        width: 160,
        align: 'center',
        renderSelfForm: (form: any) => (
          <HuaWeiOBSUploadSingleFile
            accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
            sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
            limitSize={100}
            folderPath="/CostControl/Progress"
            handleRemove={() => form.setFieldsValue({ [`file_url${i}`]: null })}
            onChange={(file: any) => {
              const url = file?.response?.url;
              form.setFieldsValue({ [`file_url${i}`]: url });
            }}
          />
        ),
      } as any);
    });

    // 若没有任何需要渲染的序号，直接返回空列定义
    if (dynamicValues.length === 0) return [] as any[];


    // 构建与新增相同风格的列定义
    const builder = new BasicFormColumns(configColumns)
      .initFormColumns(dynamicValues)
      .setFormColumnToInputNumber(
        [
          // 仅数字项：approval_amountX
          ...indicesInput.map((i) => ({ value: `approval_amount${i}`, min: 0, valueType: 'digit' as const })),
        ]
      )
      .setFormColumnToSelect(
        [
          // is_arrivalX 单选
          ...indicesInput.map((i) => ({
            value: `is_arrival${i}`,
            valueAlias: 'value',
            valueType: 'radio' as const,
            name: 'label',
            data: ([
              { label: '是', value: '1' },
              { label: '否', value: '0' },
            ] as any),
          })),
        ]
      )
      .setSplitGroupFormColumns(
        indicesInput.map((i) => ({
          title: `第${numberToChinese(i)}笔进度款`,
          columns: [
            `approval_amount${i}`,
            `approval_schedule${i}`,
            `is_arrival${i}`,
            `file_url${i}`,
          ],
          order: i,
        }))
      )
      .needToDisabled(
        // 当 approval_schedule{i} 为 '1' 时，禁用该组的审核金额与审批进度
        indicesInput
          .filter((i) => {
            const value = String((selectedRecord || {})[`approval_schedule${i}`]);
            return value === '1' || value === '0'; // 同时满足等于'1'或'0'
          })
          .flatMap((i) => ([
            { value: `approval_amount${i}`, disabled: true },
            { value: `approval_schedule${i}`, disabled: true },
          ]))
      )
      // 仅对金额、到账等字段做必填校验，附件 file_urlX 不必填
      .needToRules(
        dynamicValues
          .map((item) => item.dataIndex)
          .filter((dataIndex) => !String(dataIndex).startsWith('file_url'))
      );

    const cols: any[] = builder.getNeedColumns();
    // 设置国际化标题：按 key 前缀映射到已有的 i18n id
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  // 实时计算：不使用 useMemo，直接按当前 selectedRecord 构建
  const indices = getIndices();
  const initialValues = buildInitialValues(indices);
  const columns = buildColumns(indices);

  /**
   * 打开弹窗
   * @returns void
   */
  const handleOpen = () => {
    // 如果approval_amount1为null，那么说明没用追加的进度款，直接弹窗
    if (!selectedRecord.approval_amount1) {
      Modal.warning({
        title: '提示',
        content: '当前合同不存在进度款请先追加后再试',
      });
      return;
    }

    // 检查是否所有的 is_arrival{X} 都为 1
    const allArrivalValues: string[] = [];
    Object.keys(selectedRecord).forEach((key) => {
      const match = key.match(/^is_arrival(\d+)$/);
      if (match) {
        const value = selectedRecord[key];
        // 过滤掉空字符串（后台已改为空字符串替代null）
        if (value !== '' && value !== undefined) {
          allArrivalValues.push(String(value));
        }
      }
    });

    // 如果存在 is_arrival 字段且全部都为 '1'，则弹出警告
    if (allArrivalValues.length > 0 && allArrivalValues.every(val => val === '1')) {
      Modal.warning({
        title: '提示',
        content: '当前合同所有进度款已全部审核完毕且所有审核金额均已到账，可以继续追加进度款',
      });
      return;
    }

    setModalKey((k) => k + 1);
    setVisible(true);
  };
  /**
   * 关闭弹窗
   * @returns void
   */
  const handleCancel = () => setVisible(false);
  /**
   * 提交成功后的统一收尾
   * 关闭弹窗并触发外部成功回调
   * @returns void
   */
  const handleSuccess = () => {
    setVisible(false);
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen} style={style}>
        修改进度款
      </Button>
      {selectedRecord && (
        <CrudEditModal
          key={modalKey}
          title={`修改进度款`}
          visible={visible}
          onCancel={handleCancel}
          initialValue={initialValues}
          columns={columns}
          // 提交：调用编辑接口，成功后关闭并回调
          onCommit={(values: any) => {
            return new Promise((resolve) => {
              dispatch({
                type: 'subcontractorProgress/updateSubProgressPaymentBody',
                payload: {
                  ...values,
                  number: selectedRecord?.number,
                  form_no: selectedRecord?.form_no,
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

export default connect()(EditProgressPayment);


