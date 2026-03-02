// 引入 React 核心 Hook：useEffect（副作用）、useRef（获取组件实例引用）、useState（状态管理）
import React, { useEffect, useRef, useState } from 'react';
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器、气泡提示
import { Alert, Button, message, Modal, Space, Tooltip } from "antd";
// 引入 Umi 的 connect，用于注入 dispatch 和 props（如 route 权限）
import { connect } from 'umi';
// 引入通用 CRUD 表格组件（封装了分页、筛选、导出等能力）
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
// 引入 yayang-ui 提供的列配置工具类和导入弹窗组件
import { BasicTableColumns } from 'yayang-ui';
// 引入全局错误码常量（用于判断接口是否成功）
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入当前页面的列配置定义
import { configColumns } from "./columns";

// 引入新增、详情、编辑弹窗组件
import QualityMonthlyQualityStatisticsAdd from "./Add";
import QualityMonthlyQualityStatisticsDetail from "./Detail";
import QualityMonthlyQualityStatisticsEdit from "./Edit";

// 引入 moment 用于日期格式化（获取当前年月）
import moment from "moment";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";

/**
 * 质量月度质量统计表主页面组件
 * 功能：展示、新增、编辑、删除、查看详情、导出
 * @constructor
 */
const QualityMonthlyQualityStatisticsPage: React.FC<any> = (props) => {
  // 从 props 中解构 dispatch（用于调用 model action）和路由权限配置
  const { dispatch, route: { authority } } = props;

  // 使用 ref 获取 BaseCurdSingleTable 实例，用于手动触发 reload/export 等操作
  const actionRef: any = useRef();
  // 控制“新增”弹窗显隐
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制“详情”弹窗显隐
  const [open, setOpen] = useState<boolean>(false);
  // 存储当前选中的表格行记录（用于编辑/详情）
  const [selectedRecord, setSelectedRecord] = useState<null | object>(null);
  // 标记当前月报是否已生成（已生成则禁用全部操作）
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  // 从 localStorage 获取当前用户所属层级（公司/分公司/项目部）
  // 值可能为：'dep'（公司）、'branchComp'（分公司）、其他（项目部）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 动态生成表格列配置（根据用户层级显示不同字段）
   * @returns 配置好的列数组
   */
  const getTableColumns = () => {
    // 使用 yayang-ui 的 BasicTableColumns 工具类初始化列
    const cols = new BasicTableColumns(configColumns);
    // 动态添加列（根据 propKey 决定是否显示某些字段）
    cols.initTableColumns([
      // 如果是分公司层级（branchComp），显示上级单位名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 如果不是公司层级（dep），显示部门名称（即分公司或项目部）
      propKey !== 'dep' ? 'dep_name' : "",
      // 自定义“月份”列：可点击跳转详情
      {
        title: "月份",
        subTitle: "month", // 可能用于导出或内部标识
        dataIndex: "month",
        width: 160,
        align: "center",
        render: (text: any, record: any) => (
          <Tooltip title='点击查看详情'>
            <a
              onClick={() => {
                setSelectedRecord(record); // 设置当前选中记录
                setOpen(true);             // 打开详情弹窗
              }}
            >
              {text}
            </a>
          </Tooltip>
        ),
      },
      // 表单创建人
      "form_maker_name",
      // 表单创建时间（需格式化）
      "form_make_time_str",
    ])
      // 配置需要导出的字段（与显示列一致，但过滤空字符串）
      .needToExport([
        propKey === 'branchComp' ? 'up_wbs_name' : "",
        propKey !== 'dep' ? 'dep_name' : "",
        "month",
        "form_maker_name",
        "form_make_time_str",
      ])
      // 指定某些字段为日期类型，并设置格式（用于表格显示）
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);

    // 返回最终需要的列配置
    return cols.getNeedColumns();
  };
  useEffect(() => {
    console.log(monthlyReportLocked, 'monthlyReportLocked');
  }, []);
  /**
   * 渲染顶部功能按钮栏（新增 + 导出）
   * @param reloadTable - 表格重载函数（由 BaseCurdSingleTable 提供）
   * @returns 按钮数组
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (monthlyReportLocked) {
      console.log('进来');

      return [
        <Button
          key="export"
          type="primary"
          style={{
            display: hasPermission(authority, '导出') ? 'inline' : 'none',
          }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      ];
    }
    return [
      // 新增按钮：仅在“未填报”且用户为“公司层级”且有“新增”权限时显示
      <Space key="toolbar-space">
        <Button
          // 权限+层级双重控制：仅 dep（公司）层级可新增
          style={{
            display:
              propKey === 'dep' && hasPermission(authority, '新增')
                ? 'inline'
                : 'none',
          }}
          type="primary"
          onClick={() => {
            setAddVisible(true); // 打开新增弹窗
          }}
        >
          新增
        </Button>
      </Space>,

      // 导出按钮：有“导出”权限则显示
      <a
        key="export-link"
        style={{
          display: hasPermission(authority, '导出') ? 'inline' : 'none',
        }}
        onClick={(e) => {
          e.preventDefault(); // 防止默认跳转
          if (actionRef.current) {
            actionRef.current.exportFile(); // 调用表格组件的导出方法
          }
        }}
      >
        导出
      </a>,
    ];
  };

  /**
   * 渲染选中行后的操作按钮栏（编辑 + 删除）
   * @param selectedRows - 当前选中的行（radio 模式下最多1条）
   * @param reloadTable - 表格重载函数
   * @returns 按钮数组
   */
  const renderSelectedRowsToolbar = (
    selectedRows: any[],
    reloadTable: (filters?: [], noFilters?: []) => void
  ) => {
    if (monthlyReportLocked) return [];
    return [
      // 编辑按钮：仅公司层级 + 有编辑权限 + 选中1条时可用
      <Button
        key="edit-btn"
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '编辑')
              ? 'inline'
              : 'none',
        }}
        type="primary"
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]); // 设置编辑记录
          setEditVisible(true);               // 打开编辑弹窗
        }}
      >
        编辑
      </Button>,

      // 删除按钮：仅公司层级 + 有删除权限 + 选中1条时可用
      <Button
        key="delete-btn"
        danger
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '删除')
              ? 'inline'
              : 'none',
        }}
        type="primary"
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
              // 调用删除接口
              dispatch({
                type: "qualityMonthlyQualityStatistics/deleteQualityMonthlyQualityStatistics",
                payload: {
                  id: selectedRows[0]['id'],
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
      </Button>,
    ];
  };

  // 主渲染区域
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
        cRef={actionRef} // 注入 ref，用于外部控制
        rowKey="id" // 指定行唯一标识
        key={monthlyReportLocked}
        rowSelection={{ type: 'radio' }} // 单选模式
        // 默认筛选条件：
        // - dep_code：当前用户所属部门编码
        // - month：当前年月（如 2025-12）
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like',
          },
          {
            Key: 'month',
            Val: moment().format('YYYY-MM'),
            Operator: '=',
          },
        ]}
        tableTitle='质量数据统计表' // 表格标题
        type="qualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics" // 查询接口 action
        exportType="qualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics" // 导出接口 action
        tableColumns={getTableColumns()} // 动态列配置
        funcCode={authority} // 权限功能码
        tableSortOrder={{ sort: 'id', order: 'desc' }} // 默认排序
        buttonToolbar={renderButtonToolbar} // 顶部按钮栏
        selectedRowsToolbar={renderSelectedRowsToolbar} // 选中行操作栏

      />

      {/* 详情弹窗 */}
      {open && selectedRecord && (
        <QualityMonthlyQualityStatisticsDetail
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
        <QualityMonthlyQualityStatisticsAdd
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
        <QualityMonthlyQualityStatisticsEdit
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

// 使用 connect 注入 dispatch 和 route 等 props
export default connect()(QualityMonthlyQualityStatisticsPage);
