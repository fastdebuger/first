import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import DebtPaymentStatisticsEdit from "../Edit";
import { configColumns } from "../columns";
import SubExpenseControl from "@/components/Ledger/SubExpenseControl";
import Income from "@/components/Ledger/income";
import SubcontractorContract from "@/components/Ledger/SubcontractorContract";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 债务填报表详情
 * @param props
 * @constructor
 */
const DebtPaymentStatisticsDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch, selectedKeys } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

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
      "subletting_enroll_name",
      "settlement_status_str",
      "contract_say_price",
      "final_or_expected_settlement_amount",
      "progress_settlement_current_year",
      "progress_settlement_total",
      "received_cash",
      "received_bill",
      "received_material",
      "received_other",
      "received_subtotal",
      "book_payable_balance",
      "advance_payment_balance",
      "net_payable_amount",
      "net_payable_current_year_available",
      "net_payable_quality_and_deposit",
      "net_payable_after_year",
      {
        title: `${selectedYear}年后可付款（元）`,
        subTitle: "应付款项净额分析- 年后付款金额",
        dataIndex: "net_payable_after_year",
        width: 160,
        align: "center",
        render: (text: any) => {
          return <span>{text}</span>;
        },
      },
      "net_payable_pending_writeoff",
      "expected_remaining_payable",
      "two_arrears_total_invoiced",
      "two_arrears_cost_not_invoiced",
      "two_arrears_expected_payment_ratio",
      "two_arrears_actual_payment_ratio",
      "two_arrears_remaining_by_ratio",
      "two_arrears_within_1_year",
      "two_arrears_1_to_3_years",
      "two_arrears_over_3_years",
      "two_arrears_due_to_funds_shortage",
      "two_arrears_reason_analysis",
      "contract_payment_clause",
      "contract_progress_ratio_contract",
      "account_name",
      "profit_center_code",
      "contract_category",
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
      type: "debtPaymentStatistics/deleteDebtPaymentStatistics",
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
        rowKey="id"
        title="债务填报表"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="预结算费控中心" key="1">
            {selectedRecord?.out_info_id ? (
              <SubExpenseControl
                authority={authority}
                selectedRecord={{ id: selectedRecord.out_info_id }}
                dispatch={dispatch}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的支出合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="收入合同" key="2">
            {selectedRecord?.out_info_id ? (
              <Income
                authority={authority}
                selectedRecord={{ id: selectedRecord.out_info_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的支出合同</div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="分包合同" key="5">
            {selectedRecord?.out_info_id ? (
              <SubcontractorContract
                authority={authority}
                selectedRecord={{ id: selectedRecord.out_info_id }}
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>暂无关联的支出合同</div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <DebtPaymentStatisticsEdit
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

export default connect()(DebtPaymentStatisticsDetail);
