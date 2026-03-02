import React, { useEffect, useRef, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import DebtStatisticsEdit from "../Edit";
import { configColumns } from "../columns";
import IncomeContract from "@/components/Ledger/income";
import ExpenseControl from "@/components/Ledger/expenseControl";
import Contract from "@/components/Ledger/contract";
import Subcontractor from "@/components/Ledger/subcontractor";
import Contractor from "@/components/Ledger/contractor";
import ProgressPayment from "@/components/ProgressPayment";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 债权填报表详情
 * @param props
 * @constructor
 */
const DebtStatisticsDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch, selectedKeys } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const incomeActionRef = useRef();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTableColumns = () => {

    // 从选中的季度中提取年份（格式：2025Q4）
    const selectedQuarter = selectedKeys.length > 0 ? selectedKeys[0] : '';
    const selectedYear = String(selectedQuarter)?.match(/^(\d{4})/)?.[1] || selectedQuarter;
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "wbs_code",
      "contract_name",
      "contract_no",
      "relative_person_code",
      "owner_unit_name",
      "settlement_status_str",
      "contract_say_price",
      "expected_settlement_amount",
      "progress_settlement_current_year",
      "progress_settlement_total",
      "received_cash",
      "received_bill",
      "received_material",
      "received_other",
      "received_subtotal",
      "book_receivable_balance",
      "advance_receipt_balance",
      "net_receivable_amount",
      "net_receivable_analysis",
      {
        title: `${selectedYear}年内可回收（元）`,
        subTitle: `${selectedYear}年内可回收`,
        dataIndex: "net_receivable_recover_in_year",
        width: 160,
        align: "center",
        render: (text: any) => {
          return <span>{text}</span>;
        },
      },
      {
        title: `${selectedYear}年后可回收（元）`,
        subTitle: `${selectedYear}年后可回收`,
        dataIndex: "net_receivable_recover_after_year",
        width: 160,
        align: "center",
        render: (text: any) => {
          return <span>{text}</span>;
        },
      },
      "net_receivable_bad_debt",
      "expected_receivable_amount",
      "total_invoice_count",
      "collection_plan_reason",
      "responsible_person",
      "account_name",
      "profit_center_code",
      "counterparty_risk",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        { value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button key="edit" style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button key="delete" style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "debtStatistics/deleteDebtStatistics",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_name"
        title="债权填报表"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="收入合同" key="1">
            {selectedRecord?.contract_income_id ? (
              <IncomeContract
                selectedRecord={{ contract_income_id: selectedRecord.contract_income_id }}
                actionRef={incomeActionRef}
                authority={authority}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="预结算费控中心" key="3">
            {selectedRecord?.contract_income_id ? (
              <ExpenseControl
                dispatch={dispatch}
                selectedRecord={{ id: selectedRecord.contract_income_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="支出合同" key="4">
            {selectedRecord?.contract_income_id ? (
              <Contract
                authority={authority}
                selectedRecord={{ id: selectedRecord.contract_income_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="分包商" key="5">
            {selectedRecord?.contract_income_id ? (
              <Subcontractor
                authority={authority}
                selectedRecord={{ id: selectedRecord.contract_income_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="承包商" key="6">
            {selectedRecord?.contract_income_id ? (
              <Contractor
                authority={authority}
                selectedRecord={{ id: selectedRecord.contract_income_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="统计分析" key="7">
            {selectedRecord?.contract_income_id ? (
              <ProgressPayment
                selectedRecord={{ id: selectedRecord.contract_income_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的收入合同</div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <DebtStatisticsEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
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
        <p>是否删除当前的数据: {selectedRecord.id}</p>
      </Modal>
    </>
  );
};

export default connect()(DebtStatisticsDetail);
