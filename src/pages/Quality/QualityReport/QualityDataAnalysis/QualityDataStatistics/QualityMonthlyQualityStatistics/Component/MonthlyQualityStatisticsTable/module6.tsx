// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块6：结果质量指标明细
 * 功能：展示最终交付成果相关的6项质量结果指标，包括优质工程、验收合格率、投产成功率、顾客满意度、事故数、问责数
 * 布局特点：
 *   - 第1列“结果质量”纵向跨7行（作为左侧主分类标签）
 *   - 第2列包含6个指标项，高度分别为：1 + 2 + 1 + 1 + 1 + 1 = 7 行
 *   - 第3列仅对“验收合格率”提供分子/分母说明（占2行），其余为空
 *   - 第4列提供部分指标的业务定义或补充说明
 *   - 第5~7列（本月值、累计值、备注）共7个数据行，但备注列仅渲染6项，存在字段错位风险
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于设置单元格高度、边框、居中等
 *   - renderItem: 父组件传入的字段渲染函数，根据 onlyShow 模式决定显示输入框或纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule6: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：主分类标签“结果质量”，纵向跨7行 */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(7)}>结果质量</div> {/* 高度 = 7 × itemHeight = 315px */}
        </Col>

        {/* 第2列：具体指标名称（6项，总高度=7行）*/}
        <Col span={colSpanList[1]}>
          {/* 获优质工程项目数 —— 占1行 */}
          <div style={getStyles(1)}>获优质工程项目数</div>
          {/* 工程质量一次验收合格率 —— 占2行（因需分子/分母）*/}
          <div style={getStyles(2)}>工程质量一次验收合格率</div>
          {/* 工程投产一次成功率 —— 占1行 */}
          <div style={getStyles()}>工程投产一次成功率</div>
          {/* 顾客满意指数 —— 占1行 */}
          <div style={getStyles()}>顾客满意指数</div>
          {/* 质量事故、事件数 —— 占1行 */}
          <div style={getStyles()}>质量事故、事件数</div>
          {/* 质量问责情况数量 —— 占1行 */}
          <div style={getStyles()}>质量问责情况数量</div>
        </Col>

        {/* 第3列：基础数据说明（仅“验收合格率”有内容）*/}
        <Col span={colSpanList[2]}>
          {/* 对应“优质工程” —— 无计算依据，留空 */}
          <div style={getStyles()}></div>
          {/* 验收合格率：分子 */}
          <div style={getStyles()}>单元或单项工程一次验收合格数</div>
          {/* 验收合格率：分母 */}
          <div style={getStyles()}>单元或单项工程总数</div>
          {/* 投产成功率 —— 无分子/分母说明，留空 */}
          <div style={getStyles()}></div>
          {/* 顾客满意指数 —— 留空 */}
          <div style={getStyles()}></div>
          {/* 质量事故数 —— 留空 */}
          <div style={getStyles()}></div>
          {/* 质量问责数 —— 留空 */}
          <div style={getStyles()}></div>
        </Col>

        {/* 第4列：业务描述或补充说明 */}
        <Col span={colSpanList[3]}>
          {/* 优质工程定义 —— 占1行 */}
          <div style={getStyles()}>
            优质工程：指获的全国行业协会颁发的优质工程奖项的工程。
          </div>
          {/* 验收合格率上报单位说明 —— 占2行（与第2列该项对齐）*/}
          <div style={getStyles(2)}>以单元或单项工程为单位上报。</div>
          {/* 投产一次成功工程数（可能是说明，也可能是数据项？此处语义模糊）*/}
          <div style={getStyles()}>投产一次成功工程数</div>
          {/* 顾客满意指数说明 */}
          <div style={getStyles()}>对顾客满意程度的定量化描述</div>
          {/* 质量事故说明 */}
          <div style={getStyles()}>质量事故、事件数量</div>
          {/* 质量问责 —— 无说明，留空 */}
          <div style={getStyles()}></div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本），共7个字段 */}
        <Col span={colSpanList[4]}>
          <div style={getStyles()}>{renderItem('type_num30', 'num')}</div> {/* 优质工程数 */}
          <div style={getStyles()}>{renderItem('type_num31', 'num')}</div> {/* 验收合格率：分子 */}
          <div style={getStyles()}>{renderItem('type_num32', 'num')}</div> {/* 验收合格率：分母 */}
          <div style={getStyles()}>{renderItem('type_num33', 'num')}</div> {/* 投产成功率 */}
          <div style={getStyles()}>{renderItem('type_num34', 'num')}</div> {/* 顾客满意指数 */}
          <div style={getStyles()}>{renderItem('type_num35', 'num')}</div> {/* 质量事故数 */}
          <div style={getStyles()}>{renderItem('type_num36', 'num')}</div> {/* 质量问责数 */}
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算）*/}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num30', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num31', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num32', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num33', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num34', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num35', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num36', 'text')}</div>
        </Col>

        {/* 第7列：备注（可编辑文本 或 只读文本）*/}
        {/* ⚠️ 注意：此处存在字段错位和数量不匹配问题（见下方【⚠️ 问题分析】）*/}
        <Col span={colSpanList[6]}>
          {/* 对应“验收合格率”的备注？但实际应属于 type_num31（分子）或整体指标 */}
          <div style={getStyles()}>{renderItem('remark31')}</div>
          {/* 对应“验收合格率”整体？设为2行高度 */}
          <div style={getStyles(2)}>{renderItem('remark32')}</div>
          {/* 对应“质量事故数”？但跳过了 type_num33（投产）和 type_num34（顾客满意）*/}
          <div style={getStyles()}>{renderItem('remark34')}</div>
          <div style={getStyles()}>{renderItem('remark35')}</div>
          <div style={getStyles()}>{renderItem('remark36')}</div>
          {/* remark37 无对应数据字段（type_num37 不存在），疑似越界 */}
          <div style={getStyles()}>{renderItem('remark37')}</div>
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule6);
