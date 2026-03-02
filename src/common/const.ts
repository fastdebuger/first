import { getWebParam } from '@/utils/utils';

export const CONST = {
  HOST_RPT: getWebParam().HOST_RPT,
  FUNC_LOGIN_STATUS: 'FFFFFF',
  HOST_HELP: getWebParam().HOST_HELP,
  QRCODE_PAGE: '/meter/qrcode',
  MICROSOFT_OL_PREVIEW: 'https://view.officeapps.live.com/op/view.aspx?src=',
  IMPORT_FILE_TYPE:
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  AMAP_KEY: '8934c305ace1c224252dbd92e0226d8b',
  DEFAULT_PAGE_SIZE: 10,
};

export const HUA_WEI_OBS_CONFIG = {
  ACCESS_KEY_ID: getWebParam().ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: getWebParam().SECRET_ACCESS_KEY,
  SYS_PATH: {
    BASIC: 'basic', // 基础信息
    DOCUMENT: 'document-sys', // 文档系统
    EQUIPMENT: 'equipment-sys', // 设备信息
    FIX_ASSET: 'fixed-asset-sys', // 固定资产
    MATERIAL: 'material-sys', // 物资系统
    OBS: 'obs-sys', // 分包商资源管理
    OLD: 'old', // 老的文档服务器 统一存储路径
    OVERSEAS_MATERIAL: 'overseas-material-sys', // 海外自采
    PIPE_WELD: 'pipe-weld-sys', // 管道焊接
    QUALITY: 'quality-sys', // 质量系统
    SAFE: 'safe-sys', // 安全系统
    SITE_MACHINE: 'site-machine-sys', // 机械设备管理
    SITE_PERSON: 'site-person-sys', // 现场人员管理
    STEEL: 'steel-sys', // PCDEMO
    ZyyjIms: 'ZyyjIms',
  },
  BUCKET: getWebParam().BUCKET,
  SERVER: getWebParam().SERVER,
  HOST_URL: getWebParam().HOST_URL,
};

// 阿里图标网址  Symbol
export const ICONFONT_URL = {
  URL: '//at.alicdn.com/t/font_3094984_8g8mdvhcude.js',
};
export const OSS_CFG = {
  REGION: 'oss-cn-qingdao',
  BUCKET: 'yayang-sinopec123',
  ENDPOINT: 'oss-cn-qingdao.aliyuncs.com',
  HOST: 'http://yayang-sinopec123.oss-cn-qingdao.aliyuncs.com',
};

export const WORK_BENCH = {
  VERSION: new Date().getTime(),
};
export const VerifyCode = {
  // 在登录界面登录时获取登陆验证的token
  Login: 'login',
  // 在登录页面登录时修改默认密码时获取的修改密码验证token
  ModifyPwd: 'modify_pwd',
};

export const WBS_LEVEL = {
  // comp-集团公司 branchComp-分公司、subComp-子公司、dep-项目部、dev-装置、unitPrj-单位工程、unit-单元
  LEVEL_COMP: 'comp', //  comp-集团公司
  LEVEL_BRANCH_COMP: 'branchComp', // branchComp-分公司
  LEVEL_SUB_COMP: 'subComp', // subComp-子公司
  LEVEL_CONTRACT: 'contract', // 项目定义（也就是合同）
  LEVEL_DEP: 'dep', // dep-项目部
  LEVEL_DEV: 'dev', // dev-装置
  LEVEL_UNIT_PRJ: 'unitPrj', // unitPrj-单位工程
  LEVEL_UNIT: 'unit', // unit-单元
};

// 作为备选数据用
export const WBS_LEVEL_ARR = [
  { func_prefix: 'C', prop_key: 'comp', prop_name: '集团公司', is_child_type: false },
  { func_prefix: 'B', prop_key: 'branchComp', prop_name: '分公司', is_child_type: false },
  { func_prefix: 'S', prop_key: 'subComp', prop_name: '子公司', is_child_type: false },
  { func_prefix: 'D', prop_key: 'dep', prop_name: '项目部', is_child_type: true },
];

