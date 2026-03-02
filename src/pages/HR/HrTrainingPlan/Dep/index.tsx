import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Modal, Space, Divider, Radio} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "../columns";
import HrTrainingPlanAdd from "../Add";
import HrTrainingPlanDetail from "../Detail";
import HrTrainingPlanEdit from "../Edit";
import { publishHrTrainingPlan } from '@/services/hr/hrTrainingPlan';

/**
 * 培训计划
 * @constructor
 */
const HrTrainingPlanPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const propKey = localStorage.getItem("auth-default-wbs-prop-key")
  const wbsCode = localStorage.getItem('auth-default-wbsCode');

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if(dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "wbs_code",
      "wbs_name",
      // "prop_key",
      "year",
      "start_date",
      "plan_name",
      "master_organizer_str",
      "plan_total_persons",
      "publish_status",
      "plan_type_str",
      'approval_status',
      'approval_date',
      "create_ts_str",
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
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>详情</a>
              {/* 未发布，审批完成的 才能发布*/}
              {Number(record.publish_status) !== 1 && Number(record.approval_status) === 2 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => {
                    Modal.confirm({
                      title: "发布",
                      content: "确定要发布吗？",
                      okText: "确定发布",
                      cancelText: "我再想想",
                      onOk: async () => {
                        const res = await publishHrTrainingPlan({
                          id: record.id,
                        })
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success("已发布");
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
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
    .setTableColumnToDatePicker([
      {value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
    .needToExport([
      // "id",
      "wbs_name",
      "prop_key",
      "year",
      "start_date",
      "plan_name",
      "master_organizer_str",
      "plan_total_persons",
      // "publish_status",
      "plan_type_str",
      // "approval_process_id",
      // "approval_status",
      // "approval_date",
      // "create_ts",
      // "create_tz",
      // "create_user_code",
      // "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
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
          if (Number(selectedRows[0].publish_status) === 1) {
            message.warn('已发布，不可操作');
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
          if (Number(selectedRows[0].publish_status) === 1) {
            message.warn('已发布，不可操作');
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
                type: "hrTrainingPlan/delHrTrainingPlan",
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
        tableTitle='项目培训计划'
        type="hrTrainingPlan/queryHrTrainingPlan"
        importType="hrTrainingPlan/importHrTrainingPlan"
        tableColumns={getTableColumns()}
        funcCode={'项目培训计划'}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        renderSelfToolbar={(reloadTable: any) => {
          return (
            <Radio.Group defaultValue="all" buttonStyle="solid" onChange={(e) => {
              const _val = e.target.value;
              reloadTable(_val === 'all' ? [
                {Key: 'prop_key', Val: propKey, Operator: '='},
                {Key: 'wbs_code', Val: wbsCode, Operator: '='},
              ] :[
                {Key: 'prop_key', Val: propKey, Operator: '='},
                {Key: 'approval_status', Val: _val, Operator: '='},
                {Key: 'wbs_code', Val: wbsCode, Operator: '='},
              ]);
            }}>
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="0">待审批</Radio.Button>
              <Radio.Button value="1">审批中</Radio.Button>
              <Radio.Button value="2">审批完成</Radio.Button>
              <Radio.Button value="-1">审批驳回</Radio.Button>
            </Radio.Group>
          )
        }}
        tableDefaultFilter={[
          {Key: 'prop_key', Val: propKey, Operator: '='},
          {Key: 'wbs_code', Val: wbsCode, Operator: '='},
        ]}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <HrTrainingPlanDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <HrTrainingPlanAdd
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
        <HrTrainingPlanEdit
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
    </div>
  )
}
export default connect()(HrTrainingPlanPage);
