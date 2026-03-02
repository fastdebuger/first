import React, { ReactNode, useRef } from 'react';
import { Button, Modal } from "antd";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { configColumns } from "./columns";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 质量安全监督检查问题清单
 * @constructor
 */
const QualitySafetyInspectionTable: React.FC<any> = (props) => {
  const { onSelect, visible, onCancel } = props;
  const actionRef: any = useRef();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "problem_obs_name",
      "examine_wbs_name",
      "upload_date_str",
      "branch_comp_name",
      "wbs_name",
      "project_name",
      "check_date_str",
      "problem_description",
      {
        title: "compinfo.problem_image_url",
        subTitle: "问题图片",
        dataIndex: "problem_image_url",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text as string))}
                size='small'
                type='link'
              >查看图片</Button>
            )
          }
          return '暂无图片';
        },
      },
      'problem_type_str',
      "problem_category_str",
      "quality_factor1",
      "quality_factor2",
      "entity_quality_str",
      "operation_behavior_str",
      "safety_factor1",
      "safety_factor2",
      "responsible_unit_str",
      "violation_unit_str",
      "severity_level_str",
      "system_belong_str",
      "verify_obs_name",
      "remark",
      "form_maker_name",
      "form_make_time",
    ])
      .setTableColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'check_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToExport([
        "problem_obs_name",
        "examine_wbs_name",
        "upload_date_str",
        "branch_comp_name",
        "wbs_name",
        "project_name",
        "check_date_str",
        "problem_description",
        'problem_image_url',
        'problem_type_str',
        "problem_category_str",
        "quality_factor1",
        "quality_factor2",
        "entity_quality_str",
        "operation_behavior_str",
        "safety_factor1",
        "safety_factor2",
        "responsible_unit_str",
        "violation_unit_str",
        "severity_level_str",
        "system_belong_str",
        "verify_obs_name",
        "remark",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 选择数据后关闭
   * @param rows 
   */
  const selectedRowsToolbar = (selectedRows: any) => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows[0])
      onCancel()
    }
    return [];
  }

  return (
    <div>
      {visible && (
        <Modal
          title={''}
          visible={visible}
          onCancel={onCancel}
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
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="id"
            tableTitle='质量安全监督检查问题清单'
            type="qualitySafetyInspection/getQualitySafetyInspection"
            exportType="qualitySafetyInspection/getQualitySafetyInspection"
            importType="qualitySafetyInspection/importQualitySafetyInspection"
            tableColumns={getTableColumns()}
            funcCode={"QualitySafetyInspectionTable" + '质量安全监督检查问题清单'}
            tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
            buttonToolbar={undefined}
            selectedRowsToolbar={selectedRowsToolbar}
            rowSelection={{ type: "radio" }}
            tableDefaultFilter={
              [
                { Key: 'examine_wbs_code', Val: WBS_CODE?.split(".")?.[0], Operator: '=' }
              ]
            }
            moduleCaption={'质量安全监督检查问题清单'}
          />
        </Modal>
      )}
    </div>
  )
}
export default QualitySafetyInspectionTable;
