import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Divider, Drawer, message, Modal, Row, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import MessageAdd from "./Add";
import {queryMessageDetail, sendAnnouncementToReceiver} from "@/services/common/list";
// import SerialNumberConfigDetail from "./Detail";
// import SerialNumberConfigEdit from "./Edit";

/**
 * 单据号配置
 * @constructor
 */
const Message: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "title",
      // "sender_code",
      "sender_name",
      'create_ts_str',
      "send_time_str",
      'is_send_str',
      {
        title: "操作",
        subTitle: "id",
        dataIndex: "operate",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a
                onClick={async () => {
                  const res = await queryMessageDetail({
                    id: record.id,
                  })
                  if (res.result) {
                    setSelectedRecord(res.result);
                    setOpen(true);
                  }
                }}
                >查看内容</a>
              {record.is_send_str === '未发布' && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => {
                    Modal.confirm({
                      title: "公告",
                      content: "确定发送公告吗？",
                      okText: "确定",
                      cancelText: "我再想想",
                      onOk: async () => {
                        const res = await sendAnnouncementToReceiver({
                          id: record.id,
                        })
                        if (res.errCode === 0) {
                          actionRef.current?.reloadTable();
                        }
                      }
                    })
                  }}>发布</a>
                </>
              )}
            </>
          )
        }
      },
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
      .needToExport([
        "title",
        "content",
        // "sender_code",
        "sender_name",
        "send_time",
        'is_send_str'
      ])
      // .setTableColumnToDatePicker([
      //   { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      // ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
      </Space>,
      <a
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "serialNumberConfig/deleteSerialNumberConfig",
                payload: {
                  id: selectedRows[0]['id'],
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='系统公告'
        type="message/queryListBySender"
        exportType="message/queryListBySender"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        // tableDefaultField={{
        //   message_type: '1'
        // }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <Drawer
          width={'50%'}
          title={(
            <Row justify={'space-between'}>
              <Col>
                <h3>公告详情</h3>
              </Col>
              <Col>
                <Space>
                  {/*<Button type={'primary'} danger onClick={() => {
                    Modal.confirm({
                      title: '<UNK>',
                      content: '<UNK>',
                      onOk: () => {

                      }
                    })
                  }}>删除</Button>*/}
                </Space>
              </Col>
            </Row>
          )}
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
        >
          <h3>{selectedRecord.title}</h3>
          <div>
            <div dangerouslySetInnerHTML={{ __html: selectedRecord.content }} />
          </div>
        </Drawer>
      )}
      {addVisible && (
        <MessageAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(Message);
