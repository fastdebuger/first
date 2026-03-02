import React from 'react';
import { connect } from 'umi';


/**
 * 结算款详情卡片组件 (BalanceOfAccountsCardInfo)
 * 用于展示特定分包合同的结算详情卡片
 * @param {string} props.record - 展示分包合同当前数据
 */
const BalanceOfAccounts = (props: any) => {
  const { record } = props;

  return (
    <div
      className="card-content"
      style={{
        padding: "16px",
      }}
    >
      <div
        className="info-row"
        style={{
          display: "flex",
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "1px dashed #eee",
        }}
      >
        <div
          className="info-item"
          style={{
            padding: "0 8px",
            width: 200
          }}
        >
          <span style={{ color: "#5a5a5aff", marginRight: "4px", fontWeight: 600 }}>项目部审核：</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>上报金额(元)：</span>
          <span style={{ color: "#333" }}>{record.report_amount1 || '无数据'}</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>审核金额(元)：</span>
          <span style={{ color: "#333333ff" }}>{record.approval_amount1 || '无数据'}</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>审核完成日期(元)：</span>
          <span style={{ color: "#333" }}>{record.approval_date_str1 || '无数据'}</span>
        </div>
      </div>
      <div
        className="info-row"
        style={{
          display: "flex",
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "1px dashed #eee",
        }}
      >
        <div
          className="info-item"
          style={{
            padding: "0 8px",
            width: 200
          }}
        >
          <span style={{ color: "#5a5a5aff", marginRight: "4px", fontWeight: 600 }}>预结算费控中心审核：</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>上报金额(元)：</span>
          <span style={{ color: "#333" }}>{record.report_amount2 || '无数据'}</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>审核金额(元)：</span>
          <span style={{ color: "#333333ff" }}>{record.approval_amount2 || '无数据'}</span>
        </div>
        <div
          className="info-item"
          style={{
            flex: 1,
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#666", marginRight: "4px" }}>审核完成日期(元)：</span>
          <span style={{ color: "#333" }}>{record.approval_date_str2 || '无数据'}</span>
        </div>
      </div>
    </div>

  )
}

export default connect()(BalanceOfAccounts)