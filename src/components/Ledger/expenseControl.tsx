import React, { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';


import ProgressPayment from './ProgressPayment';
import BusinessVisa from './BusinessVisa';
import BalanceOfAccounts from './BalanceOfAccounts';
import SubcontractorDetails from './SubcontractorDetails';
import IndicatorCard from './IndicatorCard';

const { Title, Text } = Typography; 

// 定义合同记录的类型接口
interface ContractRecord {
  id: string; 
  contract_say_price?: number;
  dep_code?: string;
}

// 定义组件 props 的类型接口
interface ProjectSettlementViewProps {
  dispatch: Function; // 用于触发 Redux/DVA action 的方法
  selectedRecord: ContractRecord; // 当前选中的合同记录对象
}

/**
 * 费用控制概览组件 (ExpenseControl)
 * 用于展示主合同的关键信息，并聚合展示主合同和分包合同下的各项支出详情。
 */
const ExpenseControl: React.FC<ProjectSettlementViewProps> = ({ dispatch, selectedRecord }) => {

  // 状态：存储查询到的分包合同数量
  const [numberOfSubcontract, setNumberOfSubcontract] = useState(0)

  // 效果：组件挂载时，根据主合同 ID 查询其下的分包合同数量
  useEffect(() => {
    // 触发 action 查询分包合同
    dispatch?.({
      type: "expenditure/queryContract", // 查询合同列表的 action type
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          {
            Key: 'contract_income_id', // 过滤条件：以主合同 ID 作为收入合同 ID
            Val: selectedRecord.id, // 当前主合同 ID
            Operator: '='
          }
        ]),
      },
      callback: (res: any) => {
        // 请求成功后，获取合同列表的长度作为分包合同数量
        setNumberOfSubcontract(res?.rows?.length || 0);
      }
    });
    // 依赖项：确保在 selectedRecord.id 或 dispatch 变化时重新执行查询
  }, [selectedRecord.id, dispatch])

  return (
    <>
      {/* 顶部统计信息展示区域 */}
      <Row>

        {/* 第一列：合同金额 */}
        <Col span={4}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}
          >
            {/* 显示合同金额，默认为 0 */}
            {selectedRecord?.contract_say_price ?? 0}元
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>合同金额</Text>
        </Col>

        {/* 第二列：分包合同数量 */}
        <Col span={4}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}
          >
            {/* 显示查询到的分包合同数量 */}
            {numberOfSubcontract ?? 0}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>分包合同数量</Text>
        </Col>
      </Row>

      {/* --- 主合同信息详情区域 --- */}
      <div style={{ paddingLeft: 8, marginTop: 16 }}>
        <h3>主合同信息</h3>
        <div style={{ marginTop: 8 }}></div>

        {/* 主合同进度款详情：使用主合同 ID 查询 */}
        <ProgressPayment no={selectedRecord.id} income_info_wbs_code={selectedRecord.dep_code}/>

        {/* 主合同商务签证详情：使用主合同 ID 查询 */}
        <BusinessVisa no={selectedRecord.id} income_info_wbs_code={selectedRecord.dep_code}/>

        {/* 主合同结算详情：使用主合同 ID 查询 */}
        <BalanceOfAccounts no={selectedRecord.id} income_info_wbs_code={selectedRecord.dep_code}/>
      </div>
      
      {/* <IndicatorCard no={selectedRecord.id}/> */}

      {/* --- 分包合同信息详情区域 --- */}
      <h3>分包合同信息</h3>
      <div style={{ marginTop: 8 }}>
        {/* 分包合同详情列表：将主合同 ID 传递给 SubcontractorDetails 组件，由它负责查询和展示所有分包合同及其详情 */}
        <SubcontractorDetails
          no={selectedRecord.id}
           />
      </div>
    </>
  );
};

export default ExpenseControl; 