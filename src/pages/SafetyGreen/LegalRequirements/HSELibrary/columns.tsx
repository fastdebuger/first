import { Tag } from "antd"

export const configColumns = [
  {
    "title": "HSELegislation.RowNumber",
    "subTitle": "序号",
    "dataIndex": "RowNumber",
    "width": 100,
    "align": "center",
  },
  {
    "title": "HSELegislation.RowNumber",
    "subTitle": "序号",
    "dataIndex": "id",
    "width": 100,
    "align": "center",
  },
  {
    "title": "HSELegislation.main_id",
    "subTitle": "HSE法律法规库信息表主键ID",
    "dataIndex": "main_id",
    "width": 100,
    "align": "center"
  },
  {
    "title": "HSELegislation.old_record_id",
    "subTitle": "旧记录ID",
    "dataIndex": "old_record_id",
    "width": 100,
    "align": "center"
  },
  {
    "title": "HSELegislation.keywords",
    "subTitle": "关键词",
    "dataIndex": "keywords",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.version_no",
    "subTitle": "版本号",
    "dataIndex": "version_no",
    "width": 160,
    "align": "center"
  },
  // {
  //   "title": "HSELegislation.publish_content",
  //   "subTitle": "发布内容描述",
  //   "dataIndex": "publish_content",
  //   "width": 200,
  //   "align": "center"
  // },
  {
    "title": "HSELegislation.publish_date",
    "subTitle": "发布时间",
    "dataIndex": "publish_date",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.effective_date",
    "subTitle": "生效时间",
    "dataIndex": "effective_date",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.file_path",
    "subTitle": "附件",
    "dataIndex": "file_path",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_id",
    "subTitle": "审批流程ID",
    "dataIndex": "audit_id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_status", //0 1 2
    "subTitle": "审批状态代码",
    "dataIndex": "audit_status",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_by",
    "subTitle": "审批人",
    "dataIndex": "audit_by",
    "width": 150,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_date",
    "subTitle": "审批时间戳",
    "dataIndex": "audit_date",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_comment",
    "subTitle": "审批意见",
    "dataIndex": "audit_comment",
    "width": 200,
    "align": "center"
  },
  // {
  //   "title": "HSELegislation.create_by",
  //   "subTitle": "创建人ID",
  //   "dataIndex": "create_by",
  //   "width": 160,
  //   "align": "center"
  // },
  // {
  //   "title": "HSELegislation.create_by_name",
  //   "subTitle": "创建人姓名",
  //   "dataIndex": "create_by_name",
  //   "width": 160,
  //   "align": "center"
  // },
  {
    "title": "HSELegislation.create_date",
    "subTitle": "创建时间",
    "dataIndex": "create_date",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.wbs_code",
    "subTitle": "WBS编码",
    "dataIndex": "wbs_code",
    "width": 150,
    "align": "center"
  },
  {
    "title": "HSELegislation.law_name",
    "subTitle": "法律法规名称",
    "dataIndex": "law_name",
    "width": 150,
    "align": "center"
  },
  {
    "title": "HSELegislation.element",
    "subTitle": "要素",
    "dataIndex": "element",
    "width": 150,
    "align": "center"
  },
  {
    "title": "HSELegislation.law_level",
    "subTitle": "法律级别",
    "dataIndex": "law_level",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.law_level",
    "subTitle": "法律级别",
    "dataIndex": "law_level_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.wbs_name",
    "subTitle": "WBS名称/项目名称",
    "dataIndex": "wbs_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_status_name",
    "subTitle": "审批状态名称",
    "dataIndex": "audit_status_name",
    "width": 160,
    "align": "center",
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
    "title": "HSELegislation.create_date_str",
    "subTitle": "创建日期",
    "dataIndex": "create_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.publish_date_str",
    "subTitle": "发布日期",
    "dataIndex": "publish_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.effective_date_str",
    "subTitle": "生效日期",
    "dataIndex": "effective_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "HSELegislation.audit_date_str",
    "subTitle": "审批日期",
    "dataIndex": "audit_date_str",
    "width": 160,
    "align": "center"
  },

]

