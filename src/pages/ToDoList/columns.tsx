import { PROP_KEY } from "@/common/const";

export const configColumns = [
  {
    title: "AnnualAssessment.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.push_user_code",
    subTitle: "推送用户",
    dataIndex: "user_code",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.push_dep_code",
    subTitle: "推送层级",
    dataIndex: "dep_code",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.funcCode",
    subTitle: "模块编码",
    dataIndex: "funcCode",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.sys_code",
    subTitle: "系统编码",
    dataIndex: "sys_code",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.report_start_date",
    subTitle: "填报开始时间",
    dataIndex: "report_start_date",
    width: 160,
    align: "center",
  },
  {
    title: "AnnualAssessment.report_end_date",
    subTitle: "填报结束时间",
    dataIndex: "report_end_date",
    width: 160,
    align: "center",
  },
];


/**
 * 系统基础模块配置项接口
 * 定义单个业务模块的所有配置字段类型
 */
interface BaseModuleItem {
  sysCode: string; // 系统编码，唯一标识所属业务系统
  sysName: string; // 系统名称，用于前端界面展示所属系统名称
  moduleName: string; // 模块名称，前端展示的业务模块中文名称
  modulePath: string; // 模块路由路径，用于前端路由跳转、页面定位
  moduleCode: string; // 模块编码，唯一标识
  type?: string; // 发起不同审批的接口
  isCustomEncoding?: boolean; // 是否启用自定义编码规则，用于新增发送待办任务
  DateRestrictionType?: string// 用户发送填报日期的请求
  isDateRestriction?: boolean; // 是否启用日期必填
}

/**
 * 系统基础模块配置清单
 * 存储所有核心业务模块的配置信息，支撑前端路由、权限、业务场景匹配等功能
 */
export const baseModuleList: BaseModuleItem[] = [
  {
    sysCode: 'D51',
    sysName: "信息化管理平台",
    moduleName: '风险事件收集',
    modulePath: `/${PROP_KEY}/EnterpriseRiskManagement/CollectionOfRiskIncidents`,
    moduleCode: 'D51F901',
    type: "EnterpriseRiskToDo/sendRiskEventsTask",
    isCustomEncoding: true
  },
  {
    sysCode: 'D51',
    sysName: "信息化管理平台",
    moduleName: '项目风险管控',
    modulePath: `/${PROP_KEY}/EnterpriseRiskManagement/ProjectRisk/ProjectRiskGovernance`,
    moduleCode: 'D51F902',
    type: "EnterpriseRiskToDo/sendRiskEvaluateTask",
    isCustomEncoding: true,
  },
  {
    sysCode: 'D51',
    sysName: "信息化管理平台",
    moduleName: '安全监督检查问题清单',
    modulePath: `/${PROP_KEY}/safetyGreen/inspect/safetyOversight`,
    moduleCode: 'D51F715',
  },
  {
    sysCode: 'D51',
    sysName: "信息化管理平台",
    moduleName: '重大经营风险评估',
    modulePath: `/${PROP_KEY}/EnterpriseRiskManagement/AnnualAssessment/AnnualAssessmentOfKeyOrganizationalRisks`,
    moduleCode: 'D51F904',
    type: "EnterpriseRiskToDo/sendRiskAssessmentTask",
    isCustomEncoding: true,
  },
]