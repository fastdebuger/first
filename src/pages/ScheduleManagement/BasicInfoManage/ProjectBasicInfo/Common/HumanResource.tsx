import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Table, InputNumber, Form } from "antd";
import { useIntl } from "umi";
import { HumanItem, getHrInitData } from "./FormConfig";

/**
 * 人力资源数据结构
 * @property key - 表格行唯一标识（用于状态管理）
 * @property category - 人员类别（管理人员/设计人员等）
 * @property type - 后端数据类型标识（与后端字段一致）
 * @property own_* - 自有人员（合同化+市场化）统计
 * @property labor_* - 劳务用工人员统计
 * @property sub_* - 分包商人员统计
 * @note 所有数量字段均为非负整数（min=0）
 */
const HumanResource: React.FC<any> = forwardRef((props, ref) => {
  const { disabled = false } = props;
  const { formatMessage } = useIntl();
  const initialData = getHrInitData(formatMessage);
  const [dataSource, setDataSource] = useState<HumanItem[]>(initialData);
  // 单字段更新逻辑（关键交互）
  /**
   * 更新指定行的指定字段
   * @param key - 行唯一标识
   * @param field - 要更新的字段（需为HumanItem的keyof）
   * @param value - 新值（自动转为0，避免null）
   * @note 1. 使用Immer-like不可变更新
   *       2. 保证所有数量字段为非负整数
   */
  const handleChange = (key: string, field: keyof HumanItem, value: number | null) => {
    setDataSource(prev =>
      prev.map(item =>
        item.key === key ? { ...item, [field]: value ?? 0 } : item
      )
    );
  };

  // 合计计算逻辑（核心业务规则）
  /**
   * 计算全表人员统计汇总
   * @returns 包含所有统计维度的汇总对象
   * @note 1. 计算逻辑：自有+劳务+分包 = 中方/外方总计
   *       2. 用于表格底部汇总行和提交数据验证
   */
  const calculateTotals = () => {
    const totals = {
      own_cn_cnt: 0, own_fgn_cnt: 0,
      labor_cn_cnt: 0, labor_fgn_cnt: 0,
      sub_cn_cnt: 0, sub_fgn_cnt: 0,
      total_cn: 0, total_fgn: 0,
    };

    dataSource.forEach(item => {
      totals.own_cn_cnt += item.own_cn_cnt;
      totals.own_fgn_cnt += item.own_fgn_cnt;
      totals.labor_cn_cnt += item.labor_cn_cnt;
      totals.labor_fgn_cnt += item.labor_fgn_cnt;
      totals.sub_cn_cnt += item.sub_cn_cnt;
      totals.sub_fgn_cnt += item.sub_fgn_cnt;
    });
    // 中方、外方总计 = 自有 + 劳务 + 分包
    totals.total_cn = totals.own_cn_cnt + totals.labor_cn_cnt + totals.sub_cn_cnt;
    totals.total_fgn = totals.own_fgn_cnt + totals.labor_fgn_cnt + totals.sub_fgn_cnt;

    return totals;
  };

  const totals = calculateTotals();

  // 关键：暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    /**
     * 获取符合后端要求的提交数据
     * @throws 当无任何有效数据时抛出错误
     * @returns 格式化后的数据数组（含所有必填字段）
     * @note 1. 验证逻辑：至少有一项人员数量>0
     *       2. 字段映射：确保与后端API字段一致
     *       3. 业务规则：所有数量字段确保为数字
     */
    getFormData: async () => {
      // 格式化数组
      return dataSource.map(item => ({
        type: item.type,
        own_cn_cnt: item.own_cn_cnt,
        own_fgn_cnt: item.own_fgn_cnt,
        labor_cn_cnt: item.labor_cn_cnt,
        labor_fgn_cnt: item.labor_fgn_cnt,
        sub_cn_cnt: item.sub_cn_cnt,
        sub_fgn_cnt: item.sub_fgn_cnt,
      }));
    },
    setFormData: (data: any[]) => {
      console.log("HumanResource 接收到回填数据:", data);

      /**
       * 验证并处理数据源，确保表格数据的有效性
       * 
       * @param data - 待验证的数据源，应为数组类型
       * @param initialData - 当数据无效时使用的默认初始数据
       * @param setDataSource - 设置数据源状态的函数
       * 
       * @returns 无返回值，直接更新数据源状态
       */
      if (!data || !Array.isArray(data) || data.length === 0) {
        // 如果没有数据，保持默认空表格
        setDataSource(initialData);
        return;
      }

      // 关键：把后端返回的数组，映射成我们内部需要的带 key 的结构
      const formattedData = data.map((item, index) => ({
        key: `hr_${index}`, // 必须有唯一 key
        category: item.type === "管理人员" ? "管理人员" :
          item.type === "设计人员" ? "设计人员" :
            item.type === "采办人员" ? "采办人员" :
              item.type === "施工人员" ? "施工人员" : "其他",
        type: item.type,
        own_cn_cnt: item.own_cn_cnt || 0,
        own_fgn_cnt: item.own_fgn_cnt || 0,
        labor_cn_cnt: item.labor_cn_cnt || 0,
        labor_fgn_cnt: item.labor_fgn_cnt || 0,
        sub_cn_cnt: item.sub_cn_cnt || 0,
        sub_fgn_cnt: item.sub_fgn_cnt || 0,
      }));

      // 更新状态 → 表格自动回显！
      setDataSource(formattedData);

      console.log("HumanResource 回填完成，dataSource:", formattedData);
    },
  }));

  // 表格列定义
  const columns = [
    {
      title: "人员类别",
      dataIndex: "category",
      key: "category",
      width: 120,
      fixed: "left" as const, // 人员类别固定列
    },
    {
      title: "自有人员(合同化+市场化)",
      children: [
        {
          title: "中方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.own_cn_cnt}
              onChange={(v) => handleChange(record.key, "own_cn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
        {
          title: "外方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.own_fgn_cnt}
              onChange={(v) => handleChange(record.key, "own_fgn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
      ],
    },
    {
      title: "劳务用工人员",
      children: [
        {
          title: "中方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.labor_cn_cnt}
              onChange={(v) => handleChange(record.key, "labor_cn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
        {
          title: "外方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.labor_fgn_cnt}
              onChange={(v) => handleChange(record.key, "labor_fgn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
      ],
    },
    {
      title: "分包商人员",
      children: [
        {
          title: "中方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.sub_cn_cnt}
              onChange={(v) => handleChange(record.key, "sub_cn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
        {
          title: "外方人员",
          width: 110,
          render: (_: any, record: HumanItem) => (
            <InputNumber
              min={0}
              disabled={disabled}
              value={record.sub_fgn_cnt}
              onChange={(v) => handleChange(record.key, "sub_fgn_cnt", v)}
              style={{ width: "100%" }}
            />
          ),
        },
      ],
    },
    {
      title: "合计",
      children: [
        {
          title: "中方人员",
          width: 110,
          // 动态计算：自有+劳务+分包的中方总和
          render: (_: any, record: HumanItem) => {
            const sum = record.own_cn_cnt + record.labor_cn_cnt + record.sub_cn_cnt;
            return <span style={{ fontWeight: 500 }}>{sum}</span>;
          },
        },
        {
          title: "外方人员",
          width: 110,
          render: (_: any, record: HumanItem) => {
            const sum = record.own_fgn_cnt + record.labor_fgn_cnt + record.sub_fgn_cnt;
            return <span style={{ fontWeight: 500 }}>{sum}</span>;
          },
        },
      ],
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      size="middle"
      pagination={false}
      scroll={{ x: 1400 }}
      summary={() => (
        <Table.Summary fixed="top">
          <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
            {/* 合计行对应各统计维度 */}
            <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{totals.own_cn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>{totals.own_fgn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={3}>{totals.labor_cn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{totals.labor_fgn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={5}>{totals.sub_cn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={6}>{totals.sub_fgn_cnt}</Table.Summary.Cell>
            <Table.Summary.Cell index={7}>{totals.total_cn}</Table.Summary.Cell>
            <Table.Summary.Cell index={8}>{totals.total_fgn}</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
});
// React 组件的静态属性
HumanResource.displayName = "HumanResource";

export default HumanResource;