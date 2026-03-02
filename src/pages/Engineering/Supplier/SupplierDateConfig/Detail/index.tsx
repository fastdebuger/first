import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import {hasPermission} from "@/utils/authority";

import SupplierDateConfigEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 供应商打分日期配置详情
 * @param props
 * @constructor
 */
const SupplierDateConfigDetail: React.FC<any> = (props) => {
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
      "year",
      "upload_date",
      "score_date_start",
      "score_date_end",
      "create_ts",
      "create_tz",
      "create_user_code",
      "create_user_name",
      "modify_ts",
      "modify_tz",
      "modify_user_code",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        {value: 'upload_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'score_date_start', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'score_date_end', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ]);
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
      type: "supplierDateConfig/deleteSupplierDateConfig",
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
        title="供应商打分日期配置"
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
        <SupplierDateConfigEdit
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

export default connect()(SupplierDateConfigDetail);
