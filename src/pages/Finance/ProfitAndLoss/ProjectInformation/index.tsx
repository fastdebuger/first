import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import ProjectInformationAdd from "./Add";
import ProjectInformationDetail from "./Detail";
import ProjectInformationEdit from "./Edit";
import {ErrorCode} from "@/common/const";
import EveryMonthlyRecord from '@/components/EveryMonthlyRecord';

/**
 * 项目信息
 * @constructor
 */
const ProjectInformationPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
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
      "wbs_define_code",
      "wbs_define_name",
      {
        title: "compinfo.contract_no",
        subTitle: "合同编码",
        dataIndex: "contract_no",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return <a onClick={() => {
            setSelectedRecord(record);
            setOpen(true);
          }}>{text}</a>;
        },
      },
      "profit_center_code",
      "owner_group_name",
      "client_name",
      "contract_start_date",
      "actual_start_date",
      "contract_end_date",
      "actual_end_date",
      "contract_say_price",
      "contract_un_say_price",
      "engineering_calc_finish_amount",
      "project_status_str",
      "settlement_status_str",
      "project_level_name",
      "company_supervision_user",
      "sub_company_manager",
      "sub_company_supervision_user",
      "project_manager",
      "project_sub_engine_manager",
      "project_sub_settlement_manager",
      "project_finance_user",
      "remark",
      {
        title: "compinfo.operate",
        subTitle: "操作",
        dataIndex: "operate",
        width: 160,
        align: "center",
        fixed: 'right',
        render(text, record, index) {
          return (
            <EveryMonthlyRecord contractNo={record.contract_no}/>
          )
        },
      },
    ])
    .needToFixed([
      {value: 'operate', fixed: 'right'}
    ])
      .needToExport([
        // "id",
        "wbs_define_code",
        "wbs_define_name",
        "profit_center_code",
        "owner_group_name",
        "client_name",
        "contract_start_date",
        "actual_start_date",
        "contract_end_date",
        "actual_end_date",
        "contract_say_price",
        "contract_un_say_price",
        "project_status_str",
        "settlement_status_str",
        "project_level_name",
        "company_supervision_user",
        "sub_company_manager",
        "sub_company_supervision_user",
        "project_manager",
        "project_sub_engine_manager",
        "project_sub_settlement_manager",
        "project_finance_user",
        "remark",
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
        <Button
          style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
        {/* 后台已做导入 不过还未测试 此处暂不需要导入 */}
        {/*<Button
          type="primary"
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>*/}
      </Space>,
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
      // 此处注释是因为：需求表明 不需要提供删除功能，只需要提供修改功能 以及 记录每次的修改日志即可
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
                type: "projectInformation/delProjectInformation",
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
        tableTitle='项目信息'
        type="projectInformation/queryProjectInformation"
        importType="projectInformation/importProjectInformation"
        tableColumns={getTableColumns()}
        funcCode={'项目信息'}
        renderSelfToolbar={() => {
          return (
            <Alert type="warning" message={'此业务只允许修改，不允许删除'}/>
          )
        }}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        tableDefaultFilter={[
          {Key: 'dep_code', Val: depCode, Operator: '='}
        ]}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <ProjectInformationDetail
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
        <ProjectInformationAdd
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
              return actionRef.current.importFile(file, 'projectInfo', () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('projectInfo');
            }
          }}
        />
      )}
      {editVisible && (
        <ProjectInformationEdit
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
export default connect()(ProjectInformationPage);
