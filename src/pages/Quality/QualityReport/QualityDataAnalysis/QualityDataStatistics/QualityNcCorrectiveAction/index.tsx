// 引入 React 核心 Hook：用于创建引用（useRef）和状态管理（useState）
import React, { useRef, useState } from 'react';
// 引入 Ant Design 组件：按钮、提示、模态框、间距容器、工具提示
import { Alert, Button, message, Modal, Space, Tooltip } from "antd";
// 引入 Umi 的 connect 方法，用于连接 Dva model
import { connect } from 'umi';
// 引入通用 CRUD 表格基类组件
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
// 引入 yayang-ui 提供的表格列构建工具
import { BasicTableColumns } from 'yayang-ui';
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入当前模块的列配置
import { configColumns } from "./columns";

// 引入新增、详情、编辑子组件
import QualityNcCorrectiveActionAdd from "./Add";
import QualityNcCorrectiveActionDetail from "./Detail";
import QualityNcCorrectiveActionEdit from "./Edit";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";

/**
 * 不合格项纠正措施记录 - 主页面组件
 * 功能说明：
 *   - 展示不合格项纠正措施列表（按权限过滤层级：公司/分公司/项目部）
 *   - 支持查看、新增（仅当月无数据时）、编辑、删除、导出
 *   - 点击“不合格项名称”可查看详情
 */
