import React, { ReactNode, useEffect, useState } from 'react';
import { Card } from 'antd';
import { getWorkDay } from '@/services/SafetyGreen/LegalRequirements';


/**
 * 安全生产记录展示组件
 * @returns 
 */

type IDaysProps = {
  days: number,
  hour: number,
  start_date: string,
  id: string,
  activation_type: string,
  bestRecordNum: string
}
const SafetyRecordDisplay: React.FC = () => {
  // 用于存储连续安全生产天数
  const [continuousSafetyDays, setcontinuousSafetyDays] = useState<IDaysProps | null>(null);
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
    setcontinuousSafetyDays(null);
    getWorkDay({
      sort: "id",
      order: "desc"
    })
      .then((res: any) => {
        setcontinuousSafetyDays(res || null);
      })
      .catch((err) => {
        console.error("API Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  /**
   * 1. 定义数据接口，确保字段清晰
   */
  interface IDaysProps {
    activation_type?: string | number;
    days?: string | number;
    hour?: string | number;
    bestRecordNum?: string | number;
    [key: string]: any; // 兼容后端其他字段
  }

  interface IOptions {
    hour?: boolean;
    loading?: boolean;
  }


  type RenderPlugin = (data: IDaysProps, opts: IOptions) => ReactNode;

  const FORMAT_STRATEGIES: Record<string, RenderPlugin> = {
    // 计算模式
    "1": (data, opts) => {
      const { days = "0", hour } = data;
      const hourText = opts.hour && hour ? `${hour}小时` : "";
      return `${days}天${hourText}`;
    },
    // 配置模式
    "2": (data) => {
      return `${data.bestRecordNum || "0"}天`;
    }
  };

  /**
   * 渲染内容
   * @param days 
   * @param options 
   * @param loading 
   * @returns 
   */
  const DaysPropsFn = (
    days: IDaysProps | null,
    options: IOptions = {},
  ): ReactNode => {
    const { hour = false, loading = false } = options;

    if (days === null) return loading ? '' : '—';

    if (!days || Object.keys(days).length === 0) {
      return (
        <span style={{ fontSize: 16, fontWeight: "normal", color: '#999' }}>
          暂无配置，请联系管理员
        </span>
      );
    }

    const typeKey = String(days.activation_type);
    const renderFn = FORMAT_STRATEGIES[typeKey];

    return renderFn ? renderFn(days, { hour }) : '—';
  };

  return (
    <Card
      loading={loading}
      title="连续安全工日"
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
          {/* 左侧标签 (连续安全生产) */}
          <span style={{
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            连续安全生产：
          </span>

          {/* 右侧数值 (天数) */}
          <span style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#4b5563'
          }}>
            {
              DaysPropsFn(continuousSafetyDays as IDaysProps, { hour: true, loading })
            }
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}>
          {/* 左侧标签 (连续安全生产) */}
          <span style={{
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            历史最好记录：
          </span>

          {/* 右侧数值 (天数) */}
          <span style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#4b5563'
          }}>
            {
              DaysPropsFn(continuousSafetyDays as IDaysProps, { loading })
            }
          </span>
        </div>

      </div>
    </Card>
  )
}


export default SafetyRecordDisplay