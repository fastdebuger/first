import { Tag } from "antd";

export const configColumns = [
  {
    title: "compinfo.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.branch_comp_code",
    subTitle: "单位",
    dataIndex: "branch_comp_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.currUserCode",
    subTitle: "当前项目部编码",
    dataIndex: "currUserCode",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.currUserName",
    subTitle: "时区",
    dataIndex: "currUserName",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.examine_wbs_code",
    subTitle: "检查单位",
    dataIndex: "examine_wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.examine_wbs_code",
    subTitle: "检查单位",
    dataIndex: "examine_wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.hazard_level",
    subTitle: "隐患等级",// 1-一般事故隐患 2-较大事故隐患 3-重大事故隐患
    dataIndex: "hazard_level",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.problem_description",
    subTitle: "问题描述",
    dataIndex: "problem_description",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.project_name",
    subTitle: "工程名称",
    dataIndex: "project_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.question_type",
    subTitle: "问题分类",
    dataIndex: "question_type",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.hazard_level",
    subTitle: "隐患等级",
    dataIndex: "hazard_level_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.question_type",
    subTitle: "问题分类",
    dataIndex: "question_type_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.report_date",
    subTitle: "填报日期",
    dataIndex: "report_date",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.report_date",
    subTitle: "填报日期",
    dataIndex: "report_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.safety_inspection_id",
    subTitle: "质量安全监督检查",
    dataIndex: "safety_inspection_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_wbs_code",
    subTitle: "推送项目部",
    dataIndex: "push_wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_wbs_code",
    subTitle: "推送项目部",
    dataIndex: "push_wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.oneItems",
    subTitle: "项目经理负责人",
    dataIndex: "oneItems",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.twoItems",
    subTitle: "项目主管领导负责人",
    dataIndex: "twoItems",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.threeItems",
    subTitle: "管理人员",
    dataIndex: "threeItems",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.main_workpoints",
    subTitle: "人员等级",
    dataIndex: "main_workpoints",
    width: 160,
    align: "center",
    render: (text: any, record) => {
      const personnelType = String(text)
      switch (personnelType) {
        case "1":
          return record.question_type_name === '作业' ? "作业队负责人" : "项目经理";
        case "2":
          return record.question_type_name === '作业' ? "班组长" : "项目主管领导";
        case "3":
          return record.question_type_name === '作业' ? "作业人员" : "管理人员";
        default:
          return "-";
      }
    }
  },
  {
    title: "compinfo.main_workpoints",
    subTitle: "人员等级",
    dataIndex: "main_workpoints_str",
    width: 160,
    align: "center"
  },
  {
    title: "compinfo.total_score_fraction",
    subTitle: "分数",
    dataIndex: "total_score",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.user_code_correlation",
    subTitle: "相关人员",
    dataIndex: "user_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.user_code_correlation",
    subTitle: "相关人员",
    dataIndex: "user_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_status",
    subTitle: "审计状态",
    dataIndex: "audit_status",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.audit_status_name",
    subTitle: "审计状态名称",
    dataIndex: "audit_status_name",
    width: 160,
    align: "center",
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
];
