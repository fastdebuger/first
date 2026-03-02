export interface ICollectionOfRiskIncidents {
  /**
   * 公司机关业务相关部门
   */
  company_name: string;
  /**
   * 已采取的应对措施
   */
  counter_measures: string;
  /**
   * 用户编码
   */
  currUserCode: string;
  /**
   * 用户名称
   */
  currUserName: string;
  /**
   * 发生时间
   */
  happen_time: number;
  /**
   * 可能或已造成的损失及影响
   */
  injury_or_damage?: string;
  /**
   * 报送单位
   */
  push_unit: string;
  /**
   * 原因分析
   */
  reason_analysis?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 填报人
   */
  report_name: string;
  /**
   * 填报类型 1-日常填报 2-待办任务
   */
  report_type: number;
  /**
   * 填报单位
   */
  report_unit: string;
  /**
   * 风险类别（配置表id）
   */
  risk_category: string;
  /**
   * 风险事件名称
   */
  risk_events_name: string;
  /**
   * 风险级别 1-低度 2-较低 3-中度 4-高度 5-极高
   */
  risk_level: number;
  /**
   * 风险类型 1-风险损失事件 2-潜在风险损失事件
   */
  risk_type: number;
  /**
   * 发生地点
   */
  scene: string;
  /**
   * 当期情况描述
   */
  situation_description?: string;
  /**
   * 时间
   */
  ts: string;
  /**
   * 项目部编码
   */
  wbs_code: string;
  [property: string]: any;
}


export interface ICollectionOfRiskIncidentsApproval {
  ctoken?: string;
  /**
   * 当前项目部编码
   */
  currDepCode?: string;
  func_code?: string;
  /**
   * 风险事件收集表ID
   */
  id?: string;
  instanceId?: string;
  instanceName?: string;
  /**
   * 语言类型
   */
  langType?: string;
  user_id?: string;
  /**
   * 项目部编码
   */
  wbs_code?: string;
  [property: string]: any;
}


export interface IGetInfo {
  /**
   * 当前项目部编码
   */
  currDepCode?: string;
  /**
   * 排序字段
   */
  sort: string;
  /**
   * 时区
   */
  tz: string;
  [property: string]: any;
}


export interface IRiskCategoryConfig {
  /**
   * 父级ID，小类才有，大类均为null
   */
  parent_id?: string;
  /**
   * 风险类别类型 1-大类 2-小类
   */
  risk_category_type?: string;
  /**
   * 排序字段
   */
  sort?: string;
  [property: string]: any;
}


export interface IDelInfo {
  id?: string;
  [property: string]: any;
}

export interface ISaveBatch {
  /**
   * 当前项目部编码
   */
  currDepCode?: string;
  /**
   * 批量保存的内容，里面需要填写的字段参考新增风险时间收集信息
   */
  Items?: string;
  [property: string]: any;
}