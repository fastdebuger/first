import React, {useRef} from 'react';
import {connect, useIntl} from 'umi';
import {hasExportPermission} from '@/utils/authority';
import {Button} from 'antd';
import { BasicTableColumns} from 'qcx4-components';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import {configColumns} from '../columns';


/**
 * 甲供分割预算平铺模式
 * @param props
 * @constructor
 */
const JIaSplitBudgetTilePage: React.FC<any> = (props: any) => {
  const {authority, moduleCaption} = props;
  const childRef: any = useRef();
  const {formatMessage} = useIntl();
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
        'obs_name',
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
        'anti_rank',
        isShowNetAndMargin ? 'split_net_num' : "",
        isShowNetAndMargin ? 'split_margin_num' : "",
        'split_num',
        'cls_name',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_memo',
        'prod_name',
        'prod_describe',
        'material',
        'unit',
        'spec',
      ])
    return cols.getNeedColumns();
  };
  // 定义按钮
  const toolBarRender = (selectedRows) => {
    return [
      <Button
        style={{marginLeft: 7, display: hasExportPerm ? 'inline' : 'none'}}
        key={7}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, getTableColumns());
        }}
      >
        {formatMessage({id: 'common.export'})}
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
  /**
   * 是否有选择框
   */
  const rowSelection = () => {
  };
  return (
    <div style={{backgroundColor: '#fff'}}>
      <BaseFormSearchTable
        cRef={childRef}
        rowKey="RowNumber"
        tableSortOrder={{sort: 'modify_time', order: 'desc'}}
        formColumns={[]}
        funcCode={authority + '分割预算_tile1'}
        moduleCaption={moduleCaption}
        tableColumns={getTableColumns()}
        type="jiasplitbudget/querySplitBudgetFlat"
        exportType="jiasplitbudget/querySplitBudgetFlat"
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={rowSelection}
        sumCols={isShowNetAndMargin ?
          ['split_net_num', 'split_margin_num', 'split_num'] :
          ['split_num']
        }
      />
    </div>
  );
};
export default connect()(JIaSplitBudgetTilePage);
