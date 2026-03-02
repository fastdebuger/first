
type ColumnType = {
  "title": string,
  "subTitle": string,
  "dataIndex": string,
  "width": number,
  "align": string,
}

export const configColumns: ColumnType[] = [
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
    "title": "costControl.contract_name",
    "subTitle": "工程名称",
    "dataIndex": "contract_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.wbs_code_dep",
    "subTitle": "WBS项目定义",
    "dataIndex": "wbs_code",
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
    "title": "costControl.visa_budget_amount",
    "subTitle": "签证预算金额",
    "dataIndex": "visa_budget_amount",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_review_amount",
    "subTitle": "签证审核金额",
    "dataIndex": "visa_review_amount",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_prepared_by",
    "subTitle": "签证编制人",
    "dataIndex": "visa_prepared_by",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_agent_by",
    "subTitle": "签证经办人",
    "dataIndex": "visa_agent_by",
    "width": 200,
    "align": "center"
  },

  {
    "title": "costControl.visa_prepared_by",
    "subTitle": "签证编制人",
    "dataIndex": "visa_prepared_by_str",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_agent_by",
    "subTitle": "签证经办人",
    "dataIndex": "visa_agent_by_str",
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
    "title": "costControl.file_url",
    "subTitle": "附件",
    "dataIndex": "file_url",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.visa_date",
    "subTitle": "签证日期",
    "dataIndex": "visa_date_str",
    "width": 200,
    "align": "center"
  },
  {
    "title": "编报日期",
    "subTitle": "编报日期",
    "dataIndex": "reporting_date",
    "width": 200,
    "align": "center"
  },
  {
    "title": "编报日期",
    "subTitle": "编报日期",
    "dataIndex": "reporting_date_str",
    "width": 200,
    "align": "center"
  },
];

export type DataIndexMap = {
  [x: string]: string;
}
