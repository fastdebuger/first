import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { Form, message } from "antd";
import useSysDict from "@/utils/useSysDict";
import { getProblemCategoryOptions, processProblemClassificationData } from "../../QualityIssue/qualitySafetyUtils";
import { queryQualitySafetyFactorTypeFlat } from "@/services/safetyGreen/inspect/questionClassification";

const { CrudAddModal } = SingleTable;

/**
 * 新增质量监督审核问题清单
 * @param props
 * @constructor
 */
const ContractorAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [problemClassificationData, setProblemClassificationData] = useState<any[]>([]);
  // 使用 useWatch 监听 problem_category 字段值
  const problemCategory = Form.useWatch('problem_category', form);
  const oneInvolvedElements = Form.useWatch('one_involved_elements', form);

  useEffect(() => {
    queryQualitySafetyFactorTypeFlat({ sort: 'form_no', order: 'asc' })
      .then(res => {
        if (res?.rows) setProblemClassificationData(res.rows);
      });
  }, []);

  const { configData } = useSysDict({
    filter: [{ "Key": "sys_type_code", "Val": "'ENTITY_QUALITY'", "Operator": "in" }]
  });

  const { factor1Options, factor2Options } = processProblemClassificationData(
    problemClassificationData,
    '质量',
    oneInvolvedElements
  );

  const getFormColumns = () => {
    const isManagement = problemCategory === '0'; 
    const isEntity = problemCategory === '1';     

    // 2. 基础必填项
    const baseRules = [
      "auditor_name",           // 1. 监督审核人员
      "audit_time",             // 2. 审核时间
      "audit_location",         // 3. 审核地点
      "audited_unit",           // 4. 接受审核单位
      "dept_name",              // 5. 部门
      "post_name",              // 6. 岗位
      "issue_description",      // 7. 问题描述
      "judgement_basis",        // 8. 判定依据
      "problem_category",       // 9. 问题类别
      "audit_item",             // 13. 审核项目
      "issue_nature",           // 14. 问题性质
      "rectification_advice",   // 15. 整改建议
      "completion_time",        // 16. 完成时间
    ];

    const dynamicRules = [...baseRules];
    if (isManagement) {
      dynamicRules.push("one_involved_elements", "involved_elements");
    }
    if (isEntity) {
      dynamicRules.push("professional_field");
    }

    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "auditor_name",           // 1. 监督审核人员
        "audit_time",             // 2. 审核时间
        "audit_location",         // 3. 审核地点
        "audited_unit",           // 4. 接受审核单位
        "dept_name",              // 5. 部门
        "post_name",              // 6. 岗位
        "issue_description",      // 7. 问题描述
        "judgement_basis",        // 8. 判定依据
        "problem_category",       // 9. 问题类别
        "professional_field",     // 10. 专业领域
        "one_involved_elements",  // 11. 一级涉及要素
        "involved_elements",      // 12. 涉及要素
        "audit_item",             // 13. 审核项目
        "issue_nature",           // 14. 问题性质
        "rectification_advice",   // 15. 整改建议
        "completion_time",        // 16. 完成时间
        "remark"                  // 17. 备注
      ])
      .setFormColumnToSelect([
        {
          value: 'problem_category',
          name: 'name',
          valueType: 'select',
          data: getProblemCategoryOptions("0"),
          valueAlias: 'value',
          onChange: () => {
            // 当 problem_category 变化时，清空相关的字段
            form.setFieldsValue({
              one_involved_elements: undefined,
              involved_elements: undefined,
              professional_field: undefined,
            });
          }
        },
        {
          value: 'one_involved_elements',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: factor1Options,
          onChange: () => {
            // 当一级要素变化时，清空二级要素
            form.setFieldsValue({ involved_elements: undefined });
          }
        },
        {
          value: 'involved_elements',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: factor2Options,
        },
        {
          value: 'professional_field',
          valueAlias: 'id',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.ENTITY_QUALITY || []
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'audit_time',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
        {
          value: 'completion_time',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'issue_description',
        },
        {
          value: 'judgement_basis',
        },
        {
          value: 'rectification_advice',
        },
        {
          value: 'remark',
        }
      ])
      .needToDisabled([
        { value: 'one_involved_elements', disabled: !isManagement },
        { value: 'involved_elements', disabled: !isManagement },
        { value: 'professional_field', disabled: !isEntity },
      ])
      .needToRules(dynamicRules)
      .needToRules([
        "auditor_name",
        "audit_time",
        "audited_unit",
        "issue_description",
        "judgement_basis",
        "rectification_advice",
        "completion_time",
        "issue_nature"
      ])
      .getNeedColumns();

    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };


  return (
    <CrudAddModal
      form={form}
      title={"新增质量监督审核问题清单"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        // 数据值为undefined和null设置为""
        for (const key in values) {
          if (!Object.hasOwn(values, key)) continue;
          const element = values[key];
          if (element === undefined || element === null) {
            values[key] = ""
          }
        }
        return new Promise((resolve) => {
          dispatch({
            type: "contractor/saveBatch",
            payload: {
              Items: JSON.stringify([values])
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
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

export default connect()(ContractorAdd);
