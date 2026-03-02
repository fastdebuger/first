import React from "react";
import { Button, Select, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import {
  ErrorCode,
  SERVICE_QUALITY_OPTIONS,
  QUALITY_CHECK_STATUS_OPTIONS,
} from "@/common/const";
import SelectWeldPeopelModal from "../SelectWeldPeopelModal";
const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增焊工考试项目汇总
 * @param props
 * @returns
 */
const WeldExamSummaryAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'plan_exam_time', // 计划考试时间
        'exam_address', // 考试地点
        'remark',
      ])
      .setFormColumnToDatePicker([
        { value: 'plan_exam_time', valueType: 'dateTs', needValueType: 'date' },
      ])
      .needToRules([
        'plan_exam_time',
        'exam_address',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        'name',
        "gender",
        "education_str",
        "id_card",
        'phone',
        'first_date',
        'exam_type',
        'valid_project',
        'valid_date',
        'is_exchange', // 是否换取项目
        'b_remark',

      ])
      .setTableColumnToDatePicker([
        { value: 'valid_date', valueType: 'date', format: 'YYYY-MM-DD' },
        { value: 'first_date', valueType: 'date', format: 'YYYY-MM-DD' },
      ])
      .setTableColumnToSelect([
        {
          value: 'is_exchange',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: QUALITY_CHECK_STATUS_OPTIONS || []
        },
        {
          value: 'exam_result', 
          valueType: 'select', 
          name: 'label',
          valueAlias: 'value',
          data: SERVICE_QUALITY_OPTIONS || []
        },
      ])
      .noNeedToEditable([
        'name',
        "gender",
        "education_str",
        "id_card",
        'phone',
      ])
      .needToRules([
        'name',
        "gender",
        "education_str",
        "id_card",
        'first_date',
        'exam_type',
        'valid_project',
        'valid_date',
        'is_exchange',
        'exam_result',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <SelectWeldPeopelModal
        form={form}
        onSelect={(data: any) => {
          handleBatchAdd(data);
        }}
      />
    ]
  };

  return (
    <CrudAddModal
      title={"新增焊工考试项目汇总"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const { addItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!addItems.length) {
            return resolve(true);
          }
          dispatch({
            type: "workLicenseRegister/addWelderExam",
            payload: {
              ...values,
              sub_comp_code: localStorage.getItem("auth-default-wbsCode"),
              Items: JSON.stringify(addItems)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(WeldExamSummaryAdd);
