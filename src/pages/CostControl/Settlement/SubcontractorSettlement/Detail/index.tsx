import React, { useState, useEffect } from 'react';
import { Table, Tag, Tabs, Spin } from 'antd';
import { configColumns } from '../columns';
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import { connect } from 'umi';
import AddExpenditureContract from '@/components/AddExpenditureContract';

const { CrudQueryDetailDrawer } = SingleTable;
const { TabPane } = Tabs;

const SubcontractorSettlementDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, dispatch } = props;
  const [activeTab, setActiveTab] = useState('approval');
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  // 当切换到统计说明 Tab 时，开始 loading
  useEffect(() => {
    if (activeTab === 'statistics' && selectedRecord) {
      setStatisticsLoading(true);
      // 设置一个延迟来关闭 loading，给组件足够的时间加载数据
      const timer = setTimeout(() => {
        setStatisticsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setStatisticsLoading(false);
    }
  }, [activeTab, selectedRecord]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "branch_comp_name",
      "dep_name",
      'contract_name',
      "contract_no",
      "contract_out_name",
      "contract_sign_date_str",
      "contract_start_date_str",
      "contract_end_date_str",
      "contract_say_price",
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 生成结算审核数据
   * @param record 当前记录
   * @returns 结算审核数据数组
   */
  const generateSettlementData = (record: any) => {
    if (!record) return [];

    const settlementData = [];

    // 项目部审核（后台已改为空字符串替代null）
    if (record.report_amount1 !== undefined && record.report_amount1 !== '') {
      settlementData.push({
        key: 1,
        settlementLevel: '项目部审核',
        reportAmount: record.report_amount1 || '-',
        approvalAmount: record.approval_amount1 || '-',
        approvalDate: record.approval_date_str1 || '-',
        approvalSchedule: record.approval_schedule1_str || '暂无审批',
      });
    }

    // 预结算费控中心审核（后台已改为空字符串替代null）
    if (record.report_amount2 !== undefined && record.report_amount2 !== '') {
      settlementData.push({
        key: 2,
        settlementLevel: '预结算费控中心审核',
        reportAmount: record.report_amount2 || '-',
        approvalAmount: record.approval_amount2 || '-',
        approvalDate: record.approval_date_str2 || '-',
        approvalSchedule: record.approval_schedule2_str || '暂无审批',
      });
    }

    // 华中审计审核（后台已改为空字符串替代null）
    if (record.report_amount3 !== undefined && record.report_amount3 !== '') {
      settlementData.push({
        key: 3,
        settlementLevel: '华中审计审核',
        reportAmount: record.report_amount3 || '-',
        approvalAmount: record.approval_amount3 || '-',
        approvalDate: record.approval_date_str3 || '-',
        approvalSchedule: record.approval_schedule3_str || '暂无审批',
      });
    }

    return settlementData;
  };

  /**
   * 结算审核表格列配置
   * @returns
   */
  const getSettlementTableColumns = () => {
    return [
      {
        title: '审核级别',
        dataIndex: 'settlementLevel',
        key: 'settlementLevel',
        width: 180,
        align: 'center' as const,
      },
      {
        title: '上报金额（元）',
        dataIndex: 'reportAmount',
        key: 'reportAmount',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '审核金额（元）',
        dataIndex: 'approvalAmount',
        key: 'approvalAmount',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '审批日期',
        dataIndex: 'approvalDate',
        key: 'approvalDate',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '审批进度',
        dataIndex: 'approvalSchedule',
        key: 'approvalSchedule',
        width: 150,
        align: 'center' as const,
        render: (text: any) => {
          if (text === '审批完成' || text === '已审批完成') {
            return <Tag color={'success'}>{text}</Tag>
          } else if (text === '驳回') {
            return <Tag color={'error'}>{text}</Tag>
          } else if (text === '未审批') {
            return <Tag color={'warning'}>{text}</Tag>
          } else if (text === '审批中') {
            return <Tag color={'processing'}>{text}</Tag>
          } else {
            return <Tag color={'default'}>{text || '暂无审批'}</Tag>
          }
        },
      },
    ];
  };

  // 生成结算审核数据
  const settlementData = generateSettlementData(selectedRecord);

  const renderButtonToolbar = () => {
    return [];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_name"
        title="分包合同结算详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 16 }}>
          <TabPane tab="审核详情" key="approval">
            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 16 }}>分包合同结算审核详情</h3>
              <Table
                columns={getSettlementTableColumns()}
                dataSource={settlementData}
                pagination={false}
                size="small"
                bordered
                scroll={{ y: 'calc(100vh - 520px)' }}
              />
            </div>
          </TabPane>
          <TabPane tab="统计说明" key="statistics">
            <Spin spinning={statisticsLoading} tip="加载中...">
              <div style={{ marginTop: 16, minHeight: 200 }}>
                <AddExpenditureContract
                  record={null}
                  dispatch={dispatch}
                  selectedRows={{
                    out_info_id: selectedRecord?.out_info_id || '',
                    form_no: selectedRecord?.form_no || ''
                  }}
                  isReadonly={true}
                  progressType={'subcontractorProgress/querySubProgressPaymentBody'}
                  visaType={'visaSub/querySubEngineeringVisa'}
                  showEmptyState={true}
                />
              </div>
            </Spin>
          </TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(SubcontractorSettlementDetail);

