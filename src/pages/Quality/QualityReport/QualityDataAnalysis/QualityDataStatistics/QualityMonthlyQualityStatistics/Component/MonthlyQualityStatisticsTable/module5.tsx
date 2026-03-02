// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块5：过程（采购）质量指标明细
 * 功能：展示4类采购相关质量指标，包括进场合格率、监督抽查合格率、驻厂监造执行率、出厂检验率
 * 布局特点：
 *   - 第1列“过程（采购）质量”纵向跨8行（作为左侧主分类标签）
 *   - 第2列包含4个指标项，每项占2行（共 2×4 = 8 行）
 *   - 第3列基础数据共8行（每指标2行：分子+分母）
 *   - 第4列描述全为空（仅占位对齐）
 *   - 第5~7列（本月值、累计值、备注）严格按8个数据行对齐
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于设置单元格高度、边框、居中等
 *   - renderItem: 父组件传入的字段渲染函数，根据 onlyShow 模式决定显示输入框或纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule5: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：主分类标签“过程（采购）质量”，纵向跨8行 */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(8)}>过程（采购）质量</div> {/* 高度 = 8 × itemHeight = 360px */}
        </Col>

        {/* 第2列：具体指标名称（4项，每项占2行）*/}
        <Col span={colSpanList[1]}>
          {/* 采购产品进场合格率 —— 占2行 */}
          <div style={getStyles(2)}>采购产品进场合格率</div>
          {/* 采购物资监督抽查合格率 —— 占2行 */}
          <div style={getStyles(2)}>采购物资监督抽查合格率</div>
          {/* 重点设备驻厂监造执行率 —— 占2行 */}
          <div style={getStyles(2)}>重点设备驻厂监造执行率</div>
          {/* 采购物资关键设备出厂检验率 —— 占2行 */}
          <div style={getStyles(2)}>采购物资关键设备出厂检验率</div>
        </Col>

        {/* 第3列：基础数据（计算依据：分子 / 分母），共8行 */}
        <Col span={colSpanList[2]}>
          {/* 进场合格率：分子 */}
          <div style={getStyles()}>采购产品进场验收合格产品数量</div>
          {/* 进场合格率：分母 */}
          <div style={getStyles()}>采购产品进场验收总数量</div>

          {/* 监督抽查合格率：分子 */}
          <div style={getStyles()}>采购物资监督抽查合格数量</div>
          {/* 监督抽查合格率：分母 */}
          <div style={getStyles()}>采购物资监督抽查总数</div>

          {/* 驻厂监造执行率：分子 */}
          <div style={getStyles()}>重点（关键）设备实际驻场监造执行数量</div>
          {/* 驻厂监造执行率：分母 */}
          <div style={getStyles()}>重点（关键）设备计划监造数量</div>

          {/* 出厂检验率：分子 */}
          <div style={getStyles()}>采购物资关键设备出厂检验合格数量</div>
          {/* 出厂检验率：分母 */}
          <div style={getStyles()}>采购物资关键设备出厂总数</div>
        </Col>

        {/* 第4列：描述（本模块无业务描述，全部为空占位）*/}
        <Col span={colSpanList[3]}>
          {/* 对应第1个指标 —— 占2行 */}
          <div style={getStyles(2)}></div>
          {/* 对应第2个指标 —— 占2行 */}
          <div style={getStyles(2)}></div>
          {/* 对应第3个指标 —— 占2行 */}
          <div style={getStyles(2)}></div>
          {/* 对应第4个指标 —— 占1行？但此处只写了1个单行空 div */}
          {/* 注意：这里可能存在布局不对齐风险（见下方【⚠️ 注意】） */}
          <div style={getStyles()}></div>
          <div style={getStyles()}></div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本），共8个字段 */}
        <Col span={colSpanList[4]}>
          <div style={getStyles()}>{renderItem('type_num22', 'num')}</div> {/* 进场合格率：分子 */}
          <div style={getStyles()}>{renderItem('type_num23', 'num')}</div> {/* 进场合格率：分母 */}
          <div style={getStyles()}>{renderItem('type_num24', 'num')}</div> {/* 抽查合格率：分子 */}
          <div style={getStyles()}>{renderItem('type_num25', 'num')}</div> {/* 抽查合格率：分母 */}
          <div style={getStyles()}>{renderItem('type_num26', 'num')}</div> {/* 监造执行率：分子 */}
          <div style={getStyles()}>{renderItem('type_num27', 'num')}</div> {/* 监造执行率：分母 */}
          <div style={getStyles()}>{renderItem('type_num28', 'num')}</div> {/* 出厂检验率：分子 */}
          <div style={getStyles()}>{renderItem('type_num29', 'num')}</div> {/* 出厂检验率：分母 */}
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算）*/}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num22', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num23', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num24', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num25', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num26', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num27', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num28', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num29', 'text')}</div>
        </Col>

        {/* 第7列：备注（可编辑文本 或 只读文本）*/}
        <Col span={colSpanList[6]}>
          {/* 前6个备注各占1行 */}
          <div style={getStyles()}>{renderItem('remark22')}</div>
          <div style={getStyles()}>{renderItem('remark23')}</div>
          <div style={getStyles()}>{renderItem('remark24')}</div>
          <div style={getStyles()}>{renderItem('remark25')}</div>
          <div style={getStyles()}>{renderItem('remark26')}</div>
          <div style={getStyles()}>{renderItem('remark27')}</div>
          <div style={getStyles(2)}>{renderItem('remark29')}</div>
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule5);
