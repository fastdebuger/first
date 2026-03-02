import React, { useEffect, useState } from 'react';
import { Collapse, Empty } from 'antd';

import ProgressPayment from './ProgressPayment';
import BusinessVisa from './BusinessVisa';
import BalanceOfAccounts from './BalanceOfAccounts';
import { connect } from 'umi';
import { SUB_CONTRACT_LABEL } from '@/common/const';


/**
 * 分包商详情组件 (SubcontractorDetails)
 * 根据合同收入ID (no) 获取并展示相关的分包合同列表，每个合同在一个折叠面板中展示其进度款、签证和结算信息。
 */
const SubcontractorDetails = (props: any) => {
  const { no, type, tableDeafult = {}, dispatch } = props;
  const [resProgress, setResProgress] = useState([]) // 状态：存储获取到的分包合同列表

  // 组件挂载时，根据传入的 no (合同收入ID) 请求分包合同列表
  useEffect(() => {
    dispatch?.({
      type: type || "expenditure/queryContract", // 默认查询合同的 action type
      payload: {
        ...tableDeafult,
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          {
            Key: 'contract_income_id', // 过滤条件：关联合同收入ID
            Val: no,
            Operator: '='
          }
        ]),
      },
      callback: (res: any) => {
        setResProgress(res.rows || []); // 设置分包合同列表
      }
    });
  }, [no, type, dispatch]) // 依赖项数组

  return (
    <div style={{ marginTop: 16, padding: 8, fontSize: 12 }}>
      {
        // 根据合同列表长度判断显示折叠面板还是空状态
        resProgress.length > 0 ? (
          <Collapse >
            {
              // 遍历分包合同列表，为每个合同创建一个折叠面板
              resProgress.map((item: any, index: number) => {
                return (
                  <Collapse.Panel
                    // 折叠面板头部 (Header) 内容
                    header={(
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div>{item.contract_no}</div> {/* 合同编号 */}
                          <div>{item.contract_out_name}</div> {/* 分包商名称 */}
                        </div>
                        <div>合同金额：¥{item.contract_say_price}元</div> {/* 合同金额 */}
                      </div>
                    )}
                    key={index}
                  >
                    {/* 嵌套组件：展示进度款详情 */}
                    <ProgressPayment
                      no={item.id}
                      tableDeafult={{
                        filter: JSON.stringify([
                          { Key: 'out_info_id', Val: item.id, Operator: '=' }
                        ])
                      }}
                      type="subcontractorProgress/querySubProgressPaymentBody"
                      isContractIncomeId={false}
                    />
                    {/* 嵌套组件：展示商务签证详情 */}
                    <BusinessVisa
                      no={item.id}
                      tableDeafult={{
                        filter: JSON.stringify([
                          { Key: 'out_info_id', Val: item.id, Operator: '=' }
                        ])
                      }}
                      type='visaSub/querySubEngineeringVisa'
                      isContractIncomeId={false}
                    />
                    {/* 嵌套组件：展示结算详情 */}
                    <BalanceOfAccounts
                      stage={SUB_CONTRACT_LABEL}
                      no={item.id}
                      tableDeafult={{
                        filter: JSON.stringify([
                          { Key: 'out_info_id', Val: item.id, Operator: '=' }
                        ])
                      }}
                      type="subcontractorSettlement/getSubSettlementManagement"
                      isContractIncomeId={false}
                    />
                  </Collapse.Panel>
                )
              })
            }
          </Collapse>
        ) : <Empty /> // 无数据时显示空状态
      }
    </div>
  )
}

export default connect()(SubcontractorDetails)