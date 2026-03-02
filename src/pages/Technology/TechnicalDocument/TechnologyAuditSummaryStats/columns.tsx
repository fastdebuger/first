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
    title: "工程分公司/指挥部名称",
    subTitle: "工程分公司/指挥部名称",
    dataIndex: "up_wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "项目名称",
    subTitle: "项目名称",
    dataIndex: "dep_name",
    width: 160,
    align: "center",
  },
  {
    title: "工程名称",
    subTitle: "工程名称",
    dataIndex: "contract_out_name",
    width: 160,
    align: "center",
  },
  {
    title: "项目总结名称",
    subTitle: "项目总结名称",
    dataIndex: "base_data_name",
    width: 200,
    align: "center",
  },
  {
    title: "compinfo.approval_date",
    subTitle: "审批时间",
    dataIndex: "approval_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "合同额",
    subTitle: "合同额",
    dataIndex: "contract_say_price_str",
    width: 180,
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
];
