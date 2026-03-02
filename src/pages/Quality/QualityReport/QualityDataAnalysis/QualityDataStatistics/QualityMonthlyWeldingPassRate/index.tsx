// 引入 React 核心 Hook：useRef（获取组件实例引用）、useState（管理状态）
import React, { useRef, useState } from "react";
// 引入自定义通用表格组件（带表头 + 表体结构）
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器、气泡提示
import { Alert, Button, message, Modal, Space, Tooltip } from "antd";
// 引入 yayang-ui 的表格列配置工具类
import { BasicTableColumns } from "yayang-ui";
// 引入 Umi 的 connect 高阶组件（用于连接 model）
import { connect } from "umi";
// 引入本页面的列配置
import { configColumns } from "./columns";

// 引入新增、编辑、详情弹窗组件
import QualityMonthlyWeldingPassRateAdd from "./Add";
import QualityMonthlyWeldingPassRateEdit from "./Edit";
import QualityMonthlyWeldingPassRateDetail from "./Detail";

// 引入全局错误码常量（用于判断接口是否成功）
import { ErrorCode } from "@yayang/constants";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";

/**
 * 月度焊接一次合格率统计表 - 主页面组件
 * 功能：
 *   - 展示焊接检测数据（RT/UT/PT/TOFD 等）
 *   - 支持按组织层级（公司/分公司/项目部）过滤
 *   - 控制“当月仅允许填报一条”规则（禁止重复新增）
 *   - 提供新增、编辑、删除、查看详情、导出功能
 *   - 按权限动态显示操作按钮
 */
