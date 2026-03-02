import { Tag } from "antd";

export const configColumns = [
    {
      title: "compinfo.id",
      subTitle: "主键ID",
      dataIndex: "id",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.project_in_progress_name",
      subTitle: "在建项目名称",
      dataIndex: "project_in_progress_name",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.project_in_progress_count",
      subTitle: "在建项目数量",
      dataIndex: "project_in_progress_count",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.mechanical_completion_count",
      subTitle: "中交项目数量",
      dataIndex: "mechanical_completion_count",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.production_project_name",
      subTitle: "投产项目名称",
      dataIndex: "production_project_name",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.production_project_count",
      subTitle: "投产项目数量",
      dataIndex: "production_project_count",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.overall_quality_status",
      subTitle: "质量运行整体情况描述",
      dataIndex: "overall_quality_status",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.major_quality_activities",
      subTitle: "单位开展的质量活动",
      dataIndex: "major_quality_activities",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.award_info",
      subTitle: "获奖情况说明",
      dataIndex: "award_info",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.dep_code",
      subTitle: "dep_code",
      dataIndex: "dep_code",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.form_maker_code",
      subTitle: "制单人编码",
      dataIndex: "form_maker_code",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.form_maker_name",
      subTitle: "制单人名称",
      dataIndex: "form_maker_name",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.form_make_time",
      subTitle: "制单时间",
      dataIndex: "form_make_time",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.form_make_time",
      subTitle: "制单时间",
      dataIndex: "form_make_time_str",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.form_make_tz",
      subTitle: "制单时区",
      dataIndex: "form_make_tz",
      width: 160,
      align: "center",
    },
    {
      title: "项目类型",
      subTitle: "项目类型",
      dataIndex: "type_code",
      width: 160,
      align: "center",
    },
    {
      title: "项目类型",
      subTitle: "项目类型",
      dataIndex: "type_code_str",
      width: 160,
      align: "center",
      render(text: any) {
        if(text === '在建'){
          return <Tag color="blue">在建</Tag>;
        }else if(text === '中交'){
          return <Tag color="green">中交</Tag>;
        }else if(text === '投产'){
          return <Tag color="purple">投产</Tag>;
        }
      }
    },

  ];
