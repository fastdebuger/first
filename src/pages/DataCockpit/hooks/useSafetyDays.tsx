import { useState, useEffect, useCallback } from 'react';
import { getWorkDay } from '@/services/SafetyGreen/LegalRequirements';

// 定义接口，匹配 API 返回的字段
interface SafetyDayData {
  days: number;
  hour: number;
  coefficient: number;
  headCount: number;
  manHour: string;
  id: string;
}

export const useSafetyDays = (payload = {}) => {
  const [data, setData] = useState<SafetyDayData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkDay({
        sort: "id",
        order: "desc",
        ...payload
      });
      setData(res && Object.keys(res).length > 0 ? res : null);
    } catch (err) {
      console.error("SafetyDay API Error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(payload)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh: fetchData };
};