import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { Button, Modal } from 'antd';
import { configColumns as archiveListColumns } from "../TechnologyArchiveList/columns";

import { configColumns } from "./columns";
import { hasPermission } from '@/utils/authority';

/**
 * 交工资料归档统计
 * @constructor
 */
const TechnologyArchiveListStatisticsPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const archiveListActionRef: any = useRef();
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [selectedFormNo, setSelectedFormNo] = useState<string>('');

  useEffect(() => {
    if (dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'up_wbs_name',
      'dep_name',
      "contract_out_name",
      "record_name",
      "archive_num",
      "approval_date_str",
      "form_maker_name",
      "form_make_time_str",
      {
        title: "是否归档",
        subTitle: "是否归档",
        dataIndex: "isArchive",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          if (record.status === 2) {
            return <a onClick={() => {
              setSelectedFormNo(record.form_no);
              setArchiveModalVisible(true);
            }}>已归档</a>
          } else {
            return <span>未归档</span>
          }
        }
      },
    ])
      .noNeedToFilterIcon([
        'isArchive'
      ])
      .noNeedToSorterIcon([
        'isArchive'
      ])
      .needToFixed([
        {
          value: 'isArchive',
          fixed: 'right',
        }
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
        type={"primary"}
        style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
        onClick={() => {
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
    return [

    ]
  }

  /**
   * 获取归档清单表格列配置
   */
  const getArchiveListTableColumns = () => {
    const cols = new BasicTableColumns(archiveListColumns);
    cols.initTableColumns([
      'contract_out_name',
      'record_name',
      'record_name_b',
      'form_maker_name',
      'status_str',
      'approval_date_str',
      'form_make_time',
      'unit',
      'archive_num',
      'transfer_date',
      'remark',
    ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'transfer_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="form_no"
        tableTitle='交工资料归档统计'
        type="technologyArchiveList/queryTechnologyArchiveListStatistics"
        exportType="technologyArchiveList/queryTechnologyArchiveListStatistics"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />

      <Modal
        title=""
        open={archiveModalVisible}
        onCancel={() => {
          setArchiveModalVisible(false);
          setSelectedFormNo('');
        }}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        bodyStyle={{ height: '90vh' }}
        destroyOnClose
      >
        <BaseCurdSingleTable
          cRef={archiveListActionRef}
          rowKey="RowNumber"
          tableTitle='归档清单'
          type="technologyArchiveList/queryTechnologyArchiveListFlat"
          exportType="technologyArchiveList/queryTechnologyArchiveListFlat"
          tableColumns={getArchiveListTableColumns()}
          funcCode={authority + '归档清单'}
          tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
          tableDefaultFilter={[
            { Key: 'form_no', Val: selectedFormNo, Operator: '=' }
          ]}
          buttonToolbar={() => []}
          selectedRowsToolbar={() => []}
        />
      </Modal>
    </div>
  )
}
export default connect()(TechnologyArchiveListStatisticsPage);
