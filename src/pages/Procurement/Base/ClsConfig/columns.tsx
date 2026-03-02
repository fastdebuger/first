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
    subTitle: '物料分类编码',
    dataIndex: 'cls_name',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.devCode',
    subTitle: '装置名称',
    dataIndex: 'dev_code',
    width: 200,
    align: 'center',
  },{
    title: 'material.dev_name',
    subTitle: '装置名称',
    dataIndex: 'dev_name',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.allow_split_more',
    subTitle: '分割允许超计划比例(%)',
    dataIndex: 'allow_split_more',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.allow_out_store_rate_more',
    subTitle: '出库允许超分割比例(%)',
    dataIndex: 'allow_out_store_rate_more',
    width: 180,
    align: 'center',
  },

  {
    title: 'material.allow_in_store_rate_more',
    subTitle: '允许入库超计划比例(%)',
    dataIndex: 'allow_in_store_rate_more',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.comp_type',
    subTitle: '编码库',
    dataIndex: 'comp_type',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.comp_type',
    subTitle: '编码库',
    dataIndex: 'comp_type_str',
    width: 160,
    align: 'center',
  },
];
