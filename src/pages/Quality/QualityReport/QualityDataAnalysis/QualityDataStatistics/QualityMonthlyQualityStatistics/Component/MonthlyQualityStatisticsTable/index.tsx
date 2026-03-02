// 引入 React（无状态组件，无需 useState/useEffect）
import React from 'react';
// 引入 Ant Design 基础输入组件：文本框、数字输入框、栅格布局
import { Input, Row, InputNumber } from 'antd';
// 引入 Umi 的 connect（虽然本组件未直接使用 dispatch，但可能为未来扩展预留）
import { connect } from 'umi';

// 引入 7 个模块化子组件，分别负责表格不同区域的渲染
import Module1 from './module1';
import Module2 from './module2';
import Module3 from './module3';
import Module4 from './module4';
import Module5 from './module5';
import Module6 from './module6';
import Module7 from './module7';

// 引入 lodash 工具库，用于深拷贝对象（避免直接修改 props 数据）
import lodash from "lodash";

/**
 * 月度质量统计表主容器组件
 * 功能：根据 onlyShow 控制只读/编辑模式，统一管理表单数据流，并向子模块传递渲染工具函数
 * @param props
 *   - tableData: 当前表单的完整数据对象（由父组件传入）
 *   - setTableData: 更新表单数据的回调函数（用于双向绑定）
 *   - onlyShow: 是否为只读模式（默认 false，即编辑模式）
 */
