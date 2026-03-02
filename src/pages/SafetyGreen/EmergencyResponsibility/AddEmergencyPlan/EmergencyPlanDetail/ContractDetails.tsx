import { ErrorCode } from '@/common/const'
import { Tooltip, Spin, Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'umi';
import WarningCard from './WarningCard';

// 假设 IContractRecord 是您合同数据的类型接口
interface IContractRecord {
  // form_no: number;
  [key: string]: string
  // ... 其他字段
}

interface ContractDetailsProps {
  incomeInfoRecord?: any; // 外部传入的备用主合同信息
  children: React.ReactNode;
  dispatch: any; // UmiJS dispatch
  record: IContractRecord; // 支出合同记录
}

/***
 * 卡片详情
 */
const ContractDetails: React.FC<ContractDetailsProps> = (props) => {
  const { children, dispatch, record } = props
  // 1. 存储主合同详情
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
        type: "emergencyplan/queryContingencyPlanConfigBody",
        payload: {
          filter: JSON.stringify([
            { Key: 'form_no', Val: targetIncomeId, Operator: '=' }
          ]),
          order: 'asc',
          sort: 'order_num',
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
        {displayRecord.map((detail, index) => (
          <WarningCard key={detail.id} data={detail} />
        ))}
      </div>
    )
  };


  return (
    <Tooltip
      onOpenChange={(open) => {
        if (open) {
          // 只有在 form_no 存在且与当前 targetIncomeId 不一致时才触发查询
          if (record.form_no && record.form_no !== targetIncomeId) {
            setTargetIncomeId(record.form_no)
          } else if (!record.form_no) {
            // 如果没有关联 ID，则清空
            setIncomeDetail(null);
            setTargetIncomeId(null);
          }
        }
      }}
      placement="rightTop"
      overlayStyle={{
        maxWidth: '600px',
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