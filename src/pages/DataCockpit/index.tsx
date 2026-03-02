import React, { useState, useLayoutEffect, useMemo } from 'react';
import { Statistic } from 'antd';
import CardBox from './Card';
import ChartItem from './ChartItem';
import { getOptions } from './options';
import Header from './Header';
import { useAnnualSafetyHours } from './hooks/useAnnualSafetyHours';
import { useSafetyDays } from './hooks/useSafetyDays';

/**
 * 数据驾驶舱
 * @returns
 */
const GridDashboard: React.FC = () => {

  // 获取年度工时数据
  const { data: annualData } = useAnnualSafetyHours();
  // 获取连续安全天数数据
  const { data: safetyDayData } = useSafetyDays();

  const options = useMemo(() => {
    return getOptions({
      safetyHours: {
        annual: annualData,       // 年度工时
        continuous: safetyDayData // 连续天数
      }
    });
  }, [annualData, safetyDayData]);

  // 定义基准尺寸
  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 1080;

  const [scale, setScale] = useState({ x: 1, y: 1 });

  // 计算比例
  const handleResize = () => {
    const widthRatio = window.innerWidth / DESIGN_WIDTH;
    const heightRatio = window.innerHeight / DESIGN_HEIGHT;
    setScale({ x: widthRatio, y: heightRatio });
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: "#010812",
      overflow: 'hidden',
      position: 'relative',
      color: "#FFF"
    }}>
      <div style={{
        width: `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale.x}, ${scale.y})`,
        transformOrigin: 'center center',
        transition: 'all 0.3s ease',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <Header />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '30px', height: '100%' }}>
          {/* 左侧 */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '20px' }}>
            <CardBox><ChartItem option={options.projectCount} /></CardBox>
            <CardBox><ChartItem option={options.staffDistribution} /></CardBox>
            <CardBox><ChartItem option={options.pipeProgress} /></CardBox>
          </div>

          {/* 中间看板 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%'
          }}>
            <div
              style={{
                flex: 1,
                alignContent: "center"
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                width: '100%',
                textAlign: 'center',
                padding: '20px 0',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <Statistic title={<div style={{ color: '#aaa' }}>总投资(亿)</div>} value={128.5} precision={2} valueStyle={{ color: '#00f2ff', display: 'flex', justifyContent: 'center' }} />
                <Statistic title={<div style={{ color: '#aaa' }}>在岗人员</div>} value={3502} valueStyle={{ color: '#fff', display: 'flex', justifyContent: 'center' }} />
                <Statistic title={<div style={{ color: '#aaa' }}>安全天数</div>} value={safetyDayData?.days} valueStyle={{ color: '#52c41a', display: 'flex', justifyContent: 'center' }} />
              </div>
            </div>

          </div>

          {/* 右侧 */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '20px' }}>
            <CardBox><ChartItem option={options.issueStats} /></CardBox>
            <CardBox><ChartItem option={options.safetyHours} /></CardBox>
            <CardBox><ChartItem option={options.marketDev} /></CardBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridDashboard;
