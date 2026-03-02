// 引入 React 核心 API：useRef 用于获取子组件引用，useState 用于状态管理
import React, { useRef, useState } from 'react';
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器、气泡提示、提示条
import { Alert, Button, message, Modal, Space, Tooltip } from "antd";
// 引入 Umi 的 connect 方法，用于连接 Redux 状态和 dispatch
import { connect } from 'umi';
// 引入自定义封装的基础 CRUD 表格组件（含分页、查询、导出等通用能力）
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
// 引入 yayang-ui 提供的表格列配置工具类
import { BasicTableColumns } from 'yayang-ui';
// 引入全局错误码常量，用于判断接口返回状态
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入当前页面的列配置定义
import { configColumns } from "./columns";

// 引入新增、详情、编辑弹窗组件
import QualityAccidentSummaryAdd from "./Add";
import QualityAccidentSummaryDetail from "./Detail";
import QualityAccidentSummaryEdit from "./Edit";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 质量事故汇总表主页面组件
 * @constructor
 */
const QualityAccidentSummaryPage: React.FC<any> = (props) => {
  // 从 props 中解构 dispatch（用于发起 action）和路由权限配置
  const { dispatch, route: { authority } } = props;
  // 创建 ref，用于调用 BaseCurdSingleTable 子组件的方法（如 reload、export）
  const actionRef: any = useRef();

  // 控制“新增”弹窗是否可见
  const [addVisible, setAddVisible] = useState(false);
  // 控制“编辑”弹窗是否可见
  const [editVisible, setEditVisible] = useState(false);
  // 控制“详情”弹窗是否可见
  const [open, setOpen] = useState(false);
  // 存储当前选中的行数据（用于详情/编辑）
  const [selectedRecord, setSelectedRecord] = useState(null);
  // 标记当前月报是否已生成（已生成则禁用全部操作）
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  // 从 localStorage 获取当前用户所属层级（'dep'=项目部, 'branchComp'=分公司, 其他=公司）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');


  /**
   * 构建表格列配置
   */
  const getTableColumns = () => {
    // 基于 configColumns 初始化列配置工具
    const cols = new BasicTableColumns(configColumns);

    // 动态初始化要显示的列（根据用户层级过滤）
    cols.initTableColumns([
      // 如果是分公司层级，显示上级 WBS 名称（如公司名）
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 如果不是项目部层级，显示部门名称（分公司或公司）
      'dep_name',
      // 自定义“单位领导姓名”列：可点击跳转详情
      {
        title: "compinfo.unit_leader_name",       // 国际化 key（后续会被替换）
        subTitle: "单位领导姓名",                  // 备用中文标题（调试用）
        dataIndex: "unit_leader_name",            // 数据字段
        width: 160,                               // 列宽
        align: "center",                          // 居中对齐
        render: (text: any, record: any) => {
          return (
            <Tooltip title='点击查看详情'>
              <a
                onClick={() => {
                  setSelectedRecord(record);  // 保存选中记录
                  setOpen(true);              // 打开详情弹窗
                }}
              >
                {text}
              </a>
            </Tooltip>
          );
        },
      },
      // 其他固定列
      "supervising_leader_name",
      "office_phone",
      "quality_department",
      "responsible_person_name",
      "contact_phone_mobile",
      "accident_level_str",
      "accident_count",
      "total_direct_loss",
      "supervision_level_str",
      "nc_batches",
      'nc_batches1',
      'nc_batches2',
      {
        title: '附件',
        dataIndex: 'file_url',
        subTitle: '附件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      "form_maker_name",
      "form_make_time_str",

    ])
      // 将 form_make_time 字段渲染为日期选择器（只读展示）
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      // 配置导出时包含的字段（与显示列基本一致，但需排除空字符串项）
      .needToExport([
        propKey === 'branchComp' ? 'up_wbs_name' : "",
        'dep_name',
        "unit_leader_name",
        "supervising_leader_name",
        "office_phone",
        "quality_department",
        "responsible_person_name",
        "contact_phone_mobile",
        "accident_level_str",
        "accident_count",
        "total_direct_loss",
        "supervision_level_str",
        "nc_batches",
        "form_maker_name",
        "form_make_time_str",
        "file_url",
      ]);

    // 返回最终处理后的列配置数组
    return cols.getNeedColumns();
  };

  /**
   * 渲染顶部工具栏按钮（新增 + 导出）
   * @param reloadTable - 表格重载函数（由 BaseCurdSingleTable 提供）
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
      // 左侧按钮组
      <Space key="buttons">
        <Button
          // 根据权限控制是否显示（无权限则 display: none）
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true); // 打开新增弹窗
          }}
        >
          新增
        </Button>
      </Space>,
      // 导出链接
      <a
        key="export"
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={(e) => {
          e.preventDefault(); // 防止默认跳转
          if (actionRef.current) {
            actionRef.current.exportFile(); // 调用子组件导出方法
          }
        }}
      >
        导出
      </a>
    ];
  };

  /**
   * 渲染选中行后的操作栏（编辑 + 删除）
   * @param selectedRows - 当前选中的行数据数组
   * @param reloadTable - 表格重载函数
   */
  const renderSelectedRowsToolbar = (
    selectedRows: any[],
    reloadTable: (filters?: [], noFilters?: []) => void
  ) => {
    if (monthlyReportLocked) return [];
    return [
      // 编辑按钮
      <Button
        key="edit"
        // 仅项目部层级且有编辑权限时显示
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '编辑') ? 'inline' : 'none',
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
          setSelectedRecord(selectedRows[0]); // 设置编辑记录
          setEditVisible(true);              // 打开编辑弹窗
        }}
      >
        编辑
      </Button>,
      // 删除按钮
      <Button
        key="delete"
        danger
        // 仅项目部层级且有删除权限时显示
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '删除') ? 'inline' : 'none',
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
              // 发起删除请求
              dispatch({
                type: "qualityAccidentSummary/deleteQualityAccidentSummary",
                payload: {
                  id: selectedRows[0]['id'], // 传递主键 ID
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable(); // 刷新表格
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

  // 渲染主界面
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
        cRef={actionRef} // 暴露 ref 给父组件调用方法
        rowKey="id" // 行唯一标识字段
        key={monthlyReportLocked}
        // 默认查询条件：根据用户层级动态设置 dep_code 过滤
        tableDefaultFilter={
          propKey === 'dep'
            ? [
              {
                Key: 'dep_code',
                Val: localStorage.getItem('auth-default-cpecc-depCode'),
                Operator: '=',
              },
            ]
            : {
              Key: 'dep_code',
              Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
              Operator: 'like',
            }
        }
        // 启用单选模式（radio）
        rowSelection={{ type: 'radio' }}
        tableTitle='质量事故汇总表' // 表格标题
        type="qualityAccidentSummary/getQualityAccidentSummary" // 查询 action
        exportType="qualityAccidentSummary/getQualityAccidentSummary" // 导出 action
        tableColumns={getTableColumns()} // 列配置
        funcCode={'getQualityAccidentSummary'} // 功能编码（用于权限/日志）
        tableSortOrder={{ sort: 'id', order: 'desc' }} // 默认按 ID 降序
        buttonToolbar={renderButtonToolbar} // 顶部工具栏
        selectedRowsToolbar={renderSelectedRowsToolbar} // 选中行操作栏
      />

      {/* 详情弹窗 */}
      {open && selectedRecord && (
        <QualityAccidentSummaryDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable(); // 成功后刷新
            }
          }}
        />
      )}

      {/* 新增弹窗 */}
      {addVisible && (
        <QualityAccidentSummaryAdd
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
        <QualityAccidentSummaryEdit
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

// 使用 connect() 将组件连接到 Redux store（无 mapStateToProps，仅注入 dispatch）
export default connect()(QualityAccidentSummaryPage);
