import { useState, useEffect, useCallback } from 'react';
import { getWorkAnnual } from '@/services/SafetyGreen/LegalRequirements';

// 定义返回的数据接口
interface SafetyHoursData {
  total: number;
  coefficient: number;
  headCount: number;
  manHour: number;
  id: string;
}

export const useAnnualSafetyHours = (payload = {}) => {
  const [data, setData] = useState<SafetyHoursData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkAnnual({
        sort: "id",
        order: "desc",
        ...payload
      });
      setData(res || null);
    } catch (err) {
      console.error("API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(payload)]); // 仅在参数发生变化时重新生成函数

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData // 暴露刷新方法
  };
};