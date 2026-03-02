import React, { useMemo } from "react";
import { Form, Input, Select, DatePicker, Card, Row, Col, Button } from "antd";
import { MinusCircleOutlined } from '@ant-design/icons';
import { FormListFieldData } from "antd/lib/form/FormList";
import { connect, Dispatch } from "umi";
import TreeSelectComp from "./TreeSelectComp";
import { arrToTree } from "@/utils/utils-array";

const { Option, OptGroup } = Select;
const { TextArea } = Input;

// 字典表配置项
interface RiskEventDeptItem {
  id: number;
  sys_type_code: string;
  dict_name: string;
  is_delete: 0 | 1;
  type_name: string | null;
  RowNumber: number;
}
// 风险类别配置项
interface RiskCategoryConfigItem {
  id: number;
  category_name: string;
  risk_category_type: number;
  parent_id: number | null;
  risk_category_type_name: string;
  RowNumber: number;
}
//WBS 节点项类型定义
interface WbsItemProps {
  wbs_name: string;
  wbs_code: string;
  self_wbs_code: string;
  curr_wbs_code: string;
  up_wbs_code: string;
  up_wbs_name: string;
  level: string;
  short_name: string;
  serial_no: string;
  prop_key: string;
  rownumber: string;
  remark: string;
  aid_name: string;
  wbs_en_name: string;
}
interface EventFormItemProps {
  field: FormListFieldData;
  index: number;
  remove: (name: number | number[]) => void;
  fieldsCount: number;
  dispatch: Dispatch,
  riskCategoryConfig: RiskCategoryConfigItem[],
  wbsItems: WbsItemProps[],
  companyDeptConfig: RiskEventDeptItem[],
}

// --- 单个事件记录表单 ---
const EventFormItem: React.FC<EventFormItemProps> = ({
  field,
  index,
  remove,
  fieldsCount,
  riskCategoryConfig,
  wbsItems,
  companyDeptConfig = []
}) => {

  // 基础布局配置
  const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const rules = [{ required: true, message: '这是必填项' }];
  const form = Form.useFormInstance();
  // 状态管理
  const [selectedSecondId, setSelectedSecondId] = React.useState<number | null>(null);

  const treeData = useMemo(() =>
    arrToTree(riskCategoryConfig, 'id', 'parent_id', 'children', null),
    [riskCategoryConfig]);

  // 详情选项过滤
  const riskCategoryDetails = useMemo(() => {
    if (!selectedSecondId) return [];
    return riskCategoryConfig.filter(item => item.parent_id === selectedSecondId);
  }, [selectedSecondId, riskCategoryConfig]);

  // 处理分类切换
  const handleCategoryChange = (value: number) => {
    setSelectedSecondId(value);

    form.setFieldValue(['events', field.name, 'risk_category_details'], undefined);
  };
  return (
    <Card
      size="small"
      title={`事件记录 ${index + 1}`}
      style={{ marginBottom: 20, border: '1px solid #ddd' }}
      extra={
        fieldsCount > 1 && (
          <Button type="link" danger onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
            删除此条
          </Button>
        )
      }
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'report_unit']} label="填报单位" rules={rules}>
            <TreeSelectComp treeData={wbsItems} />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'report_name']} label="填报人" rules={rules}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'push_unit']} label="报送单位" rules={rules}>
            <TreeSelectComp treeData={wbsItems} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'risk_type']} label="风险类型" rules={rules}>
            <Select placeholder="请选择">
              <Option value="1">风险损失事件</Option>
              <Option value="2">潜在风险损失事件</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'risk_level']} label="风险级别" rules={rules}>
            <Select placeholder="请选择">
              <Option value="1">低度</Option>
              <Option value="2">较低</Option>
              <Option value="3">中度</Option>
              <Option value="4">高度</Option>
              <Option value="5">极高</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'risk_category']} label="风险类别" rules={rules}>
            <Select
              placeholder="请选择风险类别"
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
            >
              {treeData.map((parent: any) => (
                <OptGroup key={parent.id} label={parent.category_name}>
                  {parent.children.map((child: any) => (
                    <Option key={child.id} value={child.id}>
                      {child.category_name}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'risk_category_details']} label="风险类别详情" rules={rules}>
            <Select
              mode="multiple"
              placeholder={selectedSecondId ? "请选择详情" : "请先选择风险类别"}
              style={{ width: '100%' }}
              disabled={!selectedSecondId}
              allowClear
            >
              {riskCategoryDetails.map((item: RiskCategoryConfigItem) => (
                <Option key={item.id} value={item.id}>
                  {item.category_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'risk_events_name']} label="风险事件名称" rules={rules}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'happen_time']} label="发生时间" rules={rules}>
            <DatePicker style={{ width: '100%' }} format="YYYY/MM/DD" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'scene']} label="发生地点" rules={rules}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'is_litigation']} label="是否涉诉" rules={rules}>
            <Select placeholder="请选择">
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'company_dept_id']} label="公司总部业务相关部门" rules={rules}>
            <Select placeholder="请选择" mode="multiple">
              {companyDeptConfig?.map((item: RiskEventDeptItem) => (
                <Option key={item.id} value={item.id}>
                  {item.dict_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* 文本域字段 */}
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'situation_description']} label="当期情况描述">
            <TextArea rows={1} placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'injury_or_damage']} label="可能已造成的损失及影响">
            <TextArea rows={1} placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'reason_analysis']} label="原因分析">
            <TextArea rows={1} placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'counter_measures']} label="已采取的应对措施" rules={rules}>
            <TextArea rows={1} placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...itemLayout} name={[field.name, 'remark']} label="备注">
            <TextArea rows={1} placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
    </Card >
  );
};

export default React.memo(connect()(EventFormItem));