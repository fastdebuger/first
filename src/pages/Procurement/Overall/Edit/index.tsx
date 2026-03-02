import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Radio, DatePicker, Button, Tabs, Card, Row, Col, message } from 'antd';
import type { Dispatch } from 'umi';
import { useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import useSysDict from '@/utils/useSysDict';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface IOverall {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackEditSuccess: () => void,
  selectedRecord: any
}

const OverallsEdit: React.FC<IOverall> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackEditSuccess,
    selectedRecord
  } = props;

  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  // 获取字典数据
  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'CURRENCY_TYPE'",
        "Operator": "in"
      }
    ]
  });

  // 常见币种（硬编码）
  const commonCurrencies = [
    { name: '人民币（CNY）', value: 'CNY' },
    { name: '美元（USD）', value: 'USD' },
    { name: '韩元（KRW）', value: 'KRW' },
    { name: '欧元（EUR）', value: 'EUR' },
    { name: '日元（JPY）', value: 'JPY' },
    { name: '港币（HKD）', value: 'HKD' },
    { name: '英镑（GBP）', value: 'GBP' },
    { name: '新加坡元（SGD）', value: 'SGD' },
    { name: '泰铢（THB）', value: 'THB' },
    { name: '澳元（AUD）', value: 'AUD' },
    { name: '加拿大元（CAD）', value: 'CAD' },
    { name: '瑞士法郎（CHF）', value: 'CHF' },
  ];

  // WBS 数据
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);
  const [wbsLoading, setWbsLoading] = useState<boolean>(false);
  const [selectedWbsName, setSelectedWbsName] = useState<string>('');

  // 获取 WBS 数据（只查询 prop_key='dep' 的数据）
  useEffect(() => {
    if (visible) {
      setWbsLoading(true);
      dispatch({
        type: 'common/queryWBS',
        payload: {
          sort: 'serial_no asc,wbs_code',
          order: 'asc',
          filter: JSON.stringify([
            {
              Key: 'prop_key',
              Val: 'dep',
              Operator: '='
            }
          ]),
        },
        callback: (res: any) => {
          setWbsLoading(false);
          if (res?.rows) {
            const options = res.rows.map((item: any) => ({
              label: item.wbs_name,
              value: item.wbs_code,
            }));
            setWbsOptions(options || []);
          } else {
            setWbsOptions([]);
          }
        },
      });
    }
  }, [visible, dispatch]);

  // 数据回显：当 selectedRecord 变化时，填充表单数据
  useEffect(() => {
    if (visible && selectedRecord) {
      const record = selectedRecord;

      // 处理日期字段：将时间戳转换为 dayjs 对象
      const dateFields = [
        'handover_time', 'completion_time', 'strat_reply_time', 'strat_filing_time',
        'project_create_time', 'project_submit_time', 'project_time'
      ];
      const formValues: any = { ...record };

      dateFields.forEach(field => {
        if (record[field] && typeof record[field] === 'number') {
          formValues[field] = dayjs.unix(record[field]);
        }
      });

      // 填充表单数据（先填充，不依赖 wbsOptions）
      form.setFieldsValue(formValues);

      // 设置 WBS 名称（用于自动填充 submit_target_topic）
      // 等待 wbsOptions 加载完成后再设置
      if (record.wbs_code && wbsOptions.length > 0) {
        const wbsOption = wbsOptions.find(opt => opt.value === record.wbs_code);
        if (wbsOption) {
          setSelectedWbsName(wbsOption.label);
        } else if (record.wbs_name) {
          // 如果找不到选项，使用 record 中的 wbs_name
          setSelectedWbsName(record.wbs_name);
        }
      } else if (record.wbs_name) {
        // 如果 wbsOptions 还没加载，先使用 record 中的 wbs_name
        setSelectedWbsName(record.wbs_name);
      }
    }
  }, [visible, selectedRecord, wbsOptions, form]);

  // 字段名到中文标签的映射
  const fieldLabelMap: Record<string, string> = {
    'wbs_code': '提报单位',
    'project_loc_type': '项目属地',
    'report_category': '报告类别',
    'pre_audit_no': '预审编号',
    'decision_meeting': '决策会',
    'topic_name': '议题名称',
    'batch_number': '批次',
    'remark': '备注',
    'file_url': '附件',
    'submit_target_topic': '向公司招标委员会报送+议题名称',
    'project_overview': '项目概述',
    'project_name': '项目名称',
    'is_confidential': '涉密',
    'project_level': '项目级别',
    'project_code': '项目编号',
    'owner_name': '业主名称',
    'project_attr': '项目属性',
    'design_unit': '设计单位',
    'supervision_unit': '监理单位',
    'eng_summary': '工程概述',
    'handover_time': '中交时间',
    'completion_time': '竣工时间',
    'strat_reply_time': '执行策略批复时间',
    'strat_reply_org': '执行策略批复机构',
    'strat_filing_time': '执行策略备案时间',
    'risk_desc': '物资采购策划及风险描述',
    'contract_total_amt': '工程合同总金额',
    'sub_proc_scale': '工程分包总采购规模',
    'mat_proc_scale': '工程物资总采购规模',
    'srv_proc_scale': '工程服务总采购规模',
    'meeting_basis': '议题上会依据',
    'obtain_method': '获得工程项目的方式',
    'contract_mode': '承包方式',
    'project_auth': '项目预算审批权',
    'project_create_time': '项目预算报审情况编制时间',
    'project_submit_time': '项目预算报审情况提交时间',
    'project_approval_status': '项目预算批复情况',
    'project_time': '项目预算批复日期',
    'total_invest_amt': '工程总包预算(万)',
    'sub_budget_ratio': '分包总预算占比',
    'mat_budget_amt': '工程物资总预算(万)',
    'mat_budget_ratio': '物资总预算占比',
    'srv_budget_amt': '工程服务总预算(万)',
    'srv_budget_ratio': '服务总预算占比',
    'tax_rate': '税率',
    'select_req': '选商要求',
    'quality_req': '质量要求',
    'origin_req': '原产地要求',
    'owner_part_req': '业主及相关方参与要求',
    'contract_type': '合同类型',
    'currency_type': '合同币种',
    'warranty_period_req': '质保期要求',
    'icv_req': 'ICV要求',
    'select_rule_content': '选商规则',
    'tech_eval_rule': '技术评审通用规则',
    'biz_eval_rule': '商务评审通用规则',
    'tech_special_req': '技术评审特殊要求',
    'biz_special_req': '商务评审特殊要求',
    'expert_source': '招标采购专家组成员来源',
    'non_bid_team_src': '非招标评审小组成员来源',
    'non_bid_team_qual': '非招标评审小组成员数量及资格',
    'qty_change_plan': '采购计划数量增减变更策划',
    'next_step_plan': '下一步工作实施方案',
  };

  const handleSubmit = async () => {
    try {
      // 验证所有字段，包括所有Tab页的字段（不管是否可见）
      const allFieldNames = [
        'wbs_code', 'project_loc_type', 'report_category', 'pre_audit_no', 'decision_meeting',
        'topic_name', 'batch_number', 'submit_target_topic', 'project_overview', 'project_name',
        'is_confidential', 'project_level', 'project_code', 'owner_name', 'project_attr',
        'design_unit', 'supervision_unit', 'eng_summary', 'handover_time', 'completion_time',
        'strat_reply_time', 'strat_reply_org', 'strat_filing_time', 'risk_desc', 'contract_total_amt',
        'sub_proc_scale', 'mat_proc_scale', 'srv_proc_scale', 'meeting_basis', 'obtain_method',
        'contract_mode', 'project_auth', 'project_create_time', 'project_submit_time',
        'project_approval_status', 'project_time', 'total_invest_amt', 'sub_budget_ratio',
        'mat_budget_amt', 'mat_budget_ratio', 'srv_budget_amt', 'srv_budget_ratio', 'tax_rate',
        'select_req', 'quality_req', 'origin_req', 'owner_part_req', 'contract_type',
        'currency_type', 'warranty_period_req', 'icv_req', 'select_rule_content',
        'tech_eval_rule', 'biz_eval_rule', 'tech_special_req', 'biz_special_req',
        'expert_source', 'non_bid_team_src', 'non_bid_team_qual', 'qty_change_plan', 'next_step_plan'
      ];

      const values = await form.validateFields(allFieldNames);

      // 处理日期字段转换为时间戳
      const dateFields = [
        'handover_time', 'completion_time', 'strat_reply_time', 'strat_filing_time',
        'project_create_time', 'project_submit_time', 'project_time'
      ];
      dateFields.forEach(field => {
        if (values[field]) {
          values[field] = dayjs(values[field]).unix();
        }
      });

      return new Promise((resolve: any) => {
        dispatch({
          type: 'purchaseStrategy/updateMaterialsPurchaseStrategy',
          payload: {
            ...values,
            form_no: selectedRecord?.form_no
          },
          callback: (res: any) => {
            resolve(true);
            if (res.errCode === ErrorCode.ErrOk) {
              message.success(formatMessage({ id: 'common.list.edit.success' }));
              form.resetFields();
              setSelectedWbsName('');
              setTimeout(() => {
                callbackEditSuccess();
              }, 200);
            } else {
              message.error(res.errMsg || '编辑失败');
            }
          },
        });
      });
    } catch (error: any) {
      // 提取验证失败的字段信息（包括所有Tab页的字段）
      if (error?.errorFields && error.errorFields.length > 0) {
        const errorFields = error.errorFields.map((field: any) => {
          const fieldName = field.name?.[0];
          const fieldLabel = fieldLabelMap[fieldName] || fieldName;
          const errorMessage = field.errors?.[0] || '填写有误';
          return { fieldName, fieldLabel, errorMessage, msg: `${fieldLabel}：${errorMessage}` };
        });

        Modal.warning({
          title: '提交失败',
          content: (
            <div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {errorFields.map((item: any) => (
                  <div key={item.fieldName} style={{ marginBottom: 4 }}>{item.msg}</div>
                ))}
              </div>
            </div>
          ),
          width: 500,
          okText: '确定',
        });
      }

      return Promise.resolve(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedWbsName('');
    onCancel();
  };

  return (
    <Modal
      title="编辑物资及服务总体采购策略"
      open={visible}
      onCancel={handleCancel}
      width="90%"
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        padding: '24px'
      }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          提交
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        preserve={true}
      >
        <Tabs type="card" defaultActiveKey="1" destroyInactiveTabPane={false}>
          {/* Sheet1: 基本信息 */}
          <TabPane tab="基本信息" key="1" forceRender>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="提报单位"
                    name="wbs_code"
                    rules={[{ required: true, message: '请选择提报单位' }]}
                  >
                    <Select
                      loading={wbsLoading}
                      showSearch
                      placeholder="请选择提报单位"
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={wbsOptions}
                      onChange={(value) => {
                        const selectedOption = wbsOptions.find(opt => opt.value === value);
                        setSelectedWbsName(selectedOption?.label || '');
                        // 自动更新 submit_target_topic
                        const topicName = form.getFieldValue('topic_name') || '';
                        form.setFieldsValue({
                          submit_target_topic: selectedOption?.label && topicName
                            ? `${selectedOption.label}${topicName}`
                            : '',
                          project_name: selectedOption?.label || ''
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目属地"
                    name="project_loc_type"
                    rules={[{ required: true, message: '请选择项目属地' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>境内项目</Option>
                      <Option value={1}>境外项目</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="报告类别"
                    name="report_category"
                    rules={[{ required: true, message: '请选择报告类别' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>工程分包</Option>
                      <Option value={1}>工程物资</Option>
                      <Option value={2}>工程服务</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="预审编号"
                    name="pre_audit_no"
                    rules={[{ required: true, message: '请输入预审编号' }]}
                  >
                    <Input placeholder="请输入预审编号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="决策会"
                    name="decision_meeting"
                    rules={[{ required: true, message: '请选择决策会' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>MC</Option>
                      <Option value={1}>TC</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="议题名称"
                    name="topic_name"
                    rules={[{ required: true, message: '请输入议题名称' }]}
                  >
                    <Input
                      placeholder="请输入议题名称"
                      onChange={(e) => {
                        // 自动更新 submit_target_topic
                        const wbsName = selectedWbsName || '';
                        const topicName = e.target.value || '';
                        form.setFieldsValue({
                          submit_target_topic: wbsName && topicName
                            ? `${wbsName}${topicName}`
                            : ''
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="批次"
                    name="batch_number"
                    rules={[{ required: true, message: '请输入批次' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入批次" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* Sheet2: 目的 */}
          <TabPane tab="目的" key="2" forceRender>
            <Card bordered={false}>
              <Form.Item
                label="向公司招标委员会报送+议题名称"
                name="submit_target_topic"
                rules={[{ required: true, message: '请输入向公司招标委员会报送+议题名称' }]}
                dependencies={['wbs_code', 'topic_name']}
              >
                <TextArea
                  rows={6}
                  placeholder="向公司招标委员会报送+议题名称"
                  disabled
                />
              </Form.Item>
            </Card>
          </TabPane>

          {/* Sheet3: 项目背景描述 */}
          <TabPane tab="项目背景描述" key="3" forceRender>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="项目概述"
                    name="project_overview"
                    rules={[{ required: true, message: '请输入项目概述' }]}
                  >
                    <TextArea rows={3} placeholder="请输入项目概述" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目名称"
                    name="project_name"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                  >
                    <Input placeholder="项目名称" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="涉密"
                    name="is_confidential"
                    rules={[{ required: true, message: '请选择涉密' }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>是</Radio>
                      <Radio value={1}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目级别"
                    name="project_level"
                    rules={[{ required: true, message: '请选择项目级别' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>A</Option>
                      <Option value={1}>B</Option>
                      <Option value={2}>C</Option>
                      <Option value={3}>D</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目编号"
                    name="project_code"
                    rules={[{ required: true, message: '请输入项目编号' }]}
                  >
                    <Input placeholder="请输入项目编号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="业主名称"
                    name="owner_name"
                    rules={[{ required: true, message: '请输入业主名称' }]}
                  >
                    <Input placeholder="请输入业主名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目属性"
                    name="project_attr"
                    rules={[{ required: true, message: '请选择项目属性' }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>系统内项目</Radio>
                      <Radio value={1}>系统外项目</Radio>
                      <Radio value={2}>其他项目</Radio>
                      <Radio value={3}>集团重点项目</Radio>
                      <Radio value={4}>非重点项目</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="设计单位"
                    name="design_unit"
                    rules={[{ required: true, message: '请输入设计单位' }]}
                  >
                    <Input placeholder="请输入设计单位" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="监理单位"
                    name="supervision_unit"
                    rules={[{ required: true, message: '请输入监理单位' }]}
                  >
                    <Input placeholder="请输入监理单位" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="工程概述"
                    name="eng_summary"
                    rules={[{ required: true, message: '请输入工程概述' }]}
                  >
                    <TextArea rows={3} placeholder="请输入工程概述" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="中交时间"
                    name="handover_time"
                    rules={[{ required: true, message: '请选择中交时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="竣工时间"
                    name="completion_time"
                    rules={[{ required: true, message: '请选择竣工时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="执行策略批复时间"
                    name="strat_reply_time"
                    rules={[{ required: true, message: '请选择执行策略批复时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="执行策略批复机构"
                    name="strat_reply_org"
                    rules={[{ required: true, message: '请输入执行策略批复机构' }]}
                  >
                    <Input placeholder="请输入执行策略批复机构" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="执行策略备案时间"
                    name="strat_filing_time"
                    rules={[{ required: true, message: '请选择执行策略备案时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="物资采购策划及风险描述"
                    name="risk_desc"
                    rules={[{ required: true, message: '请输入物资采购策划及风险描述' }]}
                  >
                    <TextArea rows={4} placeholder="请输入物资采购策划及风险描述" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程合同总金额（万）"
                    name="contract_total_amt"
                    rules={[{ required: true, message: '请输入工程合同总金额' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入工程合同总金额" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程分包总采购规模"
                    name="sub_proc_scale"
                    rules={[{ required: true, message: '请输入工程分包总采购规模' }]}
                  >
                    <TextArea rows={2} placeholder="请输入工程分包总采购规模" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程物资总采购规模"
                    name="mat_proc_scale"
                    rules={[{ required: true, message: '请输入工程物资总采购规模' }]}
                  >
                    <TextArea rows={2} placeholder="请输入工程物资总采购规模" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程服务总采购规模"
                    name="srv_proc_scale"
                    rules={[{ required: true, message: '请输入工程服务总采购规模' }]}
                  >
                    <TextArea rows={2} placeholder="请输入工程服务总采购规模" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="议题上会依据"
                    name="meeting_basis"
                    rules={[{ required: true, message: '请输入议题上会依据' }]}
                  >
                    <TextArea rows={3} placeholder="请输入议题上会依据" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="获得工程项目的方式"
                    name="obtain_method"
                    rules={[{ required: true, message: '请选择获得工程项目的方式' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>招标方式</Option>
                      <Option value={1}>非招标方式</Option>
                      <Option value={2}>通过海外单位获取的境外工程</Option>
                      <Option value={3}>自行获取的境外工程</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="承包方式"
                    name="contract_mode"
                    rules={[{ required: true, message: '请选择承包方式' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>EPC</Option>
                      <Option value={1}>PC</Option>
                      <Option value={2}>C</Option>
                      <Option value={3}>专业工程承包</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* Sheet4: 项目预算概述 */}
          <TabPane tab="项目预算概述" key="4" forceRender>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="项目预算审批权"
                    name="project_auth"
                    rules={[{ required: true, message: '请选择项目预算审批权' }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>总部预算委员会</Radio>
                      <Radio value={1}>分/子公司预算委员会</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目预算报审情况编制时间"
                    name="project_create_time"
                    rules={[{ required: true, message: '请选择项目预算报审情况编制时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目预算报审情况提交时间"
                    name="project_submit_time"
                    rules={[{ required: true, message: '请选择项目预算报审情况提交时间' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目预算批复情况"
                    name="project_approval_status"
                    rules={[{ required: true, message: '请选择项目预算批复情况' }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>未批复</Radio>
                      <Radio value={1}>已批复</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="项目预算批复日期"
                    name="project_time"
                    rules={[{ required: true, message: '请选择项目预算批复日期' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程总包预算(万)"
                    name="total_invest_amt"
                    rules={[{ required: true, message: '请输入工程总包预算' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入工程总包预算" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="分包总预算占比"
                    name="sub_budget_ratio"
                    rules={[{ required: true, message: '请输入分包总预算占比' }]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入分包总预算占比" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程物资总预算(万)"
                    name="mat_budget_amt"
                    rules={[{ required: true, message: '请输入工程物资总预算' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入工程物资总预算" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="物资总预算占比"
                    name="mat_budget_ratio"
                    rules={[{ required: true, message: '请输入物资总预算占比' }]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入物资总预算占比" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="工程服务总预算(万)"
                    name="srv_budget_amt"
                    rules={[{ required: true, message: '请输入工程服务总预算' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入工程服务总预算" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="服务总预算占比"
                    name="srv_budget_ratio"
                    rules={[{ required: true, message: '请输入服务总预算占比' }]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入服务总预算占比" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="税率"
                    name="tax_rate"
                    rules={[{ required: true, message: '请输入税率' }]}
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入税率" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* Sheet5: 主合同条款要点 */}
          <TabPane tab="主合同条款要点" key="5" forceRender>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="选商要求"
                    name="select_req"
                    rules={[{ required: true, message: '请输入选商要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入选商要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="质量要求"
                    name="quality_req"
                    rules={[{ required: true, message: '请输入质量要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入质量要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="原产地要求"
                    name="origin_req"
                    rules={[{ required: true, message: '请输入原产地要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入原产地要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="业主及相关方参与要求"
                    name="owner_part_req"
                    rules={[{ required: true, message: '请输入业主及相关方参与要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入业主及相关方参与要求" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="合同类型"
                    name="contract_type"
                    rules={[{ required: true, message: '请选择合同类型' }]}
                  >
                    <Select placeholder="请选择">
                      <Option value={0}>固定单价</Option>
                      <Option value={1}>暂定总价</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="合同币种"
                    name="currency_type"
                    rules={[{ required: true, message: '请选择合同币种' }]}
                  >
                    <Select placeholder="请选择">
                      {/* 常见币种（硬编码） */}
                      {commonCurrencies.map((currency) => (
                        <Option key={currency.value} value={currency.value}>
                          {currency.name}
                        </Option>
                      ))}
                      {/* 从字典获取的其他币种 */}
                      {(configData?.CURRENCY_TYPE || []).map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.dict_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="质保期要求"
                    name="warranty_period_req"
                    rules={[{ required: true, message: '请输入质保期要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入质保期要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="ICV要求"
                    name="icv_req"
                    rules={[{ required: true, message: '请输入ICV要求' }]}
                  >
                    <TextArea rows={3} placeholder="请输入ICV要求" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* Sheet6: 选商规则 */}
          <TabPane tab="选商规则" key="6" forceRender>
            <Card bordered={false}>
              <Form.Item
                label="选商规则"
                name="select_rule_content"
                rules={[{ required: true, message: '请输入选商规则' }]}
              >
                <TextArea rows={10} placeholder="请输入选商规则" />
              </Form.Item>
            </Card>
          </TabPane>

          {/* Sheet7: 评审规则 */}
          <TabPane tab="评审规则" key="7" forceRender>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="技术评审通用规则"
                    name="tech_eval_rule"
                    rules={[{ required: true, message: '请输入技术评审通用规则' }]}
                  >
                    <TextArea rows={4} placeholder="请输入技术评审通用规则" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="商务评审通用规则"
                    name="biz_eval_rule"
                    rules={[{ required: true, message: '请输入商务评审通用规则' }]}
                  >
                    <TextArea rows={4} placeholder="请输入商务评审通用规则" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="技术评审特殊要求"
                    name="tech_special_req"
                    rules={[{ required: true, message: '请输入技术评审特殊要求' }]}
                  >
                    <TextArea rows={4} placeholder="请输入技术评审特殊要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="商务评审特殊要求"
                    name="biz_special_req"
                    rules={[{ required: true, message: '请输入商务评审特殊要求' }]}
                  >
                    <TextArea rows={4} placeholder="请输入商务评审特殊要求" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="招标采购专家组成员来源"
                    name="expert_source"
                    rules={[{ required: true, message: '请输入招标采购专家组成员来源' }]}
                  >
                    <Input placeholder="请输入招标采购专家组成员来源" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="非招标评审小组成员来源"
                    name="non_bid_team_src"
                    rules={[{ required: true, message: '请输入非招标评审小组成员来源' }]}
                  >
                    <TextArea rows={3} placeholder="请输入非招标评审小组成员来源" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="非招标评审小组成员数量及资格"
                    name="non_bid_team_qual"
                    rules={[{ required: true, message: '请输入非招标评审小组成员数量及资格' }]}
                  >
                    <TextArea rows={3} placeholder="请输入非招标评审小组成员数量及资格" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>
          {/* Sheet8: 采购计划数量增减变更策划方案 */}
          <TabPane tab="采购计划数量增减变更策划方案" key="8" forceRender>
            <Card bordered={false}>
              <Form.Item
                label="采购计划数量增减变更策划"
                name="qty_change_plan"
                rules={[{ required: true, message: '请输入采购计划数量增减变更策划' }]}
              >
                <TextArea rows={10} placeholder="请输入采购计划数量增减变更策划" />
              </Form.Item>
            </Card>
          </TabPane>

          {/* Sheet9: 下一步工作实施方案 */}
          <TabPane tab="下一步工作实施方案" key="9" forceRender>
            <Card bordered={false}>
              <Form.Item
                label="下一步工作实施方案"
                name="next_step_plan"
                rules={[{ required: true, message: '请输入下一步工作实施方案' }]}
              >
                <TextArea rows={10} placeholder="请输入下一步工作实施方案" />
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default connect()(OverallsEdit);
