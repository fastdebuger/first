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
    title: "compinfo.courseware_name",
    subTitle: "课件名称",
    dataIndex: "courseware_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.courseware_url",
    subTitle: "课件地址",
    dataIndex: "courseware_url",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.courseware_type",
    subTitle: "课件类型",
    dataIndex: "courseware_type",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.is_public",
    subTitle: "是否公开",
    dataIndex: "is_public",
    width: 160,
    align: "center",
    render: (h: any, res: any) => {
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
