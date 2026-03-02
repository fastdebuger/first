import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, message, Modal, Space } from "antd";
import { connect, useLocation, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import ExperienceAdd from "./Add";
import ExperienceDetail from "./Detail";
import ToDoListAdd from '../ToDoListAdd';
import ViewTheReport from '@/components/ViewTheReport';

/**
 * 风险管控
 * @constructor
 */
const CollectionOfRiskIncidents: React.FC<any> = (props) => {
  const { dispatch, route: { authority }, allUserListList } = props;
  const actionRef: any = useRef();
  const location = useLocation();
  const queryType = location?.query?.type;

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [queryParamsType, setQueryParamsType] = useState("");
  const [addToDoVisible, setAddToDoVisible] = useState(false);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'projectRiskGovernance/queryRiskMonitoringProjectName',
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([])
        }
      });
    }
  }, [])


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

  // 初始化数据
  useEffect(() => {
    if (dispatch) {
      //allUserListList没有数据的时候，请求数据
      if (allUserListList?.length === 0) {
        // 查看人员
        dispatch({
          type: "common/queryUserInfo",
          payload: {
            sort: 'user_code',
            order: 'desc',
            filter: JSON.stringify([
              { "Key": "other_account", "Operator": "=", "Val": "01" }
            ]),
            prop_key: PROP_KEY
          }
        });
      }

    }
  }, [])

  /**
   * 配置表格列
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "secondary_name",
      "project_manager_name",
      "project_manager",
      {
        title: 'ProjectRiskGovernance.project_name',
        subTitle: '工程名称',
        dataIndex: 'project_name',
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
      "project_level",
      "risk_manager",

    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
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

    const selectedRecord = selectedRows[0]
    return [
      <ViewTheReport
        query={"?viewlet=WeldSys2.0/Quality/Risk-Registration.cpt&main_id=" + selectedRecord?.main_id}
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
                type: "projectRiskGovernance/delInfo",
                payload: {
                  main_id: selectedRecord['main_id'],
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
        rowKey="RowNumber"
        tableTitle='项目风险管控'
        type="projectRiskGovernance/queryMainInfo"
        exportType="projectRiskGovernance/queryMainInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + 'projectRiskGovernance'}
        rowSelection={{ type: 'radio' }}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <ExperienceDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => {
            setOpen(false)
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
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
          title='新增风险管控'
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

      {addToDoVisible && (
        <ToDoListAdd
          funcCode="D51F902"
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

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(CollectionOfRiskIncidents);
