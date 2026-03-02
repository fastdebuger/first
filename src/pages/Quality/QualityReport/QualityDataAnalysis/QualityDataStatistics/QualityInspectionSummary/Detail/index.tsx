// 引入 React 核心 Hook：useEffect（副作用处理）、useState（状态管理）
import React, { useEffect, useState } from "react";
// 引入 Ant Design 基础组件
import { Button, Card, message, Modal, Space, Table } from "antd";
// 引入项目自定义列配置（用于主表单字段展示）
import { configColumns } from "../columns";
// 引入 yayang-ui 中的通用详情抽屉组件和列构建工具
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
// 引入编辑弹窗组件
import QualityInspectionSummaryEdit from "../Edit";
// 引入 Umi 的 connect（注入 dispatch）和国际化钩子 useIntl
import { connect, useIntl } from "umi";
// 引入全局错误码常量（用于判断接口是否成功）
import { ErrorCode } from "@/common/const";
// 引入权限校验工具函数
import { hasPermission } from "@/utils/authority";
// 解构出通用详情抽屉组件
const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 定义内部状态的数据结构：
 * - management: 现场管理质量类别的不合格项列表
 * - construction: 现场施工质量类别的不合格项列表
 */
type DataState = {
  management: any[];     // 管理类问题项
  construction: any[];   // 施工类问题项
};

/**
 * 质量大(专项)检查主要不合格项汇总情况分布 - 详情查看组件
 * @param props
 *   - authority: 当前用户权限标识（用于按钮显示控制）
 *   - open: 控制抽屉是否打开
 *   - onClose: 关闭抽屉回调
 *   - selectedRecord: 当前选中的主记录（含 form_no 等）
 *   - actionRef: 父组件表格实例引用（用于刷新）
 *   - dispatch: Redux 分发函数
 */
