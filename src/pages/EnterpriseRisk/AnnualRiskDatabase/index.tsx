import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Row, Space, Table, TableProps, Typography } from 'antd';
import { connect } from 'umi';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import AnnualAssessmentDetail from "./Detail";

const { Text } = Typography;

/**
 * 公司年度重大经营风险评估数据库
 * @param props 
 * @returns 
 */
const AnnualRiskDatabase: React.FC = (props: any) => {
  const { dispatch, route: { name } } = props;

  const [tableData, setTableData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string | null>(null);

  /**
   * 处理数据：按 main_id 合并
   */
  const handleTableData = (data: any[]) => {
    const uniqueData = new Map();
    data.forEach(item => {
      if (!uniqueData.has(item.main_id)) {
        uniqueData.set(item.main_id, item);
      }
    });

    const finalData = Array.from(uniqueData.values()).map((item, index) => ({
      ...item,
      key: item.main_id,
      index: index + 1,
    }));
    setTableData(finalData);
  };

  const getTableData = () => {
    // if (!year) return;
    setLoading(true);
    dispatch({
      type: "annualAssessment/getInfo",
      payload: {
        sort: 'main_id',
        order: 'desc',
        filter: JSON.stringify([
          year ? { Key: 'create_date_str', Val: year + "%", Operator: 'like' } : null
        ].filter(Boolean))
      },
      callback: (res: any) => {
        handleTableData(res?.rows || []);
        setLoading(false);
      },
    });
  };

  //初始化请求
  useEffect(getTableData, [])

  const columns: TableProps<any>['columns'] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: "center"
    },
    {
      title: '单位(部门)',
      dataIndex: 'wbs_name',
      key: 'wbs_name',
      width: 160,
      align: "center",
      render: (text: string, record: any) => `${text || ""}`
    },
    {
      title: '姓名',
      dataIndex: 'report_name',
      key: 'report_name',
      align: "center",
      width: 160,
      render: (text: string, record: any) => (
        <a onClick={() => { setSelectedRecord(record); setOpen(true); }}>{text}</a>
      )
    },
    {
      title: '职务',
      dataIndex: 'post_name',
      key: 'post_name',
      width: 160,
      align: "center"
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
      align: "center"
    },
    {
      title: '创建日期',
      dataIndex: 'create_date_str',
      key: 'create_date_str',
      align: "center",
      width: 160,
    }
  ];

  return (
    <div style={{ padding: 12 }}>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        size="middle"
        scroll={{ y: 'calc(100vh - 240px)' }}
        title={() => (
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <div style={{ width: 4, height: 16, backgroundColor: '#1890ff', borderRadius: 2 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'rgba(0,0,0,0.85)'
                  }}
                >
                  {name}
                </Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <DatePicker
                  style={{
                    width: 200
                  }}
                  picker="year"
                  placeholder="选择年份"
                  onChange={(_, str) => setYear(str as string)}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={getTableData}>搜索</Button>
                <Button icon={<ReloadOutlined />} onClick={getTableData}>刷新</Button>
              </Space>
            </Col>
          </Row>
        )}
      />

      {open && selectedRecord && (
        <AnnualAssessmentDetail
          open={open}
          selectedRecord={selectedRecord}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default connect()(AnnualRiskDatabase);