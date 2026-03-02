import React, { useRef } from 'react';
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from "./columns";

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
      'risk_name',
      // {
      //   title: 'RiskAssessmentRanking.risk_name',
      //   subTitle: '工程名称',
      //   dataIndex: 'risk_name',
      //   align: 'center',
      //   width: 200,
      //   render: (text: any, record: any) => {
      //     return (
      //       <a
      //         onClick={() => {
      //           setSelectedRecord(record)
      //           setOpen(true)
      //         }}
      //       >
      //         {text}
      //       </a>
      //     );
      //   },
      // },
      "final_influence",
      "final_possibility",
      "final_risk_value",
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
        tableTitle='风险评估排名'
        type="annualAssessment/queryEvaluationSummary"
        exportType="annualAssessment/queryEvaluationSummary"
        tableColumns={getTableColumns()}
        funcCode={authority + 'queryEvaluationSummary'}
        rowSelection={null}
        tableSortOrder={{ sort: 'final_risk_value', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />

    </div>
  )
}
export default connect()(CollectionOfRiskIncidents);
