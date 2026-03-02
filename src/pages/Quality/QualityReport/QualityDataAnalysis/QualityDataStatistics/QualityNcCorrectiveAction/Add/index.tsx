// 引入 React 核心库
import React from "react";
// 引入当前模块的表单/表格列配置（定义字段元信息）
import { configColumns } from "../columns";
// 引入 yayang-ui 提供的表单列构建工具和通用新增弹窗组件
import { BasicFormColumns, SingleTable } from "yayang-ui";
// 引入 Umi 的国际化 hook 和 connect 方法（用于连接 Dva model）
import { useIntl, connect } from "umi";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入 Ant Design 的 message 提示组件
import { message } from "antd";
// 引入工具函数：获取当前时间戳（格式为 YYYY-MM-DD 所需的时间戳）
import { getTS } from '@/utils/utils-date';

// 从 yayang-ui 的 SingleTable 中解构出通用新增弹窗组件
const { CrudAddModal } = SingleTable;

/**
 * 新增不合格项纠正措施记录 - 弹窗组件
 * 功能说明：
 *   - 提供表单用于录入不合格项纠正措施信息
 *   - 支持必填校验、日期选择、文本域输入
 *   - 提交后调用 Dva model 接口，成功则提示并回调刷新父页面
 */
const QualityNcCorrectiveActionAdd: React.FC<any> = (props) => {
  // 从 props 中解构所需属性：
  // - dispatch: 用于触发 Dva action
  // - visible: 控制弹窗是否显示
  // - onCancel: 关闭弹窗的回调
  // - callbackSuccess: 新增成功后的回调（通常用于刷新列表）
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  // 获取国际化方法，用于将 title 字段转换为多语言文本
  const { formatMessage } = useIntl();

  /**
   * 构建表单字段配置（含校验规则、组件类型、默认值等）
   */
  const getFormColumns = () => {
    // 使用 BasicFormColumns 工具类初始化表单列
    const cols = new BasicFormColumns(configColumns)
      // 指定需要在表单中显示的字段顺序
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
      // 配置日期字段为 DatePicker，并指定传给后端的值为时间戳（timestamp）
      .setFormColumnToDatePicker([
        {
          value: 'occurrence_time',
          valueType: 'dateTs',       // 表示前端使用 Date 类型
          needValueType: 'timestamp' // 后端需要的是时间戳（毫秒）
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
      // 获取最终处理后的表单列配置数组
      .getNeedColumns();

    // 遍历所有字段，将 title（通常是国际化 key）替换为实际多语言文本
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    // 返回处理完成的表单列配置
    return cols;
  };

  /**
   * 渲染新增弹窗
   */
  return (
    <CrudAddModal
      // 弹窗标题
      title={"新增不合格项纠正措施记录"}
      // 控制弹窗显隐
      visible={visible}
      // 点击取消或关闭时的回调
      onCancel={onCancel}
      // 表单初始值：发生时间和完成时间默认设为今天（通过 getTS 获取今日时间戳），状态默认为0（整改中）
      initialValue={{
        occurrence_time: getTS(), // 返回类似 1700006400000 的时间戳
        completion_time: getTS(),               // 默认状态为0（整改中）
      }}
      // 表单字段配置（由 getFormColumns 生成）
      columns={getFormColumns()}
      // 提交表单时的处理函数（返回 Promise 以支持异步操作）
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          // 调用 Dva model 的新增接口
          dispatch({
            type: "qualityNcCorrectiveAction/addQualityNcCorrectiveAction",
            payload: values, // 提交的表单数据
            callback: (res: any) => {
              // 无论成功失败，先 resolve 以关闭 loading 状态
              resolve(true);

              // 判断接口是否成功
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                // 延迟 1 秒后执行成功回调（可优化为立即回调，此处可能是为了用户体验）
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

// 使用 connect 连接 Dva model（注入 dispatch）
export default connect()(QualityNcCorrectiveActionAdd);
