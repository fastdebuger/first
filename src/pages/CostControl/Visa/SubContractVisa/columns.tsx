import { SelectiveTypeMapper } from "@/typings/rc-util";
import { Tag } from "antd";
import { ReactNode } from "react";

type AllDataIndexes =
  | "RowNumber"
  | "id"
  | "branch_comp_name"
  | "branch_comp_code"
  | "dep_name"
  | "dep_code"
  | "contract_name"
  | "contract_no"
  | "contract_out_name"
  | "contract_sign_date_str"
  | "contract_start_date_str"
  | "contract_end_date_str"
  | "contract_say_price"
  | "visa_code"
  | "visa_major"
  | "visa_content"
  | "visa_budget_amount"
  | "visa_date"
  | "visa_date_str"
  | "file_url"
  | "approval_schedule"
  | "approval_schedule_str"
  ;

type ColumnConfig<T extends string> = {
  title: string;
  subTitle: string;
  dataIndex: T;
  width: number;
  align: "center";
  render?: (ReactNode: ReactNode) => ReactNode
};

type AllColumns = {
  [K in AllDataIndexes]: ColumnConfig<K>;
}[AllDataIndexes];

export const configColumns: AllColumns[] = [
  // 表头
  {
    "title": "contract.id",
    "subTitle": "序号",
    "dataIndex": "RowNumber",
    "width": 160,
    "align": "center"
  },
  {
    "title": "contract.id",
    "subTitle": "序号",
    "dataIndex": "id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.branch_comp_name",
    "subTitle": "分公司名称",
    "dataIndex": "branch_comp_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.branch_comp_code",
    "subTitle": "分公司编码",
    "dataIndex": "branch_comp_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.dep_name",
    "subTitle": "项目部名称",
    "dataIndex": "dep_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.dep_code",
    "subTitle": "项目部编码",
    "dataIndex": "dep_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "SubContractVisa.contract_name",
    "subTitle": "对应主合同工程名称",
    "dataIndex": "contract_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "SubContractVisa.contract_no",
    "subTitle": "服务采购订单编码",
    "dataIndex": "contract_no",
    "width": 240,
    "align": "center"
  },
  {
    "title": "SubContractVisa.contract_out_name",
    "subTitle": "分包合同名称",
    "dataIndex": "contract_out_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.contract_sign_date_str",
    "subTitle": "合同签订日期",
    "dataIndex": "contract_sign_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.contract_start_date_str",
    "subTitle": "开工日期",
    "dataIndex": "contract_start_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.contract_end_date_str",
    "subTitle": "竣工日期",
    "dataIndex": "contract_end_date_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.contract_say_price",
    "subTitle": "合同金额(元)",
    "dataIndex": "contract_say_price",
    "width": 200,
    "align": "center"
  },
  // 表体
  {
    "title": "costControl.visa_code",
    "subTitle": "签证编号",
    "dataIndex": "visa_code",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_major",
    "subTitle": "专业",
    "dataIndex": "visa_major",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_content",
    "subTitle": "签证内容",
    "dataIndex": "visa_content",
    "width": 200,
    "align": "center"
  },
  {
    "title": "SubContractVisa.visa_budget_amount",
    "subTitle": "签证上报金额",
    "dataIndex": "visa_budget_amount",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_date",
    "subTitle": "签证日期'",
    "dataIndex": "visa_date",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_date",
    "subTitle": "签证日期'",
    "dataIndex": "visa_date_str",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.file_url",
    "subTitle": "附件",
    "dataIndex": "file_url",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.approval_schedule",
    "subTitle": "审批状态",
    "dataIndex": "approval_schedule",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.approval_schedule",
    "subTitle": "审批状态",
    "dataIndex": "approval_schedule_str",
    "width": 200,
    "align": "center",
    render(text: ReactNode) {
      if (text === '审批完成') {
        return <Tag color={'success'}>{text}</Tag>
      } else if (text === '驳回') {
        return <Tag color={'error'}>{text}</Tag>
      } else if (text === '未审批') {
        return <Tag color={'warning'}>{text}</Tag>
      } else if (text === '审批中') {
        return <Tag color={'processing'}>{text}</Tag>
      } else {
        return <Tag color={'default'}>{'暂无进度款'}</Tag>
      }
    },
  },
];

export type DataIndexKeys = (typeof configColumns)[number]['dataIndex'];

type NumberOverrides = {
  RowNumber: number;
  id: number;
  contract_say_price: number;
  visa_budget_amount: number;
};

export type DataIndexMap = SelectiveTypeMapper<
  DataIndexKeys,
  NumberOverrides,
  string
>;
