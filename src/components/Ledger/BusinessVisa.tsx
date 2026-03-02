import React, { useState, useEffect } from 'react';
import { Timeline, Empty, Skeleton, Typography } from 'antd'; 
import TitleBar, { ApprovalScheduleStr } from './TitleBar'; 
import { connect } from 'umi';
const { Text } = Typography; 

/**
 * 签证款组件 (BusinessVisa)
 * 用于根据合同ID (no) 获取并展示该合同下的所有商务签证记录，以时间线形式展示。
 * @param {object} props - 组件属性
 * @param {string} props.no - 合同 ID 或外部关联 ID (contract_income_id)
 * @param {string} props.type - 用于 dispatch 的 Redux/DVA action type
 * @param {object} props.tableDeafult - 默认的查询参数
 * @param {function} props.dispatch - 用于触发 Redux/DVA action 的方法
 */
const BusinessVisa = (props: any) => {
  const { no, type, tableDeafult = {}, dispatch,income_info_wbs_code } = props;
  
  // 状态：存储从后端获取的签证记录列表
  const [list, setList] = useState([])
  // 状态：存储所有签证的总审定金额
  const [total, setTotal] = useState(0)
  // 状态：控制数据加载状态
  const [loading, setLoaing] = useState(false)

  // 组件挂载时或依赖项变化时执行副作用，请求数据
  useEffect(() => {
    if (!dispatch || !no) return; // 确保 dispatch 和 no 存在

    setLoaing(true) // 开始加载，显示骨架屏
    dispatch?.({
      type: type || 'visa/queryEngineeringVisa', // 默认 action type
      payload: {
        sort: 'form_no',
        order: 'desc',
        filter: JSON.stringify([
          {
            Key: 'contract_income_id', // 默认过滤条件：根据合同收入 ID 查询
            Val: no,
            Operator: '='
          },
          {
            Key: 'income_info_wbs_code',
            Val: income_info_wbs_code,
            Operator: '='
          }
        ]),
        ...tableDeafult, // 允许外部传入覆盖或新增查询参数
      },
      callback: (res: any) => {
        // 请求成功后的回调函数
        const rows = res.rows || [];
        setList(rows); // 更新签证记录列表
        
        // 计算所有记录的审定金额总和
        const totalSum = (rows).reduce((result, cur) => {
          // 累加 visa_review_amount (签证审定金额)
          return (+cur.visa_review_amount || 0) + result
        }, 0)
        setTotal(totalSum) // 更新总金额
        setLoaing(false) // 加载完成
      }
    });
  }, [no, type]) // 依赖项数组

  return (
    // 使用 Skeleton 骨架屏包裹内容
    <Skeleton loading={loading}>
      {/* 顶部标题栏，展示总金额和条目数 */}
      <TitleBar
        title='签证款'
        total={total}
        num={list.length}
      />
      
      {/* 签证列表内容区域 */}
      <div style={{ margin: "16px 0 16px", padding: 8, fontSize: 12 }}>
        {/* 提示：蓝色表示审批完，红色的表示审批中 (状态由 ApprovalScheduleStr 处理) */}
        {
          // 根据数据长度判断是显示时间线还是空状态
          list.length > 0 ? (
            <Timeline>
              {
                // 遍历签证记录列表
                list.map((item: any, index: number) => {
                  return (
                    // 时间线上的单个条目
                    <Timeline.Item
                      key={index}
                    >
                      {/* 内容布局：左侧信息，右侧金额和状态，两端对齐 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div>
                            <Text type="secondary">{item.visa_code}</Text> {/* 签证编号 */}
                            <br />
                            <Text type="secondary">{item.visa_date_str || '无'}</Text> {/* 签证日期 */}
                          </div>
                        </div>
                        <div>
                          <div>
                            ¥{item.visa_review_amount || 0} {/* 签证审定金额 */}
                            <span style={{ paddingLeft: 5 }}>
                              {/* 审批状态图标组件 */}
                              <ApprovalScheduleStr item={item} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                  )
                })
              }
            </Timeline>
          ) : <Empty /> // 如果没有数据，显示空状态
        }
      </div>
    </Skeleton>
  )
}


export default connect()(BusinessVisa)