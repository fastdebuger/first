import { Typography } from "antd";

const { Paragraph } = Typography;

export const configColumns = [
  {
    title: "SEOnlineNotification.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 180,
    align: "center",
  },
  {
    title: "SEOnlineNotification.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.province_name",
    subTitle: "省/自治区名称",
    dataIndex: "province_name",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.city_name",
    subTitle: "市名称",
    dataIndex: "city_name",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.account",
    subTitle: "账号",
    dataIndex: "account",
    width: 160,
    align: "center",
    render: (hideTooltipStr: any) => {
      return (
        <Paragraph copyable={{ tooltips: false }}>
          {hideTooltipStr}
        </Paragraph>
      )
    }
  },
  {
    title: "SEOnlineNotification.account_password",
    subTitle: "密码",
    dataIndex: "account_password",
    width: 160,
    align: "center",
    render: (hideTooltipStr: any) => {
      return (
        <Paragraph copyable={{ tooltips: false }}>
          {hideTooltipStr}
        </Paragraph>
      )
    }
  },
  {
    title: "SEOnlineNotification.equipment_category",
    subTitle: "特种设备种类",
    dataIndex: "equipment_category",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.platform_name",
    subTitle: "系统/平台名称",
    dataIndex: "platform_name",
    width: 160,
    align: "center",
  },
  {
    title: "SEOnlineNotification.platform_url",
    subTitle: "网址",
    dataIndex: "platform_url",
    width: 260,
    align: "center",
    render: (hideTooltipStr: any) => {
      return (
        <Paragraph copyable={{ tooltips: false }}>
          {hideTooltipStr}
        </Paragraph>
      )
    }
  },
  {
    title: "SEOnlineNotification.applicant_contact",
    subTitle: "申请人/联系人及联系电话",
    dataIndex: "applicant_contact",
    width: 220,
    align: "center",
  },
  {
    title: "SEOnlineNotification.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 200,
    align: "center",
  },
   {
    title: "SEOnlineNotification.create_date_str",
    subTitle: "录入日期",
    dataIndex: "create_date_str",
    width: 200,
    align: "center",
  },
];
