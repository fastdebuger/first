import { ErrorCode } from '@/common/const'
import { Tooltip, Spin, Empty } from 'antd'
import React, { useEffect, useState } from 'react'

// 假设 IContractRecord 是您合同数据的类型接口
interface IContractRecord {
  id: number;
  contract_income_id?: number;
  contract_name?: string;
  contract_no?: string;
  wbs_code?: string;
  valuation_mode_name?: string;
  contract_start_date_str?: string;
  contract_end_date_str?: string;
  contract_sign_date_str?: string;
  contract_say_price?: number;
  contract_un_say_price?: number;
  // ... 其他字段
}

interface ContractDetailsProps {
    incomeInfoRecord?: any; // 外部传入的备用主合同信息
    children: React.ReactNode;
    dispatch: any; // UmiJS dispatch
    record: IContractRecord; // 支出合同记录
}

const ContractDetails: React.FC<ContractDetailsProps> = (props) => {
  const { children, dispatch, record } = props

  // 1. 存储主合同详情 (API 异步获取的数据)
  const [incomeDetail, setIncomeDetail] = useState<IContractRecord | null>(null)
  // 2. 存储加载状态
  const [loading, setLoading] = useState(false)
  // 3. 存储触发查询的 id
  const [targetIncomeId, setTargetIncomeId] = useState<any>(null)

  useEffect(() => {
    if (targetIncomeId) {
      setLoading(true);
      setIncomeDetail(null); // 清空旧数据

      dispatch({
        type: "income/getIncomeInfo",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: targetIncomeId, Operator: '=' }
          ]),
          order: 'desc',
          sort: 'id',
        },
        callback: (res: { errCode: number; rows: IContractRecord[] }) => {
          setLoading(false);
          if (res.errCode === ErrorCode.ErrOk && res.rows.length > 0) {
            setIncomeDetail(res.rows[0]);
          } else {
            setIncomeDetail(null);
          }
        },
      });
    }

  }, [targetIncomeId, dispatch]) // 依赖于 dispatch 和 targetIncomeId

  // 待展示的数据源：即通过 API 获取到的主合同详情
  const displayRecord = incomeDetail; 
  
  // 优化后的 Tooltip 内容渲染函数
  const renderTooltipContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center">
          <Spin tip="正在加载主合同详情..." />
        </div>
      );
    }

    if (!displayRecord) {
      return (
        <div className="p-4">
           {/* 如果 record 关联了 contract_income_id 但未获取到详情 */}
          <Empty description={targetIncomeId ? "未找到关联的主合同详情" : "无关联主合同"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    }

    // 渲染主合同详情
    const dataItems = [
      { label: '合同名称：', value: displayRecord.contract_name },
      { label: '合同系统2.0合同编号：', value: displayRecord.contract_no },
      { label: 'WBS项目定义：', value: displayRecord.wbs_code },
      { label: '计价方式：', value: displayRecord.valuation_mode_name },
      { label: '合同开工日期：', value: displayRecord.contract_start_date_str },
      { label: '合同完工日期：', value: displayRecord.contract_end_date_str },
      { label: '合同签订日期：', value: displayRecord.contract_sign_date_str },
      { label: '合同含税金额(元)：', value: displayRecord.contract_say_price },
      { label: '合同不含税金额(元)：', value: displayRecord.contract_un_say_price },
    ];

    return (
      <div className="p-2 bg-white">
        {/* 标题区域 - 强化视觉效果 */}
        <div className="text-xl font-bold text-gray-600 pb-3 px-4">
          关联主合同详情
        </div>

        {/* 内容列表 */}
        <div className="space-y-3 text-sm pb-4">
          {dataItems.map((item, index) => (
            <div key={index} className="flex items-start">
              {/* 标签区域：固定宽度 140px，右对齐，颜色稍浅 */}
              <span style={{ maxWidth: '160px' }} className="text-gray-500">
                {item.label}
              </span>
              {/* 值区域：占据剩余空间，字体加粗，颜色深 */}
              <span className="text-gray-500">
                {item.value || '无数据'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <Tooltip
      onOpenChange={(open) => {
        if (open) {
          // 只有在 contract_income_id 存在且与当前 targetIncomeId 不一致时才触发查询
          if (record.contract_income_id && record.contract_income_id !== targetIncomeId) {
            setTargetIncomeId(record.contract_income_id)
          } else if (!record.contract_income_id) {
            // 如果没有关联 ID，则清空
            setIncomeDetail(null);
            setTargetIncomeId(null);
          }
        }
      }}
      placement="rightTop"
      color={"#FFF"}
      overlayStyle={{ maxWidth: '500px', whiteSpace: 'normal', wordBreak: 'break-all' }}
      trigger={["click"]}
      title={renderTooltipContent()} // 调用渲染函数
    >
      {children}
      {children ? (
        <a
          className='pl-1'
        >
          详情
        </a>
      ) :
        '-'
      }
    </Tooltip>
  )
}

export default ContractDetails