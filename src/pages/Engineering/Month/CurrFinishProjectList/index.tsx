import React, {useEffect, useRef} from 'react';
import {Button} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from 'yayang-ui';

import {configColumns} from "./columns";
import moment from 'moment';

/**
 * 本月新增
 * @constructor
 */
const CurrFinishProjectList: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const currMonthStr = moment().format('YYYY-MM');
  useEffect(() => {
    if(dispatch) {

    }
  }, [])


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "belong_month", // 月报日期开始
      "report_dep_name",
      "project_name",
      "project_level_str",
      // 工期
      'contract_start_date',
      "contract_end_date",
      // 计划进度(%)
      "curr_month_plan",
      // 实际进度(%)
      "curr_month_reality",
      // 偏离计划(%)
      "curr_month_difference",
      "construction_dep", // 建设单位
    ]) .setTableColumnToDatePicker([
      {value: 'contract_start_date', valueType: 'dateTs'},
      {value: 'contract_end_date', valueType: 'dateTs'},
    ])
      .needToExport([
        "belong_month", // 月报日期开始
        "report_dep_name",
        "project_name",
        "project_level",
        // 工期
        'contract_start_date',
        "contract_end_date",
        // 计划进度(%)
        "curr_month_plan",
        // 实际进度(%)
        "curr_month_reality",
        // 偏离计划(%)
        "curr_month_difference",
        "construction_dep", // 建设单位
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</Button>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='本月完工项目'
        type="monthlyReport/getCurrMonthCompleteMonthlyReport"
        exportType="monthlyReport/getCurrMonthCompleteMonthlyReport"
        tableColumns={getTableColumns()}
        funcCode={'本月完工项目'}
        renderSelfToolbar={() => {
          return (
            <div>
              日期：{currMonthStr}
            </div>
          )
        }}
        tableSortOrder={{ sort: 'belong_month', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        tableDefaultField={{
          belong_month: currMonthStr
        }}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
    </div>
  )
}

export default connect()(CurrFinishProjectList);
