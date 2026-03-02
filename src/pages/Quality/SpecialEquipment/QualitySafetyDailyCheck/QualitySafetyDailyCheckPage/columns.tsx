import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "QualitySafetyDailyCheck.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
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
    title: "QualitySafetyDailyCheck.preventive_measures",
    subTitle: "采取的防范措施",
    dataIndex: "preventive_measures",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.risk_category_config_id",
    subTitle: "风险类别",
    dataIndex: "risk_category_config_id",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.check_result",
    subTitle: "检查结果",
    dataIndex: "check_result",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.handle_result",
    subTitle: "处理结果",
    dataIndex: "handle_result",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.quality_officer",
    subTitle: "质量安全员",
    dataIndex: "quality_officer",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.quality_officer",
    subTitle: "质量安全员",
    dataIndex: "quality_officer_name",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.quality_safety_majordomo",
    subTitle: "质量安全总监",
    dataIndex: "quality_safety_majordomo",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.create_by_name",
    subTitle: "创建人",
    dataIndex: "create_by_name",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.create_date_str",
    subTitle: "创建时间",
    dataIndex: "create_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.risk_category_config_id",
    subTitle: "风险类别",
    dataIndex: "risk_category_name",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.control_process_config_id",
    subTitle: "控制环节",
    dataIndex: "control_process_config_id",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.control_process_config_id",
    subTitle: "控制环节",
    dataIndex: "control_process_name",
    width: 160,
    align: "center",
  },
  {
    title: "QualitySafetyDailyCheck.report_date",
    subTitle: "填报时间",
    dataIndex: "report_date",
    width: 160,
    align: "center",
  },
];
