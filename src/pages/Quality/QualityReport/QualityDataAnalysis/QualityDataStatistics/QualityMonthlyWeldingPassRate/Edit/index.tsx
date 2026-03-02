// 引入 React 核心 Hook：用于副作用处理（useEffect）和状态管理（useState）
import React, { useEffect, useState } from "react";
// 引入字段配置文件（定义所有列的元信息）
import { configColumns } from "../columns";
// 引入 yayang-ui 提供的表单/表格构建工具类及编辑模态框组件
import {
  BasicEditableColumns,
  BasicFormColumns,
  HeaderAndBodyTable,
} from "yayang-ui";

// 引入 Umi 提供的 connect（连接 Dva model）和 useIntl（国际化支持）
import { connect, useIntl } from "umi";
// 引入全局错误码常量，用于判断接口响应是否成功
import { ErrorCode } from "@/common/const";
// 引入 Ant Design 的数字输入框和全局提示组件
import { InputNumber, message } from "antd";
// 从 HeaderAndBodyTable 中解构出编辑用的模态框组件
const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 月度焊接一次合格率统计表 - 编辑弹窗组件
 * 功能说明：
 *   - 主表单区域：展示不可编辑的基础信息（如部门、制单人等）
 *   - 子表格区域：可编辑各检测类型（RT/UT/PT/TOFD）的检测数量与合格数，并自动计算合格率
 *   - 提交时合并新增、修改、删除的明细项，调用后端更新接口
 */
