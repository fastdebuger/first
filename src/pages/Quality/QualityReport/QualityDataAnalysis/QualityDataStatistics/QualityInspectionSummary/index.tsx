// 引入 React 核心 Hook：useRef（用于获取子组件实例）、useState（管理状态）
import React, { useRef, useState } from "react";
// 引入自定义的表格容器组件（含头部+主体表格）
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器、气泡提示
import { Alert, Button, message, Modal, Space, Tooltip } from "antd";
// 引入 yayang-ui 的表格列配置工具
import { BasicTableColumns } from "yayang-ui";
// 引入 Umi 的 connect 方法，用于注入 dispatch（Redux action 分发）
import { connect } from "umi";
// 引入当前页面的列配置定义
import { configColumns } from "./columns";
// 引入全局错误码常量（注意：此处从 @yayang/constants 引入，需确认路径是否正确）
import { ErrorCode } from "@yayang/constants";

// 引入新增、编辑、详情弹窗组件
import QualityInspectionSummaryAdd from "./Add";
import QualityInspectionSummaryEdit from "./Edit";
import QualityInspectionSummaryDetail from "./Detail";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";

/**
 * 质量大(专项)检查主要不合格项汇总情况分布 - 主页面组件
 * @param props - 组件接收的属性
 *   - dispatch: Redux 的 action 分发函数
 *   - route: 路由信息，其中 authority 为当前页面权限标识数组
 * @constructor
 */
