import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import FocusPaginationSelect from '@/components/CommonList/FocusSelect';


const { CrudEditModal } = SingleTable;

/**
 * 编辑焊工人员台账
 * @param props
 * @constructor
 */
const WeldPersonLedgerEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'employee_number',
        'name',
        'phone',
        'current_unit',
        // {
        //   title: 'compinfo.employment_type',
        //   subTitle: "用工形式",
        //   dataIndex: "employment_type",
        //   width: 160,
        //   align: 'center',
        //   renderSelfForm: (form: any) => {
        //     return (
        //       <FocusPaginationSelect
        //         fetchType='contractBasic/getSysDict'
        //         payload={{
        //           sort: 'id',
        //           order: 'asc',
        //           filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "EMPLOYMENT_TYPE", "Operator": "=" }]),
        //         }}
        //         fieldNames={{ label: 'dict_name', value: 'id' }}
        //         placeholder="请选择用工形式"
        //         optionFilterProp={'dict_name'}

        //       />
        //     )
        //   }
        // },
        'gender',
        {
          title: 'compinfo.nation',
          subTitle: "民族",
          dataIndex: "nation",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "CHINESE_NATIONALITY", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择民族"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        // {
        //   title: 'compinfo.operation_project',
        //   subTitle: "作业项目",
        //   dataIndex: "operation_project",
        //   width: 160,
        //   align: 'center',
        //   renderSelfForm: (form: any) => {
        //     return (
        //       <FocusPaginationSelect
        //         mode='multiple'
        //         fetchType='contractBasic/getSysDict'
        //         payload={{
        //           sort: 'id',
        //           order: 'asc',
        //           filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "OPERATION_PROJECT", "Operator": "=" }]),
        //         }}
        //         fieldNames={{ label: 'dict_name', value: 'id' }}
        //         placeholder="请选择作业项目"
        //         optionFilterProp={'dict_name'}

        //       />
        //     )
        //   }
        // },
        {
          title: 'compinfo.education',
          subTitle: "文化程度",
          dataIndex: "education",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "EDUCATION", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择文化程度"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        {
          title: 'compinfo.skill_level',
          subTitle: "职业技能等级",
          dataIndex: "skill_level",
          width: 160,
          align: 'center',
          renderSelfForm: (_form: any) => {
            return (
              <FocusPaginationSelect
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "SKILL_LEVEL", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择职业技能等级"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        'id_card',
        'address',
        'work_start_date',
        'work_years',
        'first_date',
        'remark'
      ])
      .setFormColumnToDatePicker([
        { value: 'work_start_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'first_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .setFormColumnToSelfColSpan([
        { value: 'first_date', colSpan: 8, labelCol: { span: 11 }, wrapperCol: { span: 13 } },

      ])
      .setFormColumnToInputTextArea([
        { value: 'remark' }
      ])
      .setFormColumnToSelect([
        {
          value: 'gender', valueType: 'select', name: 'gender_str', data: [
            { gender: '男', gender_str: '男' },
            { gender: '女', gender_str: '女' },
          ]
        }
      ])
      .setFormColumnToInputNumber([
        { value: 'work_years', valueType: 'digit' },
      ])
      .needToRules([
        "employee_number",
        "name",
        "phone",
        "current_unit",
        // "employment_type",
        "gender",
        "nation",
        // "operation_project",
        "education",
        "skill_level",
        "id_card",
        "address",
        "work_start_date",
        "work_years",
        'first_date',

      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑焊工人员台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        // operation_project: selectedRecord?.operation_project ? JSON.parse(selectedRecord?.operation_project) : []
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateWelderInfo",
            payload: {
              ...selectedRecord,
              ...values,
              sub_comp_code: localStorage.getItem("auth-default-wbsCode"),
              // operation_project: JSON.stringify(values.operation_project)

            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(WeldPersonLedgerEdit);
