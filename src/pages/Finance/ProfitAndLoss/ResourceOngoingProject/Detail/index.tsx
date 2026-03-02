import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";

import ResourceOngoingProjectEdit from "../Edit";
import { configColumns } from "../columns";
import FinalAccounts from "@/pages/Finance/ProfitAndLoss/ResourceOngoingProject/Common/FinalAccounts";
import SanJinAndJianZhi from "@/pages/Finance/ProfitAndLoss/ResourceOngoingProject/Common/SanJinAndJianZhi";
import FuZhai from "@/pages/Finance/ProfitAndLoss/ResourceOngoingProject/Common/FuZhai";
import InComeContract from "@/pages/Finance/ProfitAndLoss/ResourceOngoingProject/Detail/InComeContract";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 在建项目资源结转情况详情
 * @param props
 * @constructor
 */
const ResourceOngoingProjectDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, callbackSuccess, dispatch } = props;
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
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      "wbs_define_code",
      "wbs_define_name",
      "contract_sign_year",
      "inOrOut",
      "relative_person_code",
      "owner_name",
      "inside_outside_group",
      "income_method",
      "project_location",
      "contract_say_price",
      "after_change_price_en",
      "rate",
      "change_price_zh",
      "hetong_shouru_cha",
      "add_rate",
      "is_finish_no_close_str",
      "in_company_jia_name",
      "contract_sign_date",
      "contract_start_date",
      "contract_area",
      "project_jiexie_date",
      "project_finish_date",
      "company_a_b",
      "expected_revenue_price",
      "expected_cost",
      "gross_profit",
      "operating_revenue",
      "cost_price",
      "finance_price",
      "profit_total_price",
      "income_tax",
      "net_profix",
      "net_profix_rate",
      "profit_center_code",
      "remark",
    ])
      .setTableColumnToDatePicker([
        {value: 'contract_sign_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'project_jiexie_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'project_finish_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [

    ];
  };

  const handleDel = () => {
    dispatch({
      type: "resourceOngoingProject/deleteResourceOngoingProject",
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
        title="在建项目资源结转情况"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="item-1">
          <Tabs.TabPane tab="决算数据" key="item-2" forceRender={true}>
            <FinalAccounts disabled selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="三金数据及减值" key="item-3" forceRender={true}>
            <SanJinAndJianZhi disabled selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="负债" key="item-4" forceRender={true}>
            <FuZhai disabled selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="收入合同" key="item-5" forceRender={true}>
            <InComeContract selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <ResourceOngoingProjectEdit
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

export default connect()(ResourceOngoingProjectDetail);
