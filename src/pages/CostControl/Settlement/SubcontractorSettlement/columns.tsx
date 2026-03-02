import { ReactNode } from 'react';
import { Tag } from 'antd';


export const configColumns = [
  {
    "title": "compinfo.id",
    "subTitle": "主键ID",
    "dataIndex": "id",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.form_no",
    "subTitle": "进度款主表ID（外键）",
    "dataIndex": "form_no",
    "width": 200,
    "align": "center"
  },
  {
    "title": "compinfo.number",
    "subTitle": "进度款次数（第几期）",
    "dataIndex": "number",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.report_amount1",
    "subTitle": "上报金额",
    "dataIndex": "report_amount",
    "width": 160,
    "align": "center"
  },
  {
    "title": "审批完成时间",
    "subTitle": "审批完成时间",
    "dataIndex": "approval_date",
    "width": 160,
    "align": "center"
  },

  {
    "title": "compinfo.approval_schedule1",
    "subTitle": "审批进度(0:审批中,1:已完成)",
    "dataIndex": "approval_schedule",
    "width": 200,
    "align": "center"
  },
  {
    "title": "compinfo.approval_amount1",
    "subTitle": "审核金额",
    "dataIndex": "approval_amount",
    "width": 160,
    "align": "center"
  },
  {
    "title": "审批意见",
    "subTitle": "审批意见",
    "dataIndex": "approval_opinion",
    "width": 200,
    "align": "center"
  },
  {
    "title": "compinfo.report_amount1",
    "subTitle": "上报金额",
    "dataIndex": "report_amount1",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule1",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule1",
    "width": 200,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule1",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule1_str",
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
        return <Tag color={'default'}>{'暂无审批'}</Tag>
      }
    }
  },
  {
    "title": "compinfo.approval_amount1",
    "subTitle": "审核金额",
    "dataIndex": "approval_amount1",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.report_amount2",
    "subTitle": "上报金额",
    "dataIndex": "report_amount2",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule2",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule2",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule2",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule2_str",
    "width": 160,
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
        return <Tag color={'default'}>{'暂无审批'}</Tag>
      }
    }
  },
  {
    "title": "compinfo.approval_amount2",
    "subTitle": "审核金额",
    "dataIndex": "approval_amount2",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.report_amount3",
    "subTitle": "上报金额",
    "dataIndex": "report_amount3",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule3",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule3",
    "width": 160,
    "align": "center",

  },
  {
    "title": "compinfo.approval_schedule3",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule3_str",
    "width": 160,
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
        return <Tag color={'default'}>{'暂无审批'}</Tag>
      }
    }
  },
  {
    "title": "compinfo.approval_amount3",
    "subTitle": "审核金额",
    "dataIndex": "approval_amount3",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.report_amount4",
    "subTitle": "上报金额",
    "dataIndex": "report_amount4",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule4",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule4",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_schedule4",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule4_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.final_amount4",
    "subTitle": "审定金额",
    "dataIndex": "approval_amount4",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.dep_code",
    "subTitle": "制单人编码",
    "dataIndex": "dep_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.form_maker_code",
    "subTitle": "制单人编码",
    "dataIndex": "form_maker_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.form_maker_name",
    "subTitle": "制单人名称",
    "dataIndex": "form_maker_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.form_make_time",
    "subTitle": "制单时间",
    "dataIndex": "form_make_time",
    "width": 200,
    "align": "center"
  },
  {
    "title": "compinfo.form_make_tz",
    "subTitle": "制单时区",
    "dataIndex": "form_make_tz",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.maxNumber",
    "subTitle": "最大次数",
    "dataIndex": "maxNumber",
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
    "title": "costControl.wbs_code",
    "subTitle": "ERP项目定义编号",
    "dataIndex": "wbs_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.income_info_wbs_name",
    "subTitle": "合同项目部编码",
    "dataIndex": "income_info_wbs_name",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.prepay_approval_amount",
    "subTitle": "预付款审核金额",
    "dataIndex": "prepay_approval_amount",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.prepay_is_arrival",
    "subTitle": "预付款是否到账",
    "dataIndex": "prepay_is_arrival",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.prepay_is_arrival",
    "subTitle": "预付款是否到账",
    "dataIndex": "prepay_is_arrival_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.prepay_ratio",
    "subTitle": "预付款累计占合同额比例",
    "dataIndex": "prepay_ratio",
    "width": 200,
    "align": "center",
  },
  {
    "title": "costControl.contract_income_id",
    "subTitle": "合同收入表ID",
    "dataIndex": "contract_income_id",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.contract_say_price",
    "subTitle": "合同金额",
    "dataIndex": "contract_say_price",
    "width": 200,
    "align": "center"
  },
  {
    "title": "costControl.approval_amount",
    "subTitle": "审核金额",
    "dataIndex": "approval_amount",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.approval_schedule",
    "subTitle": "审批进度",
    "dataIndex": "approval_schedule",
    "width": 160,
    "align": "center"
  },
  {
    "title": "costControl.is_arrival",
    "subTitle": "是否到账",
    "dataIndex": "is_arrival",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.contract_no",
    "subTitle": "服务采购订单编码",
    "dataIndex": "contract_no",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.contract_out_name",
    "subTitle": "分包合同名称",
    "dataIndex": "contract_out_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_date_str",
    "subTitle": "审批完成日期",
    "dataIndex": "approval_date_str1",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_date_str",
    "subTitle": "审批完成日期",
    "dataIndex": "approval_date_str2",
    "width": 160,
    "align": "center"
  },
  {
    "title": "compinfo.approval_date_str",
    "subTitle": "审批完成日期",
    "dataIndex": "approval_date_str3",
    "width": 160,
    "align": "center"
  },
  {
    "title": "编制日期",
    "subTitle": "编制日期",
    "dataIndex": "report_date1",
    "width": 160,
    "align": "center"
  },
  {
    "title": "编制日期",
    "subTitle": "编制日期",
    "dataIndex": "report_date_str1",
    "width": 160,
    "align": "center"
  },
];