export const OBS_LEVEL = {
  // comp-集团公司 branchComp-分公司、subComp-子公司、dep-项目部、contractComp-分包公司、contractTeam-分包队伍、department-部门
  LEVEL_COMP: 'comp', //  comp-集团公司
  LEVEL_BRANCH_COMP: 'branchComp', // branchComp-分公司
  LEVEL_SUB_COMP: 'subComp', // subComp-子公司
  LEVEL_DEP: 'dep', // dep-项目部
  LEVEL_CONTRACT_COMP: 'contractComp', // contractComp-分包公司
  LEVEL_CONTRACT_TEAM: 'contractTeam', // contractTeam-分包队伍
  LEVEL_DEPARTMENT: 'department', // department-部门
};

export const RIGHT_BIT = {
  R_ADD: '新增',
  R_MODIFY: '编辑',
  R_DELETE: '删除',
  R_IMPORT: '导入',
  R_EXPORT: '导出',
  R_PRINT: '打印',
  R_UPLOAD: '上传',
  R_DETAIL: '详情',
  R_SAVE: '保存',
  R_NONE: 0,
  R_ALL: 31,
  R_CHECK: '查看',
  R_APPROVAL: '审批',
};

export const WbsLevel = {
  LEVEL_TOTAL_COMPANY: '1', // 集团公司
  LEVEL_CHILD_COMPANY: '2', // 子公司
  LEVEL_COMPANY_OR_DEP_COMPANY: '3', // 分公司/公司组建项目
  LEVEL_PROJECT: '4', // 项目部
  LEVEL_PROJECT_DEVICE: '5', // 装置
  LEVEL_PROJECT_PROFESSION: '6', // 单位工程
  LEVEL_PROJECT_UNIT: '7', // 单元
};
// 新框架层级 prop_key
export const NewWbsLevel = {
  //WBS集团公司层级
  WbsCompLvl: 'comp',
  //WBS分公司层级
  WbsBranchCompLvl: 'branchComp',
  //WBS子公司层级
  WbsSubCompLvl: 'subComp',
  //WBS项目部层级
  WbsDepLvl: 'dep',
  //WBS装置层级层级
  WbsDevLvl: 'dev',
  //WBS单位工程层级
  WbsUnitPrjLvl: 'unitPrj',
  //WBS单元层级
  WbsUnitLvl: 'unit',
};

export const ObsLevel = {
  LEVEL_TOTAL_COMPANY: '1', // 集团公司
  LEVEL_CHILD_COMPANY: '2', // 分公司
  LEVEL_COMPANY_OR_DEP_COMPANY: '3', // 子公司
  LEVEL_PROJECT: '4', // 项目部
  LEVEL_PROJECT_DEVICE: '5', // 装置
  LEVEL_PROJECT_OBS_LIST: '6', // 分包队伍
};
export const Material_Error_Code = {
  //出库超分割错误码
  Err_Out_Store_Over_Split: -97,
  Err_Out_Material_code: -96,
};
// 系统级错误
export const ErrorCode = {
  // 正确
  ErrOk: 0,
  // 非法Json格式
  ErrJson: -1,
  // http请求时间不合法
  ErrTsNValid: -2,
  // 解密失败
  ErrDecryptNValid: -3,
  // 加密失败
  ErrEncryptNValid: -4,
  // 数据库连接获取失败
  ErrGetDbConn: -5,
  // 开启数据库事物失败
  ErrStartTx: -6,
  // 存储数据失败(增加日期：2020-09-03)
  ErrStoreData: -7,
  // 查询数据库失败(增加日期：2020-09-03)
  ErrQueryDb: -8,
  // 非法JSON格式(增加日期：2020-09-04)
  ErrValidJsonFmt: -9,
  // 非法JSON格式(增加日期：2020-09-07)
  ErrDeleteData: -10,
  // 带描述错误
  ErrWithDescript: -99,
  ErrUserCodeOrPwd: -101,
  ...Material_Error_Code,
};

// 学历
export const Education = ['小学', '初中', '高中', '大专', '大学本科', '研究生'];

export const APPROVE_STATUS = {
  NO_SEND: 0, // 未发起审批
  WAITING: 1, // 审批中
  FINISH: 2, // 审批完成
  REJECT: -1, // 被驳回
};

