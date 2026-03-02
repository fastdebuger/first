// 引入 React 核心 Hook：用于创建 ref（useRef）和状态管理（useState）
import React, { useRef, useState } from "react";
// 引入 Ant Design 组件：按钮、消息提示、模态框、间距容器
import { Button, message, Modal, Space } from "antd";
// 引入共享的列配置（字段元信息定义）
import { configColumns } from "../columns";
// 引入 yayang-ui 封装的表格列工具类和详情抽屉组件
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
// 引入编辑弹窗组件（用于点击“编辑”时打开）
import QualityMonthlyWeldingPassRateEdit from "../Edit";
// 引入 Umi 提供的 connect（连接 Dva model）和 useIntl（国际化）
import { connect, useIntl } from "umi";
// 引入全局错误码常量（用于判断接口是否成功）
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 引入通用单表 CRUD 组件（用于展示子表格数据）
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";

// 从 HeaderAndBodyTable 中解构出详情抽屉组件
const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 月度焊接一次合格率统计表 - 详情查看组件
 * 功能：
 *   - 展示主表单信息（如制单人、时间、组织等）
 *   - 展示子表格数据（各焊接类型的检测结果）
 *   - 提供【编辑】、【删除】、【导出】按钮（根据权限和层级控制显隐）
 */
