import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Modal, Space, Divider, Radio} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from 'yayang-ui';
import {hasPermission} from "@/utils/authority";

import {configColumns} from "../columns";
import HrTrainingPlanDetail from "../Detail";

/**
 * 分公司培训计划审批
 * @constructor
 */
const ApprovalSubCompList: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

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
      // "approval_process_id",
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
              {Number(record.approval_status) === 0 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => {}}>审批</a>
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
      "approval_status_str",
      "approval_date",
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
      <Button
        type={'primary'}
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</Button>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='分公司培训计划审批'
        type="hrTrainingPlan/queryHrTrainingPlan"
        importType="hrTrainingPlan/importHrTrainingPlan"
        tableColumns={getTableColumns()}
        funcCode={'分公司培训计划审批'}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        renderSelfToolbar={(reloadTable: any) => {
          return (
            <Radio.Group defaultValue="all" buttonStyle="solid" onChange={(e) => {
              const _val = e.target.value;
              reloadTable(_val === 'all' ? [
                {Key: 'prop_key', Val: 'subComp', Operator: '='},
              ] :[
                {Key: 'prop_key', Val: 'subComp', Operator: '='},
                {Key: 'approval_status', Val: _val, Operator: '='}
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
          {Key: 'prop_key', Val: 'subComp', Operator: '='},
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
    </div>
  )
}
export default connect()(ApprovalSubCompList);
