// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统组件：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽然本组件未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块1：表头区域（固定标题行）
 * 功能：渲染表格的第一行——即各列的中文标题（如“指标分类”、“本月”等）
 * @param props
 *   - getStyles: 由父组件传入的样式生成函数，用于统一单元格高度、边框、居中等样式
 *   - colSpanList: 由父组件传入的每列所占栅格数数组（长度为7），用于动态控制列宽
 */
const MonthlyQualityStatisticsTableModule1: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, colSpanList } = props;

  // 渲染表头
  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成行
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：指标分类 */}
        <Col span={colSpanList[0]}> {/* 根据 colSpanList 动态设置宽度 */}
          <div style={getStyles(1.5)}>指标分类</div> {/* 调用 getStyles(1.5) 设置 1.5 行高（约 67.5px） */}
        </Col>

        {/* 第2列：指标 */}
        <Col span={colSpanList[1]}>
          <div style={getStyles(1.5)}>指标</div>
        </Col>

        {/* 第3列：基础数据 */}
        <Col span={colSpanList[2]}>
          <div style={getStyles(1.5)}>基础数据</div>
        </Col>

        {/* 第4列：描述 */}
        <Col span={colSpanList[3]}>
          <div style={getStyles(1.5)}>描述</div>
        </Col>

        {/* 第5列：本月 */}
        <Col span={colSpanList[4]}>
          <div style={getStyles(1.5)}>本月</div>
        </Col>

        {/* 第6列：截止本月累计（不能跨年） */}
        <Col span={colSpanList[5]}>
          <div style={getStyles(1.5)}>截止本月累计(不能跨年)</div>
        </Col>

        {/* 第7列：备注 */}
        <Col span={colSpanList[6]}>
          <div style={getStyles(1.5)}>备注</div>
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹组件（虽未使用 model，但可能为与其他模块统一写法）
export default connect()(MonthlyQualityStatisticsTableModule1);
