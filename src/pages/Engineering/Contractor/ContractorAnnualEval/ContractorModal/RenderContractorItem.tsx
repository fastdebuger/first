import React from "react";

/**
   * 信息项展示用于展示标签值对的信息项并且水平布局
   * 引用configColumns中的contractInfoConfig数据
   * @returns 返回dom
   */
const RenderContractorItem: React.FC<any> = (props: any) => {
  const { label, value, labelWidth = 80 } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: 4 }}>
      {/* 标签区域，显示描述性文本 */}
      <div style={{
        color: 'rgba(0, 0, 0, 0.45)',
        minWidth: labelWidth,
        fontSize: '14px'
      }}>
        {label}
      </div>
      {/* 值区域，显示具体数据内容 */}
      <div style={{
        color: 'rgba(0, 0, 0, 0.85)',
        fontWeight: 500,
        fontSize: '14px'
      }}>
        {value || '-'}
      </div>
    </div>
  )
};
export default RenderContractorItem;
