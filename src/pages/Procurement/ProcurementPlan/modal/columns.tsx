import React from "react";

export const configColumns = [
  {
    title: 'material.cls_code_show',
    subTitle: '物料分类',
    dataIndex: 'cls_code',
    width: 260,
    align: 'center',
    render(text: any, record: any) {
      return <span>{record.cls_code + "-" + record.cls_name}</span>
    }
  },
  {
    title: 'material.cls_name',
    subTitle: '物料分类',
    dataIndex: 'cls_name',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.prod_code',
    subTitle: '物料编码',
    dataIndex: 'prod_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.prod_code',
    subTitle: '物料编码',
    dataIndex: 'prod_name',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.form_no',
    subTitle: '序号',
    dataIndex: 'form_no',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.form_no_show',
    subTitle: '需求计划编码',
    dataIndex: 'form_no_show',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.plan_num',
    subTitle: '计划数量',
    dataIndex: 'plan_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.out_storage_num',
    subTitle: '出库数量',
    dataIndex: 'out_storage_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.out_storage_cancel_num',
    subTitle: '出库退入数量',
    dataIndex: 'out_storage_cancel_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.borrow_num',
    subTitle: '借用数量',
    dataIndex: 'borrow_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.storage_prod_num',
    subTitle: '库存数量',
    dataIndex: 'storage_prod_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.balance_number_balance',
    subTitle: '平衡数量',
    dataIndex: 'balance_number',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.po_number',
    subTitle: '采购数量',
    dataIndex: 'po_number',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.surplus_number',
    subTitle: '剩余数量',
    dataIndex: 'surplus_number',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.purchase_number',
    subTitle: '求购数量',//(只有数量大于0的时候才会生成平衡利库)
    dataIndex: 'purchase_number',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.prod_describe',
    subTitle: '物料描述',
    dataIndex: 'prod_describe',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.unit',
    subTitle: '计量单位',
    dataIndex: 'unit',
    width: 160,
    align: 'center',
  },
  // 新增字段
  {
    title: 'material.plan_form_no',
    subTitle: '需求计划单据号',
    dataIndex: 'plan_form_no',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.plan_form_no',
    subTitle: '需求计划单据号',
    dataIndex: 'plan_form_no_show',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.form_date',
    subTitle: '单据日期',
    dataIndex: 'form_date',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.dev_code',
    subTitle: '装置编码',
    dataIndex: 'dev_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.unit_project_code',
    subTitle: '单位工程编码',
    dataIndex: 'unit_project_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.unit_code',
    subTitle: '单元编码',
    dataIndex: 'unit_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.purchase_strategy_no',
    subTitle: '采购策略序号',
    dataIndex: 'purchase_strategy_no',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.po_price',
    subTitle: '采购金额(元)',
    dataIndex: 'po_price',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.supply_type',
    subTitle: '供货类型',
    dataIndex: 'supply_type',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.plan_materials_type',
    subTitle: '物资类型',
    dataIndex: 'plan_materials_type',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.warehouse_code',
    subTitle: '仓库编码',
    dataIndex: 'warehouse_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.delivery_points',
    subTitle: '交货地点',
    dataIndex: 'delivery_points',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.user_code_delivery',
    subTitle: '现场接货人员',
    dataIndex: 'user_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.plan_form_no',
    subTitle: '需求计划单据序号',
    dataIndex: 'plan_form_no',
    width: 160,
    align: 'center',
  },
  // {
  //   title: 'material.po_number',
  //   subTitle: '采购数量',
  //   dataIndex: 'po_number',
  //   width: 160,
  //   align: 'center',
  // },
  {
    title: 'material.purchase_group',
    subTitle: '采购组',
    dataIndex: 'purchase_group',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.prod_code',
    subTitle: '物料编码',
    dataIndex: 'prod_code',
    width: 160,
    align: 'center',
  },
];


// plan_form_no             #需求计划单据号
// form_date                #单据日期
// dev_code                 #装置编码
// unit_project_code        #单位工程编码
// unit_code                #单元编码
// purchase_strategy_no     # 采购策略序号
// po_price                 # 采购金额
// supply_type              #供货类型
// plan_materials_type      #物资类型
// warehouse_code           #仓库编码
// delivery_points          #交货地点
// user_code                # 现场接货人员
// Items:[
// {
// plan_form_no      # 需求计划单据序号
// po_number         # 采购数量
// purchase_group    # 采购组
// prod_code         #物料编码
// }
// ]
// }