// 订单是由哪个平台创建的
export const FORM_TYPE = {
  PC: 0,
  APP: 1,
};
// 照片服务器 文件夹
export const UPLOAD_FILE_PATH = {
  bjMaterial: '/bjMaterial',
  USERINFO: '/userInfo',
};
// 哪家公司 南京 领用计划 其余分割预算
export const COMPANY = {
  // 分割还是计划
  SPLITE_NAME: '分割预算', // 除了南京都用分割预算
  // SPLITE_NAME: '领用计划'
};
// 定义微服务的名称，通过API获取第一个元素进行判断调用哪个微服务
// 比如： /basic/user/aut/queryUser  截取第一个basic 调用 WMBasic 这个微服务
export const SrvName = {
  basic: 'WMBasic',
  basicNew: 'WMBasicNew',
  wpqr: 'WMWpqr',
  welder: 'WMWpqr',
  pipeWelding: 'WMPipeWelding',
  PDFServer: 'PDFServer',
  WMMaterial: 'WMMaterial',
  ZyyjIms: "ZyyjIms",
  SteelStructure: 'SteelStructure',
  quality: 'SrvWPMServer_STCC',
  flow: 'YaYangFlow',
  basicNew: 'WMBasicNew',
};
// 物料追踪 模块名
export const SysLogModuleName = {
  IN_STORAGE: '入库单',
  OUT_STORAGE: '出库单',
  PURCHASE_PLAN: '需求计划',
  SPLIT_BUDGET: '分割预算',
};
// 构件模型的状态
export const MODEL_STATUS = {
  IS_DEL: 0, // 删除状态
  IS_ACTIVE: 1, // 激活状态
};

// 焊口检测等级和检测方法对应的内容
export const WeldQualityGradeAndCheckMothodArr = [
  {
    key: 'I级-UT',
    check_method: 'UT', // 检测方法
    technical_grade: 'I', // 评定等级
    qualification_grade: 'B级', //检验等级
    detection_proportion: '100', //检测比例
  },
  {
    key: 'I级-RT',
    check_method: 'RT',
    technical_grade: 'II', // 评定等级
    qualification_grade: 'AB级', //检验等级
    detection_proportion: '100', //检测比例
  },
  {
    key: 'II级-UT',
    check_method: 'UT',
    technical_grade: 'II', // 评定等级
    qualification_grade: 'B级', //检验等级
    detection_proportion: '20', //检测比例
  },
  {
    key: 'II级-RT',
    check_method: 'RT',
    technical_grade: 'III', // 评定等级
    qualification_grade: 'AB级', //检验等级
    detection_proportion: '20', //检测比例
  },
];

// 允许过滤的节点类型
//  STEEL 钢结构
//  PIPE 管线
//  EQUIPMENT_CONTAINER : '容器类',
//  EQUIPMENT_TOWER: '塔类',
//  EQUIPMENT_PUMP : '泵类',
//  EQUIPMENT_HEATEXCHANGE: '换热器类',
//  EQUIPMENT_AIRCOOL: '空冷类',
export const IS_ALLOW_SELECTED_NODE_TYPE =
  'STEEL,PIPE,EQUIPMENT_CONTAINER,EQUIPMENT_TOWER,EQUIPMENT_PUMP,EQUIPMENT_HEATEXCHANGE,EQUIPMENT_AIRCOOL';

export const WBS_CODE = localStorage.getItem('auth-default-wbsCode');
export const PROP_KEY = localStorage.getItem('auth-default-wbs-prop-key');
export const CURR_DEP_CODE = localStorage.getItem('auth-default-cpecc-currDepCode')
export const CURR_USER_CODE = localStorage.getItem('auth-default-userCode')
export const CURR_USER_NAME = localStorage.getItem('auth-default-userName')
export const GET_REBUILD_OBS_CODE = localStorage.getItem('getRebuildObsCode')


// funcCode
export const FuncCode = {
  SRHTTZ: 'tbl_contract_income_info',
  ZCHTTZ: 'tbl_contract_out_info',
  WZJFWZTCGCL: "tbl_materials_service_purchase_strategy",
};

