import { message } from 'antd';
import moment from 'moment';

/**
 * 图表下载工具函数
 * @param chartRef - ReactECharts 组件的 ref 引用
 * @param filename - 下载的文件名（不含扩展名）
 */
export const downloadChart = (chartRef: any, filename: string) => {
  const hasChartRef = chartRef?.current;

  !hasChartRef && (() => {
    message.error('图表未初始化');
    return;
  })();

  hasChartRef && (() => {
    const chartInstance = chartRef.current.getEchartsInstance();
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });

    const link = document.createElement('a');
    link.download = `${filename}_${moment().format('YYYY-MM-DD')}.png`;
    link.href = url;
    link.click();
    message.success('图表下载成功');
  })();
};

/**
 * 构建时间戳参数
 * @param timePeriod - 时间段数组
 * @returns 包含 mints 和 maxts 的参数对象
 */
export const buildTimeParams = (timePeriod?: [moment.Moment, moment.Moment]) => {
  const params: any = {};
  const hasTimePeriod = timePeriod && timePeriod.length === 2;

  hasTimePeriod && (() => {
    params.mints = timePeriod[0]?.unix();
    params.maxts = timePeriod[1]?.unix();
  })();

  return params;
};

/**
 * 默认时间范围：年初至今
 * @returns 默认时间段数组
 */
export const getDefaultTimePeriod = (): [moment.Moment, moment.Moment] => {
  return [moment().startOf('year'), moment()];
};


