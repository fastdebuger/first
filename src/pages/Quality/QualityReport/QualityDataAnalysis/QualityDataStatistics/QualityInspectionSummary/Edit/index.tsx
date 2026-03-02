// 引入 React 核心 Hook：useState（状态管理）、useEffect（副作用处理）
import React, { useState, useEffect } from "react";
// 引入 Ant Design 组件：按钮、模态框、卡片、加载指示器、表格、数字输入框、消息提示、间距容器、栅格布局
import { Button, Modal, Card, Spin, Table, InputNumber, message, Space, Row, Col } from "antd";
// 引入 Umi 的 connect（注入 dispatch）和国际化钩子 useIntl
import { connect, useIntl } from "umi";
// 引入全局错误码常量（用于判断接口是否成功）
import { ErrorCode } from "@yayang/constants";

/**
 * 定义组件内部状态的数据结构：
 * - management: 现场管理质量类别的不合格项列表
 * - construction: 现场施工质量类别的不合格项列表
 */
type DataState = {
  management: any[];     // 管理类问题项
  construction: any[];   // 施工类问题项
};

/**
 * 编辑质量大(专项)检查主要不合格项汇总情况分布 - 弹窗组件
 * @param props
 *   - selectedRecord: 当前选中的主记录（包含 form_no 等信息）
 *   - dispatch: Redux action 分发函数
 *   - callbackEditSuccess: 编辑成功后的回调（用于刷新父页面）
 *   - onCancel: 关闭弹窗回调
 *   - visible: 控制弹窗是否显示
 */
