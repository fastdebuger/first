import React, { useRef, useState } from "react";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { hasPermission } from "@/utils/authority";
import { Button, message, Modal, Space } from "antd";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";

import { configColumns } from "./columns";
import PurchaseStrategyAdd from "./Add";
import PurchaseStrategyEdit from "./Edit";
import PurchaseStrategyDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 物资及服务总体采购策略
 * @param props
 * @constructor
 */
const PurchaseStrategyPage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'RowNumber',
        'form_no',
        {
          title: 'compinfo.wbs_code',
          subTitle: '提报单位',
          dataIndex: 'wbs_name',
          width: 160,
          align: 'center',
          render: (text: any, record: any) => {
            return (
              <a
                onClick={() => {
                  setSelectedRecord(record);
                  setOpen(true);
                }}
              >
                {text}
              </a>
            );
          }
        },
        'project_loc_type_str',
        'report_category_str',
        'pre_audit_no',
        'decision_meeting_str',
        'topic_name',
        'batch_number',
        'submit_target_topic',
        'project_overview',
        'project_name',
        'is_confidential_str',
        'project_level_str',
        'project_code',
        'owner_name',
        'project_attr_str',
        'design_unit',
        'supervision_unit',
        'eng_summary',
        'handover_time_str',
        'completion_time_str',
        'strat_reply_time_str',
        'strat_reply_org',
        'strat_filing_time_str',
        'risk_desc',
        'contract_total_amt',
        'sub_proc_scale',
        'mat_proc_scale',
        'srv_proc_scale',
        'meeting_basis',
        'obtain_method_str',
        'contract_mode_str',
        'project_auth_str',
        'project_create_time_str',
        'project_submit_time_str',
        'project_approval_status_str',
        'project_time_str',
        'total_invest_amt',
        'sub_budget_ratio',
        'mat_budget_amt',
        'mat_budget_ratio',
        'srv_budget_amt',
        'srv_budget_ratio',
        'tax_rate',
        'select_req',
        'warranty_period_req',
        'origin_req',
        'owner_part_req',
        'contract_type_str',
        'currency_type',
        'icv_req',
        'select_rule_content',
        'tech_eval_rule',
        'biz_eval_rule',
        'tech_special_req',
        'biz_special_req',
        'expert_source',
        'non_bid_team_src',
        'non_bid_team_qual',
        'qty_change_plan',
        'next_step_plan',
        'form_maker_name',
        'form_make_time_str',
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToHide([
        'form_no'
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
   * 选中行操作按钮
   */
  const renderSelectedRowsToolbar = (selectedRows?: any[], reloadTable?: any) => {
    return [
      <Button
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
                type: "purchaseStrategy/deleteMaterialsPurchaseStrategy",
                payload: {
                  form_no: selectedRows[0]['form_no'],
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
    ];
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="form_no"
        tableTitle="物资及服务总体采购策略"
        moduleCaption="物资及服务总体采购策略"
        type="purchaseStrategy/getMaterialsPurchaseStrategy"
        exportType="purchaseStrategy/getMaterialsPurchaseStrategy"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        funcCode={authority + '总体采购策略管理'}
      />
      {open && (
        <PurchaseStrategyDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <PurchaseStrategyEdit
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
        <PurchaseStrategyAdd
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
export default connect()(PurchaseStrategyPage);
