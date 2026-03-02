import { InputNumber, Select, Tag } from "antd"
import { renderTextArea } from "./Add"
import RiskCategoryDetailsSelect from "./riskCategoryDetailsSelect";
const { Option, OptGroup } = Select;

export const configColumns = [
  {
    "title": "ProjectRiskGovernance.main_id",
    "subTitle": "序号",
    "dataIndex": "main_id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.secondary_unit",
    "subTitle": "二级单位",
    "dataIndex": "secondary_unit",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_manager_dept",
    "subTitle": "项目经理部",
    "dataIndex": "project_manager_dept",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.secondary_unit",
    "subTitle": "二级单位",
    "dataIndex": "secondary_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_manager_dept",
    "subTitle": "项目经理部",
    "dataIndex": "project_manager_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_manager",
    "subTitle": "项目经理",
    "dataIndex": "project_manager",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_name",
    "subTitle": "工程名称",
    "dataIndex": "project_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_level",
    "subTitle": "项目级别",
    "dataIndex": "project_level",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_manager",
    "subTitle": "风险经理",
    "dataIndex": "risk_manager",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.committee_file",
    "subTitle": "项目风险管理委员会成立文件",
    "dataIndex": "committee_file",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.meeting_file",
    "subTitle": "会议纪要文件",
    "dataIndex": "meeting_file",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.project_risk_file",
    "subTitle": "项目风险管理文件",
    "dataIndex": "project_risk_file",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.recognition_id",
    "subTitle": "工程项目主要风险监控登记表主键ID",
    "dataIndex": "recognition_id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_name",
    "subTitle": "风险类别",
    "dataIndex": "risk_events_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_category",
    "subTitle": "一级风险名称",
    "dataIndex": "risk_category",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_category",
    "subTitle": "一级风险名称",
    "dataIndex": "risk_category_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_description",
    "subTitle": "风险描述",
    "dataIndex": "risk_description",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.effect_factors",
    "subTitle": "风险影响因素",
    "dataIndex": "effect_factors",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.potential_consequence",
    "subTitle": "风险潜在后果",
    "dataIndex": "potential_consequence",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.category_name",
    "subTitle": "一级风险名称",
    "dataIndex": "category_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_possibility",
    "subTitle": "风险发生可能性",
    "dataIndex": "risk_possibility",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_possibility",
    "subTitle": "风险发生可能性",
    "dataIndex": "risk_possibility_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_incidence",
    "subTitle": "风险影响程度",
    "dataIndex": "risk_incidence",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_incidence",
    "subTitle": "风险影响程度",
    "dataIndex": "risk_incidence_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_possibility_name",
    "subTitle": "风险影响程度",
    "dataIndex": "risk_possibility_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_incidence_name",
    "subTitle": "风险影响程度",
    "dataIndex": "risk_incidence_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_socre",
    "subTitle": "风险评分",
    "dataIndex": "risk_socre",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_socre_name",
    "subTitle": "风险评分",
    "dataIndex": "risk_socre_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.disposal_sort",
    "subTitle": "风险处置顺序",
    "dataIndex": "disposal_sort",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.answer_id",
    "subTitle": "风险应对表主键ID",
    "dataIndex": "answer_id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_coping_strategy",
    "subTitle": "风险应对策略",
    "dataIndex": "risk_coping_strategy",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_coping_strategy",
    "subTitle": "风险应对策略",
    "dataIndex": "risk_coping_strategy_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_control_plan",
    "subTitle": "风险管控计划",
    "dataIndex": "risk_control_plan",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_dept",
    "subTitle": "风险主责部门",
    "dataIndex": "risk_dept",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_unit",
    "subTitle": "风险主责单位",
    "dataIndex": "risk_unit",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_coping_strategy_name",
    "subTitle": "风险应对策略",
    "dataIndex": "risk_coping_strategy_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_principal",
    "subTitle": "风险主责负责人",
    "dataIndex": "risk_principal",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.required_complete_time",
    "subTitle": "要求完成时间",
    "dataIndex": "required_complete_time",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.required_complete_time",
    "subTitle": "要求完成时间",
    "dataIndex": "required_complete_time_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.examine_id",
    "subTitle": "检查",
    "dataIndex": "examine_id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_status",
    "subTitle": "风险状态",
    "dataIndex": "risk_status",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.executive_condition",
    "subTitle": "管控计划执行情况",
    "dataIndex": "executive_condition",
    "width": 180,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.remark",
    "subTitle": "备注",
    "dataIndex": "remark",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.required_complete_time_str",
    "subTitle": "要求完成时间",
    "dataIndex": "required_complete_time_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.RowNumber",
    "subTitle": "序号",
    "dataIndex": "RowNumber",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_socre",
    "subTitle": "风险评分",
    "dataIndex": "risk_socre",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_socre_name",
    "subTitle": "风险等级",
    "dataIndex": "risk_socre_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.report_stage",
    "subTitle": "填报进度",
    "dataIndex": "report_stage",
    "width": 160,
    "align": "center",
    render: (text: any) => {
      switch (String(text)) {
        case "1":
          return <Tag color={'processing'}>风险识别完成</Tag>
        case "2":
          return <Tag color={'gold'}>风险评估完成</Tag>
        case "3":
          return <Tag color={'geekblue'}>风险应对完成</Tag>
        case "4":
          return <Tag color={'purple'}>监督检查完成</Tag>
        default:
          return <Tag color={'error'}>暂无数据</Tag>
      }
    }
  },
  {
    "title": "ProjectRiskGovernance.analysis_person_name",
    "subTitle": "风险评估人员",
    "dataIndex": "analysis_person_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.answer_person_name",
    "subTitle": "风险主责部门/单位负责人",
    "dataIndex": "answer_person_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.examine_person_name",
    "subTitle": "监督检查人员",
    "dataIndex": "examine_person_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.analysis_person_name",
    "subTitle": "风险评估人员",
    "dataIndex": "analysis_person_code",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.weight",
    "subTitle": "权重",
    "dataIndex": "weight",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.answer_person_name",
    "subTitle": "风险主责部门/单位负责人",
    "dataIndex": "answer_person_code",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.examine_person_name",
    "subTitle": "监督检查人员",
    "dataIndex": "examine_person_code",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_category_details",
    "subTitle": "二级风险名称",
    "dataIndex": "category_details_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.risk_category_details",
    "subTitle": "二级风险名称",
    "dataIndex": "risk_category_details",
    "width": 200,
    "align": "center"
  },
  {
    "title": "ProjectRiskGovernance.post_name",
    "subTitle": "职务",
    "dataIndex": "post_name",
    "width": 200,
    "align": "center"
  },
]

