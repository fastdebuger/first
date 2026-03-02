import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "PressurePipingPreformance.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_code",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_name",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.project_name",
    subTitle: "工程项目",
    dataIndex: "project_name",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.completion_date",
    subTitle: "竣工日期",
    dataIndex: "completion_date",
    width: 180,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.completion_date",
    subTitle: "竣工日期",
    dataIndex: "completion_date_str",
    width: 180,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.currDepCode",
    subTitle: "当前项目部",
    dataIndex: "currDepCode",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.currUserCode",
    subTitle: "用户",
    dataIndex: "currUserCode",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.currUserName",
    subTitle: "用户名称",
    dataIndex: "currUserName",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.design_pressure",
    subTitle: "压力（MPa）",
    dataIndex: "design_pressure",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.design_temperature",
    subTitle: "温度（℃）",
    dataIndex: "design_temperature",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.equipment_material",
    subTitle: "主要材质",
    dataIndex: "equipment_material",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.equipment_type",
    subTitle: "类别、级别",
    dataIndex: "equipment_type",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.inspection_report_file",
    subTitle: "上传监检报告",
    dataIndex: "inspection_report_file",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.inspection_unit_name",
    subTitle: "监检单位名称",
    dataIndex: "inspection_unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.quantity",
    subTitle: "数量（km）",
    dataIndex: "quantity",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.user_unit_name",
    subTitle: "使用单位名称",
    dataIndex: "user_unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.work_medium",
    subTitle: "介质",
    dataIndex: "work_medium",
    width: 160,
    align: "center",
  },
  {
    title: "PressurePipingPreformance.audit_status_name",
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
    title: "PressurePipingPreformance.diameter",
    subTitle: "直径（mm）",
    dataIndex: "diameter",
    width: 160,
    align: "center",
  },
];
