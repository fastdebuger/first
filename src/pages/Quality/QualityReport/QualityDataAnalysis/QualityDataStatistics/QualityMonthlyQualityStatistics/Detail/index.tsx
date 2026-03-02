// 引入 React 的 useEffect（虽未使用但可能预留）和 useState（管理弹窗状态）
import React, { useEffect, useState } from "react";
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器、标签页（Tabs 虽引入但未使用）
import { Button, message, Modal, Space, Tabs } from "antd";
// 引入 Umi 的 connect，用于注入 dispatch（调用 model action）
import { connect } from "umi";
// 引入 yayang-ui 提供的列配置工具类和单表组件（含详情抽屉）
import { BasicTableColumns, SingleTable } from "yayang-ui";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入编辑弹窗组件
import QualityAccidentSummaryEdit from "../Edit";
// 引入表格列配置定义
import { configColumns } from "../columns";
// 引入可复用的月度质量统计表格组件（用于展示详情数据）
import MonthlyQualityStatisticsTable from '../Component/MonthlyQualityStatisticsTable';

// 从 SingleTable 中解构出详情抽屉组件
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 质量事故汇总表（或质量数据统计表）详情查看组件
 * 功能：以抽屉形式展示一条记录的详细信息，并提供“编辑”和“删除”操作入口
 * @param props
 *   - open: 控制抽屉是否打开（布尔值）
 *   - onClose: 抽屉关闭回调
 *   - authority: 当前路由的权限标识（用于权限校验）
 *   - selectedRecord: 当前选中的记录对象（包含 id、month 等字段）
 *   - callbackSuccess: 操作成功后的回调（如刷新父表格）
 *   - dispatch: 由 connect 注入，用于发起 model action
 * @constructor
 */
const QualityMonthlyQualityStatisticsDetail: React.FC<any> = (props) => {
  // 解构 props
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState(false);
  // 控制“删除确认”模态框显隐
  const [delVisible, setDelVisible] = useState(false);
  // 从 localStorage 获取当前用户所属层级（'dep'=公司, 'branchComp'=分公司, 其他=项目部）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 动态生成详情抽屉顶部基本信息区域的列配置
   * 根据用户层级决定是否显示某些字段（如上级单位、部门名称）
   * @returns 配置好的列数组
   */
  const getTableColumns = () => {
    // 使用 yayang-ui 的 BasicTableColumns 工具类初始化列
    const cols = new BasicTableColumns(configColumns);
    // 初始化要显示的字段（空字符串会被过滤掉）
    cols.initTableColumns([
      // 若为分公司层级，显示上级单位名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 若非公司层级，显示部门名称（即分公司或项目部）
      propKey !== 'dep' ? 'dep_name' : "",
      // 固定字段：月份、填报人、填报时间、时区
      "month",
      "form_maker_name",
      "form_make_time",
    ])
      // 将 form_make_time 字段格式化为 YYYY-MM-DD 的日期显示
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);

    // 返回最终需要的列配置
    return cols.getNeedColumns();
  };

  /**
   * 渲染抽屉右上角的操作按钮组（编辑 + 删除）
   * 仅在“公司层级”且具备对应权限时显示
   * @returns 按钮数组
   */
  const renderButtonToolbar = () => {
    return [
      // 编辑按钮
      <Button
        key="edit-btn"
        // 权限+层级双重控制：仅公司层级可编辑
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '编辑')
              ? 'inline'
              : 'none',
        }}
        type="primary"
        onClick={() => setEditVisible(true)} // 打开编辑弹窗
      >
        编辑
      </Button>,

      // 删除按钮
      <Button
        key="delete-btn"
        // 权限+层级双重控制：仅公司层级可删除
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '删除')
              ? 'inline'
              : 'none',
        }}
        danger
        type="primary"
        onClick={() => setDelVisible(true)} // 打开删除确认弹窗
      >
        删除
      </Button>,
    ];
  };

  /**
   * 执行删除操作
   */
  const handleDel = () => {
    // 调用删除接口
    dispatch({
      type: "qualityMonthlyQualityStatistics/deleteQualityMonthlyQualityStatistics",
      payload: {
        id: selectedRecord.id, // 传入记录 ID
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          // 延迟 1 秒后关闭抽屉并触发成功回调（提升用户体验）
          setTimeout(() => {
            if (onClose) onClose();               // 关闭详情抽屉
            if (callbackSuccess) callbackSuccess(); // 刷新父级表格
          }, 1000);
        }
        // 注意：此处未处理失败情况（建议补充 message.error）
      },
    });
  };

  // 主渲染区域
  return (
    <>
      {/* 详情抽屉组件 */}
      <CrudQueryDetailDrawer
        rowKey="dep_name" // 抽屉内部可能用于标识行（此处实际作用不大，可考虑移除或改为 "id"）
        title="质量数据统计表" // 抽屉标题
        columns={getTableColumns()} // 顶部基本信息列配置
        open={open} // 控制显隐
        onClose={onClose} // 关闭回调
        selectedRecord={selectedRecord} // 当前记录数据
        buttonToolbar={renderButtonToolbar} // 右上角操作按钮
      >
        {/* 抽屉主体内容：只读模式展示详细表格数据 */}
        <MonthlyQualityStatisticsTable
          onlyShow // 传递只读模式标志（子组件据此禁用编辑功能）
          tableData={selectedRecord} // 传入完整记录数据用于渲染
        />
      </CrudQueryDetailDrawer>

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityAccidentSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)} // 关闭编辑弹窗
          callbackSuccess={() => {
            setEditVisible(false);     // 关闭弹窗
            if (onClose) onClose();    // 关闭详情抽屉
            if (callbackSuccess) callbackSuccess(); // 刷新列表
          }}
        />
      )}

      {/* 删除确认模态框 */}
      <Modal
        title="删除数据"
        // 自定义底部按钮：取消 + 确认删除
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDel()} // 点击确认执行删除
            >
              确认删除
            </Button>
          </Space>
        }
        open={delVisible} // 控制显隐
        onOk={handleDel}  // 按 Enter 或点击 OK 也触发删除（与 footer 按钮一致）
        onCancel={() => setDelVisible(false)} // 点击取消或遮罩关闭
      >
        {/* 删除提示文案，显示记录 ID（建议改用更具业务意义的字段，如 month + dep_name） */}
        <p>是否删除当前的数据: {selectedRecord?.["id"]}</p>
      </Modal>
    </>
  );
};

// 使用 connect() 注入 dispatch，使组件能调用 model 中的 action
export default connect()(QualityMonthlyQualityStatisticsDetail);