// 风险识别配置数据
export const RiskIdentification = [
  "risk_events_name",
  "risk_category",
  "risk_category_details",
  "risk_description",
  "effect_factors",
  "potential_consequence",
  "analysis_person_code",
  "weight",
  "post_name"
] as const

// 风险评估配置数据
export const RiskAnalysis = [
  "risk_possibility",
  "risk_incidence",
  // "disposal_sort",
  // "answer_person_code",
] as const

// 风险应对配置数据
export const RiskResponse = [
  "risk_coping_strategy",
  "risk_control_plan",
  "risk_dept",
  "risk_unit",
  "risk_principal",
  "required_complete_time",
  // "examine_person_code",
  "disposal_sort",
] as const

// 监督检查配置数据
export const SupervisionInspection = [
  "risk_status",
  "executive_condition",
  "examine_person_name",
  "remark",
] as const

/**
 * 得到当前进度
 * @param ReportStage 
 * @returns 
 */
export const getReportStage = (ReportStage: any) => {
  switch (String(ReportStage)) {
    case "1":
      return "风险识别"
    case "2":
      return "风险评估"
    case "3":
      return "风险应对"
    case "4":
      return "监督检查"
    default:
      return "暂无数据"
  }
}

const ALL_RISK_FIELDS = [...RiskIdentification, ...RiskAnalysis, ...RiskResponse, ...SupervisionInspection]
/**
 * 根据报送阶段 (report_stage) 确定哪些字段应该被设置为不可编辑。
 * * @param reportStage 当前的阶段编号 (1, 2, 3, 4)
 * @returns 应该被设置为不可编辑的字段名数组
 */
export const getNonEditableFields = (reportStage: number | string): string[] => {
  let editableFields: string[] = [];
  const stage = Number(reportStage);

  switch (stage) {
    case 1:
      // 阶段 1: 仅 RiskIdentification 字段可编辑
      editableFields = [...RiskIdentification];
      break;
    case 2:
      // 阶段 2: 仅 RiskAnalysis 字段可编辑
      editableFields = [...RiskAnalysis];
      break;
    case 3:
      // 阶段 3: 仅 RiskResponse 字段可编辑
      editableFields = [...RiskResponse];
      break;
    case 4:
      // 阶段 4: 仅 SupervisionInspection 字段可编辑
      editableFields = [...SupervisionInspection];
      break;
    default:
      // 如果阶段无效，默认全部不可编辑 (或者全部可编辑，根据业务决定)
      return ALL_RISK_FIELDS;
  }

  // 关键逻辑：
  // 找出 ALL_RISK_FIELDS 中，不在当前 editableFields 数组里的字段。
  const nonEditableFields = ALL_RISK_FIELDS.filter(field =>
    !editableFields.includes(field)
  );

  return nonEditableFields;
};


