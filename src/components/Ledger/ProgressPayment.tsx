import React, { useState, useEffect } from 'react';
import { Timeline, Empty, Skeleton, Typography } from 'antd';
import TitleBar, { ApprovalScheduleStr } from './TitleBar';
import { connect } from "umi";
import { isDateFormatOrTimeStamp } from '@/utils/utils-date';

const { Text } = Typography;

/**
 * 进度款列表组件 (ProgressPayment)
 * 用于根据合同ID (no) 获取并展示该合同下的所有进度款记录，以时间线形式展示。
 * @param {object} props - 组件属性
 * @param {string} props.no - 合同 ID 或外部关联 ID
 * @param {string} props.type - 用于 dispatch 的 Redux/DVA action type
 * @param {object} props.tableDeafult - 默认的查询参数（如排序、过滤条件）
 * @param {function} props.dispatch - 用于触发 Redux/DVA action 的方法
 */
const ProgressPayment = (props: any) => {
  const { no, type, tableDeafult = {}, dispatch,income_info_wbs_code } = props;

  // 状态：存储从后端获取的进度款记录列表
  const [list, setList] = useState([]);
  // 状态：存储所有进度款的总审核金额
  const [total, setTotal] = useState(0);
  // 状态：控制数据加载状态，用于 Skeleton 骨架屏
  const [loading, setLoaing] = useState(false);

  useEffect(() => {
    if (!dispatch || !no) return;

    setLoaing(true); // 开始加载，显示骨架屏

    dispatch?.({
      // 触发 Redux/DVA action 来获取进度款数据
      type: type || "costControl/queryProgressPaymentBody",
      payload: {
        // 默认的查询参数
        sort: 'form_no',
        order: 'desc',
        filter: JSON.stringify([
          {
            // 默认过滤条件：根据合同收入 ID (或关联 ID) 查询
            Key: 'contract_income_id',
            Val: no, // 关联 ID
            Operator: '='
          },
          {
            Key: 'dep_code',
            Val: income_info_wbs_code,
            Operator: '='
          }
        ]),
        ...tableDeafult, // 允许外部传入覆盖或新增查询参数
      },
      callback: (res: any) => {
        // 请求成功后的回调函数
        const rows = res.rows || [];
        setList(rows); // 更新进度款列表

        // 计算所有记录的审核金额总和
        const totalSum = rows.reduce((result, cur) => {
          // 累加 approval_amount，并确保其为数字
          return +cur.approval_amount + result
        }, 0)
        setTotal(totalSum); // 更新总金额

        setLoaing(false); // 加载完成，隐藏骨架屏
      }
    });

  }, [no, type]);


  return (
    // 使用 Skeleton 骨架屏包裹内容，在 loading 状态下显示骨架
    <Skeleton loading={loading}>
      {/* 顶部标题栏，展示总金额和条目数 */}
      <TitleBar
        title='进度款'
        total={total}
        num={list.length}
      />

      {/* 进度款列表内容区域 */}
      <div style={{ marginTop: 16, padding: 8, fontSize: 12 }}>
        {
          // 根据数据长度判断是显示时间线还是空状态
          list.length > 0 ? (
            // Ant Design 时间线组件
            <Timeline>
              {
                // 遍历进度款记录列表
                list.map((item: any, index: number) => {
                  return (
                    // 时间线上的单个条目
                    <Timeline.Item
                      key={index}
                    >
                      {/* 内容布局：左侧信息，右侧金额和状态，两端对齐 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* 左侧：期数和日期 */}
                        <div>
                          <div>
                            <Text type="secondary">第{item.number}笔进度款</Text> {/* 进度款期数 */}
                            <br />
                            <Text type="secondary">{isDateFormatOrTimeStamp(item.approval_date, 'YYYY-MM-DD') || '无'}</Text> {/* 审批日期 */}
                          </div>
                        </div>
                        {/* 右侧：金额和审批状态图标 */}
                        <div>
                          <div>
                            ¥{item.approval_amount || 0} {/* 审核金额 */}
                            {/* 审批状态图标组件，根据 item.approval_schedule_str 显示不同颜色图标 */}
                            <ApprovalScheduleStr item={item} />
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                  )
                })
              }
            </Timeline>
          ) : <Empty /> // 如果没有数据，显示 Ant Design 的空状态组件
        }

      </div>
    </Skeleton>
  )
}


export default connect()(ProgressPayment)