// 审批模板
export const APPROVAL_TEMPLATE = {
  // 分包合同进度款管理
  SUBCONTRACTOR_PROGRESS: 'S22',
  // 分包合同结算管理
  SUBCONTRACTOR_SETTLEMENT: 'S23',
  // 分包合同签证管理
  SUBCONTRACTOR_VISA: 'S24',
};


/**
 * 审批状态配置对象（状态码 -> 英文描述映射）
 * 未审批
 * UNAPPROVED: -1,
 * 审批中
 * IN_APPROVAL: 0,
 * 审批通过
 * APPROVED: 1,
 * 审批驳回
 * REJECTED: 3
 */
export const APPROVAL_STATUS = {
  // 未审批
  UNAPPROVED: -1,
  // 审批中
  IN_APPROVAL: 0,
  // 审批通过
  APPROVED: 1,
  // 审批驳回
  REJECTED: 3
}

/**
 * 特殊设备需要用到的完成状态
 */
export const QUALIFIED = "√"

/**
 * 主合同结算阶段的标签
 * @const ['一审审核', '二审审核', '三审审核', '审计审定']
 */
export const MAIN_CONTRACT_LABEL = ['一审审核', '二审审核', '三审审核', '审计审定']

/**
 * 分包结算阶段的标签
 * @const ["项目部审核", "预结算费控中心审核", "华中审计审核"]
 */
export const SUB_CONTRACT_LABEL = ["项目部审核", "预结算费控中心审核", "华中审计审核"]

/**
 * 主合同乙方负责人是否是否必填的字段
 * @const ['专业分包合同', '劳务分包合同', '维保服务合同']
 */
export const CONTRACT_TYPE = ['专业分包合同', '劳务分包合同', '维保服务合同']

/**
 * 项目状态
 * 1：设计完成；2：在执行；3：机械完工；4：中交；5：投产；6：停工
 */
export const PROJECT_STATUS = [
  { label: '设计完成', value: '1', date_label: '设计完成日期' },
  { label: '在执行', value: '2', date_label: '预计完成日期' },
  { label: '机械完工', value: '3', date_label: '机械完工日期' },
  { label: '中交', value: '4', date_label: '实际中交日期' },
  { label: '投产', value: '5', date_label: '实际投产日期' },
  { label: '停工', value: '6', date_label: '停工日期' },
]

// '设计', '采购', '施工',
export const EPC_PARAM = {
  '设计': 'E',
  '采购': 'P',
  '施工': 'C',
}
/**
 * 结算状态
 */
export const SETTLEMENT_STATUS = [
  { label: '与业主、分包全部结算完', value: '1' },
  { label: '与业主、分包全部未结算完', value: '2' },
  { label: '与业主结算完，分包未结算完', value: '3' },
  { label: '与业主未结算完，分包结算完', value: '4' },
  { label: '在建项目未结算', value: '5' }
]

/**
 * 人员类别
 * (1:管理人员/2:设计人员/3:采办人员/4:施工人员)
 */
export const PERSON_TYPE = {
  "1": "管理人员",
  "2": "设计人员",
  "3": "采办人员",
  "4": "施工人员",
}

/**
 * https://4x-ant-design.antgroup.com/components/tag-cn/#header 链接位置
 * 这个 antd Tag组件中“Presets” 标题下的色彩
 */
export enum TagColors {
  MAGENTA = 'magenta',
  RED = 'red',
  VOLCANO = 'volcano',
  ORANGE = 'orange',
  GOLD = 'gold',
  LIME = 'lime',
  GREEN = 'green',
  CYAN = 'cyan',
  BLUE = 'blue',
  GEEKBLUE = 'geekblue',
  PURPLE = 'purple',
}

// 审批状态码配置
export const APPROVAL_STATUS_CONFIG = [
  { key: '0', textId: 'common.approval.status.draft' }, // 草稿
  { key: '1', color: TagColors.GOLD, textId: 'common.approval.status.ing' }, // 待审批
  { key: '2', color: TagColors.GREEN, textId: 'approvalPass' }, // 通过
  { key: '3', color: TagColors.RED, textId: 'approvalFailed' }, // 驳回
  { key: '4', color: TagColors.BLUE, textId: 'common.approval.status.changePending' }, // 变更待审核
  { key: '5', color: TagColors.RED, textId: 'common.approval.status.changeRejected' }, // 变更不通过
];
// 质量检查员通用的审批，因为返回的状态码和其他得不一样，所以重新写一遍
export const INSPECTOR_APPROVAL_STATUS = [

  { key: '0', textId: '未审批' },
  { key: '1', color: TagColors.GOLD, textId: '审批中' },
  { key: '2', color: TagColors.GREEN, textId: '审批通过' },
  { key: '-1', color: TagColors.RED, textId: '审批驳回' },
]

