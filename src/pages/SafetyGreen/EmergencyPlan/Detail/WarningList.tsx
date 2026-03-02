import React from 'react';
import WarningCard from './WarningCard';
export interface WarningData {
  id: number;
  form_no: string;
  level_name: string;
  level_rgb: string;
  level_code: string;
  description: string;
  response_preparation: string;
  follow_up_requirements: string;
  message_source: string;
  possible_accident: string;
  push_level_and_scope: string;
  report_path: string;
  social_resource: string;
  social_resource_contact: string;
  social_resource_estimate: string;
  termination_condition: string;
  verification_analysis: string;
  warning_release: string;
  disposal_process: string;
}

// 定义卡片组件的属性
interface WarningCardProps {
  initialData: WarningData[];
}

/**
 * 气象预警级别详情
 * @param props 
 * @returns 
 */
const WarningList: React.FC<WarningCardProps> = (props) => {
  const { initialData } = props;
  const data = initialData;

  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9fafb'
    }}>
      <h2>
        气象事件分级详情
        <span style={{ marginLeft: '10px', fontSize: '0.8em', fontWeight: 'normal' }}>(共{initialData.length}条)</span>
      </h2>
      {data.map((item) => (
        <WarningCard key={item.id} data={item} />
      ))}
    </div>
  );
};

export default WarningList;