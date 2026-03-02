import React, { forwardRef, useState, useImperativeHandle } from "react";
import { Form, Input, Table, InputNumber } from "antd";
import { useIntl } from "umi";
import { EquipmentItem, getInitData } from "./FormConfig";

/**
 * 设备资源表单组件（用于设备资源录入）
 * @param props - 组件接收的props
 *   @param dispatch: Umi的dispatch（用于提交数据）
 *   @param initialData: 编辑时回显的设备数据（从后端获取）
 *   @param ref: 父组件传递的Ref（用于暴露getFormData方法）
 */
const EquipmentResource: React.FC<any> = forwardRef((props, ref) => {
  const { disabled = false } = props;
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const initData = getInitData(formatMessage);
  // 状态管理（设备数据源）
  const [dataSource, setDataSource] = useState<EquipmentItem[]>(initData);
  // 暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return dataSource
        // .filter(item => item.own_quantity || item.lease_quantity || item.shared_quantity || item.remark)
        .map(item => ({
          equipment_category: item.equipment_category,
          equipment_name: item.equipment_name,
          own_quantity: item.own_quantity || 0,
          lease_quantity: item.lease_quantity || 0,
          shared_quantity: item.shared_quantity || 0,
          remark: item.remark || "",
        }));
    },

    // 重点修改这里！完全替换！
    setFormData: (data: any[]) => {
      console.log("EquipmentResource 接收到回填数据:", data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        setDataSource(initData);
        return;
      }

      // 创建一个 Map，key 是 "设备名称 + 分类"，用于快速查找
      const dataMap = new Map<string, any>();
      data.forEach(item => {
        const key = `${item.equipment_name}-${item.equipment_category}`;
        dataMap.set(key, item);
      });

      // 遍历初始模板，合并后端数据
      const mergedData = initData.map(templateItem => {
        const key = `${templateItem.equipment_name}-${templateItem.equipment_category}`;
        const backendItem = dataMap.get(key);

        /**
         * 合并模板项和后端数据项，返回包含数量信息和备注的新对象
         * 
         * @param templateItem - 模板项对象，作为基础数据结构
         * @param backendItem - 后端返回的数据项，包含实际的数量和备注信息
         * @returns 返回合并后的对象，包含原始模板项的所有属性以及后端提供的数量和备注信息
         */
        if (backendItem) {
          // 将后端数据与模板项合并，优先使用后端的数量数据和备注信息
          return {
            ...templateItem,
            own_quantity: Number(backendItem.own_quantity) || 0,
            lease_quantity: Number(backendItem.lease_quantity) || 0,
            shared_quantity: Number(backendItem.shared_quantity) || 0,
            remark: backendItem.remark || "",
          };
        }
        // 后端没返回这行设备，就保持模板默认值（是 0）
        return templateItem;
      });

      setDataSource(mergedData);
      console.log("EquipmentResource 回显成功:", mergedData);
    },
  }));

  /**
     * 更新指定行的某个字段
     * @param key     - 当前行的唯一 key（initData 中定义）
     * @param field   - 要修改的字段名，必须是 EquipmentItem 的属性
     *                  支持：own_quantity | lease_quantity | shared_quantity | remark
     * @param value   - 新值
     *                  - 数量字段：number | null（清空时为 null，统一转为 0）
     *                  - 备注字段：string
     */
  const handleChange = (key: string, field: keyof EquipmentItem, value: any) => {
    // 使用函数式更新，保证每次更新都基于最新的 state（防止并发修改导致数据丢失）
    setDataSource((prev) => {
      // 遍历当前所有设备行，找出 key 匹配的那一行进行更新
      return prev.map((item) => {
        // 判断当前遍历的行是否是要修改的那一行
        if (item.key === key) {
          // 命中目标行：使用展开运算符创建新对象，只替换指定的 field
          // 例如：{ ...item, own_quantity: 5 } 或 { ...item, remark: "临时租赁" }
          return { ...item, [field]: value };
        }
        // 未命中：原样返回该行数据（保持不可变性）
        return item;
      });
    });
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      width: 60,
      align: "center" as const,
      // 序号列自动计算行号
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      // 设备名称（固定显示，不可编辑）
      title: "设备名称",
      dataIndex: "equipment_name", // 关联数据字段
      width: 200,
    },
    {
      // 自有设备数量输入（最小值0，小尺寸输入框）
      title: "自有台组",
      width: 110,
      align: "center" as const,
      render: (_: any, record: EquipmentItem) => (
        <InputNumber
          min={0}
          size="small"
          style={{ width: 80 }}
          value={record.own_quantity}
          onChange={(v) => handleChange(record.key, "own_quantity", v ?? 0)}
        />
      ),
    },
    {
      // 租赁设备数量输入（最小值0，小尺寸输入框）
      title: "租赁台组",
      width: 110,
      align: "center" as const,
      render: (_: any, record: EquipmentItem) => (
        <InputNumber
          min={0}
          size="small"
          style={{ width: 80 }}
          value={record.lease_quantity}
          onChange={(v) => handleChange(record.key, "lease_quantity", v ?? 0)}
        />
      ),
    },
    {
      // 共享设备数量输入（最小值0，小尺寸输入框）
      title: "共享台组",
      width: 110,
      align: "center" as const,
      render: (_: any, record: EquipmentItem) => (
        <InputNumber
          min={0}
          size="small"
          style={{ width: 80 }}
          value={record.shared_quantity}
          onChange={(v) => handleChange(record.key, "shared_quantity", v ?? 0)}
        />
      ),
    },
    {
      title: "备注",
      width: 220,
      render: (_: any, record: EquipmentItem) => (
        <Input
          size="small"
          value={record.remark}
          onChange={(e) => handleChange(record.key, "remark", e.target.value)}
          placeholder="请输入备注"
        />
      ),
    },
  ];

  /**
   * 小计计算工具函数
   * 计算指定设备列表的自有、租赁、共享台组总数
   * @param list - 需要统计的设备行数组
   * @returns    { own: number, lease: number, share: number }
   */
  const calcSubtotal = (list: EquipmentItem[]) =>
    list.reduce(
      (acc, cur) => ({
        own: acc.own + (cur.own_quantity || 0),
        lease: acc.lease + (cur.lease_quantity || 0),
        share: acc.share + (cur.shared_quantity || 0),
      }),
      { own: 0, lease: 0, share: 0 }
    );

  // 数据分割与汇总
  const generalList = dataSource.filter((i) => i.equipment_category === "通用设备");
  const specialList = dataSource.filter((i) => i.equipment_category === "管道专用设备");
  // 计算通用设备小计（自有/租赁/共享台组）
  const generalSubtotal = calcSubtotal(generalList);
  // 计算管道专用设备小计（自有/租赁/共享台组）
  const specialSubtotal = calcSubtotal(specialList);
  // 计算全局总计
  const total = {
    own: generalSubtotal.own + specialSubtotal.own,    // 自有台组总计
    lease: generalSubtotal.lease + specialSubtotal.lease, // 租赁台组总计
    share: generalSubtotal.share + specialSubtotal.share, // 共享台组总计
  };

  return (
    <Form form={form} disabled={disabled} name="equipment" labelAlign="left">
      <Form.Item name="equipmentResourceList">
        <div style={{ background: "#fff", padding: "16px" }}>
          {/* 通用设备 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16 }}>通用设备</h4>
            <Table
              columns={columns}
              dataSource={generalList}
              bordered
              size="small"
              pagination={false}
              summary={() => (
                <Table.Summary.Row style={{ background: "#fafafa", fontWeight: "bold" }}>
                  <Table.Summary.Cell index={0} colSpan={2} align="center">
                    小计
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">{generalSubtotal.own}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">{generalSubtotal.lease}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">{generalSubtotal.share}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} />
                </Table.Summary.Row>
              )}
            />
          </div>

          {/* 管道专用设备 */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16 }}>管道专用设备</h4>
            <Table
              columns={columns}
              dataSource={specialList}
              bordered
              size="small"
              pagination={false}
              summary={() => (
                <Table.Summary.Row style={{ background: "#fafafa", fontWeight: "bold" }}>
                  <Table.Summary.Cell index={0} colSpan={2} align="center">
                    小计
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="center">{specialSubtotal.own}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="center">{specialSubtotal.lease}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">{specialSubtotal.share}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5} />
                </Table.Summary.Row>
              )}
            />
          </div>

          {/* 总合计 */}
          <Table
            columns={[
              { title: "", dataIndex: "label", render: (t: string) => <strong>{t}</strong>, width: 240 },
              { title: "自有台组", dataIndex: "own", align: "center" as const, render: (t: number) => <strong>{t}</strong> },
              { title: "租赁台组", dataIndex: "lease", align: "center" as const, render: (t: number) => <strong>{t}</strong> },
              { title: "共享台组", dataIndex: "share", align: "center" as const, render: (t: number) => <strong>{t}</strong> },
              { title: "备注", dataIndex: "note" },
            ]}
            dataSource={[
              { key: "total", label: "合计", own: total.own, lease: total.lease, share: total.share, note: "" },
            ]}
            pagination={false}
            showHeader={false}
            bordered
            size="small"
          />
        </div>
      </Form.Item>
    </Form>
  );
});
// React 组件的静态属性
EquipmentResource.displayName = "CostControlInfo";

export default EquipmentResource;