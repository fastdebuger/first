import React, { useEffect, useState } from "react";
import { Button, message, Modal, Popover, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";

import SupplierScoreEdit from "../Edit";
import { configColumns } from "../columns";
import SelectedSupplierContractScore
  from "@/pages/Engineering/Supplier/SupplierScore/Detail/SelectedSupplierContractScore";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 供应商得分详情
 * @param props
 * @constructor
 */
const SupplierScoreDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);

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
      "year",
      "supplier_name",
      "supplier_code",
      "supplier_type",
      "product_quality",
      "service_ability",
      "contract_performance",
      "price_level",
      {
        title: "compinfo.market_shares",
        subTitle: "市场份额",
        dataIndex: "market_shares",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <div>
              {text}
              <Popover content={(
                <div>
                  <p>供货金额排名：{record.amount_rank}</p>
                  <p>供货金额排名百分比：{Number(record.amount_rank_percent || 0) * 100}%</p>
                  <p>供货金额排名分：{record.amount_rank_score}</p>
                  <p>用户数量：{record.user_num}</p>
                  <p>用户数量排名：{record.user_rank}</p>
                  <p>用户数量排名分：{record.user_rank_score}</p>
                </div>
              )} title="分数来源" trigger="click">
                <a style={{marginLeft: 4}}>详情</a>
              </Popover>

            </div>
          )
        }
      },
      "technological_level",
      "integrity_management",
      "total_score",
      "delivery_amount",
      // "create_ts",
      // "create_tz",
      // "create_user_code",
      // "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [

    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="supplier_name"
        title="供应商得分"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="供应商合同打分明细" key="1">
            <SelectedSupplierContractScore selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <SupplierScoreEdit
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
    </>
  );
};

export default connect()(SupplierScoreDetail);
