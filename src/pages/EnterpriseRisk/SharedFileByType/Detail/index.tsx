import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { configColumns } from "../columns";
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
import SharedFileByTypeEdit from "../Edit";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 公司风险管理文件详情
 * @param props
 * @returns
 */
const SharedFileByTypeDetail: React.FC<any> = (props: any) => {
  const { authority, open, onClose, selectedRecord, actionRef, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols: any = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'file_type',
      'remark',
      "user_names",
      "wbs_names",
      "create_by_name",
      "create_date_str",
    ])
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) })
    });
    return cols.getNeedColumns();
  };


  const renderButtonToolbar = () => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "sharedFileByType/delInfo",
      payload: {
        main_id: selectedRecord['main_id'],
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="unit_name"
        title="公司风险管理文件"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <div style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '12px' }}>附件明细 ({selectedRecord?.detailList?.length || 0})</h4>

          {selectedRecord?.detailList?.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}
            >
              {/* 展示 file_belong */}
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                归属: {item.file_belong}
              </div>

              {/* 展示 file_path */}
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                路径: <a href={item.file_path} target="_blank" rel="noreferrer" style={{ color: '#1890ff', wordBreak: 'break-all' }}>
                  {item.file_path}
                </a>
              </div>
            </div>
          ))}

          {(!selectedRecord?.detailList || selectedRecord.detailList.length === 0) && (
            <div style={{ color: '#999', textAlign: 'center' }}>暂无数据</div>
          )}
        </div>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <SharedFileByTypeEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        delVisible && (
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
            <p>是否删除当前的数据: {selectedRecord[""]}</p>
          </Modal>
        )
      }
    </>
  )
}

export default connect()(SharedFileByTypeDetail);
