import React, { ReactNode, useRef, useState } from 'react';
import { Button, message, Space, Tag } from "antd";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import QualitySafetyInspectionDetail from "./Detail";
import QualitySafetyInspectionEdit from "./EditHourNum";
import OperationBehaviorDetailDrawer from "./OperationBehaviorDetailDrawer";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { CURR_USER_CODE } from '../../../../common/const';

/**
 * 待我检查安全监督检查问题清单
 * @constructor
 */
const QualitySafetyInspectionPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  /** 作业行为详情抽屉显示状态 */
  const [operationBehaviorDetailVisible, setOperationBehaviorDetailVisible] = useState(false);
  /** 当前查看的作业行为名称 */
  const [operationBehaviorName, setOperationBehaviorName] = useState<string>('');
  /** 当前查看的作业行为数据（包含record和behaviorIndex） */
  const [operationBehaviorDetail, setOperationBehaviorDetail] = useState<{ record: any; behaviorIndex: number } | null>(null);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "compinfo.problem_code",
        subTitle: "问题来源",
        dataIndex: "problem_name",
        width: 160,
        align: "center",
        render: (text: ReactNode, record: any) => {
          if (text) {
            return (
              <a
                type="link"
                onClick={() => {
                  setSelectedRecord(record);
                  setOpen(true);
                }}
                style={{ padding: 0 }}
              >
                {text}
              </a>
            );
          }
          return text;
        },
      },
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
      // "question_category_str",
      "quality_factor1",
      "quality_factor2",
      "entity_quality_str",
      {
        title: "compinfo.operation_behavior_ids",
        subTitle: "作业行为类",
        dataIndex: "operation_behavior_str",
        width: 200,
        align: "center",
        render: (text: ReactNode, record: any) => {
          if (!text) {
            return <Tag color="red">不存在 作业行为类</Tag>;
          }

          const behaviorNames = String(text).split(',').map(s => s.trim()).filter(Boolean);

          if (behaviorNames.length === 0) {
            return text;
          }

          return (
            <Space size="small" wrap>
              {behaviorNames.map((name, index) => (
                <a
                  key={index}
                  type="link"
                  onClick={() => {
                    setOperationBehaviorName(name);
                    setOperationBehaviorDetail({ record, behaviorIndex: index });
                    setOperationBehaviorDetailVisible(true);
                  }}
                  style={{ padding: 0 }}
                >
                  {name}
                </a>
              ))}
            </Space>
          );
        },
      },
      "safety_factor1",
      "safety_factor2",
      //"responsible_unit_str",
      //"violation_unit_str",
      //"severity_level_str",
      //"system_belong_str",
      //"verify_obs_name",
      "remark",
      "form_maker_name",
      "form_make_time",
      "precautionary_analysis_num",
    ])
      .setTableColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'check_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToFixed([{ value: 'precautionary_analysis_num', fixed: 'right' }])
      .needToExport([
        "problem_name",
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
        // "question_category_str",
        "quality_factor1",
        "quality_factor2",
        "entity_quality_str",
        "operation_behavior_str",
        "safety_factor1",
        "safety_factor2",
        //"responsible_unit_str",
        //"violation_unit_str",
        //"severity_level_str",
        //"system_belong_str",
        //"verify_obs_name",
        "remark",
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
    return [
      <Button
        // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          setSelectedRecord(selectedRows);
          setEditVisible(true)
        }}
      >
        填写检查时间
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='待我检查安全监督检查问题清单'
        type="qualitySafetyInspection/getQualitySafetyInspection"
        exportType="qualitySafetyInspection/getQualitySafetyInspection"
        importType="qualitySafetyInspection/importQualitySafetyInspection"
        tableColumns={getTableColumns()}
        funcCode={authority + '待我检查安全监督检查问题清单'}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        height={'calc(100vh - 350px)'}
        scroll={{ y: 'calc(100vh - 400px)' }}
        tableDefaultFilter={
          [
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
            { Key: 'problem_type', Val: "1", Operator: '=' },
            { Key: 'hour_num', Val: "", Operator: '=' },
            { Key: 'form_maker_code', Val: CURR_USER_CODE, Operator: '=' },
          ]
        }
        moduleCaption={'待我检查安全监督检查问题清单'}
      />
      {open && selectedRecord && (
        <QualitySafetyInspectionDetail
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

      {editVisible && (
        <QualitySafetyInspectionEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {/* 作业行为详情抽屉 */}
      {operationBehaviorDetail && (
        <OperationBehaviorDetailDrawer
          visible={operationBehaviorDetailVisible}
          behaviorName={operationBehaviorName}
          record={operationBehaviorDetail.record}
          behaviorIndex={operationBehaviorDetail.behaviorIndex}
          onClose={() => {
            setOperationBehaviorDetailVisible(false);
            setOperationBehaviorDetail(null);
            setOperationBehaviorName('');
          }}
        />
      )}
    </div>
  )
}
export default QualitySafetyInspectionPage;
