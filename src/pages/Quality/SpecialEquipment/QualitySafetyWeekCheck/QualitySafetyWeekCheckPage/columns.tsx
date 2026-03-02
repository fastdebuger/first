import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "qualitySafetyWeekCheck.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.this_week",
    subTitle: "第几周",
    dataIndex: "this_week",
    width: 160,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.special_equip_type",
    subTitle: "特种设备类型",
    dataIndex: "special_equip_type",
    width: 20,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.last_week_question",
    subTitle: "上周(质量)安全风险隐患问题整改核实情况",
    dataIndex: "last_week_question",
    width: 260,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.this_week_question",
    subTitle: "本周主要质量安全风险隐患和整改情况",
    dataIndex: "this_week_question",
    width: 260,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.this_week_evaluate",
    subTitle: "本周质量安全管理情况评价",
    dataIndex: "this_week_evaluate",
    width: 240,
    align: "center",
  },
  {
    title: "qualitySafetyWeekCheck.next_week_task",
    subTitle: "下周工作重点",
    dataIndex: "next_week_task",
    width: 220,
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
    title: "QualitySafetyDailyCheck.audit_remark",
    subTitle: "质量安全管理员审批意见",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
];
