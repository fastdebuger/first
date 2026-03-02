import React, { useEffect, useState } from 'react';
import { message, Space, Spin, DatePicker, Card, Row, Col, Empty } from "antd";
import { connect, useIntl } from 'umi';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import moment from 'moment';
import * as echarts from 'echarts';
import { getWorkTimestamp } from "@/utils/utils-date";

/**
 * 作业许可证管理统计
 * @constructor
 */
const WorkPermitStatistics: React.FC<any> = (props) => {
  const { dispatch } = props;
  const { formatMessage } = useIntl();
  // 控制加载状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 作业许可证管理统计列表数据
  const [workStatistcList, setWorkStatistcList] = useState<any>([]);
  // 初始化为null
  const [dateRange, setDateRange] = useState<any>(null);
  const { RangePicker } = DatePicker;

  // 处理日期变化,用户选择时间后才会出来echarts图标
  const handleDateChange = (dates: any) => {
    if (!dates) {
      setDateRange(null);
      setWorkStatistcList([]); // 清空数据
      return;
    }

    setDateRange(dates);
    
    setIsLoading(true);

    // 转换为秒级时间戳
    const startTimestamp = getWorkTimestamp(dates[0], true);
    const endTimestamp = getWorkTimestamp(dates[1], false);

    dispatch({
      type: 'workLicenseRegister/statisticByWorkContent',
      payload: {
        start_date: startTimestamp,
        end_date: endTimestamp,
        dep_code: localStorage.getItem('auth-default-cpecc-depCode')
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          setIsLoading(false);
          setWorkStatistcList(res.result || []);
        } else {
          setIsLoading(false);
          message.error(res.message || '获取数据失败');
        }
      }
    })
  };

  useEffect(() => {
    // 如果没有选择日期或者没有数据，不渲染图表
    if ( !workStatistcList || workStatistcList.length === 0) {
      return;
    }

    const myChart = echarts.init(document.getElementById('WorkPermitStatistics') as any);
    myChart.clear();

    // 监听窗口调整大小事件
    const resizeListener = () => {
      if (myChart) {
        myChart.resize();
      }
    };
    window.addEventListener("resize", resizeListener);

    // 处理 x轴和y轴的数据
    const workNames = workStatistcList.map((item: any) => item.dict_name);
    const workCounts = workStatistcList.map((item: any) => item.total_count);

    const option = {
      title: {
        text: formatMessage({id: 'WorkPermitStatistics'}),
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        },
        subtext: dateRange && dateRange[0] && dateRange[1] 
          ? `${moment(dateRange[0]).format('YYYY-MM-DD')} 至 ${moment(dateRange[1]).format('YYYY-MM-DD')}`
          : '',
        subtextStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      // 图表的提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        // 自定义提示框显示内容，拿第一个数据项的名称
        formatter: function (params: any) {
          const param = params[0];
          return `${param.name}<br/>数量: ${param.value}`;
        }
      },
      // 图表在页面的位置配置
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '20%',
        containLabel: true
      },
      // 图表X轴的配置参数
      xAxis: {
        type: 'category',
        data: workNames,
        axisLabel: {
          interval: 0,
          fontSize: 14
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      // 图表Y轴的配置参数
      yAxis: {
        type: 'value',
        name: '数量',
        nameTextStyle: {
          fontSize: 12
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ccc'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0'
          }
        }
      },
      series: [
        {
          name: '许可证数量',
          type: 'bar',
          barWidth: '60%',
          data: workCounts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold'
          }
        }
      ]
    };
    myChart.setOption(option);

    // 清理事件监听器和图表实例
    return () => {
      window.removeEventListener("resize", resizeListener);
      myChart.dispose();
    };
  }, [workStatistcList, dateRange]);

  // 渲染作业许可证管理统计dom内容
  const renderChartContent = (dateRange: any, workStatistcList: any[]) => {
    if (!dateRange) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div style={{ marginBottom: 8 }}>请您选择日期范围查看统计数据</div>
            </div>
          }
          style={{
            margin: '80px 0',
            padding: '40px 0'
          }}
        />
      );
    }
    // 如果数据作业许可证管理统计为空显示空状态
    if (workStatistcList.length === 0) {
      return (
        <Empty
          description="当前时间段内暂无数据"
          style={{
            margin: '80px 0',
            padding: '40px 0'
          }}
        />
      );
    }

    return (
      <div
        id='WorkPermitStatistics'
        style={{
          width: '100%',
          height: '450px'
        }}
      />
    );
  };

  return (
    <Spin spinning={isLoading}>
      <Card
        title={
          <Row justify="space-between" align="middle" style={{ width: '100%' }}>
            <Col>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatMessage({id: 'WorkPermitStatistics'})}</span>
            </Col>
            <Col>
              <Space>
                <RangePicker 
                  onChange={handleDateChange}
                  value={dateRange}
                  style={{ width: 250 }}
                />
                
              </Space>
            </Col>
          </Row>
        }
      >
       {renderChartContent(dateRange, workStatistcList)}
      </Card>
    </Spin>
  )
}

export default connect()(WorkPermitStatistics);