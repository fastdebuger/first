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
      title: "compinfo.title",
      subTitle: "公告标题",
      dataIndex: "title",
      width: 360,
      align: "center",
    },
    {
      title: "compinfo.content",
      subTitle: "公告内容",
      dataIndex: "content",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.is_send",
      subTitle: "发布状态",
      dataIndex: "is_send",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.is_send",
      subTitle: "发布状态",
      dataIndex: "is_send_str",
      width: 160,
      align: "center",
      render: (h, params) => {
        return (
          <Tag color={h === '已发布' ? 'blue' : 'orange'}>{h}</Tag>
        )
      }
    },
    {
      title: "compinfo.file_url",
      subTitle: "附件",
      dataIndex: "file_url",
      width: 160,
      align: "center",
    },
    // 发送范围类型(1:全体,2:部门,3:角色)
    {
      title: "compinfo.send_range_type",
      subTitle: "发送范围类型",
      dataIndex: "send_range_type",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.send_range_value",
      subTitle: " 发送范围值",
      dataIndex: "send_range_value",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.message_type",
      subTitle: "消息类型",
      dataIndex: "message_type",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.sender_code",
      subTitle: "发送人编码",
      dataIndex: "sender_code",
      width: 160,
      align: "center",
    },
    {
      title: "compinfo.message.sender_name",
      subTitle: "发送人名称",
      dataIndex: "sender_name",
      width: 160,
      align: "center",
    },

    {
      title: "compinfo.send_time",
      subTitle: "发送时间",
      dataIndex: "send_time",
      width: 160,
      align: "center",
    },

  {
    title: "compinfo.send_time",
    subTitle: "发送时间",
    dataIndex: "send_time_str",
    width: 160,
    align: "center",
  },

  {
    title: "compinfo.create_time",
    subTitle: "创建时间",
    dataIndex: "create_ts_str",
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
  ];
