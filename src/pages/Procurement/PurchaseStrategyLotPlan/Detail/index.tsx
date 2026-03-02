import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { materialsColumns, subcontractColumns, serviceColumns } from "../columns";
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
import PurchaseStrategyLotPlanEdit from "../Edit";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";

const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 工程物资单个标段策划方案详情
 * @param props
 * @returns
 */
const PurchaseStrategyLotPlanDetail: React.FC<any> = (props: any) => {
  const { authority, open, onClose, selectedRecord, actionRef, dispatch, activeTab } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();
  const childRef: any = useRef();
  const titlePrefix =
    activeTab === '1' ? '工程分包' : activeTab === '2' ? '工程服务' : '工程物资';
  const pageTitle = `${titlePrefix}单个标段策划方案`;

  const getTableColumns = () => {
    const baseColumns =
      activeTab === '1' ? subcontractColumns : activeTab === '2' ? serviceColumns : materialsColumns;

    const cols = new BasicTableColumns(baseColumns);
    cols.initTableColumns([
      'lot_no',
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
    ])
      .setTableColumnToDatePicker([
        { value: 'site_demand_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    cols.getNeedColumns().forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) })
    });
    return cols.getNeedColumns();
  };

  const getBodyTableColumns = () => {
    const baseColumns =
      activeTab === '1' ? subcontractColumns : activeTab === '2' ? serviceColumns : materialsColumns;

    const cols = new BasicTableColumns(baseColumns);
    cols.initTableColumns([
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
    return cols.getNeedColumns();
  };

  const renderButtonToolbar = () => {
    return [
      <Button
        key="edit"
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        key="delete"
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    if (!selectedRecord?.form_no) return;
    dispatch({
      type: "purchaseStrategyLotPlan/delPurchaseStrategyLotPlan",
      payload: {
        form_no: selectedRecord.form_no,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  /**
   * 功能按钮组
   */
  const renderBodyButtonToolbar = () => {
    return [
      <Button
        key="export"
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => childRef.current.exportFile()}
      >
        {formatMessage({ id: 'common.list.export' })}
      </Button>,
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="form_no"
        title={pageTitle}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <BaseCurdSingleTable
          cRef={childRef}
          rowKey="id"
          tableTitle={`${pageTitle}详情`}
          type="purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanBody"
          exportType="purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanBody"
          tableDefaultFilter={[
            { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
          ]}
          tableColumns={getBodyTableColumns()}
          tableSortOrder={{ sort: 'id', order: 'desc' }}
          buttonToolbar={renderBodyButtonToolbar}
          selectedRowsToolbar={() => []}
          defaultPageSize={undefined}
          rowSelection={null}
          scroll={{ y: "calc(100vh - 320px)" }}
          height={"calc(-115px + 100vh)"}
          funcCode={authority + "-detail"}
        />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PurchaseStrategyLotPlanEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        delVisible && (
          <Modal
            title="删除数据"
            footer={
              <Space>
                <Button onClick={() => setDelVisible(false)}>我再想想</Button>
                <Button type={"primary"} danger onClick={() => handleDel()}>
                  确认删除
                </Button>
              </Space>
            }
            open={delVisible}
            onOk={handleDel}
            onCancel={() => setDelVisible(false)}
          >
            <p>是否删除当前的数据: {selectedRecord?.form_no ?? selectedRecord?.lot_no ?? '--'}</p>
          </Modal>
        )
      }
    </>
  )
}

export default connect()(PurchaseStrategyLotPlanDetail);
