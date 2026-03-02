import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import TitleBar from './TitleBar';
import { connect } from 'umi';
import { MAIN_CONTRACT_LABEL } from '@/common/const';
import MainBalanceOfAccountsList from "./MainBalanceOfAccountsList";
import SubBalanceOfAccountsCardInfo from "./SubBalanceOfAccountsCardInfo";


/**
 * 结算款详情组件 (BalanceOfAccounts)
 * 用于展示特定合同或分包合同的结算审批流程和各阶段的审核金额。
 * 结算数据通常只有一条记录，但包含多个审批阶段（一审、二审、...）的数据。
 * * @param {string} props.no - 合同 ID 或外部关联 ID (contract_income_id 或 out_info_id)
 * @param {string} props.type - 用于 dispatch 的 Redux/DVA action type
 * @param {object} props.tableDeafult - 默认的查询参数
 * @param {Array} props.stage - 根据结算阶段的标签进行展示
 * @param {function} props.dispatch - 用于触发 Redux/DVA action 的方法
 * @param {boolean} props.isContractIncomeId - 标记是否是主合同结算 (true) 或分包结算 (false)
 */
const BalanceOfAccounts = (props: any) => {
  const { no, type, tableDeafult = {}, dispatch, stage = MAIN_CONTRACT_LABEL, isContractIncomeId = true,income_info_wbs_code } = props;
  // 状态：存储处理后的主合同结算审批流程列表
  const [list, setList] = useState([])
  // 状态：存储处理后的分包合同结算审批流程列表
  const [record, setRecord] = useState(null)
  // 状态：存储所有审批阶段的金额总和
  const [total, setTotal] = useState(0)
  // 状态：控制数据加载状态
  const [loading, setLoaing] = useState(false)

  // 依赖项变化时请求数据
  useEffect(() => {
    setLoaing(true)
    dispatch?.({
      // 默认 action type
      type: type || 'settlementManagement/getSettlementManagement',
      payload: {
        sort: 'form_make_time',
        order: 'desc',
        filter: JSON.stringify([
          {
            Key: 'contract_income_id', // 默认过滤条件：根据合同收入 ID 查询
            Val: no,
            Operator: '='
          },
          {
            Key: 'income_info_wbs_code', // 默认过滤条件：根据外部关联 ID 查询
            Val: income_info_wbs_code,
            Operator: '='
          }
        ]),
        ...tableDeafult,
      },
      callback: (res: any) => {
        // 请求成功后的数据处理逻辑
        const result = [];
        // 结算数据通常只有一条，取第一条记录
        const settlementData = res?.rows?.[0] || {};
        // 上报金额 审核金额 审核完成日期 上报金额 审核金额

        // 确定需要遍历的审批阶段数量
        // 主合同结算有4个阶段 (1-4)，分包结算有3个阶段 (1-3)

        // 循环遍历结算数据中的各个审批阶段字段 (approval_date1, approval_amount1, ...)
        for (let i = 1; i <= stage?.length; i++) {
          // 动态读取字段名，例如 approval_date1_str, report_amount1 等
          const approval_date_str = settlementData[`approval_date_str${i}`] || '';
          const report_amount = settlementData[`report_amount${i}`] || '';
          const approval_amount = settlementData[`approval_amount${i}`] || '';
          const approval_schedule_str = settlementData[`approval_schedule${i}_str`] || '';
          const approval_schedule = settlementData[`approval_schedule${i}`] || '';

          // 只有当该阶段的审核金额字段存在时，才将该阶段添加到结果列表
          if (settlementData[`approval_amount${i}`] !== undefined) {
            result.push({
              id: `settlement-${i}-${settlementData.form_no}`,
              approval_date_str,
              report_amount,
              approval_amount,
              approval_schedule,
              approval_schedule_str,
              label: stage[i - 1]
            });
          }
        }

        // 判断是不是主合同和分包合同
        if (isContractIncomeId) {
          setList(result); // 设置处理后的审批阶段列表
        } else {
          setRecord(settlementData);
        }

        // 计算所有阶段的审核金额总和
        const totalSum = (result).reduce((result, cur) => {
          return +cur.approval_amount + result
        }, 0)
        setTotal(totalSum) // 设置总金额
        setLoaing(false)
      }
    });
  }, [no, type])

  return (
    // 使用 Skeleton 骨架屏包裹内容
    <Skeleton loading={loading}>
      {/* 顶部标题栏，展示总金额和阶段数 */}
      <TitleBar
        title='结算款'
        total={total}
        num={list.length}
      />

      {/* 结算审批流程时间线区域 */}
      <div style={{ marginTop: 16, padding: 8, fontSize: 12 }}>
        {
          // 主合同
          list.length > 0 && (
            <MainBalanceOfAccountsList list={list} />
          )
        }
        {
          // 分包合同
          record && (
            <SubBalanceOfAccountsCardInfo record={record} />
          )
        }
      </div>
    </Skeleton>
  )
}

export default connect()(BalanceOfAccounts)
