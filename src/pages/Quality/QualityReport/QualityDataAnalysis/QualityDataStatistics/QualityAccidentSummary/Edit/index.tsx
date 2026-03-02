// 引入 React 核心库及 useEffect（虽然当前未使用，但保留以备扩展）
import React from "react";
// 引入当前模块的列配置（定义表单字段的元信息）
import { configColumns } from "../columns";
// 从 yayang-ui 引入表单列构建工具和编辑模态框组件
import { BasicFormColumns, SingleTable } from "yayang-ui";
// 引入 Umi 的国际化钩子 useIntl 和 connect（用于注入 Redux dispatch）
import { useIntl, connect } from "umi";
// 引入全局错误码常量，用于判断接口响应状态
import { ErrorCode } from "@/common/const";
import { message, Form } from "antd";
// 引入自定义的华为云 OBS 单文件上传组件（注意：这里是 SingleFile 版本）
import HuaWeiOBSUploadFile from "@/components/HuaWeiOBSUploadSingleFile";
// 引入华为云 OBS 系统路径常量配置
import { HUA_WEI_OBS_CONFIG } from "@yayang/constants";
// 从 SingleTable 中解构出编辑弹窗组件
const { CrudEditModal } = SingleTable;

/**
 * 编辑质量事故汇总表的弹窗组件
 * @param props - 组件接收的属性
 *   - visible: 控制弹窗是否显示
 *   - onCancel: 关闭弹窗回调
 *   - callbackSuccess: 编辑成功后的回调（用于刷新父表格）
 *   - selectedRecord: 当前选中的原始数据记录（用于回显）
 *   - dispatch: Redux 的 action 分发函数
 * @constructor
 */
