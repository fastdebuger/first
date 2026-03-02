import React from 'react';
import {configColumns} from "@/pages/Engineering/Month/MonthlyReport/columns";
import {BasicTableColumns} from "yayang-ui";
import { Card, Col, Collapse, Row, Tag } from 'antd';
import { useIntl } from 'umi';
import {showTS} from "@/utils/utils-date";

const ShowProjectContractInfo = ({selectedRecord}: any) => {
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns)
      .initTableColumns([
        // 'id',
        // 'form_code',
        // 'monthly_report_start', // 月报日期开始 -》 报告日期
        // 'monthly_report_end', // 月报日期结束 -〉 报告日期
        // 'report_dep_code', // 填报单位 -》 上报单位
        'project_manager',
        'manager_phone',
        // 'project_status',
        // 'project_status_date', // 项目状态日期-》实际完成日期
        'contract_start_date',
        'contract_end_date',
        'plan_finish_date',

        // 'change_complete_date',
        // 'change_date',
        // 'change_reason',

        'currency',
        'contract_say_price',
        'contract_un_say_price',
        Number(selectedRecord.region_category) === 1 ? 'equivalent_RMB_price' : '',
        Number(selectedRecord.region_category) === 1 ? 'equivalent_RMB_un_price' : '',
        'contract_mode_name',
        'project_level_name',
        'construction_dep',
        'project_subject',
        'project_quantities',
      ]) .setTableColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'contract_end_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'plan_finish_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'contract_sign_date', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .getNeedColumns();
    console.log("cols----", cols);
    return cols;
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1']} ghost style={{marginLeft: -16}}>
        <Collapse.Panel header={(
          <>
            <strong style={{fontSize: 16}}>项目及合同信息</strong>
            <Tag style={{marginLeft: 16}} color={'green'}>地域：{Number(selectedRecord.region_category === 0) ? '国内' : '国外'}</Tag>
          </>
        )} key="1">
          <Card
            style={{
              marginTop: -16
            }}
            bodyStyle={{
              padding: '16px',
            }}
          >
            <Row>
              {getTableColumns().map((col: any) => {
                if ('equivalent_RMB_price' === col.dataIndex) {
                  const exchangeRateRmb = Number(selectedRecord.exchange_rate_rmb || 0);
                  const contractSayPrice = Number(selectedRecord.contract_say_price || 0);
                  return (
                    <Col key={col.dataIndex} span={6}>
                      <span>{formatMessage({ id: col.title })}</span>: <strong>
                        { exchangeRateRmb * contractSayPrice }
                      </strong>
                    </Col>
                  )
                }
                if ('equivalent_RMB_un_price' === col.dataIndex) {
                  const exchangeRateRmb = Number(selectedRecord.exchange_rate_rmb || 0);
                  const contractUnSayPrice = Number(selectedRecord.contract_un_say_price || 0);
                  return (
                    <Col key={col.dataIndex} span={6}>
                      <span>{formatMessage({ id: col.title })}</span>: <strong>
                      { exchangeRateRmb * contractUnSayPrice }
                    </strong>
                    </Col>
                  )
                }
                if (['project_subject',
                  'project_quantities'].includes(col.dataIndex)) {
                  return (
                    <Col key={col.dataIndex} span={24}>
                      <span>{formatMessage({ id: col.title })}</span>: <strong>{selectedRecord[col.dataIndex] || '--'}</strong>
                    </Col>
                  )
                }
                if (col.valueType === 'dateTs') {
                  return (
                    <Col key={col.dataIndex} span={6}>
                      <span>{formatMessage({ id: col.title })}</span>: <strong>{ showTS(Number(selectedRecord[col.dataIndex]) || 0, 'YYYY-MM-DD')}</strong>
                    </Col>
                  )
                }
                return (
                  <Col key={col.dataIndex} span={6}>
                    <span>{formatMessage({ id: col.title })}</span>: <strong>{selectedRecord[col.dataIndex] || '--'}</strong>
                  </Col>
                )
              })}
            </Row>
          </Card>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ShowProjectContractInfo;
