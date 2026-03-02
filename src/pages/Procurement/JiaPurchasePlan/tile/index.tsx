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
  const isApproval = localStorage.getItem('system-is-open-approval') === '1';
  // 获取表格配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'form_no_show',
        'form_date_format',
        'dev_name',
        'unit_project_name',
        'unit_name',
        isApproval ? 'status_str' : '',
        isApproval ? 'apprv_complete_ts_str' : '',
        'supply_type_str',
        'plan_materials_type_str',
        'warehouse_code_str',
        'warehouse_name_str',
        'form_maker_name',
        'form_make_time_format',
        'modify_name',
        'modify_time_format',
        'remark',
        'prod_code',
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',
        'plan_num',
        'total_weight',
        'arrival_place',
        'demand_time_str',
        'prod_name',
        'cls_name',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'prod_describe',
        'auxiliary1_unit',
        'auxiliary1_num',
        'auxiliary2_unit',
        'auxiliary2_num',
        'version_code',
        'prod_memo',
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
        funcCode={authority + '需求计划_tile1'}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type="jiapurchaseplan/queryPurchasePlanFlat"
        exportType="jiapurchaseplan/queryPurchasePlanFlat"
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={{
          type: 'checkbox',
        }}
        sumCols={isShowNetAndMargin ?
          ['plan_net_num', 'plan_margin_num', 'plan_num', 'total_weight'] :
          ['plan_num', 'total_weight']
        }
      />
    </div>
  );
};
export default connect()(JiaPurchasePlanTilePage);
