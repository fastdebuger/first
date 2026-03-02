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
  management: any[];     // 现场管理质量问题项
  construction: any[];   // 现场施工质量问题项
};

/**
 * 新增质量大(专项)检查主要不合格项汇总情况分布 - 弹窗组件
 * @param props
 *   - dispatch: Redux action 分发函数
 *   - callbackAddSuccess: 新增成功后的回调（用于刷新父页面）
 *   - onCancel: 关闭弹窗回调
 *   - visible: 控制弹窗是否显示
 */
const QualityInspectionSummaryAdd: React.FC<any> = ({ dispatch, callbackAddSuccess, onCancel, visible }) => {
  // 获取国际化方法，用于多语言标题
  const { formatMessage } = useIntl();
  // 控制加载状态（提交或初始化时显示 Spin）
  const [spinning, setSpinning] = useState(false);

  // 存储两类不合格项数据（管理 + 施工）
  const [data, setData] = useState<DataState>({
    management: [],
    construction: [],
  });

  /**
   * 组件挂载时，从后端加载字典数据（不合格项类型）
   */
  useEffect(() => {
    setSpinning(true); // 开始加载
    // 调用字典查询接口
    dispatch({
      type: 'contractBasic/getSysDict',
      payload: { sort: 'id' }, // 按 id 排序
      callback: (res) => {
        if (res?.rows?.length) {
          // 格式化原始字典数据，添加默认 num=0, ratio_num=0，并设置唯一 key
          const formatted = res.rows.map(item => ({
            ...item,
            type_code_id: item.id,           // 类型 ID
            type_code_name: item.dict_name,  // 类型名称
            num: 0,                          // 默认数量为 0
            ratio_num: 0,                    // 默认占比为 0%
            key: item.id,                    // 表格行唯一标识
          }));

          // 按 sys_type_code 分组：管理类 vs 施工类
          setData({
            management: formatted.filter(
              item => item.sys_type_code === 'SITE_MANAGEMENT_QUALITY'
            ),
            construction: formatted.filter(
              item => item.sys_type_code === 'SITE_CONSTRUCTION_QUALITY'
            ),
          });
        }
        setSpinning(false); // 加载结束
      },
    });
  }, []); // 仅在组件首次渲染时执行

  /**
   * 提交新增数据
   */
  const save = () => {
    setSpinning(true); // 提交中
    // 合并两类数据，并只保留需要提交的字段
    const items = [...data.management, ...data.construction].map(item => ({
      type_code_id: item.type_code_id,
      type_code_name: item.type_code_name,
      num: item.num,
      ratio_num: item.ratio_num,
    }));

    // 发起新增请求
    dispatch({
      type: 'qualityInspectionSummary/addQualityInspectionSummary',
      payload: {
        Items: JSON.stringify(items), // 后端要求传字符串（建议后续改为对象数组）
      },
      callback: (res) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('新增成功');
          // 延迟 1 秒触发成功回调（提升用户体验）
          setTimeout(callbackAddSuccess, 1000);
        }
        setSpinning(false); // 提交结束
      },
    });
  };

  /**
   * 渲染一个类别（管理/施工）的表格
   * @param title - 表格标题
   * @param dataSource - 数据源
   * @param type - 类型标识（用于更新 state）
   * @returns JSX 元素
   */
  const renderTable = (
    title: string,
    dataSource: any[],
    type: 'management' | 'construction'
  ) => (
    <Card
      size="small"
      title={title}
      // 设置卡片内容区域高度，避免溢出
      bodyStyle={{ height: 'calc(100vh - 154px)', overflowY: 'auto' }}
    >
      <Table
        size="small"
        // 横向滚动（防止列挤压），纵向限制高度
        scroll={{ x: '100%', y: 'calc(100vh - 258px)' }}
        dataSource={dataSource}
        columns={[
          {
            title: formatMessage({ id: 'compinfo.type_code_name' }), // 不合格项类型
            dataIndex: 'type_code_name',
            width: 160,
            align: 'center',
          },
          {
            title: formatMessage({ id: 'compinfo.num' }), // 数量
            dataIndex: 'num',
            width: 160,
            align: 'center',
            // 自定义渲染：使用 InputNumber 允许用户输入数量
            render: (_, record) => (
              <InputNumber
                value={record.num}
                min={0} // 限制最小值为 0
                onChange={(val) => {
                  // 计算新的总数量（包括当前修改项）
                  const total = dataSource.reduce((sum, item) =>
                    sum + (item.key === record.key ? Number(val || 0) : Number(item.num)), 0
                  );

                  // 更新当前类别下的所有项（重新计算占比）
                  const updated = dataSource.map(item => {
                    const newNum = item.key === record.key ? Number(val || 0) : item.num;
                    // 防止除零错误
                    const newRatio = total > 0 ? ((newNum / total) * 100).toFixed(2) : '0.00';
                    return {
                      ...item,
                      num: newNum,
                      ratio_num: newRatio,
                    };
                  });

                  console.log('updated', updated, record);
                  // 更新 state 中对应类别的数据
                  setData(prev => ({ ...prev, [type]: updated }));
                }}
                style={{ width: '100%' }}
              />
            ),
          },
          {
            title: formatMessage({ id: 'compinfo.ratio_num' }), // 占比（%）
            dataIndex: 'ratio_num',
            width: 160,
            align: 'center',
            render: (text) => `${text}%`, // 显示为百分比格式
          },
        ]}
        bordered // 显示边框
        // 自定义表格底部合计行
        summary={(datas) => {
          const total = datas.reduce((sum, item) => sum + Number(item.num), 0);
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

  // 渲染主模态框
  return (
    <Modal
      // 全屏样式：顶部对齐、最大宽度、无底部 padding
      style={{ maxWidth: '100vw', top: 0, paddingBottom: 0 }}
      // 主体区域高度占满视口，支持滚动
      bodyStyle={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}
      // 自定义标题：包含标题文本 + 操作按钮
      title={(
        <Row justify={"space-between"} align="middle">
          <Col>
            <h3>新增质量大(专项)检查主要不合格项汇总情况分布</h3>
          </Col>
          <Col>
            <Space>
              {/* 提交按钮：加载中状态 */}
              <Button loading={spinning} onClick={save} type={"primary"}>
                提交
              </Button>
              {/* 取消按钮 */}
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Col>
        </Row>
      )}
      width='100vw'        // 全宽
      footer={null}        // 隐藏默认 footer（按钮已放在 title 中）
      closable={false}     // 禁用右上角关闭（强制通过“取消”关闭）
      open={visible}       // 控制显隐（兼容新版 antd）
      visible={visible}    // 兼容旧版 antd（可选）
      onCancel={onCancel}  // 点击遮罩或 ESC 时调用（但 closable=false 会禁用）
    >
      {/* 包裹加载指示器 */}
      <Spin spinning={spinning}>
        {/* 并排显示两个表格 */}
        <div style={{ display: 'flex', gap: 16 }}>
          {renderTable("现场管理质量", data.management, 'management')}
          {renderTable("现场施工质量", data.construction, 'construction')}
        </div>
      </Spin>
    </Modal>
  );
};

// 使用 connect() 注入 dispatch
export default connect()(QualityInspectionSummaryAdd);
