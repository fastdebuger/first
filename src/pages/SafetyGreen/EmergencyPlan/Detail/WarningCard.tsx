import React from 'react';
import { WarningData } from './WarningList';
import { useIntl } from 'umi';


interface WarningCardProps {
  data: WarningData;
  [key: string]: any
}

// 根据 level_rgb 字段提供不同的背景色
const levelColorMap: { [key: string]: string } = {
  red: '#f56565',
  orange: '#ed8936',
  yellow: '#ecc94b',
  blue: '#4299e1',
  default: '#cbd5e0',
};



// 渲染详细信息项
const DetailItem: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
  <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #e5e7eb', }}>
    <strong style={{ color: '#1f2937' }}>{label}</strong>
    <p style={{
      fontSize: '1em',
      color: '#4b5563',
      lineHeight: '1.4',
      margin: '4px 0 0 0'
    }}>
      {value}
    </p>
  </div>
);


/**
 * 卡片容器
 * @param param
 * @returns 
 */
const WarningCard: React.FC<WarningCardProps> = ({ data }) => {
  // 获取数字级别
  const levelNumber = data.level_code;
  const color = levelColorMap[data.level_rgb] || levelColorMap.default;
  const { formatMessage } = useIntl();
  // 展示字段
  const additionalDetails = [
    { label: formatMessage({ id: "emergencyplan.description" }), value: data.description },
    { label: formatMessage({ id: "emergencyplan.response_preparation" }), value: data.response_preparation },
    { label: formatMessage({ id: "emergencyplan.verification_analysis" }), value: data.verification_analysis },
    { label: formatMessage({ id: "emergencyplan.message_source" }), value: data.message_source },
    { label: formatMessage({ id: "emergencyplan.warning_release" }), value: data.warning_release },
    { label: formatMessage({ id: "emergencyplan.push_level_and_scope" }), value: data.push_level_and_scope },
    { label: formatMessage({ id: "emergencyplan.possible_accident" }), value: data.possible_accident },
    { label: formatMessage({ id: "emergencyplan.report_path" }), value: data.report_path },
    { label: formatMessage({ id: "emergencyplan.termination_condition" }), value: data.termination_condition },
    { label: formatMessage({ id: "emergencyplan.follow_up_requirements" }), value: data.follow_up_requirements },
    { label: formatMessage({ id: "emergencyplan.social_resource" }), value: data.social_resource },
    { label: formatMessage({ id: "emergencyplan.social_resource_contact" }), value: data.social_resource_contact },
    { label: formatMessage({ id: "emergencyplan.social_resource_estimate" }), value: data.social_resource_estimate },
    { label: formatMessage({ id: "emergencyplan.disposal_process" }), value: data.disposal_process },
  ];

  return (
    <div style={{
      border: `1px solid ${color}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 头部信息 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        marginBottom: '12px'
      }}>
        <h3 style={{
          margin: 0,
          color: color
        }}>
          🚨 {data.level_name}
          {/* 使用转换后的数字级别 */}
          {levelNumber && <span style={{ marginLeft: '10px', fontSize: '0.8em', fontWeight: 'normal' }}>({levelNumber})</span>}
        </h3>
      </div>

      {additionalDetails.map((detail, index) => (
        <DetailItem key={index} label={detail.label} value={detail.value} />
      ))}

    </div>
  );
};

export default WarningCard;