import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "PipingComponentsPreformance.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_code",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.branch_comp_code",
    subTitle: "分公司",
    dataIndex: "branch_comp_name",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.unit_name",
    subTitle: "单位名称",
    dataIndex: "unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.product_name",
    subTitle: "产品名称",
    dataIndex: "product_name",
    width: 180,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.equipment_type",
    subTitle: "类别、级别",
    dataIndex: "equipment_type",
    width: 180,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.product_code",
    subTitle: "产品编号",
    dataIndex: "product_code",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.currUserCode",
    subTitle: "用户",
    dataIndex: "currUserCode",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.currUserName",
    subTitle: "用户名称",
    dataIndex: "currUserName",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.model",
    subTitle: "规格型号",
    dataIndex: "model",
    width: 200,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.quantity",
    subTitle: "数量（km）",
    dataIndex: "quantity",
    width: 200,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.equipment_material",
    subTitle: "材质",
    dataIndex: "equipment_material",
    width: 160,
    align: "center",
  },

  {
    title: "PipingComponentsPreformance.inspection_report_file",
    subTitle: "上传监检报告",
    dataIndex: "inspection_report_file",
    width: 200,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.inspection_unit_name",
    subTitle: "监检单位名称",
    dataIndex: "inspection_unit_name",
    width: 200,
    align: "center",
  },

  {
    title: "PipingComponentsPreformance.user_unit_name",
    subTitle: "使用单位名称",
    dataIndex: "user_unit_name",
    width: 200,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "PipingComponentsPreformance.wbs_code",
    subTitle: "项目部编码",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },

  {
    title: "PipingComponentsPreformance.audit_status_name",
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
