import { Tag } from "antd";

export const configColumns = [
  {
    title: "compinfo.form_no",
    subTitle: "主键ID",
    dataIndex: "form_no",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.out_info_id",
    subTitle: "分包合同id",
    dataIndex: "out_info_id",
    width: 160,
    align: "center",
  },
  {
    title: "工程名称",
    subTitle: "工程名称",
    dataIndex: "contract_out_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.record_name",
    subTitle: "记录名称",
    dataIndex: "record_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.record_name",
    subTitle: "记录名称",
    dataIndex: "record_name_b",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.dep_code",
    subTitle: "(项目部)",
    dataIndex: "dep_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.form_maker_code",
    subTitle: "制单人编码",
    dataIndex: "form_maker_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.form_maker_name",
    subTitle: "制单人名称",
    dataIndex: "form_maker_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.form_make_time",
    subTitle: "制单时间",
    dataIndex: "form_make_time",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.form_make_tz",
    subTitle: "制单时区",
    dataIndex: "form_make_tz",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.id",
    subTitle: "主键ID",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.form_no",
    subTitle: "归档清单主表ID",
    dataIndex: "form_no",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.record_name",
    subTitle: "记录名称",
    dataIndex: "record_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.unit",
    subTitle: "单位",
    dataIndex: "unit",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.archive_num",
    subTitle: "数量",
    dataIndex: "archive_num",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.transfer_date",
    subTitle: "移交日期",
    dataIndex: "transfer_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.transfer_date",
    subTitle: "移交日期",
    dataIndex: "transfer_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.status",
    subTitle: "审批状态（-1:审批驳回,0-未审批，1-审批中，2-审批完成）",
    dataIndex: "status",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.approval_date",
    subTitle: "审批时间",
    dataIndex: "approval_date",
    width: 160,
    align: "center",
  },
  {
    title: "审批状态",
    subTitle: "审批状态",
    dataIndex: "status_str",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (text === '审批中') {
        return <Tag color="blue">审批中</Tag>
      } else if (text === '审批完成') {
        return <Tag color="green">审批完成</Tag>
      } else if (text === '审批驳回') {
        return <Tag color="red">审批驳回</Tag>
      } else {
        return <Tag color="gray">未审批</Tag>
      }
    }
  },
  {
    title: "compinfo.approval_date",
    subTitle: "审批时间",
    dataIndex: "approval_date_str",
    width: 160,
    align: "center",
  },
];