const QualityInspectionSummaryDetail: React.FC<any> = (props: any) => {
  const { authority, open, onClose, selectedRecord, actionRef, dispatch } = props;
  // 控制“编辑”弹窗显隐
  const [editVisible, setEditVisible] = useState(false);
  // 控制“删除确认”弹窗显隐
  const [delVisible, setDelVisible] = useState(false);
  // 获取国际化方法
  const { formatMessage } = useIntl();
  //从本地存储获取当前组织层级（公司/分公司/项目部）
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  // 存储两类不合格项明细数据
  const [data, setData] = useState<DataState>({
    management: [],
    construction: [],
  });

  /**
   * 组件挂载时，根据 selectedRecord.form_no 查询明细数据
   */
  useEffect(() => {
    dispatch({
      type: "qualityInspectionSummary/queryQualityInspectionSummaryBody",
      payload: {
        sort: 'type_code_id', // 按类型 ID 排序
        order: 'asc',
        // 构造过滤条件：匹配主表单编号
        filter: JSON.stringify([
          { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if (res?.rows?.length) {
          // 按 sys_type_code 分组：管理类 vs 施工类
          setData({
            management: res.rows.filter(
              (item: any) => item.sys_type_code === 'SITE_MANAGEMENT_QUALITY'
            ),
            construction: res.rows.filter(
              (item: any) => item.sys_type_code === 'SITE_CONSTRUCTION_QUALITY'
            ),
          });
        }
      },
    });
  }, []); // 仅在组件首次渲染时执行

  /**
   * 动态生成主表单字段的列配置（用于抽屉顶部信息展示）
   * 根据当前组织层级（propKey）决定显示哪些字段
   */
  const getTableColumns = () => {
    // 使用 yayang-ui 提供的列构建器
    const cols: any = new BasicTableColumns(configColumns);

    // 初始化需要显示的字段（动态过滤）
    cols.initTableColumns([
      propKey === 'branchComp' ? 'up_wbs_name' : "", // 分公司层级显示上级名称
      propKey !== 'dep' ? 'dep_name' : "",           // 非项目部层级显示部门名称
      'form_maker_name',                             // 表单创建人
      'form_make_time',                              // 创建时间
      'form_make_tz',                                // 创建时区
    ]);

    // 将指定字段转为日期格式（时间戳 → YYYY-MM-DD）
    cols.setTableColumnToDatePicker([
      { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
    ]);

    // 对所有列应用国际化：将 title 替换为 subTitle（避免覆盖原始 key）
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) });
    });

    // 返回最终列配置
    return cols.getNeedColumns();
  };

  /**
   * 定义不合格项明细表格的列配置（固定三列）
   */
  const createColumns = [
    {
      title: formatMessage({ id: 'compinfo.type_code_name' }), // 不合格项类型名称
      dataIndex: 'type_code_name',
      width: 160,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'compinfo.num' }), // 数量
      dataIndex: 'num',
      width: 160,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'compinfo.ratio_num' }), // 占比
      dataIndex: 'ratio_num',
      width: 160,
      align: 'center',
      // 渲染为百分比格式，保留两位小数，防止 NaN
      render: (text: any) => `${text ? Number(text).toFixed(2) : 0}%`,
    },
  ];

  /**
   * 渲染抽屉右上角的操作按钮（编辑 + 删除）
   * 根据组织层级（propKey）和权限动态显示
   */
  const renderButtonToolbar = () => {
    return [
      // 仅当是项目部（propKey === 'dep'）且有“编辑”权限时显示
      <Button
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '编辑')
              ? 'inline'
              : 'none',
        }}
        type="primary"
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      // 仅当是项目部且有“删除”权限时显示
      <Button
        style={{
          display:
            propKey === 'dep' && hasPermission(authority, '删除')
              ? 'inline'
              : 'none',
        }}
        danger
        type="primary"
        onClick={() => setDelVisible(true)}
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
      type: "qualityInspectionSummary/delQualityInspectionSummary",
      payload: {
        form_no: selectedRecord.form_no, // 传主表单编号
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            // 关闭详情抽屉
            if (onClose) onClose();
            // 刷新父级表格
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  /**
   * 渲染一个类别（管理/施工）的明细表格
   * @param title - 表格标题
   * @param dataSource - 数据源
   */
  const renderTable = (title: string, dataSource: any[]) => (
    <Card
      size="small"
      title={title}
      // 设置卡片内容区域高度，适配全屏抽屉
      bodyStyle={{ height: 'calc(100vh - 324px)', overflowY: 'auto' }}
    >
      <Table
        size="small"
        // 横向滚动 + 纵向限制高度（避免溢出）
        scroll={{ x: '100%', y: 'calc(100vh - 428px)' }}
        dataSource={dataSource}
        columns={createColumns} // 使用固定列配置
        bordered // 显示边框
        // 自定义底部合计行
        summary={() => {
          const total = dataSource.reduce((sum, item) => sum + Number(item.num), 0);
          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                <Table.Summary.Cell index={0} align="center">
                  合计
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {total}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="center">
                  100%
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
        pagination={false} // 禁用分页
      />
    </Card>
  );

  /**
   * 渲染主组件
   */
  return (
    <>
      {/* 通用详情抽屉：展示主表单信息 + 自定义内容 */}
      <CrudQueryDetailDrawer
        rowKey="id"
        title="质量大专项检查主要不合格项汇总情况分布" // 抽屉标题
        columns={getTableColumns()} // 主表单字段列配置
        open={open}                 // 控制显隐
        onClose={onClose}           // 关闭回调
        selectedRecord={selectedRecord} // 当前选中记录（用于顶部展示）
        buttonToolbar={renderButtonToolbar} // 右上角操作按钮
      >
        {/* 并排显示两个明细表格 */}
        <div style={{ display: 'flex', gap: 16 }}>
          {renderTable("现场管理质量", data.management)}
          {renderTable("现场施工质量", data.construction)}
        </div>
      </CrudQueryDetailDrawer>

      {/* 编辑弹窗 */}
      {editVisible && (
        <QualityInspectionSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)} // 关闭编辑
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose(); // 关闭详情抽屉
            if (actionRef.current) {
              actionRef.current.reloadTable(); // 刷新父表格
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
          onOk={handleDel} // 按 Enter 也可触发删除
          onCancel={() => setDelVisible(false)} // 点击取消或遮罩关闭
        >
          <p>是否删除当前的数据</p>
        </Modal>
      )}
    </>
  );
};

// 使用 connect() 注入 dispatch
export default connect()(QualityInspectionSummaryDetail);
