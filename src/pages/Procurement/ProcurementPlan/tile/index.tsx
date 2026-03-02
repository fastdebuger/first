import React, { useRef } from 'react';
import { connect, useIntl } from 'umi';
import { hasExportPermission } from '@/utils/authority';
import { Button } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import { configColumns } from '../columns';

/**
 * 甲供需求计划单平铺模式
 * @param props
 * @constructor
 */
const JiaPurchasePlanTilePage: React.FC<any> = (props: any) => {
  const { authority, moduleCaption } = props;
  const childRef: any = useRef();
  const { formatMessage } = useIntl();
  const hasExportPerm: boolean = hasExportPermission(authority);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  // 获取表格配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        // 'PoPlanAll.RowNumber',
        // 'PoPlanAll.form_no',
        'dep_code',
        'dev_code',
        'unit_project_code',
        'unit_code',
        'supply_type',
        'warehouse_code',
        'cls_code',
        'form_no_show',
        'po_price',
        'delivery_points',
        'user_code',
        'tel_num',
        'prod_code',
        'prod_describe',
        'unit',
        'po_number',
        'plan_dep_code',
        'delivery_date',
        'purchase_group',
        'remark',
      ])
    return cols.getNeedColumns();
  };
  // 定义按钮
  const toolBarRender = () => {
    return [
      <Button
        style={{ marginLeft: 7, display: hasExportPerm ? 'inline' : 'none' }}
        key={7}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, getTableColumns());
        }}
      >
        {formatMessage({ id: 'common.export' })}
      </Button>,
    ];
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <BaseFormSearchTable
        cRef={childRef}
        moduleCaption={moduleCaption}
        rowKey="prod_key"
        funcCode={authority + '采购计划_tile1'}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type="poPlan/queryPoPlanFlat"
        exportType="poPlan/queryPoPlanFlat"
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={{
          type: 'checkbox',
        }}
        sumCols={[]}
      />
    </div>
  );
};
export default connect()(JiaPurchasePlanTilePage);
