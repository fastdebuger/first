import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "SafetyRiskControl.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.main_id",
    subTitle: "主表编号2",
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
    title: "SafetyRiskControl.risk_category_config_id",
    subTitle: "风险类别",
    dataIndex: "risk_category_config_id",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.control_process_config_id",
    subTitle: "控制环节",
    dataIndex: "control_process_name",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.risk_category_config_id",
    subTitle: "风险类别",
    dataIndex: "risk_category_name",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.control_process_config_id",
    subTitle: "控制环节",
    dataIndex: "control_process_config_id",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.principal",
    subTitle: "主要负责人",
    dataIndex: "principal",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.quality_safety_majordomo",
    subTitle: "质量安全总监",
    dataIndex: "quality_safety_majordomo",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.quality_safety_officer",
    subTitle: "质量安全员",
    dataIndex: "quality_safety_officer",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.create_by_name",
    subTitle: "创建人",
    dataIndex: "create_by_name",
    width: 160,
    align: "center",
  },
  {
    title: "SafetyRiskControl.create_date_str",
    subTitle: "创建时间",
    dataIndex: "create_date_str",
    width: 160,
    align: "center",
  },

];
