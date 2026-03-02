import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import KnowledgeBaseEdit from "../Edit";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 知识库文件管理详情
 * @param props
 * @constructor
 */
const KnowledgeBaseDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "data_name",
      {
        title: "knowledgeBase.file_path",
        subTitle: "附件",
        dataIndex: "detailList",
        width: 160,
        align: "center",
        render: (_, record) => {
          const arr = record?.detailList || [];
          const fileName = arr.map(item => (
            <a
              style={{ paddingRight: 5 }}
              onClick={() => window.open(getUrlCrypto(item.file_path))}
            >
              {item.file_belong}
            </a>
          ))
          return fileName
        }
      },
      "remark",
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
      type: "knowledgeBase/delInfo",
      payload: {
        main_id: selectedRecord.main_id,
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
        rowKey="data_type"
        title="知识库文件管理"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <KnowledgeBaseEdit
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
        <p>是否删除当前的数据: {selectedRecord["main_id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(KnowledgeBaseDetail);
