// 引入 React 核心库
import React from "react";
// 引入当前模块的字段元信息配置（定义各字段的 label、类型等）
import { configColumns } from "../columns";
// 引入 yayang-ui 提供的表单列构建工具和通用编辑弹窗组件
import { BasicFormColumns, SingleTable } from "yayang-ui";
// 引入 Umi 的国际化 hook 和 connect 方法（用于注入 dispatch）
import { useIntl, connect } from "umi";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入 Ant Design 的 message 提示组件
import { message } from "antd";
// 从 yayang-ui 的 SingleTable 中解构出通用编辑弹窗组件
const { CrudEditModal } = SingleTable;

/**
 * 编辑不合格项纠正措施记录 - 弹窗组件
 * 功能说明：
 *   - 展示可编辑表单，预填充 selectedRecord 数据
 *   - 部分字段（如名称、编码）设为只读（不可修改）
 *   - 支持必填校验、日期选择、文本域输入
 *   - 提交后调用更新接口，成功则提示并回调刷新父页面
 */
const QualityNcCorrectiveActionEdit: React.FC<any> = (props) => {
  // 从 props 解构所需属性：
  // - dispatch: 用于触发 Dva action
  // - visible: 控制弹窗是否显示
  // - onCancel: 关闭弹窗的回调
  // - callbackSuccess: 编辑成功后的回调（通常用于刷新列表）
  // - selectedRecord: 当前要编辑的原始记录数据（作为表单初始值）
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;

  // 获取国际化方法，用于将字段 title（通常是 i18n key）转换为实际多语言文本
  const { formatMessage } = useIntl();

  /**
   * 构建编辑表单的字段配置（含校验规则、组件类型、禁用状态等）
   */
  const getFormColumns = () => {
    // 使用 BasicFormColumns 工具类初始化表单列
    const cols = new BasicFormColumns(configColumns)
      // 指定需要在编辑表单中显示的字段顺序
      .initFormColumns([
        'nc_name',           // 不合格项名称
        'nc_code',           // 不合格项编码
        'nc_nature',         // 不合格性质
        'occurrence_time',   // 发生时间
        'occurrence_unit',   // 发生单位
        'nc_reason',         // 原因分析
        'corrective_action', // 纠正措施
        'completion_time',   // 完成时间
        'status',            // 状态
        'remark',            // 备注
      ])
      // 设置必填校验字段（非空验证）
      .needToRules([
        'nc_name',
        'nc_code',
        'nc_nature',
      ])
      // 将备注字段渲染为 TextArea（多行文本输入框）
      .setFormColumnToInputTextArea([
        { value: 'remark' },
      ])
      // 设置某些字段为禁用状态（不可编辑）——通常主键或关键标识不允许修改
      .needToDisabled([
        'nc_name', // 名称不可改
        'nc_code', // 编码不可改
      ])
      // 配置日期字段为 DatePicker，并指定传给后端的值为时间戳（毫秒）
      .setFormColumnToDatePicker([
        {
          value: 'occurrence_time',
          valueType: 'dateTs',       // 前端使用 Date 类型
          needValueType: 'timestamp' // 后端需要时间戳
        },
        {
          value: 'completion_time',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
      ])
      // 配置下拉选择框字段
      .setFormColumnToSelect([
        {
          value: 'status',           // 字段名
          data: [                     // 下拉选项数据源
            { status: 0, name: '整改中' },
            { status: 1, name: '整改完成' },
            { status: 2, name: '其他' },
          ],
          name: 'name',              // 显示文本的字段名
          valueType: 'select',       // 渲染为 Select 组件
        },
      ])
      // 获取最终处理后的有效表单列配置数组（过滤掉未启用的字段）
      .getNeedColumns();

    // 遍历所有字段，将 title（通常是国际化 key）替换为实际多语言文本
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    // 返回处理完成的表单列配置
    return cols;
  };

  /**
   * 渲染编辑弹窗
   */
  return (
    <CrudEditModal
      // 弹窗标题
      title={"编辑不合格项纠正措施记录"}
      // 控制弹窗显隐
      visible={visible}
      // 点击取消或关闭时的回调
      onCancel={onCancel}
      // 表单初始值：使用传入的 selectedRecord 进行预填充
      initialValue={selectedRecord}
      // 表单字段配置（由 getFormColumns 生成）
      columns={getFormColumns()}
      // 提交表单时的处理函数（返回 Promise 以支持异步操作）
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          // 调用 Dva model 的更新接口
          dispatch({
            type: "qualityNcCorrectiveAction/updateQualityNcCorrectiveAction",
            payload: {
              // 合并原始记录和用户修改后的值：
              // - 保留原始记录中的 id 等关键字段
              // - 覆盖用户修改的字段
              ...selectedRecord,
              ...values,
            },
            callback: (res: any) => {
              // 无论成功失败，先 resolve 以关闭 loading 状态
              resolve(true);

              // 判断接口是否成功
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");

                // 延迟 1 秒后执行成功回调（可优化为立即执行）
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
              // 若失败，message 通常已在 model 或拦截器中处理，此处可不重复提示
            },
          });
        });
      }}
    />
  );
};

// 使用 connect 注入 dispatch（用于调用 Dva action）
export default connect()(QualityNcCorrectiveActionEdit);
