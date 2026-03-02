// subComp
export default [
  {
    path: 'subComp/contract',
    name: '合同台账表单',
    authority: "S51F200",
    icon: 'icon-hetong',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    routes: [
      {
        path: '/subComp/contract',
        redirect: '/subComp/contract/income',
      },
      {
        path: 'income',
        authority: "S51F201",
        name: '收入合同台账',
        component: './Contract/Income',
      },
      {
        path: 'expenditure',
        authority: "S51F202",
        name: '支出合同台账',
        component: './Contract/Expenditure',
      },
    ]
  },
  {
    path: 'subComp/EnterpriseRiskManagement',
    authority: "S51F900",
    name: '全面风险管理',
    icon: 'icon-fengxianjianguan',
    desc: '风险事件收集、项目风险...',
    color: 'iconOrange',
    routes: [
      {
        path: '/subComp/EnterpriseRiskManagement',
        redirect: '/subComp/EnterpriseRiskManagement/CollectionOfRiskIncidents',
      },
      {
        path: 'CollectionOfRiskIncidents',
        authority: "S51F901",
        name: '风险事件收集',
        component: './EnterpriseRisk/CollectionOfRiskIncidents',
      },
      {
        path: 'ProjectRisk',
        authority: "S51F902",
        name: '项目风险',
        routes: [
          {
            path: 'SharedFile',
            authority: "S51F908",
            name: '共享文件',
            component: './EnterpriseRisk/SharedFile',
          },
          // {
          //   path: 'SharedFileByType',
          //   authority: "S51F908",
          //   name: '公司风险管理文件',
          //   component: './EnterpriseRisk/SharedFileByType',
          // },
          {
            path: 'ProjectRiskAssessment',
            authority: "S51F909",
            name: '项目风险评估结果',
            component: './EnterpriseRisk/ProjectRiskAssessment',
          },
          {
            path: 'ProjectRiskGovernance',
            authority: "S51F902",
            name: '项目风险管控',
            component: './EnterpriseRisk/ProjectRiskGovernance',
          },
        ]
      },

      {
        path: 'AnnualAssessment',
        authority: "S51F903",
        name: '公司年度重大风险评估',
        routes: [
          {
            path: 'AnnualAssessmentOfKeyOrganizationalRisks',
            authority: "S51F904",
            name: '公司年度风险评估调查表',
            component: './EnterpriseRisk/AnnualAssessment',
          },
          {
            path: 'RiskAssessmentRanking',
            authority: "S51F905",
            name: '风险评估排名',
            component: './EnterpriseRisk/RiskAssessmentRanking',
          },
          {
            path: 'AnnualRiskDatabase',
            authority: "S51F906",
            name: '公司年度重大经营风险评估数据库',
            component: './EnterpriseRisk/AnnualRiskDatabase',
          },
        ]
      }
    ]
  },
  {
    path: 'subComp/costControl',
    name: '费控管理',
    authority: "S51F300",
    icon: 'icon-feikong',
    desc: '进度款、工程结算及签证...',
    color: 'iconBlue',
    routes: [
      {
        path: '/subComp/costControl',
        redirect: '/subComp/costControl/progress/mainContractProgress',
      },
      {
        path: 'progress',
        authority: "S51F301",
        name: '进度款管理',
        routes: [
          {
            path: 'mainContractProgress',
            authority: "S51F302",
            name: '主合同进度款管理',
            component: './CostControl/Progress/MainContractProgress',
          },
          {
            path: 'subcontractorProgress',
            authority: "S51F303",
            name: '分包合同进度款管理',
            component: './CostControl/Progress/SubcontractorProgress',
          },
        ]
      },
      {
        path: 'settlement',
        authority: "S51F304",
        name: '工程结算管理',
        routes: [
          {
            path: 'mainContractSettlement',
            authority: "S51F305",
            name: '主合同工程结算管理',
            component: './CostControl/Settlement/MainContractSettlement',
          },
          {
            path: 'subcontractorSettlement',
            authority: "S51F306",
            name: '分包合同工程结算管理',
            component: './CostControl/Settlement/SubcontractorSettlement',
          },
        ]
      },
      {
        path: 'visa',
        authority: "S51F307",
        name: '签证管理',
        routes: [
          {
            path: 'mainContractVisa',
            authority: "S51F308",
            name: '主合同签证管理',
            component: './CostControl/Visa/MainContractVisa',
          },
          {
            path: 'subContractVisa',
            authority: "S51F309",
            name: '分包合同签证管理',
            component: './CostControl/Visa/SubContractVisa',
          },
        ]
      },
    ]
  },
  {
    path: 'subComp/materialsAndserviceProcurement',
    name: '物资及服务采购管理',
    authority: "S51F400",
    icon: 'icon-caigou',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    routes: [
      {
        path: '/subComp/materialsAndserviceProcurement',
        redirect: '/subComp/materialsAndserviceProcurement/Procurement',
      },
      {
        path: 'Procurement',
        authority: "S51F401",
        name: '总体采购策略管理',
        component: './Procurement/Overall',
      },
      {
        name: '基础数据',
        authority: 'S51F402',
        path: 'base',
        routes: [
          {
            name: '物料分类配置',
            authority: 'S51F403',
            path: 'ClsConfig',
            component: './Procurement/Base/ClsConfig',
          },
          {
            name: '不允许发放物料',
            authority: 'S51F404',
            path: 'RefuseProdInfo',
            component: './Procurement/Base/RefuseProdInfo',
          },
          {
            name: '物料信息',
            authority: 'S51F405',
            path: 'ProdInfo',
            component: './Procurement/Base/ProdInfo',
          },
          {
            name: '物料分类信息',
            authority: 'S51F406',
            path: 'ClsInfo',
            component: './Procurement/Base/ClsInfo',
          },
          {
            name: '物料代用信息',
            authority: 'S51F407',
            path: 'Substitution',
            component: './Procurement/Base/Substitution',
          },
          {
            name: '仓库信息',
            authority: 'S51F408',
            path: 'warehouseInfo',
            component: './Procurement/Base/WarehouseInfo',
          },
        ],
      },
      {
        name: '需求计划',
        authority: 'S51F409',
        path: 'JiaPurchasePlan',
        component: './Procurement/JiaPurchasePlan',
      },
      {
        name: '分割预算',
        authority: 'S51F410',
        path: 'JiaSplitBudget',
        component: './Procurement/JiaSplitBudget',
      },
      {
        name: '平衡利库',
        authority: 'S51F411',
        path: 'BalancedLiquidity',
        component: './Procurement/BalancedLiquidity',
      },
      {
        path: 'PlanManagement',
        authority: "S51F412",
        name: '计划管理',
        routes: [
          {
            path: 'ProcurementPlan',
            authority: "S51F413",
            name: '采购计划',
            component: './Procurement/ProcurementPlan',
          },
          // {
          //   path: 'ProcurementPlanFirst',
          //   authority: "S51F414",
          //   name: '采购计划一级分配',
          //   component: './Procurement/ProcurementPlanFirst',
          // },
          // {
          //   path: 'ProcurementPlanSecond',
          //   authority: "S51F415",
          //   name: '采购计划二级分配',
          //   component: './Procurement/ProcurementPlanSecond',
          // },
          // {
          //   path: 'ProcurementPlanThird',
          //   authority: "S51F416",
          //   name: '采购计划三级分配',
          //   component: './Procurement/ProcurementPlanThird',
          // },
        ]
      },
      // {
      //   path: 'PurchaseTask',
      //   authority: "S51F417",
      //   name: '采购任务',
      //   component: './Procurement/PurchaseTask',
      // },
      {
        path: 'SupplierInfo',
        authority: "S51F418",
        name: '供应商信息',
        component: './Procurement/SupplierInfo',
      },
      {
        path: 'Purchase',
        authority: "S51F419",
        name: '采购组信息',
        component: './Procurement/Purchase',
      },
      {
        name: '会议管理',
        authority: 'S51F420',
        path: 'meetingManagement',
        routes: [
          {
            name: '委员会职务档案',
            authority: 'S51F421',
            path: 'committeePosition',
            component: './Procurement/MeetingManagement/CommitteePosition',
          },
          {
            name: '人员档案',
            authority: 'S51F422',
            path: 'personnelFile',
            component: './Procurement/MeetingManagement/PersonnelFile',
          },
          {
            name: '会议上会条件设置',
            authority: 'S51F423',
            path: 'meetingCondition',
            component: './Procurement/MeetingManagement/MeetingCondition',
          },
          {
            name: 'TC会议管理',
            authority: 'S51F424',
            path: 'tcMeeting',
            component: './Procurement/MeetingManagement/TcMeeting',
          },
        ],
      },
    ]
  },
  {
    path: 'subComp/safetyGreen',
    name: '安全管理',
    authority: "S51F700",
    icon: 'icon-anquan1',
    desc: '采购供应商、物料计划及发放...',
    color: 'iconRed',
    routes: [
      {
        path: '/branchComp/safetyGreen',
        redirect: '/branchComp/safetyGreen/legalRequirements/library',
      },
      {
        path: 'SafetyGreenDataCockpit',
        authority: "S51F715",
        name: '数据驾驶舱',
        component: './SafetyGreen/DataCockpit',
      },
      {
        path: 'legalRequirements',
        authority: "S51F706",
        name: '法律法规及其他要求',
        routes: [
          {
            path: 'library',
            authority: "S51F707",
            name: 'HSE法律法规库',
            component: './SafetyGreen/LegalRequirements/HSELibrary',
          },
          {
            path: 'libraryConfig',
            authority: "S51F708",
            name: 'HSE法律法规库上传',
            component: './SafetyGreen/LegalRequirements/HSELibraryConfig',
          },
        ]
      },
      {
        path: 'inspect',
        authority: "S51F701",
        name: '监督检查',
        routes: [
          {
            path: 'workpoionts',
            authority: "S51F705",
            name: '记分管理',
            component: './SafetyGreen/Workpoionts',
          },
          {
            path: 'qualitySafetyOversight',
            authority: "S51F702",
            name: '质量安全监督检查问题清单',
            component: './SafetyGreen/Inspect/QualitySafetyOversight',
          },
          {
            path: 'safetyOversight',
            authority: "S51F717",
            name: '安全监督检查问题清单',
            component: './SafetyGreen/Inspect/SafetyOversight',
          },
          {
            path: 'questionClassification',
            authority: "S51F703",
            name: '问题归类配置',
            component: './SafetyGreen/Inspect/QuestionClassification',
          },
          {
            path: 'problemStatistics',
            authority: "S51F702",
            name: '问题统计',
            component: './SafetyGreen/Inspect/ProblemStatistics',
          },
          {
            path: 'ProblemStatisticsSecurity',
            authority: "S51F702",
            name: '安全问题统计',
            component: './SafetyGreen/Inspect/ProblemStatisticsSecurity',
          },
          {
            path: 'unitRanking',
            authority: "S51F704",
            name: '单位排名',
            component: './SafetyGreen/Inspect/UnitRanking',
          },
        ]
      },
      // {
      //   path: 'securityCheck',
      //   authority: "S51F307",
      //   name: '安全检查',
      //   routes: [
      //     {
      //       path: 'dailyOnSiteHSEInspection',
      //       authority: "S51F308",
      //       name: '现场日常HSE检查',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      // {
      //   path: 'performanceAppraisal',
      //   authority: "S51F307",
      //   name: '绩效考核',
      //   routes: [
      //     {
      //       path: 'corporateHSEPerformanceAppraisal',
      //       authority: "S51F308",
      //       name: '单位HSE绩效考核',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      {
        path: 'emergencyManagement',
        authority: "S51F712",
        name: '应急管理',
        routes: [
          {
            path: 'emergencyResponsibility',
            authority: "S51F713",
            name: '应急预案',
            component: './SafetyGreen/EmergencyResponsibility',
          },
          {
            path: 'legislation',
            authority: "S51F718",
            name: '处置规程',
            component: './SafetyGreen/Legislation',
          }
        ]
      },
      {
        path: 'lessonsLearned',
        authority: "S51F709",
        name: '经验分享',
        routes: [
          {
            path: 'lessonsLearned',
            authority: "S51F710",
            name: '经验分享',
            component: './SafetyGreen/LessonsLearned',
          },
          {
            path: 'lessonsLearnedConfig',
            authority: "S51F711",
            name: '经验分享上传',
            component: './SafetyGreen/LessonsConfig',
          },
        ]
      },
      {
        path: 'DataDashboardConfig',
        authority: "S51F716",
        name: '数据驾驶舱配置',
        component: './SafetyGreen/DataCockpitConfig',
      },
    ]
  },
  {
    path: 'subComp/engineering',
    name: '工程管理',
    authority: "S51F500",
    icon: 'icon-gongchengshi',
    desc: '周报、月报及作业许可...',
    color: 'iconCyan',
    routes: [
      {
        path: '/subComp/engineering',
        redirect: '/subComp/engineering/scheduleManagement/BasicInfoManage/projectBasicInfo',
      },
      {
        path: 'scheduleManagement',
        name: '进度管理',
        authority: "S51F510",
        routes: [
          {
            path: 'BasicInfoManage',
            authority: "S51F502",
            name: '基本信息管理',
            routes: [
              {
                path: 'projectBasicInfo',
                authority: "S51F503",
                name: '项目基本信息',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfo',
              },
              {
                path: 'projectBasicInfoApproval',
                authority: "S51F504",
                name: '项目基本信息审批',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfoApproval',
              },
            ]
          },
          {
            path: 'monthly',
            authority: "S51F515",
            name: '项目月报',
            routes: [
              {
                path: 'monthlySubConfirm',
                authority: "S51F516",
                name: '分公司月报确认',
                component: './Engineering/Month/SubMonthlyConfirm',
              },
            ]
          },

          {
            path: 'engineerProjectLedger',
            name: '工程项目台账',
            authority: "S51F517",
            component: './Engineering/EngineerProjectLedger',
          },
          {
            path: 'monthlyConstructPlan',
            name: '月度施工计划',
            authority: "S51F518",
            component: './Engineering/MonthlyConstructPlan',
          },
          {
            path: 'yearProductPlan',
            name: '年度生产计划',
            authority: "S51F519",
            component: './Engineering/YearProductPlan',
          },
        ]
      },
      {
        path: 'contractor',
        authority: "S51F505",
        name: '承包商管理',
        routes: [
          {
            path: 'contractorPersonnel',
            authority: "S51F506",
            name: '承包商人员信息',
            component: './Engineering/Contractor/ContractorPersonnel',
          },
          {
            path: 'contractorAnnualEval',
            authority: "S51F507",
            name: '承包商年度评价基本信息',
            component: './Engineering/Contractor/ContractorAnnualEval',
          },
          {
            path: 'contractorInspection',
            authority: "S51F508",
            name: '承包商施工作业过程中监督检查表',
            component: './Engineering/Contractor/ContractorInspection',
          },
        ]
      },
      {
        path: 'workLicenseRegister',
        name: '作业许可证登记表',
        authority: "S51F537",
        component: './Engineering/WorkLicenseRegister',
      },
      {
        path: 'WorkPermitStatistics',
        name: '作业许可证管理统计',
        authority: "S51F538",
        component: './Engineering/WorkPermitStatistics',
      },
      {
        path: 'levelConstructor',
        name: '一级建造师',
        authority: "S51F539",
        component: './Engineering/LevelConstructor',
      },
    ]
  },

  {
    path: 'subComp/technology',
    name: '技术管理',
    authority: "S51F800",
    icon: 'icon-jishu-line',
    desc: '技术文件及质量、HSE...',
    color: 'iconOrange',
    routes: [
      {
        path: '/subComp/technology',
        redirect: '/subComp/technology/technicalDocument/technologyAuditOrganization/technologyAuditOrganizationStats',
      },
      {
        path: 'technicalDocument',
        name: '技术文件管理',
        authority: "S51F801",
        routes: [
          {
            path: 'technologyAuditOrganization',
            name: '施工组织设计',
            authority: "S51F802",
            routes: [
              {
                path: 'technologyAuditOrganizationStats',
                authority: "S51F802",
                name: '施工组织设计统计',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganizationStats',
              },
              {
                path: 'TechnologyAuditOrganization',
                authority: "S51F802",
                name: '施工组织设计审批',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganization',
              },
            ]
          },
          {
            path: 'technologyAuditQuality',
            name: '质量计划',
            authority: "S51F803",
            routes: [
              {
                path: 'technologyAuditQualityStats',
                authority: "S51F803",
                name: '质量计划统计',
                component: './Technology/TechnicalDocument/TechnologyAuditQualityStats',
              },
              {
                path: 'TechnologyAuditQuality',
                authority: "S51F803",
                name: '质量计划审批',
                component: './Technology/TechnicalDocument/TechnologyAuditQuality',
              },
            ]
          },
          {
            path: 'hseRiskManagement ',
            authority: "S51F804",
            name: 'HSE风险管理',
            routes: [
              {
                path: 'technologyAuditHse',
                name: 'HSE危害因素辨识与风险评价报告',
                authority: "S51F804",
                routes: [
                  {
                    path: 'technologyAuditHseStats',
                    authority: "S51F804",
                    name: 'HSE危害因素辨识与风险评价报告统计',
                    component: './Technology/TechnicalDocument/TechnologyAuditHseStats',
                  },
                  {
                    path: 'TechnologyAuditHse',
                    authority: "S51F804",
                    name: 'HSE危害因素辨识与风险评价报告',
                    component: './Technology/TechnicalDocument/TechnologyAuditHse',
                  },
                ]
              },
              {
                path: 'technologyHseRiskControlList',
                authority: "S51F805",
                name: 'HSE重大风险清单',
                component: './Technology/TechnicalDocument/TechnologyHseRiskControlList',
              },
              {
                path: 'hseRiskManagementYear',
                authority: "S51F806",
                name: '年度HSE风险管理',
                routes: [
                  {
                    path: 'technologyHseRiskControlListYear',
                    authority: "S51F806",
                    name: 'HSE重大风险及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyHseRiskControlListYear',
                  },
                  {
                    path: 'technologyEnvironmentalControlListYear',
                    authority: "S51F807",
                    name: ' 重要环境因素及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyEnvironmentalControlListYear',
                  },
                ]
              },

            ]
          },

          {
            path: 'technologyAuditConstruction',
            authority: "S51F808",
            name: '施工技术方案',
            routes: [
              {
                path: 'technologyAuditConstructionStats',
                authority: "S51F808",
                name: '施工技术方案统计',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionStats',
              },
              {
                path: 'technologyAuditConstructionApproval',
                authority: "S51F808",
                name: '施工技术方案审批',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionApproval',
              },
            ]
          },
          {
            path: 'technologyAuditSummary',
            name: '项目总结审批',
            authority: "S51F809",
            routes: [
              {
                path: 'technologyAuditSummaryStats',
                authority: "S51F809",
                name: '项目总结统计',
                component: './Technology/TechnicalDocument/TechnologyAuditSummaryStats',
              },
              {
                path: 'TechnologyAuditSummary',
                authority: "S51F809",
                name: '项目总结审批',
                component: './Technology/TechnicalDocument/TechnologyAuditSummary',
              },
            ]
          },
          {
            path: 'handoverDocuments',
            authority: "S51F810",
            name: '交工资料归档',
            routes: [
              {
                path: 'technologyArchiveList',
                authority: "S51F810",
                name: '归档清单',
                component: './Technology/TechnicalDocument/TechnologyArchiveList',
              },
              {
                path: 'technologyArchiveListStatistics',
                authority: "S51F812",
                name: '交工资料归档统计',
                component: './Technology/TechnicalDocument/TechnologyArchiveListStatistics',
              },
            ]
          },
        ]
      },
      {
        path: 'nonconformitySummary',
        authority: "S51F811",
        name: '不合格品汇总',
        component: './Technology/NonconformitySummary',
      },


    ]
  },
  {
    path: 'subComp/MarketDevelopmentCente',
    authority: "S51F1100",
    name: '市场开发中心',
    icon: 'icon-shichangkaifa',
    desc: '业绩台账及投标报价...',
    color: 'iconBlue',
    routes: [
      {
        path: '/subComp/MarketDevelopmentCente',
        redirect: '/subComp/MarketDevelopmentCente/KnowledgeBase',
      },
      // {
      //   path: 'Dashboard',
      //   authority: "S51F1101",
      //   name: '数据驾驶舱',
      //   component: './MarketDevelopmentCente/Dashboard',
      // },
      {
        path: 'KnowledgeBase',
        authority: "S51F1102",
        name: '知识库文件管理',
        component: './MarketDevelopmentCente/KnowledgeBase',
      },
      {
        path: 'PerformanceLedger',
        authority: "S51F1103",
        name: '公司业绩台账',
        component: './MarketDevelopmentCente/PerformanceLedger',
      },
      {
        path: 'BidQuotation',
        authority: "S51F1104",
        name: '投标报价管理',
        component: './MarketDevelopmentCente/BidQuotation',
      },
      // {
      //   path: 'CertificationTracking',
      //   authority: "S51F1105",
      //   name: '人员证件管理',
      //   component: './MarketDevelopmentCente/CertificationTracking',
      // },
      {
        path: 'DashboardConfig',
        authority: "S51F1106",
        name: '数据驾驶舱配置',
        component: './MarketDevelopmentCente/DashboardConfig',
      },
    ]
  },
  {
    path: 'subComp/finance',
    name: '财务管理',
    authority: "S51F1400",
    icon: 'icon-caiwuguanli',
    desc: '税务、债权债务及损益...',
    color: 'iconOrange',
    routes: [
      {
        path: 'debt',
        name: '债权债务',
        authority: "S51F1401",
        routes: [
          {
            path: 'debtStatistics',
            authority: "S51F1402",
            name: '债权填报',
            component: './Finance/DebtStatistics',
          },
          {
            path: 'debtPaymentStatistics',
            authority: "S51F1403",
            name: '债务填报',
            component: './Finance/DebtPaymentStatistics',
          },
          {
            path: 'fundForecast',
            authority: "S51F1404",
            name: '净债权资金预测',
            component: './Finance/FundForecast',
          },
        ]
      },
    ]
  },
  {
    path: 'subComp/quality',
    name: '质量管理',
    authority: "S51F1300",
    icon: 'icon-zhiliang',
    desc: '质量月报、特殊设备及监督检查...',
    color: 'iconOrange',
    routes: [
      {
        path: '/subComp/quality',
        redirect: '/subComp/quality/qualityReport/overallQualityProducts/overallQualityProductsView',
      },
      {
        path: 'qualityReport',
        name: '质量月报',
        authority: "S51F1325",
        routes: [
          {
            path: 'qualityMonthlyReport',
            name: '质量月报汇总表',
            authority: "S51F1394",
            component: './Quality/QualityReport/QualityMonthlyReport',
          },
          {
            path: 'qualityProjectDataExist',
            name: '质量月报填报情况',
            authority: "S51F1326",
            component: './Quality/QualityReport/QualityProjectDataExist',
          },
          {
            path: 'overallQualityProducts',
            name: '工程产品总体质量情况',
            authority: "S51F1327",
            routes: [
              {
                path: 'overallQualityProductsView',
                name: '工程产品总体质量情况概述',
                authority: "S51F1328",
                component: './Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView',
              },
              {
                path: 'qualityProducedProducts',
                name: '自产产品制造质量情况',
                authority: "S51F1330",
                component: './Quality/QualityReport/OverallQualityProducts/QualityProducedProducts',
              },
              {
                path: 'qualityTechServiceQuality',
                name: '技术服务质量情况',
                authority: "S51F1329",
                component: './Quality/QualityReport/OverallQualityProducts/QualityTechServiceQuality',
              },
            ]
          },
          {
            path: 'qualitySystemOperation',
            name: '质量体系运行情况',
            authority: "S51F1331",
            component: './Quality/QualityReport/QualitySystemOperation',
          },
          {
            path: 'qualityActivities',
            name: '开展主要质量活动',
            authority: "S51F1332",
            routes: [
              {
                path: 'qualityInspection',
                name: '质量大检查及专项检查情况',
                authority: "S51F1333",
                component: './Quality/QualityReport/QualityActivities/QualityInspection',
              },
              {
                path: 'qualityExcellenceActivity',
                name: '创优活动开展情况',
                authority: "S51F1334",
                component: './Quality/QualityReport/QualityActivities/QualityExcellenceActivity',
              },
              {
                path: 'qualityQcActivity',
                name: 'QC小组活动开展情况',
                authority: "S51F1335",
                component: './Quality/QualityReport/QualityActivities/QualityQcActivity',
              },
            ]
          },
          {
            path: 'qualityDataAnalysis',
            name: '质量数据统计分析及采取措施',
            authority: "S51F1336",
            routes: [
              {
                path: 'qualityDataStatistics',
                name: '质量数据统计',
                authority: "S51F1337",
                routes: [
                  {
                    path: 'qualityNcCorrectiveAction',
                    name: '不合格项纠正措施记录',
                    authority: "S51F1338",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityNcCorrectiveAction',
                  },
                  {
                    path: 'qualityInspectionSummary',
                    name: '质量大(专项)检查主要不合格项汇总情况分布',
                    authority: "S51F1339",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityInspectionSummary',
                  },
                  {
                    path: 'qualityMonthlyWeldingPassRate',
                    name: '月度焊接一次合格率统计表',
                    authority: "S51F1340",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyWeldingPassRate',
                  },
                  {
                    path: 'qualityAccidentSummary',
                    name: '质量事故汇总表',
                    authority: "S51F1341",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
                  },
                  {
                    path: 'qualityMonthlyQualityStatistics',
                    name: '质量数据统计表',
                    authority: "S51F1342",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyQualityStatistics',
                  },
                ]
              },
              {
                path: 'qualityOtherQualityStatistics',
                name: '其它质量数据统计情况',
                authority: "S51F1343",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityOtherQualityStatistics',
              },
              {
                path: 'qualityStatisticsAnalysis',
                name: '质量统计数据分析情况',
                authority: "S51F1344",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityStatisticsAnalysis',
              },
            ],
          },
          {
            path: 'criticalNonconformities',
            name: '严重不合格品及质量事故情况',
            authority: "S51F1345",
            routes: [
              {
                path: 'qualitySeriousNonconformities',
                name: '本月严重不合格品情况',
                authority: "S51F1346",
                component: './Quality/QualityReport/CriticalNonconformities/QualitySeriousNonconformities',
              },
              {
                path: 'qualityIncidentDetails',
                name: '质量事故情况',
                authority: "S51F1347",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
              },
            ]
          },
          {
            path: 'qualityWorkArrangement',
            name: '工作安排及建议',
            authority: "S51F1348",
            component: './Quality/QualityReport/QualityWorkArrangement',
          },
          {
            path: 'qualityExperience',
            name: '质量经验分享',
            authority: "S51F1349",
            component: './Quality/QualityReport/QualityExperience',
          },
        ]
      },
      {
        path: 'SpecialEquipment',
        name: '特种设备管理',
        authority: "S51F1301",
        routes: [
          {
            path: 'SEOnlineNotification',
            name: '特种设备网上告知相关信息统计表',
            authority: "S51F1302",
            component: './Quality/SpecialEquipment/SEOnlineNotification',
          },
          {
            path: 'PressureVessel',
            name: '压力容器制造(组焊、安装改造修理)管理',
            authority: "S51F1310",
            routes: [
              {
                path: 'PressureVesselPreformance',
                name: '施工业绩',
                authority: "S51F1311",
                component: './Quality/SpecialEquipment/PressureVessel/PressureVesselPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "S51F1312",
                component: './Quality/SpecialEquipment/PressureVessel/PVQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "S51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "1"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "S51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "S51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "S51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "1"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "S51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "1"
              },
            ]
          },
          {
            path: 'PressurePiping',
            name: '压力管道管理',
            authority: "S51F1313",
            routes: [
              {
                path: 'PressurePipingPreformance',
                name: '施工业绩',
                authority: "S51F1314",
                component: './Quality/SpecialEquipment/PressurePiping/PressurePipingPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "S51F1315",
                component: './Quality/SpecialEquipment/PressurePiping/PPQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "S51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "2"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "S51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "S51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "S51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "2"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "S51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "2"
              },
            ]
          },
          {
            path: 'Boiler',
            name: '锅炉管理',
            authority: "S51F1316",
            routes: [
              {
                path: 'BoilerPreformance',
                name: '施工业绩',
                authority: "S51F1317",
                component: './Quality/SpecialEquipment/Boiler/BoilerPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "S51F1318",
                component: './Quality/SpecialEquipment/Boiler/BoilerQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "S51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "3"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "S51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "S51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "S51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "3"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "S51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "3"
              },
            ]
          },
          {
            path: 'HoistingMachinery',
            name: '起重机械管理',
            authority: "S51F1319",
            routes: [
              {
                path: 'HoistingMachineryPreformance',
                name: '施工业绩',
                authority: "S51F1320",
                component: './Quality/SpecialEquipment/HoistingMachinery/HoistingMachineryPreformance',
                marking: "4"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "S51F1321",
                component: './Quality/SpecialEquipment/HoistingMachinery/HMQAStaffNomination',
                marking: "4"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "S51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "4"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "S51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "S51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "S51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "4"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "S51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "4"
              },
            ]
          },
          {
            path: 'PipingComponents',
            name: '压力管道元件管理',
            authority: "S51F1322",
            routes: [
              {
                path: 'PipingComponentsPreformance',
                name: '施工业绩',
                authority: "S51F1323",
                component: './Quality/SpecialEquipment/PipingComponents/PipingComponentsPreformance',
                marking: "5"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "S51F1324",
                component: './Quality/SpecialEquipment/PipingComponents/PCQAStaffNomination',
                marking: "5"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "S51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "5"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "S51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "S51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "S51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "5"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "S51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "5"
              },
            ]
          },
          {
            path: 'SEPostConfig',
            name: '特种设备职务配置表信息',
            authority: "S51F1308",
            component: './Quality/SpecialEquipment/SEPostConfig',
          },
          {
            path: 'RskControlConfig',
            name: '特种设备质量安全风险管控清单配置表',
            authority: "S51F1309",
            component: './Quality/SpecialEquipment/RskControlConfig',
          },
        ]
      },

      {
        path: 'QualitySupervision',
        name: '质量监督管理',
        authority: "S51F1350",
        routes: [
          {
            path: 'QualityIssue',
            name: '质量监督检查问题清单',
            authority: "S51F1351",
            component: './Quality/QualitySupervision/QualityIssue',
          },
          {
            path: 'ProblemStatistics',
            name: '质量问题统计',
            authority: "S51F1352",
            component: './Quality/QualitySupervision/ProblemStatistics',
          },
          {
            path: 'ScoringPersonnel',
            name: '质量记分人员信息',
            authority: "S51F1353",
            component: './Quality/QualitySupervision/ScoringPersonnel',
          },
          {
            path: 'Contractor',
            name: '质量监督审核问题清单',
            authority: "S51F1354",
            component: './Quality/QualitySupervision/Contractor',
          },
          {
            path: 'QualityScore',
            name: '质量记分问题统计',
            authority: "S51F1355",
            component: './Quality/QualitySupervision/QualityScore',
          },
          {
            path: 'RewardPunishment',
            name: '质量奖惩情况统计表',
            authority: "S51F1356",
            component: './Quality/QualitySupervision/RewardPunishment',
          },
        ]
      },
      {
        path: 'inspectorManagement',
        name: '质量检查员管理',
        authority: "S51F1357",
        routes: [
          {
            path: 'inspectorSeniorityApply',
            name: '质量检查员资格证申请',
            authority: "S51F1358",
            component: './Quality/InspectorManagement/InspectorSeniorityApply',
          },
          {
            path: 'inspectorCerateLedger',
            name: '质量检查员办证台账',
            authority: "S51F1359",
            component: './Quality/InspectorManagement/InspectorCerateLedger',
          },
          {
            path: 'inspectorAnnualAudit',
            name: '质量检查员资格证年审',
            authority: "S51F1360",
            component: './Quality/InspectorManagement/InspectorAnnualAudit',
          },
        ]
      },
      {
        path: 'measuringManagement',
        name: '计量器具管理',
        authority: "S51F1361",
        routes: [
          {
            path: 'monitoringMeasuring',
            name: '监视和测量设备登记表',
            authority: "S51F1362",
            component: './Quality/MeasuringManagement/MonitoringMeasuring',
          },
          {
            path: 'monitoringMeasuringApproval',
            name: '监视和测量设备审批记录',
            authority: "S51F1363",
            component: './Quality/MeasuringManagement/MonitoringMeasuringApproval',
          },
          {
            path: 'monitoringMeasuringStatistical',
            name: '监视和测量设备信息统计表',
            authority: "S51F1364",
            component: './Quality/MeasuringManagement/MonitoringMeasuringStatistical',
          },
        ]
      },
      {
        path: 'personnelMeasurement',
        name: '计量人员管理',
        authority: "S51F1365",
        routes: [
          {
            path: 'personnelApplyForm',
            name: '计量人员资格申请表',
            authority: "S51F1366",
            component: './Quality/PersonnelMeasurement/PersonnelApplyForm',
          },
          {
            path: 'personnelLedger',
            name: '计量管理人员台账',
            authority: "S51F1367",
            component: './Quality/PersonnelMeasurement/PersonnelLedger',
          },
          {
            path: 'personnelLedgerAudit',
            name: '计量管理人员复审',
            authority: "S51F1368",
            component: './Quality/PersonnelMeasurement/PersonnelLedgerAudit',
          },
        ]
      },
      {
        path: 'outsourcedManagement',
        name: '外委实验室管理',
        authority: "S51F1369",
        routes: [
          {
            path: 'outsourcedSurveyAssess',
            name: '外委实验室调查评价表',
            authority: "S51F1370",
            component: './Quality/OutsourcedManagement/OutsourcedSurveyAssess',
          },
          {
            path: 'outsourcedLedger',
            name: '外委实验室资质台账',
            authority: "S51F1371",
            component: './Quality/OutsourcedManagement/OutsourcedLedger',
          },
          // {
          //   path: 'outsourcedLedgerAudit',
          //   name: '外委实验室年度审查表',
          //   authority: "S51F800",
          //   component: './Quality/OutsourcedManagement/OutsourcedLedgerAudit',
          // },
        ]
      },
      {
        path: 'RiskMonthlyManagement',
        name: '月度质量重大风险管理',
        authority: "S51F1373",
        routes: [
          {
            path: 'monthMajorQualityRisks',
            name: '月度重大质量风险',
            authority: "S51F1374",
            component: './Quality/MonthlyQualityRisk/MonthMajorQualityRisks',
          },
        ]
      },
      {
        path: 'RiskYearQualityManagement',
        name: '年度质量重大风险管理',
        authority: "S51F1377",
        routes: [
          {
            path: 'riskYearQualityPage',
            name: '年度质量风险评估',
            authority: "S51F1378",
            component: './Quality/YearQualityRisk/RiskYearQualityPage',
          },
          {
            path: 'YearMajorQualityRisks',
            name: '年度重大质量风险',
            authority: "S51F1379",
            component: './Quality/YearQualityRisk/YearMajorQualityRisks',
          },

        ]
      },
      {
        path: 'followManagement',
        name: '质量回访管理',
        authority: "S51F1381",
        routes: [
          {
            path: 'VisitFollowPlan',
            name: '质量回访计划',
            authority: "S51F1382",
            component: './Quality/FollowManagement/VisitFollowPlan',
          },
          // {
          //   path: 'VisitFollowPlanApproval',
          //   name: '质量回访计划审批',
          //   authority: "S51F800",
          //   component: './Quality/FollowManagement/VisitFollowPlanApproval',
          // },
        ]
      },
      {
        path: 'welderManagement',
        name: '焊工业绩管理',
        authority: "S51F1384",
        routes: [
          {
            path: 'weldPerformance',
            name: '焊工业绩',
            authority: "S51F1385",
            component: './Quality/WelderManagement/WeldPerformance',
          },
          {
            path: 'weldPerformanceReport',
            name: '焊工业绩档案',
            authority: "S51F1385",
            component: './Quality/WelderManagement/WeldPerformanceReport',
          },
          {
            path: 'weldPerformanceApproval',
            name: '焊工业绩审批',
            authority: "S51F1386",
            component: './Quality/WelderManagement/WeldPerformanceApproval',
          },
        ]
      },
      {
        path: 'specialWorkManagement',
        name: '特种设备作业人员资格管理',
        authority: "S51F1387",
        routes: [
          {
            path: 'specialWorkLedger',
            name: '特种设备作业人员台账',
            authority: "S51F1388",
            component: './Quality/SpecialWorkManagement/SpecialWorkLedger',
          },
          {
            path: 'weldPersonLedger',
            name: '焊工人员台账',
            authority: "S51F1388",
            component: './Quality/SpecialWorkManagement/WeldPersonLedger',
          },
          {
            path: 'weldExamSummary',
            name: '焊工考试项目汇总',
            authority: "S51F1389",
            component: './Quality/SpecialWorkManagement/WeldExamSummary',
          },
          {
            path: 'weldQualificationSunmary',
            name: '焊工资格情况统计',
            authority: "S51F1390",
            component: './Quality/SpecialWorkManagement/weldQualificationSunmary',
          },
        ]
      },
      {
        path: 'enginExcelManagement',
        name: '工程创优管理',
        authority: "S51F1391",
        routes: [
          {
            path: 'enginExcelPlan',
            name: '创优情况计划',
            authority: "S51F1392",
            component: './Quality/EnginExcelManagement/EnginExcelPlan',
          },
          {
            path: 'enginExcelPlanApproval',
            name: '创优情况计划审批',
            authority: "S51F1393",
            component: './Quality/EnginExcelManagement/EnginExcelPlanApproval',
          }
        ]
      },
    ]
  },
  {
    path: 'subComp/hr',
    name: '人力资源管理',
    authority: "S51F1300",
    icon: 'icon-renliziyuan2',
    desc: '人员培训、考试...',
    color: 'iconPurple',
    routes: [
      {
        path: '/subComp/hr',
        redirect: '/subComp/hr/training',
      },
      {
        path: 'training',
        authority: "S51F1300",
        name: '培训管理',
        routes: [
          {
            path: '/subComp/hr/training',
            redirect: '/subComp/hr/training/plan',
          },
          {
            path: 'plan',
            authority: "S51F1300",
            name: '分公司培训计划',
            component: './HR/HrTrainingPlan/SubComp',
          },
          {
            path: 'depPlanApproval',
            authority: "S51F1300",
            name: '项目部培训计划审批',
            component: './HR/HrTrainingPlan/SubComp/ApprovalDepList',
          },
          {
            path: 'class',
            authority: "S51F1300",
            name: '培训班管理',
            component: './HR/HrTrainingClass',
          },
          {
            path: 'course',
            authority: "S51F1300",
            name: '课程信息管理',
            component: './HR/HrCourse',
          },
          {
            path: 'courseware',
            authority: "S51F1300",
            name: '课件管理',
            component: './HR/HrCourseware',
          },
          {
            path: 'lecturer',
            authority: "S51F1300",
            name: '讲师管理',
            component: './HR/HrLecturer',
          },
        ]
      },
    ]
  },
]