const QualityMonthlyWeldingPassRateDetail: React.FC<any> = (props: any) => {
  // 从 props 解构所需属性
  const { authority, open, onClose, selectedRecord, actionRef, dispatch } = props;
  // 控制编辑弹窗显隐
  const [editVisible, setEditVisible] = useState(false);
  // 控制删除确认弹窗显隐
  const [delVisible, setDelVisible] = useState(false);
  // 获取国际化函数，用于多语言翻译
  const { formatMessage } = useIntl();
  // 创建 ref，用于调用子组件（BaseCurdSingleTable）的方法（如导出）
  const childRef: any = useRef();

  // 从 localStorage 获取当前用户所属的 WBS 层级（公司/分公司/项目部）
  // propKey 可能为 'dep'（公司）、'branchComp'（分公司）等
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 构建主表单区域的列配置（显示在详情抽屉顶部）
   */
  const getTableColumns = () => {
    // 使用 BasicTableColumns 工具类初始化列
    const cols: any = new BasicTableColumns(configColumns);

    // 根据当前用户层级动态决定显示哪些字段
    cols.initTableColumns([
      // 如果是分公司层级（branchComp），显示上级 WBS 名称
      propKey === 'branchComp' ? 'up_wbs_name' : "",
      // 如果不是公司层级（dep），显示部门名称
      'dep_name',
      // 固定显示字段
      'form_maker_name',   // 制单人
      'form_make_time',    // 制单时间
    ])
      // 将 form_make_time 配置为日期格式化显示（时间戳转 YYYY-MM-DD）
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);

    // 对每列的 title 进行国际化处理，并存入 subTitle（可能用于 tooltip 或其他用途）
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) });
    });

    // 返回最终需要的列配置
    return cols.getNeedColumns();
  };

  /**
   * 构建子表格（检测明细）的列配置
   */
  const getBodyTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    // 初始化子表格列：按顺序列出所有检测指标
    cols.initTableColumns([
      'type_code_name',     // 焊接类型名称
      'rt_shots', 'rt_pass', 'rt_ratio',       // RT 检测
      'ut_meters', 'ut_pass', 'ut_ratio',      // UT 检测
      'pt_mt_tests', 'pt_mt_pass', 'pt_ratio', // PT/MT 检测
      'tofd_meters', 'tofd_pass', 'tofd_ratio',// TOFD 检测
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 渲染主详情页顶部的操作按钮（编辑、删除）
   * 按钮显隐受两个条件控制：
   *   1. 用户必须处于“公司”层级（propKey === 'dep'）
   *   2. 用户拥有对应权限（编辑 / 删除）
   */
  const renderButtonToolbar = () => {
    return [
      // 编辑按钮
      <Button
        // 仅当是公司层级且有“编辑”权限时显示
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
        // 仅当是公司层级且有“删除”权限时显示
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
    dispatch({
      type: "qualityMonthlyWeldingPassRate/delQualityMonthlyWeldingPassRate",
      payload: {
        form_no: selectedRecord.form_no, // 传入表单编号作为删除条件
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose(); // 关闭详情抽屉
            if (actionRef.current) {
              actionRef.current.reloadTable(); // 刷新父列表
            }
          }, 1000);
        }
        // 注意：此处未处理失败情况，可补充 message.error
      },
    });
  };

  /**
   * 渲染子表格区域的操作按钮（目前只有导出）
   */
  const renderBodyButtonToolbar = () => {
    return [
      <Button
        // 仅当有“导出”权限时显示
        style={{
          display: hasPermission(authority, '导出') ? 'inline' : 'none',
        }}
        type="primary"
        onClick={() => childRef.current.exportFile()} // 调用子组件的导出方法
      >
        {formatMessage({ id: 'common.list.export' })} {/* 国际化“导出”文本 */}
      </Button>,
    ];
  };

  /**
   * 渲染整个详情页面
   */
  return (
    <>
      {/* 主详情抽屉 */}
      <CrudQueryDetailDrawer
        rowKey="dep_name" // 主表单区域的行 key（虽不常用，但需提供）
        title="月度焊接一次合格率统计表" // 抽屉标题
        columns={getTableColumns()} // 主表单字段配置
        open={open} // 控制抽屉显隐
        onClose={onClose} // 关闭回调
        selectedRecord={selectedRecord} // 当前选中的主记录数据
        buttonToolbar={renderButtonToolbar} // 顶部操作按钮组
      >
        {/* 子表格：展示检测明细 */}
        <BaseCurdSingleTable
          cRef={childRef} // 传递 ref，用于外部调用其方法（如导出）
          rowKey="form_no" // 子表格行唯一标识（实际可能应为明细 ID，但此处沿用 form_no）
          tableTitle="月度焊接一次合格率统计表详情" // 表格标题
          type="qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateBody" // 查询接口 type
          exportType="qualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateBody" // 导出接口 type
          // 默认查询条件：只查当前主表单下的明细
          tableDefaultFilter={[
            { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
          ]}
          tableColumns={getBodyTableColumns()} // 子表格列配置
          tableSortOrder={{ sort: 'form_no', order: 'desc' }} // 排序（此处可能无意义）
          buttonToolbar={renderBodyButtonToolbar} // 子表格区域操作按钮
          selectedRowsToolbar={() => []} // 不需要选中行操作栏
          defaultPageSize={undefined} // 使用默认分页大小
          rowSelection={null} // 禁用行选择
          scroll={{ y: "calc(100vh - 320px)" }} // 表格纵向滚动高度
          height={"calc(-115px + 100vh)"} // 整体高度（可能用于布局）
          funcCode={authority + "-detail"} // 功能编码，用于权限或埋点
        />
      </CrudQueryDetailDrawer>

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityMonthlyWeldingPassRateEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)} // 关闭编辑弹窗
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose(); // 关闭详情
            if (actionRef.current) {
              actionRef.current.reloadTable(); // 刷新列表
            }
          }}
        />
      )}

      {/* 删除确认弹窗 */}
      {delVisible && (
        <Modal
          title="删除数据"
          // 自定义底部按钮
          footer={
            <Space>
              <Button onClick={() => setDelVisible(false)}>我再想想</Button>
              <Button type="primary" danger onClick={() => handleDel()}>
                确认删除
              </Button>
            </Space>
          }
          open={delVisible}
          onOk={handleDel} // 按 Enter 或点击确定也会触发删除
          onCancel={() => setDelVisible(false)} // 点击取消或遮罩层关闭
        >
          {/* TODO: 此处应显示具体要删除的数据标识，如表单编号 */}
          <p>是否删除当前的数据: {selectedRecord[""]}</p>
        </Modal>
      )}
    </>
  );
};

// 使用 connect() 注入 dispatch，以便调用 Dva model 的 effects
export default connect()(QualityMonthlyWeldingPassRateDetail);
