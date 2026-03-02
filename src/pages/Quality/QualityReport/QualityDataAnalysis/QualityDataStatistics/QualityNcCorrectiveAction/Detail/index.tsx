// 引入 React 核心库和状态管理 Hook
import React, { useState } from "react";
// 引入 Ant Design 组件：按钮、提示消息、模态框、间距容器
import { Button, message, Modal, Space } from "antd";
// 引入 Umi 的 connect 方法，用于注入 dispatch（调用 Dva model）
import { connect } from "umi";
// 引入 yayang-ui 提供的表格列构建工具和详情抽屉组件
import { BasicTableColumns, SingleTable } from "yayang-ui";
// 引入全局错误码常量，用于判断接口是否成功
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入编辑子组件（用于在详情页中打开编辑弹窗）
import QualityNcCorrectiveActionEdit from "../Edit";
// 引入当前模块的字段元信息配置
import { configColumns } from "../columns";

// 从 yayang-ui 的 SingleTable 中解构出通用详情抽屉组件
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 不合格项纠正措施记录 - 详情查看组件
 * 功能说明：
 *   - 以抽屉形式展示单条记录的完整信息
 *   - 支持“编辑”和“删除”操作（仅限公司层级 + 有对应权限）
 *   - 删除通过独立 Modal 确认，编辑通过复用 Edit 组件实现
 */
const QualityNcCorrectiveActionDetail: React.FC<any> = (props) => {
  // 从 props 解构所需属性：
  // - open: 控制详情抽屉是否打开
  // - onClose: 关闭抽屉的回调
  // - authority: 当前路由的权限配置（用于权限校验）
  // - selectedRecord: 当前要查看的记录数据
  // - callbackSuccess: 操作成功后的回调（通常用于刷新父列表）
  // - dispatch: 用于触发 Dva action
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;

  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState(false);

  // 控制“删除确认”模态框显隐
  const [delVisible, setDelVisible] = useState(false);

  // 从本地存储获取当前用户所属的组织层级：
  // 'dep' 表示公司，'branchComp' 表示分公司，其他为项目部
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 构建详情页展示的字段列配置（根据用户层级动态显示字段）
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);

    // 初始化要显示的字段（动态控制某些字段是否展示）
    cols.initTableColumns([
      // 若用户是分公司层级（branchComp），显示上级 WBS 名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 若用户不是公司层级（dep），则显示部门名称（即下级单位）
      propKey !== 'dep' ? 'dep_name' : "",

      // 固定展示的核心业务字段
      "nc_name",           // 不合格项名称
      "nc_code",           // 编码
      "nc_nature",         // 性质
      "occurrence_time",   // 发生时间
      "occurrence_unit",   // 发生单位
      "nc_reason",         // 原因
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
      "remark",            // 备注
      "form_maker_code",   // 制单人工号
      "form_maker_name",   // 制单人姓名
      "form_make_time",    // 制单时间
      "form_make_tz",      // 制单时区
    ])
      // 配置日期字段的显示格式（转换为 YYYY-MM-DD）
      .setTableColumnToDatePicker([
        { value: 'occurrence_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'completion_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);

    // 返回过滤掉空字符串后的有效列配置
    return cols.getNeedColumns();
  };

  /**
   * 渲染详情页顶部的操作按钮（编辑 + 删除）
   * 注意：仅当用户是公司层级（propKey === 'dep'）且拥有对应权限时才显示
   */
  const renderButtonToolbar = () => {
    return [
      // 编辑按钮
      <Button
        style={{
          display: propKey === 'dep' && hasPermission(authority, '编辑') ? 'inline' : 'none'
        }}
        type={"primary"}
        onClick={() => setEditVisible(true)} // 打开编辑弹窗
      >
        编辑
      </Button>,

      // 删除按钮
      <Button
        style={{
          display: propKey === 'dep' && hasPermission(authority, '删除') ? 'inline' : 'none'
        }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)} // 打开删除确认弹窗
      >
        删除
      </Button>,
    ];
  };

  /**
   * 执行删除操作：调用 Dva model 接口删除当前记录
   */
  const handleDel = () => {
    dispatch({
      type: "qualityNcCorrectiveAction/deleteQualityNcCorrectiveAction",
      payload: {
        id: selectedRecord.id, // 传递记录 ID
      },
      callback: (res: any) => {
        // 判断接口是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");

          // 延迟 1 秒后关闭详情并触发成功回调（可优化为立即执行）
          setTimeout(() => {
            if (onClose) onClose();               // 关闭详情抽屉
            if (callbackSuccess) callbackSuccess(); // 刷新父列表
          }, 1000);
        }
        // 若失败，message 通常已在 model 或拦截器中处理，此处可不重复提示
      },
    });
  };

  /**
   * 渲染主组件结构
   */
  return (
    <>
      {/* 详情抽屉组件 */}
      <CrudQueryDetailDrawer
        rowKey="nc_name" // 抽屉内部表格的行键（此处实际未使用表格，仅为兼容）
        title="不合格项纠正措施记录" // 抽屉标题
        columns={getTableColumns()} // 要展示的字段配置
        open={open}                // 控制显隐
        onClose={onClose}          // 关闭回调
        selectedRecord={selectedRecord} // 当前记录数据
        buttonToolbar={renderButtonToolbar} // 顶部操作按钮
      >
        {/* 可在此处添加自定义内容（当前为空） */}
      </CrudQueryDetailDrawer>

      {/* 编辑弹窗（复用 Edit 组件） */}
      {editVisible && (
        <QualityNcCorrectiveActionEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)} // 关闭编辑弹窗
          callbackSuccess={() => {
            setEditVisible(false);     // 关闭弹窗
            if (onClose) onClose();    // 同时关闭详情抽屉（因数据已变更）
            if (callbackSuccess) callbackSuccess(); // 刷新列表
          }}
        />
      )}

      {/* 删除确认弹窗 */}
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
        open={delVisible}                    // 控制显隐
        onOk={handleDel}                     // 按 Enter 或点击确定时也触发删除（但此处 footer 已覆盖）
        onCancel={() => setDelVisible(false)} // 点击遮罩或取消按钮时关闭
      >
        {/* 显示要删除的记录 ID（增强用户确认感） */}
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

// 使用 connect 注入 dispatch（用于调用 Dva action）
export default connect()(QualityNcCorrectiveActionDetail);
