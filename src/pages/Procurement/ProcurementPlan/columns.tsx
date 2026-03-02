import React from 'react';
export const configColumns = [
  {
    "title": "PoPlanAll.RowNumber",
    "subTitle": "序号",
    "dataIndex": "RowNumber",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.form_no",
    "subTitle": "序号",
    "dataIndex": "form_no",
    "width": 160,
    "align": "center",
    render: (text: string, record: any) => record.RowNumber
  },
  {
    "title": "PoPlanAll.dep_code",
    "subTitle": "需用单位",
    "dataIndex": "dep_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.dev_code",
    "subTitle": "工程名称",
    "dataIndex": "dev_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.unit_project_code",
    "subTitle": "分区名称",
    "dataIndex": "unit_project_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.unit_code",
    "subTitle": "专业名称",
    "dataIndex": "unit_code",
    "width": 160,
    "align": "center"
  },
  // ---
  {
    "title": "PoPlanAll.dep_code",
    "subTitle": "需用单位",
    "dataIndex": "dep_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.dev_code",
    "subTitle": "工程名称",
    "dataIndex": "dev_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.unit_project_code",
    "subTitle": "分区名称",
    "dataIndex": "unit_project_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.unit_code",
    "subTitle": "专业名称",
    "dataIndex": "unit_name",
    "width": 160,
    "align": "center"
  },
  // ---
  {
    "title": "PoPlanAll.supply_type",
    "subTitle": "供货类型",
    "dataIndex": "supply_type",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.supply_type",
    "subTitle": "供货类型",
    "dataIndex": "supply_type_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.warehouse_code",
    "subTitle": "仓库名称",
    "dataIndex": "warehouse_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.warehouse_code",
    "subTitle": "仓库名称",
    "dataIndex": "warehouse_code_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.warehouse_code",
    "subTitle": "仓库名称",
    "dataIndex": "warehouse_name_str",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.cls_code",
    "subTitle": "编码系统名称",
    "dataIndex": "info_cls_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.cls_code",
    "subTitle": "编码系统名称",
    "dataIndex": "info_cls_name",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.form_no_show",
    "subTitle": "计划编号",
    "dataIndex": "form_no_show",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.po_price",
    "subTitle": "估算金额",
    "dataIndex": "po_price",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.delivery_points",
    "subTitle": "交货地点",
    "dataIndex": "delivery_points",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.user_code",
    "subTitle": "现场接货人员",
    "dataIndex": "user_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.tel_num",
    "subTitle": "联系电话",
    "dataIndex": "tel_num",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.prod_code",
    "subTitle": "物资编码",
    "dataIndex": "prod_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.prod_describe",
    "subTitle": "物料描述",
    "dataIndex": "prod_describe",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.unit",
    "subTitle": "单位",
    "dataIndex": "unit",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.po_number",
    "subTitle": "数量",
    "dataIndex": "po_number",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.plan_dep_code",
    "subTitle": "WBS编码",
    "dataIndex": "plan_dep_code",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.delivery_date",
    "subTitle": "要求到货日期",
    "dataIndex": "delivery_date",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.purchase_group",
    "subTitle": "采购组",
    "dataIndex": "purchase_group",
    "width": 160,
    "align": "center"
  },
  {
    "title": "PoPlanAll.remark",
    "subTitle": "备注",
    "dataIndex": "remark",
    "width": 160,
    "align": "center"
  }
];


// const o = {
//   'RowNumber': '序号',
//   'form_no': '序号',
//   'dep_code': '需用单位',
//   'dev_code': '工程名称',
//   'unit_project_code': '分区名称',
//   'unit_code': '专业名称',
//   'supply_type': '供货类型',
//   'warehouse_code': '仓库名称',
//   'cls_code': '编码系统名称',
//   'form_no_show': '计划编号',
//   'po_price': '估算金额',
//   'delivery_points': '交货地点',
//   'user_code': '现场接货人员',
//   'tel_num': '联系电话',

//   'prod_code': '物资编码',
//   'prod_describe': '物料描述',
//   'unit': '单位',
//   'po_number': '数量',
//   'plan_dep_code': 'WBS编码',
//   'delivery_date': '要求到货日期',
//   'purchase_group': '采购组',
//   'remark': '备注',
// }



// const a = Object.entries(o).map(([a, b]) => {
//   return {
//     title: "PoPlanAll." + a,
//     subTitle: b,
//     dataIndex: a,
//     width: 160,
//     align: 'center',
//   }
// })


// console.log('a :>> ', a);