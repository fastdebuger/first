import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Divider, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import HrTrainingClassAdd from "./Add";
import HrTrainingClassDetail from "./Detail";
import HrTrainingClassEdit from "./Edit";
import AIGenerateExamModal from "@/pages/HR/Common/AIGenerateExamModal";

/**
 * 培训班
 * @constructor
 */
const HrTrainingClassPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [createVisible, setCreateVisible] = useState(false);

  useEffect(() => {
    if(dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "wbs_code",
      // "prop_key",
      // "plan_id",
      "class_name",
      "organizer_str",
      "training_target",
      "training_type_str",
      "start_time",
      "end_time",
      "year",
      "plan_name",
      "master_organizer_str",
      "monitor",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
      {
        title: "compinfo.operate",
        subTitle: "操作",
        dataIndex: "operate",
        width: 230,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {
                setSelectedRecord(record);
                setCreateVisible(true);
              }}>AI出题</a>
              {/*{Number(record.publish_status) !== 1 && Number(record.approval_status) === 2 && (*/}
              <Divider type="vertical" />
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>详情</a>
              {/*{Number(record.publish_status) !== 1 && Number(record.approval_status) === 2 && (*/}
              <Divider type="vertical" />
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>配置课程/人员</a>
            </>
          )
        }
      },
    ])
    .setTableColumnToDatePicker([
      {value: 'start_time', valueType: 'dateTs', format: 'YYYY-MM-DD HH:mm'},
      {value: 'end_time', valueType: 'dateTs', format: 'YYYY-MM-DD HH:mm'},
      {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'},
      ])
    .needToExport([
      // "id",
      "wbs_code",
      "prop_key",
      "plan_id",
      "year",
      "organizer_str",
      "class_name",
      "training_target",
      "training_type_str",
      "start_time",
      "end_time",
      "monitor",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      "modify_ts",
      // "modify_tz",
      "modify_user_code",
      "modify_user_name",
    ])
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
          style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        {/*<Button
          type="primary"
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>*/}
      </Space>,
      <a
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
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
        style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1){
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
                type: "hrTrainingClass/delHrTrainingClass",
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
        tableTitle='培训班'
        type="hrTrainingClass/queryHrTrainingClass"
        importType="hrTrainingClass/importHrTrainingClass"
        tableColumns={getTableColumns()}
        renderSelfToolbar={() => {
          return (
            <Alert type={'info'} message={'开始时间、结束时间配置了课程后会自动提取'}/>
          )
        }}
        funcCode={'培训班'}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <HrTrainingClassDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => {
            setOpen(false)
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <HrTrainingClassAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if(actionRef.current) {
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {editVisible && (
        <HrTrainingClassEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {createVisible && (
        <AIGenerateExamModal
          isManager={true}
          selectedRecord={selectedRecord}
          visible={createVisible}
          onCancel={() => setCreateVisible(false)}
        />
      )}
    </div>
  )
}
export default connect()(HrTrainingClassPage);
