import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { Alert, Divider } from "antd";
import { useRef, useState } from "react";
import {BasicTableColumns} from "yayang-ui";
import {columns} from './columns'

/**
 * 供应商打分合同明细
 * @constructor
 */
const SelectedSupplierContractScore = ({ selectedRecord }: any) => {

  const actionRef: any = useRef();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(columns);
    cols.initTableColumns([
      // "id",
      // "year",
      "contract_no",
      "procurement_content",
      // "wbs_code",
      "buyer",
      "supplier_name",
      "supplier_code",
      "supplier_type",
      "contract_amount",
      'product_quality',
      'service_ability',
      'contract_performance',
      'price_level',
      'technological_level',
      'integrity_management',
      'total_score',
      'delivery_amount',
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
      .needToExport([
        "contract_no",
        "procurement_content",
        "wbs_code",
        "buyer",
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "contract_amount",
        "year",
      ])
    return cols.getNeedColumns();
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="contract_id"
        tableTitle='供应商合同打分明细'
        type="supplierContractScore/querySupplierContractScoreBody"
        exportType="supplierContractScore/querySupplierContractScoreBody"
        tableColumns={getTableColumns()}
        funcCode={'供应商合同打分明细'}
        tableSortOrder={{ sort: 'contract_id', order: 'desc' }}
        tableDefaultFilter={[
          {Key: 'year', Val: selectedRecord.year, Operator: '='},
          {Key: 'supplier_name', Val: selectedRecord.supplier_name, Operator: '='},
        ]}
        buttonToolbar={() => []}
        selectedRowsToolbar={() => []}
      />
    </>
  )
}

export default SelectedSupplierContractScore;
