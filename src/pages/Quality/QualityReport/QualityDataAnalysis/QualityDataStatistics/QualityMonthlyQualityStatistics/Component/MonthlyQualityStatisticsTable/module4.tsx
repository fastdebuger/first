// 引入 React（无状态函数组件）
import React from 'react';
// 引入 Ant Design 的栅格系统：Row（行容器）、Col（列容器）
import { Col, Row } from 'antd';
// 引入 Umi 的 connect 高阶组件（虽未使用 dispatch，但可能为保持项目风格一致而保留）
import { connect } from 'umi';

/**
 * 月度质量统计表 - 模块4：过程（施工）质量指标明细
 * 功能：展示5类施工质量相关指标，包括设备完好率、焊接合格率、评片准确率、整改率、计量器具检定率
 * 布局特点：
 *   - 第1列“过程（施工）质量”纵向跨12行（作为左侧主分类标签）
 *   - 第2列包含5个指标项，高度分别为：2+2+2+2+4 = 12 行
 *   - 第3列基础数据共10行（每指标2行：分子+分母），其中最后1项占4行（2+2）
 *   - 第4列描述包含长文本说明，部分为空用于对齐
 *   - 第5~7列（本月值、累计值、备注）严格按10个数据行 + 2个双行项（共12行）对齐
 * @param props
 *   - getStyles: 父组件传入的样式生成函数，用于设置单元格高度、边框、居中等
 *   - renderItem: 父组件传入的字段渲染函数，根据 onlyShow 模式决定显示输入框或纯文本
 *   - colSpanList: 父组件传入的每列栅格宽度数组（长度为7），支持只读/编辑模式动态调整
 */