const QualityMonthlyWeldingPassRatePage: React.FC<any> = (props: any) => {
  // 从 props 中解构 dispatch（用于调用 model 方法）和路由权限配置
  const { dispatch, route: { authority } } = props;
  // useRef 用于获取 BaseHeaderAndBodyTable 实例，以便调用其方法（如 reloadTable、exportFile）
  const actionRef: any = useRef();
  // 控制详情弹窗显隐
  const [open, setOpen] = useState(false);
  // 当前选中的行记录（用于编辑/详情）
  const [selectedRecord, setSelectedRecord] = useState(null);
  // 新增弹窗显隐
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 编辑弹窗显隐
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 标记：当前月份是否已有填报数据（有则禁止新增）
  const [isCurrentMonthData, setIsCurrentMonthData] = useState<boolean>(false);
  // 从 localStorage 获取当前用户所属组织层级（'dep'=公司, 'branchComp'=分公司, 其他=项目部）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');
  // 标记当前月报是否已生成（已生成则禁用全部操作）
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  /**
   * 监听表格数据变化，判断当月是否已存在数据
   * @param dataSource 表格返回的数据源对象（包含 rows 数组）
   */
  const handleDataSourceChange = (dataSource: any) => {
    // 若 rows 长度 > 0，说明当月已填报
    setIsCurrentMonthData(dataSource.rows.length > 0);
  };

  /**
   * 动态生成表格列配置
   * 根据用户组织层级（propKey）决定是否显示“上级单位”或“部门名称”
   * 并配置可点击的单据号、日期格式化、导出字段等
   */
  const getTableColumns = () => {
    // 使用 yayang-ui 的列配置工具类初始化基础列
    const cols = new BasicTableColumns(configColumns);

    // 配置表头列（固定列）
    cols.initTableColumns([
      // 若为分公司层级，显示上级单位（公司）名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 若非公司层级（即分公司或项目部），显示部门名称
      'dep_name',
      // 单据号列：可点击跳转详情
      {
        title: "单据号",
        subTitle: "单据号", // 可能用于导出或排序别名
        dataIndex: "form_no",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return (
            <Tooltip title='点击查看详情'>
              <a
                onClick={() => {
                  setSelectedRecord(record); // 设置当前记录
                  setOpen(true);           // 打开详情弹窗
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

    ])
      // 配置表体数据列（焊接检测指标）
      .initBodyTableColumns([
        'type_code_name',    // 焊接类型名称
        'rt_shots',          // 射线检测拍片数
        'rt_pass',           // 射线检测合格数
        'rt_ratio',          // 射线检测合格率
        'ut_meters',         // 超声波检测米数
        'ut_pass',           // 超声波检测合格数
        'ut_ratio',          // 超声波检测合格率
        'pt_mt_tests',       // 渗透/磁粉检测次数
        'pt_mt_pass',        // 渗透/磁粉检测合格数
        'pt_ratio',          // 渗透/磁粉检测合格率
        'tofd_meters',       // TOFD 检测米数
        'tofd_pass',         // TOFD 检测合格数
        'tofd_ratio',        // TOFD 检测合格率
      ])
      // 将 form_make_time 列格式化为日期（YYYY-MM-DD）
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      // 配置导出时包含的字段（顺序影响导出 Excel 列顺序）
      .needToExport([
        propKey === 'branchComp' ? 'up_wbs_name' : "",
        'dep_name',
        'form_maker_name',
        'form_make_time',
        'type_code_name',
        'rt_shots',
        'rt_pass',
        'ut_meters',
        'ut_pass',
        'pt_mt_tests',
        'pt_mt_pass',
        'tofd_meters',
        'tofd_pass',
        'rt_ratio',
        'ut_ratio',
        'pt_ratio',
        'tofd_ratio',
      ]);

    // 返回最终需要的列配置数组
    return cols.getNeedColumns();
  };

  /**
   * 渲染顶部功能按钮栏（位于表格上方）
   * @param reloadTable 表格刷新函数（由 BaseHeaderAndBodyTable 注入）
   * @returns 按钮组 JSX 数组
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (monthlyReportLocked) {
      return [
        [
          <Button
            key="export"
            type={"primary"}
            style={{
              display: hasPermission(authority, "导出") ? "inline-block" : "none"
            }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >
            导出
          </Button>
        ]
      ];
    }
    return [
      [
        <Space key="toolbar-space">
          {/* 仅当当月无数据 且 用户为公司层级 且 有“新增”权限时，显示“新增”按钮 */}
          {

            <Button
              // 使用 style.display 控制显隐（建议改用条件渲染或 CSS 类）
              style={{
                display: propKey === 'dep' && hasPermission(authority, '新增')
                  ? 'inline'
                  : 'none'
              }}
              type="primary"
              onClick={() => {
                setAddVisible(true);
              }}
            >
              新增
            </Button>

          }
          {/* 导出按钮：有“导出”权限则显示 */}
          <Button
            type={"primary"}
            style={{
              display: hasPermission(authority, "导出") ? "inline-block" : "none"
            }}
            onClick={() => {
              // 调用子组件的 exportFile 方法触发导出
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >
            导出
          </Button>
        </Space>
      ]
    ];
  };

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
      {/* 主表格组件 */}
      <BaseHeaderAndBodyTable
        // 传递 ref 以便父组件调用其方法
        cRef={actionRef}
        key={monthlyReportLocked}
        // 默认查询过滤条件：根据当前用户所属部门代码过滤
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like'
          }
        ]}
        // 监听数据源变化，用于控制“是否已填报”
        onDataSourceChange={handleDataSourceChange}
        // 通过 key 变化强制重渲染表格（当 isCurrentMonthData 变化时）
        key={isCurrentMonthData}
        // 表格标题
        tableTitle={'月度焊接一次合格率统计表'}
        // 表头查询配置（用于分页、排序等）
        header={{
          sort: "form_no",                             // 默认排序字段
          order: "desc",                               // 降序
          rowKey: "form_no",                           // 行唯一标识
          type: "qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateHead",     // 查询 model action
          exportType: "qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateHead", // 导出用同一接口
          importType: "",                              // 无导入功能
        }}
        // 表体（明细）查询配置
        scan={{
          sort: "form_no",
          order: "desc",
          rowKey: "form_no",
          type: "qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateFlat",     // 明细查询接口
          exportType: "qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateFlat",
          importType: "",
        }}
        // 动态生成的列配置
        tableColumns={getTableColumns()}
        // 顶部按钮栏
        buttonToolbar={renderButtonToolbar}
        // 权限编码（用于内部权限判断）
        funcCode={authority}
        // 选中行操作栏配置（编辑、删除）
        selectedRowsToolbar={() => {
          if (monthlyReportLocked) {
            return {
              headerToolbar: () => [],
              scanToolbar: () => [],
            };
          }
          return {
            // 表头模式下的操作栏（通常用于汇总操作）
            headerToolbar: (
              selectedRows?: any[],
              reloadTable?: (filters?: any[], noFilters?: any) => void,
            ) => [
                // 编辑按钮：仅公司层级 + 有权限 + 选中1行时可用
                <Button
                  type={"primary"}
                  style={{
                    display: propKey === 'dep' && hasPermission(authority, "编辑")
                      ? "inline-block"
                      : "none"
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

                // 删除按钮：仅公司层级 + 有权限 + 选中1行时可用
                <Button
                  style={{
                    display: propKey === 'dep' && hasPermission(authority, '删除')
                      ? 'inline'
                      : 'none'
                  }}
                  danger
                  type={"primary"}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warning("每次只能删除一条数据");
                      return;
                    }
                    // 弹出确认框
                    Modal.confirm({
                      title: "删除",
                      content: "确定删除所选的内容？",
                      okText: "确定删除",
                      okType: "danger",
                      cancelText: "我再想想",
                      onOk() {
                        // 调用 model 删除接口
                        dispatch({
                          type: "qualityMonthlyWeldingPassRate/delQualityMonthlyWeldingPassRate",
                          payload: {
                            form_no: selectedRows[0]['form_no'],
                          },
                          callback: (res: any) => {
                            if (res.errCode === ErrorCode.ErrOk) {
                              message.success("删除成功");
                              // 刷新表格
                              if (actionRef.current) {
                                actionRef.current.reloadTable();
                              }
                            }
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
                </Button>
              ],
            // 表体（明细）模式下的操作栏（此处为空）
            scanToolbar: () => [],
          };
        }}
      />

      {/* 详情弹窗 */}
      {open && (
        <QualityMonthlyWeldingPassRateDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef} // 传递 ref 用于可能的刷新
        />
      )}

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityMonthlyWeldingPassRateEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            // 编辑成功后刷新表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {/* 新增弹窗 */}
      {addVisible && (
        <QualityMonthlyWeldingPassRateAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            // 新增成功后刷新表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

// 使用 connect 连接 model（即使未直接使用 state，但 dispatch 需要）
export default connect()(QualityMonthlyWeldingPassRatePage);
