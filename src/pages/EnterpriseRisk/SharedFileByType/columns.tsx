import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "SharedFileByType.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
    render: (c, r, i) => i + 1
  },
  {
    title: "SharedFileByType.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.unit_name",
    subTitle: "单位名称",
    dataIndex: "unit_name",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.file_type",
    subTitle: "文件类型",
    dataIndex: "file_type",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.file_belong",
    subTitle: "文件名称",
    dataIndex: "file_belong",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.file_path",
    subTitle: "附件",
    dataIndex: "file_path",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.audit_status_name",
    subTitle: "审批状态",
    dataIndex: "audit_status_name",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (AUDIT_STATUS_NAME[text]) {
        return <Tag color={AUDIT_STATUS_NAME[text]}>{text}</Tag>
      } else {
        return <Tag color="orange">{text || '暂无审批'}</Tag>
      }
    }
  },
  {
    title: "SharedFileByType.user_names",
    subTitle: "共享用户组",
    dataIndex: "user_names",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.wbs_names",
    subTitle: "共享项目组",
    dataIndex: "wbs_names",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.create_by_name",
    subTitle: "创建人",
    dataIndex: "create_by_name",
    width: 160,
    align: "center",
  },
  {
    title: "SharedFileByType.create_date_str",
    subTitle: "创建时间",
    dataIndex: "create_date_str",
    width: 160,
    align: "center",
  },
];
