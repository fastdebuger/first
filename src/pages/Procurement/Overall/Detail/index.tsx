import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Tabs, Descriptions, Typography, Tag, Modal, Button } from 'antd';
import { connect } from 'umi';
import '../index.less';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import BaseHeaderAndBodyTable from '@/components/BaseHeaderAndBodyTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns as scheduleConfigColumns } from '@/pages/Procurement/ProcurementSchedule/columns';
import PurchaseStrategyScheduleDetail from '@/pages/Procurement/ProcurementSchedule/Detail';
import {
  materialsColumns,
  serviceColumns,
  subcontractColumns,
} from '@/pages/Procurement/PurchaseStrategyLotPlan/columns';
import PurchaseStrategyLotPlanDetail from '@/pages/Procurement/PurchaseStrategyLotPlan/Detail';

const { Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * 物资及服务总体采购策略 - 详情展示
 * 根据表格截图设计的10个sheet展示
 * @param props
 * @param props.open - 是否显示Modal
 * @param props.onClose - 关闭Modal的回调
 * @param props.selectedRecord - 选中的记录
 */
const PurchaseStrategyDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, authority } = props;
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [lotPlanModalOpen, setLotPlanModalOpen] = useState(false);

  if (!selectedRecord) {
    return null;
  }

  const record = selectedRecord;
  const modalBodyHeight = 'calc(100vh - 220px)';

  const RelatedScheduleTable: React.FC<{ mainFormNo: string }> = ({ mainFormNo }) => {
    const tableRef = useRef<any>();
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState<any>(null);

    const tableColumns = useMemo(() => {
      const cols = new BasicTableColumns(scheduleConfigColumns);
      cols.initTableColumns([
        'topic_name',
        {
          title: 'compinfo.lot_name',
          subTitle: '单个标段名称',
          dataIndex: 'lot_name',
          width: 160,
          align: 'center',
          render: (text: any, row: any) => {
            return (
              <a
                onClick={() => {
                  setDetailRecord(row);
                  setDetailOpen(true);
                }}
              >
                {text}
              </a>
            );
          },
        },
        'lot_no',
        'site_demand_time_str',
        'procurement_method_str',
        'plan_approve_time_str',
        'doc_prepare_time_str',
        'tech_eval_time_str',
        'comm_eval_time_str',
        'loa_time_str',
        'po_time_str',
        'procurement_wbs_code',
      ]);
      return cols.getNeedColumns();
    }, []);

    return (
      <>
        <BaseCurdSingleTable
          cRef={tableRef}
          rowKey="form_no"
          tableTitle="采购进度计划"
          moduleCaption="采购进度计划"
          type="purchaseStrategySchedule/getPurchaseStrategySchedule"
          exportType="purchaseStrategySchedule/getPurchaseStrategySchedule"
          importType=""
          tableColumns={tableColumns}
          tableSortOrder={{ sort: 'site_demand_time', order: 'desc' }}
          buttonToolbar={() => []}
          selectedRowsToolbar={() => []}
          rowSelection={null}
          funcCode={`${authority || 'overall'}-overall-detail-schedule-${mainFormNo || ''}`}
          tableDefaultFilter={[{ Key: 'main_form_no', Val: mainFormNo, Operator: '=' }]}
          height="100%"
          scroll={{ y: 'calc(100% - 220px)' }}
        />
        {detailOpen && detailRecord && (
          <PurchaseStrategyScheduleDetail
            open={detailOpen}
            selectedRecord={detailRecord}
            authority={authority}
            onClose={() => setDetailOpen(false)}
          />
        )}
      </>
    );
  };

  const RelatedLotPlanTable: React.FC<{ mainFormNo: string }> = ({ mainFormNo }) => {
    const actionRef = useRef<any>();
    const [activeTab, setActiveTab] = useState<string>('0'); // 原有页面的0/1/2 tab
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState<any>(null);

    const baseColumns = useMemo(() => {
      return activeTab === '1' ? subcontractColumns : activeTab === '2' ? serviceColumns : materialsColumns;
    }, [activeTab]);

    const tableColumns = useMemo(() => {
      const cols = new BasicTableColumns(baseColumns);
      cols
        .initTableColumns([
          {
            title: '标段编号',
            subTitle: '标段编号',
            dataIndex: 'lot_no',
            width: 160,
            align: 'center',
            render: (text: any, row: any) => {
              return (
                <a
                  onClick={() => {
                    setDetailRecord(row);
                    setDetailOpen(true);
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          'lot_name',
          'lot_category',
          'package_type',
          'materials_type_str',
          'is_owner_controlled_str',
          'control_level_str',
          'rfq_no',
          'cost_control_range',
          'item_code',
          'material_grade_str',
          'is_sub_allowed',
          'sub_allowed_reason',
          'source_reason_desc',
          'legal_basis',
          'method_summary_technology',
          'method_summary_total',
          'site_demand_time_str',
          'delivery_terms_dom',
          'delivery_terms_intl',
          'payment_terms',
          'guarantee_prepay',
          'guarantee_perf',
          'guarantee_quality',
          'warranty_period_req',
          'disqualify_criteria',
          'other_elements',
          'remark',
        ])
        .initBodyTableColumns([
          'supplier_name',
          'supplier_source',
          'supplier_reg_addr',
          'origin_requirement',
          'supplier_code',
          'supplier_category',
          'procurement_method_str',
          'eval_method_str',
          'lot_division',
          'proposed_qty',
          'currency',
          'purchase_obs_code',
        ])
        .setTableColumnToDatePicker([{ value: 'site_demand_time', valueType: 'dateTs', format: 'YYYY-MM-DD' }]);
      return cols.getNeedColumns();
    }, [baseColumns]);

    useEffect(() => {
      if (!actionRef.current || !mainFormNo) return;
      // 与原有页面一致：tab过滤lot_category，同时额外加main_form_no过滤
      actionRef.current.reloadTable([
        { Key: 'main_form_no', Val: mainFormNo, Operator: '=' },
        { Key: 'lot_category', Val: activeTab, Operator: '=' },
      ]);
    }, [activeTab, mainFormNo]);

    const renderSelfToolbar = () => {
      return (
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          type="card"
          style={{ marginBottom: 0 }}
        >
          <Tabs.TabPane tab="工程物资" key="0" />
          <Tabs.TabPane tab="工程分包" key="1" />
          <Tabs.TabPane tab="工程服务" key="2" />
        </Tabs>
      );
    };

    const titlePrefix = activeTab === '1' ? '工程分包' : activeTab === '2' ? '工程服务' : '工程物资';

    return (
      <>
        <BaseHeaderAndBodyTable
          cRef={actionRef}
          tableTitle={`${titlePrefix}单个标段策划方案`}
          caption={`${titlePrefix}单个标段策划方案`}
          header={{
            sort: 'form_no',
            order: 'desc',
            rowKey: 'form_no',
            type: 'purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanHead',
            exportType: 'purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanHead',
            importType: '',
          }}
          scan={{
            sort: 'form_no',
            order: 'desc',
            rowKey: 'form_no',
            type: 'purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanFlat',
            exportType: 'purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanFlat',
            importType: '',
          }}
          // body不传，保持与原页面一致（默认展示header/scan）
          tableColumns={tableColumns}
          buttonToolbar={() => []}
          selectedRowsToolbar={() => ({ headerToolbar: () => [], scanToolbar: () => [] })}
          renderSelfToolbar={renderSelfToolbar}
          funcCode={`${authority || 'overall'}-overall-detail-lotPlan-${activeTab}`}
          height="100%"
          scroll={{ y: 'calc(100% - 300px)' }}
          defaultPageSize={20}
          tableDefaultFilter={[{ Key: 'main_form_no', Val: mainFormNo, Operator: '=' },{"Key":"lot_category","Val":"0","Operator":"="}]}
        />
        {detailOpen && detailRecord && (
          <PurchaseStrategyLotPlanDetail
            authority={authority}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            selectedRecord={detailRecord}
            actionRef={actionRef}
            activeTab={activeTab}
          />
        )}
      </>
    );
  };

  // Sheet1: 基本信息
  const renderBasicInfo = () => {
    return (
      <Card title="基本信息" bordered={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="提报单位" span={2}>
            {record.wbs_name || record.wbs_code || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目属地">
            {record.project_loc_type_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="报告类别">
            {record.report_category_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="预审编号">
            {record.pre_audit_no || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="决策会">
            {record.decision_meeting_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="批次">
            {record.batch_number || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="议题名称" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0 }}
            >
              {record.topic_name || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet2: 目的
  const renderPurpose = () => {
    return (
      <Card title="目的" bordered={false}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="向公司招标委员会报送+议题名称">
            <Paragraph
              ellipsis={{ rows: 10, expandable: true, symbol: '展开' }}
              style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
            >
              {record.submit_target_topic || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet3: 项目背景描述
  const renderProjectBackground = () => {
    return (
      <Card title="项目背景描述" bordered={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="项目概述" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0 }}
            >
              {record.project_overview || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="项目名称">
            {record.project_name || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="涉密">
            {record.is_confidential_str && record.is_confidential_str !== '/' ? (
              record.is_confidential_str === '是' ? <Tag color="red">是</Tag> : <Tag>否</Tag>
            ) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目级别">
            {record.project_level_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目编号">
            {record.project_code || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="业主名称">
            {record.owner_name || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目属性" span={2}>
            {record.project_attr_str && record.project_attr_str !== '/' ? (
              <Tag>{record.project_attr_str}</Tag>
            ) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="设计单位">
            {record.design_unit || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="监理单位">
            {record.supervision_unit || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程概述" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0 }}
            >
              {record.eng_summary || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="中交时间">
            {record.handover_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="竣工时间">
            {record.completion_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="执行策略批复时间">
            {record.strat_reply_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="执行策略批复机构">
            {record.strat_reply_org || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="执行策略备案时间">
            {record.strat_filing_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目执行策略中对物资采购的策划描述及风险描述" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.risk_desc || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="工程合同总金额（万）">
            {record.contract_total_amt || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程分包总采购规模">
            {record.sub_proc_scale || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程物资总采购规模">
            {record.mat_proc_scale || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程服务总采购规模">
            {record.srv_proc_scale || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="议题上会依据" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.meeting_basis || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="获得工程项目的方式">
            {record.obtain_method_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="承包方式">
            {record.contract_mode_str || '/'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet4: 项目预算概述
  const renderProjectBudget = () => {
    return (
      <Card title="项目预算概述" bordered={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="项目级别">
            {record.project_level_str && record.project_level_str !== '/' ? (
              <Tag>{record.project_level_str}</Tag>
            ) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目预算审批权">
            {record.project_auth_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目预算报审情况-编制时间">
            {record.project_create_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目预算报审情况-提交时间">
            {record.project_submit_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目预算批复情况">
            {record.project_approval_status_str ? (
              <Tag color={record.project_approval_status_str === '已批复' ? 'green' : 'default'}>
                {record.project_approval_status_str}
              </Tag>
            ) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="项目预算批复日期">
            {record.project_time_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程总包预算(万)">
            {record.total_invest_amt ? String(record.total_invest_amt) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="分包总预算占比">
            {record.sub_budget_ratio ? `${record.sub_budget_ratio}%` : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程物资总预算(万)">
            {record.mat_budget_amt ? String(record.mat_budget_amt) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="物资总预算占比">
            {record.mat_budget_ratio ? `${record.mat_budget_ratio}%` : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="工程服务总预算(万)">
            {record.srv_budget_amt ? String(record.srv_budget_amt) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="服务总预算占比">
            {record.srv_budget_ratio ? `${record.srv_budget_ratio}%` : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="税率">
            {record.tax_rate ? `${record.tax_rate}%` : '/'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet5: 主合同条款要点
  const renderMainContractClauses = () => {
    return (
      <Card title="主合同条款要点" bordered={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="选商要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.select_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="质量要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.quality_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="原产地要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.origin_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="业主及相关方参与采购过程方面的要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.owner_part_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="合同类型">
            {record.contract_type_str || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="合同币种">
            {record.currency_type || '/'}
          </Descriptions.Item>
          <Descriptions.Item label="质保期要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.warranty_period_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="ICV要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.icv_req || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet6: 选商规则
  const renderSupplierSelectionRules = () => {
    return (
      <Card title="选商规则" bordered={false}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="选商规则">
            <Paragraph
              ellipsis={{ rows: 15, expandable: true, symbol: '展开' }}
              style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
            >
              {record.select_rule_content || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet7: 评审规则
  const renderReviewRules = () => {
    return (
      <Card title="评审规则" bordered={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="技术评审通用规则" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.tech_eval_rule || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="商务评审通用规则" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.biz_eval_rule || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="技术评审特殊要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.tech_special_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="商务评审特殊要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.biz_special_req || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="招标采购专家组成员来源" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.expert_source || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="非招标评审小组成员来源" span={2}>
            <Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.non_bid_team_src || '/'}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="招标评审小组成员最低资格要求" span={2}>
            <Paragraph
              ellipsis={{ rows: 5, expandable: true, symbol: '展开' }}
              style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
            >
              {record.non_bid_team_qual || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet8: 单个采购包策划方案
  const renderSingleProcurementPackage = () => {
    return (
      <Card title="单个采购包策划方案" bordered={false}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="采购进度计划">
            <a
              onClick={() => {
                setScheduleModalOpen(true);
              }}
            >
              查看
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="单个标段策划方案">
            <a
              onClick={() => {
                setLotPlanModalOpen(true);
              }}
            >
              查看
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet9: 采购计划数量增减(正负)变更策划方案
  const renderProcurementPlanChange = () => {
    return (
      <Card title="采购计划数量增减变更策划方案" bordered={false}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="采购计划数量增减变更策划">
            <Paragraph
              ellipsis={{ rows: 15, expandable: true, symbol: '展开' }}
              style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
            >
              {record.qty_change_plan || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Sheet10: 下一步工作实施方案
  const renderNextStepsImplementation = () => {
    return (
      <Card title="下一步工作实施方案" bordered={false}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="下一步工作实施方案">
            <Paragraph
              ellipsis={{ rows: 15, expandable: true, symbol: '展开' }}
              style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
            >
              {record.next_step_plan || '/'}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  return (
    <>
      <Modal
        title="物资及服务总体采购策略 - 详情展示"
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            关闭
          </Button>,
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        <div className="purchase-strategy-display">
          <Tabs type="card" defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <div className="tab-content">{renderBasicInfo()}</div>
            </TabPane>
            <TabPane tab="目的" key="2">
              <div className="tab-content">{renderPurpose()}</div>
            </TabPane>
            <TabPane tab="项目背景描述" key="3">
              <div className="tab-content">{renderProjectBackground()}</div>
            </TabPane>
            <TabPane tab="项目预算概述" key="4">
              <div className="tab-content">{renderProjectBudget()}</div>
            </TabPane>
            <TabPane tab="主合同条款要点" key="5">
              <div className="tab-content">{renderMainContractClauses()}</div>
            </TabPane>
            <TabPane tab="选商规则" key="6">
              <div className="tab-content">{renderSupplierSelectionRules()}</div>
            </TabPane>
            <TabPane tab="评审规则" key="7">
              <div className="tab-content">{renderReviewRules()}</div>
            </TabPane>
            <TabPane tab="单个采购包策划方案" key="8">
              <div className="tab-content">{renderSingleProcurementPackage()}</div>
            </TabPane>
            <TabPane tab="采购计划数量增减变更策划方案" key="9">
              <div className="tab-content">{renderProcurementPlanChange()}</div>
            </TabPane>
            <TabPane tab="下一步工作实施方案" key="10">
              <div className="tab-content">{renderNextStepsImplementation()}</div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>

      <Modal
        title="采购进度计划"
        open={scheduleModalOpen}
        onCancel={() => setScheduleModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setScheduleModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width="95%"
        style={{ top: 20 }}
        destroyOnClose
        bodyStyle={{ padding: 12, height: modalBodyHeight, overflow: 'hidden' }}
      >
        <div style={{ height: '100%' }}>
          <RelatedScheduleTable mainFormNo={record.form_no} />
        </div>
      </Modal>

      <Modal
        title="单个标段策划方案"
        open={lotPlanModalOpen}
        onCancel={() => setLotPlanModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setLotPlanModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width="95%"
        style={{ top: 20 }}
        destroyOnClose
        bodyStyle={{ padding: 12, height: modalBodyHeight, overflow: 'hidden' }}
      >
        <div style={{ height: '100%' }}>
          <RelatedLotPlanTable mainFormNo={record.form_no} />
        </div>
      </Modal>
    </>
  );
};

export default connect()(PurchaseStrategyDetail);