// 通用的数据提取函数，用于从 datas 中筛选指定字段
export const extractStageData = (
  datas: any[],
  requiredFields: string[],
  extraStr?: string[],
): any[] => {
  const filteredItems: any[] = [];

  datas.forEach((item: any) => {
    const result: any = {};
    const requiredFieldArr = extraStr ? [...requiredFields, ...extraStr] : requiredFields
    // 遍历所需的字段，并赋值
    requiredFieldArr.forEach((key) => {
      if (Object.hasOwn(item, key) && item[key] !== undefined) {
        result[key] = item[key];
      }
    });

    // 只要有任何字段被保留，就推入数组
    if (Object.keys(result).length > 0) {
      filteredItems.push(result);
    }
  });

  return filteredItems;
};


export const STAGE_MAP: any = {
  1: {
    fields: RiskIdentification,
    payloadKey: 'recognitionItems',
    action: 'projectRiskGovernance/saveBatch',
    successMsg: '风险识别填报成功',
  },
  2: {
    fields: RiskAnalysis,
    payloadKey: 'analysisItems',
    action: 'projectRiskGovernance/saveBatchRiskAnalysis',
    successMsg: '风险评估填报成功',
  },
  3: {
    fields: RiskResponse,
    payloadKey: 'answerItems',
    action: 'projectRiskGovernance/saveBatchRiskAnswer',
    successMsg: '风险应对填报成功',
  },
  4: {
    fields: SupervisionInspection,
    payloadKey: 'examineItems',
    action: 'projectRiskGovernance/saveBatchRiskExamine',
    successMsg: '监督检查填报成功',
  }
}



/**
 * 根据reportStage 动态展示那些字段需要编辑
 * @param reportStage 
 * @returns 
 */
export const getInitTableColumns = (reportStage: any, options: any = {}) => {
  let editableFields: any[] = [];
  const stage = Number(reportStage);
  const { treeData = [], riskCategoryDetails = [] } = options
  // console.log('treeData :>> ', treeData, riskCategoryDetails);
  switch (stage) {
    case 1:
      // 阶段 1: 仅 RiskIdentification 字段可编辑
      editableFields = [
        // renderTextArea("risk_events_name"),
        // "risk_events_name",
        {
          title: 'ProjectRiskGovernance.risk_events_name',
          dataIndex: "risk_events_name",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const handleCategoryChange = (e: any) => {
              console.log('e :>> ', e);
              const value = e || ""
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                risk_events_name: value,
              });
              handleSave(copyRecord)
            };
            return (
              <Select
                showSearch
                placeholder="请选择风险类型"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                optionFilterProp="children"
                defaultValue={record.risk_events_name}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {[
                  {
                    risk_events_name: "报告风险",
                  },
                  {
                    risk_events_name: "合规风险",
                  },
                  {
                    risk_events_name: "经营风险",
                  },
                  {
                    risk_events_name: "战略风险",
                  }
                ]?.map(({ risk_events_name }: any) => (
                  <Option key={risk_events_name} value={risk_events_name}>
                    {risk_events_name}
                  </Option>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'ProjectRiskGovernance.risk_category',
          dataIndex: "risk_category",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const handleCategoryChange = (e: any) => {
              const value = e || ""
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                risk_category: value,
                risk_category_details: []
              });
              handleSave(copyRecord)
            };
            return (
              <Select
                showSearch
                placeholder="请选择一级风险名称"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {treeData?.map((parent: any) => (
                  <OptGroup key={parent.id} label={parent.category_name}>
                    {parent?.children?.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.category_name}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'ProjectRiskGovernance.risk_category_details',
          dataIndex: "risk_category_details",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            return (
              <RiskCategoryDetailsSelect
                record={record}
                handleSave={handleSave}
                riskCategoryDetails={riskCategoryDetails}
              />
            )
          },
        },
        renderTextArea("risk_description"),
        renderTextArea("effect_factors"),
        renderTextArea("potential_consequence"),
        // "weight",
        {
          title: 'ProjectRiskGovernance.weight',
          dataIndex: 'weight',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value;
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                weight: num,
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        },
        "post_name",
        "analysis_person_code",
      ];
      break;
    case 2:
      // 阶段 2: 仅 RiskAnalysis 字段可编辑
      editableFields = [
        "risk_possibility",
        "risk_incidence",
        // "disposal_sort",
        // "answer_person_code",
      ];
      break;
    case 3:
      // 阶段 3: 仅 RiskResponse 字段可编辑
      editableFields = [
        "risk_socre",
        "risk_socre_name",
        "risk_coping_strategy",
        "risk_control_plan",

        "risk_unit", //风险主责单位
        "risk_dept",

        "risk_principal", //风险主责负责人
        "required_complete_time",
        // "examine_person_code",
        "disposal_sort",
      ];
      break;
    case 4:
      // 阶段 4: 仅 SupervisionInspection 字段可编辑
      editableFields = [
        "risk_socre",
        renderTextArea("risk_status"),
        renderTextArea("executive_condition"),
        "examine_person_name",
        renderTextArea("remark"),
      ];
      break;
    default:
      // 如果阶段无效，默认全部
      return [];
  }

  return editableFields
}
