import React from 'react';
import { Form, InputNumber, Select, Space, Row, Col } from 'antd';

interface OperationBehaviorItem {
  id: string;
  name: string;
}

interface TreatmentMethod {
  value: string;
  name: string;
  subMethods: Array<{ value: string; name: string }>;
}

interface OperationBehaviorFormProps {
  selectedBehaviors: string[]; // 选中的作业行为ID数组
  behaviorOptions: OperationBehaviorItem[]; // 所有作业行为选项
  treatmentMethods: TreatmentMethod[]; // 处理方式及其下级选项
  percentOptions: Array<{ value: string; name: string }>; // 符合程度选项
  form: any; // Form 实例
}

/**
 * 作业行为表单组件
 * 处理作业行为相关的级联表单逻辑
 */
const OperationBehaviorForm: React.FC<OperationBehaviorFormProps> = ({
  selectedBehaviors,
  behaviorOptions,
  treatmentMethods,
  percentOptions,
  form,
}) => {
  // 根据ID获取行为名称
  const getBehaviorName = (id: string) => {
    const behavior = behaviorOptions.find(item => String(item.id) === String(id));
    return behavior?.name || `选项${id}`;
  };

  // 处理方式选项
  const treatmentMethodOptions = treatmentMethods.map(method => ({
    value: method.value,
    label: method.name,
  }));

  // 根据处理方式获取下级选项
  const getSubMethodOptions = (treatmentMethod: string) => {
    const method = treatmentMethods.find(m => m.value === treatmentMethod);
    return method?.subMethods || [];
  };

  // 判断如果没有选择作业行为，不显示任何内容
  if (!selectedBehaviors || selectedBehaviors.length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {selectedBehaviors.map((behaviorId, index) => {
          const behaviorName = getBehaviorName(behaviorId);

          return (
            <Col key={behaviorId} xs={24} sm={24} md={12} lg={8} xl={8}>
              <div style={{ height: '100%', padding: 16, border: '1px solid #f0f0f0', borderRadius: 4, backgroundColor: '#fafafa' }}>
                <h4 style={{ marginBottom: 16, color: '#1890ff', fontSize: 14, fontWeight: 600 }}>{behaviorName}</h4>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {/* 违反该作业行为人数 */}
                  <Form.Item
                    name={[`operation_behavior_details`, index, 'count']}
                    label="违反该作业行为人数"
                    rules={[{ required: true, message: '请输入违反该作业行为人数' }]}
                  >
                    <InputNumber
                      min={0}
                      placeholder={`请输入${behaviorName}的违反人数`}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  {/* 处理方式（多选） */}
                  <Form.Item
                    name={[`operation_behavior_details`, index, 'treatmentMethods']}
                    label="处理方式"
                    rules={[{ required: true, message: '请选择处理方式' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder={`请选择${behaviorName}的处理方式`}
                      options={treatmentMethodOptions}
                      onChange={(values) => {
                        // 当处理方式变化时，清空对应的下级选项和符合程度
                        const currentDetails = form.getFieldValue('operation_behavior_details') || [];
                        if (currentDetails[index]) {
                          currentDetails[index].treatmentSubMethods = {};
                          currentDetails[index].compliance = {};
                          form.setFieldsValue({
                            operation_behavior_details: currentDetails,
                          });
                        }
                      }}
                    />
                  </Form.Item>

                  {/* 处理方式下级（根据选中的处理方式动态显示）及对应的符合程度 */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                      const prevMethods = prevValues?.operation_behavior_details?.[index]?.treatmentMethods || [];
                      const currentMethods = currentValues?.operation_behavior_details?.[index]?.treatmentMethods || [];
                      const prevSubMethods = prevValues?.operation_behavior_details?.[index]?.treatmentSubMethods || {};
                      const currentSubMethods = currentValues?.operation_behavior_details?.[index]?.treatmentSubMethods || {};
                      return (
                        JSON.stringify(prevMethods) !== JSON.stringify(currentMethods) ||
                        JSON.stringify(prevSubMethods) !== JSON.stringify(currentSubMethods)
                      );
                    }}
                  >
                      {({ getFieldValue }) => {
                      const selectedTreatmentMethods = getFieldValue(['operation_behavior_details', index, 'treatmentMethods']) || [];

                      // 判断如果没有选择处理方式，不显示任何内容
                      if (selectedTreatmentMethods.length === 0) {
                        return null;
                      }

                      return (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          {selectedTreatmentMethods.map((treatmentMethod: string) => {
                            const subMethodOptions = getSubMethodOptions(treatmentMethod);
                            // 判断如果该处理方式没有下级选项，不显示任何内容
                            if (subMethodOptions.length === 0) {
                              return null;
                            }

                            // 获取当前选中的下级选项
                            const selectedSubMethods = getFieldValue(['operation_behavior_details', index, 'treatmentSubMethods', treatmentMethod]) || [];

                            return (
                              <div key={treatmentMethod} style={{ border: '1px solid #e8e8e8', padding: 12, borderRadius: 4 }}>
                                {/* 处理方式下级选项（多选） */}
                                <Form.Item
                                  name={[`operation_behavior_details`, index, 'treatmentSubMethods', treatmentMethod]}
                                  label={`${treatmentMethod} - 下级选项`}
                                  rules={[{ required: true, message: `请选择${treatmentMethod}的下级选项` }]}
                                >
                                  <Select
                                    mode="multiple"
                                    placeholder={`请选择${treatmentMethod}的下级选项`}
                                    options={subMethodOptions.map(item => ({
                                      value: item.value,
                                      label: item.name,
                                    }))}
                                    onChange={(values) => {
                                      // 当下级选项变化时，清空已取消选中的下级选项对应的符合程度
                                      const currentDetails = form.getFieldValue('operation_behavior_details') || [];
                                      // 判断当前索引的详情是否存在
                                      if (currentDetails[index]) {
                                        // 判断并确保 compliance 对象存在
                                        if (!currentDetails[index].compliance) {
                                          currentDetails[index].compliance = {};
                                        }
                                        // 判断并确保当前处理方式的 compliance 对象存在
                                        if (!currentDetails[index].compliance[treatmentMethod]) {
                                          currentDetails[index].compliance[treatmentMethod] = {};
                                        }

                                        const compliance = currentDetails[index].compliance[treatmentMethod];
                                        // 移除已取消选中的下级选项的符合程度
                                        Object.keys(compliance).forEach(subMethod => {
                                          // 判断如果当前下级选项不在新选中的值中，则删除其符合程度
                                          if (!values.includes(subMethod)) {
                                            delete compliance[subMethod];
                                          }
                                        });

                                        form.setFieldsValue({
                                          operation_behavior_details: currentDetails,
                                        });
                                      }
                                    }}
                                  />
                                </Form.Item>

                                {/* 每个下级选项对应的符合程度 */}
                                {/* 判断如果选中的下级选项数量大于0，则显示符合程度选择器 */}
                                {selectedSubMethods.length > 0 && (
                                  <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 12 }}>
                                    {selectedSubMethods.map((subMethod: string) => {
                                      const subMethodName = subMethodOptions.find(item => item.value === subMethod)?.name || subMethod;
                                      return (
                                        <Form.Item
                                          key={subMethod}
                                          name={[`operation_behavior_details`, index, 'compliance', treatmentMethod, subMethod]}
                                          label={`${subMethodName} - 符合程度`}
                                          rules={[{ required: true, message: `请选择${subMethodName}的符合程度` }]}
                                          style={{ marginBottom: 0 }}
                                        >
                                          <Select
                                            placeholder={`请选择${subMethodName}的符合程度`}
                                            options={percentOptions.map(item => ({
                                              value: item.value,
                                              label: item.name,
                                            }))}
                                          />
                                        </Form.Item>
                                      );
                                    })}
                                  </Space>
                                )}
                              </div>
                            );
                          })}
                        </Space>
                      );
                    }}
                  </Form.Item>
                </Space>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default OperationBehaviorForm;