const QualityInspectionSummaryPage: React.FC<any> = (props: any) => {
  // 从 props 中解构 dispatch 和路由权限
  const { dispatch, route: { authority } } = props;
  // 使用 ref 获取 BaseHeaderAndBodyTable 子组件实例，用于调用其方法（如导出、刷新）
  const actionRef: any = useRef();
  // 控制详情抽屉是否打开
  const [open, setOpen] = useState(false);
  // 存储当前选中的数据记录（用于详情、编辑）
  const [selectedRecord, setSelectedRecord] = useState(null);
  // 控制“新增”弹窗显隐
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 从 localStorage 获取用户所属层级：
  // 'dep' = 项目部，'branchComp' = 分公司，其他 = 公司
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');
  // 标记当月是否已有填报数据（有则禁止新增）
  const [isCurrentMonthData, setIsCurrentMonthData] = useState<boolean>(false);
  // 标记当前月报是否已生成（已生成则禁用全部操作）
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  /**
   * 监听表格数据变化，用于判断是否已存在当月数据
   * @param dataSource - 表格返回的数据源（包含 rows 等字段）
   */
  const handleDataSourceChange = (dataSource: any) => {
    // 若表格有数据，则认为当月已填报，禁止新增
    setIsCurrentMonthData(dataSource.rows.length > 0);
  };

  /**
   * 构建主表格的列配置（包括头部表 + 明细表）
   * @returns 处理后的列配置数组
   */
  const getTableColumns = () => {
    // 基于 configColumns 初始化列配置器
    const cols = new BasicTableColumns(configColumns);
    // 配置头部表格（汇总行）显示的列
    cols.initTableColumns([
      // 分公司层级显示上级 WBS 名称（如公司名）
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 非项目部层级显示部门名称
      propKey !== 'dep' ? 'dep_name' : "",
      // 自定义“单据号”列：可点击跳转详情
      {
        title: "单据号",
        subTitle: "单据号",           // 备用标题（调试用）
        dataIndex: "form_no",        // 数据字段
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return (
            <Tooltip title='点击查看详情'>
              <a
                onClick={() => {
                  setSelectedRecord(record); // 设置当前记录
                  setOpen(true);             // 打开详情抽屉
                }}
              >
                {text}
              </a>
            </Tooltip>
          );
        },
      },
      'form_maker_name',   // 制单人
      'form_make_time',    // 制单时间
      'form_make_tz',      // 制单时区
    ])
      // 配置明细表格（展开行）显示的列
      .initBodyTableColumns([
        'type_code_name',    // 不合格项类型名称
        'num',               // 数量
        'ratio_num',         // 占比（%）
      ])
      // 配置导出时需要的字段（不含操作列）
      .needToExport([
        propKey === 'branchComp' ? 'up_wbs_name' : "",
        propKey !== 'dep' ? 'dep_name' : "",
        'form_maker_name',
        'form_make_time',
        'form_make_tz',
        'type_code_name',
        'num',
        'ratio_num',
      ])
      // 将 form_make_time 格式化为 YYYY-MM-DD 日期显示
      .setTableColumnToDatePicker([
        {
          value: 'form_make_time',
          valueType: 'dateTs',     // 原始值为时间戳
          format: 'YYYY-MM-DD',    // 展示格式
        },
      ]);

    // 返回最终处理后的列配置
    return cols.getNeedColumns();
  };

  /**
   * 渲染顶部功能按钮栏（新增 + 导出）
   * @param reloadTable - 表格刷新函数（此处未使用）
   * @returns 按钮组
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (monthlyReportLocked) {
      return [
        [
          <Button
            key="export"
            type={"primary"}
            style={{
              display: hasPermission(authority, "导出") ? "inline-block" : "none",
            }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >
            导出
          </Button>
        ],
      ];
    }
    return [
      [
        <Space key="toolbar">
          <Button
            style={{
              display:
                propKey === 'dep' && hasPermission(authority, '新增') ? 'inline' : 'none',
            }}
            type="primary"
            onClick={() => {
              setAddVisible(true);
            }}
          >
            新增
          </Button>
          {/* 导出按钮：有“导出”权限时显示 */}
          <Button
            type={"primary"}
            style={{
              display: hasPermission(authority, "导出") ? "inline-block" : "none",
            }}
            onClick={() => {
              // 调用子组件的导出方法
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >
            导出
          </Button>
        </Space>
      ],
    ];
  };

  // 渲染主页面
  return (
    <div>
      {monthlyReportLocked && (
        <Alert
          type="warning"
          showIcon
          message="当月月报已经生成，无法进行任何操作"
          style={{ marginBottom: 16 }}
        />
      )}
      {/* 主表格容器：支持头部汇总 + 明细展开 */}
      <BaseHeaderAndBodyTable
        cRef={actionRef} // 注入 ref，用于外部调用方法
        onDataSourceChange={handleDataSourceChange} // 监听数据变化
        key={monthlyReportLocked}
        tableTitle={'质量大(专项)检查主要不合格项汇总情况分布'} // 表格标题
        // 默认查询过滤条件：根据当前用户部门代码过滤
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like',
          },
        ]}
        // 头部表格（汇总行）配置
        header={{
          sort: "form_no",                             // 默认排序字段
          order: "desc",                               // 排序方向
          rowKey: "form_no",                           // 行唯一标识
          type: "qualityInspectionSummary/queryQualityInspectionSummaryHead",   // 查询接口 type
          exportType: "qualityInspectionSummary/queryQualityInspectionSummaryHead", // 导出接口
          importType: "",                              // 无导入功能
        }}
        // 明细表格（展开行）配置
        scan={{
          sort: "id",
          order: "desc",
          rowKey: "id",
          type: "qualityInspectionSummary/queryQualityInspectionSummaryFlat",   // 明细查询接口
          exportType: "qualityInspectionSummary/queryQualityInspectionSummaryFlat",
          importType: "",
        }}
        tableColumns={getTableColumns()} // 动态列配置
        buttonToolbar={renderButtonToolbar} // 顶部按钮栏
        funcCode={authority} // 权限标识（用于内部权限控制）
        // 选中行后显示的操作按钮（编辑 + 删除）
        selectedRowsToolbar={() => {
          if (monthlyReportLocked) {
            return {
              headerToolbar: () => [],
              scanToolbar: () => [],
            };
          }
          return {
            // 头部表格选中行的操作栏
            headerToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [
                // 编辑按钮：仅项目部 + 有权限 + 选中1行时可用
                <Button
                  type={"primary"}
                  style={{
                    display:
                      propKey === 'dep' && hasPermission(authority, "编辑") ? "inline-block" : "none",
                  }}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warn('每次编辑一行数据');
                      return;
                    }
                    setSelectedRecord(selectedRows[0]);
                    setEditVisible(true);
                  }}
                >
                  编辑
                </Button>,
                // 删除按钮：仅项目部 + 有权限 + 选中1行时可用
                <Button
                  style={{
                    display:
                      propKey === 'dep' && hasPermission(authority, '删除') ? 'inline' : 'none',
                  }}
                  danger
                  type={"primary"}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warning("每次只能删除一条数据");
                      return;
                    }
                    // 弹出确认删除对话框
                    Modal.confirm({
                      title: "删除",
                      content: "确定删除所选的内容？",
                      okText: "确定删除",
                      okType: "danger",
                      cancelText: "我再想想",
                      onOk() {
                        // 发起删除请求
                        dispatch({
                          type: "qualityInspectionSummary/delQualityInspectionSummary",
                          payload: {
                            form_no: selectedRows[0]['form_no'], // 通过单据号删除
                          },
                          callback: (res: any) => {
                            if (res.errCode === ErrorCode.ErrOk) {
                              message.success("删除成功");
                              // 刷新表格
                              if (actionRef.current) {
                                actionRef.current.reloadTable();
                              }
                            }
                            // 失败情况假设由全局拦截器处理
                          },
                        });
                      },
                      onCancel() {
                        console.log("Cancel");
                      },
                    });
                  }}
                >
                  删除
                </Button>,
              ],
            // 明细表格选中行的操作栏（当前为空）
            scanToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [],
          };
        }}
      />

      {/* 详情抽屉 */}
      {open && (
        <QualityInspectionSummaryDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef} // 传递 ref 用于刷新（但 Detail 组件可能未使用）
        />
      )}

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityInspectionSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            // 刷新主表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {/* 新增弹窗 */}
      {addVisible && (
        <QualityInspectionSummaryAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            // 刷新主表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

// 使用 connect() 注入 dispatch
export default connect()(QualityInspectionSummaryPage);
