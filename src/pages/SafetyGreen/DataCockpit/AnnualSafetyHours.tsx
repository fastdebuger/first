import React, { useEffect, useMemo, useState } from 'react';
import { Card } from 'antd';
import { getWorkAnnual } from '@/services/SafetyGreen/LegalRequirements';



/**
 * 年度安全工时
 * @returns 
 */
const AnnualSafetyHours: React.FC = () => {
  // 用于存储连续安全生产天数
  const [annualSafetyHoursDays, setAnnualSafetyHoursDays] = useState<{
    total: number,
    coefficient: number,
    headCount: number,
    manHour: number,
    id: string,
    activation_type: string,
    safety_annual_hour: string,
  } | null>(null);
  // 加载状态
  const [loading, setLoading] = useState(false);
  /**
   * 根据日期数据请求
   */
  useEffect(() => {
    getWorkDayFun();
  }, []);

  /**
   * 获取连续安全工作时间
   */
  const getWorkDayFun = async () => {
    setLoading(true);
    setAnnualSafetyHoursDays(null);
    getWorkAnnual({
      sort: "id",
      order: "desc"
    })
      .then((res: any) => {
        setAnnualSafetyHoursDays(res || null);
      })
      .catch((err) => {
        console.error("API Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 计算年度安全工时统计
  const displayHours = useMemo(() => {
    if (!annualSafetyHoursDays) return '—';
    const { activation_type, total, safety_annual_hour } = annualSafetyHoursDays;
    const value = String(activation_type) === "1" ? total : safety_annual_hour;
    return value ?? "0";
  }, [annualSafetyHoursDays]);



  return (
    <Card
      loading={loading}
      title="年度安全工时"
      extra={null}
      bordered={true}
      style={{
        background: '#ffffff',
        borderRadius: 12,
        height: "300px",
        // width: '100%',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 连续安全生产记录行 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}>
          {/* 左侧系数 */}
          <span style={{
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            统计：
          </span>
          {/* 右侧数值 */}
          <span style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#4b5563'
          }}>
            {displayHours} 小时
          </span>
        </div>
      </div>
    </Card>
  )
}


export default AnnualSafetyHours