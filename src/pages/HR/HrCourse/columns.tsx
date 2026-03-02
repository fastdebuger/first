import { Badge, Image } from "antd";
import PublicStatus from "@/pages/HR/Common/PublicStatus";

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
    title: "compinfo.prop_key",
    subTitle: "层级（branchComp：公司级，subComp：分公司，dep：项目部）",
    dataIndex: "prop_key",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_name",
    subTitle: "课程名称",
    dataIndex: "course_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_content",
    subTitle: "课程内容(视频url)",
    dataIndex: "course_content",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_cover",
    subTitle: "课程封面",
    dataIndex: "course_cover",
    width: 120,
    align: "center",
    render: (h, params) => {
      if (!h) {
        return '-'
      }
      return (
        <Image
          width={22}
          src={h}
        />
      )
    }
  },
  {
    title: "compinfo.course_intro",
    subTitle: "课程简介",
    dataIndex: "course_intro",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_category",
    subTitle: "课程分类(关联课程树）",
    dataIndex: "course_category",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_category",
    subTitle: "课程分类",
    dataIndex: "tree_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_category",
    subTitle: "课程分类",
    dataIndex: "tree_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_tag",
    subTitle: "课程标签",
    dataIndex: "course_tag",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.course_tag",
    subTitle: "课程标签",
    dataIndex: "course_tag_str",
    width: 160,
    align: "center",
    render: (h: string, params: any) => {
      return (
        <Badge color={params.course_tag_color} text={params['course_tag_str']} />
      )
    }
  },
  {
    title: "compinfo.course_status",
    subTitle: "发布状态",
    dataIndex: "course_status",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.is_public",
    subTitle: "是否公开",
    dataIndex: "is_public",
    width: 160,
    align: "center",
    render: (h, params) => {
      return (
        <PublicStatus text={h}/>
      )
    }
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
