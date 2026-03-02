// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块7：质量管理人员配置指标
 * 功能：展示2类人员比例指标：
 *   1. 企业专职质量管理人员占总人数比例
 *   2. 工程项目现场质检人员配备比例
 * 布局特点：
 *   - 第1列“质量管理人员”纵向跨4行（作为左侧主分类标签）
 *   - 第2列包含2个指标项，每项占2行（共 2×2 = 4 行）
 *   - 第3列提供每项的分子/分母说明（共4行）
 *   - 第4列提供详细的业务定义（每项占2行）
 *   - 第5~6列（本月值、累计值）各4个字段，严格对应
 *   - 第7列（备注）仅渲染2项，每项占2行，与指标项对齐（非数据行）
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于设置单元格高度、边框、居中等
 *   - renderItem: 父组件传入的字段渲染函数，根据 onlyShow 模式决定显示输入框或纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule7: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：主分类标签“质量管理人员”，纵向跨4行 */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(4)}>质量管理人员</div> {/* 高度 = 4 × itemHeight = 180px */}
        </Col>

        {/* 第2列：具体指标名称（2项，每项占2行）*/}
        <Col span={colSpanList[1]}>
          {/* 企业专职质量管理人员比例 —— 占2行 */}
          <div style={getStyles(2)}>专职质量管理人员比例</div>
          {/* 项目现场质检人员配备比例 —— 占2行 */}
          <div style={getStyles(2)}>工程总承包、施工项目现场质检人员配备比例</div>
        </Col>

        {/* 第3列：基础数据说明（每指标2行：分子 + 分母）*/}
        <Col span={colSpanList[2]}>
          {/* 指标1：分子 —— 企业专职质量管理人员数 */}
          <div style={getStyles()}>企业专职质量管理人员数</div>
          {/* 指标1：分母 —— 企业总人数 */}
          <div style={getStyles()}>企业总人数</div>
          {/* 指标2：分子 —— 项目现场质检人员数 */}
          <div style={getStyles()}>工程总承包、施工项目现场质检人员数</div>
          {/* 指标2：分母 —— 项目现场总人数 */}
          <div style={getStyles()}>工程总承包、施工项目现场人员总数</div>
        </Col>

        {/* 第4列：业务定义与说明（每项占2行，与第2列对齐）*/}
        <Col span={colSpanList[3]}>
          {/* 指标1定义：明确“质量管理人员”范围 */}
          <div style={getStyles(2)}>
            质量管理人员是指在企业和项目质量部门岗位并从事质量评审、审核、质量检查等专职质量管理的人员。
            专业监理工程师等不在质量管理部门的不列入
          </div>
          {/* 指标2定义：说明配备依据 */}
          <div style={getStyles(2)}>
            工程总承包、施工项目部应根据项目规模和技术要求，按项目现场实际人数比例配备质检人员
          </div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本），共4个字段（2指标 × 2）*/}
        <Col span={colSpanList[4]}>
          {/* 指标1：分子 */}
          <div style={getStyles()}>{renderItem('type_num37', 'num')}</div>
          {/* 指标1：分母 */}
          <div style={getStyles()}>{renderItem('type_num38', 'num')}</div>
          {/* 指标2：分子 */}
          <div style={getStyles()}>{renderItem('type_num39', 'num')}</div>
          {/* 指标2：分母 */}
          <div style={getStyles()}>{renderItem('type_num40', 'num')}</div>
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算）*/}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num37', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num38', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num39', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num40', 'text')}</div>
        </Col>

        {/* 第7列：备注（按“指标项”维度填写，非“数据行”维度）*/}
        {/* ✅ 设计合理：每个指标整体一个备注，占2行，与第2列对齐 */}
        <Col span={colSpanList[6]}>
          {/* 指标1（专职质量管理人员比例）的整体备注 */}
          <div style={getStyles(2)}>{renderItem('remark37')}</div>
          <div style={getStyles(2)}>{renderItem('remark39')}</div>
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule7);
