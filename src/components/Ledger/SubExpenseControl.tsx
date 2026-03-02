import React from 'react';
import { Row, Col, Typography } from 'antd';
import ProgressPayment from './ProgressPayment';
import BusinessVisa from './BusinessVisa';
import BalanceOfAccounts from './BalanceOfAccounts';
import { connect } from 'umi';
import { SUB_CONTRACT_LABEL } from '@/common/const';

const { Title, Text } = Typography;

/**
 * 分包合同控制组件 (SubExpenseControl)
 * 用于展示和管理选定分包合同相关的费用信息，包括合同金额、进度款、签证和结算信息。
 * @param {object} props - 组件属性
 * @param {object} props.selectedRecord - 当前选中的分包合同记录对象
 */
const SubExpenseControl = (props: any) => {
  const { selectedRecord } = props;

  return (
    <>
      {/* 顶部信息展示区域 */}
      <Row>
        {/* 合同金额展示列 */}
        <Col span={4}>
          {/* 合同金额数值，使用 Title 组件，并设置样式 */}
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}
          >
            {/* 显示合同金额，如果 selectedRecord.contract_say_price 不存在则显示 0 */}
            {selectedRecord?.contract_say_price ?? 0}元
          </Title>
          {/* 合同金额标签，使用 Text 组件 */}
          <Text type="secondary" style={{ fontSize: 12 }}>合同金额</Text>
        </Col>
        {/* 理论上这里可以有其他 Col 展示其他关键信息 */}
      </Row>

      {/* 详细信息展示区域 */}
      <div style={{ paddingLeft: 8, marginTop: 16 }}>
        {/* 区域标题 */}
        <h3>分包合同信息</h3>
        <div style={{ marginTop: 8 }}></div>

        {/* 1. 进度款组件 (ProgressPayment) */}
        <ProgressPayment
          no={selectedRecord.id}
          tableDeafult={{
            sort: 'form_no',
            order: 'desc',
            filter: JSON.stringify([
              {
                Key: 'out_info_id',
                Val: selectedRecord.id,
                Operator: '='
              }
            ])
          }}
          type="subcontractorProgress/querySubProgressPaymentBody"
          isContractIncomeId={false}
        />

        {/* 2. 签证组件 (BusinessVisa) */}
        <BusinessVisa
          no={selectedRecord.id}
          tableDeafult={{
            sort: 'form_no',
            order: 'desc',
            filter: JSON.stringify([
              {
                Key: 'out_info_id',
                Val: selectedRecord.id,
                Operator: '='
              }
            ])
          }}
          type='visaSub/querySubEngineeringVisa'
          isContractIncomeId={false}
        />

        {/* 3. 结算组件 (BalanceOfAccounts) */}
        <BalanceOfAccounts
          stage={SUB_CONTRACT_LABEL}
          no={selectedRecord.id}
          tableDeafult={{
            sort: 'form_make_time',
            order: 'desc',
            filter: JSON.stringify([
              {
                Key: 'out_info_id',
                Val: selectedRecord.id,
                Operator: '='
              }
            ])
          }}
          type="subcontractorSettlement/getSubSettlementManagement"
          isContractIncomeId={false}
        />
      </div>
    </>
  )
}

export default connect()(SubExpenseControl)