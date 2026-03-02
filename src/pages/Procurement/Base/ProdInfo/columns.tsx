import React from 'react';
import { formatDate } from '@/utils/utils-date';

export const configColumns = [
  {
    title: 'material.devCode',
    subTitle: '装置编码',
    dataIndex: 'dev_code',
    width: 200,
    align: 'center',
  },
  {
    title: 'material.pipe_code',
    subTitle: '管线号',
    dataIndex: 'pipe_code',
    width: 200,
    align: 'center',
  },
  {
    title: 'material.prod_code',
    subTitle: '物料编码',
    dataIndex: 'prod_code',
    width: 220,
    align: 'center',
  },
  {
    title: 'material.dev_name',
    subTitle: '装置名称',
    dataIndex: 'dev_name',
    width: 200,
    align: 'center',
  },
  {
    title: 'material.prod_name',
    subTitle: '物料名称',
    dataIndex: 'prod_name',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.aid_name',
    subTitle: '助记名称',
    dataIndex: 'aid_name',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.cls_code',
    subTitle: '物料分类编码',
    dataIndex: 'cls_code',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.spec',
    subTitle: '规格',
    dataIndex: 'spec',
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

  {
    title: 'material.unit_weight',
    subTitle: '单位重量',
    dataIndex: 'unit_weight',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.material_type',
    subTitle: '材质类别',
    dataIndex: 'material_type',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.material',
    subTitle: '材质',
    dataIndex: 'material',
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
    title: 'material.standard',
    subTitle: '执行标准',
    dataIndex: 'standard',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.remark',
    subTitle: '备注',
    dataIndex: 'remark',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.classification.name',
    subTitle: '物料分类名称',
    dataIndex: 'cls_name',
    width: 160,
    align: 'center',
  },

  {
    title: 'material.store_code',
    subTitle: '仓库编码',
    dataIndex: 'store_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.store_name',
    subTitle: '仓库名称',
    dataIndex: 'store_name',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.seat_code',
    subTitle: '货位编码',
    dataIndex: 'seat_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.seat_name',
    subTitle: '货位名称',
    dataIndex: 'seat_name',
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
    title: 'material.in_storage_num',
    subTitle: '入库数量',
    dataIndex: 'in_storage_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.prod.out_storage_num',
    subTitle: '出库数量',
    dataIndex: 'out_storage_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.in_storage_cancel_num',
    subTitle: '入库退出数量',
    dataIndex: 'in_storage_cancel_num',
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
    title: 'material.allot_in_num',
    subTitle: '调拨单掉入数量',
    dataIndex: 'allot_in_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.allot_out_num',
    subTitle: '调拨单调出数量',
    dataIndex: 'allot_out_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.profit_loss_num',
    subTitle: '损益数量',
    dataIndex: 'profit_loss_num',
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
    title: 'material.pre_out_storage_num',
    subTitle: '预出库数量',
    dataIndex: 'pre_out_storage_num',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.nps1',
    subTitle: '吋径1',
    dataIndex: 'nps1',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.nps2',
    subTitle: '吋径2',
    dataIndex: 'nps2',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.nps3',
    subTitle: '吋径3',
    dataIndex: 'nps3',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.upload_ts',
    subTitle: '上传时间',
    dataIndex: 'upload_ts',
    width: 160,
    align: 'center',
    // render: (text: any) => {
    //   return (<span>{text?formatDate(text):'-'}</span>);
    // },
  },
  {
    title: 'material.upload_ts',
    subTitle: '上传时间',
    dataIndex: 'upload_ts_str',
    width: 160,
    align: 'center',
    // render: (text: any) => {
    //   return (<span>{text?formatDate(text):'-'}</span>);
    // },
  },
  {
    title: 'material.owner_prod_code',
    subTitle: '业主物料编码',
    dataIndex: 'owner_prod_code',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.owner_prod_describe',
    subTitle: '业主物料描述',
    dataIndex: 'owner_prod_describe',
    width: 160,
    align: 'center',
  },
  {
    title: 'material.linear_meter',
    subTitle: '延长米(m)',
    dataIndex: 'linear_meter',
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