const QualityInspectionSummaryEdit: React.FC<any> = ({
                                                       selectedRecord,
                                                       dispatch,
                                                       callbackEditSuccess,
                                                       onCancel,
                                                       visible,
                                                     }) => {
  // 获取国际化方法，用于多语言标题
  const { formatMessage } = useIntl();

  // 控制加载/提交状态（显示 Spin）
  const [spinning, setSpinning] = useState(false);

  // 存储两类不合格项明细数据（可编辑）
  const [data, setData] = useState<DataState>({
    management: [],
    construction: [],
  });

  /**
   * 组件挂载时，根据 selectedRecord.form_no 查询当前不合格项明细数据
   */
  useEffect(() => {
    dispatch({
      type: "qualityInspectionSummary/queryQualityInspectionSummaryBody",
      payload: {
        sort: 'type_code_id', // 按类型 ID 升序排列
        order: 'asc',
        // 构造过滤条件：匹配主表单编号
        filter: JSON.stringify([
          { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if (res?.rows?.length) {
          // 格式化原始数据：
          // - 添加唯一 key（用于 React 渲染）
          // - 将 ratio_num 转为保留两位小数的字符串（兼容后端可能返回 number 或 string）
          const formatted = res.rows.map((item: any) => ({
            ...item,
            key: item.id, // 表格行唯一标识
            ratio_num: item.ratio_num ? Number(item.ratio_num).toFixed(2) : '0.00',
          }));

          console.log('formatted', formatted); // 调试用

          // 按 sys_type_code 分组：管理类 vs 施工类
          setData({
            management: formatted.filter(
              (item: any) => item.sys_type_code === 'SITE_MANAGEMENT_QUALITY'
            ),
            construction: formatted.filter(
              (item: any) => item.sys_type_code === 'SITE_CONSTRUCTION_QUALITY'
            ),
          });
        }
      },
    });
  }, []); // 仅在组件首次渲染时执行

  /**
   * 提交编辑后的数据
   */
  const save = () => {
    setSpinning(true); // 开始提交

    // 合并两类数据（管理 + 施工）
    const items = [...data.management, ...data.construction];

    // 调用更新接口
    dispatch({
      type: 'qualityInspectionSummary/updateQualityInspectionSummary',
      payload: {
        ...selectedRecord,               // 保留主表单原有字段（如 id, form_no 等）
        UpdateItems: JSON.stringify(items), // 明细项（注意：建议后端接受对象数组而非字符串）
      },
      callback: (res) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('编辑成功');
          setTimeout(callbackEditSuccess, 1000); // 延迟触发成功回调
        }
        setSpinning(false); // 提交结束
      },
    });
  };

  /**
   * 渲染一个类别（管理/施工）的可编辑表格
   * @param title - 表格标题
   * @param dataSource - 数据源
   * @param type - 类型标识（用于更新 state）
   */
  const renderTable = (
    title: string,
    dataSource: any[],
    type: 'management' | 'construction'
  ) => (
    <Card
      size="small"
      title={title}
      // 设置卡片内容区域高度，避免溢出（适配全屏弹窗）
      bodyStyle={{ height: 'calc(100vh - 154px)', overflowY: 'auto' }}
    >
      <Table
        size="small"
        // 横向滚动（防止列挤压），纵向限制高度
        scroll={{ x: '100%', y: 'calc(100vh - 258px)' }}
        dataSource={dataSource}
        columns={[
          {
            title: formatMessage({ id: 'compinfo.type_code_name' }), // 不合格项类型名称
            dataIndex: 'type_code_name',
            width: 160,
            align: 'center',
          },
          {
            title: formatMessage({ id: 'compinfo.num' }), // 数量（可编辑）
            dataIndex: 'num',
            width: 160,
            align: 'center',
            render: (_, record) => (
              <InputNumber
                value={record.num}
                min={0} // 防止输入负数
                onChange={(val) => {
                  // 计算新的总数量（包括当前修改项）
                  const total = dataSource.reduce((sum, item) =>
                    sum + (item.key === record.key ? Number(val || 0) : Number(item.num)), 0
                  );

                  console.log('total', total); // 调试用

                  // 更新当前类别下所有项的 num 和 ratio_num
                  const updated = dataSource.map((item) => {
                    const newNum = item.key === record.key ? Number(val || 0) : item.num;
                    // 防止除零错误：若 total 为 0，则占比为 0%
                    const newRatio = total > 0 ? ((newNum / total) * 100).toFixed(2) : '0.00';
                    return {
                      ...item,
                      num: newNum,
                      ratio_num: newRatio,
                    };
                  });

                  console.log('updated', updated, dataSource); // 调试用
                  // 更新 state 中对应类别的数据
                  setData((prev) => ({ ...prev, [type]: updated }));
                }}
                style={{ width: '100%' }}
              />
            ),
          },
          {
            title: formatMessage({ id: 'compinfo.ratio_num' }), // 占比（只读显示）
            dataIndex: 'ratio_num',
            width: 160,
            align: 'center',
            render: (text) => `${text}%`, // 显示为百分比格式
          },
        ]}
        bordered // 显示表格边框
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

  // 渲染主编辑弹窗
  return (
    <Modal
      // 全屏样式：顶部对齐、最大宽度、无底部 padding
      style={{ maxWidth: '100vw', top: 0, paddingBottom: 0 }}
      // 主体区域高度占满视口减去标题高度，支持滚动
      bodyStyle={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}
      // 自定义标题：包含标题文本 + 操作按钮
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <h3>编辑质量大(专项)检查主要不合格项汇总情况分布</h3>
          </Col>
          <Col>
            <Space>
              {/* 提交按钮：加载中状态 */}
              <Button loading={spinning} onClick={save} type="primary">
                提交
              </Button>
              {/* 取消按钮 */}
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Col>
        </Row>
      }
      width="100vw"       // 全宽
      footer={null}       // 隐藏默认 footer（按钮已放在 title 中）
      closable={false}    // 禁用右上角关闭（强制通过“取消”关闭）
      open={visible}      // 控制显隐（兼容新版 antd）
      visible={visible}   // 兼容旧版 antd（可选）
      onCancel={onCancel} // ESC 或遮罩点击时调用（但 closable=false 会禁用）
    >
      {/* 包裹加载指示器 */}
      <Spin spinning={spinning}>
        {/* 并排显示两个可编辑表格 */}
        <div style={{ display: 'flex', gap: 16 }}>
          {renderTable("现场管理质量", data.management, 'management')}
          {renderTable("现场施工质量", data.construction, 'construction')}
        </div>
      </Spin>
    </Modal>
  );
};

// 使用 connect() 注入 dispatch
export default connect()(QualityInspectionSummaryEdit);
