// 引入 React 核心 Hook：用于副作用处理（useEffect）和状态管理（useState）
import React, { useEffect, useState } from "react";
// 引入 Ant Design 组件：数字输入框（InputNumber）和全局提示（message）
import { InputNumber, message } from "antd";
// 引入 Umi 提供的 connect（连接 Dva model）和 useIntl（国际化支持）
import { connect, useIntl } from "umi";
// 引入 yayang-ui 封装的表单/表格列配置工具类
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
// 引入共享的列配置（通常定义字段元信息）
import { configColumns } from "../columns";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@yayang/constants";
// 从 HeaderAndBodyTable 中解构出新增弹窗组件
const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增“月度焊接一次合格率统计表”弹窗组件
 * 功能：
 *   - 加载焊接类型字典（如管道、容器等）
 *   - 提供主表单（如制单时间）
 *   - 提供可编辑子表格，按焊接类型填写 RT/UT/PT/TOFD 检测数据
 *   - 用户输入总数或合格数时，自动计算并更新合格率（保留两位小数）
 *   - 提交时将数据发送至后端
 */
const QualityMonthlyWeldingPassRateAdd: React.FC<any> = (props: any) => {
  // 从 props 中解构所需属性
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  // 获取国际化函数，用于多语言标题翻译
  const { formatMessage } = useIntl();
  // 状态：存储从字典接口加载的焊接类型数据（作为子表格初始行）
  const [initTableData, setInitTableData] = useState<any>([]);

  /**
   * 组件挂载时，调用接口获取焊接类型字典（sys_type_code = 'WELDING_PASS_RATE'）
   */
  useEffect(() => {
    dispatch({
      type: 'contractBasic/getSysDict', // 调用 Dva model 的 effect
      payload: {
        sort: 'id', // 排序字段
        filter: JSON.stringify([ // 构造过滤条件（字符串化传给后端）
          { Key: 'sys_type_code', Val: 'WELDING_PASS_RATE', Operator: '=' }
        ])
      },
      callback: (res) => {
        // 如果返回结果有数据，则格式化为表格需要的结构
        if (res?.rows?.length) {
          const formatted = res.rows.map((item: any) => ({
            ...item,
            type_code_id: item.id,       // 原始 id 映射为 type_code_id
            type_code_name: item.dict_name, // 字典名称映射为 type_code_name
          }));
          console.log('formatted', formatted); // 开发调试用
          setInitTableData(formatted); // 设置为子表格初始数据
        }
      },
    });
  }, []); // 依赖数组为空，仅在组件首次渲染时执行

  /**
   * 构建主表单的列配置（例如：制单时间）
   * @returns 表单字段配置数组
   */
  const getFormColumns = () => {
    // 使用 BasicFormColumns 工具类构建表单列
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([]) // 初始化表单列（此处为空，实际字段由后续方法补充）
      // 将 form_make_time 字段配置为日期选择器，并指定值类型为时间戳
      .setFormColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .getNeedColumns(); // 获取最终需要的列配置

    // 对每列的 title 进行国际化翻译
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title }); // 假设 title 是国际化 key
    });

    return cols;
  };

  /**
   * 构建可编辑子表格的列配置
   * 包含：焊接类型名称 + 各检测项（总数、合格数、合格率）
   * 合格率在用户输入时自动计算（失焦触发）
   */
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      // 初始化表格列：指定显示顺序，混合字符串（复用 configColumns）和自定义对象
      .initTableColumns([
        'type_code_name', // 焊接类型名称（只读）

        // === RT（射线检测）===
        {
          title: "compinfo.rt_shots",     // 国际化 key
          dataIndex: "rt_shots",         // 数据字段名
          width: 160,
          align: "center",
          editable: true,
          // 自定义可编辑单元格渲染
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = Number(e.target.value); // 用户输入的检测总数
              const num2 = record.rt_pass ? Number(record.rt_pass) : 0; // 当前合格数
              // 安全计算合格率（避免除零错误）
              const ratio = num > 0 ? ((num2 / num) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              // 更新当前行的 rt_shots 和自动计算的 rt_ratio
              Object.assign(copyRecord, {
                rt_shots: num,
                rt_ratio: ratio + '%',
              });
              handleSave(copyRecord); // 触发表格保存
            };
            return <InputNumber onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        {
          title: "compinfo.rt_pass",
          dataIndex: "rt_pass",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = record.rt_shots ? Number(record.rt_shots) : 0; // 总数
              let pass = Number(e.target.value);
              // 合格数不能超过总数
              if (pass > total) pass = total;
              const ratio = total > 0 ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                rt_pass: pass,
                rt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                max={record.rt_shots || 0} // 限制最大值为总数
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },
        'rt_ratio', // RT 合格率（只读，由上述逻辑自动填充）

        // === UT（超声波检测）===
        {
          title: "compinfo.ut_meters",
          dataIndex: "ut_meters",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = Number(e.target.value);
              const num2 = record.ut_pass ? Number(record.ut_pass) : 0;
              const ratio = num > 0 ? ((num2 / num) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                ut_meters: num,
                ut_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        {
          title: "compinfo.ut_pass",
          dataIndex: "ut_pass",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = record.ut_meters ? Number(record.ut_meters) : 0;
              let pass = Number(e.target.value);
              if (pass > total) pass = total;
              const ratio = total > 0 ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                ut_pass: pass,
                ut_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                max={record.ut_meters || 0}
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },
        'ut_ratio',

        // === PT/MT（渗透/磁粉检测）===
        {
          title: "compinfo.pt_mt_tests",
          dataIndex: "pt_mt_tests",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = Number(e.target.value);
              const num2 = record.pt_mt_pass ? Number(record.pt_mt_pass) : 0;
              const ratio = num > 0 ? ((num2 / num) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                pt_mt_tests: num,
                pt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        {
          title: "compinfo.pt_mt_pass",
          dataIndex: "pt_mt_pass",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = record.pt_mt_tests ? Number(record.pt_mt_tests) : 0;
              let pass = Number(e.target.value);
              if (pass > total) pass = total;
              const ratio = total > 0 ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                pt_mt_pass: pass,
                pt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                max={record.pt_mt_tests || 0}
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },
        'pt_ratio',

        // === TOFD（衍射时差法超声检测）===
        {
          title: "compinfo.tofd_meters",
          dataIndex: "tofd_meters",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = Number(e.target.value);
              const num2 = record.tofd_pass ? Number(record.tofd_pass) : 0;
              const ratio = num > 0 ? ((num2 / num) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                tofd_meters: num,
                tofd_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        {
          title: "compinfo.tofd_pass",
          dataIndex: "tofd_pass",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = record.tofd_meters ? Number(record.tofd_meters) : 0;
              let pass = Number(e.target.value);
              if (pass > total) pass = total;
              const ratio = total > 0 ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                tofd_pass: pass,
                tofd_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                max={record.tofd_meters || 0}
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },
        'tofd_ratio',
      ])
      // 指定哪些列为只读（不可编辑）
      .noNeedToEditable([
        'type_code_name',
        'rt_ratio',
        'ut_ratio',
        'pt_ratio',
        'tofd_ratio',
      ])
      .getNeedColumns(); // 获取最终列配置

    // 对所有列标题进行国际化翻译
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    return cols;
  };

  /**
   * 自定义表格工具栏（此处不需要任何按钮，返回空数组）
   */
  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [];
  };

  /**
   * 渲染新增弹窗组件
   */
  return (
    <CrudAddModal
      title={"新增月度焊接一次合格率统计表"} // 弹窗标题
      visible={visible}                      // 控制弹窗显隐
      onCancel={onCancel}                    // 取消回调
      formColumns={getFormColumns()}         // 主表单配置
      initFormValues={{}}                    // 主表单初始值（空对象）
      initDataSource={initTableData}         // 子表格初始数据（来自字典）
      toolBarRender={toolBarRender}          // 工具栏渲染函数
      tableColumns={getTableColumns()}       // 子表格列配置
      // 提交处理函数
      onCommit={(data: any) => {
        const { dataSource } = data; // 获取子表格最终数据
        console.log('dataSource', data); // 调试日志

        // 返回 Promise 以支持异步提交
        return new Promise((resolve) => {
          // 若无数据，直接成功（可选逻辑）
          if (!dataSource.length) {
            return resolve(true);
          }

          // 调用 Dva model 提交数据
          dispatch({
            type: "qualityMonthlyWeldingPassRate/addQualityMonthlyWeldingPassRate",
            payload: {
              Items: JSON.stringify(dataSource), // 序列化为 JSON 字符串（后端要求）
            },
            callback: (res: any) => {
              resolve(true); // 无论成功失败都 resolve，避免 loading 卡住
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess(); // 通知父组件刷新列表
                }, 1000);
              }
              // 可在此处添加 else 分支处理错误（如 message.error）
            },
          });
        });
      }}
    />
  );
};

// 使用 connect() 将组件连接到 Dva model（注入 dispatch）
export default connect()(QualityMonthlyWeldingPassRateAdd);
