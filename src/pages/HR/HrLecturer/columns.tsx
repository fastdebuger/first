import { Tag } from "antd";

export const configColumns = [
  {
    title: "compinfo.id",
    subTitle: "id",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.lecturer.user_code",
    subTitle: "讲师编号",
    dataIndex: "user_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.lecturer.user_name",
    subTitle: "讲师名称",
    dataIndex: "user_name",
    width: 160,
    align: "center",
  },

  {
    title: "compinfo.lecturer_type",
    subTitle: "讲师类型",
    dataIndex: "lecturer_type",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.lecturer_type",
    subTitle: "讲师类型",
    dataIndex: "lecturer_type_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.lecturer_level",
    subTitle: "讲师级别",
    dataIndex: "lecturer_level",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.lecturer_level",
    subTitle: "讲师级别",
    dataIndex: "lecturer_level_str",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.is_use",
    subTitle: "讲师状态(0 禁用，1 启用)",
    dataIndex: "is_use",
    width: 160,
    align: "center",
    render: (h, params) => {
      if (!h) {
        return (
          <Tag color={'orange'}>禁用</Tag>
        )
      }
      if(Number(h) === 0) {
        return (
          <Tag color={'orange'}>禁用</Tag>
        )
      }
      if(Number(h) === 1) {
        return (
          <Tag color={'blue'}>启用</Tag>
        )
      }
      return (
        <Tag color={'orange'}>禁用</Tag>
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
