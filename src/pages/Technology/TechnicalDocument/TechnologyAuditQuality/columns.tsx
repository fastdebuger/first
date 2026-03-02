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
    title: "compinfo.out_info_id",
    subTitle: "分包合同id",
    dataIndex: "out_info_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.dep_code",
    subTitle: "项目经理部(项目部)",
    dataIndex: "dep_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.type_code",
    subTitle: "分类(0:施工组织设计审批,1:质量计划审批,2:施工技术方案审批表)",
    dataIndex: "type_code",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.base_data_name",
    subTitle: "名称",
    dataIndex: "base_data_name",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.level",
    subTitle: "级别(0:一般,1:重大、危大)",
    dataIndex: "level",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.data_ts",
    subTitle: "重大、危大 风险时间",
    dataIndex: "data_ts",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.hazardAndReport",
    subTitle: "危害因素辨识与风险评价报告",
    dataIndex: "file_url1",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.projectDepartmentComments",
    subTitle: "项目经理部审核意见",
    dataIndex: "file_url2",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.others",
    subTitle: "其他",
    dataIndex: "file_url3",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.file_url4",
    subTitle: "文件路径",
    dataIndex: "file_url4",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.approval_process_id",
    subTitle: "审批流程ID",
    dataIndex: "approval_process_id",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.status",
    subTitle: "审批状态（-1:审批驳回,0-未审批，1-审批中，2-审批完成）",
    dataIndex: "status",
    width: 160,
    align: "center",
  },
  {
    title: "compinfo.approval_date",
    subTitle: "审批时间",
    dataIndex: "approval_date",
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
    title: "项目经理部",
    subTitle: "项目经理部",
    dataIndex: "out_info_dep_name",
    width: 160,
    align: "center",
  },
  {
    title: "工程合同额",
    subTitle: "工程合同额",
    dataIndex: "contract_say_price",
    width: 160,
    align: "center",
  },
  {
    title: "工程合同额范围",
    subTitle: "工程合同额范围",
    dataIndex: "contract_say_price_str",
    width: 160,
    align: "center",
    render: (_: any, record: any) => {
      if (record.contract_say_price >= 100000000) {
        return <Tag color="red">10000万以上</Tag>
      } else if (record.contract_say_price >= 50000000 && record.contract_say_price < 100000000) {
        return <Tag color="yellow">5000万到10000万</Tag>
      } else {
        return <Tag color="green">5000万以下</Tag>
      }
    }
  },
  {
    title: "工程名称",
    subTitle: "工程名称",
    dataIndex: "contract_out_name",
    width: 160,
    align: "center",
  },
  {
    title: "审批状态",
    subTitle: "审批状态",
    dataIndex: "status_str",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (text === '审批中') {
        return <Tag color="blue">审批中</Tag>
      } else if (text === '审批完成') {
        return <Tag color="green">审批完成</Tag>
      } else if (text === '审批驳回') {
        return <Tag color="red">审批驳回</Tag>
      } else {
        return <Tag color="gray">未审批</Tag>
      }
    }
  },

];




