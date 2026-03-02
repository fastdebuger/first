import React, { useRef, useState } from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import { hasPermission } from "@/utils/authority";
import { Button, message, Modal, Space } from "antd";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";

import { configColumns } from "./columns";
import TechnologyArchiveListAdd from "./Add";
import TechnologyArchiveListEdit from "./Edit";
import TechnologyArchiveListDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";
import ViewApproval from "@/components/Approval/ViewApproval";
import InitiateApprovalSelection from "@/components/Approval/InitiateApprovalSelection";

import { getPrintUrl } from '@/utils/utils';
import IframeComponent from '@/components/IframeComponent';
import { WBS_CODE } from "@/common/const";
/**
 * 归档清单
 * @param props
 * @constructor
 */
const TechnologyArchiveListPage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const [printUrl, setPrintUrl] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "工程名称",
        subTitle: "工程名称",
        dataIndex: "contract_out_name",
        width: 160,
        align: "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      'record_name',
      'form_maker_name',
      'status_str',
      'approval_date_str',
      'form_make_time',
    ]).initBodyTableColumns([
      'record_name_b',
      'unit',
      'archive_num',
      'transfer_date_str',
      'remark',
    ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'transfer_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  };


  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      [
        <Space>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "新增") ? "inline-block" : "none" }}
            onClick={() => {
              setAddVisible(true);
            }}
          >新增</Button>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        </Space>
      ],
      [],
      [
        <Button
          type={"primary"}
          style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      ]
    ]
  }

  return (
    <div>
      <BaseHeaderAndBodyTable
        cRef={actionRef}
        tableTitle='归档清单'
        header={{
          sort: "form_make_time",
          order: "desc",
          rowKey: "form_no",
          type: "technologyArchiveList/queryTechnologyArchiveListHead",
          exportType: "technologyArchiveList/queryTechnologyArchiveListHead",
          importType: "",
        }}
        scan={{
          sort: "form_make_time",
          order: "desc",
          rowKey: "RowNumber",
          type: "technologyArchiveList/queryTechnologyArchiveListFlat",
          exportType: "technologyArchiveList/queryTechnologyArchiveListFlat",
          importType: "",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        funcCode={authority + '归档清单'}
        selectedRowsToolbar={() => {
          return {
            headerToolbar: (
              selectedRows: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => {
              let allowedApproval = true
              // 判断如果审批流程号存在那么无法重新发起审批
              if (selectedRows[0]?.status === 0 || selectedRows[0]?.status === -1) {
                allowedApproval = true
              } else {
                allowedApproval = false

              }
              return [
                <Button
                  type={"primary"}
                  style={{ display: hasPermission(authority, "编辑") ? "inline-block" : "none" }}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warn('每次编辑一行数据')
                      return;
                    }
                    if (selectedRows[0]?.status !== 0 && selectedRows[0]?.status !== -1) {
                      message.warning("当前数据已进行审批无法更改");
                      return;
                    }
                    setSelectedRecord(selectedRows[0])
                    setEditVisible(true);
                  }}
                >编辑</Button>,

                // 发起审批
                <InitiateApprovalSelection
                  key={selectedRows[0]?.form_no || 'default'} // 添加key属性强制重新渲染
                  selectedRecord={selectedRows[0]}
                  recordId={selectedRows[0]?.form_no}
                  funcode={'S39'}
                  allowedApproval={allowedApproval}
                  onSuccess={() => {
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }}
                />,
                // 查看审批
                <ViewApproval
                  key={`view-${selectedRows[0]?.form_no || 'default'}`} // 添加key属性强制重新渲染
                  instanceId={selectedRows[0]?.approval_process_id}
                  funcCode={'S39'}
                  selectedRecord={selectedRows[0]}
                  onSuccess={() => {
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }}
                />,
                <Button
                  key={authority + 'print'}
                  // style={{ display: hasPermission(authority, '打印') ? 'inline' : 'none' }}
                  type="primary"
                  onClick={() => {
                    setIframeVisible(true);
                    setPrintUrl(getPrintUrl('TQID', 'Archiving-List', {
                      form_no: selectedRows[0]?. form_no,
                    }));
                  }}
                >
                  打印
                </Button>,
                <Button
                  style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
                  danger
                  type={"primary"}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warning("每次只能删除一条数据");
                      return;
                    }
                    if (selectedRows[0]?.status !== 0) {
                      message.warning("当前数据已进行审批无法更改");
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
                          type: "technologyArchiveList/delTechnologyArchiveList",
                          payload: {
                            form_no: selectedRows[0]['form_no'],
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
                </Button>,
              ]
            },
            scanToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [],
          }
        }}
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && (
        <TechnologyArchiveListDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <TechnologyArchiveListEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <TechnologyArchiveListAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {iframeVisible && (
        <IframeComponent
          visible={iframeVisible}
          cancel={() => setIframeVisible(false)}
          title="归档清单"
          url={printUrl}
        />
      )}
    </div>
  )
}
export default connect()(TechnologyArchiveListPage);
