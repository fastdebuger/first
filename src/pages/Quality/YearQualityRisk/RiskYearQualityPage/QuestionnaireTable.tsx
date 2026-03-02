import { InputNumber, Table, Tag, Input } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ErrorCode } from "@/common/const";
import { connect } from 'umi';

// 风险等级颜色映射
const getRiskGradeColor = (grade: any) => {
  switch (grade) {
    case 5: return '#ff4d4f'; // 极高风险 - 红色
    case 4: return '#faad14'; // 高风险 - 橙色
    case 3: return '#1890ff'; // 中等风险 - 蓝色
    case 2: return '#52c41a'; // 低风险 - 绿色
    case 1: return '#d9d9d9'; // 极低风险 - 灰色
    default: return '#d9d9d9';
  }
};

/**
 * 公司重大经营风险评估调查表
 * @param props 
 * @returns 
 */
const QuestionnaireTable: React.FC<any> = (props: any, ref: any) => {
  const { dispatch,selectedRecord,isDetail } = props;
  // 列配置数据
  const [assessmentConfig, setAssessmentConfig] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => {
    setIsLoading(true);
    // 编辑接口
    dispatch({
      type: "workLicenseRegister/queryRiskAnnualBody",
      payload: {
        sort: 'serial_number',
        order: 'asc',
        h_id: selectedRecord?.h_id ?? 0,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          // 确保所有需要的字段都有默认值
          const formattedData = (res.rows || []).map((item: any) => ({
            ...item,
            risk_cause: item.risk_cause || '',
            risk_consequence: item.risk_consequence || '',
            likelihood: item.likelihood || 1,
            severity: item.severity || 1,
            risk_coefficient: item.risk_coefficient || 1,
            risk_grade: item.risk_grade || 1,
            acceptable: item.acceptable ?? 1,
            control_target: item.control_target || '',
            preventive_measures: item.preventive_measures || '',
            responsible_dep: item.responsible_dep || '',
            responsible_person: item.responsible_person || '',
          }));
          setAssessmentConfig(formattedData);
          setTableData([...formattedData]); // 创建副本用于表格
        }
        setIsLoading(false);
      },
    });
  }, []);

  // 计算风险系数和等级
  const calculateRiskCoefficient = (record: any) => {
    if (!record.likelihood || !record.severity) return;

    const riskCoefficient = record.likelihood * record.severity;
    let riskGrade;
    let acceptable;

    // 计算风险等级
    if (riskCoefficient >= 20) {
      riskGrade = 5; // 极高风险（20≤R＜25）
    } else if (riskCoefficient >= 15) {
      riskGrade = 4; // 高风险（15≤R＜20）
    } else if (riskCoefficient >= 10) {
      riskGrade = 3; // 中等风险（10≤R＜15）
    } else if (riskCoefficient > 4) {
      riskGrade = 2; // 低风险（4<R≤10）
    } else {
      riskGrade = 1; // 极低风险（R<4）
    }

    // 计算是否可接受（风险系数>=10不可接受）
    acceptable = riskCoefficient >= 10 ? 0 : 1;

    // 更新记录
    Object.assign(record, {
      risk_coefficient: riskCoefficient,
      risk_grade: riskGrade,
      acceptable: acceptable
    });

    // 强制表格重新渲染
    setTableData([...tableData]);
  };

  // 列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'serial_number',
      align: "center" as const,
      width: 80,
      fixed: "left" as const,
    },
    {
      title: '一级风险类别',
      dataIndex: 'first_risk_type',
      width: 200,
      align: "center" as const,
    },
    {
      title: '一级流程/专业',
      dataIndex: 'first_process',
      align: "center" as const,
      width: 160,
    },
    {
      title: '二级流程/作业活动',
      width: 160,
      dataIndex: 'second_process',
      align: "center" as const,
    },
    {
      title: '作业步骤/工序',
      align: "center" as const,
      width: 160,
      dataIndex: 'work_step',
    },
    {
      title: '风险类别/风险名称',
      align: "center" as const,
      width: 160,
      dataIndex: 'risk_name',
    },
    {
      title: '风险描述',
      align: "center" as const,
      width: 160,
      dataIndex: 'risk_description',
    },
    {
      title: '风险可能产生之因',
      dataIndex: 'risk_cause',
      align: "center" as const,
      width: 180,
      render: (text: any, record: any) => (
        <Input
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.risk_cause = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入风险产生原因"
        />
      ),
    },
    {
      title: '风险可能导致之果',
      dataIndex: 'risk_consequence',
      align: "center" as const,
      width: 160,
      render: (text: any, record: any) => (
        <Input
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.risk_consequence = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入风险后果"
        />
      ),
    },
    {
      title: '可能性(L)',
      dataIndex: 'likelihood',
      align: "center" as const,
      width: 120,
      render: (text: any, record: any) => (
        <InputNumber
          min={1}
          max={5}
          disabled={isDetail}
          value={text}
          onChange={(value: any) => {
            record.likelihood = value;
            calculateRiskCoefficient(record);
          }}
          placeholder="1-5"
        />
      ),
    },
    {
      title: '严重程度(S)',
      dataIndex: 'severity',
      align: "center" as const,
      width: 120,
      render: (text: any, record: any) => (
        <InputNumber
          min={1}
          max={5}
          disabled={isDetail}
          value={text}
          onChange={(value: any) => {
            record.severity = value;
            calculateRiskCoefficient(record);
          }}
          placeholder="1-5"
        />
      ),
    },
    {
      title: '风险系数(R)',
      dataIndex: 'risk_coefficient',
      align: "center" as const,
      width: 120,
      render: (text: any) => <span>{text || '自动计算'}</span>,
    },
    {
      title: '风险等级',
      dataIndex: 'risk_grade',
      align: "center" as const,
      width: 120,
      render: (text: any) => {
        const gradeMap: any = {
          1: '极低风险',
          2: '低风险',
          3: '中等风险',
          4: '高风险',
          5: '极高风险',
        };
        return <Tag color={getRiskGradeColor(text)}>{gradeMap[text] || '待计算'}</Tag>;
      },
    },
    {
      title: '可否接受',
      dataIndex: 'acceptable',
      align: "center" as const,
      width: 120,
      render: (text: any) => {
        if (text === 0) return <Tag color="red">不可接受</Tag>;
        if (text === 1) return <Tag color="green">可接受</Tag>;
        return <Tag>待计算</Tag>;
      },
    },
    {
      title: '控制目标',
      dataIndex: 'control_target',
      align: "center" as const,
      width: 180,
      render: (text: any, record: any) => (
        <Input
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.control_target = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入控制目标"
        />
      ),
    },
    {
      title: '预防措施/控制方案',
      dataIndex: 'preventive_measures',
      align: "center" as const,
      width: 200,
      render: (text: any, record: any) => (
        <Input.TextArea
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.preventive_measures = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入预防措施/控制方案"
          rows={2}
        />
      ),
    },
    {
      title: '责任部门',
      dataIndex: 'responsible_dep',
      align: "center" as const,
      width: 120,
      render: (text: any, record: any) => (
        <Input
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.responsible_dep = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入责任部门"
        />
      ),
    },
    {
      title: '责任人',
      dataIndex: 'responsible_person',
      align: "center" as const,
      width: 120,
      render: (text: any, record: any) => (
        <Input
          value={text}
          disabled={isDetail}
          onChange={(e: any) => {
            record.responsible_person = e.target.value;
            setTableData([...tableData]);
          }}
          placeholder="请输入责任人"
        />
      ),
    },
  ];

  // 获取新增后台提交的格式
  const getAssessmentConfig = () => {
    return assessmentConfig?.map((item: any) => ({
      config_id: item.config_id,
      risk_cause: item.risk_cause, // 风险可能产生之因
      risk_consequence: item.risk_consequence, // 风险可能导致之果
      likelihood: item.likelihood, // 可能性（L）
      severity: item.severity, // 严重程度
      risk_coefficient: item.risk_coefficient, // 风险系数
      risk_grade: item.risk_grade, // 风险等级
      acceptable: item.acceptable, // 可否接受
      control_target: item.control_target, // 控制目标
      preventive_measures: item.preventive_measures, // 预防措施/控制方案
      responsible_dep: item.responsible_dep,
      responsible_person: item.responsible_person, // 责任人/部门
    }));
  };

  // 获取编辑后台提交的格式
  const getEditAssessmentConfig = () => {
    return assessmentConfig?.map((item: any) => ({
      config_id: item.config_id,
      risk_cause: item.risk_cause, // 风险可能产生之因
      risk_consequence: item.risk_consequence, // 风险可能导致之果
      likelihood: item.likelihood, // 可能性（L）
      severity: item.severity, // 严重程度
      risk_coefficient: item.risk_coefficient, // 风险系数
      risk_grade: item.risk_grade, // 风险等级
      acceptable: item.acceptable, // 可否接受
      control_target: item.control_target, // 控制目标
      preventive_measures: item.preventive_measures, // 预防措施/控制方案
      responsible_dep: item.responsible_dep,
      responsible_person: item.responsible_person, // 责任人/部门
    }));
  };

  /**
   * 暴露方法给父组件的 ref
   */
  useImperativeHandle(ref, () => ({
    getAssessmentConfig,
    getEditAssessmentConfig,
  }));

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 235px)",
          overflowY: "auto",
        }}
      >
        <Table
          rowKey={'serial_number'}
          loading={isLoading}
          columns={columns}
          dataSource={tableData || []}
          pagination={false}
          bordered
          size='small'
          scroll={{ x: 'max-content', y: "calc(100vh - 290px)" }}
        />
      </div>
    </>
  );
};

export default connect(null, null, null, { forwardRef: true })(forwardRef(QuestionnaireTable as any));