import PublishStatus from "@/pages/HR/Common/PublishStatus";

export const configColumns = [
  {
    title: "compinfo.id",
    subTitle: "自增主键",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.year",
    subTitle: "年",
    dataIndex: "year",
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
    title: "compinfo.course_id",
    subTitle: "课程id",
    dataIndex: "course_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.study_duration",
    subTitle: "学习时长(小时)",
    dataIndex: "study_duration",
    width: 160,
    align: "center",
    render: (text, record) => {
      const num = Number(text || 0);
      return (num / 3600).toFixed(1)
    }
  },
  {
    title: "compinfo.study_duration",
    subTitle: "学习时长(小时)",
    dataIndex: "study_duration_hour",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_range_type",
    subTitle: "推送范围类型",
    dataIndex: "push_range_type",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_range_type",
    subTitle: "推送范围类型",
    dataIndex: "push_range_type_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_range_value",
    subTitle: "推送范围值",
    dataIndex: "push_range_value",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_range_value",
    subTitle: "推送范围值",
    dataIndex: "push_range_name",
    width: 160,
    align: "center",
    render: (text, record) => {
      return (
        <span>
          {text}({record.push_range_value})
        </span>
      )
    }
  },
  //  0-未推送1-已推送
  {
    title: "compinfo.is_push",
    subTitle: "状态",
    dataIndex: "is_push",
    width: 160,
    align: "center",
    render: (h: any, res: any) => {
      return (
        <PublishStatus text={h}/>
      )
    }
  },
  {
    title: "compinfo.pusher_code",
    subTitle: "推送人编码",
    dataIndex: "pusher_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.pusher_name",
    subTitle: "推送人名称",
    dataIndex: "pusher_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.push_time",
    subTitle: "推送时间",
    dataIndex: "push_time",
    width: 160,
    align: "center",
  },
];
