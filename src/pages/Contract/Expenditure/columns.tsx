import { Tag } from "antd";

interface ConfigColumns {
  title: string;
  subTitle: string;
  dataIndex: string;
  width: number;
  align: string;
  render?: any
}

export const configColumns: ConfigColumns[] = [
  {
    title: "contract.id",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center"
  }, 
  {
    title: "contract.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center"
  },
  {
    title: "branch_comp_code",
    subTitle: "二级单位",
    dataIndex: "branch_comp_code",
    width: 160,
    align: "center",
  },
  {
    title: "branch_comp_code",
    subTitle: "二级单位",
    dataIndex: "branch_comp_name",
    width: 160,
    align: "center",
  },
  {
    title: "dep_code",
    subTitle: "项目经理部",
    dataIndex: "dep_code",
    width: 160,
    align: "center",
  },
  {
    title: "dep_code",
    subTitle: "项目经理部",
    dataIndex: "dep_name",
    width: 160,
    align: "center",
  },
  {
    title: "obs_code",
    subTitle: "承办部门",
    dataIndex: "obs_code",
    width: 160,
    align: "center",
  },
  {
    title: "obs_code",
    subTitle: "承办部门",
    dataIndex: "obs_name",
    width: 160,
    align: "center",
  },
  {
    title: "user_code",
    subTitle: "承办人",
    dataIndex: "user_code",
    width: 160,
    align: "center",
  },
  {
    title: "user_code",
    subTitle: "承办人",
    dataIndex: "user_name",
    width: 160,
    align: "center",
  },
  {
    title: "contract_income_id",
    subTitle: "合同收入表ID",
    dataIndex: "contract_income_id",
    width: 160,
    align: "center",
  },
  {
    title: "contract_out_name",
    subTitle: "支出合同名称",
    dataIndex: "contract_out_name",
    width: 160,
    align: "center",
  },
  {
    title: "wbs_code",
    subTitle: "乙方单位名称",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "wbs_code",
    subTitle: "乙方单位名称",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "subletting_enroll_code",
    subTitle: "乙方单位名称",
    dataIndex: "subletting_enroll_code",
    width: 160,
    align: "center",
  },
  {
    title: "subletting_enroll_code",
    subTitle: "乙方单位名称",
    dataIndex: "subletting_enroll_name",
    width: 160,
    align: "center",
  },
  {
    title: "y_signatory_user",
    subTitle: "乙方签约人",
    dataIndex: "y_signatory_user",
    width: 160,
    align: "center",
  },
  {
    title: "y_site_user",
    subTitle: "乙方现场负责人",
    dataIndex: "y_site_user",
    width: 160,
    align: "center",
  },
  {
    title: "y_signatory_user",
    subTitle: "乙方签约人",
    dataIndex: "y_signatory_name",
    width: 160,
    align: "center",
  },
  {
    title: "y_site_user",
    subTitle: "乙方现场负责人",
    dataIndex: "y_site_name",
    width: 160,
    align: "center",
  },
  {
    title: 'contract.contract_no2',
    subTitle: "合同系统2.0合同编号",
    dataIndex: "contract_no",
    width: 220,
    align: "center",
  },
  {
    title: "contract_scope",
    subTitle: "合同范围",
    dataIndex: "contract_scope",
    width: 160,
    align: "center",
  },
  {
    title: "contract_type",
    subTitle: "合同类型",
    dataIndex: "contract_type",
    width: 160,
    align: "center",
  },
  {
    title: "pur_way",
    subTitle: "采购方式",
    dataIndex: "pur_way",
    width: 160,
    align: "center",
  },
  {
    title: "contract_type",
    subTitle: "合同类型",
    dataIndex: "contract_type_str",
    width: 160,
    align: "center",
  },
  {
    title: "pur_way",
    subTitle: "采购方式",
    dataIndex: "pur_way_str",
    width: 160,
    align: "center",
  },
  {
    title: "contract_start_date",
    subTitle: "合同起始日期",
    dataIndex: "contract_start_date",
    width: 160,
    align: "center",
  },
  {
    title: "contract_start_date",
    subTitle: "合同起始日期",
    dataIndex: "contract_start_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "contract_end_date",
    subTitle: "合同结束日期",
    dataIndex: "contract_end_date",
    width: 160,
    align: "center",
  },
  {
    title: "contract_end_date",
    subTitle: "合同结束日期",
    dataIndex: "contract_end_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "contract_say_price",
    subTitle: "合同含税金额（元）",
    dataIndex: "contract_say_price",
    width: 200,
    align: "center",
  },
  {
    title: "contract_un_say_price",
    subTitle: "合同不含税金额（元）",
    dataIndex: "contract_un_say_price",
    width: 200,
    align: "center",
  },
  {
    title: "contract_sign_date",
    subTitle: "合同签订日期",
    dataIndex: "contract_sign_date",
    width: 160,
    align: "center",
  },
  {
    title: "contract_sign_date",
    subTitle: "合同签订日期",
    dataIndex: "contract_sign_date_str",
    width: 160,
    align: "center",
  },
  {
    title: "materials_type",
    subTitle: "物资类别",
    dataIndex: "materials_type",
    width: 160,
    align: "center",
  },
  {
    title: "materials_type",
    subTitle: "物资类别",
    dataIndex: "materials_type_str",
    width: 160,
    align: "center",
  },
  {
    title: "remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "tz",
    subTitle: "时区",
    dataIndex: "tz",
    width: 160,
    align: "center",
  },
  {
    title: "form_maker_code",
    subTitle: "制单人编码",
    dataIndex: "form_maker_code",
    width: 160,
    align: "center",
  },
  {
    title: "form_maker_name",
    subTitle: "制单人名称",
    dataIndex: "form_maker_name",
    width: 160,
    align: "center",
  },
  {
    title: "form_make_time",
    subTitle: "制单时间",
    dataIndex: "form_make_time",
    width: 160,
    align: "center",
  },
  {
    title: "form_make_time",
    subTitle: "制单时间",
    dataIndex: "form_make_time_str",
    width: 160,
    align: "center",
  },
  {
    title: "form_make_tz",
    subTitle: "制单时区",
    dataIndex: "form_make_tz",
    width: 160,
    align: "center",
  },
  {
    title: "income_info_wbs_name",
    subTitle: "对应的主合同WBS项目定义",
    dataIndex: "income_info_wbs_name",
    width: 240,
    align: "center",
  },
  {
    title: "income_info_wbs_name",
    subTitle: "对应的主合同WBS项目定义",
    dataIndex: "income_info_wbs_code",
    width: 240,
    align: "center",
  },
  {
    title: "contract_name",
    subTitle: "对应的主合同名称",
    dataIndex: "contract_name",
    width: 200,
    align: "center",
  },
  {
    "title": "contract.scanning_file_url",
    "subTitle": "合同扫描件",
    "dataIndex": "file_url",
    "width": 160,
    "align": "center"
  },
    {
    "title": "contract.others_file_url",
    "subTitle": "其他附件",
    "dataIndex": "others_file_url",
    "width": 160,
    "align": "center"
  },
  {
    "title": "contract.settlement_management_id",
    "subTitle": "是否结算",
    "dataIndex": "settlement_management_id",
    "width": 160,
    "align": "center",
    render(txt: string) {
      const a = Number(txt);
      return (
        <Tag color={a > 0 ? "success" : "error"}>
          {a > 0 ? '是' : '否'}
        </Tag>
      )
    }
  },
  {
    "title": "contract.settlement_management_id",
    "subTitle": "是否结算",
    "dataIndex": "settlement_management_id_str",
    "width": 160,
    "align": "center",
    render(txt: string, record: any) {
      const a = Number(record.settlement_management_id);
      return (
        <Tag color={a > 0 ? "success" : "error"}>
          {a > 0 ? '是' : '否'}
        </Tag>
      )
    }
  },
  {
    "title": "contract.relative_person_code",
    "subTitle": "合同相对人十位编码",
    "dataIndex": "relative_person_code",
    "width": 220,
    "align": "center"
  },
]