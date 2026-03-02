import React, { useEffect, useRef, useState,useMemo } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, BasicTaskForm } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Spin, InputNumber, Tag, Drawer, Card, Row, Col, Form, Button, Alert } from "antd";
import { StarOutlined } from "@ant-design/icons";
import DynamicTableForm, { DynamicFormColumn, GroupFieldConfig } from '@/components/DynamicTableForm';
import useSysDict from '@/utils/useSysDict';
import { transformFormDataToArray, transformFormDataWithGroupFields } from '@/utils/formDataTransform';

import { contractInfoConfig, basicCols } from "../columns";
import RenderContractorItem from "./RenderContractorItem";

/**
 * 合同年度打分页面
 * @param props
 * @constructor
 */
const ContractScoreAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, currentRecord, selectedRecord, getInterfaceData } = props;
  const { formatMessage } = useIntl();
  const [basicData, setBasicData] = useState([])
  const [performanceData, setPerformanceData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  // 提交按钮加载状态
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const basicRef: any = useRef();
  const perfRef: any = useRef();
  // 1. 添加总分状态
  const [totalScore, setTotalScore] = useState<number>(0);

  // 获取系统字典配置的数据
  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'PROJECT_TYPE'",
        "Operator": "in"
      }
    ]
  })

  // 业绩评价配置列
  const performanceCols: DynamicFormColumn[] = [
    { title: '序号', dataIndex: 'RowNumber', width: 80 },
    { title: '评分标准', dataIndex: 'score_standard' },
    { title: '分值', dataIndex: 'score_value', width: 80 },
    {
      title: '考核得分',
      formField: {
        name: (row: any) => `perf_${row.RowNumber}_score`,
        type: 'custom',
        rules: (row) => {
          const rules = [];
          // 只有正常得分项添加校验
          if (row.score_value !== null) {
            rules.push({ required: true, message: '请输入得分' });
          }
          return rules;
        },
        render: ({ row }) => {
          if (!row.score_value) {
            return <InputNumber min={0} max={10} />
          }
          return <InputNumber max={row.score_value} min={0} style={{ width: "100%" }} />
        }
      },
    },
    {
      title: '扣分原因',
      formField: {
        name: (row: any) => `perf_${row.RowNumber}_reason`,
        type: 'textarea',
      },
    },

  ];

  // 计算总分的函数
  const calculateTotalScore = () => {
    let totalScore = 0;
    if (performanceData.length > 0) {
      const perfVals = perfRef.current?.getFieldsValue() || {};
      
      // 构建扣分项 记录哪些行是扣分项（score_value === null）
      const deductRowsMap: any = {};
      performanceData.forEach((item: any) => {
        if (item.score_value === null) {
          deductRowsMap[item.RowNumber] = true;
        }
      });
      
      // 遍历出来所有 perf__score 字段
      Object.keys(perfVals).forEach(key => {
        if (key.startsWith('perf_') && key.endsWith('_score')) {
          // 提取需要的行号
          const match = key.match(/perf_(\d+)_score/);
          if (match) {
            const rowNumber = match[1];
            const score = perfVals[key];
            
            if (score !== undefined && !isNaN(Number(score))) {
              // 判断是否是扣分项
              if (deductRowsMap[rowNumber]) {
                // 扣分项：减去分数（负分）
                totalScore -= Number(score);
              } else {
                // 正常得分项：加上分数
                totalScore += Number(score);
              }
            }
          }
        }
      });
    }
    
    return totalScore;
  };
  // 创建监听函数，当两个表单都变化时更新总得分
  const updateTotalScore = () => {
    setTimeout(() => {
      const score = calculateTotalScore() || 0;
      setTotalScore(score);
    }, 0);
  };

  /**
   *业绩评价分组字段配置 
   * 添加小计和审核人的列配置
   * 并遍历获取对应的得分字段值并累加计算得出分组小计值
   */
  const performanceGroupFields: GroupFieldConfig[] = [
    {
      title: '小计',
      name: (groupName: string) => `group_${groupName}_subtotal`,
      type: 'number',
      width: 120,
      rules: [{ required: true, message: '请输入小计' }],
      insertIndex: 3,
      // 小计为该分组内所有考核得分的总和
      calculate: (formValues: Record<string, any>, groupRows: any[], groupName: string) => {
        // 计算该分组内所有考核得分的总和
        const total = groupRows.reduce((sum, row) => {
          let score;
          const scoreFieldName = `perf_${row.RowNumber}_score`;
          // 如果后台返回的得分项为null，则得分为负数,拼接上-号
          if (row.score_value === null) {
            score = '-' + formValues[scoreFieldName]
          } else {
            score = formValues[scoreFieldName];
          }
          // 判断是否有值、是否是数字，是的话累加否则忽略
          if (score !== undefined && score !== null && !isNaN(Number(score))) {
            return sum + Number(score);
          }
          return sum;
        }, 0);

        return total;
      },
      // 监听该分组内所有考核得分字段的变化
      dependencies: (groupRows: any[]) => {
        return groupRows.map(row => `perf_${row.RowNumber}_score`);
      },
    },
    {
      title: '审核人',
      name: (groupName: string) => `group_${groupName}_assess_person`,
      type: 'input',
      width: 120,
      rules: [{ required: true, message: '请输入审核人' }],
      insertIndex: 8,
    },
  ];

  // 初始化加载两个表单的数据
  useEffect(() => {
    if (dispatch) {
      Promise.all([
        // basicRef、perfRef两个表单的数据
        getInterfaceData('appraiseInfo/getBasicConfig'),
        getInterfaceData('appraiseInfo/getPerformanceConfig')
      ]).then(([basicRes, perfRes]) => {
        setBasicData(basicRes)
        setPerformanceData(perfRes)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    }

  }, []);

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "annual_completed_amount",
        "project_category",
        "project_principal",
      ])
      .setFormColumnToInputNumber([
        { value: 'annual_completed_amount', valueType: 'digit' },
      ])
      .setFormColumnToSelect([
        { value: 'project_category', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: (configData?.PROJECT_TYPE as any) || [] },
      ])
      .setFormColumnToSelfColSpan([
        { value: 'annual_completed_amount', colSpan: 8, labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        { value: 'project_principal', colSpan: 8, labelCol: { span: 9 }, wrapperCol: { span: 17 } },
      ])
      .needToRules([
        "annual_completed_amount",
        "project_category",
        "project_principal",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };


  /**
 * 提交表单数据、基础条件表单和业绩评价表单两个表单的数据
 */
  const onCommit = async () => {
    try {
      // 校验所有表单字段的有效性
      await Promise.all([
        form?.validateFields?.(),
        basicRef.current?.validateFields?.(),
        perfRef.current?.validateFields?.(),
      ]);
      setSubmitLoading(true);

    } catch (error) {
      message.error(error || '数据有误');
      return Promise.resolve(true);
    }

    // 获取各个表单的当前值
    const taskForm = form?.getFieldsValue?.();
    const basicVals = basicRef.current?.getFieldsValue?.() || {};
    const perfVals = perfRef.current?.getFieldsValue?.() || {};

    // 转换基本条件评价表单数据为数组结构
    const basicConditionList = transformFormDataToArray(basicVals, {
      prefix: 'basic_',
      idFieldName: 'basic_id',
      fieldMapping: {
        'satisfied': 'is_satisfy',
      },
    });

    // 转换业绩评价表单数据，并按指标名称自动合并分组字段
    const performanceList = transformFormDataWithGroupFields(perfVals, {
      prefix: 'perf_',
      idFieldName: 'performance_id',
      fieldMapping: {
        'score': 'assess_score',
        'reason': 'remark',
      },
      rows: performanceData,
      groupBy: (row: any) => row.indicator_name,
      groupFields: [
        {
          fieldName: (groupName: string) => performanceGroupFields[0].name(groupName),
          targetFieldName: 'subtotal',
        },
        {
          fieldName: (groupName: string) => performanceGroupFields[1].name(groupName),
          targetFieldName: 'assess_person',
        },
      ],
    });

    // 整理承包商打分提交的请求参数
    const payload = {
      outContractInfo: JSON.stringify({
        head_id: selectedRecord?.head_id,
        contract_out_id: currentRecord?.contract_out_id,
        ...taskForm,
        project_score: totalScore || 0
      }),
      basicItems: JSON.stringify(basicConditionList),
      performanceItems: JSON.stringify(performanceList),
      code: 'YJ/ZH/PD/GC-005-2025R06',
      wbs_code: localStorage.getItem('auth-default-wbsCode')
    };

    // 调用承包商打分保存的接口
    return new Promise((resolve) => {
      dispatch({
        type: "appraiseInfo/addOutContractScoreInfo",
        payload,
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            // 使用message自定义来提示保存成功（因为modal和抽屉一起用回导致message会自动消失）
            message.success({
              content: `评分成功！`,
              duration: 2,
              style: {
                zIndex: 9999,
              },
            });
            setTimeout(() => {
              callbackSuccess();
            }, 1000);
          }
          setSubmitLoading(false);

        },
      });
    });
  }

  /**
   * 初始化basicRef表单基础数据
   * @returns 返回basicRef表单字段的初始化值
   */
  const initFormBasic = () => {
    const newInitValues: any = {}; // 创建空对象
    // 遍历基础数据数组，为每个项目生成对应的表单字段初始化值
    basicData.forEach((item, index) => {
      // 用 index+1 生成 basic_1_satisfied 格式
      const fieldName = `basic_${index + 1}_satisfied`;
      newInitValues[fieldName] = '1'; // 添加到对象
    });
    return newInitValues;
  };

  /**
  * 初始化perfRef 表单基础数据
  * 必须使用useMemo缓存一下不然组件内部会重复赋值，导致表单数据无法更新
  * @returns 返回perfRef 表单字段的初始化值
  */
  const initFormPerMance = useMemo(() => {
    const newInitValues: any = {}; // 创建空对象
    performanceData.forEach((item: any, index) => {
      // 用 index+1 生成 basic_1_satisfied 格式
      const fieldName = `perf_${index + 1}_score`;
      newInitValues[fieldName] = item.score_value; // 添加到对象
    });
    // 初始化的时候更新一下总得分
    updateTotalScore();
    return newInitValues;
  }, [performanceData])

  return (
    <Drawer
      width='75%'
      title={
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            共100分，得分： <Tag style={{fontSize: '16px',padding: 4,borderRadius: 4}}><StarOutlined /> {totalScore || 0} 分</Tag>
          </Col>
          <Col>
            <Button type="primary" onClick={onCommit} loading={submitLoading}>提交</Button>
          </Col>
        </Row>
      }
      placement="right"
      onClose={onCancel}
      open={visible}
    >
      <Alert message="合同得分默认都为满分，您可以填写扣分项扣除得分" type="warning" />
      <Card title="合同信息" size="small" style={{ margin: '8px 0' }}>
        <Row gutter={[16, 8]}>
          {contractInfoConfig.map((item) => {
            return (
              <Col
                span={8}
              >
                <RenderContractorItem
                  label={item.label}
                  value={currentRecord?.[item.key]}
                  labelWidth={item.labelWidth}
                />
              </Col>
            );
          })}
        </Row>
      </Card>

      <BasicTaskForm
        initialValue={{}}
        form={form}
        formColumns={getFormColumns()}
        colSpan={8}
        labelCol={{ span: 8 }}
        labelAlign="left"
      />
      <Spin spinning={loading}>
        {/* 动态表单：基本条件评价 */}
        <DynamicTableForm
          rows={basicData || []}
          columns={basicCols}
          cRef={basicRef}
          title="基本条件评价"
          initialValues={initFormBasic()}
        />
        {/* 动态表单：业绩评价 */}
        {performanceData.length > 0 &&
          (
            <DynamicTableForm
              rows={performanceData || []}
              columns={performanceCols}
              cRef={perfRef}
              title="业绩评价(项目部考核)"
              groupBy={(r: any) => r.indicator_name}
              showGroupAsLeft
              groupTitleHeader={''}
              groupFields={performanceGroupFields}
              initialValues={initFormPerMance}
              onValuesChange={updateTotalScore}
            />
          )
        }

      </Spin>
    </Drawer>
  );
};

export default connect()(ContractScoreAdd);
