import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import {hasPermission} from "@/utils/authority";

import BusinessPartnerEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 往来单位详情
 * @param props
 * @constructor
 */
const BusinessPartnerDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
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
      "id",
      "group_code",
      "business_partner_code",
      "client_code",
      "supplier_code",
      "name_1",
      "search_2",
      "unit_category",
      "unit_category_description",
      "unit_type",
      "unit_type_description",
      "company_type",
      "company_type_description",
      "company_size",
      "company_size_description",
      "belong_company_type",
      "belong_company_type_description",
      "belong_company_name",
      "belong_company_name_description",
      "contact_hongkong",
      "contact_hongkong_description",
      "contact_inter",
      "contact_inter_description",
      "operation_status",
      "operation_status_description",
      "organization_code",
      "internal_employee_code",
      "trade_partner",
      "company_name",
    ])
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{display: hasPermission(authority, '删除') ? 'inline' : 'none'}} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "businessPartner/deleteBusinessPartner",
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
        title="往来单位"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        {/* <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="关联业务清单" key="1">
            自行追加与设备计费科目相关的业务清单
          </Tabs.TabPane>
        </Tabs> */}
      </CrudQueryDetailDrawer>
      {editVisible && (
        <BusinessPartnerEdit
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

export default connect()(BusinessPartnerDetail);
