import React, {useRef, useState} from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import {hasPermission} from "@/utils/authority";
import {Button, message, Modal, Space} from "antd";
import {BasicTableColumns} from "yayang-ui";
import { connect } from "umi";

import {configColumns} from "./columns";
import SupplierContractScoreAdd from "./Add";
import SupplierContractScoreEdit from "./Edit";
import SupplierContractScoreDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";


/**
 * 供应商合同得分
 * @param props
 * @constructor
 */
const SupplierContractScorePage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'h_id',
      'wbs_code',
      'year',
      'phone_number',
      'create_ts',
      'create_tz',
      'create_user_code',
      'create_user_name',
      'modify_ts',
      'modify_tz',
      'modify_user_code',
      'modify_user_name',
    ]).initBodyTableColumns([
      'h_id',
      'id',
      'contract_id',
      'product_quality',
      'service_ability',
      'contract_performance',
      'price_level',
      'technological_level',
      'integrity_management',
      'total_score',
      'delivery_amount',
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToExport([
        "wbs_code",
        "year",
        "phone_number",
        "contract_id",
        "product_quality",
        "service_ability",
        "contract_performance",
        "price_level",
        "technological_level",
        "integrity_management",
        "total_score",
        "delivery_amount",
      ])
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      [
        <Space>
          <Button
            type={"primary"}
            style={{display: hasPermission(authority, "新增") ? "inline-block" : "none"}}
            onClick={() => {
              setAddVisible(true);
            }}
          >新增</Button>
          <Button
            type={"primary"}
            style={{display: hasPermission(authority, "导出") ? "inline-block" : "none"}}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        </Space>
      ]
    ]
  }

  return (
    <div>
      <BaseHeaderAndBodyTable
        cRef={actionRef}
        tableTitle="供应商合同评分"
        header={{
          sort: "create_ts",
          order: "desc",
          rowKey: "h_id",
          type: "supplierContractScore/querySupplierContractScoreHead",
          exportType: "supplierContractScore/querySupplierContractScoreHead",
          importType: "",
        }}
        scan={{
          sort: "create_ts",
          order: "desc",
          rowKey: "h_id",
          type: "supplierContractScore/querySupplierContractScoreFlat",
          exportType: "supplierContractScore/querySupplierContractScoreFlat",
          importType: "",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        funcCode={authority}
        selectedRowsToolbar={() => {
          return {
            headerToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: {Key: string; Val: string; Operator?: string}[],
                noFilters?: any,
              ) => void,
            ) => [
              <Button
                type={"primary"}
                style={{display: hasPermission(authority, "编辑") ? "inline-block" : "none"}}
                onClick={() => {
                  if (selectedRows?.length !== 1) {
                    message.warn('每次编辑一行数据')
                    return;
                  }
                  setSelectedRecord(selectedRows[0])
                  setEditVisible(true);
                }}
              >编辑</Button>,
              <Button
                style={{display: hasPermission(authority, '删除') ? 'inline' : 'none'}}
                danger
                type={"primary"}
                onClick={() => {
                  if (selectedRows?.length !== 1) {
                    message.warning("每次只能删除一条数据");
                    return;
                  }
                  Modal.confirm({
                    title: "删除",
                    content: "确定删除所选的内容？",
                    okText: "确定删除",
                    okType: "danger",
                    cancelText: "我再想想",
                    onOk() {
                      dispatch({
                        type: "supplierContractScore/delSupplierContractScore",
                        payload: {
                          h_id: selectedRows[0]['h_id'],
                        },
                        callback: (res: any) => {
                          if (res.errCode === ErrorCode.ErrOk) {
                            message.success("删除成功");
                            if (actionRef.current) {
                              actionRef.current.reloadTable();
                            }
                          }
                        },
                      });
                    },
                    onCancel() {
                      console.log("Cancel");
                    },
                  });
                }}
              >
                删除
              </Button>
            ],
            scanToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: {Key: string; Val: string; Operator?: string}[],
                noFilters?: any,
              ) => void,
            ) => [],
          }
        }}
      />
      {open && (
        <SupplierContractScoreDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <SupplierContractScoreEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <SupplierContractScoreAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(SupplierContractScorePage);
