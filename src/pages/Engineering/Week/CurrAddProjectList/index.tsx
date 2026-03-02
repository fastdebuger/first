import React, {useEffect, useRef} from 'react';
import {Button} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from 'yayang-ui';

import {configColumns} from "./columns";
import {getLastThuToThisWedRange} from "@/pages/Engineering/Week/WeeklyReport/Common/DateRangerSelect";

/**
 * 本周新增
 * @constructor
 */
const CurrAddProjectList: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [lastThu, thisWed] = getLastThuToThisWedRange();

  useEffect(() => {
    if(dispatch) {

    }
  }, [])


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "weekly_report_start", // 周报日期开始
      "weekly_report_end", // 周报日期结束
      "report_dep_name",
      "project_name",
      "project_level_str",
      // 工期
      'contract_start_date',
      "contract_end_date",
      // 计划进度(%)
      "curr_week_plan",
      // 实际进度(%)
      "curr_week_reality",
      // 偏离计划(%)
      "curr_week_difference",
      "construction_dep", // 建设单位
    ])
      .setTableColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs'},
        {value: 'contract_end_date', valueType: 'dateTs'},
      ]).needToExport([
        "weekly_report_start", // 周报日期开始
        "weekly_report_end", // 周报日期结束
        "report_dep_name",
        "project_name",
        "project_level",
        // 工期
        'contract_start_date',
        "contract_end_date",
        // 计划进度(%)
        "curr_week_plan",
        // 实际进度(%)
        "curr_week_reality",
        // 偏离计划(%)
        "curr_week_difference",
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
        tableTitle='本周新增项目'
        type="weeklyReport/getCurrWeekNewWeeklyReport"
        exportType="weeklyReport/getCurrWeekNewWeeklyReport"
        tableColumns={getTableColumns()}
        funcCode={authority}
        renderSelfToolbar={() => {
          return (
            <div>
              日期：{lastThu.format('YYYY-MM-DD')}~{thisWed.format('YYYY-MM-DD')}
            </div>
          )
        }}
        tableSortOrder={{ sort: 'weekly_report_start', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        tableDefaultField={{
          weekly_report_start: lastThu.format('YYYY-MM-DD'),
          weekly_report_end: thisWed.format('YYYY-MM-DD')
        }}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
    </div>
  )
}
export default connect()(CurrAddProjectList);
