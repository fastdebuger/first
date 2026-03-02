import React, { useRef, useState } from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import { hasPermission } from "@/utils/authority";
import { Button, message, Modal, Space, Tabs } from "antd";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";

import { materialsColumns, subcontractColumns, serviceColumns } from "./columns";
import PurchaseStrategyLotPlanAdd from "./Add";
import PurchaseStrategyLotPlanEdit from "./Edit";
import PurchaseStrategyLotPlanDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";


/**
 * 工程物资单个标段策划方案
 * @param props
 * @constructor
 */
const PurchaseStrategyLotPlanPage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('0'); // '0'/'1'/'2'表示对应的类别

  const titlePrefix =
    activeTab === '1' ? '工程分包' : activeTab === '2' ? '工程服务' : '工程物资';
  const pageTitle = `${titlePrefix}单个标段策划方案`;

  const getTableColumns = () => {
    const baseColumns =
      activeTab === '1' ? subcontractColumns : activeTab === '2' ? serviceColumns : materialsColumns;

    const cols = new BasicTableColumns(baseColumns);
    cols.initTableColumns([
      {
        title: '标段编号',
        subTitle: '标段编号',
        dataIndex: 'lot_no',
        width: 160,
        align: 'center',
        render: (text: any, record: any) => {
          return <a onClick={() => { setSelectedRecord(record); setOpen(true); }}>{text}</a>;
        },
      },
      'lot_name',
      'lot_category',
      'package_type',
      'materials_type_str',
      'is_owner_controlled_str',
      'control_level_str',
      'rfq_no',
      'cost_control_range',
      'item_code',
      'material_grade_str',
      'is_sub_allowed',
      'sub_allowed_reason',
      'source_reason_desc',
      'legal_basis',
      'method_summary_technology',
      'method_summary_total',
      'site_demand_time_str',
      'delivery_terms_dom',
      'delivery_terms_intl',
      'payment_terms',
      'guarantee_prepay',
      'guarantee_perf',
      'guarantee_quality',
      'warranty_period_req',
      'disqualify_criteria',
      'other_elements',
      'remark',
    ]).initBodyTableColumns([
      'supplier_name',
      'supplier_source',
      'supplier_reg_addr',
      'origin_requirement',
      'supplier_code',
      'supplier_category',
      'procurement_method_str',
      'eval_method_str',
      'lot_division',
      'proposed_qty',
      'currency',
      'purchase_obs_code',
    ])
      .setTableColumnToDatePicker([
        { value: 'site_demand_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = () => {
    return [
      [
        <Space key="toolbar">
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "新增") ? "inline-block" : "none" }}
            onClick={() => {
              setAddVisible(true);
            }}
          >新增</Button>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
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

  /**
   * 处理tab切换
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // 构建过滤条件
    const filters: { Key: string; Val: string; Operator?: string }[] = [];
    filters.push({
      Key: 'lot_category',
      Val: key,
      Operator: '='
    });

    // 重新加载表格数据
    if (actionRef.current) {
      actionRef.current.reloadTable(filters);
    }
  }

  /**
   * 自定义工具栏 - 显示tab
   */
  const renderSelfToolbar = () => {
    return (
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        style={{ marginBottom: 0 }}
      >
        <Tabs.TabPane tab="工程物资" key="0" />
        <Tabs.TabPane tab="工程分包" key="1" />
        <Tabs.TabPane tab="工程服务" key="2" />
      </Tabs>
    );
  }

  return (
    <div>
      <BaseHeaderAndBodyTable
        key={activeTab}
        cRef={actionRef}
        tableTitle={pageTitle}
        header={{
          sort: "form_no",
          order: "desc",
          rowKey: "form_no",
          type: "purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanHead",
          exportType: "purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanHead",
          importType: "",
        }}
        scan={{
          sort: "form_no",
          order: "desc",
          rowKey: "form_no",
          type: "purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanFlat",
          exportType: "purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanFlat",
          importType: "",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        renderSelfToolbar={renderSelfToolbar}
        funcCode={authority + '-' + activeTab}
        selectedRowsToolbar={() => {
          return {
            headerToolbar: (
              selectedRows?: any[],
            ) => [
                <Button
                  key="edit"
                  type={"primary"}
                  style={{ display: hasPermission(authority, "编辑") ? "inline-block" : "none" }}
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
                  key="delete"
                  style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
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
                          type: "purchaseStrategyLotPlan/delPurchaseStrategyLotPlan",
                          payload: {
                            form_no: selectedRows[0].form_no,
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
            scanToolbar: () => [],
          }
        }}
        tableDefaultFilter={[{
          Key: 'dep_code',
          Val: localStorage.getItem('auth-default-wbsCode') + '%',
          Operator: 'like'
        }]}
      />
      {open && selectedRecord && (
        <PurchaseStrategyLotPlanDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
          activeTab={activeTab}
        />
      )}
      {editVisible && (
        <PurchaseStrategyLotPlanEdit
          visible={editVisible}
          activeTab={activeTab}
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
        <PurchaseStrategyLotPlanAdd
          visible={addVisible}
          activeTab={activeTab}
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
export default connect()(PurchaseStrategyLotPlanPage);
