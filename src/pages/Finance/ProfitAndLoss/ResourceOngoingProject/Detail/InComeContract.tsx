import React, { useEffect } from 'react';
import {getIncomeInfo} from "@/services/contract/income";
import { Tabs } from 'antd';
import IncomeContract from "@/components/Ledger/income";
import ExpenseControl from "@/components/Ledger/expenseControl";
import Contract from "@/components/Ledger/contract";
import Subcontractor from "@/components/Ledger/subcontractor";
import Contractor from "@/components/Ledger/contractor";
import ProgressPayment from "@/components/ProgressPayment";
import {connect} from "umi";

const InComeContract = ({dispatch, selectedRecord}: any) => {

  const [contractList, setContractList] = React.useState<any>([]);
  const authority = 'authority';
  const fetchList = async () => {
    const res = await getIncomeInfo({
      order: 'desc',
      sort: 'id',
      filter: JSON.stringify([
        { Key: 'wbs_code', Val: selectedRecord?.wbs_define_code, Operator: '=' }
      ]),
    })
    setContractList(res.rows || [])
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <div>
      <h3>共 {contractList.length} 份主合同</h3>
      <div style={{marginTop: 8}}>
        <Tabs>
          {contractList.map((item: any) => (
            <Tabs.TabPane tab={<strong>合同号：{item.contract_no}</strong>} key={item.id}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="收入合同" key="1">
                  {item.id ? (
                    <IncomeContract
                      selectedRecord={{ contract_income_id: item.id }}
                      authority={authority}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="预结算费控中心" key="3">
                  {item.id ? (
                    <ExpenseControl
                      dispatch={dispatch}
                      selectedRecord={{ id: item.id }}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="支出合同" key="4">
                  {item.id ? (
                    <Contract
                      authority={authority}
                      selectedRecord={{ id: item.id }}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="分包商" key="5">
                  {item.id ? (
                    <Subcontractor
                      authority={authority}
                      selectedRecord={{ id: item.id }}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="承包商" key="6">
                  {item.id ? (
                    <Contractor
                      authority={authority}
                      selectedRecord={{ id: item.id }}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="统计分析" key="7">
                  {item.id ? (
                    <ProgressPayment
                      selectedRecord={{ id: item.id }}
                    />
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
                  )}
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default connect()(InComeContract);
