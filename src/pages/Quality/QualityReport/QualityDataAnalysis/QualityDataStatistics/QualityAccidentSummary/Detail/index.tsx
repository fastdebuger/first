// 引入 React 核心 API：useState 用于管理弹窗状态
import React, { useState } from "react";
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器
import { Button, message, Modal, Space } from "antd";
// 引入 Umi 的 connect 方法，用于注入 dispatch（Redux action 分发）
import { connect } from "umi";
// 引入 yayang-ui 提供的表格列配置工具和详情抽屉组件
import { BasicTableColumns, SingleTable } from "yayang-ui";
// 引入全局错误码常量，用于判断接口响应是否成功
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入编辑弹窗组件（用于从详情页跳转编辑）
import QualityAccidentSummaryEdit from "../Edit";
// 引入当前模块的列配置定义（包含字段元信息）
import { configColumns } from "../columns";

// 从 SingleTable 中解构出详情抽屉组件
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 质量事故汇总表 - 详情查看组件（带编辑/删除操作）
 * @param props - 组件接收的属性
 *   - open: 控制详情抽屉是否打开
 *   - onClose: 关闭抽屉的回调
 *   - authority: 当前路由的权限标识（用于按钮显隐）
 *   - selectedRecord: 当前选中的数据行
 *   - callbackSuccess: 操作成功后的回调（如刷新父表格）
 *   - dispatch: Redux 的 action 分发函数
 * @constructor
 */
const QualityAccidentSummaryDetail: React.FC<any> = (props) => {
  // 从 props 中解构所需属性
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  // 控制“编辑”弹窗是否可见
  const [editVisible, setEditVisible] = useState(false);
  // 控制“删除确认”模态框是否可见
  const [delVisible, setDelVisible] = useState(false);
  // 从 localStorage 获取当前用户所属层级（'dep'=项目部, 'branchComp'=分公司, 其他=公司）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 构建详情页展示的字段列配置
   * @returns 表格列配置数组
   */
  const getTableColumns = () => {
    // 基于 configColumns 初始化列配置器
    const cols = new BasicTableColumns(configColumns);

    // 动态初始化要显示的列（根据用户层级过滤）
    cols.initTableColumns([
      // 如果是分公司层级，显示上级 WBS 名称（如公司名）
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 如果不是项目部层级，显示部门名称
      'dep_name',
      // 其他固定字段（按顺序展示）
      "unit_leader_name",
      "supervising_leader_name",
      "office_phone",
      "quality_department",
      "responsible_person_name",
      "contact_phone_mobile",
      "accident_level",
      "accident_count",
      "total_direct_loss",
      "supervision_level",
      "nc_batches",
      "form_maker_name",
      "form_make_time",
      "file_url",
    ])
      // 将 form_make_time 字段格式化为 YYYY-MM-DD 日期显示
      .setTableColumnToDatePicker([
        {
          value: 'form_make_time',
          valueType: 'dateTs',          // 表示原始值是时间戳
          format: 'YYYY-MM-DD',         // 展示格式
        },
      ]);

    // 返回最终处理后的列配置
    return cols.getNeedColumns();
  };

  /**
   * 渲染详情页底部的操作按钮栏（编辑 + 删除）
   * @returns 按钮数组
   */
  const renderButtonToolbar = () => {
    return [
      // 编辑按钮：仅项目部层级且有“编辑”权限时显示
      <Button
        key="edit"
        style={{
          display:
            propKey == 'dep' && hasPermission(authority, '编辑') ? 'inline' : 'none',
        }}
        type={"primary"}
        onClick={() => setEditVisible(true)} // 打开编辑弹窗
      >
        编辑
      </Button>,
      // 删除按钮：仅项目部层级且有“删除”权限时显示
      <Button
        key="delete"
        style={{
          display:
            propKey == 'dep' && hasPermission(authority, '删除') ? 'inline' : 'none',
        }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)} // 打开删除确认模态框
      >
        删除
      </Button>,
    ];
  };

  /**
   * 执行删除操作
   */
  const handleDel = () => {
    // 发起删除请求
    dispatch({
      type: "qualityAccidentSummary/deleteQualityAccidentSummary",
      payload: {
        id: selectedRecord.id, // 传递主键 ID
      },
      callback: (res: any) => {
        // 判断接口是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          // 延迟 1 秒后关闭详情并触发成功回调（提升用户体验）
          setTimeout(() => {
            if (onClose) onClose();               // 关闭详情抽屉
            if (callbackSuccess) callbackSuccess(); // 刷新父表格
          }, 1000);
        }
        // 注意：失败情况假设由全局拦截器统一处理，此处未显式提示
      },
    });
  };

  // 渲染组件
  return (
    <>
      {/* 详情抽屉组件 */}
      <CrudQueryDetailDrawer
        rowKey="unit_leader_name"           // 抽屉内部表格的行唯一标识（此处可能不关键）
        title="质量事故汇总表"               // 抽屉标题
        columns={getTableColumns()}         // 动态生成的详情字段配置
        open={open}                         // 控制抽屉显隐
        onClose={onClose}                   // 关闭回调
        selectedRecord={selectedRecord}     // 当前展示的数据记录
        buttonToolbar={renderButtonToolbar} // 底部操作按钮组
      >
        {/* 可在此处添加自定义内容（当前为空） */}
      </CrudQueryDetailDrawer>

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityAccidentSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);          // 关闭编辑弹窗
            if (onClose) onClose();         // 同时关闭详情抽屉（因数据已变更）
            if (callbackSuccess) callbackSuccess(); // 刷新父表格
          }}
        />
      )}

      {/* 删除确认模态框 */}
      <Modal
        title="删除数据"
        // 自定义底部按钮（取消 + 确认）
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}                   // 控制模态框显隐
        onOk={handleDel}                    // 按 Enter 或点击“确定”时触发（但此处 footer 已覆盖）
        onCancel={() => setDelVisible(false)} // 点击遮罩或取消按钮时关闭
      >
        {/* 显示要删除的数据 Id */}
        <p>是否删除当前的数据: {selectedRecord?.["id"]}</p>
      </Modal>
    </>
  );
};

// 使用 connect() 注入 dispatch（无 mapStateToProps）
export default connect()(QualityAccidentSummaryDetail);
