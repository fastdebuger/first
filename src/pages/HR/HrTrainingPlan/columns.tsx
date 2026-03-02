import PublishStatus from "@/pages/HR/Common/PublishStatus";
import ApprovalStatus from "../Common/ApprovalStatus";

export const configColumns = [
  {
    title: "compinfo.id",
    subTitle: "id",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.wbs_code",
    subTitle: "wbsCode",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.wbs_name",
    subTitle: "Wbs名称",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.prop_key",
    subTitle: "层级（branchComp：公司级，subComp：分公司，dep：项目部）",
    dataIndex: "prop_key",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.year",
    subTitle: "所属年份",
    dataIndex: "year",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.start_date",
    subTitle: "启动时间",
    dataIndex: "start_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.plan_name",
    subTitle: "培训计划名称",
    dataIndex: "plan_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.master_organizer",
    subTitle: "主办单位",
    dataIndex: "master_organizer",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.master_organizer",
    subTitle: "主办单位",
    dataIndex: "master_organizer_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.plan_total_persons",
    subTitle: "计划总人数",
    dataIndex: "plan_total_persons",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.publish_status",
    subTitle: "发布状态",
    dataIndex: "publish_status",
    width: 160,
    align: "center",
    render: (h, params) => {
      return (
        <PublishStatus text={h}/>
      )
    }
  },
  {
    title: "compinfo.plan_type",
    subTitle: "培训类型",
    dataIndex: "plan_type",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.plan_type",
    subTitle: "培训类型",
    dataIndex: "plan_type_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.approval_process_id",
    subTitle: "审批流程ID",
    dataIndex: "approval_process_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.approval_status",
    subTitle: "审批状态（-1:审批驳回,0-未审批，1-审批中，2-审批完成）",
    dataIndex: "approval_status",
    width: 160,
    align: "center",
    render: (h, params) => {
      return (
        <ApprovalStatus text={h}/>
      )
    }
  },
  {
    title: "compinfo.approval_date",
    subTitle: "审批时间",
    dataIndex: "approval_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_ts",
    subTitle: "创建时间",
    dataIndex: "create_ts",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_tz",
    subTitle: "创建时区",
    dataIndex: "create_tz",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_user_code",
    subTitle: "创建人编码",
    dataIndex: "create_user_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.create_user_name",
    subTitle: "创建人名称",
    dataIndex: "create_user_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.modify_ts",
    subTitle: "修改时间",
    dataIndex: "modify_ts",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.modify_tz",
    subTitle: "修改时区",
    dataIndex: "modify_tz",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.modify_user_code",
    subTitle: "修改人编码",
    dataIndex: "modify_user_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.modify_user_name",
    subTitle: "修改人名称",
    dataIndex: "modify_user_name",
    width: 160,
    align: "center",
  },
];
