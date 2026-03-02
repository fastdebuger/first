import React, { useRef, useState } from 'react';
import { Button, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { PROP_KEY } from "@/common/const";
import { configColumns } from "@/pages/ScheduleManagement/BasicInfoManage/ProjectBasicInfo/columns";
import ContractScore from "./ContractScoreAdd";
import ContractScoreEdit from "./ContractScoreEdit";
import ContractScoreDetail from "./ContractScoreDetail";

/**
 * 合同评价信息
 * @constructor
 */
const ContractEvaluation: React.FC<any> = (props) => {
  const { selectedRecord, getInterfaceData } = props;
  const actionRef: any = useRef();
  // 当前选中的数据
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  // 控制去打分的状态
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // 控制编辑去打分的状态
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);
  // 控制详情的状态
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);

  // 判断模块公司层级以及分公司层级和项目部层级
  const getDefaultFiltersEngine = () => {
    // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
    switch (PROP_KEY) {
      // 公司级
      case 'branchComp':
        return [];
      // 分公司
      case 'subComp':
        return [
          { Key: 'branch_comp_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=' }
        ];
        // 项目部
      case 'dep':
        return [
          { Key: 'dep_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }
        ];
      default:
        return [];
    }
  };
  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'contract_no',
      'contract_out_name',
      'contract_say_price',
      {
        title: "scheduleManagement.contract_start_date_format",
        subTitle: "合同开工日期",
        dataIndex: "contract_start_date_format",
        width: 160,
        align: "center",
        render: (text: any) => {
          return text
        }
      },
      'contract_end_date_format',
      'project_score',
      'annual_completed_amount',
      'project_category_str',
      'project_principal',
      {
        "title": "compinfo.action",
        "subTitle": "评价",
        "dataIndex": "action",
        "width": 210,
        "align": "center",
        render(_text: any, record: any) {
          return (
            <Space>
              <Button
                type='link'
                size='small'
                disabled={!record.id}
                onClick={() => {
                  setCurrentRecord(record);
                  setIsDetailVisible(true);
                }}
              >查看</Button>
              <Button
                type='link'
                size='small'
                disabled={selectedRecord?.is_publish === 1 || !record.id}
                onClick={() => {
                  setCurrentRecord(record);
                  setIsEditVisible(true);
                }}
              >修改分数</Button>
              <Button
                type='link'
                size='small'
                disabled={record.id}
                onClick={() => {
                  setCurrentRecord(record);
                  setIsVisible(true);
                }}
              >去打分</Button>
            </Space>
            
          )
        }
      }
    ])
    .noNeedToFilterIcon(['action'])
    .noNeedToSorterIcon(['action'])
    .needToFixed([
      { value: 'action' ,fixed: 'right' }
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
    return []
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        renderSelfHeader={()=><></>}
        type="appraiseInfo/getScore"
        exportType="appraiseInfo/getScore"
        tableColumns={getTableColumns()}
        funcCode={'getScore'}
        tableSortOrder={{ sort: 'id', order: 'asc', }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        renderSelfToolbar={() => {
          return (
            <Space>
              <span>承包商名称：<b>{selectedRecord?.contractor_name}</b></span>
              <span>承包商项目经理：<b>{selectedRecord?.contractor_manager}</b></span>
              <span>所属年份：<b>{selectedRecord?.belong_year}</b></span>
            </Space>
            
          )
        }}
        rowSelection={null}
        tableDefaultFilter={getDefaultFiltersEngine()}
        tableDefaultField={{
          head_id: selectedRecord?.head_id || null,
          belong_year: selectedRecord?.belong_year || null,
          contractor_name: selectedRecord?.contractor_name || null,
        }}
      />
      {
        isVisible && (
          <ContractScore
            visible={isVisible}
            selectedRecord={selectedRecord}
            currentRecord={currentRecord}
            getInterfaceData={getInterfaceData}
            onCancel={() => setIsVisible(false)}
            callbackSuccess={() => {
              setIsVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {
        isEditVisible && (
          <ContractScoreEdit
            visible={isEditVisible}
            selectedRecord={selectedRecord}
            currentRecord={currentRecord}
            getInterfaceData={getInterfaceData}
            onCancel={() => setIsEditVisible(false)}
            callbackSuccess={() => {
              setIsEditVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {
        isDetailVisible && (
          <ContractScoreDetail
            visible={isDetailVisible}
            selectedRecord={selectedRecord}
            currentRecord={currentRecord}
            getInterfaceData={getInterfaceData}
            onCancel={() => setIsDetailVisible(false)}
            callbackSuccess={() => {
              setIsDetailVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
    </div>
  )
}
export default connect()(ContractEvaluation);
