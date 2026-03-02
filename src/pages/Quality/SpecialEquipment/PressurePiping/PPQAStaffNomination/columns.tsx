import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "ppQAStaffNomination.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.unit_name",
    subTitle: "单位名称",
    dataIndex: "unit_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.construction_category",
    subTitle: "施工类别",
    dataIndex: "construction_category",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.main_id",
    subTitle: "主表编号2",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.post_config_id",
    subTitle: "质量控制职务",
    dataIndex: "post_config_id",
    width: 220,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.post_config_id",
    subTitle: "质量控制职务",
    dataIndex: "post_name",
    width: 300,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.person_name",
    subTitle: "姓名",
    dataIndex: "person_name",
    width: 300,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.gender",
    subTitle: "性别",
    dataIndex: "gender",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.education_level",
    subTitle: "学历",
    dataIndex: "education_level",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.education_level",
    subTitle: "学历",
    dataIndex: "education_level_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.major_studied",
    subTitle: "所学专业",
    dataIndex: "major_studied",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.technical_title",
    subTitle: "技术职称",
    dataIndex: "technical_title",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.technical_title",
    subTitle: "技术职称",
    dataIndex: "technical_title_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.professial_id",
    subTitle: "从事专业",
    dataIndex: "professial_id",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.professial_id",
    subTitle: "从事专业",
    dataIndex: "professial_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.work_years",
    subTitle: "工作年限",
    dataIndex: "work_years",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.administrative_post_id",
    subTitle: "行政职务",
    dataIndex: "administrative_post_id",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.administrative_post_id",
    subTitle: "行政职务",
    dataIndex: "administrative_post_name",
    width: 160,
    align: "center",
  },
  {
    title: "ppQAStaffNomination.description",
    subTitle: "说明",
    dataIndex: "description",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.audit_status_name",
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
    title: "ppQAStaffNomination.applicable_scenarios",
    subTitle: "适用场景",
    dataIndex: "applicable_scenarios",
    width: 160,
    align: "center",
  },
];