const QualityAccidentSummaryEdit: React.FC<any> = (props) => {
  // 从 props 中解构所需属性
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;

  // 获取国际化方法，用于将 title 字段转换为多语言文本
  const { formatMessage } = useIntl();
  // 创建表单实例用于监听字段变化
  const [form] = Form.useForm();
  // 使用 useWatch 监听 supervision_level 字段值
  const supervisionLevel = Form.useWatch('supervision_level', form);

  /**
   * 根据监督抽查级别判断字段是否必填
   * @param fieldName 字段名
   * @returns 是否必填
   */
  const isFieldRequired = (fieldName: string): boolean => {
    if (!supervisionLevel) return false;
    const level = String(supervisionLevel);

    // 国家 (0): 三个字段都必填
    if (level === '0') {
      return ['nc_batches', 'nc_batches1', 'nc_batches2'].includes(fieldName);
    }
    // 省/市/自治区 (1): nc_batches1 和 nc_batches2 必填
    if (level === '1') {
      return ['nc_batches1', 'nc_batches2'].includes(fieldName);
    }
    // 集团公司 (2): 只有 nc_batches2 必填
    if (level === '2') {
      return fieldName === 'nc_batches2';
    }
    return false;
  };

  /**
   * 根据监督抽查级别判断字段是否禁用
   * @param fieldName 字段名
   * @returns 是否禁用
   */
  const isFieldDisabled = (fieldName: string): boolean => {
    // 默认都禁用，只有选择了监督抽查级别后才根据级别启用相应字段
    if (!supervisionLevel) return true;
    const level = String(supervisionLevel);

    // 国家 (0): 三个字段都启用（不禁用）
    if (level === '0') {
      return false;
    }
    // 省/市/自治区 (1): nc_batches 禁用，其他启用
    if (level === '1') {
      return fieldName === 'nc_batches';
    }
    // 集团公司 (2): nc_batches 和 nc_batches1 禁用，nc_batches2 启用
    if (level === '2') {
      return ['nc_batches', 'nc_batches1'].includes(fieldName);
    }
    return true;
  };

  /**
   * 构建编辑表单的字段配置
   * @returns 表单列配置数组
   */
  const getFormColumns = () => {
    // 基于 configColumns 初始化表单列配置器
    const cols = new BasicFormColumns(configColumns)
      // 初始化要显示的表单字段（顺序即展示顺序）
      .initFormColumns([
        'unit_leader_name',           // 单位领导姓名
        'supervising_leader_name',    // 监管领导姓名
        'office_phone',               // 办公电话
        'quality_department',         // 质量部门
        'responsible_person_name',    // 责任人姓名
        'contact_phone_mobile',       // 联系手机
        'accident_level',             // 事故等级
        'accident_count',             // 事故次数
        'total_direct_loss',          // 直接经济损失（万元）
        'supervision_level',          // 监管层级
        'nc_batches',                 // 不合格批次(国家)
        'nc_batches1',                // 不合格批次(省/市/自治区)
        'nc_batches2',                // 不合格批次(集团公司)
        // 自定义"附件"字段：使用华为云单文件上传组件
        {
          title: "compinfo.file_url",     // 国际化 key（后续会被 formatMessage 替换）
          subTitle: "附件",                // 中文备用标题（调试用）
          dataIndex: "file_url",          // 对应数据字段名
          width: 160,                     // 列宽（在表单中可能不生效，但保持一致性）
          align: "center",                // 对齐方式
          // 自定义表单渲染函数：返回上传组件
          renderSelfForm: () => {
            return (
              <HuaWeiOBSUploadFile
                accept=".zip,.rar,.7z"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.QUALITY} // 系统分类路径（用于权限/归类）
                folderPath='/quality/qualityDataStatistics'   // OBS 存储的具体文件夹路径
                limitSize={100}                               // 限制单个文件最大 100MB
              />
            );
          },
        },
      ])
      .setFormColumnToInputNumber([
        { value: 'accident_count', valueType: 'digit' },
        { value: 'total_direct_loss', valueType: 'digit' },
      ])
      .needToRules([
        'unit_leader_name',           // 单位领导姓名
        'supervising_leader_name',    // 监管领导姓名
        'office_phone',               // 办公电话
        'quality_department',         // 质量部门
        'responsible_person_name',    // 责任人姓名
        'contact_phone_mobile',       // 联系手机
        'accident_level',             // 事故等级
        'accident_count',             // 事故次数
        'total_direct_loss',          // 直接经济损失（万元）
        'supervision_level',          // 监管层级
        // 根据 supervision_level 动态设置必填规则
        ...(isFieldRequired('nc_batches') ? ['nc_batches'] : []),
        ...(isFieldRequired('nc_batches1') ? ['nc_batches1'] : []),
        ...(isFieldRequired('nc_batches2') ? ['nc_batches2'] : []),
      ])
      // 根据监督抽查级别动态设置字段禁用状态
      .needToDisabled([
        { value: 'nc_batches', disabled: isFieldDisabled('nc_batches') },
        { value: 'nc_batches1', disabled: isFieldDisabled('nc_batches1') },
        { value: 'nc_batches2', disabled: isFieldDisabled('nc_batches2') },
      ])
      // 配置日期选择器字段：form_make_time 将以时间戳形式提交
      .setFormColumnToDatePicker([
        {
          value: 'form_make_time',        // 字段名
          valueType: 'dateTs',            // 使用时间戳格式（而非字符串）
          needValueType: 'timestamp',      // 明确指定后端需要的时间戳类型
        },
      ])
      // 配置下拉选择框字段
      .setFormColumnToSelect([
        {
          value: 'accident_level',        // 字段名
          data: [                         // 下拉选项数据源
            { accident_level: '0', name: '一般' },
            { accident_level: '1', name: '较大' },
            { accident_level: '2', name: '重大' },
            { accident_level: '3', name: '特大' },
            { accident_level: '4', name: '无' },
          ],
          name: 'name',                   // 显示文本的字段名
          valueType: 'select',            // 渲染为 Select 组件
        },
        {
          value: 'supervision_level',
          data: [
            { supervision_level: '0', name: '国家' },
            { supervision_level: '1', name: '省/市/自治区' },
            { supervision_level: '2', name: '集团公司' },
            { supervision_level: '3', name: '无' },
          ],
          name: 'name',
          valueType: 'select',
        },
      ])
      // 获取最终处理后的表单列配置数组
      .getNeedColumns();

    // 遍历所有列，将 title（国际化 key）替换为实际多语言文本
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    // 返回处理完成的表单配置
    return cols;
  };

  // 渲染编辑弹窗
  return (
    <CrudEditModal
      title={"编辑质量事故汇总表"}        // 弹窗标题（建议后续国际化）
      visible={visible}                  // 控制弹窗显隐
      onCancel={onCancel}                // 点击取消或关闭时的回调
      initialValue={selectedRecord}      // 表单初始值（用于回显已有数据）
      columns={getFormColumns()}         // 动态生成的表单字段配置
      form={form}                        // 传递表单实例，用于监听字段变化
      // 提交表单时的处理逻辑
      onCommit={(values: any) => {
        // 返回 Promise 以支持异步操作和加载状态
        return new Promise((resolve) => {
          // 发起更新请求
          dispatch({
            type: "qualityAccidentSummary/updateQualityAccidentSummary",
            payload: {
              ...selectedRecord, // 保留原始记录中的 id 等关键字段
              ...values,         // 合并用户修改的新值（覆盖同名字段）
            },
            callback: (res: any) => {
              resolve(true);   // 告诉 CrudEditModal 请求已完成
              // 判断接口是否成功
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                // 延迟 1 秒后触发成功回调（提升用户体验）
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
              // 如果失败，假设由全局错误拦截器统一处理（如显示 errMessage）
            },
          });
        });
      }}
    />
  );
};

// 使用 connect() 注入 dispatch（无 mapStateToProps）
export default connect()(QualityAccidentSummaryEdit);
