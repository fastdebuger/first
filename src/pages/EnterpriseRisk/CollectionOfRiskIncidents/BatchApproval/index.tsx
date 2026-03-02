import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '../columns';
import { getDepTitle } from '@/utils/utils';
// import { getUrlCrypto } from '../HuaWeiOBSUploadSingleFile';

/**
 * 查看文件的弹窗
 * @param props
 * @constructor
 */
const BatchApprovalModel: React.FC<any> = (props: any) => {
  const { visible, onCancel, title, onSelect } = props;


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "batch_id",
        "report_unit_name",
        "push_unit_name",
        'risk_events_name',
        "risk_type_name",
        "risk_level_name",
        "category_name",
        "category_details_name",
        "happen_time_str",
        "scene",
        "situation_description",
        "injury_or_damage",
        "reason_analysis",
        "counter_measures",
        "is_litigation_name",
        "company_dept_name",
        "remark",
        "create_by_name",
        "create_date_str",
        "report_type_name",
        "audit_status_name",
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "report_unit_name",
        "push_unit_name",
        'risk_events_name',
        "risk_type_name",
        "risk_level_name",
        "category_name",
        "category_details_name",
        "happen_time_str",
        "scene",
        "situation_description",
        "injury_or_damage",
        "reason_analysis",
        "counter_measures",
        "is_litigation_name",
        "company_dept_name",
        "remark",
        "create_by_name",
        "create_date_str",
        "report_type_name",
        "audit_status_name",
      ]);
    return cols.getNeedColumns();
  };

  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      // onSelect(selectedRows[0])
      // setRecord(selectedRows[0])
    }
    return [];
  };

  return (
    <Modal
      title={'查看'}
      visible={visible}
      onCancel={onCancel}
      // okText={'完成'}
      width={'100vw'}
      footer={null}
      style={{
        top: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
      bodyStyle={{
        height: 'calc(100vh - 56px)',
        overflow: 'hidden'
      }}
    >
      <BaseCurdSingleTable
        rowKey="RowNumber"
        tableTitle="收入合同台账"
        funcCode={"collectionOfRiskIncidents"}
        type="collectionOfRiskIncidents/getInfo"
        importType="collectionOfRiskIncidents/getInfo"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
      />
    </Modal>
  );
};

export default BatchApprovalModel;
