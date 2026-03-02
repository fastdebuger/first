// 引入 React 的 useEffect（用于副作用处理）和 useState（管理组件内部状态）
import React, { useEffect, useState } from "react";
// 引入 Umi 的 connect 高阶组件，用于注入 dispatch（调用 model 中的 action）
import { connect } from "umi";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入 Ant Design 组件：按钮、消息提示、模态框
import { Button, message, Modal } from "antd";
// 引入可复用的月度质量统计表格组件（用于编辑表单）
import MonthlyQualityStatisticsTable from '../Component/MonthlyQualityStatisticsTable';

/**
 * 编辑质量事故汇总表弹窗组件
 * 功能：提供一个全屏模态框，内嵌可编辑表格，用于修改一条已存在的质量事故汇总记录
 * @param props
 *   - dispatch: 由 connect 注入，用于发起 model action
 *   - visible: 控制模态框是否显示（布尔值）
 *   - onCancel: 点击取消或关闭时的回调函数
 *   - callbackSuccess: 提交成功后的回调（通常用于刷新父页面表格）
 *   - selectedRecord: 当前要编辑的原始记录数据（包含 id、month、明细等字段）
 * @constructor
 */
const QualityAccidentSummaryEdit: React.FC<any> = (props) => {
  // 从 props 中解构所需属性
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  // 状态：存储当前编辑中的表单数据（初始为空对象）
  const [tableData, setTableData] = useState<null | object>({});
  // 状态：控制“保存”按钮的加载状态（防止重复提交）
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 副作用：当 selectedRecord 变化时，将其作为初始值赋给 tableData
   * 实现表单数据的“回显”（即打开编辑弹窗时自动填充原数据）
   */
  useEffect(() => {
    if (selectedRecord) {
      // 将选中记录的数据设置为表单初始值
      setTableData(selectedRecord);
    }
  }, [selectedRecord]); // 依赖 selectedRecord，确保每次打开不同记录时正确更新

  /**
   * 提交编辑后的表单数据
   */
  const save = () => {
    // 开启加载状态，禁用按钮
    setLoading(true);
    // 调用 model 中的更新接口
    dispatch({
      type: "qualityMonthlyQualityStatistics/updateQualityMonthlyQualityStatistics",
      payload: {
        // 合并原始记录（如 id）和用户修改后的数据
        ...selectedRecord,   // 保留原始不可变字段（如 id）
        ...tableData,       // 覆盖用户修改的字段
      },
      callback: (res: any) => {
        // 判断接口是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("编辑成功");
          callbackSuccess(); // 触发父组件的成功回调（如刷新列表）
        }
        // 无论成功与否，关闭加载状态
        setLoading(false);
      },
    });
  };

  // 渲染模态框
  return (
    <Modal
      // 样式：全屏宽度、顶部对齐、底部无额外 padding
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      // 主体内容区域高度占满视口减去标题和 footer 高度（108px ≈ 标题+footer+边距），支持垂直滚动
      bodyStyle={{
        height: 'calc(100vh - 108px)',
        overflowY: 'auto',
      }}
      // 模态框宽度设为 100%（全宽）
      width={'100%'}
      // 关闭回调（点击遮罩、ESC 或取消按钮时触发）
      onCancel={onCancel}
      // 兼容 Ant Design 4.x 的 visible 属性
      visible={visible}
      // Ant Design 5.x 推荐使用的 open 属性（两者同时存在可兼容新旧版本）
      open={visible}
      // 自定义底部按钮区：仅保留一个“保存”按钮
      footer={(
        <Button
          loading={loading}     // 显示加载 spinner（提交时禁用交互）
          onClick={save}        // 点击触发保存逻辑
          type={'primary'}      // 主题色按钮
          style={{ borderRadius: 6 }} // 圆角样式美化
        >
          保存
        </Button>
      )}
      // 模态框标题
      title={'编辑质量事故汇总表'}
    >
      {/* 嵌入可编辑表格子组件 */}
      <MonthlyQualityStatisticsTable
        tableData={tableData}       // 将当前编辑数据传入子组件（用于渲染和绑定）
        setTableData={setTableData} // 提供更新函数，子组件可通过它修改父状态（实现双向绑定）
      />
    </Modal>
  );
};

// 使用 connect() 注入 dispatch，使组件能调用 model 中的 action
export default connect()(QualityAccidentSummaryEdit);
