import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { configColumns } from "./columns";
import SEOnlineNotificationDetail from "./Detail";
import { Button } from 'antd';
import { hasPermission } from '@/utils/authority';

/**
 * 特种设备每日质量安全检查不合格记录
 * 1.压力容器制造(组焊、安装改造修理)
 * 2.压力管道
 * 3.锅炉
 * 4.起重机械
 * 5.压力管道元件
 * @constructor
 */
const QualitySafetyDailyCheckPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority }, title = '特种设备每日质量安全检查不合格记录', special_equip_type = "1" } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      {
        title: 'QualitySafetyDailyCheck.wbs_code',
        subTitle: '项目部',
        dataIndex: 'wbs_name',
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
      "preventive_measures",
      'control_process_name',
      'check_result',
      'handle_result',
      'quality_officer_name',
      'remark',
      "create_by_name",
      "create_date_str",
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToExport([
        "RowNumber",
        'wbs_name',
        "preventive_measures",
        'control_process_name',
        'check_result',
        'handle_result',
        'quality_officer_name',
        'remark',
        "create_by_name",
        "create_date_str",
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
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >
        导出
      </Button>
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
        tableTitle={title}
        moduleCaption={title}
        type="QualitySafetyDailyCheck/queryUnQuality"
        exportType="QualitySafetyDailyCheck/queryUnQuality"
        tableColumns={getTableColumns()}
        funcCode={authority + title}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={null}
        tableDefaultField={{
          special_equip_type
        }}
        tableDefaultFilter={[
          { Key: 'special_equip_type', Val: special_equip_type, Operator: '=' },
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
          { Key: 'is_qualified', Val: "0", Operator: '=' },
        ]}
      />
      {open && selectedRecord && (
        <SEOnlineNotificationDetail
          special_equip_type={special_equip_type}
          title={title}
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
    </div>
  )
}
export default connect()(QualitySafetyDailyCheckPage);
