// branchComp
export default [
  {
    path: 'branchComp/DataCockpit',
    authority: "B51F1200",
    name: '数据驾驶舱',
    icon: 'icon-shujufenxi',
    component: './DataCockpit',
  },
  {
    path: 'branchComp/contract',
    name: '合同台账表单',
    icon: 'icon-hetong',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    authority: "B51F200",
    routes: [
      {
        path: '/branchComp/contract',
        redirect: '/branchComp/contract/income',
      },
      {
        path: 'income',
        authority: "B51F201",
        name: '收入合同台账',
        component: './Contract/Income',
      },
      {
        path: 'expenditure',
        authority: "B51F202",
        name: '支出合同台账',
        component: './Contract/Expenditure',
      },
      {
        path: 'configPriceLevel',
        authority: "B51F203",
        name: '等级配置',
        component: './Contract/ConfigPriceLevel',
      },
    ]
  },

  {
    path: 'branchComp/EnterpriseRiskManagement',
    authority: "B51F900",
    name: '全面风险管理',
    icon: 'icon-fengxianjianguan',
    desc: '风险事件收集、项目风险...',
    color: 'iconOrange',
    routes: [
      {
        path: '/branchComp/EnterpriseRiskManagement',
        redirect: '/branchComp/EnterpriseRiskManagement/CollectionOfRiskIncidents',
      },
      {
        path: 'CollectionOfRiskIncidents',
        authority: "B51F901",
        name: '风险事件收集',
        component: './EnterpriseRisk/CollectionOfRiskIncidents',
      },
      {
        path: 'ProjectRisk',
        authority: "B51F902",
        name: '项目风险',
        routes: [
          {
            path: 'SharedFile',
            authority: "B51F908",
            name: '共享文件',
            component: './EnterpriseRisk/SharedFile',
          },
          // {
          //   path: 'SharedFileByType',
          //   authority: "B51F908",
          //   name: '公司风险管理文件',
          //   component: './EnterpriseRisk/SharedFileByType',
          // },
          {
            path: 'ProjectRiskAssessment',
            authority: "B51F909",
            name: '项目风险评估结果',
            component: './EnterpriseRisk/ProjectRiskAssessment',
          },
          {
            path: 'ProjectRiskGovernance',
            authority: "B51F902",
            name: '项目风险管控',
            component: './EnterpriseRisk/ProjectRiskGovernance',
          },
        ]
      },
      {
        path: 'AnnualAssessment',
        authority: "B51F903",
        name: '公司年度重大风险评估',
        routes: [
          {
            path: 'AnnualAssessmentOfKeyOrganizationalRisks',
            authority: "B51F904",
            name: '公司年度风险评估调查表',
            component: './EnterpriseRisk/AnnualAssessment',
          },
          {
            path: 'RiskAssessmentRanking',
            authority: "B51F905",
            name: '风险评估排名',
            component: './EnterpriseRisk/RiskAssessmentRanking',
          },
          {
            path: 'AnnualRiskDatabase',
            authority: "B51F906",
            name: '公司年度重大经营风险评估数据库',
            component: './EnterpriseRisk/AnnualRiskDatabase',
          }
        ]
      },
      {
        path: 'RiskCategoryConfig',
        authority: "B51F911",
        name: '风险类别配置',
        component: './EnterpriseRisk/RiskCategoryConfig',
      },
      // {
      //   path: 'TodoGroup',
      //   authority: "B51F911",
      //   name: '用户组',
      //   component: './EnterpriseRisk/TodoGroup',
      // },
    ]
  },

  {
    path: 'branchComp/costControl',
    name: '费控管理',
    authority: "B51F300",
    icon: 'icon-feikong',
    desc: '进度款、工程结算及签证...',
    color: 'iconBlue',
    routes: [
      {
        path: '/branchComp/costControl',
        redirect: '/branchComp/costControl/progress/mainContractProgress',
      },
      {
        path: 'progress',
        authority: "B51F301",
        name: '进度款管理',
        routes: [
          {
            path: 'mainContractProgress',
            authority: "B51F302",
            name: '主合同进度款管理',
            component: './CostControl/Progress/MainContractProgress',
          },
          {
            path: 'subcontractorProgress',
            authority: "B51F303",
            name: '分包合同进度款管理',
            component: './CostControl/Progress/SubcontractorProgress',
          },
        ]
      },
      {
        path: 'settlement',
        authority: "B51F304",
        name: '工程结算管理',
        routes: [
          {
            path: 'mainContractSettlement',
            authority: "B51F305",
            name: '主合同工程结算管理',
            component: './CostControl/Settlement/MainContractSettlement',
          },
          {
            path: 'subcontractorSettlement',
            authority: "B51F306",
            name: '分包合同工程结算管理',
            component: './CostControl/Settlement/SubcontractorSettlement',
          },
        ]
      },
      {
        path: 'visa',
        authority: "B51F307",
        name: '签证管理',
        routes: [
          {
            path: 'mainContractVisa',
            authority: "B51F308",
            name: '主合同签证管理',
            component: './CostControl/Visa/MainContractVisa',
          },
          {
            path: 'subContractVisa',
            authority: "B51F309",
            name: '分包合同签证管理',
            component: './CostControl/Visa/SubContractVisa',
          },
        ]
      },
    ]
  },
  {
    path: 'branchComp/materialsAndserviceProcurement',
    name: '物资及服务采购管理',
    authority: "B51F400",
    icon: 'icon-caigou',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    routes: [
      {
        path: '/branchComp/materialsAndserviceProcurement',
        redirect: '/branchComp/materialsAndserviceProcurement/Procurement/overall',
      },
      {
        path: 'procurement',
        authority: "B51F401",
        name: '总体策略',
        routes: [
          {
            path: 'overall',
            authority: "B51F402",
            name: '总体采购策略',
            component: './Procurement/Overall',
          },
        ],
      },
      // {
      //   name: '基础数据',
      //   authority: 'B51F402',
      //   path: 'base',
      //   routes: [
      //     {
      //       name: '物料分类配置',
      //       authority: 'B51F403',
      //       path: 'ClsConfig',
      //       component: './Procurement/Base/ClsConfig',
      //     },
      //     {
      //       name: '不允许发放物料',
      //       authority: 'B51F404',
      //       path: 'RefuseProdInfo',
      //       component: './Procurement/Base/RefuseProdInfo',
      //     },
      //     {
      //       name: '物料信息',
      //       authority: 'B51F405',
      //       path: 'ProdInfo',
      //       component: './Procurement/Base/ProdInfo',
      //     },
      //     {
      //       name: '物料分类信息',
      //       authority: 'B51F406',
      //       path: 'ClsInfo',
      //       component: './Procurement/Base/ClsInfo',
      //     },
      //     {
      //       name: '物料代用信息',
      //       authority: 'B51F407',
      //       path: 'Substitution',
      //       component: './Procurement/Base/Substitution',
      //     },
      //     {
      //       name: '仓库信息',
      //       authority: 'B51F408',
      //       path: 'warehouseInfo',
      //       component: './Procurement/Base/WarehouseInfo',
      //     },
      //   ],
      // },
      // {
      //   name: '需求计划',
      //   authority: 'B51F409',
      //   path: 'JiaPurchasePlan',
      //   component: './Procurement/JiaPurchasePlan',
      // },
      // {
      //   name: '分割预算',
      //   authority: 'B51F410',
      //   path: 'JiaSplitBudget',
      //   component: './Procurement/JiaSplitBudget',
      // },
      // {
      //   name: '平衡利库',
      //   authority: 'B51F411',
      //   path: 'BalancedLiquidity',
      //   component: './Procurement/BalancedLiquidity',
      // },
      // {
      //   path: 'PlanManagement',
      //   authority: "B51F412",
      //   name: '计划管理',
      //   routes: [
      //     {
      //       path: 'ProcurementPlan',
      //       authority: "B51F413",
      //       name: '采购计划',
      //       component: './Procurement/ProcurementPlan',
      //     },
      //     // {
      //     //   path: 'ProcurementPlanFirst',
      //     //   authority: "B51F414",
      //     //   name: '采购计划一级分配',
      //     //   component: './Procurement/ProcurementPlanFirst',
      //     // },
      //     // {
      //     //   path: 'ProcurementPlanSecond',
      //     //   authority: "B51F415",
      //     //   name: '采购计划二级分配',
      //     //   component: './Procurement/ProcurementPlanSecond',
      //     // },
      //     // {
      //     //   path: 'ProcurementPlanThird',
      //     //   authority: "B51F416",
      //     //   name: '采购计划三级分配',
      //     //   component: './Procurement/ProcurementPlanThird',
      //     // },
      //   ]
      // },
      // {
      //   path: 'PurchaseTask',
      //   authority: "B51F417",
      //   name: '采购任务',
      //   component: './Procurement/PurchaseTask',
      // },
      // {
      //   path: 'SupplierInfo',
      //   authority: "B51F418",
      //   name: '供应商信息',
      //   component: './Procurement/SupplierInfo',
      // },
      // {
      //   path: 'Purchase',
      //   authority: "B51F419",
      //   name: '采购组信息',
      //   component: './Procurement/Purchase',
      // },
      // {
      //   name: '会议管理',
      //   authority: 'B51F420',
      //   path: 'meetingManagement',
      //   routes: [
      //     {
      //       name: '委员会职务档案',
      //       authority: 'B51F421',
      //       path: 'committeePosition',
      //       component: './Procurement/MeetingManagement/CommitteePosition',
      //     },
      //     {
      //       name: '人员档案',
      //       authority: 'B51F422',
      //       path: 'personnelFile',
      //       component: './Procurement/MeetingManagement/PersonnelFile',
      //     },
      //     {
      //       name: '会议上会条件设置',
      //       authority: 'B51F423',
      //       path: 'meetingCondition',
      //       component: './Procurement/MeetingManagement/MeetingCondition',
      //     },
      //     {
      //       name: 'TC会议管理',
      //       authority: 'B51F424',
      //       path: 'tcMeeting',
      //       component: './Procurement/MeetingManagement/TcMeeting',
      //     },
      //   ],
      // },
    ]
  },
  {
    path: 'branchComp/safetyGreen',
    name: '安全管理',
    authority: "B51F700",
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
        authority: "B51F715",
        name: '数据驾驶舱',
        component: './SafetyGreen/DataCockpit',
      },
      {
        path: 'legalRequirements',
        authority: "B51F706",
        name: '法律法规及其他要求',
        routes: [
          {
            path: 'library',
            authority: "B51F707",
            name: 'HSE法律法规库',
            component: './SafetyGreen/LegalRequirements/HSELibrary',
          },
          {
            path: 'libraryConfig',
            authority: "B51F708",
            name: 'HSE法律法规库上传',
            component: './SafetyGreen/LegalRequirements/HSELibraryConfig',
          },
        ]
      },
      {
        path: 'inspect',
        authority: "B51F701",
        name: '监督检查',
        routes: [
          {
            path: 'workpoionts',
            authority: "B51F705",
            name: '记分管理',
            component: './SafetyGreen/Workpoionts',
          },
          {
            path: 'qualitySafetyOversight',
            authority: "B51F702",
            name: '质量安全监督检查问题清单',
            component: './SafetyGreen/Inspect/QualitySafetyOversight',
          },
          {
            path: 'safetyOversight',
            authority: "B51F717",
            name: '安全监督检查问题清单',
            component: './SafetyGreen/Inspect/SafetyOversight',
          },
          {
            path: 'questionClassification',
            authority: "B51F703",
            name: '问题归类配置',
            component: './SafetyGreen/Inspect/QuestionClassification',
          },
          {
            path: 'problemStatistics',
            authority: "B51F702",
            name: '问题统计',
            component: './SafetyGreen/Inspect/ProblemStatistics',
          },
          {
            path: 'ProblemStatisticsSecurity',
            authority: "B51F702",
            name: '安全问题统计',
            component: './SafetyGreen/Inspect/ProblemStatisticsSecurity',
          },
          {
            path: 'unitRanking',
            authority: "B51F704",
            name: '单位排名',
            component: './SafetyGreen/Inspect/UnitRanking',
          },
        ]
      },
      // {
      //   path: 'securityCheck',
      //   authority: "B51F307",
      //   name: '安全检查',
      //   routes: [
      //     {
      //       path: 'dailyOnSiteHSEInspection',
      //       authority: "B51F308",
      //       name: '现场日常HSE检查',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      // {
      //   path: 'performanceAppraisal',
      //   authority: "B51F307",
      //   name: '绩效考核',
      //   routes: [
      //     {
      //       path: 'corporateHSEPerformanceAppraisal',
      //       authority: "B51F308",
      //       name: '单位HSE绩效考核',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      {
        path: 'emergencyManagement',
        authority: "B51F712",
        name: '应急管理',
        routes: [
          {
            path: 'emergencyResponsibility',
            authority: "B51F713",
            name: '应急预案',
            component: './SafetyGreen/EmergencyResponsibility',
          },
          {
            path: 'legislation',
            authority: "B51F718",
            name: '处置规程',
            component: './SafetyGreen/Legislation',
          },
          {
            path: 'emergencyPlan',
            authority: "B51F714",
            name: '应急预案模板',
            component: './SafetyGreen/EmergencyPlan',
          },
        ]
      },
      {
        path: 'lessonsLearned',
        authority: "B51F709",
        name: '经验分享',
        routes: [
          {
            path: 'lessonsLearned',
            authority: "B51F710",
            name: '经验分享',
            component: './SafetyGreen/LessonsLearned',
          },
          {
            path: 'lessonsLearnedConfig',
            authority: "B51F711",
            name: '经验分享上传',
            component: './SafetyGreen/LessonsConfig',
          },
        ]
      },
      {
        path: 'DataDashboardConfig',
        authority: "B51F716",
        name: '数据驾驶舱配置',
        component: './SafetyGreen/DataCockpitConfig',
      },
    ]
  },
  {
    path: 'branchComp/engineering',
    name: '工程管理',
    authority: "B51F500",
    icon: 'icon-gongchengshi',
    desc: '周报、月报及作业许可...',
    color: 'iconCyan',
    routes: [
      {
        path: '/branchComp/engineering',
        redirect: '/branchComp/engineering/contractor/contractorPersonnel',
      },
      {
        path: 'scheduleManagement',
        name: '进度管理',
        authority: "B51F510",
        routes: [
          {
            path: 'BasicInfoManage',
            authority: "B51F531",
            name: '基本信息管理',
            routes: [
              {
                path: 'projectBasicInfo',
                authority: "B51F532",
                name: '项目基本信息',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfo',
              },
              {
                path: 'projectBasicInfoApproval',
                authority: "B51F533",
                name: '项目基本信息审批',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfoApproval',
              },
              {
                path: 'week',
                authority: "B51F515",
                name: '重点项目进度周报',
                routes: [
                  {
                    path: 'weeklyReportConfirm',
                    authority: "B51F516",
                    name: '周报确认',
                    component: './Engineering/Week/WeeklyConfirm',
                  },
                ]
              },
              {
                path: 'monthly',
                authority: "B51F517",
                name: '项目月报',
                routes: [
                  {
                    path: 'monthlyConfirm',
                    authority: "B51F518",
                    name: '公司月报确认',
                    component: './Engineering/Month/MonthlyConfirm',
                  },
                ]
              },

            ]
          },
          {
            path: 'engineerProjectLedger',
            name: '工程项目台账',
            authority: "B51F534",
            component: './Engineering/EngineerProjectLedger',
          },
          {
            path: 'monthlyConstructPlan',
            name: '月度施工计划',
            authority: "B51F535",
            component: './Engineering/MonthlyConstructPlan',
          },
          {
            path: 'yearProductPlan',
            name: '年度生产计划',
            authority: "B51F536",
            component: './Engineering/YearProductPlan',
          },
        ]
      },
      {
        path: 'contractor',
        authority: "B51F527",
        name: '承包商管理',
        routes: [
          {
            path: 'contractorPersonnel',
            authority: "B51F528",
            name: '承包商人员审批信息',
            component: './Engineering/Contractor/ContractorPersonnelApproval',
          },
          {
            path: 'contractorAnnualEval',
            authority: "B51F529",
            name: '承包商年度评价基本信息',
            component: './Engineering/Contractor/ContractorAnnualEval',
          },
          {
            path: 'contractorInspection',
            authority: "B51F530",
            name: '承包商施工作业过程中监督检查表',
            component: './Engineering/Contractor/ContractorInspection',
          },
        ]
      },
      {
        path: 'supplier',
        authority: "B51F524",
        name: '供应商管理',
        routes: [
          {
            path: 'supplierDateConfig',
            authority: "B51F525",
            name: '公司评分发起',
            component: './Engineering/Supplier/SupplierDateConfig',
          },
          {
            path: 'supplierScore',
            authority: "B51F526",
            name: '公司级查看供应商得分',
            component: './Engineering/Supplier/SupplierScore',
          },
        ]
      },
      {
        path: 'workLicenseRegister',
        name: '作业许可证登记表',
        authority: "B51F537",
        component: './Engineering/WorkLicenseRegister',
      },
      {
        path: 'WorkPermitStatistics',
        name: '作业许可证管理统计',
        authority: "B51F538",
        component: './Engineering/WorkPermitStatistics',
      },
      {
        path: 'levelConstructor',
        name: '一级建造师',
        authority: "B51F539",
        component: './Engineering/LevelConstructor',
      },
    ]
  },

  {
    path: 'branchComp/technology',
    name: '技术管理',
    authority: "B51F800",
    icon: 'icon-jishu-line',
    desc: '技术文件及质量、HSE...',
    color: 'iconOrange',
    routes: [
      {
        path: '/branchComp/technology',
        redirect: '/branchComp/technology/technicalDocument/technologyAuditOrganization/technologyAuditOrganizationStats',
      },
      {
        path: 'technicalDocument',
        name: '技术文件管理',
        authority: "B51F801",
        routes: [
          {
            path: 'technologyAuditOrganization',
            name: '施工组织设计',
            authority: "B51F802",
            routes: [
              {
                path: 'technologyAuditOrganizationStats',
                authority: "B51F802",
                name: '施工组织设计统计',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganizationStats',
              },
              {
                path: 'TechnologyAuditOrganization',
                authority: "B51F802",
                name: '施工组织设计审批',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganization',
              },
            ]
          },
          {
            path: 'technologyAuditQuality',
            name: '质量计划',
            authority: "B51F803",
            routes: [
              {
                path: 'technologyAuditQualityStats',
                authority: "B51F803",
                name: '质量计划统计',
                component: './Technology/TechnicalDocument/TechnologyAuditQualityStats',
              },
              {
                path: 'TechnologyAuditQuality',
                authority: "B51F803",
                name: '质量计划审批',
                component: './Technology/TechnicalDocument/TechnologyAuditQuality',
              },
            ]
          },
          {
            path: 'hseRiskManagement ',
            authority: "B51F804",
            name: 'HSE风险管理',
            routes: [
              {
                path: 'technologyAuditHse',
                name: 'HSE危害因素辨识与风险评价报告',
                authority: "B51F804",
                routes: [
                  {
                    path: 'technologyAuditHseStats',
                    authority: "B51F804",
                    name: 'HSE危害因素辨识与风险评价报告统计',
                    component: './Technology/TechnicalDocument/TechnologyAuditHseStats',
                  },
                  {
                    path: 'TechnologyAuditHse',
                    authority: "B51F804",
                    name: 'HSE危害因素辨识与风险评价报告',
                    component: './Technology/TechnicalDocument/TechnologyAuditHse',
                  },
                ]
              },
              {
                path: 'technologyHseRiskControlList',
                authority: "B51F805",
                name: 'HSE重大风险清单',
                component: './Technology/TechnicalDocument/TechnologyHseRiskControlList',
              },
              {
                path: 'hseRiskManagementYear',
                authority: "B51F806",
                name: '年度HSE风险管理',
                routes: [
                  {
                    path: 'technologyHseRiskControlListYear',
                    authority: "B51F806",
                    name: 'HSE重大风险及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyHseRiskControlListYear',
                  },
                  {
                    path: 'technologyEnvironmentalControlListYear',
                    authority: "B51F807",
                    name: ' 重要环境因素及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyEnvironmentalControlListYear',
                  },
                ]
              },
            ]
          },

          {
            path: 'technologyAuditConstruction',
            authority: "B51F808",
            name: '施工技术方案',
            routes: [
              {
                path: 'technologyAuditConstructionStats',
                authority: "B51F808",
                name: '施工技术方案统计',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionStats',
              },
              {
                path: 'technologyAuditConstructionApproval',
                authority: "B51F808",
                name: '施工技术方案审批',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionApproval',
              },
            ]
          },
          {
            path: 'technologyAuditSummary',
            name: '项目总结审批',
            authority: "B51F809",
            routes: [
              {
                path: 'technologyAuditSummaryStats',
                authority: "B51F809",
                name: '项目总结统计',
                component: './Technology/TechnicalDocument/TechnologyAuditSummaryStats',
              },
              {
                path: 'TechnologyAuditSummary',
                authority: "B51F809",
                name: '项目总结审批',
                component: './Technology/TechnicalDocument/TechnologyAuditSummary',
              },
            ]
          },
          {
            path: 'handoverDocuments',
            authority: "B51F810",
            name: '交工资料归档',
            routes: [
              {
                path: 'technologyArchiveList',
                authority: "B51F810",
                name: '归档清单',
                component: './Technology/TechnicalDocument/TechnologyArchiveList',
              },
              {
                path: 'technologyArchiveListStatistics',
                authority: "B51F812",
                name: '交工资料归档统计',
                component: './Technology/TechnicalDocument/TechnologyArchiveListStatistics',
              },
            ]
          },
        ]
      },
      {
        path: 'nonconformitySummary',
        authority: "B51F811",
        name: '不合格品汇总',
        component: './Technology/NonconformitySummary',
      },


    ]
  },
  {
    path: 'branchComp/MarketDevelopmentCente',
    authority: "B51F1100",
    name: '市场开发中心',
    icon: 'icon-shichangkaifa',
    desc: '业绩台账及投标报价...',
    color: 'iconBlue',
    routes: [
      {
        path: '/branchComp/MarketDevelopmentCente',
        redirect: '/branchComp/MarketDevelopmentCente/Dashboard',
      },
      {
        path: 'Dashboard',
        authority: "B51F1101",
        name: '数据驾驶舱',
        component: './MarketDevelopmentCente/Dashboard',
      },
      {
        path: 'KnowledgeBase',
        authority: "B51F1102",
        name: '知识库文件管理',
        component: './MarketDevelopmentCente/KnowledgeBase',
      },
      {
        path: 'PerformanceLedger',
        authority: "B51F1103",
        name: '公司业绩台账',
        component: './MarketDevelopmentCente/PerformanceLedger',
      },
      {
        path: 'BidQuotation',
        authority: "B51F1104",
        name: '投标报价管理',
        component: './MarketDevelopmentCente/BidQuotation',
      },
      // {
      //   path: 'CertificationTracking',
      //   authority: "B51F1105",
      //   name: '人员证件管理',
      //   component: './MarketDevelopmentCente/CertificationTracking',
      // },
      {
        path: 'DashboardConfig',
        authority: "B51F1106",
        name: '系统配置',
        component: './MarketDevelopmentCente/DashboardConfig',
      },
    ]
  },
  {
    path: 'branchComp/finance',
    name: '财务管理',
    authority: "B51F1400",
    icon: 'icon-caiwuguanli',
    desc: '税务、债权债务及损益...',
    color: 'iconOrange',
    routes: [
      {
        path: '/branchComp/finance',
        redirect: '/branchComp/finance/profit',
      },
      {
        path: 'profit',
        authority: "B51F1401",
        name: '利润中心',
        component: './Finance/ProfitCenter',
      },
      {
        path: 'tax',
        name: '税务',
        authority: "B51F1402",
        routes: [
          {
            path: 'accounting',
            authority: "B51F1403",
            name: '会计科目',
            component: './Finance/Tax/TaxAccounting',
          },
          {
            path: 'config',
            authority: "B51F1404",
            name: '报表配置',
            component: './Finance/Tax/TaxAccountingValueAddeddConfig',
          },
          {
            path: 'book',
            authority: "B51F1405",
            name: '税金台账',
            component: './Finance/Tax/TaxBook',
          },
          {
            path: 'statistics',
            authority: "B51F1406",
            name: '进销平衡台账（一般）',
            component: './Finance/Tax/TaxStatistics',
          },
          {
            path: 'statisticsjianyi',
            authority: "B51F1407",
            name: '进销平衡台账（简易）',
            component: './Finance/Tax/TaxStatistics/indexJianYi',
          },
        ]
      },
      {
        path: 'debt',
        name: '债权债务',
        authority: "B51F1408",
        routes: [
          {
            path: 'debtStatisticsComp',
            authority: "B51F1417",
            name: '债权统计',
            component: './Finance/DebtStatisticsComp',
          },
          {
            path: 'debtPaymentStatisticsComp',
            authority: "B51F1418",
            name: '债务统计',
            component: './Finance/DebtPaymentStatisticsComp',
          },
          {
            path: 'fundForecast',
            authority: "B51F1409",
            name: '净债权资金预测',
            component: './Finance/FundForecast',
          },

        ]
      },
      {
        path: 'profitAndLoss',
        name: '损益',
        authority: "B51F1410",
        routes: [
          {
            path: 'moduleConfig',
            authority: "B51F1411",
            name: '基础配置',
            component: './Finance/ProfitAndLoss/ModuleConfig',
          },
          {
            path: 'wbscompare',
            authority: "B51F1412",
            name: 'WBS对照表',
            component: './Finance/ProfitAndLoss/WbsDefineCompare',
          },
          {
            path: 'businessPartner',
            authority: "B51F1413",
            name: '往来单位',
            component: './Finance/ProfitAndLoss/BusinessPartner',
          },
          {
            path: 'projectInformationStatistic',
            authority: "B51F1414",
            name: '项目信息表',
            component: './Finance/ProfitAndLoss/ProjectInformation/indexStatistic',
          },
          {
            path: 'predictComp',
            authority: "B51F1415",
            name: '损益预测表',
            component: './Finance/ProfitAndLoss/Predict/indexComp',
          },
          {
            path: 'resourceOngoingProjectCompany',
            authority: "B51F1416",
            name: '在建项目资源结转表',
            component: './Finance/ProfitAndLoss/ResourceOngoingProject/indexStatistics',
          },
        ]
      },
    ]
  },
  {
    path: 'branchComp/quality',
    name: '质量管理',
    authority: "B51F1300",
    icon: 'icon-zhiliang',
    desc: '质量月报、特殊设备及监督检查...',
    color: 'iconOrange',
    routes: [
      {
        path: '/branchComp/quality',
        redirect: '/branchComp/quality/qualityReport/overallQualityProducts/overallQualityProductsView',
      },
      {
        path: 'qualityReport',
        name: '质量月报',
        authority: "B51F1325",
        routes: [
          {
            path: 'qualityMonthlyReport',
            name: '质量月报汇总表',
            authority: "B51F1394",
            component: './Quality/QualityReport/QualityMonthlyReport',
          },
          {
            path: 'qualityProjectDataExist',
            name: '质量月报填报情况',
            authority: "B51F1326",
            component: './Quality/QualityReport/QualityProjectDataExist',
          },
          {
            path: 'overallQualityProducts',
            name: '工程产品总体质量情况',
            authority: "B51F1327",
            routes: [
              {
                path: 'overallQualityProductsView',
                name: '工程产品总体质量情况概述',
                authority: "B51F1328",
                component: './Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView',
              },
              {
                path: 'qualityProducedProducts',
                name: '自产产品制造质量情况',
                authority: "B51F1330",
                component: './Quality/QualityReport/OverallQualityProducts/QualityProducedProducts',
              },
              {
                path: 'qualityTechServiceQuality',
                name: '技术服务质量情况',
                authority: "B51F1329",
                component: './Quality/QualityReport/OverallQualityProducts/QualityTechServiceQuality',
              },
            ]
          },
          {
            path: 'qualitySystemOperation',
            name: '质量体系运行情况',
            authority: "B51F1331",
            component: './Quality/QualityReport/QualitySystemOperation',
          },
          {
            path: 'qualityActivities',
            name: '开展主要质量活动',
            authority: "B51F1332",
            routes: [
              {
                path: 'qualityInspection',
                name: '质量大检查及专项检查情况',
                authority: "B51F1333",
                component: './Quality/QualityReport/QualityActivities/QualityInspection',
              },
              {
                path: 'qualityExcellenceActivity',
                name: '创优活动开展情况',
                authority: "B51F1334",
                component: './Quality/QualityReport/QualityActivities/QualityExcellenceActivity',
              },
              {
                path: 'qualityQcActivity',
                name: 'QC小组活动开展情况',
                authority: "B51F1335",
                component: './Quality/QualityReport/QualityActivities/QualityQcActivity',
              },
            ]
          },
          {
            path: 'qualityDataAnalysis',
            name: '质量数据统计分析及采取措施',
            authority: "B51F1336",
            routes: [
              {
                path: 'qualityDataStatistics',
                name: '质量数据统计',
                authority: "B51F1337",
                routes: [
                  {
                    path: 'qualityNcCorrectiveAction',
                    name: '不合格项纠正措施记录',
                    authority: "B51F1338",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityNcCorrectiveAction',
                  },
                  {
                    path: 'qualityInspectionSummary',
                    name: '质量大(专项)检查主要不合格项汇总情况分布',
                    authority: "B51F1339",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityInspectionSummary',
                  },
                  {
                    path: 'qualityMonthlyWeldingPassRate',
                    name: '月度焊接一次合格率统计表',
                    authority: "B51F1340",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyWeldingPassRate',
                  },
                  {
                    path: 'qualityAccidentSummary',
                    name: '质量事故汇总表',
                    authority: "B51F1341",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
                  },
                  {
                    path: 'qualityMonthlyQualityStatistics',
                    name: '质量数据统计表',
                    authority: "B51F1342",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyQualityStatistics',
                  },
                ]
              },
              {
                path: 'qualityOtherQualityStatistics',
                name: '其它质量数据统计情况',
                authority: "B51F1343",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityOtherQualityStatistics',
              },
              {
                path: 'qualityStatisticsAnalysis',
                name: '质量统计数据分析情况',
                authority: "B51F1344",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityStatisticsAnalysis',
              },
            ],
          },
          {
            path: 'criticalNonconformities',
            name: '严重不合格品及质量事故情况',
            authority: "B51F1345",
            routes: [
              {
                path: 'qualitySeriousNonconformities',
                name: '本月严重不合格品情况',
                authority: "B51F1346",
                component: './Quality/QualityReport/CriticalNonconformities/QualitySeriousNonconformities',
              },
              {
                path: 'qualityIncidentDetails',
                name: '质量事故情况',
                authority: "B51F1347",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
              },
            ]
          },
          {
            path: 'qualityWorkArrangement',
            name: '工作安排及建议',
            authority: "B51F1348",
            component: './Quality/QualityReport/QualityWorkArrangement',
          },
          {
            path: 'qualityExperience',
            name: '质量经验分享',
            authority: "B51F1349",
            component: './Quality/QualityReport/QualityExperience',
          },
        ]
      },
      {
        path: 'SpecialEquipment',
        name: '特种设备管理',
        authority: "B51F1301",
        routes: [
          {
            path: 'SEOnlineNotification',
            name: '特种设备网上告知相关信息统计表',
            authority: "B51F1302",
            component: './Quality/SpecialEquipment/SEOnlineNotification',
          },
          {
            path: 'PressureVessel',
            name: '压力容器制造(组焊、安装改造修理)管理',
            authority: "B51F1310",
            routes: [
              {
                path: 'PressureVesselPreformance',
                name: '施工业绩',
                authority: "B51F1311",
                component: './Quality/SpecialEquipment/PressureVessel/PressureVesselPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "B51F1312",
                component: './Quality/SpecialEquipment/PressureVessel/PVQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "B51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "1"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "B51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "B51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "B51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "1"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "B51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "1"
              },
            ]
          },
          {
            path: 'PressurePiping',
            name: '压力管道管理',
            authority: "B51F1313",
            routes: [
              {
                path: 'PressurePipingPreformance',
                name: '施工业绩',
                authority: "B51F1314",
                component: './Quality/SpecialEquipment/PressurePiping/PressurePipingPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "B51F1315",
                component: './Quality/SpecialEquipment/PressurePiping/PPQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "B51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "2"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "B51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "B51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "B51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "2"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "B51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "2"
              },
            ]
          },
          {
            path: 'Boiler',
            name: '锅炉管理',
            authority: "B51F1316",
            routes: [
              {
                path: 'BoilerPreformance',
                name: '施工业绩',
                authority: "B51F1317",
                component: './Quality/SpecialEquipment/Boiler/BoilerPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "B51F1318",
                component: './Quality/SpecialEquipment/Boiler/BoilerQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "B51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "3"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "B51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "B51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "B51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "3"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "B51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "3"
              },
            ]
          },
          {
            path: 'HoistingMachinery',
            name: '起重机械管理',
            authority: "B51F1319",
            routes: [
              {
                path: 'HoistingMachineryPreformance',
                name: '施工业绩',
                authority: "B51F1320",
                component: './Quality/SpecialEquipment/HoistingMachinery/HoistingMachineryPreformance',
                marking: "4"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "B51F1321",
                component: './Quality/SpecialEquipment/HoistingMachinery/HMQAStaffNomination',
                marking: "4"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "B51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "4"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "B51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "B51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "B51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "4"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "B51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "4"
              },
            ]
          },
          {
            path: 'PipingComponents',
            name: '压力管道元件管理',
            authority: "B51F1322",
            routes: [
              {
                path: 'PipingComponentsPreformance',
                name: '施工业绩',
                authority: "B51F1323",
                component: './Quality/SpecialEquipment/PipingComponents/PipingComponentsPreformance',
                marking: "5"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "B51F1324",
                component: './Quality/SpecialEquipment/PipingComponents/PCQAStaffNomination',
                marking: "5"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "B51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "5"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "B51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "B51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "B51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "5"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "B51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "5"
              },
            ]
          },
          {
            path: 'SEPostConfig',
            name: '特种设备职务配置表信息',
            authority: "B51F1308",
            component: './Quality/SpecialEquipment/SEPostConfig',
          },
          {
            path: 'RskControlConfig',
            name: '特种设备质量安全风险管控清单配置表',
            authority: "B51F1309",
            component: './Quality/SpecialEquipment/RskControlConfig',
          },
        ]
      },

      {
        path: 'QualitySupervision',
        name: '质量监督管理',
        authority: "B51F1350",
        routes: [
          {
            path: 'QualityIssue',
            name: '质量监督检查问题清单',
            authority: "B51F1351",
            component: './Quality/QualitySupervision/QualityIssue',
          },
          {
            path: 'ProblemStatistics',
            name: '质量问题统计',
            authority: "B51F1352",
            component: './Quality/QualitySupervision/ProblemStatistics',
          },
          {
            path: 'ScoringPersonnel',
            name: '质量记分人员信息',
            authority: "B51F1353",
            component: './Quality/QualitySupervision/ScoringPersonnel',
          },
          {
            path: 'Contractor',
            name: '质量监督审核问题清单',
            authority: "B51F1354",
            component: './Quality/QualitySupervision/Contractor',
          },
          {
            path: 'QualityScore',
            name: '质量记分问题统计',
            authority: "B51F1355",
            component: './Quality/QualitySupervision/QualityScore',
          },
          {
            path: 'RewardPunishment',
            name: '质量奖惩情况统计表',
            authority: "B51F1356",
            component: './Quality/QualitySupervision/RewardPunishment',
          },
        ]
      },
      {
        path: 'inspectorManagement',
        name: '质量检查员管理',
        authority: "B51F1357",
        routes: [
          {
            path: 'inspectorSeniorityApply',
            name: '质量检查员资格证申请',
            authority: "B51F1358",
            component: './Quality/InspectorManagement/InspectorSeniorityApply',
          },
          {
            path: 'inspectorCerateLedger',
            name: '质量检查员办证台账',
            authority: "B51F1359",
            component: './Quality/InspectorManagement/InspectorCerateLedger',
          },
          {
            path: 'inspectorAnnualAudit',
            name: '质量检查员资格证年审',
            authority: "B51F1360",
            component: './Quality/InspectorManagement/InspectorAnnualAudit',
          },
        ]
      },
      {
        path: 'measuringManagement',
        name: '计量器具管理',
        authority: "B51F1361",
        routes: [
          {
            path: 'monitoringMeasuring',
            name: '监视和测量设备登记表',
            authority: "B51F1362",
            component: './Quality/MeasuringManagement/MonitoringMeasuring',
          },
          {
            path: 'monitoringMeasuringApproval',
            name: '监视和测量设备审批记录',
            authority: "B51F1363",
            component: './Quality/MeasuringManagement/MonitoringMeasuringApproval',
          },
          {
            path: 'monitoringMeasuringStatistical',
            name: '监视和测量设备信息统计表',
            authority: "B51F1364",
            component: './Quality/MeasuringManagement/MonitoringMeasuringStatistical',
          },
        ]
      },
      {
        path: 'personnelMeasurement',
        name: '计量人员管理',
        authority: "B51F1365",
        routes: [
          {
            path: 'personnelApplyForm',
            name: '计量人员资格申请表',
            authority: "B51F1366",
            component: './Quality/PersonnelMeasurement/PersonnelApplyForm',
          },
          {
            path: 'personnelLedger',
            name: '计量管理人员台账',
            authority: "B51F1367",
            component: './Quality/PersonnelMeasurement/PersonnelLedger',
          },
          {
            path: 'personnelLedgerAudit',
            name: '计量管理人员复审',
            authority: "B51F1368",
            component: './Quality/PersonnelMeasurement/PersonnelLedgerAudit',
          },
        ]
      },
      {
        path: 'outsourcedManagement',
        name: '外委实验室管理',
        authority: "B51F1369",
        routes: [
          {
            path: 'outsourcedSurveyAssess',
            name: '外委实验室调查评价表',
            authority: "B51F1370",
            component: './Quality/OutsourcedManagement/OutsourcedSurveyAssess',
          },
          {
            path: 'outsourcedLedger',
            name: '外委实验室资质台账',
            authority: "B51F1371",
            component: './Quality/OutsourcedManagement/OutsourcedLedger',
          },
          // {
          //   path: 'outsourcedLedgerAudit',
          //   name: '外委实验室年度审查表',
          //   authority: "B51F800",
          //   component: './Quality/OutsourcedManagement/OutsourcedLedgerAudit',
          // },
        ]
      },
      {
        path: 'RiskMonthlyManagement',
        name: '月度质量重大风险管理',
        authority: "B51F1373",
        routes: [
          {
            path: 'monthMajorQualityRisks',
            name: '月度重大质量风险',
            authority: "B51F1374",
            component: './Quality/MonthlyQualityRisk/MonthMajorQualityRisks',
          },
        ]
      },
      {
        path: 'RiskYearQualityManagement',
        name: '年度质量重大风险管理',
        authority: "B51F1377",
        routes: [
          {
            path: 'riskYearQualityPage',
            name: '年度质量风险评估',
            authority: "B51F1378",
            component: './Quality/YearQualityRisk/RiskYearQualityPage',
          },
          {
            path: 'YearMajorQualityRisks',
            name: '年度重大质量风险',
            authority: "B51F1379",
            component: './Quality/YearQualityRisk/YearMajorQualityRisks',
          },
        ]
      },
      {
        path: 'followManagement',
        name: '质量回访管理',
        authority: "B51F1381",
        routes: [
          {
            path: 'VisitFollowPlan',
            name: '质量回访计划',
            authority: "B51F1382",
            component: './Quality/FollowManagement/VisitFollowPlan',
          },
          // {
          //   path: 'VisitFollowPlanApproval',
          //   name: '质量回访计划审批',
          //   authority: "B51F800",
          //   component: './Quality/FollowManagement/VisitFollowPlanApproval',
          // },
        ]
      },
      {
        path: 'welderManagement',
        name: '焊工业绩管理',
        authority: "B51F1384",
        routes: [
          {
            path: 'weldPerformance',
            name: '焊工业绩',
            authority: "B51F1385",
            component: './Quality/WelderManagement/WeldPerformance',
          },
          {
            path: 'weldPerformanceReport',
            name: '焊工业绩档案',
            authority: "B51F1385",
            component: './Quality/WelderManagement/WeldPerformanceReport',
          },
          {
            path: 'weldPerformanceApproval',
            name: '焊工业绩审批',
            authority: "B51F1386",
            component: './Quality/WelderManagement/WeldPerformanceApproval',
          },
        ]
      },
      {
        path: 'specialWorkManagement',
        name: '特种设备作业人员资格管理',
        authority: "B51F1387",
        routes: [
          {
            path: 'specialWorkLedger',
            name: '特种设备作业人员台账',
            authority: "B51F1388",
            component: './Quality/SpecialWorkManagement/SpecialWorkLedger',
          },
          {
            path: 'weldPersonLedger',
            name: '焊工人员台账',
            authority: "B51F1389",
            component: './Quality/SpecialWorkManagement/WeldPersonLedger',
          },
          {
            path: 'weldExamSummary',
            name: '焊工考试项目汇总',
            authority: "B51F1389",
            component: './Quality/SpecialWorkManagement/WeldExamSummary',
          },
          {
            path: 'weldQualificationSunmary',
            name: '焊工资格情况统计',
            authority: "B51F1390",
            component: './Quality/SpecialWorkManagement/weldQualificationSunmary',
          },
        ]
      },
      {
        path: 'enginExcelManagement',
        name: '工程创优管理',
        authority: "B51F1391",
        routes: [
          {
            path: 'enginExcelPlan',
            name: '创优情况计划',
            authority: "B51F1392",
            component: './Quality/EnginExcelManagement/EnginExcelPlan',
          },
          {
            path: 'enginExcelPlanApproval',
            name: '创优情况计划审批',
            authority: "B51F1393",
            component: './Quality/EnginExcelManagement/EnginExcelPlanApproval',
          }
        ]
      },
    ]
  },
  {
    path: 'branchComp/hr',
    name: '人力资源管理',
    authority: "B51F1300",
    icon: 'icon-renliziyuan2',
    desc: '人员培训、考试...',
    color: 'iconPurple',
    routes: [
      {
        path: '/branchComp/hr',
        redirect: '/branchComp/hr/hrWorkBench',
      },
      {
        path: 'hrWorkBench',
        authority: "B51F1300",
        name: 'HR工作台',
        component: './HR/HrWorkBench',
      },
      {
        path: 'training',
        authority: "B51F1300",
        name: '培训管理',
        routes: [
          {
            path: '/branchComp/hr/training',
            redirect: '/branchComp/hr/training/plan',
          },
          {
            path: 'plan',
            authority: "B51F1300",
            name: '公司培训计划',
            component: './HR/HrTrainingPlan/BranchComp',
          },
          {
            path: 'subCompPlanApproval',
            authority: "B51F1300",
            name: '分公司培训计划审批',
            component: './HR/HrTrainingPlan/BranchComp/ApprovalSubCompList',
          },
          {
            path: 'class',
            authority: "B51F1300",
            name: '培训班管理',
            component: './HR/HrTrainingClass',
          },
          {
            path: 'course',
            authority: "B51F1300",
            name: '课程信息管理',
            component: './HR/HrCourse',
          },
          {
            path: 'courseware',
            authority: "B51F1300",
            name: '课件管理',
            component: './HR/HrCourseware',
          },
          {
            path: 'lecturer',
            authority: "B51F1300",
            name: '讲师管理',
            component: './HR/HrLecturer',
          },
        ]
      },
      {
        path: 'exam',
        authority: "B51F1300",
        name: '考试管理',
        routes: [
          {
            path: '/branchComp/exam',
            redirect: '/branchComp/exam/examConfig',
          },
          // {
          //   path: 'examConfig',
          //   authority: "B51F1300",
          //   name: '考试中心',
          //   component: './HR/ExamConfig',
          // },
          {
            path: 'paper',
            authority: "B51F1300",
            name: '考卷管理',
            component: './HR/ExamPaper',
          },
          {
            path: 'question',
            authority: "B51F1300",
            name: '题库管理',
            component: './HR/ExamQuestion',
          },
        ]
      },
      {
        path: 'pushCourse',
        authority: "B51F1300",
        name: '推送课程配置',
        component: './HR/PushCourse',
      },
    ]
  },
  {
    path: 'branchComp/backConfig',
    name: '系统配置',
    authority: "B51F100",
    icon: 'icon-xitongpeizhi',
    routes: [
      {
        path: '/branchComp/backConfig',
        redirect: '/branchComp/backConfig/approve',
      },
      {
        path: 'approve',
        authority: "B51F101",
        name: '审批模板配置',
        component: './BackConfig/Approve',
      },
      {
        path: 'businessApprove',
        authority: "B51F102",
        name: '业务审批配置',
        component: './BackConfig/BusinessApprove',
      },
      {
        path: 'serialNumberConfig',
        authority: "B51F104",
        name: '单据编号配置',
        component: './BackConfig/SerialNumberConfig',
      },
      {
        path: 'message',
        authority: "B51F104",
        name: '系统公告',
        component: './BackConfig/Message',
      },
    ]
  }
]
