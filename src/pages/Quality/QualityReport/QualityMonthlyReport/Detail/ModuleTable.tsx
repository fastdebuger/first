import React, { useRef } from 'react';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import BaseHeaderAndBodyTable from '@/components/BaseHeaderAndBodyTable';
import { BasicTableColumns } from 'yayang-ui';
import moment from 'moment';

// 动态导入各模块的columns配置
import { configColumns as overallQualityProductsViewColumns } from '@/pages/Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView/columns';
import { configColumns as qualityProducedProductsColumns } from '@/pages/Quality/QualityReport/OverallQualityProducts/QualityProducedProducts/columns';
import { configColumns as qualityTechServiceQualityColumns } from '@/pages/Quality/QualityReport/OverallQualityProducts/QualityTechServiceQuality/columns';
import { configColumns as qualitySystemOperationColumns } from '@/pages/Quality/QualityReport/QualitySystemOperation/columns';
import { configColumns as qualityInspectionColumns } from '@/pages/Quality/QualityReport/QualityActivities/QualityInspection/columns';
import { configColumns as qualityExcellenceActivityColumns } from '@/pages/Quality/QualityReport/QualityActivities/QualityExcellenceActivity/columns';
import { configColumns as qualityQcActivityColumns } from '@/pages/Quality/QualityReport/QualityActivities/QualityQcActivity/columns';
import { configColumns as qualityNcCorrectiveActionColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityNcCorrectiveAction/columns';
import { configColumns as qualityInspectionSummaryColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityInspectionSummary/columns';
import { configColumns as qualityMonthlyWeldingPassRateColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyWeldingPassRate/columns';
import { configColumns as qualityAccidentSummaryColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary/columns';
import { configColumns as qualityMonthlyQualityStatisticsColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyQualityStatistics/columns';
import { configColumns as qualityOtherQualityStatisticsColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityOtherQualityStatistics/columns';
import { configColumns as qualityStatisticsAnalysisColumns } from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityStatisticsAnalysis/columns';
import { configColumns as qualitySeriousNonconformitiesColumns } from '@/pages/Quality/QualityReport/CriticalNonconformities/QualitySeriousNonconformities/columns';
import { configColumns as qualityWorkArrangementColumns } from '@/pages/Quality/QualityReport/QualityWorkArrangement/columns';
import { configColumns as qualityExperienceColumns } from '@/pages/Quality/QualityReport/QualityExperience/columns';
import QualityInspectionSummaryDetail from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityInspectionSummary/Detail';
import QualityMonthlyWeldingPassRateDetail from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyWeldingPassRate/Detail';
import QualityAccidentSummaryDetail from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityAccidentSummary/Detail';
import QualityMonthlyQualityStatisticsDetail from '@/pages/Quality/QualityReport/QualityDataAnalysis/QualityDataStatistics/QualityMonthlyQualityStatistics/Detail';
import QualityProjectQualityOverviewDetail from '@/pages/Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView/Detail';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { Button } from 'antd';

/**
 * 模块表格配置映射
 * 根据relativePath映射到对应的表格配置
 * funcCode: 根据路由前缀动态获取，S=subComp, B=branchComp, D=dep
 * componentType: singleTable(默认) / headerBody（表头表体）
 */
const moduleTableConfig: Record<string, any> = {
  // 工程产品总体质量情况概述
  'overallQualityProducts/overallQualityProductsView': {
    type: 'qualityProjectQualityOverview/getQualityProjectQualityOverview',
    exportType: 'qualityProjectQualityOverview/getQualityProjectQualityOverview',
    tableTitle: '工程产品总体质量情况概述',
    moduleCaption: '工程产品总体质量情况概述',
    funcCode: 'S51F1328', // 根据路由前缀动态替换：S->B/D
    configColumns: overallQualityProductsViewColumns,
    displayColumns: ['project_in_progress_name', 'major_quality_activities', 'award_info', 'form_maker_name', 'form_make_time_str', 'type_code_str'],
  },
  // 自产产品制造质量情况
  'overallQualityProducts/qualityProducedProducts': {
    type: 'qualityProducedProducts/getQualityProducedProducts',
    exportType: 'qualityProducedProducts/getQualityProducedProducts',
    tableTitle: '自产产品制造质量情况',
    moduleCaption: '自产产品制造质量情况',
    funcCode: 'S51F1330',
    configColumns: qualityProducedProductsColumns,
    displayColumns: ['brand_name', 'model', 'quantity', 'self_inspection_status', 'superior_inspection_status', 'form_maker_name', 'form_make_time_str'],
  },
  // 技术服务质量情况
  'overallQualityProducts/qualityTechServiceQuality': {
    type: 'qualityTechServiceQuality/getQualityTechServiceQuality',
    exportType: 'qualityTechServiceQuality/getQualityTechServiceQuality',
    tableTitle: '技术服务质量情况',
    moduleCaption: '技术服务质量情况',
    funcCode: 'S51F1329',
    configColumns: qualityTechServiceQualityColumns,
    displayColumns: ['service_quality_desc', 'form_maker_name', 'form_make_time_str'],
  },
  // 质量体系运行情况
  'qualitySystemOperation': {
    type: 'qualitySystemOperation/getQualitySystemOperation',
    exportType: 'qualitySystemOperation/getQualitySystemOperation',
    tableTitle: '质量体系运行情况',
    moduleCaption: '质量体系运行情况',
    funcCode: 'S51F1331',
    configColumns: qualitySystemOperationColumns,
    displayColumns: ['internal_audit', 'training', 'formulation', 'implementation', 'inspection', 'improvement', 'form_maker_name', 'form_make_time_str'],
  },
  // 质量大检查及专项检查情况
  'qualityActivities/qualityInspection': {
    type: 'qualityInspection/getQualityInspection',
    exportType: 'qualityInspection/getQualityInspection',
    tableTitle: '质量大检查及专项检查情况',
    moduleCaption: '质量大检查及专项检查情况',
    funcCode: 'S51F1333',
    configColumns: qualityInspectionColumns,
    displayColumns: ['check_time_str', 'check_unit', 'main_problems', 'rectification', 'project_name', 'form_maker_name', 'form_make_time_str'],
  },
  // 创优活动开展情况
  'qualityActivities/qualityExcellenceActivity': {
    type: 'qualityExcellenceActivity/getQualityExcellenceActivity',
    exportType: 'qualityExcellenceActivity/getQualityExcellenceActivity',
    tableTitle: '创优活动开展情况',
    moduleCaption: '创优活动开展情况',
    funcCode: 'S51F1334',
    configColumns: qualityExcellenceActivityColumns,
    displayColumns: ['national_association', 'specialty_association', 'group_company_awards', 'form_maker_name', 'form_make_time_str'],
  },
  // QC小组活动开展情况
  'qualityActivities/qualityQcActivity': {
    type: 'qualityQcActivity/getQualityQcActivity',
    exportType: 'qualityQcActivity/getQualityQcActivity',
    tableTitle: 'QC小组活动开展情况',
    moduleCaption: 'QC小组活动开展情况',
    funcCode: 'S51F1335',
    configColumns: qualityQcActivityColumns,
    displayColumns: ['qc_group_count', 'qc_activity_situation', 'qc_national_association', 'qc_specialty_association', 'qc_group_company_awards', 'form_maker_name', 'form_make_time_str'],
  },
  // 不合格项纠正措施记录
  'qualityDataAnalysis/qualityDataStatistics/qualityNcCorrectiveAction': {
    type: 'qualityNcCorrectiveAction/getQualityNcCorrectiveAction',
    exportType: 'qualityNcCorrectiveAction/getQualityNcCorrectiveAction',
    tableTitle: '不合格项纠正措施记录',
    moduleCaption: '不合格项纠正措施记录',
    funcCode: 'getQualityNcCorrectiveAction', // 该模块使用固定字符串
    configColumns: qualityNcCorrectiveActionColumns,
    displayColumns: [
      'up_wbs_name',
      'dep_name',
      'nc_name',
      'nc_code',
      'nc_nature',
      'occurrence_time_str',
      'occurrence_unit',
      'nc_reason',
      'corrective_action',
      'completion_time',
      'status',
      'form_maker_name',
      'form_make_time',
      'remark',
    ],
  },
  // 质量大(专项)检查主要不合格项汇总情况分布（表头表体）
  'qualityDataAnalysis/qualityDataStatistics/qualityInspectionSummary': {
    type: 'qualityInspectionSummary/getQualityInspectionSummary',
    exportType: 'qualityInspectionSummary/getQualityInspectionSummary',
    tableTitle: '质量大(专项)检查主要不合格项汇总情况分布',
    moduleCaption: '质量大(专项)检查主要不合格项汇总情况分布',
    funcCode: 'S51F1339',
    componentType: 'headerBody',
    configColumns: qualityInspectionSummaryColumns,
    headColumns: [
      'up_wbs_name',
      'dep_name',
      {
        title: '单据号',
        subTitle: '单据号',
        dataIndex: 'form_no',
        width: 160,
        align: 'center',
      },
      'form_maker_name',
      'form_make_time',
      'form_make_tz',
    ],
    bodyColumns: ['type_code_name', 'num', 'ratio_num'],
    header: {
      sort: 'form_no',
      order: 'desc',
      rowKey: 'form_no',
      type: 'qualityInspectionSummary/queryQualityInspectionSummaryHead',
      exportType: 'qualityInspectionSummary/queryQualityInspectionSummaryHead',
      importType: '',
    },
    scan: {
      sort: 'id',
      order: 'desc',
      rowKey: 'id',
      type: 'qualityInspectionSummary/queryQualityInspectionSummaryFlat',
      exportType: 'qualityInspectionSummary/queryQualityInspectionSummaryFlat',
      importType: '',
    },
  },
  // 月度焊接一次合格率统计表（表头表体）
  'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyWeldingPassRate': {
    type: 'qualityMonthlyWeldingPassRate/getQualityMonthlyWeldingPassRate',
    exportType: 'qualityMonthlyWeldingPassRate/getQualityMonthlyWeldingPassRate',
    tableTitle: '月度焊接一次合格率统计表',
    moduleCaption: '月度焊接一次合格率统计表',
    funcCode: 'S51F1340',
    componentType: 'headerBody',
    configColumns: qualityMonthlyWeldingPassRateColumns,
    headColumns: [
      'up_wbs_name',
      'dep_name',
      {
        title: '单据号',
        subTitle: '单据号',
        dataIndex: 'form_no',
        width: 160,
        align: 'center',
      },
      'form_maker_name',
      'form_make_time',
    ],
    bodyColumns: [
      'type_code_name',
      'rt_shots',
      'rt_pass',
      'rt_ratio',
      'ut_meters',
      'ut_pass',
      'ut_ratio',
      'pt_mt_tests',
      'pt_mt_pass',
      'pt_ratio',
      'tofd_meters',
      'tofd_pass',
      'tofd_ratio',
    ],
    header: {
      sort: 'form_no',
      order: 'desc',
      rowKey: 'form_no',
      type: 'qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateHead',
      exportType: 'qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateHead',
      importType: '',
    },
    scan: {
      sort: 'form_no',
      order: 'desc',
      rowKey: 'form_no',
      type: 'qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateFlat',
      exportType: 'qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateFlat',
      importType: '',
    },
  },
  // 质量事故汇总表
  'qualityDataAnalysis/qualityDataStatistics/qualityAccidentSummary': {
    type: 'qualityAccidentSummary/getQualityAccidentSummary',
    exportType: 'qualityAccidentSummary/getQualityAccidentSummary',
    tableTitle: '质量事故汇总表',
    moduleCaption: '质量事故汇总表',
    funcCode: 'getQualityAccidentSummary', // 该模块使用固定字符串
    configColumns: qualityAccidentSummaryColumns,
    displayColumns: ['up_wbs_name',
      'dep_name',
      'unit_leader_name',
      "supervising_leader_name",
      "office_phone",
      "quality_department",
      "responsible_person_name",
      "contact_phone_mobile",
      "accident_level",
      "accident_count",
      "total_direct_loss",
      "supervision_level",
      "nc_batches",
      'nc_batches1',
      'nc_batches2',
      {
        title: '附件',
        dataIndex: 'file_url',
        subTitle: '附件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      "form_maker_name",
      "form_make_time_str",],
  },
  // 质量数据统计表
  'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyQualityStatistics': {
    type: 'qualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics',
    exportType: 'qualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics',
    tableTitle: '质量数据统计表',
    moduleCaption: '质量数据统计表',
    funcCode: 'S51F1342',
    configColumns: qualityMonthlyQualityStatisticsColumns,
    displayColumns: ['month', 'form_maker_name', 'form_make_time_str'],
  },
  // 其它质量数据统计情况
  'qualityDataAnalysis/qualityOtherQualityStatistics': {
    type: 'qualityOtherQualityStatistics/getQualityOtherQualityStatistics',
    exportType: 'qualityOtherQualityStatistics/getQualityOtherQualityStatistics',
    tableTitle: '其它质量数据统计情况',
    moduleCaption: '其它质量数据统计情况',
    funcCode: 'S51F1343',
    configColumns: qualityOtherQualityStatisticsColumns,
    displayColumns: ['statistics_content', 'form_maker_name', 'form_make_time_str'],
  },
  // 质量统计数据分析情况
  'qualityDataAnalysis/qualityStatisticsAnalysis': {
    type: 'qualityStatisticsAnalysis/getQualityStatisticsAnalysis',
    exportType: 'qualityStatisticsAnalysis/getQualityStatisticsAnalysis',
    tableTitle: '质量统计数据分析情况',
    moduleCaption: '质量统计数据分析情况',
    funcCode: 'S51F1344',
    configColumns: qualityStatisticsAnalysisColumns,
    displayColumns: [
      'analysis',
      'measures',
      {
        title: '附件',
        dataIndex: 'file_url',
        subTitle: '附件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      'form_maker_name',
      'form_make_time_str'],

  },
  // 本月严重不合格品情况
  'criticalNonconformities/qualitySeriousNonconformities': {
    type: 'qualitySeriousNonconformities/getQualitySeriousNonconformities',
    exportType: 'qualitySeriousNonconformities/getQualitySeriousNonconformities',
    tableTitle: '本月严重不合格品情况',
    moduleCaption: '本月严重不合格品情况',
    funcCode: 'S51F1346',
    configColumns: qualitySeriousNonconformitiesColumns,
    displayColumns: ['month_situation', 'form_maker_name', 'form_make_time_str'],
  },
  // 质量事故情况
  'criticalNonconformities/qualityIncidentDetails': {
    type: 'qualityAccidentSummary/getQualityAccidentSummary',
    exportType: 'qualityAccidentSummary/getQualityAccidentSummary',
    tableTitle: '质量事故情况',
    moduleCaption: '质量事故情况',
    funcCode: 'S51F1347', // 使用质量事故汇总表的authority
    configColumns: qualityAccidentSummaryColumns,
    displayColumns: [
      'up_wbs_name',
      'dep_name',
      'unit_leader_name',
      "supervising_leader_name",
      "office_phone",
      "quality_department",
      "responsible_person_name",
      "contact_phone_mobile",
      "accident_level",
      "accident_count",
      "total_direct_loss",
      "supervision_level",
      "nc_batches",
      'nc_batches1',
      'nc_batches2',
      {
        title: '附件',
        dataIndex: 'file_url',
        subTitle: '附件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      "form_maker_name",
      "form_make_time_str",],
  },
  // 工作安排及建议
  'qualityWorkArrangement': {
    type: 'qualityWorkArrangement/getQualityManagementPlan',
    exportType: 'qualityWorkArrangement/getQualityManagementPlan',
    tableTitle: '工作安排及建议',
    moduleCaption: '工作安排及建议',
    funcCode: 'S51F1348',
    configColumns: qualityWorkArrangementColumns,
    displayColumns: ['next_month_plan', 'work_advice', 'coordination_issues', 'form_maker_name', 'form_make_time_str'],
  },
  // 质量经验分享
  'qualityExperience': {
    type: 'qualityExperience/getQualityExperience',
    exportType: 'qualityExperience/getQualityExperience',
    tableTitle: '质量经验分享',
    moduleCaption: '质量经验分享',
    funcCode: 'S51F1349',
    configColumns: qualityExperienceColumns,
    displayColumns: ['experience', {
      title: '附件',
      dataIndex: 'file_url',
      subTitle: '附件',
      align: 'center',
      width: 160,
      render: (text: any) => {
        if (text) {
          return (
            <Button
              onClick={() => window.open(getUrlCrypto(text))}
              size='small'
              type='link'
            >下载文件</Button>
          )
        }
        return ''
      }
    }, 'form_maker_name', 'form_make_time_str'],
  },
};

/**
 * 模块表格展示组件
 * 根据relativePath渲染对应的数据表格
 */
const ModuleTable: React.FC<any> = (props) => {
  const { relativePath, selectedRecord } = props;
  const actionRef: any = useRef();
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [detailRecord, setDetailRecord] = React.useState<any>(null);

  // 获取当前月份的过滤条件
  const currentMonth = selectedRecord?.month || moment().format('YYYY-MM');
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  // 获取当前路由前缀，用于动态调整funcCode
  const getRoutePrefix = () => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/subComp/')) return 'S';
    if (pathname.startsWith('/branchComp/')) return 'B';
    if (pathname.startsWith('/dep/')) return 'D';
    return 'S'; // 默认
  };

  // 获取表格配置
  const config = moduleTableConfig[relativePath];

  // 动态调整funcCode：如果funcCode以S开头，根据路由前缀替换
  const getFuncCode = () => {
    if (!config?.funcCode) return '';
    const routePrefix = getRoutePrefix();
    // 如果funcCode是固定字符串（不以S/B/D开头），直接返回
    if (!config.funcCode.startsWith('S') && !config.funcCode.startsWith('B') && !config.funcCode.startsWith('D')) {
      return config.funcCode;
    }
    // 如果是S开头的authority，根据路由前缀替换
    if (config.funcCode.startsWith('S')) {
      return config.funcCode.replace(/^S/, routePrefix);
    }
    return config.funcCode;
  };

  if (!config) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>未找到该模块的表格配置</p>
      </div>
    );
  }

  const detailComponentMap: any = {
    'overallQualityProducts/overallQualityProductsView': QualityProjectQualityOverviewDetail,
    'qualityDataAnalysis/qualityDataStatistics/qualityInspectionSummary': QualityInspectionSummaryDetail,
    'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyWeldingPassRate': QualityMonthlyWeldingPassRateDetail,
    'qualityDataAnalysis/qualityDataStatistics/qualityAccidentSummary': QualityAccidentSummaryDetail,
    'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyQualityStatistics': QualityMonthlyQualityStatisticsDetail,
  };

  const openDetail = (record: any) => {
    console.log(record, 'record');

    setDetailRecord(record);
    setDetailVisible(true);
  };

  /**
   * 生成表格列配置
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(config.configColumns);

    // 表头表体类型
    if (config.componentType === 'headerBody') {
      const headCols = (config.headColumns || []).map((col: any) => {
        if (typeof col === 'string') {
          // 分公司显示上级，非项目部显示部门
          if (col === 'up_wbs_name') {
            return propKey === 'branchComp' ? col : '';
          }
          return col;
        }
        // 针对特殊表，表头单据号可点击查看详情
        if (col.dataIndex === 'form_no') {
          return {
            ...col,
            render: (text: any, record: any) => (
              <a
                onClick={() => {
                  if (detailComponentMap[relativePath]) {
                    openDetail(record);
                  }
                }}
              >
                {text}
              </a>
            ),
          };
        }
        return col;
      });

      const bodyCols = config.bodyColumns || [];
      cols.initTableColumns(headCols);
      cols.initBodyTableColumns(bodyCols);
    } else {
      // 对于工程产品总体质量情况概述，需要特殊处理project_in_progress_name列，使其可点击打开详情
      if (relativePath === 'overallQualityProducts/overallQualityProductsView') {
        cols.initTableColumns([
          {
            title: "compinfo.project_in_progress_name",
            subTitle: "在建项目名称",
            dataIndex: "project_in_progress_name",
            width: 160,
            align: "center",
            render: (text: any, record: any) => {
              return text ? (
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(record);
                  }}
                >
                  {text}
                </a>
              ) : text;
            },
          },
          'major_quality_activities',
          'award_info',
          'form_maker_name',
          'form_make_time_str',
          'type_code_str',
        ]);
      } else if (detailComponentMap[relativePath]) {
        // 对需要详情的普通表，在首列加可点击
        const firstKey = config.displayColumns[0];
        const firstColConfig = config.configColumns.find((c: any) => c.dataIndex === firstKey);
        // 如果找不到配置，确保至少有一个有效的 title，避免 formatMessage 报错
        const firstCol = firstColConfig
          ? {
            ...firstColConfig,
            render: (text: any, record: any) => (
              <a
                onClick={() => {
                  openDetail(record);
                }}
              >
                {text}
              </a>
            ),
          }
          : {
            dataIndex: firstKey,
            title: firstColConfig?.title || `compinfo.${firstKey}`,
            subTitle: firstColConfig?.subTitle || firstKey,
            render: (text: any, record: any) => (
              <a
                onClick={() => {
                  openDetail(record);
                }}
              >
                {text}
              </a>
            ),
          };
        cols.initTableColumns([
          firstCol,
          ...config.displayColumns.slice(1),
        ]);
      } else {
        cols.initTableColumns(config.displayColumns);
      }
    }

    // 设置日期字段格式化
    cols.setTableColumnToDatePicker([
      { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      { value: 'check_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      { value: 'activity_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      { value: 'completion_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      { value: 'accident_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      { value: 'discovery_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
    ]);
    return cols.getNeedColumns();
  };

  const renderDetail = () => {
    const DetailComp = detailComponentMap[relativePath];
    if (!DetailComp || !detailVisible || !detailRecord) return null;
    return (
      <DetailComp
        open={detailVisible}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        selectedRecord={detailRecord}
        authority=""
        actionRef={actionRef}
      />
    );
  };

  const renderTable = () => {
    const commonFilters = [
      {
        Key: 'dep_code',
        Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
        Operator: 'like',
      },
      {
        Key: 'form_make_time_str',
        Val: currentMonth,
      },
    ];

    if (config.componentType === 'headerBody') {
      return (
        <BaseHeaderAndBodyTable
          cRef={actionRef}
          tableTitle={config.tableTitle}
          caption={config.moduleCaption}
          tableColumns={getTableColumns()}
          header={config.header}
          scan={config.scan}
          funcCode={getFuncCode()}
          buttonToolbar={() => []}
          selectedRowsToolbar={() => ({
            headerToolbar: () => [],
            scanToolbar: () => [],
          })}
          tableDefaultFilter={commonFilters}
          scroll={{ y: 'calc(100vh - 350px)' }}
          height="calc(100vh - 350px)"
          onRowClick={(record: any) => {
            if (detailComponentMap[relativePath]) {
              openDetail(record);
            }
          }}
        />
      );
    }

    return (
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={config.tableTitle}
        moduleCaption={config.moduleCaption}
        type={config.type}
        exportType={config.exportType}
        tableColumns={getTableColumns()}
        funcCode={getFuncCode()}
        tableSortOrder={{ sort: 'form_make_time_str', order: 'desc' }}
        tableDefaultFilter={commonFilters}
        buttonToolbar={() => []}
        selectedRowsToolbar={() => []}
        scroll={{ y: 'calc(100vh - 350px)' }}
        height="calc(100vh - 350px)"
        onRowClick={(record: any) => {
          if (detailComponentMap[relativePath]) {
            openDetail(record);
          }
        }}
      />
    );
  };

  return (
    <div style={{ height: '100%' }}>
      {renderTable()}
      {renderDetail()}
    </div>
  );
};

export default connect()(ModuleTable);