const QualityMonthlyWeldingPassRateEdit: React.FC<any> = (props: any) => {
  // 从 props 中解构所需属性
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord } = props;
  // 获取国际化函数，用于多语言标题翻译
  const { formatMessage } = useIntl();
  // 存储从后端加载的子表格初始数据（即当前表单对应的检测明细列表）
  const [initTableData, setInitTableData] = useState<any>([]);

  /**
   * 组件挂载时，根据 selectedRecord.form_no 查询对应的明细数据
   */
  useEffect(() => {
    dispatch({
      // 调用 Dva model 中的查询方法
      type: "qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateBody",
      payload: {
        sort: 'id', // 排序字段
        order: 'asc', // 升序
        // 构造过滤条件：只查询当前 form_no 对应的明细
        filter: JSON.stringify([
          { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
        ]),
      },
      // 查询成功后的回调
      callback: (res: any) => {
        setInitTableData(res.rows); // 将返回的明细数据设为表格初始值
      },
    });
  }, []); // 空依赖数组，仅在组件首次渲染时执行

  /**
   * 构建主表单区域的字段配置（全部为只读）
   */
  const getFormColumns = () => {
    // 使用 BasicFormColumns 工具类处理 configColumns
    const cols = new BasicFormColumns(configColumns)
      // 指定需要显示的字段
      .initFormColumns([])
      // 将 form_make_time 配置为日期选择器，并指定其值类型为时间戳
      .setFormColumnToDatePicker([
        {
          value: 'form_make_time',
          valueType: 'dateTs',        // 前端使用 dateTs 类型
          needValueType: 'timestamp',  // 提交时转为 timestamp
        },
      ])
      // 获取最终需要渲染的表单列配置
      .getNeedColumns();

    // 对每个字段的 title 进行国际化翻译
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    return cols;
  };

  /**
   * 构建可编辑子表格的列配置（含自动计算合格率逻辑）
   */
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        // 焊接类型名称（只读）
        'type_code_name',

        // === RT 检测：总拍片数 ===
        {
          title: "compinfo.rt_shots",     // 国际化 key
          dataIndex: "rt_shots",          // 数据字段名
          width: 160,
          align: "center",
          editable: true,                 // 允许编辑
          // 自定义编辑单元格：使用 InputNumber，并在失焦时自动计算合格率
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = Number(e.target.value); // 用户输入的总检测数
              const pass = record.rt_pass ? Number(record.rt_pass) : 0; // 当前合格数
              // 计算合格率（保留两位小数），注意：若 total 为 0，结果为 NaN，但前端仍显示
              const ratio = ((pass / total) * 100).toFixed(2);
              const copyRecord = { ...record };
              // 更新总检测数和合格率
              Object.assign(copyRecord, {
                rt_shots: total,
                rt_ratio: ratio + '%',
              });
              handleSave(copyRecord); // 触发表格数据更新
            };
            return (
              <InputNumber
                defaultValue={record.rt_shots}
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },

        // === RT 检测：合格数 ===
        {
          title: "compinfo.rt_pass",
          dataIndex: "rt_pass",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = record.rt_shots ? Number(record.rt_shots) : 0;
              let pass = Number(e.target.value);
              // 合格数不能超过总检测数
              if (pass > total) pass = total;
              // 计算合格率（防止除零）
              const ratio = total ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                rt_pass: pass,
                rt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                defaultValue={record.rt_pass}
                max={record.rt_shots || 0} // 限制最大值
                onBlur={onBlur}
                style={{ width: '100%' }}
              />
            );
          },
        },
        'rt_ratio', // RT 合格率（只读）

        // === UT 检测：总米数 ===
        {
          title: "compinfo.ut_meters",
          dataIndex: "ut_meters",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = Number(e.target.value);
              const pass = record.ut_pass ? Number(record.ut_pass) : 0;
              const ratio = ((pass / total) * 100).toFixed(2);
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                ut_meters: total,
                ut_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.ut_meters} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },

        // === UT 检测：合格米数 ===
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
              const ratio = total ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                ut_pass: pass,
                ut_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.ut_pass} max={record.ut_meters || 0} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        'ut_ratio',

        // === PT/MT 检测：总检测次数 ===
        {
          title: "compinfo.pt_mt_tests",
          dataIndex: "pt_mt_tests",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = Number(e.target.value);
              const pass = record.pt_mt_pass ? Number(record.pt_mt_pass) : 0;
              const ratio = ((pass / total) * 100).toFixed(2);
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                pt_mt_tests: total,
                pt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.pt_mt_tests} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },

        // === PT/MT 检测：合格次数 ===
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
              const ratio = total ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                pt_mt_pass: pass,
                pt_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.pt_mt_pass} max={record.pt_mt_tests || 0} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        'pt_ratio',

        // === TOFD 检测：总米数 ===
        {
          title: "compinfo.tofd_meters",
          dataIndex: "tofd_meters",
          width: 160,
          align: "center",
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const total = Number(e.target.value);
              const pass = record.tofd_pass ? Number(record.tofd_pass) : 0;
              const ratio = ((pass / total) * 100).toFixed(2);
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                tofd_meters: total,
                tofd_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.tofd_meters} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },

        // === TOFD 检测：合格米数 ===
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
              const ratio = total ? ((pass / total) * 100).toFixed(2) : '0.00';
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                tofd_pass: pass,
                tofd_ratio: ratio + '%',
              });
              handleSave(copyRecord);
            };
            return <InputNumber defaultValue={record.tofd_pass} max={record.tofd_meters || 0} onBlur={onBlur} style={{ width: '100%' }} />;
          },
        },
        'tofd_ratio',
      ])
      // 明确指定某些字段即使初始化了也不可编辑（如合格率）
      .noNeedToEditable([
        'type_code_name',
        'rt_ratio',
        'ut_ratio',
        'pt_ratio',
        'tofd_ratio',
      ])
      // 获取最终的表格列配置
      .getNeedColumns();

    // 对所有列标题进行国际化翻译
    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });

    return cols;
  };

  /**
   * 表格顶部工具栏渲染函数（本页面不需要“新增”等按钮，返回空数组）
   */
  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [];
  };

  /**
   * 渲染编辑模态框组件
   */
  return (
    <CrudEditModal
      title={"编辑月度焊接一次合格率统计表"} // 模态框标题
      visible={visible}                     // 控制是否显示
      onCancel={onCancel}                   // 取消按钮回调
      toolBarRender={toolBarRender}         // 表格工具栏（无按钮）
      initFormValues={selectedRecord}       // 主表单初始值
      formColumns={getFormColumns()}        // 主表单字段配置（只读）
      tableColumns={getTableColumns()}      // 子表格列配置（可编辑 + 自动计算）
      initDataSource={initTableData}        // 子表格初始数据
      // 提交时的处理逻辑
      onCommit={(data: any) => {
        // 解构提交数据：包含新增、修改、删除项及表单实例
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue(); // 获取主表单值（虽然只读，但可能有隐藏字段）

        return new Promise((resolve) => {
          // 若无任何明细数据，直接成功（避免无效请求）
          if (!dataSource.length) {
            resolve(true);
            return;
          }

          // 调用 Dva model 更新接口
          dispatch({
            type: "qualityMonthlyWeldingPassRate/updateQualityMonthlyWeldingPassRate",
            payload: {
              ...selectedRecord, // 原始主记录（含 form_no 等关键字段）
              ...values,         // 主表单值（理论上不变）
              AddItems: JSON.stringify(addItems),     // 新增的明细项
              UpdateItems: JSON.stringify(editItems), // 修改的明细项
              // 删除项：只传 id 数组
              DelItems: JSON.stringify(
                delItems.reduce((result: any[], item: any) => {
                  result.push(item.id);
                  return result;
                }, [])
              ),
            },
            callback: (res: any) => {
              resolve(true); // 无论成功失败都 resolve，避免 loading 不消失
              // 判断是否成功
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                // 延迟触发父组件刷新（确保 UI 更新完成）
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  );
};

// 使用 connect 连接 Dva model（无 mapStateToProps，仅注入 dispatch）
export default connect()(QualityMonthlyWeldingPassRateEdit);
