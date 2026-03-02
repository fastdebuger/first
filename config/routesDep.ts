
export default [
  {
    path: 'dep/contract',
    name: '合同台账表单',
    authority: "D51F200",
    icon: 'icon-hetong',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    routes: [
      {
        path: '/dep/contract',
        redirect: '/dep/contract/income',
      },
      {
        path: 'income',
        authority: "D51F201",
        name: '收入合同台账',
        component: './Contract/Income',
      },
      {
        path: 'expenditure',
        authority: "D51F202",
        name: '支出合同台账',
        component: './Contract/Expenditure',
      },
    ]
  },
  {
    path: 'dep/EnterpriseRiskManagement',
    authority: "D51F900",
    name: '全面风险管理',
    icon: 'icon-fengxianjianguan',
    desc: '风险事件收集、项目风险...',
    color: 'iconOrange',
    routes: [
      {
        path: '/dep/EnterpriseRiskManagement',
        redirect: '/dep/EnterpriseRiskManagement/CollectionOfRiskIncidents',
      },
      {
        path: 'CollectionOfRiskIncidents',
        authority: "D51F901",
        name: '风险事件收集',
        component: './EnterpriseRisk/CollectionOfRiskIncidents',
      },
      {
        path: 'ProjectRisk',
        authority: "D51F902",
        name: '项目风险',
        routes: [
          {
            path: 'SharedFile',
            authority: "D51F908",
            name: '共享文件',
            component: './EnterpriseRisk/SharedFile',
          },
          // {
          //   path: 'SharedFileByType',
          //   authority: "D51F908",
          //   name: '公司风险管理文件',
          //   component: './EnterpriseRisk/SharedFileByType',
          // },
          {
            path: 'ProjectRiskAssessment',
            authority: "D51F909",
            name: '项目风险评估结果',
            component: './EnterpriseRisk/ProjectRiskAssessment',
          },
          {
            path: 'ProjectRiskGovernance',
            authority: "D51F902",
            name: '项目风险管控',
            component: './EnterpriseRisk/ProjectRiskGovernance',
          },
        ]
      },

      {
        path: 'AnnualAssessment',
        authority: "D51F903",
        name: '公司年度重大风险评估',
        routes: [
          {
            path: 'AnnualAssessmentOfKeyOrganizationalRisks',
            authority: "D51F904",
            name: '公司年度重大经营风险评估打分表',
            component: './EnterpriseRisk/AnnualAssessment',
          },
          {
            path: 'RiskAssessmentRanking',
            authority: "D51F905",
            name: '风险评估排名',
            component: './EnterpriseRisk/RiskAssessmentRanking',
          },
          {
            path: 'AnnualRiskDatabase',
            authority: "D51F906",
            name: '公司年度重大经营风险评估数据库',
            component: './EnterpriseRisk/AnnualRiskDatabase',
          },
          // {
          //   path: 'predict',
          //   authority: "D51F500",
          //   name: '损益预测表',
          //   component: './Finance/ProfitAndLoss/Predict',
          // },
        ]
      },
    ]
  },
  {
    path: 'dep/costControl',
    name: '费控管理',
    authority: "D51F300",
    icon: 'icon-feikong',
    desc: '进度款、工程结算及签证...',
    color: 'iconBlue',
    routes: [
      {
        path: '/dep/costControl',
        redirect: '/dep/costControl/progress/mainContractProgress',
      },
      {
        path: 'progress',
        authority: "D51F301",
        name: '进度款管理',
        routes: [
          {
            path: 'mainContractProgress',
            authority: "D51F302",
            name: '主合同进度款管理',
            component: './CostControl/Progress/MainContractProgress',
          },
          {
            path: 'subcontractorProgress',
            authority: "D51F303",
            name: '分包合同进度款管理',
            component: './CostControl/Progress/SubcontractorProgress',
          },
        ]
      },
      {
        path: 'settlement',
        authority: "D51F304",
        name: '工程结算管理',
        routes: [
          {
            path: 'mainContractSettlement',
            authority: "D51F305",
            name: '主合同工程结算管理',
            component: './CostControl/Settlement/MainContractSettlement',
          },
          {
            path: 'subcontractorSettlement',
            authority: "D51F306",
            name: '分包合同工程结算管理',
            component: './CostControl/Settlement/SubcontractorSettlement',
          },
        ]
      },
      {
        path: 'visa',
        authority: "D51F307",
        name: '签证管理',
        routes: [
          {
            path: 'mainContractVisa',
            authority: "D51F308",
            name: '主合同签证管理',
            component: './CostControl/Visa/MainContractVisa',
          },
          {
            path: 'subContractVisa',
            authority: "D51F309",
            name: '分包合同签证管理',
            component: './CostControl/Visa/SubContractVisa',
          },
        ]
      },
    ]
  },
  {
    path: 'dep/materialsAndserviceProcurement',
    name: '物资及服务采购管理',
    authority: "D51F400",
    icon: 'icon-caigou',
    desc: '收入合同、支出合同...',
    color: 'iconGreen',
    routes: [
      {
        path: '/dep/materialsAndserviceProcurement',
        redirect: '/dep/materialsAndserviceProcurement/procurement/procurementSchedule',
      },
      {
        path: 'procurement',
        authority: "D51F401",
        name: '总体策略',
        routes: [
          {
            path: 'procurementSchedule',
            authority: "D51F402",
            name: '采购进度计划',
            component: './Procurement/ProcurementSchedule',
          },
          {
            path: 'purchaseStrategyLotPlan',
            authority: "D51F403",
            name: '单个标段策划方案',
            component: './Procurement/PurchaseStrategyLotPlan',
          },
        ],
      },
      // {
      //   name: '基础数据',
      //   authority: 'D51F402',
      //   path: 'base',
      //   routes: [
      //     {
      //       name: '物料分类配置',
      //       authority: 'D51F403',
      //       path: 'ClsConfig',
      //       component: './Procurement/Base/ClsConfig',
      //     },
      //     {
      //       name: '工程信息',
      //       authority: 'D51F403',
      //       path: 'projectInfo',
      //       component: './Procurement/Base/ProjectInfo',
      //     },
      //     {
      //       name: '物质类别',
      //       authority: 'D51F403',
      //       path: 'materialCategory',
      //       component: './Procurement/Base/MaterialCategory',
      //     },
      //     {
      //       name: '不允许发放物料',
      //       authority: 'D51F404',
      //       path: 'RefuseProdInfo',
      //       component: './Procurement/Base/RefuseProdInfo',
      //     },
      //     {
      //       name: '物料信息',
      //       authority: 'D51F405',
      //       path: 'ProdInfo',
      //       component: './Procurement/Base/ProdInfo',
      //     },
      //     {
      //       name: '物料分类信息',
      //       authority: 'D51F406',
      //       path: 'ClsInfo',
      //       component: './Procurement/Base/ClsInfo',
      //     },
      //     {
      //       name: '物料代用信息',
      //       authority: 'D51F407',
      //       path: 'Substitution',
      //       component: './Procurement/Base/Substitution',
      //     },
      //     {
      //       name: '仓库信息',
      //       authority: 'D51F408',
      //       path: 'warehouseInfo',
      //       component: './Procurement/Base/WarehouseInfo',
      //     },
      //   ],
      // },
      // {
      //   name: '需求计划',
      //   authority: 'D51F409',
      //   path: 'JiaPurchasePlan',
      //   component: './Procurement/JiaPurchasePlan',
      // },
      // {
      //   name: '分割预算',
      //   authority: 'D51F410',
      //   path: 'JiaSplitBudget',
      //   component: './Procurement/JiaSplitBudget',
      // },
      // {
      //   name: '平衡利库',
      //   authority: 'D51F411',
      //   path: 'BalancedLiquidity',
      //   component: './Procurement/BalancedLiquidity',
      // },
      // {
      //   path: 'PlanManagement',
      //   authority: "D51F412",
      //   name: '计划管理',
      //   routes: [
      //     {
      //       path: 'ProcurementPlan',
      //       authority: "D51F413",
      //       name: '采购计划',
      //       component: './Procurement/ProcurementPlan',
      //     },
      //     {
      //       path: 'ProcurementPlanFirst',
      //       authority: "D51F414",
      //       name: '采购计划一级分配',
      //       component: './Procurement/ProcurementPlanFirst',
      //     },
      //     {
      //       path: 'ProcurementPlanSecond',
      //       authority: "D51F415",
      //       name: '采购计划二级分配',
      //       component: './Procurement/ProcurementPlanSecond',
      //     },
      //     {
      //       path: 'ProcurementPlanThird',
      //       authority: "D51F416",
      //       name: '采购计划三级分配',
      //       component: './Procurement/ProcurementPlanThird',
      //     },
      //   ]
      // },
      // {
      //   path: 'PurchaseTask',
      //   authority: "D51F417",
      //   name: '采购任务',
      //   component: './Procurement/PurchaseTask',
      // },
      // {
      //   path: 'SupplierInfo',
      //   authority: "D51F418",
      //   name: '供应商信息',
      //   component: './Procurement/SupplierInfo',
      // },
      // {
      //   path: 'Purchase',
      //   authority: "D51F419",
      //   name: '采购组信息',
      //   component: './Procurement/Purchase',
      // },
      // {
      //   name: '会议管理',
      //   authority: 'D51F420',
      //   path: 'meetingManagement',
      //   routes: [
      //     {
      //       name: '委员会职务档案',
      //       authority: 'D51F421',
      //       path: 'committeePosition',
      //       component: './Procurement/MeetingManagement/CommitteePosition',
      //     },
      //     {
      //       name: '人员档案',
      //       authority: 'D51F422',
      //       path: 'personnelFile',
      //       component: './Procurement/MeetingManagement/PersonnelFile',
      //     },
      //     {
      //       name: '会议上会条件设置',
      //       authority: 'D51F423',
      //       path: 'meetingCondition',
      //       component: './Procurement/MeetingManagement/MeetingCondition',
      //     },
      //     {
      //       name: 'TC会议管理',
      //       authority: 'D51F424',
      //       path: 'tcMeeting',
      //       component: './Procurement/MeetingManagement/TcMeeting',
      //     },
      //   ],
      // },

    ]
  },
  {
    path: 'dep/safetyGreen',
    name: '安全管理',
    authority: "D51F700",
    icon: 'icon-anquan1',
    desc: '采购供应商、物料计划及发放...',
    color: 'iconRed',
    routes: [
      {
        path: '/dep/safetyGreen',
        redirect: '/dep/safetyGreen/legalRequirements/library',
      },
      {
        path: 'SafetyGreenDataCockpit',
        authority: "D51F715",
        name: '数据驾驶舱',
        component: './SafetyGreen/DataCockpit',
      },
      {
        path: 'legalRequirements',
        authority: "D51F706",
        name: '法律法规及其他要求',
        routes: [
          {
            path: 'library',
            authority: "D51F707",
            name: 'HSE法律法规库',
            component: './SafetyGreen/LegalRequirements/HSELibrary',
          },
          {
            path: 'libraryConfig',
            authority: "D51F708",
            name: 'HSE法律法规库上传',
            component: './SafetyGreen/LegalRequirements/HSELibraryConfig',
          },
        ]
      },
      {
        path: 'inspect',
        authority: "D51F701",
        name: '监督检查',
        routes: [
          {
            path: 'workpoionts',
            authority: "D51F705",
            name: '记分管理',
            component: './SafetyGreen/Workpoionts',
          },
          {
            path: 'qualitySafetyOversight',
            authority: "D51F702",
            name: '质量安全监督检查问题清单',
            component: './SafetyGreen/Inspect/QualitySafetyOversight',
          },
          {
            path: 'safetyOversight',
            authority: "D51F717",
            name: '安全监督检查问题清单',
            component: './SafetyGreen/Inspect/SafetyOversight',
          },
          {
            path: 'questionClassification',
            authority: "D51F703",
            name: '问题归类配置',
            component: './SafetyGreen/Inspect/QuestionClassification',
          },
          {
            path: 'problemStatistics',
            authority: "D51F702",
            name: '问题统计',
            component: './SafetyGreen/Inspect/ProblemStatistics',
          },
          {
            path: 'ProblemStatisticsSecurity',
            authority: "D51F702",
            name: '安全问题统计',
            component: './SafetyGreen/Inspect/ProblemStatisticsSecurity',
          },
          {
            path: 'unitRanking',
            authority: "D51F704",
            name: '单位排名',
            component: './SafetyGreen/Inspect/UnitRanking',
          },
        ]
      },
      // {
      //   path: 'securityCheck',
      //   authority: "D51F307",
      //   name: '安全检查',
      //   routes: [
      //     {
      //       path: 'dailyOnSiteHSEInspection',
      //       authority: "D51F308",
      //       name: '现场日常HSE检查',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      // {
      //   path: 'performanceAppraisal',
      //   authority: "D51F307",
      //   name: '绩效考核',
      //   routes: [
      //     {
      //       path: 'corporateHSEPerformanceAppraisal',
      //       authority: "D51F308",
      //       name: '单位HSE绩效考核',
      //       component: './SafetyGreen/LegalRequirements/HSELibrary',
      //     },
      //   ]
      // },
      {
        path: 'emergencyManagement',
        authority: "D51F712",
        name: '应急管理',
        routes: [
          {
            path: 'emergencyResponsibility',
            authority: "D51F713",
            name: '应急预案',
            component: './SafetyGreen/EmergencyResponsibility',
          },
          {
            path: 'legislation',
            authority: "D51F718",
            name: '处置规程',
            component: './SafetyGreen/Legislation',
          }
        ]
      },
      {
        path: 'lessonsLearned',
        authority: "D51F709",
        name: '经验分享',
        routes: [
          {
            path: 'lessonsLearned',
            authority: "D51F710",
            name: '经验分享',
            component: './SafetyGreen/LessonsLearned',
          },
          {
            path: 'lessonsLearnedConfig',
            authority: "D51F711",
            name: '经验分享上传',
            component: './SafetyGreen/LessonsConfig',
          },
        ]
      },
      {
        path: 'DataDashboardConfig',
        authority: "D51F716",
        name: '数据驾驶舱配置',
        component: './SafetyGreen/DataCockpitConfig',
      },
    ]
  },
  {
    path: 'dep/engineering',
    name: '工程管理',
    authority: "D51F500",
    icon: 'icon-gongchengshi',
    desc: '周报、月报及作业许可...',
    color: 'iconCyan',
    routes: [
      {
        path: 'scheduleManagement',
        name: '进度管理',
        authority: "D51F501",
        routes: [
          {
            path: 'scheduleManagement',
            redirect: '/dep/scheduleManagement/BasicInfoManage/projectBasicInfo',
          },
          {
            path: 'BasicInfoManage',
            authority: "D51F502",
            name: '基本信息管理',
            routes: [
              {
                path: 'projectBasicInfo',
                authority: "D51F503",
                name: '项目基本信息',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfo',
              },
              {
                path: 'projectBasicInfoApproval',
                authority: "D51F504",
                name: '项目基本信息审批',
                component: './ScheduleManagement/BasicInfoManage/ProjectBasicInfoApproval',
              },
            ]
          },
          {
            path: 'week',
            authority: "D51F505",
            name: '重点项目进度周报',
            routes: [
              {
                path: 'weeklyReport',
                authority: "D51F506",
                name: '周报填报',
                component: './Engineering/Week/WeeklyReport',
              },
              {
                path: 'currAddProject',
                authority: "D51F508",
                name: '本周新增项目',
                component: './Engineering/Week/CurrAddProjectList',
              },
              {
                path: 'currFinishProject',
                authority: "D51F509",
                name: '本周完工项目',
                component: './Engineering/Week/CurrFinishProjectList',
              },
            ]
          },
          {
            path: 'importantProject',
            authority: "D51F510",
            name: '重点项目台账',
            routes: [
              {
                path: 'keyProjectTongJi',
                authority: "D51F511",
                name: '重点项目统计表',
                component: './Engineering/ImportantProject/KeyProjectTongJi',
              },
              {
                path: 'keyProject',
                authority: "D51F512",
                name: '重点项目台账',
                component: './Engineering/ImportantProject/KeyProjectList',
              },
            ]
          },
          {
            path: 'monthly',
            authority: "D51F513",
            name: '项目月报',
            routes: [
              {
                path: 'monthlyReport',
                authority: "D51F514",
                name: '工程项目月报',
                component: './Engineering/Month/MonthlyReport',
              },
              {
                path: 'currAddProject',
                authority: "D51F514",
                name: '本月新增项目',
                component: './Engineering/Month/CurrAddProjectList',
              },
              {
                path: 'currFinishProject',
                authority: "D51F514",
                name: '本月完工项目',
                component: './Engineering/Month/CurrFinishProjectList',
              },
            ]
          },
          {
            path: 'engineerProjectLedger',
            name: '工程项目台账',
            authority: "D51F517",
            component: './Engineering/EngineerProjectLedger',
          },
          {
            path: 'monthlyConstructPlan',
            name: '月度施工计划',
            authority: "D51F523",
            component: './Engineering/MonthlyConstructPlan',
          },
          {
            path: 'yearProductPlan',
            name: '年度生产计划',
            authority: "D51F518",
            component: './Engineering/YearProductPlan',
          },
        ]
      },
      {
        path: 'contractor',
        authority: "D51F519",
        name: '承包商管理',
        routes: [
          {
            path: 'contractorPersonnel',
            authority: "D51F520",
            name: '承包商人员信息',
            component: './Engineering/Contractor/ContractorPersonnel',
          },
          {
            path: 'contractorAnnualEval',
            authority: "D51F521",
            name: '承包商年度评价基本信息',
            component: './Engineering/Contractor/ContractorAnnualEval',
          },
          {
            path: 'contractorInspection',
            authority: "D51F522",
            name: '承包商施工作业过程中监督检查表',
            component: './Engineering/Contractor/ContractorInspection',
          },
        ]
      },
      {
        path: 'supplier',
        authority: "D51F524",
        name: '供应商管理',
        routes: [
          {
            path: 'supplierContract',
            authority: "D51F525",
            name: '供应商合同',
            component: './Engineering/Supplier/SupplierContract',
          },
          {
            path: 'supplierContractScore',
            authority: "D51F526",
            name: '供应商合同评分',
            component: './Engineering/Supplier/SupplierContractScore',
          },
          {
            path: 'moduleConfig',
            authority: "D51F527",
            name: '基础配置',
            component: './Engineering/Supplier/ModuleConfig',
          },
        ]
      },
      {
        path: 'workLicenseRegister',
        name: '作业许可证登记表',
        authority: "D51F537",
        component: './Engineering/WorkLicenseRegister',
      },
      {
        path: 'WorkPermitStatistics',
        name: '作业许可证管理统计',
        authority: "D51F538",
        component: './Engineering/WorkPermitStatistics',
      },
      {
        path: 'levelConstructor',
        name: '一级建造师',
        authority: "D51F539",
        component: './Engineering/LevelConstructor',
      },
    ]
  },
  {
    path: 'dep/technology',
    name: '技术管理',
    authority: "D51F800",
    icon: 'icon-jishu-line',
    desc: '技术文件及质量、HSE...',
    color: 'iconOrange',
    routes: [
      {
        path: '/dep/technology',
        redirect: '/dep/technology/technicalDocument/technologyAuditOrganization/technologyAuditOrganizationStats',
      },
      {
        path: 'technicalDocument',
        name: '技术文件管理',
        authority: "D51F801",
        routes: [
          {
            path: 'technologyAuditOrganization',
            name: '施工组织设计',
            authority: "D51F802",
            routes: [
              {
                path: 'technologyAuditOrganizationStats',
                authority: "D51F802",
                name: '施工组织设计统计',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganizationStats',
              },
              {
                path: 'TechnologyAuditOrganization',
                authority: "D51F802",
                name: '施工组织设计审批',
                component: './Technology/TechnicalDocument/TechnologyAuditOrganization',
              },
            ]
          },
          {
            path: 'technologyAuditQuality',
            name: '质量计划',
            authority: "D51F803",
            routes: [
              {
                path: 'technologyAuditQualityStats',
                authority: "D51F803",
                name: '质量计划统计',
                component: './Technology/TechnicalDocument/TechnologyAuditQualityStats',
              },
              {
                path: 'TechnologyAuditQuality',
                authority: "D51F803",
                name: '质量计划审批',
                component: './Technology/TechnicalDocument/TechnologyAuditQuality',
              },
            ]
          },
          {
            path: 'hseRiskManagement',
            authority: "D51F804",
            name: 'HSE风险管理',
            routes: [
              {
                path: 'technologyAuditHse',
                name: 'HSE危害因素辨识与风险评价报告',
                authority: "D51F804",
                routes: [
                  {
                    path: 'technologyAuditHseStats',
                    authority: "D51F804",
                    name: 'HSE危害因素辨识与风险评价报告统计',
                    component: './Technology/TechnicalDocument/TechnologyAuditHseStats',
                  },
                  {
                    path: 'TechnologyAuditHse',
                    authority: "D51F804",
                    name: 'HSE危害因素辨识与风险评价报告',
                    component: './Technology/TechnicalDocument/TechnologyAuditHse',
                  },
                ]
              },
              {
                path: 'technologyHseRiskControlList',
                authority: "D51F805",
                name: 'HSE重大风险清单',
                component: './Technology/TechnicalDocument/TechnologyHseRiskControlList',
              },
              {
                path: 'hseRiskManagementYear',
                authority: "D51F806",
                name: '年度HSE风险管理',
                routes: [
                  {
                    path: 'technologyHseRiskControlListYear',
                    authority: "D51F806",
                    name: 'HSE重大风险及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyHseRiskControlListYear',
                  },
                  {
                    path: 'technologyEnvironmentalControlListYear',
                    authority: "D51F807",
                    name: ' 重要环境因素及控制措施清单',
                    component: './Technology/TechnicalDocument/TechnologyEnvironmentalControlListYear',
                  },
                ]
              },
            ]
          },
          {
            path: 'technologyAuditConstruction',
            authority: "D51F808",
            name: '施工技术方案',
            routes: [
              {
                path: 'technologyAuditConstructionStats',
                authority: "D51F808",
                name: '施工技术方案统计',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionStats',
              },
              {
                path: 'technologyAuditConstructionApproval',
                authority: "D51F808",
                name: '施工技术方案审批',
                component: './Technology/TechnicalDocument/TechnologyAuditConstructionApproval',
              },
            ]
          },

          {
            path: 'technologyAuditSummary',
            name: '项目总结审批',
            authority: "D51F809",
            routes: [
              {
                path: 'technologyAuditSummaryStats',
                authority: "D51F809",
                name: '项目总结统计',
                component: './Technology/TechnicalDocument/TechnologyAuditSummaryStats',
              },
              {
                path: 'TechnologyAuditSummary',
                authority: "D51F809",
                name: '项目总结审批',
                component: './Technology/TechnicalDocument/TechnologyAuditSummary',
              },
            ]
          },
          {
            path: 'handoverDocuments',
            authority: "D51F810",
            name: '交工资料归档',
            routes: [
              {
                path: 'technologyArchiveList',
                authority: "D51F810",
                name: '归档清单',
                component: './Technology/TechnicalDocument/TechnologyArchiveList',
              },
              {
                path: 'technologyArchiveListStatistics',
                authority: "D51F812",
                name: '交工资料归档统计',
                component: './Technology/TechnicalDocument/TechnologyArchiveListStatistics',
              },
            ]
          },

        ]
      },
      {
        path: 'nonconformitySummary',
        authority: "D51F811",
        name: '不合格品汇总',
        component: './Technology/NonconformitySummary',
      },

    ]
  },
  {
    path: 'dep/MarketDevelopmentCente',
    authority: "D51F1100",
    name: '市场开发中心',
    icon: 'icon-shichangkaifa',
    desc: '业绩台账及投标报价...',
    color: 'iconBlue',
    routes: [
      {
        path: '/dep/MarketDevelopmentCente',
        redirect: '/dep/MarketDevelopmentCente/KnowledgeBase',
      },
      // {
      //   path: 'Dashboard',
      //   authority: "D51F1101",
      //   name: '数据驾驶舱',
      //   component: './MarketDevelopmentCente/Dashboard',
      // },
      {
        path: 'KnowledgeBase',
        authority: "D51F1102",
        name: '知识库文件管理',
        component: './MarketDevelopmentCente/KnowledgeBase',
      },
      {
        path: 'PerformanceLedger',
        authority: "D51F1103",
        name: '公司业绩台账',
        component: './MarketDevelopmentCente/PerformanceLedger',
      },
      {
        path: 'BidQuotation',
        authority: "D51F1104",
        name: '投标报价管理',
        component: './MarketDevelopmentCente/BidQuotation',
      },
      // {
      //   path: 'CertificationTracking',
      //   authority: "D51F1105",
      //   name: '人员证件管理',
      //   component: './MarketDevelopmentCente/CertificationTracking',
      // },
      {
        path: 'DashboardConfig',
        authority: "D51F1106",
        name: '数据驾驶舱配置',
        component: './MarketDevelopmentCente/DashboardConfig',
      },
    ]
  },
  {
    path: 'dep/finance',
    name: '财务管理',
    authority: "D51F1400",
    icon: 'icon-caiwuguanli',
    desc: '税务、债权债务及损益...',
    color: 'iconOrange',
    routes: [
      {
        path: '/dep/finance',
        redirect: '/dep/finance/profit',
      },
      {
        path: 'profit',
        authority: "D51F1401",
        name: '利润中心',
        component: './Finance/ProfitCenter',
      },
      {
        path: 'tax',
        name: '税务',
        authority: "D51F1402",
        routes: [
          {
            path: 'accounting',
            authority: "D51F1402",
            name: '会计科目',
            component: './Finance/Tax/TaxAccounting',
          },
          {
            path: 'book',
            authority: "D51F1402",
            name: '税金台账',
            component: './Finance/Tax/TaxBook',
          },
        ]
      },
      {
        path: 'debt',
        name: '债权债务',
        authority: "D51F1402",
        routes: [
          {
            path: 'debtStatistics',
            authority: "D51F1403",
            name: '债权填报',
            component: './Finance/DebtStatistics',
          },
          {
            path: 'debtPaymentStatistics',
            authority: "D51F1404",
            name: '债务填报',
            component: './Finance/DebtPaymentStatistics',
          },
          {
            path: 'fundForecast',
            authority: "D51F1411",
            name: '净债权资金预测',
            component: './Finance/FundForecast',
          },
        ]
      },
      {
        path: 'profitAndLoss',
        name: '损益',
        authority: "D51F1405",
        routes: [
          {
            path: 'wbscompare',
            authority: "D51F1406",
            name: 'WBS对照表',
            component: './Finance/ProfitAndLoss/WbsDefineCompare',
          },
          {
            path: 'businessPartner',
            authority: "D51F1407",
            name: '往来单位',
            component: './Finance/ProfitAndLoss/BusinessPartner',
          },
          {
            path: 'projectInformation',
            authority: "D51F1408",
            name: '项目信息表',
            component: './Finance/ProfitAndLoss/ProjectInformation',
          },
          {
            path: 'predict',
            authority: "D51F1409",
            name: '损益预测表',
            component: './Finance/ProfitAndLoss/Predict',
          },
          {
            path: 'resourceOngoingProject',
            authority: "D51F1410",
            name: '在建项目资源结转情况表',
            component: './Finance/ProfitAndLoss/ResourceOngoingProject',
          },
        ]
      },
    ]
  },
  {
    path: 'dep/quality',
    name: '质量管理',
    authority: "D51F1300",
    icon: 'icon-zhiliang',
    desc: '质量月报、特殊设备及监督检查...',
    color: 'iconOrange',
    routes: [
      {
        path: '/dep/quality',
        redirect: '/dep/quality/qualityReport/overallQualityProducts/overallQualityProductsView',
      },
      {
        path: 'qualityReport',
        name: '质量月报',
        authority: "D51F1325",
        routes: [
          {
            path: 'qualityMonthlyReport',
            name: '质量月报汇总表',
            authority: "D51F1394",
            component: './Quality/QualityReport/QualityMonthlyReport',
          },
          {
            path: 'qualityProjectDataExist',
            name: '质量月报填报情况',
            authority: "D51F1326",
            component: './Quality/QualityReport/QualityProjectDataExist',
          },
          {
            path: 'overallQualityProducts',
            name: '工程产品总体质量情况',
            authority: "D51F1327",
            routes: [
              {
                path: 'overallQualityProductsView',
                name: '工程产品总体质量情况概述',
                authority: "D51F1328",
                component: './Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView',
              },
              {
                path: 'qualityProducedProducts',
                name: '自产产品制造质量情况',
                authority: "D51F1330",
                component: './Quality/QualityReport/OverallQualityProducts/QualityProducedProducts',
              },
              {
                path: 'qualityTechServiceQuality',
                name: '技术服务质量情况',
                authority: "D51F1329",
                component: './Quality/QualityReport/OverallQualityProducts/QualityTechServiceQuality',
              },
            ]
          },
          {
            path: 'qualitySystemOperation',
            name: '质量体系运行情况',
            authority: "D51F1331",
            component: './Quality/QualityReport/QualitySystemOperation',
          },
          {
            path: 'qualityActivities',
            name: '开展主要质量活动',
            authority: "D51F1332",
            routes: [
              {
                path: 'qualityInspection',
                name: '质量大检查及专项检查情况',
                authority: "D51F1333",
                component: './Quality/QualityReport/QualityActivities/QualityInspection',
              },
              {
                path: 'qualityExcellenceActivity',
                name: '创优活动开展情况',
                authority: "D51F1334",
                component: './Quality/QualityReport/QualityActivities/QualityExcellenceActivity',
              },
              {
                path: 'qualityQcActivity',
                name: 'QC小组活动开展情况',
                authority: "D51F1335",
                component: './Quality/QualityReport/QualityActivities/QualityQcActivity',
              },
            ]
          },
          {
            path: 'qualityDataAnalysis',
            name: '质量数据统计分析及采取措施',
            authority: "D51F1336",
            routes: [
              {
                path: 'qualityDataStatistics',
                name: '质量数据统计',
                authority: "D51F1337",
                routes: [
                  {
                    path: 'qualityNcCorrectiveAction',
                    name: '不合格项纠正措施记录',
                    authority: "D51F1338",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityNcCorrectiveAction',
                  },
                  {
                    path: 'qualityInspectionSummary',
                    name: '质量大(专项)检查主要不合格项汇总情况分布',
                    authority: "D51F1339",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityInspectionSummary',
                  },
                  {
                    path: 'qualityMonthlyWeldingPassRate',
                    name: '月度焊接一次合格率统计表',
                    authority: "D51F1340",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyWeldingPassRate',
                  },
                  {
                    path: 'qualityAccidentSummary',
                    name: '质量事故汇总表',
                    authority: "D51F1341",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
                  },
                  {
                    path: 'qualityMonthlyQualityStatistics',
                    name: '质量数据统计表',
                    authority: "D51F1342",
                    component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyQualityStatistics',
                  },
                ]
              },
              {
                path: 'qualityOtherQualityStatistics',
                name: '其它质量数据统计情况',
                authority: "D51F1343",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityOtherQualityStatistics',
              },
              {
                path: 'qualityStatisticsAnalysis',
                name: '质量统计数据分析情况',
                authority: "D51F1344",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityStatisticsAnalysis',
              },
            ],
          },
          {
            path: 'criticalNonconformities',
            name: '严重不合格品及质量事故情况',
            authority: "D51F1345",
            routes: [
              {
                path: 'qualitySeriousNonconformities',
                name: '本月严重不合格品情况',
                authority: "D51F1346",
                component: './Quality/QualityReport/CriticalNonconformities/QualitySeriousNonconformities',
              },
              {
                path: 'qualityIncidentDetails',
                name: '质量事故情况',
                authority: "D51F1347",
                component: './Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary',
              },
            ]
          },
          {
            path: 'qualityWorkArrangement',
            name: '工作安排及建议',
            authority: "D51F1348",
            component: './Quality/QualityReport/QualityWorkArrangement',
          },
          {
            path: 'qualityExperience',
            name: '质量经验分享',
            authority: "D51F1349",
            component: './Quality/QualityReport/QualityExperience',
          },
        ]
      },
      {
        path: 'SpecialEquipment',
        name: '特种设备管理',
        authority: "D51F1301",
        routes: [
          {
            path: 'SEOnlineNotification',
            name: '特种设备网上告知相关信息统计表',
            authority: "D51F1302",
            component: './Quality/SpecialEquipment/SEOnlineNotification',
          },
          {
            path: 'PressureVessel',
            name: '压力容器制造(组焊、安装改造修理)管理',
            authority: "D51F1310",
            routes: [
              {
                path: 'PressureVesselPreformance',
                name: '施工业绩',
                authority: "D51F1311",
                component: './Quality/SpecialEquipment/PressureVessel/PressureVesselPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "D51F1312",
                component: './Quality/SpecialEquipment/PressureVessel/PVQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "D51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "1"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "D51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "D51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "1"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "D51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "1"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "D51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "1"
              },
            ]
          },
          {
            path: 'PressurePiping',
            name: '压力管道管理',
            authority: "D51F1313",
            routes: [
              {
                path: 'PressurePipingPreformance',
                name: '施工业绩',
                authority: "D51F1314",
                component: './Quality/SpecialEquipment/PressurePiping/PressurePipingPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "D51F1315",
                component: './Quality/SpecialEquipment/PressurePiping/PPQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "D51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "2"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "D51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "D51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "2"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "D51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "2"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "D51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "2"
              },
            ]
          },
          {
            path: 'Boiler',
            name: '锅炉管理',
            authority: "D51F1316",
            routes: [
              {
                path: 'BoilerPreformance',
                name: '施工业绩',
                authority: "D51F1317",
                component: './Quality/SpecialEquipment/Boiler/BoilerPreformance',
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "D51F1318",
                component: './Quality/SpecialEquipment/Boiler/BoilerQAStaffNomination',
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "D51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "3"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "D51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "D51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "3"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "D51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "3"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "D51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "3"
              },
            ]
          },
          {
            path: 'HoistingMachinery',
            name: '起重机械管理',
            authority: "D51F1319",
            routes: [
              {
                path: 'HoistingMachineryPreformance',
                name: '施工业绩',
                authority: "D51F1320",
                component: './Quality/SpecialEquipment/HoistingMachinery/HoistingMachineryPreformance',
                marking: "4"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "D51F1321",
                component: './Quality/SpecialEquipment/HoistingMachinery/HMQAStaffNomination',
                marking: "4"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "D51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "4"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "D51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "D51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "4"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "D51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "4"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "D51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "4"
              },
            ]
          },
          {
            path: 'PipingComponents',
            name: '压力管道元件管理',
            authority: "D51F1322",
            routes: [
              {
                path: 'PipingComponentsPreformance',
                name: '施工业绩',
                authority: "D51F1323",
                component: './Quality/SpecialEquipment/PipingComponents/PipingComponentsPreformance',
                marking: "5"
              },
              {
                path: 'PVQAStaffNomination',
                name: '质保体系责任人员推荐表',
                authority: "D51F1324",
                component: './Quality/SpecialEquipment/PipingComponents/PCQAStaffNomination',
                marking: "5"
              },
              {
                path: 'SafetyRiskControl',
                name: '质量安全风险管控清单',
                authority: "D51F1303",
                component: './Quality/SpecialEquipment/SafetyRiskControl',
                marking: "5"
              },
              {
                path: 'QualitySafetyDailyCheck',
                name: '每日质量安全检查记录',
                authority: "D51F1304",
                component: './Quality/SpecialEquipment/QualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'NoQualitySafetyDailyCheck',
                name: '每日不合格项质量安全检查问题汇总',
                authority: "D51F1305",
                component: './Quality/SpecialEquipment/NoQualitySafetyDailyCheck',
                marking: "5"
              },
              {
                path: 'QualitySafetyWeekCheck',
                name: '每周质量安全排查治理报告',
                authority: "D51F1306",
                component: './Quality/SpecialEquipment/QualitySafetyWeekCheck',
                marking: "5"
              },
              {
                path: 'DispatchMeeting',
                name: '每月质量安全调度会议纪要',
                authority: "D51F1307",
                component: './Quality/SpecialEquipment/DispatchMeeting',
                marking: "5"
              },
            ]
          },
          {
            path: 'SEPostConfig',
            name: '特种设备职务配置表信息',
            authority: "D51F1308",
            component: './Quality/SpecialEquipment/SEPostConfig',
          },
          {
            path: 'RskControlConfig',
            name: '特种设备质量安全风险管控清单配置表',
            authority: "D51F1309",
            component: './Quality/SpecialEquipment/RskControlConfig',
          },
        ]
      },

      {
        path: 'QualitySupervision',
        name: '质量监督管理',
        authority: "D51F1350",
        routes: [
          {
            path: 'QualityIssue',
            name: '质量监督检查问题清单',
            authority: "D51F1351",
            component: './Quality/QualitySupervision/QualityIssue',
          },
          {
            path: 'ProblemStatistics',
            name: '质量问题统计',
            authority: "D51F1352",
            component: './Quality/QualitySupervision/ProblemStatistics',
          },
          {
            path: 'ScoringPersonnel',
            name: '质量记分人员信息',
            authority: "D51F1353",
            component: './Quality/QualitySupervision/ScoringPersonnel',
          },
          {
            path: 'Contractor',
            name: '质量监督审核问题清单',
            authority: "D51F1354",
            component: './Quality/QualitySupervision/Contractor',
          },
          {
            path: 'QualityScore',
            name: '质量记分问题统计',
            authority: "D51F1355",
            component: './Quality/QualitySupervision/QualityScore',
          },
          {
            path: 'RewardPunishment',
            name: '质量奖惩情况统计表',
            authority: "D51F1356",
            component: './Quality/QualitySupervision/RewardPunishment',
          },
        ]
      },

      {
        path: 'inspectorManagement',
        name: '质量检查员管理',
        authority: "D51F1357",
        routes: [
          {
            path: 'inspectorSeniorityApply',
            name: '质量检查员资格证申请',
            authority: "D51F1358",
            component: './Quality/InspectorManagement/InspectorSeniorityApply',
          },
          {
            path: 'inspectorCerateLedger',
            name: '质量检查员办证台账',
            authority: "D51F1359",
            component: './Quality/InspectorManagement/InspectorCerateLedger',
          },
          {
            path: 'inspectorAnnualAudit',
            name: '质量检查员资格证年审',
            authority: "D51F1360",
            component: './Quality/InspectorManagement/InspectorAnnualAudit',
          },
        ]
      },
      {
        path: 'measuringManagement',
        name: '计量器具管理',
        authority: "D51F1361",
        routes: [
          {
            path: 'monitoringMeasuring',
            name: '监视和测量设备登记表',
            authority: "D51F1362",
            component: './Quality/MeasuringManagement/MonitoringMeasuring',
          },
          {
            path: 'monitoringMeasuringApproval',
            name: '监视和测量设备审批记录',
            authority: "D51F1363",
            component: './Quality/MeasuringManagement/MonitoringMeasuringApproval',
          },
          {
            path: 'monitoringMeasuringStatistical',
            name: '监视和测量设备信息统计表',
            authority: "D51F1364",
            component: './Quality/MeasuringManagement/MonitoringMeasuringStatistical',
          },
        ]
      },
      {
        path: 'personnelMeasurement',
        name: '计量人员管理',
        authority: "D51F1365",
        routes: [
          {
            path: 'personnelApplyForm',
            name: '计量人员资格申请表',
            authority: "D51F1366",
            component: './Quality/PersonnelMeasurement/PersonnelApplyForm',
          },
          {
            path: 'personnelLedger',
            name: '计量管理人员台账',
            authority: "D51F1367",
            component: './Quality/PersonnelMeasurement/PersonnelLedger',
          },
          {
            path: 'personnelLedgerAudit',
            name: '计量管理人员复审',
            authority: "D51F1368",
            component: './Quality/PersonnelMeasurement/PersonnelLedgerAudit',
          },
        ]
      },
      {
        path: 'outsourcedManagement',
        name: '外委实验室管理',
        authority: "D51F1369",
        routes: [
          {
            path: 'outsourcedSurveyAssess',
            name: '外委实验室调查评价表',
            authority: "D51F1370",
            component: './Quality/OutsourcedManagement/OutsourcedSurveyAssess',
          },
          {
            path: 'outsourcedLedger',
            name: '外委实验室台账',
            authority: "D51F1371",
            component: './Quality/OutsourcedManagement/OutsourcedLedger',
          },
          // {
          //   path: 'outsourcedLedgerAudit',
          //   name: '外委实验室年度审查表',
          //   authority: "D51F1372",
          //   component: './Quality/OutsourcedManagement/OutsourcedLedgerAudit',
          // },
        ]
      },
      {
        path: 'RiskMonthlyManagement',
        name: '月度质量重大风险管理',
        authority: "D51F1373",
        routes: [
          {
            path: 'monthMajorQualityRisks',
            name: '月度重大质量风险',
            authority: "D51F1374",
            component: './Quality/MonthlyQualityRisk/MonthMajorQualityRisks',
          },
        ]
      },
      {
        path: 'RiskYearQualityManagement',
        name: '年度质量重大风险管理',
        authority: "D51F1377",
        routes: [
          {
            path: 'riskYearQualityPage',
            name: '年度质量风险评估',
            authority: "D51F1378",
            component: './Quality/YearQualityRisk/RiskYearQualityPage',
          },
          {
            path: 'YearMajorQualityRisks',
            name: '年度重大质量风险',
            authority: "D51F1379",
            component: './Quality/YearQualityRisk/YearMajorQualityRisks',
          },
          // {
          //   path: 'outsourcedLedgerAudit',
          //   name: '年度质量风险评估审批',
          //   authority: "D51F1380",
          //   component: './Quality/YearQualityRisk/RiskYearQualityPageApproval',
          // },
        ]
      },
      {
        path: 'followManagement',
        name: '质量回访管理',
        authority: "D51F1381",
        routes: [
          {
            path: 'visitFollowPlan',
            name: '质量回访计划',
            authority: "D51F1382",
            component: './Quality/FollowManagement/VisitFollowPlan',
          },
          // {
          //   path: 'VisitFollowPlanApproval',
          //   name: '质量回访计划审批',
          //   authority: "D51F1383",
          //   component: './Quality/FollowManagement/VisitFollowPlanApproval',
          // },
        ]
      },
      {
        path: 'welderManagement',
        name: '焊工业绩管理',
        authority: "D51F1384",
        routes: [
          {
            path: 'weldPerformance',
            name: '焊工业绩',
            authority: "D51F1385",
            component: './Quality/WelderManagement/WeldPerformance',
          },
          {
            path: 'weldPerformanceReport',
            name: '焊工业绩档案',
            authority: "D51F1385",
            component: './Quality/WelderManagement/WeldPerformanceReport',
          },
          {
            path: 'weldPerformanceApproval',
            name: '焊工业绩审批',
            authority: "D51F1386",
            component: './Quality/WelderManagement/WeldPerformanceApproval',
          },
        ]
      },
      {
        path: 'enginExcelManagement',
        name: '工程创优管理',
        authority: "D51F1391",
        routes: [
          {
            path: 'enginExcelPlan',
            name: '创优情况计划',
            authority: "D51F1392",
            component: './Quality/EnginExcelManagement/EnginExcelPlan',
          },
          {
            path: 'enginExcelPlanApproval',
            name: '创优情况计划审批',
            authority: "D51F1393",
            component: './Quality/EnginExcelManagement/EnginExcelPlanApproval',
          }
        ]
      },
    ]
  },
  {
    path: 'dep/hr',
    name: '人力资源管理',
    authority: "D51F1300",
    icon: 'icon-renliziyuan2',
    desc: '人员培训、考试...',
    color: 'iconPurple',
    routes: [
      {
        path: '/dep/hr',
        redirect: '/dep/hr/hrWorkBench',
      },
      {
        path: 'hrWorkBench',
        authority: "B51F1300",
        name: 'HR工作台',
        component: './HR/HrWorkBench',
      },
      {
        path: 'training',
        authority: "D51F100",
        name: '培训管理',
        routes: [
          {
            path: '/dep/hr/training',
            redirect: '/dep/hr/training/plan',
          },
          {
            path: 'plan',
            authority: "D51F100",
            name: '项目培训计划',
            component: './HR/HrTrainingPlan/Dep',
          },
          {
            path: 'class',
            authority: "D51F100",
            name: '培训班管理',
            component: './HR/HrTrainingClass',
          },
          {
            path: 'course',
            authority: "D51F100",
            name: '课程信息管理',
            component: './HR/HrCourse',
          },
          {
            path: 'courseware',
            authority: "D51F100",
            name: '课件管理',
            component: './HR/HrCourseware',
          },
          {
            path: 'lecturer',
            authority: "D51F100",
            name: '讲师管理',
            component: './HR/HrLecturer',
          },
        ]
      },
    ]
  },
  {
    path: 'dep/backConfig',
    name: '系统配置',
    authority: "D51F100",
    icon: 'icon-xitongpeizhi',
    routes: [
      {
        path: '/backConfig',
        redirect: '/backConfig/moneyRateConfig',
      },
      {
        path: 'moneyRateConfig',
        authority: "D51F100",
        name: '币种汇率配置',
        component: './BackConfig/MoneyRateConfig',
      },
    ]
  },
]
