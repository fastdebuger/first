import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, message, Modal, Space } from "antd";
import { connect, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import ExperienceAdd from "./Add";
import BatchApprovalModel from "./BatchApproval";
import ExperienceDetail from "./Detail";
import ExperienceEdit from "./Edit";
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';
import { useLocation } from 'umi';
import InitiateBetchApproval from '@/components/Approval/InitiateBetchApproval';
import ToDoListAdd from '../ToDoListAdd';
import ViewTheReport from '@/components/ViewTheReport';
/**
 * 风险事件收集
 * @constructor
 */
const CollectionOfRiskIncidents: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const location = useLocation();
  const queryType = location?.query?.type;
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [betchApprovalOpen, setBetchApprovalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [queryParamsType, setQueryParamsType] = useState("");
  const [addToDoVisible, setAddToDoVisible] = useState(false);

  /**
   * 处理代办事项提示是否展示
   */
  useEffect(() => {
    if (queryType) {
      setQueryParamsType(queryType)
    } else {
      setQueryParamsType("")
    }
  }, [queryType])


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "batch_id",
      "report_unit_name",
      "create_by_name",
      "push_unit_name",
      {
        title: 'CollectionOfRiskIncidents.risk_events_name',
        subTitle: '风险事件名称',
        dataIndex: 'risk_events_name',
        align: 'center',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      "risk_type_name",
      "risk_level_name",
      "category_name",
      "category_details_name",
      "happen_time_str",
      "scene",
      "situation_description",
      "injury_or_damage",
      "reason_analysis",
      "counter_measures",
      "is_litigation_name",
      "company_dept_name",
      "remark",

      "create_date_str",
      "audit_date_str",
      "report_type_name",
      "audit_status_name",

    ])
      .needToFixed([
        {
          value: "report_type_name",
          fixed: "right"
        },
        {
          value: "audit_status_name",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "batch_id",
        "report_unit_name",
        "create_by_name",
        "push_unit_name",
        'risk_events_name',
        "risk_type_name",
        "risk_level_name",
        "category_name",
        "category_details_name",
        "happen_time_str",
        "scene",
        "situation_description",
        "injury_or_damage",
        "reason_analysis",
        "counter_measures",
        "is_litigation_name",
        "company_dept_name",
        "remark",

        "create_date_str",
        "audit_date_str",
        "report_type_name",
        "audit_status_name",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space
        align="baseline"
      >
        <Button
          style={{ display: hasPermission(authority, '新增待办任务') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddToDoVisible(true)
          }}
        >
          新增待办任务
        </Button>
        <Button
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <ViewTheReport
          query="?viewlet=WeldSys2.0/Quality/Risk-Submit.cpt"
        />
      </Space>,
      <a
        // style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
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

    const selectedRecord = selectedRows[0]
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
          setSelectedRecord(selectedRecord);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      // 发起审批
      <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordId={selectedRecord?.id}
        selectedRecord={selectedRecord}
        allowedApproval={selectedRecord?.audit_status === "0"}
        dispatch={dispatch}
        funcode={'S30'}
        type='collectionOfRiskIncidents/sendApproval'
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <InitiateBetchApproval
        key={selectedRecord?.batch_id || 'new'}
        dispatch={dispatch}
        isApprovalAllowed={selectedRecord?.audit_status === "0"}
        funcode={'S30'}
        type='collectionOfRiskIncidents/sendApproval'
        fieldMapping={{
          idField: 'id',
        }}
        onSuccess={() => actionRef.current?.reloadTable()}
        // 详情相关
        tableTitle="待发起审批详情"
        tableType="collectionOfRiskIncidents/getInfo"
        tableColumns={getTableColumns}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        tableDefaultFilter={[
          { Key: 'batch_id', Val: selectedRecord?.batch_id, Operator: '=' },
          { Key: 'audit_status', Val: "0", Operator: '=' },
        ]}
      />,
      // 查看审批
      <ViewApproval
        back={false}
        key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
        instanceId={selectedRecord?.audit_id}
        funcCode={'S30'}
        number={selectedRecord?.number}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
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
                type: "collectionOfRiskIncidents/delInfo",
                payload: {
                  id: selectedRecord['id'],
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
      {queryParamsType && <Alert type='info' message="你有一条待办任务需要填报，点击新增按钮进行填报" />}
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='风险事件收集'
        type="collectionOfRiskIncidents/getInfo"
        exportType="collectionOfRiskIncidents/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + 'collectionOfRiskIncidentsGetInfo'}
        rowSelection={{ type: 'radio' }}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <ExperienceDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <ExperienceAdd
          queryParamsType={queryParamsType}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            history.replace({
              pathname: location.pathname,
              query: {},
            });
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        betchApprovalOpen && (
          <BatchApprovalModel
            visible={betchApprovalOpen}
            onCancel={() => setBetchApprovalOpen(false)}
            callbackSuccess={() => {
              setBetchApprovalOpen(false);
              history.replace({
                pathname: location.pathname,
                query: {},
              });
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
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
        <ExperienceEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addToDoVisible && (
        <ToDoListAdd
          funcCode="D51F901"
          visible={addToDoVisible}
          onCancel={() => setAddToDoVisible(false)}
          callbackSuccess={() => {
            setAddToDoVisible(false);
          }}
        />
      )}
    </div>
  )
}
export default connect()(CollectionOfRiskIncidents);
