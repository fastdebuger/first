import React, { useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import {
  ErrorCode,
  MERIT_TYPES_OPTIONS,
  HUA_WEI_OBS_CONFIG,
  CONSTRUCTION_UNIT_OPINION_OPTIONS
} from "@/common/const";
import { Select, message } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import MultiDynamicForms from '../MultiDynamicForms';

const { CrudAddModal } = SingleTable;

/**
 * 新增创优情况计划
 * @param props
 * @constructor
 */
const MonitoringMeasuringAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [meritTypesValue, setMeritTypesValue] = useState<any>([]);
  // 定义奖项级别
  const BUREAU_AWARDS = [1, 2]; // 局级奖项
  const PROVINCIAL_GOLD_AWARDS = [3, 4]; // 省部级金奖
  // 动态计算选项的禁用状态
  const getOptionsWithDisabled = () => {
    // 检查是否已选择局级奖项
    const hasBureauAward = meritTypesValue.some(item => BUREAU_AWARDS.includes(item));
    // 检查是否已选择省部级金奖
    const hasProvincialGold = meritTypesValue.some(item => PROVINCIAL_GOLD_AWARDS.includes(item));
    
    return MERIT_TYPES_OPTIONS.map(option => {
      const optionValue = option.value;

      // 省部级奖项（3,4）：如果没有选择局级奖项则禁用
      if (PROVINCIAL_GOLD_AWARDS.includes(optionValue)) {
        const isSelected = meritTypesValue.includes(optionValue);
        return {
          ...option,
          disabled: !hasBureauAward && !isSelected
        };
      }

      // 国家级优质工程（6）：如果没有选择省部级金奖则禁用（已选中的不禁用）
      if ([6,7].includes(optionValue)) {
        const isSelected = meritTypesValue.includes(optionValue);
        return {
          ...option,
          disabled: !hasProvincialGold && !isSelected
        };
      }

      return option;
    });
  };

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        // {
        //   title: "compinfo.dev_code",
        //   subTitle: "装置名称",
        //   dataIndex: "",
        //   width: 160,
        //   align: "center",
        //   renderSelfForm: (form) => {
        //     const onChange = (value: any) => {
        //       form.setFieldsValue({ dev_code: value });
        //     }
        //     return (
        //       <DevList onChange={onChange} />
        //     )
        //   }
        // },
        'dev_code',
        {
          title: "compinfo.merit_types",
          subTitle: "创优类型",
          dataIndex: "merit_types",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            // 获取带禁用状态的选项
            const optionsWithDisabled = getOptionsWithDisabled();

            // 处理创优类型选择变化的函数
            const handleMeritTypesChange = (selectedValues: any) => {
              const hasBureauAward = selectedValues.some((item: string) => BUREAU_AWARDS.includes(item));
              if (!hasBureauAward) {
                // 检查之前是否有值，如果有才清空
                if (selectedValues.length > 0 && !selectedValues.includes(5)) {
                  setMeritTypesValue([]);
                  form.setFieldsValue({ merit_types: undefined });
                  message.error('您未选择局级选项，已清除所有选中的项');
                  return;
                }
              }
              setMeritTypesValue(selectedValues);
              form.setFieldsValue({
                merit_types: selectedValues.length > 0 ? selectedValues : undefined
              });
            };
            // 1：局级安装工程优质奖,2:局级优质工程,3:省部级石油安装工程,4:省部级优质工程,5:国家级优秀焊接工程,6:国家级优质工程
            return (
              <Select
                style={{ width: '100%' }}
                value={meritTypesValue}
                mode="multiple"
                onChange={handleMeritTypesChange}
                placeholder="请选择创优类型"
                options={optionsWithDisabled}
              />

            )
          }
        },
        "application_date",
        "charge_person",
        'charge_person_phone',
        "contact_person",
        'contact_person_phone',
        "application_unit",
        "start_date",
        "end_date",
        "contract_amount",
        "budget_amount",
        "final_account_amount",
        "construction_unit",
        "survey_unit",
        "design_unit",
        "construction_contractor",
        "supervision_unit",
        "construction_unit_opinion",
        "quality_accident_proof",
        "no_wage_arrears_proof",
        "embassy_proof",
        'remark',
        {
          title: "",
          subTitle: "设计获奖情况",
          dataIndex: "design_award",
          width: 160,
          align: "center",
          renderSelfForm: (_form) => {
            return (
              <MultiDynamicForms
                name="design_award"
                title={'设计获奖情况'}
                required={false}
              />
            )
          }
        },
        {
          title: "",
          subTitle: "科技进步获奖情况",
          dataIndex: "tech_progress_award",
          width: 160,
          align: "center",
          renderSelfForm: (_form) => {
            return (
              <MultiDynamicForms
                name="tech_progress_award"
                title={'科技进步获奖情况'}
                required={false}
              />
            )
          }
        },
        {
          title: "",
          subTitle: "其他获奖情况",
          dataIndex: "other_award",
          width: 160,
          align: "center",
          renderSelfForm: (_form) => {
            return (
              <MultiDynamicForms
                name="other_award"
                title={'其他获奖情况'}
                required={false}
              />
            )
          }
        },
        {
          title: "contract.file_url",
          dataIndex: "url",
          subTitle: "附件",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/WorkLicenseRegister"
                handleRemove={() => {
                  form.setFieldsValue({ url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year', format: 'YYYY' },
        { value: 'application_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'start_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'end_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .setFormColumnToSelect([
        {
          value: 'construction_unit_opinion', valueType: 'select', name: 'label', valueAlias: 'value', data: CONSTRUCTION_UNIT_OPINION_OPTIONS || []
        },
        {
          value: 'quality_accident_proof', valueType: 'select', name: 'label', valueAlias: 'value', data: CONSTRUCTION_UNIT_OPINION_OPTIONS || []
        },
        {
          value: 'no_wage_arrears_proof', valueType: 'select', name: 'label', valueAlias: 'value', data: CONSTRUCTION_UNIT_OPINION_OPTIONS || []
        },
        {
          value: 'embassy_proof', valueType: 'select', name: 'label', valueAlias: 'value', data: CONSTRUCTION_UNIT_OPINION_OPTIONS || []
        },
      ])
      .setFormColumnToInputNumber([
        { value: 'budget_amount', valueType: 'digit', min: 0 },
        { value: 'final_account_amount', valueType: 'digit', min: 0 },
      ])
      .setFormColumnToSelfColSpan([
        { value: 'design_award', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'tech_progress_award', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'other_award', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },

      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }])
      .setSplitGroupFormColumns([
        {
          title: '获奖情况',
          columns: ['design_award', 'tech_progress_award', 'other_award'],
        },
        {
          title: '附件',
          columns: ['url'],
        }
      ])

      .needToRules([
        'year',
        'dev_code',
        "merit_types",
        "application_date",
        "charge_person",
        'charge_person_phone',
        "contact_person",
        'contact_person_phone',
        "application_unit",
        "start_date",
        "end_date",
        "contract_amount",
        "budget_amount",
        "final_account_amount",
        "construction_unit",
        "survey_unit",
        "design_unit",
        "construction_contractor",
        "supervision_unit",
        "design_award",
        "tech_progress_award",
        "other_award",
        "construction_unit_opinion",
        "quality_accident_proof",
        "no_wage_arrears_proof",
        "embassy_proof",
        'url',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => {
      if(item.title) { 
        item.title = formatMessage({ id: item.title })
      }
    });
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增创优情况计划"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: String(new Date().getFullYear()),
        budget_amount: 0,
        final_account_amount: 0,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          console.log('values', values);
          dispatch({
            type: "workLicenseRegister/addMeritPlan",
            payload: {
              ...values,
              merit_types: JSON.stringify(values.merit_types),
              design_award: JSON.stringify(values.design_award),
              tech_progress_award: JSON.stringify(values.tech_progress_award),
              other_award: JSON.stringify(values.other_award),
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

export default connect()(MonitoringMeasuringAdd);