// 承包商人员信息状态码
export const SYS_BLACKLOG_STATUS = {
  BLACKLIST_APPROVING: '黑名单审批中',
  EXIT: '退场',
  ENTRY: '进场',
  BLACKLIST_APPROVED: '黑名单审批通过',
  BLACKLIST_REJECTED: '黑名单审批驳回'
};

// 承包商人员状态信息
export const PERSONNEL_STATUS = [
  { value: '0', label: SYS_BLACKLOG_STATUS.EXIT },
  { value: '1', label: SYS_BLACKLOG_STATUS.ENTRY },
]

// 承包商人员评估结果状态码-根据分数
export const EVALUATION_STATUS_CONFIG: any = {
  EXCELLENT: {
    minScore: 90,
    text: '优秀',
    color: 'success'
  },
  GOOD: {
    minScore: 80,
    text: '良好',
    color: 'success'
  },
  PASS: {
    minScore: 70,
    text: '合格',
    color: 'success'
  },
  OBSERVE: {
    minScore: 60,
    text: '观察使用',
    color: 'default'
  },
  BLACKLIST: {
    minScore: 0,
    text: '黑名单',
    color: 'red'
  },
  NOT_EVALUATED: {
    text: '未评估',
    color: 'default'
  }
};
// 市场开发中心-文件知识库管理类型配置
export const KNOWLEDGE_BASE_DATA_TYPE = {
  "1": "资格预审类",
  "2": "招投标类资料库",
};

export const BASE_URL = 'http://49.4.11.48:8080';
export const BASE_PRO_URL = 'http://123.6.232.59:8080';


 /**
* 质量管理模块监视和测量设备登记表 状态选项配置（用于下拉选择器）
*/
export const MONITORING_STATUS_OPTIONS = [
 { value: '1', label: '新增' },
 { value: '2', label: '在用' },
 { value: '3', label: '检定' },
 { value: '4', label: '封存' },
 { value: '5', label: '已封' },
 { value: '6', label: '启封' },
 { value: '7', label: '转移' },
 { value: '8', label: '报废' }
];

 /**
* 质量管理模块- 监视和测量设备登记表- 专业分类配置
*/
export const MONITORING_CLASS_OPTIONS = [
  { value: '1', label: '长度' },
  { value: '2', label: '热工' },
  { value: '3', label: '力学' },
  { value: '4', label: '电磁' },
  { value: '5', label: '其它' }
];

// 质量管理模块中 性别配置
export const GENDER_TYPE_OPTIONS = [
  { value: '0', label: '男' },
  { value: '1', label: '女' },
];
// 质量管理模块中 是否专职/兼职配置
export const FULLORPART_STATUS_OPTIONS = [
  { value: '0', label: '专职' },
  { value: '1', label: '兼职' },
];
// 质量管理模块中 所属单位配置
export const AFFILIATED_UNIT_OPTIONS = [
  { value: '0', label: '内部' },
  { value: '1', label: '外部' },
];
// 质量管理模块：数据可靠性选项
export const DATA_RELIABILITY_OPTIONS = [
  { value: '0', label: '不可靠' },
  { value: '1', label: '可靠' },
];

// 质量管理模块：服务质量选项
export const SERVICE_QUALITY_OPTIONS = [
  { value: 0, label: '缺考' },
  { value: -1, label: '不合格' },
  { value: 1, label: '合格' },
];

