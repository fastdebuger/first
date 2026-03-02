import React, { useEffect, useRef } from 'react';
import { Button } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";

/**
 * 工程信息
 * @constructor
 */
const ProjectInfoPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  useEffect(() => {
    if (dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "contract_name",
      "project_level_str",
      "contract_no",
      "owner_name",
      "import_level",
      "weekly_status_date",
      "contract_say_price",
    ])
      .needToExport([
        "contract_name",
        "project_level_str",
        "contract_no",
        "owner_name",
        "import_level",
        "weekly_status_date",
        "contract_say_price",
      ])
      .setTableColumnToDatePicker([
        { value: 'weekly_status_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
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
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
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
    return [
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="contract_no"
        tableTitle='工程信息'
        type="income/queryIncomeInfoWeeklyStatus"
        exportType="income/queryIncomeInfoWeeklyStatus"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'contract_no', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
    </div>
  )
}
export default connect()(ProjectInfoPage);
