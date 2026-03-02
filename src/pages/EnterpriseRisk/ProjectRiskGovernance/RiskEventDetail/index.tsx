import { ErrorCode } from '@/common/const'
import { Tooltip, Spin, Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'umi';
import Details from './Details';

// 类型接口
interface IContractRecord {
  [key: string]: string
}

interface ContractDetailsProps {
  children: React.ReactNode;
  dispatch: any;
  record: IContractRecord;
  id: string,
  type: string,
  cardDetail: IContractRecord[]
}

/***
 * 卡片详情
 */
const ContractDetails: React.FC<ContractDetailsProps> = (props) => {
  const { children, dispatch, record, id = "id", type, cardDetail } = props;
  // 1. 存储详情
  const [incomeDetail, setIncomeDetail] = useState<IContractRecord[] | null>(null)
  // 2. 存储加载状态
  const [loading, setLoading] = useState(false)
  // 3. 存储触发查询的 id
  const [targetIncomeId, setTargetIncomeId] = useState<any>(null)

  useEffect(() => {
    if (targetIncomeId) {
      setLoading(true);
      setIncomeDetail(null); // 清空旧数据

      dispatch({
        type,
        payload: {
          filter: JSON.stringify([
            { Key: id, Val: targetIncomeId, Operator: '=' }
          ]),
          order: 'asc',
          sort: id,
        },
        callback: (res: { errCode: number; rows: IContractRecord[] }) => {
          setLoading(false);
          if (res.errCode === ErrorCode.ErrOk && res.rows.length > 0) {
            setIncomeDetail(res.rows);
          } else {
            setIncomeDetail(null);
          }
        },
      });
    }

  }, [targetIncomeId])

  const displayRecord = incomeDetail;

  //  Tooltip 内容
  const renderTooltipContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center">
          <Spin tip="正在加载详情..." />
        </div>
      );
    }

    if (!displayRecord) {
      return (
        <div className="p-4">
          {/* 如果 record 关联了 id 但未获取到详情 */}
          <Empty description={targetIncomeId ? "未找到关联的详情" : "无关联详情"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    }

    return (
      <div style={{
        maxWidth: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        {displayRecord.map((detail) => (
          <Details
            key={detail.id}
            record={detail}
            cardDetail={cardDetail}
          />
        ))}
      </div>
    )
  };


  return (
    <Tooltip
      key={id}
      onOpenChange={(open) => {
        if (open) {
          // 只有在id存在且与当前targetIncomeId不一致时才触发查询
          if (record[id] && record[id] !== targetIncomeId) {
            setTargetIncomeId(record[id])
          } else if (!record[id]) {
            // 如果没有关联 ID 清空
            setIncomeDetail(null);
            setTargetIncomeId(null);
          }
        }
      }}
      placement="rightTop"
      overlayStyle={{
        maxWidth: '1600px',
        minWidth: '1000px',
        overflowY: "auto",
        padding: "20px 0 0"
      }}
      trigger={["click"]}
      color='#fff'
      title={renderTooltipContent()} // 调用渲染函数
    >
      {children}
      <a style={{ paddingLeft: 5 }}>详情</a>
    </Tooltip>
  )
}

export default connect()(ContractDetails)