// 质量管理模块：合同履约选项
export const CONTRACT_PERFORMANCE_OPTIONS = [
  { value: '0', label: '不满足要求' },
  { value: '1', label: '满足要求' },
];
// 质量管理模块：建设单位意见选项
export const CONSTRUCTION_UNIT_OPINION_OPTIONS = [
  { value: '0', label: '无' },
  { value: '1', label: '有' },
];
// 质量管理模块中 选择是否在岗 配置
export const QUALITY_CHECK_STATUS_OPTIONS = [
  { value: '0', label: '否' },
  { value: '1', label: '是' },
];

export const FORENSIC_STATUS_OPTIONS = [
  { value: '0', label: '土建' },
  { value: '1', label: '安装' },
  { value: '2', label: '电气' },
  { value: '3', label: '仪表' },
  { value: '4', label: '材料检验' },
];

// 质量检查员年审 质量事故情况状态
export const ACCIDENT_STATUS_OPTIONS_MAP = [
  { value: '0', label: '无' },
  { value: '1', label: '特大' },
  { value: '2', label: '重大' },
  { value: '3', label: '较大' },
  { value: '4', label: '一般' },
]

// 质量模块 焊工业绩-特种设备类别
export const WELDER_EQUIPMENT_TYPE_OPTIONS = [
  { value: '1', label: '压力容器制造' },
  { value: '2', label: '压力容器现场组焊' },
  { value: '3', label: '压力管道安装' },
  { value: '4', label: '锅炉安装改造维修' },
  { value: '5', label: '起重机械制造' },
]

// 质量管理模块- 创优情况计划页面- 创优类型选项（支持多选）
export const MERIT_TYPES_OPTIONS = [
  { label: '国家级优秀焊接工程', value: 5 },
  { label: '局级安装工程优质奖', value: 1 },
  { label: '局级优质工程', value: 2 },
  { label: '省部级石油安装工程', value: 3 },
  { label: '省部级优质工程', value: 4 },
  { label: '国家级优质工程', value: 6 },
  { label: '国家级中国安装之星', value: 7 },
];
/**
 * 质量审批的funcode
 */
export const APPROVAL_FUNCODE = {
  PressureVesselConstructionPerformanceApproval: PROP_KEY === 'dep' ? "S43" : "S59",//压力容器施工业绩审批
  PressureVesselQAStaffRecommendationApproval: "S44",//压力容器质保体系责任人员推荐审批
  PressureVesselRiskControlListApproval: "S45",//压力容器质量安全风险管控清单审批
  PressureVesselDailyCheckApproval: "S46",//压力容器每日质量安全检查记录审批
  PressureVesselWeeklyCheckApproval: "S47",//压力容器每周质量安全检查记录审批
  PressureVesselMonthlyMeetingApproval: "S48",//压力容器每月质量安全调度会议纪要审批
  PressurePipelineConstructionPerformanceApproval: "S51",//压力管道施工业绩审批
  PressurePipelineQAStaffRecommendationApproval: "S52",//压力管道质保体系责任人员推荐审批
  BoilerConstructionPerformanceApproval: "S53",//锅炉施工业绩审批
  BoilerQAStaffRecommendationApproval: "S54",//锅炉质保体系责任人员推荐审批
  HoistingMachineryConstructionPerformanceApproval: PROP_KEY === 'dep' ? "S55" : "S60",//起重机械施工业绩审批
  HoistingMachineryQAStaffRecommendationApproval: "S56",//起重机械质保体系责任人员推荐审批
  PipelineComponentConstructionPerformanceApproval: "S57",//压力管道元件施工业绩审批
  PipelineComponentQAStaffRecommendationApproval: "S58",//压力管道元件质保体系责任人员推荐审批
} as const;


export const PRICE_ARRAY = [
  // 合同
  "contract_say_price",
  "contract_un_say_price",

  //税务相关
  "beginning_month_amount",
  "debit_amount",
  "creditor_amount",
  "ending_month_amount",
]

// 1-全体，2-部门，3-工种，4-角色，5-个人
export const PUSH_RANGE_TYPE = [
  {type: '1', typeName: '全体'},
  {type: '2', typeName: '部门'},
  {type: '3', typeName: '工种'},
  {type: '4', typeName: '角色'},
  {type: '5', typeName: '个人'},
]

export const QUESTION_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const SYMBOLS = {
  star: '★',      // 五角星
  blackCircle: '⬤', // 黑圆
  circle: '◯'      // 圆圈
};
