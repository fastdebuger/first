import React, { useRef, useState } from 'react';
import { Button, message, Tag } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { CONTRACTOR_STATUS_CONFIG } from "@/common/common";

import { configColumns } from "./columns";


/**
 * 承包商人员信息
 * @constructor
 */
const PersonInfoPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  /**
 * 处理承包商人员信息列表中审批状态的函数
 * @param selectedRecord 选中的记录对象，包含需要审批的数据
 * @param state 审批状态值，用于标识审批结果
 */
  const handleApprovalStatusFn = (selectedRecord: any, state: number) => {
    // 检查选中的值是否存在
    if (selectedRecord) {
      // 发起审批请求
      dispatch({
        type: 'personInfo/approvalPersonBlackList',
        payload: {
          id: selectedRecord?.id,
          approval_result: state
        },
        callback: (res: any) => {
          // 根据审批结果显示相应提示信息
          if (res.errCode === ErrorCode.ErrOk) {
            message.success('审批通过！');
            // 审批成功后重新加载表格数据
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          } else {
            message.error('审批失败！');
          }
        }
      })
    }
  }
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "wbs_name",
      "person_name",
      "id_card_no",
      'contract_out_name',
      "team_name",
      "position_name",
      "certificate_type",
      "certificate_no",
      'reason',
      "entry_date_str",
      "create_person",
      {
        title: "compinfo.person_status_name",
        subTitle: "人员状态",
        dataIndex: "status",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          const statusStr = String(text);
          const config = CONTRACTOR_STATUS_CONFIG[statusStr];
          // 如果后台返回的null，则返回 -
          if (!config) {
            return <>-</>;
          }
          return <Tag color={config.color}>{config.text}</Tag>;
        }
      },
      {
        title: "compinfo.approval_status",
        subTitle: "是否处理",
        dataIndex: "approval_status",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          const numText = Number(text);
          if (numText === 1) {
            return <Tag color='success'>已处理</Tag>
          } else if (numText === 0) {
            return <Tag color='gold'>待处理</Tag>
          }
          return '-'
        }
      }

    ])
      .needToFixed([
        { value: 'approval_status', fixed: 'right' }
      ])
      .needToExport([
        "wbs_name",
        "person_name",
        "id_card_no",
        'contract_no',
        "team_name",
        "position_name",
        "certificate_type",
        "certificate_no",
        'reason',
        "entry_date_str",
        "create_person",
        'person_status_name'
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    const showBlackButton = selectedRows.every((item: any) => Number(item.status) === -1);
    return showBlackButton && [
      <Button
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
          handleApprovalStatusFn(selectedRows[0], 1);
        }}
      >
        审批通过
      </Button>,
      <Button
        type={"primary"}
        danger
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          handleApprovalStatusFn(selectedRows[0], 0);
        }}
      >
        审批驳回
      </Button>,
    ]
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='承包商人员审批信息'
        type="personInfo/getPersonBlackList"
        exportType="personInfo/getPersonBlackList"
        tableColumns={getTableColumns()}
        funcCode={authority + '承包商人员审批信息'}
        tableSortOrder={{ sort: 'entry_date', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />


    </>
  )
}
export default connect()(PersonInfoPage);
