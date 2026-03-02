import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Space, Table, TableProps } from 'antd';
import { connect, useLocation, history } from 'umi';
import { hasPermission } from '@/utils/authority';
import AnnualAssessmentDetail from "./Detail";
import AnnualAssessmentAdd from "./Add";
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ToDoListAdd from '../ToDoListAdd';
// 定义接口：后台返回的原始数据类型
interface RawRiskData {
  main_id: number;
  wbs_code: string;
  report_name: string;
  post_name: string;
  weight: number;
  create_date: number;
  create_by: string;
  create_by_name: string;
  update_date: number;
  update_by: string;
  update_by_name: string;
  risk_name: string;
  wbs_name: string | null;
  id: number;
  config_id: number;
  possibility_score: number;
  influence_score: number;
  create_date_str: string;
  update_date_str: string;
  RowNumber: number;
}

// 定义接口：分组后的人员数据类型
interface StaffRiskData {
  key: number;
  index: number;
  main_id: number;
  report_name: string;
  post_name: string;
  weight: number;
  wbs_code: string;
  wbs_name: string | null;
  riskScores: Record<string, { possibility: number; influence: number }>;
}


const RiskAssessmentTable: React.FC = (props: any) => {
  const { dispatch, route: { authority, name } } = props;
  const location = useLocation();
  const queryType = location?.query?.type;

  const [tableData, setTableData] = useState<StaffRiskData[]>([]);
  const [tableColumns, setTableColumns] = useState<TableProps<StaffRiskData>['columns']>([]);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [queryParamsType, setQueryParamsType] = useState("");
  const [loading, setLoading] = useState(false)
  const [addToDoVisible, setAddToDoVisible] = useState(false);


  /**
   * 处理代办事项提示是否展示
   */
  useEffect(() => {
    if (queryType) {
      setQueryParamsType(queryType)
    } else {
      setQueryParamsType("")
    }
  }, [queryType])



  /**
   * 将后台数据处理从table数据
   */
  const handleTableData = (mockApiData: RawRiskData[]) => {
    // 1. 提取所有唯一风险项
    const uniqueRisks = Array.from(new Set(mockApiData.map(item => item.risk_name))).reverse();

    // 2. 按人员main_id分组数据
    const groupedStaffData = mockApiData.reduce((acc, item) => {
      const staffKey = item.main_id;
      if (!acc[staffKey]) {
        acc[staffKey] = {
          main_id: item.main_id,
          report_name: item.report_name,
          post_name: item.post_name,
          weight: item.weight,
          wbs_code: item.wbs_code,
          wbs_name: item.wbs_name,
          riskScores: {},
        };
      }
      // 存储当前风险的可能性+影响程度
      acc[staffKey].riskScores[item.risk_name] = {
        possibility: item.possibility_score,
        influence: item.influence_score,
      };
      return acc;
    }, {} as Record<number, Omit<StaffRiskData, 'key' | 'index'>>);

    // 3. 构造表头（实现风险名称的列合并）
    const columns: TableProps<StaffRiskData>['columns'] = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        align: "center",
        fixed: "left"
      },
      {
        title: '单位(部门)',
        dataIndex: 'wbs_code',
        key: 'wbs_code',
        width: 160,
        align: "center",
        fixed: "left",
        render: (text: any, record: any) => {
          return record.wbs_name || ""
        }
      },
      {
        title: '姓名',
        dataIndex: 'report_name',
        key: 'report_name',
        width: 120,
        align: "center",
        fixed: "left",
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '职务',
        dataIndex: 'post_name',
        key: 'post_name',
        width: 100,
        fixed: "left",
        align: "center"
      },
      {
        title: '权重',
        dataIndex: 'weight',
        key: 'weight',
        width: 80,
        fixed: "left",
        align: "center"
      },
      // 动态生成风险项的“合并表头”
      ...uniqueRisks.map(riskName => ({
        title: riskName,
        key: riskName,
        // 合并列：每个风险对应2列（可能性+影响程度）
        children: [
          {
            title: '发生可能性',
            key: `${riskName}_possibility`,
            align: "center",
            render: (_: unknown, record: StaffRiskData) =>
              record.riskScores[riskName]?.possibility || '-',
            width: 100,
          },
          {
            title: '影响程度',
            key: `${riskName}_influence`,
            align: "center",
            render: (_: unknown, record: StaffRiskData) =>
              record.riskScores[riskName]?.influence || '-',
            width: 100,
          },
        ],
      })),
    ];

    // 4. 处理最终表格数据（添加key和序号）
    const finalData = Object.values(groupedStaffData)
      .sort((a, b) => b.main_id - a.main_id)
      .map((item, index) => ({
        ...item,
        key: item.main_id,
        index: index + 1,
      }));

    setTableData(finalData);
    setTableColumns(columns);
  }

  /**
   * 获取table数值
   */
  const getTableData = () => {
    setLoading(true)
    dispatch({
      type: "annualAssessment/getInfo",
      payload: {
        sort: 'main_id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'create_date_str', Val: new Date().getFullYear() + "%", Operator: 'like' }
        ])
      },
      callback: (res: any) => {
        const result = res?.rows || []
        handleTableData(result as RawRiskData[])
        setLoading(false)
      },
    });
  }


  useEffect(() => {
    getTableData()
  }, [])

  return (
    <div style={{ padding: 8 }}>
      {queryParamsType && <Alert type='info' message="你有一条待办任务需要填报，点击新增按钮进行填报" />}

      <Table
        loading={loading}
        title={() => (
          <Row
            justify="space-between"
            align="middle"
            style={{
              padding: '12px 16px',
              background: '#fff',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 4, height: 16, backgroundColor: '#1890ff', borderRadius: 2 }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
                  {name || "公司年度重大经营风险评估打分表"}
                </span>
              </div>
            </Col>

            <Col>
              <Space size="middle">
                {/* 只有在 queryParamsType 存在时才渲染新增按钮 */}
                {queryParamsType && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setAddVisible(true)}
                  >
                    新增
                  </Button>
                )}
                <Button
                  style={{ display: hasPermission(authority, '新增待办任务') ? 'inline' : 'none' }}
                  type="primary"
                  onClick={() => {
                    setAddToDoVisible(true)
                  }}
                >
                  新增待办任务
                </Button>

                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => getTableData()}
                >
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        )}
        columns={tableColumns}
        dataSource={tableData}
        bordered
        scroll={{ x: 'max-content', y: "calc(100vh - 350px)" }}
        pagination={false}
        size="middle"
      />

      {open && selectedRecord && (
        <AnnualAssessmentDetail
          open={open}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            getTableData()
          }}
        />
      )}

      {addVisible && (
        <AnnualAssessmentAdd
          queryParamsType={queryParamsType}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            history.replace({
              pathname: location.pathname,
              query: {},
            });

            setAddVisible(false);
            getTableData()
          }}
        />
      )}

      {addToDoVisible && (
        <ToDoListAdd
          hasReportingTime={true}
          funcCode="D51F904"
          title="新增年度重大经营风险评估待办任务"
          visible={addToDoVisible}
          onCancel={() => setAddToDoVisible(false)}
          callbackSuccess={() => {
            setAddToDoVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default connect()(RiskAssessmentTable);