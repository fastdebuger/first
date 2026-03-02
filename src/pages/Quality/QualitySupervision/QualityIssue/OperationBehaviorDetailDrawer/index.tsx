import React, { useEffect, useState } from 'react';
import { Drawer, Spin, Tag, message } from 'antd';
import { getSafetyInspectionItems } from "@/services/safetyGreen/inspect/qualitySafetyOversight";
import { transformItemsToFormData } from "../qualitySafetyUtils";

/**
 * 作业行为详情数据接口
 */
export interface OperationBehaviorDetailData {
  /** 违反该作业行为人数 */
  count?: number;
  /** 处理方式数组 */
  treatmentMethods?: string[];
  /** 处理方式的下级选项，key为处理方式，value为下级选项数组 */
  treatmentSubMethods?: Record<string, string[]>;
  /** 符合度数据，结构为 { 处理方式: { 下级选项: 符合度百分比 } } */
  compliance?: Record<string, Record<string, string>>;
  /** 作业行为ID */
  behaviorId?: string;
}

/**
 * 作业行为详情抽屉组件Props
 */
export interface OperationBehaviorDetailDrawerProps {
  /** 是否显示抽屉 */
  visible: boolean;
  /** 作业行为名称 */
  behaviorName: string;
  /** 当前行数据 */
  record: any;
  /** 作业行为在数组中的索引 */
  behaviorIndex: number;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * 作业行为详情抽屉组件
 *
 * 用于展示单个作业行为的详细信息，包括：
 * - 违反该作业行为人数
 * - 处理方式
 * - 处理方式的下级选项
 * - 每个下级选项对应的符合度
 *
 * @param props 组件属性
 * @returns 作业行为详情抽屉组件
 */
const OperationBehaviorDetailDrawer: React.FC<OperationBehaviorDetailDrawerProps> = ({
  visible,
  behaviorName,
  record,
  behaviorIndex,
  onClose,
}) => {
  /** 详情数据 */
  const [detailData, setDetailData] = useState<OperationBehaviorDetailData | null>(null);
  /** 加载状态 */
  const [loading, setLoading] = useState(false);

  /**
   * 获取作业行为详情数据
   */
  const fetchDetail = async () => {
    try {
      setLoading(true);

      // 解析operation_behavior_ids
      const operationBehaviorIds = record.operation_behavior_ids
        ? (typeof record.operation_behavior_ids === 'string'
            ? record.operation_behavior_ids.split(',').map((id: string) => id.trim()).filter(Boolean)
            : record.operation_behavior_ids)
        : [];

      const clickedBehaviorId = operationBehaviorIds[behaviorIndex];

      // 判断如果无法获取作业行为ID，则提示并返回
      if (!clickedBehaviorId) {
        message.warning('无法获取作业行为详情');
        setLoading(false);
        return;
      }

      // 调用接口获取详情数据
      const itemsRes = await getSafetyInspectionItems({ id: record.id });
      const { items, items1 } = itemsRes?.result || {};
      const itemsArray = typeof items === 'string' ? JSON.parse(items) : items || [];
      const items1Array = typeof items1 === 'string' ? JSON.parse(items1) : items1 || [];

      // 转换为组件需要的格式
      const operationBehaviorDetails = transformItemsToFormData(
        itemsArray,
        items1Array,
        operationBehaviorIds
      );

      // 只取当前点击的那一项详情数据
      const currentDetail = operationBehaviorDetails[behaviorIndex] || null;

      // 判断如果存在详情数据，则设置状态
      if (currentDetail) {
        setDetailData({
          ...currentDetail,
          behaviorId: clickedBehaviorId,
        });
      } else {
        message.warning('暂无详情数据');
        setDetailData(null);
      }
    } catch (error) {
      message.error('获取作业行为详情失败');
      setDetailData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取作业行为详情数据
   */
  useEffect(() => {
    // 判断如果抽屉不可见或没有记录ID，则不执行
    if (!visible || !record?.id) {
      setDetailData(null);
      return;
    }

    fetchDetail();
  }, [visible, record, behaviorIndex]);

  /**
   * 渲染详情内容
   */
  const renderContent = () => {
    // 判断如果正在加载，则显示加载状态
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      );
    }

    // 判断如果没有详情数据，则显示无数据状态
    if (!detailData) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          暂无详情数据
        </div>
      );
    }

    // 检查是否有有效数据
    const hasTreatmentMethods = detailData.treatmentMethods && detailData.treatmentMethods.length > 0;
    const hasTreatmentSubMethods = detailData.treatmentSubMethods && Object.keys(detailData.treatmentSubMethods).length > 0;

    // 判断如果既没有处理方式也没有下级选项，显示空状态
    if (!hasTreatmentMethods && !hasTreatmentSubMethods) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          暂无详情数据
        </div>
      );
    }

    return (
      <div style={{ padding: '16px' }}>
        {/* 违反该作业行为人数 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 600, color: '#333' }}>
            <span style={{ color: '#ff4d4f' }}>*</span> 违反该作业行为人数:
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>
            {detailData.count ?? '-'}
          </div>
        </div>

        {/* 处理方式 */}
        {hasTreatmentMethods && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 600, color: '#333' }}>
              <span style={{ color: '#ff4d4f' }}>*</span> 处理方式:
            </div>
            <div>
              {detailData.treatmentMethods!.map((method: string, idx: number) => (
                <Tag
                  key={idx}
                  color="blue"
                  style={{ marginBottom: '8px', fontSize: '14px', padding: '4px 12px' }}
                >
                  {method}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* 处理方式下级选项及符合度 */}
        {hasTreatmentSubMethods && (
          <div>
            {Object.keys(detailData.treatmentSubMethods!).map((treatmentMethod: string) => {
              const subMethods = detailData.treatmentSubMethods![treatmentMethod] || [];
              const compliance = detailData.compliance?.[treatmentMethod] || {};

              return (
                <div
                  key={treatmentMethod}
                  style={{
                    marginBottom: '24px',
                    border: '1px solid #e8e8e8',
                    padding: '16px',
                    borderRadius: '4px'
                  }}
                >
                  {/* 处理方式标题 */}
                  <div style={{ marginBottom: '12px', fontWeight: 600, color: '#333', fontSize: '14px' }}>
                    {treatmentMethod} - 下级选项:
                  </div>

                  {/* 下级选项列表 */}
                  <div style={{ marginBottom: '16px' }}>
                    {subMethods.map((subMethod: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: '12px',
                          padding: '12px',
                          backgroundColor: '#fafafa',
                          borderRadius: '4px'
                        }}
                      >
                        {/* 下级选项名称 */}
                        <div style={{ marginBottom: '8px', fontWeight: 500, color: '#666' }}>
                          {subMethod}
                        </div>

                        {/* 符合程度 */}
                        {/* 判断如果该下级选项有符合程度数据，则显示 */}
                        {compliance[subMethod] && (
                          <div>
                            <span style={{ color: '#666', marginRight: '8px' }}>符合程度:</span>
                            <Tag color="green" style={{ fontSize: '14px' }}>
                              {compliance[subMethod]}%
                            </Tag>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Drawer
      title={`${behaviorName} - 作业行为详情`}
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
    >
      {renderContent()}
    </Drawer>
  );
};

export default OperationBehaviorDetailDrawer;

