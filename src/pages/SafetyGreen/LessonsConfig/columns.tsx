import { Tag } from "antd";

export const configColumns = [
  {
    title: "compinfo.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.content_type",
    subTitle: "内容类型",
    dataIndex: "content_type",
    width: 160,
    align: "center"
  },
  {
    title: "compinfo.content_type",
    subTitle: "内容类型",
    dataIndex: "dict_name",
    width: 200,
    align: "center"
  },
  {
    title: "compinfo.title",
    subTitle: "标题",
    dataIndex: "title",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.publish_content",
    subTitle: "发布内容",
    dataIndex: "publish_content",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.scene",
    subTitle: "场景",
    dataIndex: "scene",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.keywords",
    subTitle: "关键词",
    dataIndex: "keywords",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.file_path",
    subTitle: "文件路径",
    dataIndex: "file_path",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_id",
    subTitle: "审计id",
    dataIndex: "audit_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_status",
    subTitle: "审计状态",
    dataIndex: "audit_status",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_by",
    subTitle: "审批人",
    dataIndex: "audit_by",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_date",
    subTitle: "审计日期",
    dataIndex: "audit_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_comment",
    subTitle: "审计意见",
    dataIndex: "audit_comment",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_by",
    subTitle: "创建者",
    dataIndex: "create_by",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_by_name",
    subTitle: "创建姓名",
    dataIndex: "create_by_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_date",
    subTitle: "创建日期",
    dataIndex: "create_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.update_by",
    subTitle: "更新作者",
    dataIndex: "update_by",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.update_by_name",
    subTitle: "更新姓名",
    dataIndex: "update_by_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.update_date",
    subTitle: "更新日期",
    dataIndex: "update_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.dict_name",
    subTitle: "字典名称",
    dataIndex: "dict_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_status_name",
    subTitle: "审计状态名称",
    dataIndex: "audit_status_name",
    width: 160,
    align: "center",
    render: (text: any) => {
      switch (text) {
        case "待提交":
          return <Tag color={'default'}>{text}</Tag>
        case "审批中":
          return <Tag color={'processing'}>{text}</Tag>
        case "已通过":
          return <Tag color={'success'}>{text}</Tag>
        case "驳回":
          return <Tag color={'error'}>{text}</Tag>
        default:
          return <Tag color={'default'}>{text || '暂无审批'}</Tag>
      }
    }
  },
  {
    title: "compinfo.audit_date_str",
    subTitle: "创建日期",
    dataIndex: "audit_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_date_str",
    subTitle: "创建日期",
    dataIndex: "create_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
];
