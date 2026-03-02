import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import SupplierInfoEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 供应商信息台账详情
 * @param props
 * @constructor
 */
const SupplierInfoDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "supplier_code",
      "supplier_name",
      "supplier_status",
      "supplier_level",
      "collaboration_status",
      "bank_account",
      "address",
      "product_access",
      "contact_person",
      "contact_phone",
      "supply_content",
      // "dep_code",
      "remark",
      // "form_maker_code",
      "form_maker_name",
      // "form_make_time",
      // "form_make_tz",
    ])
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "supplierInfo/deleteSupplierLedger",
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
        rowKey="supplier_code"
        title="供应商信息台账"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <SupplierInfoEdit
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
        <p>确定删除所选的内容?</p>
      </Modal>
    </>
  );
};

export default connect()(SupplierInfoDetail);