const MonthlyQualityStatisticsTable: React.FC<any> = (props) => {
  // 解构 props，设置 onlyShow 默认值为 false（即默认可编辑）
  const { tableData, setTableData, onlyShow = false } = props;

  /**
   * 每个模块（Module1~7）在 Row 中所占的栅格列数（colSpan）
   * 根据是否只读动态调整布局宽度：
   * - 只读模式：[2, 3, 4, 9, 2, 2, 2] → 总和 24，紧凑展示
   * - 编辑模式：[2, 4, 4, 5, 2, 2, 5] → 第6列（截止本月累计值）显示，只读文本由后端计算
   */
  const colSpanList = onlyShow
    ? [2, 3, 4, 9, 2, 2, 2]
    : [2, 4, 4, 5, 2, 2, 5];

  // 每一行单元格的基准高度（单位：px）
  const itemHeight = 45;

  /**
   * 单元格通用居中样式
   * 使用 Flex 实现内容垂直+水平居中，适用于所有表格单元格
   */
  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',     // 水平居中
    alignItems: 'center',         // 垂直居中
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',     // 包含 padding 和 border 在 width/height 内
    textAlign: 'center',         // 文本居中（兼容非 Flex 内容）
  };

  /**
   * 根据传入的边框标识字符串，动态生成边框样式对象
   * 支持组合：如 'BL,BB' 表示左边界 + 下边界
   * @param text 边框指令字符串（如 'BL,BB'）
   * @returns 包含 border 样式的对象
   */
  const getborder = (text: string) => {
    const obj: any = {};
    if (text.includes('BR')) obj.borderRight = '1px solid #bfbfbf';   // 右边框
    if (text.includes('BL')) obj.borderLeft = '1px solid #bfbfbf';    // 左边框
    if (text.includes('BB')) obj.borderBottom = '1px solid #bfbfbf';  // 下边框
    if (text.includes('BT')) obj.borderTop = '1px solid #bfbfbf';     // 上边框
    return obj;
  };

  /**
   * 生成完整的单元格样式（居中 + 边框 + 高度）
   * @param num 单元格占据的行数（默认 1 行）
   * @returns 合并后的样式对象
   */
  const getStyles = (num: number = 1) => ({
    ...centerStyle,                     // 基础居中样式
    ...getborder('BL,BB'),              // 默认添加左边框和下边框（形成表格线）
    height: itemHeight * num,           // 根据行数计算高度
    boxSizing: 'border-box',            // 确保边框不撑破布局
  });

  /**
   * 根据「本月」字段名得到对应的「截止本月累计」字段名
   * 例如 type_num1 -> sum_type_num1，type_num11_1 -> sum_type_num11_1
   */
  const getSumKey = (typeNumKey: string): string | null => {
    if (typeNumKey.startsWith('type_num')) {
      return `sum_${typeNumKey}`;
    }
    return null;
  };

  /**
   * 表单数据变更处理函数
   * 使用 lodash 深拷贝避免直接修改原始对象，保证状态不可变性
   * 当修改的是「本月」字段（type_num*）时，同步按累加规则更新「截止本月累计」（sum_type_num*）：新累计 = 原累计 - 原本月 + 新本月，默认按 0 计算空值
   * @param val 新值（来自 Input 或 InputNumber）
   * @param keys 对应的字段名（如 'month', 'dep_name', 'type_num1'）
   */
  const tableOnChange = (val: any, keys: string) => {
    // 深拷贝当前表单数据
    const obj = lodash.cloneDeep(tableData);
    // 更新指定字段
    obj[keys] = val;
    // 若是「本月」字段，则动态更新对应的「截止本月累计」：新累计 = 原累计 - 原本月 + 新本月（空按 0 计）
    const sumKey = getSumKey(keys);
    if (sumKey) {
      const oldMonth = tableData[keys] ?? 0;
      const oldSum = tableData[sumKey] ?? 0;
      const newMonth = val ?? 0;
      const numOldMonth = Number(oldMonth);
      const numOldSum = Number(oldSum);
      const numNewMonth = Number(newMonth);
      obj[sumKey] = numOldSum - numOldMonth + numNewMonth;
    }
    // 通过回调通知父组件更新状态
    if (setTableData) setTableData(obj);
  };

  /**
   * 渲染单个表单项（支持只读/编辑模式自动切换）
   * @param keys 字段名（用于取值和更新）
   * @param type 渲染类型：'input'（默认文本框）、'num'（数字输入框）、'text'（纯文本）
   * @returns ReactNode
   */
  const renderItem = (keys: any, type: string = 'input') => {
    if (!onlyShow) {
      // 编辑模式
      if (type === 'text') {
        // 纯文本展示（不可编辑）：截止本月累计默认展示 0
        const displayVal = tableData[keys];
        const num = displayVal === undefined || displayVal === null || displayVal === '' ? 0 : Number(displayVal);
        return <span style={{ color: '#666' }}>{isNaN(num) ? 0 : num}</span>;
      }
      if (type === 'num') {
        // 数字输入框（无边框，全宽）
        return (
          <InputNumber
            bordered={false}                // 去除默认边框，融入表格
            style={{ width: '100%' }}       // 占满单元格
            value={tableData[keys]}         // 受控组件：值来自 tableData
            onChange={(val: any) => tableOnChange(val, keys)} // 值变化时更新
          />
        );
      }
      // 默认：普通文本输入框
      return (
        <Input
          bordered={false}
          value={tableData[keys]}
          onChange={(e: any) => tableOnChange(e.target.value, keys)}
        />
      );
    } else {
      // 只读模式：直接返回值（不渲染输入框）
      return tableData[keys];
    }
  };

  // 主渲染：使用 Ant Design Row 容器包裹所有模块
  return (
    <>
      {/* 顶部添加上边框和右边框，形成完整表格外框 */}
      <Row style={{ ...getborder('BT,BR'), boxSizing: 'border-box' }}>
        {/* 将工具函数和配置传递给每个子模块 */}
        <Module1 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module2 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module3 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module4 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module5 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module6 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
        <Module7 getStyles={getStyles} renderItem={renderItem} colSpanList={colSpanList} />
      </Row>
    </>
  );
};

// 使用 connect() 包裹（虽未使用 dispatch，但保持与其他组件一致，或为 future-proof）
export default connect()(MonthlyQualityStatisticsTable);
