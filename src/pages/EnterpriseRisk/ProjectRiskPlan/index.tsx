import React, { useRef } from 'react';
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from "./columns";
import dayjs from 'dayjs';

/**
 * 风险评估排名
 * @constructor
 */
const CollectionOfRiskIncidents: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const actionRef: any = useRef();

  /**
   * 配置列
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "category_name",
      "final_influence",
      "final_possibility",
      "final_risk_value",
      "risk_category",
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return []
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = () => {
    return []
  }


  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle='风险分析评估最终结果信息'
        type="projectRiskGovernance/queryRiskAnalysisResultInfo"
        exportType="projectRiskGovernance/queryRiskAnalysisResultInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + 'queryRiskAnalysisResultInfo'}
        rowSelection={null}
        tableSortOrder={{ sort: 'final_risk_value', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultField={{
          year: dayjs().year()
        }}
      />

    </div>
  )
}
export default connect()(CollectionOfRiskIncidents);
