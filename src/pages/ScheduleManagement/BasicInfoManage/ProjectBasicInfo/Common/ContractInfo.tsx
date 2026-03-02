import React, { forwardRef, useImperativeHandle } from "react";
import {
  Button,
  Form,
  Input,
  Divider,
  Table,
  DatePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import type { Rule } from "antd/es/form";

const { TextArea } = Input;

// 常量定义
const DATE_FORMAT = "YYYY-MM-DD";

interface MilestoneItem {
  name: string;
  start_date: Moment | null;  // 改为 Moment 类型
  end_date: Moment | null;
  remark: string;
}

const ContractInfo = forwardRef((props: { disabled?: boolean }, ref) => {
  const { disabled = false } = props;
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    /** 获取表单数据（传递0时区秒级时间戳给后台） */
    getFormData: async () => {
      try {
        const values = await form.validateFields();

        const milestoneList = (values.milestoneList || [])
          .filter((item: MilestoneItem) => item?.name?.trim())
          .map((item: MilestoneItem) => {
            // 将moment对象转换为0时区秒级时间戳
            const getUTCTimestamp = (date: Moment | null) => {
              if (!date) return null;
              // 使用utc模式转换为秒级时间戳
              return Math.floor(date.utc().valueOf() / 1000);
            };

            return {
              name: item.name.trim(),
              start_date: getUTCTimestamp(item.start_date),
              end_date: getUTCTimestamp(item.end_date),
              remark: item.remark || "",
            };
          });

        return {
          key_clauses: values.key_clauses?.trim() || "",
          liability_clauses: values.liability_clauses?.trim() || "",
          requirements: values.requirements?.trim() || "",
          milestoneList,
        };
      } catch (error) {
        throw new Error("请填写完整的合同信息");
      }

    },

    /** 设置表单数据（从0时区秒级时间戳回显） */
    setFormData: (data: any) => {
      const milestoneList = (data.milestoneList || []).map((m: any) => {
        // 将0时区秒级时间戳转换为本地时区的moment对象
        const parseUTCTimestamp = (timestamp: string | number | null) => {
          if (!timestamp) return null;

          const timestampNum = Number(timestamp);
          const isSeconds = timestampNum.toString().length <= 10;
          const milliseconds = isSeconds ? timestampNum * 1000 : timestampNum;

          return moment(milliseconds);
        };

        return {
          name: m.name || "",
          start_date: parseUTCTimestamp(m.start_date),
          end_date: parseUTCTimestamp(m.end_date),
          remark: m.remark || "",
        };
      });

      // 至少保留一行空行
      if (milestoneList.length === 0) {
        milestoneList.push({
          name: "",
          start_date: null,
          end_date: null,
          remark: "",
        });
      }

      form.setFieldsValue({
        key_clauses: data.key_clauses || "",
        liability_clauses: data.liability_clauses || "",
        requirements: data.requirements || "",
        milestoneList,
      });
    },
  }));

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      disabled={disabled}
      initialValues={{
        milestoneList: [
          {
            name: "",
            start_date: null,
            end_date: null,
            remark: "",
          },
        ],
      }}
      labelAlign="left"
    >
      <Form.Item
        label="合同结算收款主要条款"
        name="key_clauses"
        rules={[{ required: true, message: "请输入合同结算收款主要条款" }]}
      >
        <TextArea rows={3} showCount />
      </Form.Item>

      <Form.Item
        label="工期、性能违约责任条款"
        name="liability_clauses"
        rules={[{ required: true, message: "请输入工期、性能违约责任条款" }]}
      >
        <TextArea rows={3} showCount />
      </Form.Item>

      <Form.Item
        label="保函要求情况"
        name="requirements"
        rules={[{ required: true, message: "请输入保函要求情况" }]}
      >
        <TextArea rows={3} showCount />
      </Form.Item>

      <Divider orientation="left">合同里程碑计划</Divider>

      <Form.List name="milestoneList">
        {(fields, { add, remove }) => {
          const columns = [
            {
              title: "序号",
              width: 60,
              align: "center" as const,
              render: (_: any, __: any, index: number) => index + 1,
            },
            {
              title: <>
                <span style={{ color: "red", marginRight: 4 }}>*</span>里程碑名称
              </>,
              width: 270,
              align: "center",
              render: (_: any, __: any, index: number) => (
                <Form.Item
                  name={[index, "name"]}
                  rules={[{ required: true, message: "请输入里程碑名称" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{width: '100%'}} placeholder="请输入里程碑名称" disabled={disabled} />
                </Form.Item>
              ),
            },
            {
              title: <>
                <span style={{ color: "red", marginRight: 4 }}>*</span>开始日期
              </>,
              width: 220,
              align: "center",
              render: (_: any, __: any, index: number) => (
                <Form.Item<MilestoneItem>
                  name={[index, "start_date"]}
                  rules={[{ required: true, message: "请选择开始日期" }]}
                  style={{ margin: 0 }}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format={DATE_FORMAT}
                    placeholder="选择开始日期"
                    disabled={disabled}
                  />
                </Form.Item>
              ),
            },
            {
              title: <>
                <span style={{ color: "red", marginRight: 4 }}>*</span>结束日期
              </>,
              width: 220,
              align: "center",
              render: (_: any, __: any, index: number) => (
                <Form.Item<MilestoneItem>
                  name={[index, "end_date"]}
                  rules={[
                    { required: true, message: "请选择结束日期" },
                    // 本地时区比较（显示给用户看）
                    ({ getFieldValue }) => ({
                      validator(_: Rule, endDate: Moment) {
                        if (!endDate) return Promise.resolve();
                        const startDate = getFieldValue(["milestoneList", index, "start_date"]) as Moment;
                        if (!startDate) return Promise.resolve();

                        // 使用本地时区比较
                        if (endDate.isBefore(startDate, 'day')) {
                          return Promise.reject(new Error("结束日期不能早于开始日期"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  style={{ margin: 0 }}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format={DATE_FORMAT}
                    placeholder="选择结束日期"
                    disabled={disabled}
                  />
                </Form.Item>
              ),
            },
            {
              title: "备注",
              align: "center",
              render: (_: any, __: any, index: number) => (
                <Form.Item name={[index, "remark"]} style={{ margin: 0 }}>
                  <Input placeholder="请输入备注" disabled={disabled} />
                </Form.Item>
              ),
            },
            {
              title: "操作",
              width: 80,
              align: "center" as const,
              render: (_: any, __: any, index: number) => (
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled={disabled || fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  删除
                </Button>
              ),
            },
          ];

          return (
            <Table
              columns={columns}
              dataSource={fields}
              pagination={false}
              size="middle"
              rowKey={(record) => record.key ?? String(record.name)}
              title={() => (
                <Button
                  type="dashed"
                  onClick={() => add({ name: "", start_date: null, end_date: null, remark: "" })}
                  icon={<PlusOutlined />}
                  disabled={disabled}
                >
                  添加里程碑
                </Button>
              )}
            />
          );
        }}
      </Form.List>
    </Form>
  );
});

ContractInfo.displayName = "ContractInfo";

export default ContractInfo;