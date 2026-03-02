import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, DatePicker, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import ResourceOngoingProjectAdd from "./Add";
import ResourceOngoingProjectDetail from "./Detail";
import ResourceOngoingProjectEdit from "./Edit";
import moment from 'moment';
import {ConnectState} from "@/models/connect";

/**
 * 在建项目资源结转情况
 * @constructor
 */
const ResourceOngoingProjectPage: React.FC<any> = (props) => {
  const { dispatch, sysBasicDictList, route: { authority } } = props;
  const actionRef: any = useRef();
  const findObj = sysBasicDictList.find(s => s.type === 'IS_LOCK_RESOURCE');

  const currYear = moment().year();
  const [year, setYear] = React.useState<any>(currYear);
  const [currDate, setCurrDate] = React.useState<any>(moment());

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
      'year',
      {
        title: "compinfo.wbs_define_code",
        subTitle: "WBS项目定义",
        dataIndex: "wbs_define_code",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return <a onClick={() => {
            setSelectedRecord(record);
            setOpen(true);
          }}>{text}</a>;
        },
      },
      "wbs_define_name",
      "contract_sign_year_str",
      "inOrOut",
      "relative_person_code",
      "owner_name",
      "inside_outside_group",
      "income_method",
      "project_location",
      "contract_say_price",
      "after_change_price_en",
      "rate",
      "change_price_zh",
      "hetong_shouru_cha",
      "add_rate",
      // "is_finish_no_close",
      "is_finish_no_close_str",
      "in_company_jia_name",
      "contract_sign_date",
      "contract_start_date",
      "contract_area",
      "project_jiexie_date",
      "project_finish_date",
      "company_a_b",
      "expected_revenue_price",
      "expected_cost",
      "gross_profit",
      "operating_revenue",
      "cost_price",
      "finance_price",
      "profit_total_price",
      "income_tax",
      "net_profix",
      "net_profix_rate",
      "profit_center_code",
      "remark",
    ])
      .setTableColumnToDatePicker([
        {value: 'contract_sign_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'project_jiexie_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'project_finish_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToExport([
        "id",
        "wbs_define_code",
        "wbs_define_name",
        "contract_sign_year",
        "inOrOut",
        "relative_person_code",
        "owner_name",
        "inside_outside_group",
        "income_method",
        "project_location",
        "contract_say_price",
        "after_change_price_en",
        "rate",
        "change_price_zh",
        "hetong_shouru_cha",
        "add_rate",
        "is_finish_no_close",
        "in_company_jia_name",
        "contract_sign_date",
        "contract_start_date",
        "contract_area",
        "project_jiexie_date",
        "project_finish_date",
        "company_a_b",
        "expected_revenue_price",
        "expected_cost",
        "gross_profit",
        "operating_revenue",
        "cost_price",
        "finance_price",
        "profit_total_price",
        "income_tax",
        "net_profix",
        "net_profix_rate",
        "profit_center_code",
        "remark",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if(findObj && findObj.value === 'Y') {
      return []
    }

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
        {/*<Button*/}
        {/*  type="primary"*/}
        {/*  style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}*/}
        {/*  onClick={(e) => {*/}
        {/*    e.stopPropagation();*/}
        {/*    setVisible(true);*/}
        {/*  }}*/}
        {/*>导入</Button>*/}
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
    if(findObj && findObj.value === 'Y') {
      return []
    }
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
                type: "resourceOngoingProject/delResourceOngoingProject",
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
    <div key={findObj}>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        key={year}
        tableTitle='在建项目资源结转情况'
        type="resourceOngoingProject/queryResourceOngoingProject"
        importType="resourceOngoingProject/importResourceOngoingProject"
        tableColumns={getTableColumns()}
        funcCode={'在建项目资源结转情况'}
        renderSelfToolbar={() => {
          return (
            <Space align={'baseline'}>
              <DatePicker picker={'year'} value={currDate} onChange={(date, dateString) => {
                setCurrDate(date);
                if(date) {
                  setYear(date.format('YYYY'));
                }
              }}/>
              {findObj && findObj.value === 'Y' && (
                <Alert type={'warning'} message={'公司级已开启锁定，锁定期间不能做任何的操作'}/>
              )}
            </Space>
          )
        }}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        tableDefaultFilter={[
          {Key: 'year', Val: year, Operator: '='}
        ]}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <ResourceOngoingProjectDetail
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
        <ResourceOngoingProjectAdd
          visible={addVisible}
          year={year}
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
        <ResourceOngoingProjectEdit
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

export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(ResourceOngoingProjectPage);
