import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns } from 'yayang-ui';
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import ProjectInformationDetail from "./Detail";

/**
 * 项目信息 公司级统计
 * @constructor
 */
const ProjectInformationStatistic: React.FC<any> = (props) => {
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
      // "wbs_define_code",
      "up_wbs_name",
      "dep_name",
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
      .needToExport([
        // "id",
        "up_wbs_name",
        "dep_name",
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
          style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
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

    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='项目信息(公司级）'
        type="projectInformation/queryProjectInformationStatistic"
        tableColumns={getTableColumns()}
        funcCode={'项目信息(公司级）'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
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
    </div>
  )
}
export default connect()(ProjectInformationStatistic);
