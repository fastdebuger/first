import { Tag } from "antd";

export const configColumns = [
  {
    title: "compinfo.tbl_quality_project_quality_overview",
    subTitle: "工程产品总体质量概述",
    dataIndex: "tbl_quality_project_quality_overview",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_produced_products",
    subTitle: "自产产品",
    dataIndex: "tbl_quality_produced_products",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_tech_service_quality",
    subTitle: "技术服务质量情况表",
    dataIndex: "tbl_quality_tech_service_quality",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_system_operation",
    subTitle: "质量体系运行情况表",
    dataIndex: "tbl_quality_system_operation",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_inspection",
    subTitle: "质量大检查及专项检查情况",
    dataIndex: "tbl_quality_inspection",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_excellence_activity",
    subTitle: "创优活动开展情况",
    dataIndex: "tbl_quality_excellence_activity",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_qc_activity",
    subTitle: "QC小组活动开展情况",
    dataIndex: "tbl_quality_qc_activity",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_other_quality_statistics",
    subTitle: "其它质量数据统计情况",
    dataIndex: "tbl_quality_other_quality_statistics",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_statistics_analysis",
    subTitle: "质量统计数据分析情况",
    dataIndex: "tbl_quality_statistics_analysis",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_serious_nonconformities",
    subTitle: "本月严重不合格品情况表",
    dataIndex: "tbl_quality_serious_nonconformities",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_management_plan",
    subTitle: "工作安排及建议",
    dataIndex: "tbl_quality_management_plan",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_experience",
    subTitle: "质量经验分享",
    dataIndex: "tbl_quality_experience",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_nc_corrective_action",
    subTitle: "不合格项纠正措施记录(单表、每月固定填报)",
    dataIndex: "tbl_quality_nc_corrective_action",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_inspection_summary_h",
    subTitle: "质量大（专项）检查主要不合格项汇总情况分布（主表）",
    dataIndex: "tbl_quality_inspection_summary_h",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_monthly_weslding_pass_rate_h",
    subTitle: "月度焊接一次合格率统计表",
    dataIndex: "tbl_quality_monthly_welding_pass_rate_h",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_monthly_welding_pass_rate_b",
    subTitle: "月度焊接一次合格率统计表",
    dataIndex: "tbl_quality_monthly_welding_pass_rate_b",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_accident_summary",
    subTitle: "质量事故汇总表",
    dataIndex: "tbl_quality_accident_summary",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.tbl_quality_monthly_quality_statistics",
    subTitle: "月份质量数据统计表",
    dataIndex: "tbl_quality_monthly_quality_statistics",
    width: 160,
    align: "center",
    render(text:number){
      return Number(text) > 0 ? <Tag color="green">已填报</Tag> : <Tag color="red">未填报</Tag>
    }
  },
  {
    title: "compinfo.wbsName",
    subTitle: "项目部名称",
    dataIndex: "dep_name",
    width: 160,
    align: "center",
  },
];
