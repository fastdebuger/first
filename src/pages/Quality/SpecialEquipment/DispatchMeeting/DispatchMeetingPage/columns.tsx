import { AUDIT_STATUS_NAME } from "@/common/common";
import { Tag } from "antd";

export const configColumns = [
  {
    title: "DispatchMeeting.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_place",
    subTitle: "会议地点",
    dataIndex: "meeting_place",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_date",
    subTitle: "会议时间",
    dataIndex: "meeting_date",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_moderator",
    subTitle: "会议主持人",
    dataIndex: "meeting_moderator",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_recorder",
    subTitle: "会议记录人",
    dataIndex: "meeting_recorder",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.conferee",
    subTitle: "参会人员",
    dataIndex: "conferee",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content1",
    subTitle: "本月巡查主要问题",
    dataIndex: "meeting_content1",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content2",
    subTitle: "本月整改方案落实情况",
    dataIndex: "meeting_content2",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content3",
    subTitle: "本月还未解决的问题",
    dataIndex: "meeting_content3",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content4",
    subTitle: "月调度相关内容(如制度修订、人员岗位职责变化等)",
    dataIndex: "meeting_content4",
    width: 400,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content5",
    subTitle: "其他（质量）安全事项",
    dataIndex: "meeting_content5",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.meeting_content6",
    subTitle: "会议研究采取的措施",
    dataIndex: "meeting_content6",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.special_equip_type",
    subTitle: "特种设备类型",
    dataIndex: "special_equip_type",
    width: 200,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.audit_status_name",
    subTitle: "审批状态",
    dataIndex: "audit_status_name",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (AUDIT_STATUS_NAME[text]) {
        return <Tag color={AUDIT_STATUS_NAME[text]}>{text}</Tag>
      } else {
        return <Tag color="orange">{text || '暂无审批'}</Tag>
      }
    }
  },
  {
    title: "DispatchMeeting.create_date_str",
    subTitle: "创建日期",
    dataIndex: "create_date_str",
    width: 200,
    align: "center",
  },
  {
    title: "DispatchMeeting.last_month_str",
    subTitle: "月份",
    dataIndex: "last_month_str",
    width: 200,
    align: "center",
    render: (_, record) => {
      return record.create_date_str ? record.create_date_str.split("-")[1] : "-"
    }
  },
  {
    title: "PVQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
];
