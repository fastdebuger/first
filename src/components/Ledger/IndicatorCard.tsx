import React from "react";

/**
 * 原始指标数据定义：对应后台返回的数值字段
 */
interface RawIndicatorData {
  number1: number; // 累计收款
  number2: number; // 累计付款
  number3: number; // 变化量
  number4: number; // 责任预算利润率
  number5: number; // 预计利润额
  number6: number; // 责任利润额
  number7: number; // 累计结算进度%
  number8: number; // 项目总体进度%
  number9: number; // 计划%
  number10: number; // 实际%
}

/**
 * 模拟数据集：用于前端逻辑计算与展示
 */
const rawData: RawIndicatorData = {
  number1: 2500000,
  number2: 1250000,
  number3: 150000,
  number4: 0.12,
  number5: 462500,
  number6: 500000,
  number7: 85.5,
  number8: 87.1,
  number9: 88,
  number10: 86.5,
};

/**
 * ContractIndicatorAnalysis: 工程主合同指标分析组件
 * 特点：纯原生实现，支持长文本换行 Tip，全屏铺满布局
 */
const ContractIndicatorAnalysis: React.FC = () => {
  // 核心样式表：采用弹性盒模型 (Flexbox) 适配不同屏幕宽度
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: "100%",
      padding: "0 20px 20px",
      boxSizing: "border-box",
    },
    table: {
      width: "100%",
      borderRadius: "10px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
    },
    headerRow: {
      display: "flex",
      backgroundColor: "#fafafa",
      borderBottom: "2px solid #eee",
      fontWeight: "bold",
      padding: "15px 0",
      textAlign: "center",
      color: "#333",
    },
    row: {
      display: "flex",
      borderBottom: "1px solid #f0f0f0",
      alignItems: "center",
      minHeight: "70px",
    },
    // 列权重分配
    col1: { width: "80px", textAlign: "center" },
    col2: { flex: 2, padding: "0 20px", display: "flex", alignItems: "center" },
    col3: { flex: 3, padding: "0 20px", color: "#666", fontSize: "13px" },
    col4: { flex: 2, padding: "0 20px", fontWeight: "bold", fontSize: "16px" },

    // 问号提示图标样式
    infoIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "26px",
      height: "16px",
      borderRadius: "50%",
      border: "1px solid #1890ff",
      color: "#1890ff",
      fontSize: "11px",
      marginLeft: "8px",
      cursor: "pointer",
      position: "relative",
    },
  };

  /**
   * 行渲染辅助组件
   */
  const DataRow = ({ no, name, tip, process, value, isLast = false }: any) => (
    <div
      style={{
        ...styles.row,
        borderBottom: isLast ? "none" : styles.row.borderBottom,
      }}
    >
      <div style={styles.col1}>{no}</div>
      <div style={styles.col2}>
        {name}
        <div className="tooltip-container" style={styles.infoIcon}>
          ?<span className="tooltip-text">{tip}</span>
        </div>
      </div>
      <div style={styles.col3}>{process}</div>
      <div style={styles.col4}>{value}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* 注入全局 CSS：处理 Tooltip 的浮动、动画及文字换行逻辑 */}
      <style>{`
        .tooltip-container .tooltip-text {
          visibility: hidden;
          width: 280px; /* 宽度略微增加以适应长文本 */
          background-color: #333;
          color: #fff;
          text-align: left;
          border-radius: 6px;
          padding: 10px 15px;
          position: absolute;
          z-index: 99;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 12px;
          font-weight: normal;
          line-height: 1.6;
          /* 核心：保持文字原文并允许换行 */
          white-space: pre-wrap; 
          word-break: break-all;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        .tooltip-container .tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
      `}</style>

      <div style={styles.table}>
        {/* 表头部分 */}
        <div style={styles.headerRow}>
          <div style={styles.col1}>序号</div>
          <div style={{ ...styles.col2, textAlign: "left" }}>指标名称</div>
          <div style={{ ...styles.col3, textAlign: "left" }}>计算过程</div>
          <div style={{ ...styles.col4, textAlign: "left" }}>分析结果</div>
        </div>

        {/* 1. 净现金流 */}
        <DataRow
          no="1"
          name="净现金流 (项目经营情况)"
          tip="财务(债权填报表里面累计收款小计) - 财务(债务填报表里面累计付款小计)(含税)"
          process={`${rawData.number1.toLocaleString()} - ${rawData.number2.toLocaleString()}`}
          value={`¥ ${(rawData.number1 - rawData.number2).toLocaleString()}`}
        />

        {/* 2. 利润率的变化率 - 使用模板字符串保留换行格式 */}
        <DataRow
          no="2"
          name="利润率的变化率"
          tip={`项目责任预算利润率 = 项目责任预算利润额 ÷ 项目责任预算收入
项目执行预算利润率 = 项目执行预算利润额 ÷ 项目执行预算收入
变化量 = 项目执行预算利润率 - 项目责任预算利润率
利润率的变化率 = 变化量 ÷ 项目责任预算利润率`}
          process={`${rawData.number3.toLocaleString()} ÷ ${rawData.number4}`}
          value={`${(rawData.number3 / rawData.number4 / 10000).toFixed(2)}%`}
        />

        {/* 3. 利润总额完成率 */}
        <DataRow
          no="3"
          name="利润总额完成率(项目经营情况)"
          tip="预计利润额(财务在建项目资源结转情况中的利润总额) ÷ 责任利润额(项目责任预算利润额)"
          process={`${rawData.number5.toLocaleString()} ÷ ${rawData.number6.toLocaleString()}`}
          value={`${((rawData.number5 / rawData.number6) * 100).toFixed(2)}%`}
        />

        {/* 4. 结算进度偏差 */}
        <DataRow
          no="4"
          name="结算进度偏差"
          tip="累计结算进度%(费控进度款管理中总的累计占合同额比例) - 项目总体进度%(工程进度管理工程项目台账每个主合同的当前累计实际进度%)"
          process={`${rawData.number7}% - ${rawData.number8}%`}
          value={`${(rawData.number7 - rawData.number8).toFixed(2)}%`}
        />

        {/* 5. 总体进度偏差 */}
        <DataRow
          no="5"
          name="总体进度偏差"
          tip="计划%(工程进度管理工程项目台账每个主合同的当前累计计划进度%) - 实际%(工程进度管理工程项目台账每个主合同的当前累计实际进度%)"
          process={`${rawData.number9}% - ${rawData.number10}%`}
          value={`${(rawData.number9 - rawData.number10).toFixed(2)}%`}
          isLast={true}
        />
      </div>
    </div>
  );
};

export default ContractIndicatorAnalysis;