const QualityNcCorrectiveActionPage: React.FC<any> = (props) => {
  // 从 props 中解构 dispatch（用于调用 model 方法）和路由权限配置
  const { dispatch, route: { authority } } = props;

  // 创建对 BaseCurdSingleTable 的 ref，用于手动触发 reload / export 等操作
  const actionRef: any = useRef();
  // 控制“新增”弹窗显隐
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制“详情”弹窗显隐
  const [open, setOpen] = useState<boolean>(false);
  // 存储当前选中的记录（用于编辑或查看详情）
  const [selectedRecord, setSelectedRecord] = useState<object | null>(null);
  // 标记当月是否已有填报数据（若有，则禁止新增）
  const [isCurrentMonthData, setIsCurrentMonthData] = useState<boolean>(false);
  // 从本地存储获取当前用户所属的组织层级（'dep': 公司, 'branchComp': 分公司, 其他: 项目部）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');
  // 标记当前月报是否已生成（已生成则禁用全部操作）
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  /**
   * 监听表格数据变化，用于判断当月是否有数据（决定是否允许新增）
   */
  const handleDataSourceChange = (dataSource: any) => {
    console.log('表格数据更新:', dataSource.rows.length > 0, dataSource);
    // 若表格有至少一条数据，则视为当月已填报
    setIsCurrentMonthData(dataSource.rows.length > 0);
  };

  /**
   * 构建表格列配置（根据用户层级动态显示字段）
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);

    // 初始化要显示的列（动态控制某些列是否显示）
    cols.initTableColumns([
      // 若用户是分公司层级（branchComp），显示上级 WBS 名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      "dep_name",
      // 不合格项名称（可点击查看详情）
      {
        title: "compinfo.nc_name",         // 国际化 key
        subTitle: "不合格品/项名称",        // 中文副标题（备用）
        dataIndex: "nc_name",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return (
            <Tooltip title='点击查看详情'>
              <a
                onClick={() => {
                  setSelectedRecord(record); // 设置当前记录
                  setOpen(true);             // 打开详情弹窗
                }}
              >
                {text}
              </a>
            </Tooltip>
          );
        },
      },

      // 其他固定字段
      "nc_code",           // 不合格项编码
      "nc_nature",         // 不合格性质
      "occurrence_time_str",   // 发生时间
      "occurrence_unit",   // 发生单位
      "nc_reason",         // 原因分析
      "corrective_action", // 纠正措施
      "completion_time",   // 完成时间
      {
        title: "compinfo.status",
        subTitle: "状态",
        dataIndex: "status",
        width: 160,
        align: "center",
        render: (text: any) => {
          const statusMap: { [key: number]: string } = {
            0: '整改中',
            1: '整改完成',
            2: '其他',
          };
          return statusMap[text] || text;
        },
      },
      "form_maker_name",   // 制单人
      "form_make_time",    // 制单时间
      "remark",            // 备注
    ])
      // 配置日期字段为 DatePicker 类型，并指定显示格式
      .setTableColumnToDatePicker([
        { value: 'occurrence_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'completion_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      // 指定导出时包含的字段（与显示字段一致，注意空字符串会被过滤）
      .needToExport([
        propKey === 'branchComp' ? 'up_wbs_name' : "",
        'dep_name',
        "nc_name",
        "nc_code",
        "nc_nature",
        "occurrence_time_str",
        "occurrence_unit",
        "nc_reason",
        "corrective_action",
        "completion_time",
        "status",
        "form_maker_name",
        "form_make_time",
        "remark",
      ]);

    // 返回最终需要渲染的列配置（自动过滤掉空字符串字段）
    return cols.getNeedColumns();
  };

  /**
   * 渲染顶部功能按钮栏（新增 + 导出）
   * @param reloadTable - 用于刷新表格的回调函数（本组件未直接使用）
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (monthlyReportLocked) {
      return [
        <Button
          key="export"
          type="primary"
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      ];
    }
    return [
      // 新增按钮（仅在公司层级 + 有权限 + 当月无数据时显示）
      <Space>

        <Button
          // 仅当用户是公司层级（propKey === 'dep'）且有“新增”权限时显示
          style={{
            display: propKey === 'dep' && hasPermission(authority, '新增') ? 'inline' : 'none'
          }}
          type="primary"
          onClick={() => {
            setAddVisible(true); // 打开新增弹窗
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile(); // 调用 BaseCurdSingleTable 的导出方法
            }
          }}
        >
          导出
        </Button>
      </Space>,
    ];
  };

  /**
   * 渲染选中行后的操作按钮栏（编辑 + 删除）
   * @param selectedRows - 当前选中的行数据数组
   * @param reloadTable - 刷新表格的回调（本组件通过 actionRef 调用）
   */
  const renderSelectedRowsToolbar = (
    selectedRows: any[],
    reloadTable: (filters?: [], noFilters?: []) => void
  ) => {
    if (monthlyReportLocked) return [];
    return [
      // 编辑按钮（仅公司层级 + 有权限 + 单选时可用）
      <Button
        style={{
          display: propKey === 'dep' && hasPermission(authority, '编辑') ? 'inline' : 'none'
        }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]); // 设置选中记录
          setEditVisible(true);               // 打开编辑弹窗
        }}
      >
        编辑
      </Button>,

      // 删除按钮（仅公司层级 + 有权限 + 单选时可用）
      <Button
        danger
        style={{
          display: propKey === 'dep' && hasPermission(authority, '删除') ? 'inline' : 'none'
        }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
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
              // 调用 Dva model 删除接口
              dispatch({
                type: "qualityNcCorrectiveAction/deleteQualityNcCorrectiveAction",
                payload: {
                  id: selectedRows[0]['id'], // 传递记录 ID
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
    ];
  };

  /**
   * 渲染主页面结构
   */
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
      <BaseCurdSingleTable
        cRef={actionRef} // 绑定 ref，用于外部控制
        rowKey="id"      // 指定行唯一键
        key={monthlyReportLocked}
        rowSelection={{ type: 'radio' }} // 单选模式
        onDataSourceChange={handleDataSourceChange} // 监听数据变化
        tableTitle='不合格项纠正措施记录' // 表格标题
        type="qualityNcCorrectiveAction/getQualityNcCorrectiveAction" // 查询接口 type
        exportType="qualityNcCorrectiveAction/getQualityNcCorrectiveAction" // 导出接口 type
        tableColumns={getTableColumns()} // 表格列配置
        // 默认过滤条件：只查当前用户所属部门的数据
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like'
          }
        ]}
        funcCode={'getQualityNcCorrectiveAction'} // 功能编码（用于权限或日志）
        tableSortOrder={{ sort: 'id', order: 'desc' }} // 默认按 ID 降序
        buttonToolbar={renderButtonToolbar} // 顶部按钮栏
        selectedRowsToolbar={renderSelectedRowsToolbar} // 选中行操作栏
      />

      {/* 详情弹窗 */}
      {open && selectedRecord && (
        <QualityNcCorrectiveActionDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)} // 关闭回调
          callbackSuccess={() => {
            // 成功后刷新表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {/* 新增弹窗 */}
      {addVisible && (
        <QualityNcCorrectiveActionAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityNcCorrectiveActionEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

// 使用 connect 连接 Dva model（注入 dispatch）
export default connect()(QualityNcCorrectiveActionPage);
