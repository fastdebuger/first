# wbs 对照表
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_wbs_define_compare
(
  id                              int auto_increment primary key,            # 自增主键
  temporary_wbs_define_code       varchar(100),                              # 临时项目定义
  wbs_define_code                 varchar(100),                              # 项目定义
  wbs_define_name                 varchar(100),                              # 项目名称
  wbs_major_category              varchar(100),                              # 项目大类
  wbs_medium_category             varchar(100),                              # 项目中类
  wbs_minor_category              varchar(100),                              # 项目小类
  profit_center_code              varchar(100),                              # 利润中心
  profit_wbs_name                 varchar(100),                              # 名称
  profit_belong_wbs_name          varchar(100),                              # 分公司
  business_partner                varchar(100),                              # 往来单位
  client_name                     varchar(100),                              # 客户名称
  trade_partner                   varchar(100),                              # 贸易伙伴
  company_name                    varchar(100),                              # 公司名称
  company_size                    varchar(100),                              # 企业规模
  company_size_description        varchar(100),                              # 企业规模描述
  operating_status                varchar(100),                              # 经营状态
  operation_status_description    varchar(100),                              # 经营状态描述
  project_year                    varchar(100),                              # 立项年度
  plan_start_time                 varchar(100),                              # 计划开始日期
  plan_finish_time                varchar(100),                              # 计划完成日期
  project_system_status           varchar(100),                              # 项目系统状态
  income_method                   varchar(100),                              # 收入确认方式
  fmis_self_six_code              varchar(100),                              # FMIS自辅06编号
  fmis_self_six_name              varchar(100),                              # FMIS自辅06名称
  project_level                   varchar(100),                              # 项目等级
  project_address                 varchar(100),                              # 项目地点
  project_location                varchar(100),                              # 项目部所在地
  responsible_person              varchar(100),                              # 负责人
  contact_information             varchar(100),                              # 联系方式
  main_workload                   varchar(100),                              # 主要工作量
  inside_outside_group            varchar(100),                              # 集团内外
  remark                          varchar(100)                               # 备注
)


# 往来单位
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_business_partner
(
  id                                    int auto_increment primary key,                         # 自增主键
  group_code                            varchar(100),                                           # 分组
  business_partner_code                 varchar(100),                                           # 业务伙伴
  client_code                           varchar(100),                                           # 客户
  supplier_code                         varchar(100),                                           # 供应商编号
  name_1                                varchar(100),                                           # 名称1
  search_2                              varchar(100),                                           # 搜索条件2
  unit_category                         varchar(100),                                           # 单位分类
  unit_category_description             varchar(100),                                           # 单位分类描述
  unit_type                             varchar(100),                                           # 单位性质
  unit_type_description                 varchar(100),                                           # 单位性质描述
  company_type                          varchar(100),                                           # 企业类型
  company_type_description              varchar(100),                                           # 企业类型描述
  company_size                          varchar(100),                                           # 企业规模
  company_size_description              varchar(100),                                           # 企业规模描述
  belong_company_type                   varchar(100),                                           # 所属集团类型
  belong_company_type_description       varchar(100),                                           # 所属集团类型描述
  belong_company_name                   varchar(100),                                           # 所属集团名称
  belong_company_name_description       varchar(100),                                           # 所属集团名称描述
  contact_hongkong                      varchar(100),                                           # 关联人士-香港准则
  contact_hongkong_description          varchar(100),                                           # 关联人士-香港准则描述
  contact_inter                         varchar(100),                                           # 关联人士-国际准则
  contact_inter_description             varchar(100),                                           # 关联人士-国际准则描述
  operation_status                      varchar(100),                                           # 经营状态
  operation_status_description          varchar(100),                                           # 经营状态描述
  organization_code                     varchar(100),                                           # 组织机构编码
  internal_employee_code                varchar(100),                                           # 内部员工编号
  trade_partner                         varchar(100),                                           # 贸易伙伴
  company_name                          varchar(100)                                            # 公司名称
)



# 项目信息统计
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_project_information
(
  id                                    int auto_increment primary key,            # 自增主键
  wbs_define_code                       varchar(100),                              # 项目定义
  wbs_define_name                       varchar(100),                              # 项目名称
  profit_center_code                    varchar(100),                              # 利润中心
  owner_group                           varchar(100),                              # 工程所属集团
  client_name                           varchar(100),                              # 客户名称
  contract_start_date                   varchar(100),                              # 合同开工时间
  actual_start_date                     varchar(100),                              # 实际开工时间
  contract_end_date                     varchar(100),                              # 计划完工时间
  actual_end_date                       varchar(100),                              # 实际完工时间
  contract_say_price                    varchar(100),                              # 合同额(含税价)
  contract_un_say_price                 varchar(100),                              # 合同额(不含税价)
  project_status                        int,                                       # 工程状态
  settlement_status                     int,                                       # 结算状态
  project_level                         varchar(100),                              # 项目级别
  company_supervision_user              varchar(100),                              # 公司督导负责人
  sub_company_manager                   varchar(100),                              # 分公司经理
  sub_company_supervision_user          varchar(100),                              # 分公司督导负责人
  project_manager                       varchar(100),                              # 项目经理
  project_sub_engine_manager            varchar(100),                              # 项目工程副经理
  project_sub_settlement_manager        varchar(100),                              # 项目经营副经理
  project_finance_user                  varchar(100),                              # 项目财务负责人
  remark                                varchar(100)                               # 备注
)

# 项目信息统计修改记录
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_project_information
(
  id                                    int auto_increment primary key,             # 自增主键
  project_info_id                       int,                                        # 项目信息表id
  version                               int,                                        # 版本号
  contect                               int                                         # 修改内容
)



