import React, { useRef, useState } from 'react';
import { Space, Tag } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import ViewApproval from "@/components/Approval/ViewApproval";
import { ApprovalStatusTag } from "@/common/common";
import { configColumns } from "./columns";
import Detail from "../ProjectBasicInfo/Detail";

/**
 * 项目基础信息审批
 * @constructor
 */
const ProjectBasicInfoApproval: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 存储当前选中记录数据
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 控制详情弹窗显示状态
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  /**
   * 表格列配置
   * @returns 返回数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        "title": "scheduleManagement.project_name",
        "subTitle": "项目名称",
        "dataIndex": "project_name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setIsDetailVisible(true);
              }}
            >
              {text}
            </a>
          );
        }
      },
      'contract_start_date_format', //合同开工日期
      'contract_end_date_format', // 合同完工日期
      'contract_mode_name', // 合同类型

      // 项目等级
      'contract_say_price', //合同金额（含税）
      "project_status", // 项目状态（按新开工、按在执行、按完工、按累计执行、按计划完工）
      'report_dep_name',
      //  审批状态
      {
        "title": "scheduleManagement.flow_status",
        "subTitle": "审批状态",
        "dataIndex": "flow_status",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          if (typeof text === 'string' || typeof text === 'number') {
            return ApprovalStatusTag(text);
          }
          return '-';
        }

      },
      // 	录入日期
      'create_ts_format',
    ])
      .needToExport([
        "project_name",
        'project_name', // 
        'contract_start_date', //合同开工日期
        'contract_end_date', // 合同完工日期
        'contract_mode_name', // 合同类型

        // 项目等级
        'contract_say_price', //合同金额（含税）
        'report_dep_name',
        "project_status", // 项目状态（按新开工、按在执行、按完工、按累计执行、按计划完工）
        //  审批状态
        'flow_status',
        // 	录入日期
        'create_ts_format',
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable 重新加载表格
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>

      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      selectedRows?.length === 1 && (
        <ViewApproval
          // style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
          key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
          instanceId={selectedRows[0]?.approval_process_id}
          funcCode={'S27'}
          id={selectedRows[0]?.project_id}
          selectedRecord={selectedRows[0]}
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )
    ]
  }
  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="project_id"
        tableTitle={formatMessage({ id: 'scheduleManagement.ProjectBasicInfoApproval' })}
        type="basicInfo/getProjectBaseInfoList"
        exportType="basicInfo/getProjectBaseInfoList"
        tableColumns={getTableColumns()}
        funcCode={authority + 'ProjectBasicInfoApproval'}
        tableSortOrder={{ sort: 'modify_ts_format', order: 'desc' }}
        tableDefaultField={{ my_approval_task: '0' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {/* 在项目基础信息审批页面可以查看 上一个路由的信息 */}
      {
        isDetailVisible && (
          <Detail
            visible={isDetailVisible}
            onCancel={() => setIsDetailVisible(false)}
            selectedRecord={selectedRecord}
          />
        )
      }
    </>

  )
}
export default connect()(ProjectBasicInfoApproval);
