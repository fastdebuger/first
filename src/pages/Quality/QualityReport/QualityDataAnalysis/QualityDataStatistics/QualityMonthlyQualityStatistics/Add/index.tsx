// 引入 React 的 useState Hook，用于管理组件内部状态
import React, { useEffect, useState } from "react";
// 引入 Umi 的 connect 高阶组件，用于注入 dispatch（调用 model 中的 action）
import { connect } from "umi";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入 Ant Design 组件：按钮、消息提示、模态框
import { Button, message, Modal } from "antd";

// 引入自定义表格子组件，用于收集用户输入的质量事故数据
import MonthlyQualityStatisticsTable from '../Component/MonthlyQualityStatisticsTable';
import moment from "moment";

/**
 * 新增质量事故汇总表弹窗组件
 * 功能：提供一个全屏模态框，内嵌可编辑表格，用于新增一条质量事故汇总记录
 * @param props
 *   - dispatch: 由 connect 注入，用于发起 model action
 *   - visible: 控制模态框是否显示（布尔值）
 *   - onCancel: 点击取消或关闭时的回调函数
 *   - callbackSuccess: 提交成功后的回调（通常用于刷新父页面表格）
 * @constructor
 */
const QualityAccidentSummaryAdd: React.FC<any> = (props) => {
  // 从 props 中解构所需属性
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  // 状态：存储子表格组件收集到的完整表单数据（初始为空对象）
  // 类型为 object | null，但实际使用中建议定义具体接口类型（此处保留原写法）
  const [tableData, setTableData] = useState<null | object>({});
  // 状态：控制“保存”按钮的加载状态（防止重复提交）
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 只在弹窗打开时执行
    if (!visible) return;

    if (dispatch) {
      dispatch({
        type: "qualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics",
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([
            {
              Key: 'dep_code',
              Val: localStorage.getItem('auth-default-cpecc-depCode'),
              Operator: '=',
            },
            {
              Key: 'month',
              Val: moment().format('YYYY-MM'),
              Operator: '=',
            },
          ])
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            // 修复：检查 res.rows 和 res.rows[0] 是否存在
            if (res.rows && res.rows.length > 0 && res.rows[0]) {
              const data = {}
              const columnsKeys = Object.keys(res.rows[0])
              columnsKeys.forEach((key: string) => {
                if (key.includes('sum_type_num')) {
                  Object.assign(data, {
                    [key]: res.rows[0][key]
                  })
                }
              })
              setTableData(data);
            } else {
              // 如果没有数据，保持 tableData 为空对象
              setTableData({});
            }
          }
        },
      });
    }
  }, [visible, dispatch]);

  /**
   * 提交新增表单数据
   */
  const save = () => {
    // 开启加载状态
    setLoading(true);
    // 调用 model 中的新增接口
    dispatch({
      type: "qualityMonthlyQualityStatistics/addQualityMonthlyQualityStatistics",
      payload: {
        ...tableData, // 将子组件收集的数据作为请求体
      },
      callback: (res: any) => {
        // 判断接口是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("新增成功");
          callbackSuccess();           // 触发父组件的成功回调（如刷新列表）
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
      // 主体内容区域高度占满视口减去标题和 footer 高度，支持垂直滚动
      bodyStyle={{
        height: 'calc(100vh - 108px)',
        overflowY: 'auto',
      }}
      // 模态框宽度设为 100%（全宽）
      width={'100%'}
      // 关闭回调（点击遮罩、ESC 或取消按钮时触发）
      onCancel={onCancel}
      // 控制显隐（兼容旧版 antd）
      visible={visible}
      // 控制显隐（新版 antd 推荐使用 open）
      open={visible}
      // 自定义底部按钮区：仅保留一个“保存”按钮
      footer={(
        <Button
          loading={loading}     // 显示加载 spinner
          onClick={save}        // 点击触发保存
          type={'primary'}      // 主题色按钮
          style={{ borderRadius: 6 }} // 圆角样式
        >
          保存
        </Button>
      )}
      // 模态框标题
      title={'新增质量事故汇总表'}
    >
      {/* 嵌入可编辑表格子组件 */}
      <MonthlyQualityStatisticsTable
        tableData={tableData}       // 将当前表单数据传入子组件（用于初始化或回显）
        setTableData={setTableData} // 提供更新函数，子组件可通过它修改父状态
      />
    </Modal>
  );
};

// 使用 connect() 注入 dispatch，使组件能调用 model 中的 action
export default connect()(QualityAccidentSummaryAdd);
