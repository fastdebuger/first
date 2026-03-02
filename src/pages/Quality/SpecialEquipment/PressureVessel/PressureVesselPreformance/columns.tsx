import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "pressureVesselPreformance.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_code",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_name",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.project_name",
    subTitle: "工程项目",
    dataIndex: "project_name",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.completion_date",
    subTitle: "出厂/竣工日期",
    dataIndex: "completion_date",
    width: 180,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.completion_date",
    subTitle: "出厂/竣工日期",
    dataIndex: "completion_date_str",
    width: 180,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.currDepCode",
    subTitle: "当前项目部",
    dataIndex: "currDepCode",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.currUserCode",
    subTitle: "用户",
    dataIndex: "currUserCode",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.currUserName",
    subTitle: "用户名称",
    dataIndex: "currUserName",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.design_pressure",
    subTitle: "设计压力（MPa）",
    dataIndex: "design_pressure",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.design_temperature",
    subTitle: "设计温度（℃）",
    dataIndex: "design_temperature",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.equipment_material",
    subTitle: "设备材质",
    dataIndex: "equipment_material",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.equipment_name",
    subTitle: "设备名称",
    dataIndex: "equipment_name",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.equipment_specification",
    subTitle: "设备规格（HDL mm / m³）",
    dataIndex: "equipment_specification",
    width: 230,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.equipment_type",
    subTitle: "设备类别",
    dataIndex: "equipment_type",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.inspection_report_file",
    subTitle: "上传监检报告",
    dataIndex: "inspection_report_file",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.inspection_unit_name",
    subTitle: "监检单位名称",
    dataIndex: "inspection_unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.product_device_no",
    subTitle: "产品编号/设备位号",
    dataIndex: "product_device_no",
    width: 230,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.quantity",
    subTitle: "数量",
    dataIndex: "quantity",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.single_weight",
    subTitle: "设备单体重量（kg）",
    dataIndex: "single_weight",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.user_unit_name",
    subTitle: "使用单位名称",
    dataIndex: "user_unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.work_medium",
    subTitle: "工作介质",
    dataIndex: "work_medium",
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
];
