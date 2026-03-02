import React, { useEffect, useRef, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import {hasPermission} from "@/utils/authority";

import ProjectInformationEdit from "../Edit";
import { configColumns } from "../columns";
import IncomeContract from "@/components/Ledger/income";
import ExpenseControl from "@/components/Ledger/expenseControl";
import Contract from "@/components/Ledger/contract";
import Subcontractor from "@/components/Ledger/subcontractor";
import Contractor from "@/components/Ledger/contractor";
import ProgressPayment from "@/components/ProgressPayment";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 项目信息详情
 * @param props
 * @constructor
 */
const ProjectInformationDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
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
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      "wbs_define_code",
      "wbs_define_name",
      "profit_center_code",
      "owner_group_name",
      "client_name",
      "contract_start_date",
      "actual_start_date",
      "contract_end_date",
      "actual_end_date",
      "contract_say_price",
      "contract_un_say_price",
      "engineering_calc_finish_amount",
      "project_status_str",
      "settlement_status_str",
      "project_level",
      "company_supervision_user",
      "sub_company_manager",
      "sub_company_supervision_user",
      "project_manager",
      "project_sub_engine_manager",
      "project_sub_settlement_manager",
      "project_finance_user",
      "remark",
    ])
      // .setTableColumnToDatePicker([
      //   {value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      //   {value: 'actual_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      //   {value: 'contract_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      //   {value: 'actual_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      // ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "projectInformation/deleteProjectInformation",
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
        rowKey="wbs_define_code"
        title="项目信息"
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
        <ProjectInformationEdit
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
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(ProjectInformationDetail);
