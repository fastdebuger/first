import ShowFile from "@/components/ShowFile";
import { Tag } from 'antd'

export const configColumns = [
  {
    title: "compinfo.id",
    subTitle: "主键ID",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.dep_name",
    subTitle: "项目部名称",
    dataIndex: "dep_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.up_wbs_name",
    subTitle: "分公司名称",
    dataIndex: "up_wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.unit_leader_name",
    subTitle: "单位领导姓名",
    dataIndex: "unit_leader_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.supervising_leader_name",
    subTitle: "分管领导姓名",
    dataIndex: "supervising_leader_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.office_phone",
    subTitle: "办公电话",
    dataIndex: "office_phone",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.quality_department",
    subTitle: "质量管理部门",
    dataIndex: "quality_department",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.responsible_person_name",
    subTitle: "负责人姓名",
    dataIndex: "responsible_person_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.contact_phone_mobile",
    subTitle: "办公电话手机",
    dataIndex: "contact_phone_mobile",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.accident_level",
    subTitle: "质量事故等级",
    dataIndex: "accident_level",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (Number(text) === 0) {
        return <Tag color='#108ee9'>一般</Tag>;
      }
      if (Number(text) === 1) {
        return <Tag color='#87d068'>较大</Tag>;
      }
      if (Number(text) === 2) {
        return <Tag color='#2db7f5'>重大</Tag>;
      }
      if (Number(text) === 3) {
        return <Tag color='#f50'>特大</Tag>;
      }
      return text
    }
  },
  {
    title: "compinfo.accident_level",
    subTitle: "质量事故等级",
    dataIndex: "accident_level_str",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (text === '一般') {
        return <Tag color='#108ee9'>一般</Tag>;
      }
      if (text === '较大') {
        return <Tag color='#87d068'>较大</Tag>;
      }
      if (text === '重大') {
        return <Tag color='#2db7f5'>重大</Tag>;
      }
      if (text === '特大') {
        return <Tag color='#f50'>特大</Tag>;
      }
      if (text === '无') {
        return <Tag color='#999'>无</Tag>;
      }
      return text
    }
  },
  {
    title: "compinfo.accident_count",
    subTitle: "质量事故次数",
    dataIndex: "accident_count",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.total_direct_loss",
    subTitle: "累计直接经济损失万元",
    dataIndex: "total_direct_loss",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.supervision_level",
    subTitle: "监督抽查级别",
    dataIndex: "supervision_level",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (Number(text) === 0) {
        return <Tag color='#108ee9'>国家</Tag>;
      }
      if (Number(text) === 1) {
        return <Tag color='#87d068'>省/市/自治区</Tag>;
      }
      if (Number(text) === 2) {
        return <Tag color='#2db7f5'>集团公司</Tag>;
      }
      return text
    }
  },
  {
    title: "compinfo.supervision_level",
    subTitle: "监督抽查级别",
    dataIndex: "supervision_level_str",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (text === '国家') {
        return <Tag color='#108ee9'>国家</Tag>;
      }
      if (text === '省/市/自治区') {
        return <Tag color='#87d068'>省/市/自治区</Tag>;
      }
      if (text === '集团公司') {
        return <Tag color='#2db7f5'>集团公司</Tag>;
      }
      if (text === '无') {
        return <Tag color='#999'>无</Tag>;
      }
      return text
    }
  },
  {
    title: "compinfo.nc_batches",
    subTitle: "不合格批次(国家)",
    dataIndex: "nc_batches",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.nc_batches1",
    subTitle: "不合格批次(省/市/自治区)",
    dataIndex: "nc_batches1",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.nc_batches2",
    subTitle: "不合格批次(集团公司)",
    dataIndex: "nc_batches2",
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
    title: "compinfo.file_url",
    subTitle: "附件",
    dataIndex: "file_url",
    width: 160,
    align: "center",
    render: (text: any) => <ShowFile text={text} />
  },
];
