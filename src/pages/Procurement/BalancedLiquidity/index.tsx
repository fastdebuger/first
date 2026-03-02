import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { connect, useIntl } from 'umi';
import { hasModifyPermission, } from '@/utils/authority';
import { configColumns } from './columns';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from "yayang-ui";
import DetailModal from './Detail';
import GenerateProcurementPlan from "./GenerateProcurementPlan";

/**
 * @param props
 * @constructor
 */
const ClsConfig: React.FC<any> = (props) => {
  const { formatMessage } = useIntl();
  const {
    route: { authority, name },
    dispatch,
  } = props;
  const childRef = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [generateProcurementPlanVisible, setGenerateProcurementPlanVisible] = useState(false);

  /**
   * 获取表格配置
   */
  const getTableColumns = () => {
    const fixedCol = new BasicTableColumns(configColumns);
    return fixedCol
      .initTableColumns([
        {
          title: formatMessage({ id: 'material.prod_code' }),
          subTitle: '仓库名称',
          dataIndex: 'prod_code',
          width: 160,
          align: 'center',
          sorter: true,
          render: (text: string, record: any) => {
            return (
              <a
                onClick={() => {
                  setSelectedRecord(record);
                  setOpen(true);
                }}
              >
                {text || '-'}
              </a>
            );
          },
        },
        "form_no_show",
        "purchase_strategy_no",
        "plan_num",
        "out_storage_num",
        "out_storage_cancel_num",
        "borrow_num",
        "storage_prod_num",
        "balance_number",
        "po_number",
        "surplus_number",
        "purchase_number",
        "if_balance_inventory",
        "prod_describe",
        "unit",
      ])
      .needToExport([
        'prod_code',
        "form_no_show",
        "plan_num",
        "out_storage_num",
        "out_storage_cancel_num",
        "borrow_num",
        "storage_prod_num",
        "balance_number",
        "po_number",
        "surplus_number",
        "purchase_number",
        "if_balance_inventory",
        "prod_describe",
        "unit",
      ])
      .getNeedColumns();
  };


  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (
    reloadTable: (filters?: [], noFilters?: []) => void
  ) => {
    return [
      <Button
        type="primary"
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.exportFile();
          }
        }}
      >
        {formatMessage({ id: 'common.list.export' })}
      </Button>
    ];
  };



  /**
   * 列操作按钮
   */
  const renderSelectedRowsToolbar = (selectedRows: any) => {
    // console.log('selectedRows :>> ', selectedRows);
    // 判断是否有平衡数据 有一个隐藏采购计划按钮 
    const isShowPlanBtn = selectedRows.some((it: any) => String(it.if_balance_inventory) === "1")
    return [
      !isShowPlanBtn && <Button
        // style={{ display: hasModifyPermission(authority) ? 'inline-block' : 'none' }}
        type="primary"
        onClick={() => {
          setSelectedRecord(selectedRows)
          setGenerateProcurementPlanVisible(true);
        }}
      >
        生成采购计划
      </Button>
    ]
  }


  return (
    <div style={{ padding: 0 }}>
      <BaseCurdSingleTable
        cRef={childRef}
        moduleCaption={name}
        rowKey="RowNumber"
        funcCode={authority + 'queryBakData'}
        height={'calc(100vh - 340px)'}
        tableTitle="平衡利库"
        type="balancedLiquidity/queryBakData"
        exportType="balancedLiquidity/queryBakData"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'form_no', order: "desc" }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <DetailModal
          open={open}
          visible={open}
          actionRef={childRef}
          selectedRecord={selectedRecord}
          onClose={() => setOpen(false)}
        />
      )}
      {generateProcurementPlanVisible && (
        <GenerateProcurementPlan
          visible={generateProcurementPlanVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setGenerateProcurementPlanVisible(false)}
          callbackAddSuccess={() => {
            setGenerateProcurementPlanVisible(false);
            if (childRef.current) {
              childRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

export default connect()(ClsConfig);
