import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, DatePicker, Table, Spin, Row, Col } from "antd";
import { connect, useIntl } from 'umi';
import { ErrorCode } from "@/common/const";
import moment from "moment";
import { MonthlyPlanProcessData, getWebParam } from "@/utils/utils";
import { configColumns } from "./columns";
import IframeModal from "@/components/IframeComponent";
import { getTimeZoneParam } from "@/utils/utils-date";

/**
 * 月度施工计划
 * @constructor
 */
const MonthlyConstructPlan: React.FC<any> = (props) => {
  const { dispatch } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 获取月度施工计划表格的默认当前参数
  const [defaultCurrent, setDefaultCurrent] = useState<any>(moment().format('YYYY-MM'));
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 表格数据
  const [tableColumns, setTableColumns] = useState<any>([]);

  const [iframeVisible, setIframeVisible] = useState<boolean>(false);
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  const [iframeTitle, setIframeTitle] = useState<string | null>(null);
  const isProduction = process.env.BUILD_ENV === 'pro';

  useEffect(() => {
    setIsLoading(true);
    dispatch({
      type: 'workLicenseRegister/getOutputValuePlanByMonth',
      payload: {
        sort: 'sortkey',
        order: 'asc',
        belong_month: defaultCurrent || undefined
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          // 处理数据，将相同sortkey的数据分组
          const processedData = MonthlyPlanProcessData(res.rows);
          setTableColumns(processedData || []);
        }
        setIsLoading(false);
      }
    })
  }, [defaultCurrent]);
  /**
   * 日期选择器的值发生变化时，更新默认当前日期并重新加载表格数据
   * @param _date 
   * @param dateString 
   */
  const handleChangeDate = (_date: any, dateString: any) => {
    setDefaultCurrent(dateString);
    if (actionRef.current) {
      actionRef.current.reloadTable();
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Spin spinning={isLoading} tip={'加载中，请稍后...'}>
        <Row justify="space-between" align="middle">
          <Col>
            <strong style={{ fontSize: '18px', display: 'block' }}>{formatMessage({ id: 'MonthlyConstructPlan' })}</strong>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  const tz = getTimeZoneParam();
                  const belongMonth = defaultCurrent || moment().format('YYYY-MM');
                  // 构建报表URL，添加tz和belong_month参数
                  let baseUrl;
                  if (isProduction) {
                    // 正式环境
                    baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/SCplan.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  } else {
                    // 测试/本地环境
                    baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/SCplan.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  }
                  setIframeVisible(true);
                  setIframeTitle('施工生产计划');
                  setPrintUrl(baseUrl);
                }}
              >
                施工生产计划报表
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  const tz = getTimeZoneParam();
                  const belongMonth = defaultCurrent || moment().format('YYYY-MM');
                  // 构建报表URL，添加tz和belong_month参数
                  let baseUrl;
                  if (isProduction) {
                    // 正式环境
                    baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/CZplan.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  } else {
                    // 测试/本地环境
                    baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/CZplan.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  }
                  setIframeVisible(true);
                  setIframeTitle('施工产值计划');
                  setPrintUrl(baseUrl);
                }}
              >
                施工产值计划报表
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  const tz = getTimeZoneParam();
                  const belongMonth = defaultCurrent || moment().format('YYYY-MM');
                  // 构建报表URL，添加tz和belong_month参数
                  let baseUrl;
                  if (isProduction) {
                    // 正式环境
                    baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/PF.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  } else {
                    // 测试/本地环境
                    baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/PF.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  }
              
                  setIframeVisible(true);
                  setIframeTitle('施工生产统计');
                  setPrintUrl(baseUrl);
                }}
              >
                施工生产统计报表
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  const tz = getTimeZoneParam();
                  const belongMonth = defaultCurrent || moment().format('YYYY-MM');
                  // 构建报表URL，添加tz和belong_month参数
                  let baseUrl;
                  if (isProduction) {
                    // 正式环境
                    baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Cov-statistics.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  } else {
                    // 测试/本地环境
                    baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Cov-statistics.cpt&tz=${tz}&belong_month=${belongMonth}`;
                  }
              
                  setIframeVisible(true);
                  setIframeTitle('施工产值统计报表');
                  setPrintUrl(baseUrl);
                }}
              >
                施工产值统计报表
              </Button>
            </Space>

          </Col>
        </Row>

        <Space style={{ padding: '16px 0' }}>
          <DatePicker
            defaultValue={moment()}
            style={{ width: 200 }}
            onChange={handleChangeDate}
            picker="month"
            format="YYYY-MM"
          />

        </Space>
        <Table
          columns={configColumns}
          bordered
          size='small'
          scroll={{ y: 'calc(100vh - 360px)' }}
          dataSource={tableColumns}
          pagination={false}
          rowKey="key"
        />
      </Spin>
      {iframeVisible && printUrl && (
        <IframeModal
          visible={iframeVisible}
          cancel={() => {
            setIframeVisible(false);
            setPrintUrl('');
          }}
          title={iframeTitle || ''}
          url={printUrl}
        />
      )}
    </div>
  )
}
export default connect()(MonthlyConstructPlan);