import { INFLUENCE_OPTIONS, POSSIBILITY_OPTIONS } from '@/common/common';
import { Select, Table, Typography, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { connect } from 'umi';

const { Text } = Typography;

const QuestionnaireRating: React.FC<any> = (props, ref: React.Ref<unknown>) => {
  const { dispatch, main_id, isDetail = false } = props;
  const [flatData, setFlatData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [baseInfo, setBaseInfo] = useState<any>({});

  /**
   * 动态计算 rowSpan 的核心算法：适配新增（扁平数组）与编辑（嵌套树形）
   * 逻辑：将不同格式的原始数据打平，并计算出一级风险和二级风险名称需要合并的行数
   */
  const processData = (resResult: any) => {
    let tree: any[] = [];

    // 1. 数据格式标准化：确保 tree 始终是包含 config_list 的数组结构
    if (main_id) {
      // 编辑模式：resResult 通常是包含 config_list 的对象或数组
      tree = Array.isArray(resResult) ? resResult : [resResult];
    } else {
      // 新增模式：resResult 是纯扁平数组，需根据 parent_id 归类到 risk_type=1 下
      tree = resResult.reduce((acc: any[], item: any) => {
        if (item.risk_type === 1) {
          acc.push({ ...item, config_list: [] });
        } else {
          const p = acc.find(parent => parent.id === item.parent_id);
          if (p) {
            p.config_list = p.config_list || [];
            p.config_list.push(item);
          }
        }
        return acc;
      }, []);
    }

    // 2. 打平数据并计算 rowSpan（用于 Table 单元格合并）
    const flat: any[] = [];
    tree.forEach((parent: any, pIdx: number) => {
      const children = parent.config_list || [{}];

      // 局部计数器：计算当前一级风险范围内，相同二级风险名称出现的次数
      const subNameCounts: { [key: string]: number } = {};
      children.forEach((c: any) => {
        const name = c.risk_name || '';
        subNameCounts[name] = (subNameCounts[name] || 0) + 1;
      });

      const seenSubNames = new Set();

      children.forEach((child: any, cIdx: number) => {
        const subName = child.risk_name || '';
        let sRowSpan = 0;

        // 二级风险合并逻辑：同一组内第一次出现的名称，rowSpan = 出现的总次数
        if (!seenSubNames.has(subName)) {
          sRowSpan = subNameCounts[subName];
          seenSubNames.add(subName);
        }

        flat.push({
          ...child,
          parent_origin: parent, // 保留父节点原始引用，方便提交时取 ID
          p_id: parent.id,
          p_name: parent.risk_name,
          p_definition: parent.risk_definition,
          p_possibility: parent.possibility_score,
          p_influence: parent.influence_score,
          // pRowSpan: 仅该组第一行设置行数，其余设为 0（即隐藏），实现垂直合并
          pRowSpan: cIdx === 0 ? children.length : 0, 
          sRowSpan: sRowSpan, // 二级名称合并行数
          index: pIdx + 1,
        });
      });
    });
    return flat;
  };

  const columns: ColumnsType<any> = [
    {
      title: '编号',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      fixed: 'left',
      onCell: (record) => ({ rowSpan: record.pRowSpan }), // 绑定一级合并
    },
    {
      title: '一级风险名称',
      dataIndex: 'p_name',
      width: 150,
      align: 'center',
      fixed: 'left',
      onCell: (record) => ({ rowSpan: record.pRowSpan }),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '风险定义',
      dataIndex: 'p_definition',
      width: 300,
      onCell: (record) => ({ rowSpan: record.pRowSpan }),
      render: (text) => <div style={{ fontSize: '12px', textAlign: 'justify' }}>{text}</div>,
    },
    {
      title: '二级风险名称',
      dataIndex: 'risk_name',
      width: 180,
      align: 'center',
      onCell: (record) => ({ rowSpan: record.sRowSpan }), // 绑定二级同名合并
      render: (text) => text || '-',
    },
    {
      title: '风险影响因素',
      dataIndex: 'risk_influencing_factors',
      render: (text) => <div style={{ fontSize: '12px', color: '#666' }}>{text || '-'}</div>,
    },
    {
      title: '风险发生可能性',
      width: 200,
      align: 'center',
      onCell: (record) => ({ rowSpan: record.pRowSpan }), // 下拉框在一级区域内居中合并
      render: (_, record) => (
        <Select
          value={record.p_possibility}
          options={POSSIBILITY_OPTIONS}
          disabled={isDetail}
          style={{ width: '100%' }}
          onChange={(v) => {
            record.p_possibility = v;
            setFlatData([...flatData]); // 强制更新视图
          }}
        />
      ),
    },
    {
      title: '风险影响程度',
      width: 200,
      align: 'center',
      onCell: (record) => ({ rowSpan: record.pRowSpan }),
      render: (_, record) => (
        <Select
          value={record.p_influence}
          options={INFLUENCE_OPTIONS}
          disabled={isDetail}
          style={{ width: '100%' }}
          onChange={(v) => {
            record.p_influence = v;
            setFlatData([...flatData]);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    const type = main_id ? 'annualAssessment/queryAssessmentDetail' : 'annualAssessment/queryAssessmentConfig';
    dispatch({
      type,
      payload: { main_id },
      callback: (res: any) => {
        if (res?.result) {
          const data = res.result;
          const info = Array.isArray(data) ? data[0] : data;
          setBaseInfo(info);
          setFlatData(processData(data));
        }
        setLoading(false);
      }
    });
  }, [main_id]);

  /**
   * 暴露给父组件的方法：通过 ref 调用
   */
  useImperativeHandle(ref, () => ({
    // 获取新增保存格式：仅提取合并行的首行数据
    getAssessmentConfig: () => {
      return flatData.filter(i => i.pRowSpan > 0).map(i => ({
        config_id: i.p_id,
        possibility_score: i.p_possibility || 0,
        influence_score: i.p_influence || 0
      }));
    },
    // 获取编辑后台提交格式：回传原始 ID 和配置 ID
    getEditAssessmentConfig: () => {
      return flatData.filter(i => i.pRowSpan > 0).map(i => ({
        id: i.parent_origin?.id, 
        config_id: i.parent_origin?.config_id, 
        influence_score: i.p_influence || 0,
        possibility_score: i.p_possibility || 0,
      }));
    }
  }));

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      {/* 详情模式下展示单据基础信息 */}
      {(isDetail) && baseInfo.report_name && (
        <Descriptions bordered size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="填表人">{baseInfo.report_name}</Descriptions.Item>
          <Descriptions.Item label="岗位">{baseInfo.post_name}</Descriptions.Item>
          <Descriptions.Item label="权重">{baseInfo.weight}</Descriptions.Item>
        </Descriptions>
      )}
      <Table
        bordered
        dataSource={flatData}
        columns={columns}
        pagination={false}
        rowKey={(record, idx) => `${record.p_id}-${record.id || idx}`}
        loading={loading}
        scroll={{ x: 1400, y: 'calc(100vh - 360px)' }}
      />
    </div>
  );
};

export default connect(null, null, null, { forwardRef: true })(forwardRef(QuestionnaireRating as any));