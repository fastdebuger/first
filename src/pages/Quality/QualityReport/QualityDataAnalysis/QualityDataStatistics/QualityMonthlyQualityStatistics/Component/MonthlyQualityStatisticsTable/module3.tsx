// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块3：过程（设计）质量指标明细
 * 功能：展示与勘察设计相关的质量指标数据，包括评审率、审核率、变更率及错误类型统计
 * 布局特点：
 *   - 第1列"过程（设计）质量"纵向跨9行（作为左侧主分类标签）
 *   - 第2列包含4个指标项，其中前3项各占2行高度，最后一项占3行（共 2+2+2+3 = 9 行）
 *   - 错误类型统计拆分成三行：I类、II类、III类错误
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于设置单元格高度、边框、居中等
 *   - renderItem: 父组件传入的字段渲染函数，根据 onlyShow 模式决定显示输入框或纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule3: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：主分类标签"过程（设计）质量"，纵向跨9行 */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(9)}>过程（设计）质量</div> {/* 高度 = 9 × itemHeight = 405px */}
        </Col>

        {/* 第2列：具体指标名称 */}
        <Col span={colSpanList[1]}>
          {/* 勘察设计输入评审率 —— 占2行 */}
          <div style={getStyles(2)}>勘察设计输入评审率</div>
          {/* 设计过程审核率 —— 占2行 */}
          <div style={getStyles(2)}>设计过程审核率</div>
          {/* 设计变更率（由于设计原因）—— 占2行 */}
          <div style={getStyles(2)}>设计变更率（由于设计原因）</div>
          {/* 杜绝设计错误统计 - 拆分成三行 */}
          <div style={getStyles()}>杜绝设计I类错误出现数</div>
          <div style={getStyles()}>杜绝设计II类错误出现数</div>
          <div style={getStyles()}>杜绝设计III类错误出现数</div>
        </Col>

        {/* 第3列：基础数据说明（计算依据）*/}
        <Col span={colSpanList[2]}>
          {/* 对应"评审率"的分子 */}
          <div style={getStyles()}>勘察设计输入评审文件数量</div>
          {/* 对应"评审率"的分母 */}
          <div style={getStyles()}>应评审数量</div>
          {/* 对应"审核率"的分子 */}
          <div style={getStyles()}>已完成校审、评审文件数量</div>
          {/* 对应"审核率"的分母 */}
          <div style={getStyles()}>应校审、评审文件数量</div>
          {/* 对应"变更率"的分子 */}
          <div style={getStyles()}>设计变更涉及的设计文件数量</div>
          {/* 对应"变更率"的分母 */}
          <div style={getStyles()}>项目设计文件总数</div>
          {/* 错误类型统计说明 - 拆分成三行 */}
          <div style={getStyles()}>出现I类错误数</div>
          <div style={getStyles()}>出现II类错误数</div>
          <div style={getStyles()}>出现III类错误数</div>
        </Col>

        {/* 第4列：描述（业务含义或参考）*/}
        <Col span={colSpanList[3]}>
          {/* 评审情况说明 —— 占2行（与第2列第一项对齐）*/}
          <div style={getStyles(2)}>勘察设计输入评审情况</div>
          {/* 空单元格 —— 占2行（与第2列第二项对齐，视觉留白）*/}
          <div style={getStyles(2)} />
          {/* 设计文件范围说明 —— 占2行（与第2列第三项对齐）*/}
          <div style={getStyles(2)}>设计文件：包括工程规定、设计图纸、计算书等张、页数</div>
          {/* 参考附件 - 合并三行 */}
          <div style={getStyles(3)}>见附件2-3</div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本）*/}
        <Col span={colSpanList[4]}>
          {/* 评审文件数量（分子）*/}
          <div style={getStyles()}>{renderItem('type_num5', 'num')}</div>
          {/* 应评审数量（分母）*/}
          <div style={getStyles()}>{renderItem('type_num6', 'num')}</div>
          {/* 已完成校审数量（分子）*/}
          <div style={getStyles()}>{renderItem('type_num7', 'num')}</div>
          {/* 应校审数量（分母）*/}
          <div style={getStyles()}>{renderItem('type_num8', 'num')}</div>
          {/* 设计变更文件数（分子）*/}
          <div style={getStyles()}>{renderItem('type_num9', 'num')}</div>
          {/* 项目设计文件总数（分母）*/}
          <div style={getStyles()}>{renderItem('type_num10', 'num')}</div>
          {/* 错误统计 - 拆分成三个字段 */}
          <div style={getStyles()}>{renderItem('type_num11', 'num')}</div> {/* I类错误 */}
          <div style={getStyles()}>{renderItem('type_num11_1', 'num')}</div> {/* II类错误 */}
          <div style={getStyles()}>{renderItem('type_num11_2', 'num')}</div> {/* III类错误 */}
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算）*/}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num5', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num6', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num7', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num8', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num9', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num10', 'text')}</div>
          {/* 错误统计累计值 - 拆分成三个字段 */}
          <div style={getStyles()}>{renderItem('sum_type_num11', 'text')}</div> {/* I类错误累计 */}
          <div style={getStyles()}>{renderItem('sum_type_num11_1', 'text')}</div> {/* II类错误累计 */}
          <div style={getStyles()}>{renderItem('sum_type_num11_2', 'text')}</div> {/* III类错误累计 */}
        </Col>

        {/* 第7列：备注（可编辑文本 或 只读文本）*/}
        <Col span={colSpanList[6]}>
          {/* 对应"评审率"的备注（占2行）*/}
          <div style={getStyles(2)}>{renderItem('remark5')}</div>
          {/* 对应"审核率"的备注（占2行）*/}
          <div style={getStyles(2)}>{renderItem('remark7')}</div>
          {/* 对应"变更率"的备注（占2行）*/}
          <div style={getStyles(2)}>{renderItem('remark9')}</div>
          {/* 错误统计备注 - 拆分成三个字段 */}
          <div style={getStyles()}>{renderItem('remark11')}</div> {/* I类错误备注 */}
          <div style={getStyles()}>{renderItem('remark11_1')}</div> {/* II类错误备注 */}
          <div style={getStyles()}>{renderItem('remark11_2')}</div> {/* III类错误备注 */}
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule3);
