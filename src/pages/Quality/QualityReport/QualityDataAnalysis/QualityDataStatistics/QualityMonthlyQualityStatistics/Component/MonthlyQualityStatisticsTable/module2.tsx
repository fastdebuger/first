// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未直接使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块2：质量活动明细数据区域
 * 功能：展示四类质量活动（培训、检查、QC活动、自检自查）的详细指标、描述、本月值、累计值和备注
 * 布局特点：
 *   - 第1列"指标分类"纵向合并8行（占满整个模块高度）
 *   - 每个指标拆分成两行（如：参加人数/次数拆分为两行）
 *   - 共4个指标，每个指标2行，总计8行
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于统一单元格高度、边框、居中等
 *   - renderItem: 父组件传入的渲染函数，根据 onlyShow 模式决定显示输入框还是纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule2: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：指标分类（纵向跨8行，作为左侧标签） */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(8)}>指标分类</div> {/* 高度 = 8 × itemHeight = 360px */}
        </Col>

        {/* 第2列：具体指标名称（拆分成两行） */}
        <Col span={colSpanList[1]}>
          {/* 质量培训 - 拆分成两行 */}
          <div style={getStyles()}>质量培训 （参加人数）</div>
          <div style={getStyles()}>质量培训 （次数）</div>

          {/* 质量大（专项）检查 - 拆分成两行 */}
          <div style={getStyles()}>质量大（专项）检查 （发现问题数量）</div>
          <div style={getStyles()}>质量大（专项）检查 （次数）</div>

          {/* QC活动 - 拆分成两行 */}
          <div style={getStyles()}>QC活动 （参加人数）</div>
          <div style={getStyles()}>QC活动 （小组数量）</div>

          {/* 质量自检自查 - 拆分成两行 */}
          <div style={getStyles()}>质量自检自查 （出现的不符合项问题数）</div>
          <div style={getStyles()}>质量自检自查 （自检自查次数）</div>
        </Col>

        {/* 第3列：基础数据（说明性文字） */}
        <Col span={colSpanList[2]}>
          <div style={getStyles()}>培训主题内容场次，参加培训人员范围</div>
          <div style={getStyles()}>培训次数</div>
          <div style={getStyles()}>检查主要内容，发现问题数量</div>
          <div style={getStyles()}>检查次数</div>
          <div style={getStyles()}>主题活动参加人数</div>
          <div style={getStyles()}>小组数量</div>
          <div style={getStyles()}>项目类别（设计或者施工）、项目名称、出现的不符合项问题数</div>
          <div style={getStyles()}>自检自查次数</div>
        </Col>

        {/* 第4列：描述（简要说明）- 合并相同内容的单元格 */}
        <Col span={colSpanList[3]}>
          {/* 质量培训相关数据 - 合并两行 */}
          <div style={getStyles(2)}>质量培训相关数据</div>
          {/* 质量大检查、专项检查 - 合并两行 */}
          <div style={getStyles(2)}>质量大检查、专项检查</div>
          {/* 群众性质量活动开展情况数 - 合并两行 */}
          <div style={getStyles(2)}>群众性质量活动开展情况数。</div>
          {/* 质量自检自查数 - 合并两行 */}
          <div style={getStyles(2)}>质量自检自查数</div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本） */}
        <Col span={colSpanList[4]}>
          <div style={getStyles()}>{renderItem('type_num1', 'num')}</div> {/* 质量培训-参加人数 */}
          <div style={getStyles()}>{renderItem('type_num1_1', 'num')}</div> {/* 质量培训-次数 */}
          <div style={getStyles()}>{renderItem('type_num2', 'num')}</div> {/* 检查-发现问题数量 */}
          <div style={getStyles()}>{renderItem('type_num2_1', 'num')}</div> {/* 检查-次数 */}
          <div style={getStyles()}>{renderItem('type_num3', 'num')}</div> {/* QC活动-参加人数 */}
          <div style={getStyles()}>{renderItem('type_num3_1', 'num')}</div> {/* QC活动-小组数量 */}
          <div style={getStyles()}>{renderItem('type_num4', 'num')}</div> {/* 自检自查-不符合项问题数 */}
          <div style={getStyles()}>{renderItem('type_num4_1', 'num')}</div> {/* 自检自查-次数 */}
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算） */}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num1', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num1_1', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num2', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num2_1', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num3', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num3_1', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num4', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num4_1', 'text')}</div>
        </Col>

        {/* 第7列：备注（可编辑文本框 或 只读文本） */}
        <Col span={colSpanList[6]}>
          <div style={getStyles()}>{renderItem('remark1')}</div> {/* 质量培训-参加人数备注 */}
          <div style={getStyles()}>{renderItem('remark1_1')}</div> {/* 质量培训-次数备注 */}
          <div style={getStyles()}>{renderItem('remark2')}</div> {/* 检查-发现问题数量备注 */}
          <div style={getStyles()}>{renderItem('remark2_1')}</div> {/* 检查-次数备注 */}
          <div style={getStyles()}>{renderItem('remark3')}</div> {/* QC活动-参加人数备注 */}
          <div style={getStyles()}>{renderItem('remark3_1')}</div> {/* QC活动-小组数量备注 */}
          <div style={getStyles()}>{renderItem('remark4')}</div> {/* 自检自查-不符合项问题数备注 */}
          <div style={getStyles()}>{renderItem('remark4_1')}</div> {/* 自检自查-次数备注 */}
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule2);
