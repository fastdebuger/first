import React from 'react';
import { Timeline, Empty, Typography } from 'antd';
import { ApprovalScheduleStr } from './TitleBar';
import { connect } from 'umi';
const { Text } = Typography;

/**
 * 结算款主合同详情组件 (MainBalanceOfAccountsList)
 * @param {string} props.list - 用于展示主合同列表
 */
const MainBalanceOfAccountsList = (props: any) => {
  const { list } = props;

  return (
    <>
      {
        // 根据审批阶段列表长度判断是显示时间线还是空状态
        list.length > 0 ? (
          <Timeline>
            {
              // 遍历审批阶段列表
              list.map((item: any, index: number) => {
                return (
                  <Timeline.Item
                    key={index}
                  >
                    {/* 时间线条目内容：左侧标签和日期，右侧金额和状态 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div>
                          <Text type="secondary">{item.label}</Text> {/* 审批阶段标签 */}
                          <br />
                          <Text type="secondary">{item.approval_date_str || '无'}</Text> {/* 审批日期 */}
                        </div>
                      </div>
                      <div>
                        <div>
                          ¥{item.approval_amount || 0} {/* 审核金额 */}
                          {/* 审批状态图标组件 */}
                          <ApprovalScheduleStr item={item} />
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                )
              })
            }
          </Timeline>
        ) : <Empty /> // 无数据时显示空状态
      }
    </>
  )
}

export default connect()(MainBalanceOfAccountsList)