const MonthlyQualityStatisticsTableModule4: React.FC<any> = (props) => {
  // 从 props 中解构所需工具函数和配置
  const { getStyles, renderItem, colSpanList } = props;

  return (
    // 最外层 Col 占满整行（24 栅格），确保模块独立成块
    <Col span={24}>
      {/* 内部 Row 容器，启用 border-box 盒模型以精确控制尺寸 */}
      <Row style={{ boxSizing: 'border-box' }}>
        {/* 第1列：主分类标签“过程（施工）质量”，纵向跨12行 */}
        <Col span={colSpanList[0]}>
          <div style={getStyles(12)}>过程（施工）质量</div> {/* 高度 = 12 × itemHeight = 540px */}
        </Col>

        {/* 第2列：具体指标名称（5项）*/}
        <Col span={colSpanList[1]}>
          {/* 施工设备完好率 —— 占2行 */}
          <div style={getStyles(2)}>现场在用施工设备完好率</div>
          {/* 焊接一次合格率 —— 占2行 */}
          <div style={getStyles(2)}>焊接一次合格率</div>
          {/* 无损检测评片准确率 —— 占2行 */}
          <div style={getStyles(2)}>无损检测评片准确率</div>
          {/* 质量问题整改率 —— 占2行 */}
          <div style={getStyles(2)}>质量问题整改率</div>
          {/* 强检计量器具检定率 —— 占4行（因描述较长）*/}
          <div style={getStyles(4)}>强检计量器具检定率</div>
        </Col>

        {/* 第3列：基础数据（计算依据：分子 / 分母）*/}
        <Col span={colSpanList[2]}>
          {/* 设备完好率：分子 */}
          <div style={getStyles()}>现场在用施工设备完好台（件）数</div>
          {/* 设备完好率：分母 */}
          <div style={getStyles()}>现场在用施工设备总台（件）数</div>

          {/* 焊接合格率：分子 */}
          <div style={getStyles()}>一次检测合格底片数量</div>
          {/* 焊接合格率：分母 */}
          <div style={getStyles()}>一次检测底片总数</div>

          {/* 评片准确率：分子 */}
          <div style={getStyles()}>评定准确的底片数量</div>
          {/* 评片准确率：分母 */}
          <div style={getStyles()}>评定底片的总数</div>

          {/* 整改率：分子 */}
          <div style={getStyles()}>实际完成整改的质量问题项数</div>
          {/* 整改率：分母 */}
          <div style={getStyles()}>发生的质量问题总数</div>

          {/* 计量器具检定率：分子 —— 占2行 */}
          <div style={getStyles(2)}>已受检强检计量器具数</div>
          {/* 计量器具检定率：分母 —— 占2行 */}
          <div style={getStyles(2)}>应强检计量器具总数</div>
        </Col>

        {/* 第4列：业务描述（含详细定义）*/}
        <Col span={colSpanList[3]}>
          {/* 设备定义 —— 占2行 */}
          <div style={getStyles(2)}>施工设备：用于工程项目建设的主要设备和关键辅助设备。</div>
          {/* 底片定义 —— 占2行 */}
          <div style={getStyles(2)}>检测底片：为判断焊口质量，依据标准进行射线探伤（RT）所拍的底片</div>
          {/* 评片准确率无额外说明 —— 空单元格占2行（用于对齐）*/}
          <div style={getStyles(2)}></div>
          {/* 质量问题与整改定义 —— 占2行 */}
          <div style={getStyles(2)}>
            质量问题：包括体系内、外审和管理评审中发现的各类不符合项、日常巡检、顾客投诉的质量问题、内外部质量检验检测发现并需要额外投入资源（时间、人力、物力或技术）解决的现实的或潜在的质量问题。
            整改：采取了纠正改正措施且跟踪评估其效果，并使效果与预期或标准相符。
          </div>
          {/* 强检计量器具详细定义 —— 占4行 */}
          <div style={getStyles(4)}>
            应强检计量器具：指按《中华人民共和国计量法》规定，地区公司经政府授权的社会公用计量标准、地区公司使用的最高计量标准，以及地区公司用于贸易结算、安全防护、医疗卫生、环境监测4个方面的列入国家强制检定目录的工作计量器具；
            用于集团公司内部各地区公司之间产品或物料交接的计量器具，纳入用于贸易结算的强检计量器具管理，按应强检计量器具计算。
            已受检强检计量器：指经过政府授权的计量检定机构检定，获得检定证书，且证书在有效期内的强检计量器具。
          </div>
        </Col>

        {/* 第5列：本月数值（可编辑数字输入框 或 只读文本）*/}
        <Col span={colSpanList[4]}>
          {/* 设备完好率：分子 */}
          <div style={getStyles()}>{renderItem('type_num12', 'num')}</div>
          {/* 设备完好率：分母 */}
          <div style={getStyles()}>{renderItem('type_num13', 'num')}</div>

          {/* 焊接合格率：分子 */}
          <div style={getStyles()}>{renderItem('type_num14', 'num')}</div>
          {/* 焊接合格率：分母 */}
          <div style={getStyles()}>{renderItem('type_num15', 'num')}</div>

          {/* 评片准确率：分子 */}
          <div style={getStyles()}>{renderItem('type_num16', 'num')}</div>
          {/* 评片准确率：分母 */}
          <div style={getStyles()}>{renderItem('type_num17', 'num')}</div>

          {/* 整改率：分子 */}
          <div style={getStyles()}>{renderItem('type_num18', 'num')}</div>
          {/* 整改率：分母 */}
          <div style={getStyles()}>{renderItem('type_num19', 'num')}</div>

          {/* 计量器具检定率：分子 —— 占2行 */}
          <div style={getStyles(2)}>{renderItem('type_num20', 'num')}</div>
          {/* 计量器具检定率：分母 —— 占2行 */}
          <div style={getStyles(2)}>{renderItem('type_num21', 'num')}</div>
        </Col>

        {/* 第6列：截止本月累计值（只读文本，由后端计算）*/}
        <Col span={colSpanList[5]}>
          <div style={getStyles()}>{renderItem('sum_type_num12', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num13', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num14', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num15', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num16', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num17', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num18', 'text')}</div>
          <div style={getStyles()}>{renderItem('sum_type_num19', 'text')}</div>
          {/* 累计值也需对应双行高度 */}
          <div style={getStyles(2)}>{renderItem('sum_type_num20', 'text')}</div>
          <div style={getStyles(2)}>{renderItem('sum_type_num21', 'text')}</div>
        </Col>

        {/* 第7列：备注（可编辑文本 或 只读文本）*/}
        <Col span={colSpanList[6]}>
          {/* 每个数据项对应一个备注字段 */}
          <div style={getStyles()}>{renderItem('remark12')}</div>
          <div style={getStyles()}>{renderItem('remark13')}</div>
          <div style={getStyles()}>{renderItem('remark14')}</div>
          <div style={getStyles()}>{renderItem('remark15')}</div>
          <div style={getStyles()}>{renderItem('remark16')}</div>
          <div style={getStyles()}>{renderItem('remark17')}</div>
          <div style={getStyles()}>{renderItem('remark18')}</div>
          <div style={getStyles()}>{renderItem('remark19')}</div>
          {/* 最后两项备注占2行高度，与数据对齐 */}
          <div style={getStyles(2)}>{renderItem('remark20')}</div>
          <div style={getStyles(2)}>{renderItem('remark21')}</div>
        </Col>
      </Row>
    </Col>
  );
};

// 使用 connect() 包裹（虽未使用 model，但保持与其他模块一致）
export default connect()(MonthlyQualityStatisticsTableModule4);
