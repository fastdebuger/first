import React from 'react';
import {configColumns} from "@/pages/Contract/Income/columns";
import {BasicTableColumns} from "yayang-ui";
import { Card, Col, Collapse, Row, Tag } from 'antd';
import { useIntl } from 'umi';
import {showTS} from "@/utils/utils-date";

const ShowProjectContractInfo = ({selectedRecord}: any) => {
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns)
      .initTableColumns([
        "contract_no",
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "specialty_type_str",
        "revenue_method_str",
        "relative_person_code",
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
            {/* 因为 备选表 没有字段 暂时注释 */}
            {/*<Tag style={{marginLeft: 16}} color={'green'}>地域：{Number(selectedRecord.region_category === 0) ? '国内' : '国外'}</Tag>*/}
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
