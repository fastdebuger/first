import React from 'react';

/**
 * 标题
 *  title 必填
 *  color 可选，默认值在参数结构时定义
 */
interface SectionTitleProps {
  title: string;
  color?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  color = '#1890ff'
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      marginTop: '8px',
      padding: '4px 0'
    }}>
      <div style={{
        width: '4px',
        height: '16px',
        backgroundColor: color,
        borderRadius: '2px',
        marginRight: '8px'
      }} />
      <span style={{
        fontWeight: 600,
        fontSize: '15px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '16px' // 保持与色条对齐
      }}>
        {title}
      </span>
    </div>
  );
};

export default SectionTitle;