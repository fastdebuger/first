import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import {
  ErrorCode,
  SERVICE_QUALITY_OPTIONS,
  QUALITY_CHECK_STATUS_OPTIONS,
} from "@/common/const";
import { Button, message } from "antd";
import SelectWeldPeopelModal from "../SelectWeldPeopelModal";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 焊工考试项目汇总编辑
 * @param props 
 * @returns 
 */
const WeldExamSummaryEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord, approvalTask } = props;
  const { formatMessage } = useIntl();

  const [initTableData, setInitTableData] = useState<any>([]);

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "workLicenseRegister/queryWelderExamBody",
      payload: {
        sort: 'worker_id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'h_id', Val: selectedRecord.h_id, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if(res.errCode === ErrorCode.ErrOk ){
          const newRos = res.rows.map((item: any) => {
            return {
              ...item,
              is_exchange: item.is_exchange + '',
              exam_result: item.exam_result,
            }
          });
          setInitTableData(newRos || []);
        }
      },
    });
  }, []);

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'plan_exam_time',
        'exam_address',
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

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    let examColums = [];
    if(approvalTask === '0'){
      examColums.push('exam_result');
    }
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
        ...examColums, // 考试结果
        'b_remark',

      ])
      .setTableColumnToDatePicker([
        { value: 'first_date', valueType: 'date', format: 'YYYY-MM-DD' },
        { value: 'valid_date', valueType: 'date', format: 'YYYY-MM-DD' },
      ])
      .setTableColumnToSelect([
        {
          value: 'is_exchange', valueAlias: 'value', valueType: 'select', name: 'label', data: QUALITY_CHECK_STATUS_OPTIONS || []
        },
        {
          value: 'exam_result', valueAlias: 'value', valueType: 'select', name: 'label', data: SERVICE_QUALITY_OPTIONS || []
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
        'exam_unit',
        'exam_project_code',
        'project_quantity',
        'plan_exam_time',
        'exam_address',
        'name',
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

  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any,_updateLoadDataSource: any, dataSource:any) => {
    return [
      <SelectWeldPeopelModal
        form={form}
        dataSource={dataSource}
        onSelect={(data: any) => {
          handleBatchAdd(data);
        }}
      />
    ];
  };

  return (
    <CrudEditModal
      title={"编辑焊工考试项目汇总"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={selectedRecord}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          console.log(editItems,"editItemseditItems");
          dispatch({
            type: "workLicenseRegister/updateWelderExam",
            payload: {
              ...selectedRecord,
              ...values,
              sub_comp_code: localStorage.getItem("auth-default-wbsCode"),
              AddItems: JSON.stringify(addItems),
              UpdateItems: JSON.stringify(editItems),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.h_id)
                return result;
              }, [])),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(WeldExamSummaryEdit);