# 在建项目资源结转情况表
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_resource_ongoing_project_h
(
  id                                    int auto_increment primary key,            # 自增主键
  wbs_define_code                       varchar(100),                              # 项目定义
  wbs_define_name                       varchar(100),                              # 项目(合同 合同名称)
  contract_sign_year                    varchar(100),                              # 合同签订年度
  inOrOut                               varchar(100),                              # 境内/境外
  relative_person_code                  varchar(100),                              # 合同相对人(往来单位编码)
  owner_name                            varchar(100),                              # 业主名称(合同 甲方单位名称)
  inside_outside_group                  varchar(100),                              # 集团内外
  income_method                         varchar(100),                              # 收入确认方式
  project_location                      varchar(100),                              # 项目所在地
  contract_say_price                    varchar(100),                              # 初始金额(合同 含税合同价)
  after_change_price_en                 varchar(100),                              # 变更后累计金额-美元
  rate                                  varchar(100),                              # 汇率
  change_price_zh                       varchar(100),                              # 变更后金额-元人民币
  hetong_shouru_cha                     varchar(100),                              # 合同额与收入差
  add_rate                              varchar(100),                              # 增值税率
  is_finish_no_close                    varchar(100),                              # 是否为已完工未关闭合同项目
  in_company_jia_name                   varchar(100),                              # 公司内部项目甲方名称
  contract_sign_date                    varchar(100),                              # 合同签订日期
  contract_start_date                   varchar(100),                              # 项目开工日期(合同 合同开工日期)
  contract_area                         varchar(100),                              # 合同约定工期(合同 完工-开工)
  project_jiexie_date                   varchar(100),                              # 项目机械完工时间
  project_finish_date                   varchar(100),                              # 项目终交时间
  company_a_b                           varchar(100),                              # 当年公司AB类标注
  -- 项目责任预算
  expected_revenue_price                varchar(100),                              # 预计收入
  expected_cost                         varchar(100),                              # 预计成本
  gross_profit                          varchar(100),                              # 毛利
  -- 合计
  operating_revenue                     varchar(100),                              # 营业收入
  cost_price                            varchar(100),                              # 成本费用
  finance_price                         varchar(100),                              # 财务费用
  profit_total_price                    varchar(100),                              # 利润总额
  income_tax                            varchar(100),                              # 所得税
  net_profix                            varchar(100),                              # 净利润
  net_profix_rate                       varchar(100),                              # 净利润率
  profit_center_code                    varchar(100),                              # 利润中心
  remark                                varchar(100)                               # 备注
)

# 在建项目资源结转情况表体-决算数据
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_resource_ongoing_project_b1
(
  id                                    int auto_increment primary key,            # 自增主键
  h_id                                  int,                                       # 表头id
  wbs_define_code                       varchar(100),                              # 项目定义
  type_code                             varchar(100),                              # 类型 before 上年及以前决算数据 | curr 当年数据 | begin_curr 当年1月-当月实际 | next_end 当年下月-当年12月实际 | next_year 下年 | next_next_year 下下年及以后
  contract_price                        varchar(100),                              # 合同额
  operating_revenue                     varchar(100),                              # 营业收入
  cost_price                            varchar(100),                              # 成本费用
  finance_price                         varchar(100),                              # 财务费用
  profit_total_price                    varchar(100),                              # 利润总额
  income_tax                            varchar(100),                              # 所得税
  net_profix                            varchar(100),                              # 净利润
  net_profix_rate                       varchar(100)                               # 净利润率
)

# 在建项目资源结转情况表体-三金及减值
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_resource_ongoing_project_b2
(
  id                                    int auto_increment primary key,            # 自增主键
  h_id                                  int,                                       # 表头id
  wbs_define_code                       varchar(100),                              # 项目定义
  type                                  varchar(100),                              # 类型 1 三金数据-本期期末 | 2 减值-本期期末 | 3 三金数据-预计到本年期末 | 4 减值-预计到本年期末
  contract_price                        varchar(100),                              # 合同资产
  actual_price                          varchar(100),                              # 应收款项
  save_amount                           varchar(100)                               # 存货
)

  # 在建项目资源结转情况表体-负债
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_resource_ongoing_project_b3
(
  id                                    int auto_increment primary key,            # 自增主键
  h_id                                  int,                                       # 表头id
  wbs_define_code                       varchar(100),                              # 项目定义
  curr_moment_provision                 varchar(100),                              # 预计负债-本期期末
  curr_year_provision                   varchar(100)                               # 预计负债-本年末
)


  # 在建项目资源结转情况表体-决算数据附加数据 (公司级填报)
create table db_wm_buss_zyyj_ims.tbl_finance_profit_loss_resource_ongoing_project_b1_extra
(
  id                                    int auto_increment primary key,            # 自增主键
  b1_type_code                          varchar(100),                              # 类型 before 上年及以前决算数据 | curr 当年数据 | begin_curr 当年1月-当月实际 | next_end 当年下月-当年12月实际 | next_year 下年 | next_next_year 下下年及以后
  type_code                             varchar(100),                              # 类型 operating_revenue 营业收入 | cost_price 成本费用 | finance_price 财务费用 | profit_total_price 利润总额 | income_tax 所得税 | net_profix 净利润 | net_profix_rate 净利润率
  period_total_cost                     varchar(100),                              # 期间费用等
  domestic_manage_price                 varchar(100),                              # 国内管理费用
  finance_price                         varchar(100),                              # 财务费用
  non_operating_price                   varchar(100),                              # 减值和营业外等
  domestic_income_tax                   varchar(100)                               # 国内所得税
)







