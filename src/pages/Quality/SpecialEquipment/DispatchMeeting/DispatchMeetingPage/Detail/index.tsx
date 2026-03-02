import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import DispatchMeetingEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 特种设备每月质量安全调度会议纪要信息详情
 * @param props
 * @constructor
 */
const DispatchMeetingDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch, title, special_equip_type } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'meeting_place',
      "meeting_date",
      "meeting_moderator",
      "conferee",
      "remark",
      // "meeting_content1",
      // "meeting_content2",
      // "meeting_content3",
      // "meeting_content4",
      // "meeting_content5",
      // "meeting_content6",
    ])
      .setTableColumnToDatePicker([
        { value: 'meeting_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
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
      type: "dispatchMeeting/delInfo",
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

  // 定义内容字段列表
  const contentFields = [
    "meeting_content1",
    "meeting_content2",
    "meeting_content3",
    "meeting_content4",
    "meeting_content5",
    "meeting_content6"
  ];

  // 封装样式变量
  const meetingContentStyle = {
    container: {
      width: '100%',
      margin: '20px auto',
      padding: '8px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      fontFamily: '"Microsoft YaHei", sans-serif'
    },
    title: {
      margin: '0 0 20px 0',
      paddingBottom: '12px',
      borderBottom: '1px solid #f0f0f0',
      color: '#1f2937',
      fontSize: '18px',
      fontWeight: 600
    },
    contentList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    item: {
      margin: 0,
      lineHeight: '1.6',
      fontSize: '14px',
      color: '#374151'
    },
    label: {
      display: 'inline-block',
      minWidth: '120px',
      fontWeight: 500,
      color: '#1f2937'
    },
    value: {
      color: '#4b5563'
    }
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="特种设备每月质量安全调度会议纪要信息"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <div style={meetingContentStyle.container}>
          <h3 style={meetingContentStyle.title}>会议内容详情</h3>
          <div style={meetingContentStyle.contentList}>
            {contentFields.map((field) => (
              <p key={field} style={meetingContentStyle.item}>
                <span style={meetingContentStyle.label}>{formatMessage({ id: `DispatchMeeting.${field}` })}：</span>
                <span style={meetingContentStyle.value}>{selectedRecord[field] || '-'}</span>
              </p>
            ))}
          </div>
        </div>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <DispatchMeetingEdit
          title={title}
          special_equip_type={special_equip_type}
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

export default connect()(DispatchMeetingDetail);
