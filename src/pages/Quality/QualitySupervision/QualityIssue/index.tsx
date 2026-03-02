import React, { ReactNode, useRef, useState } from 'react';
import { Button, message, Modal, Space, Tag } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import QualitySafetyInspectionAdd from "./Add";
import QualitySafetyInspectionDetail from "./Detail";
import QualitySafetyInspectionEdit from "./Edit";
import OperationBehaviorDetailDrawer from "./OperationBehaviorDetailDrawer";
import OperationBehaviorStatisticsModal from "./OperationBehaviorStatisticsModal";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 质量监督检查问题清单
 * @constructor
 */
const QualitySafetyInspectionPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  /** 作业行为详情抽屉显示状态 */
  const [operationBehaviorDetailVisible, setOperationBehaviorDetailVisible] = useState(false);
  /** 当前查看的作业行为名称 */
  const [operationBehaviorName, setOperationBehaviorName] = useState<string>('');
  /** 当前查看的作业行为数据（包含record和behaviorIndex） */
  const [operationBehaviorDetail, setOperationBehaviorDetail] = useState<{ record: any; behaviorIndex: number } | null>(null);
  /** 作业行为统计分析弹窗显示状态 */
  const [operationBehaviorStatisticsVisible, setOperationBehaviorStatisticsVisible] = useState(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "compinfo.problem_obs_code",
        subTitle: "问题来源",
        dataIndex: "problem_obs_name",
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
      "question_category_str",
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
      "responsible_unit_str",
      "violation_unit_str",
      "severity_level_str",
      "system_belong_str",
      "verify_obs_name",
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
        "question_category_str",
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
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '查看作业行为统计') ? 'inline' : 'none' }}
          onClick={() => {
            setOperationBehaviorStatisticsVisible(true);
          }}
        >
          查看作业行为统计
        </Button>
      </Space>,
      <a
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
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
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "qualitySafetyInspection/deleteQualitySafetyInspection",
                payload: {
                  id: selectedRows[0]['id'],
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>,
      <Button
        danger
        type={"primary"}
        style={{ display: hasPermission(authority, '关闭') ? 'inline' : 'none' }}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }

          // 判断当前用户是否有权限关闭该问题（if_verify_user === 1 表示有权限）
          if (selectedRows[0].if_verify_user === 1) {
            // 弹出确认框
            Modal.confirm({
              title: "关闭确认",
              content: "是否关闭当前质量安全监督检查问题？",
              okText: "确定",
              cancelText: "取消",
              onOk() {
                dispatch({
                  type: "qualitySafetyInspection/updateIfClose",
                  payload: {
                    id: selectedRows[0]['id'],
                    ifClose: 1,
                  },
                  callback: (res: any) => {
                    if (res.errCode === ErrorCode.ErrOk) {
                      message.success("关闭成功");
                      if (actionRef.current) {
                        actionRef.current.reloadTable();
                      }
                    }
                  },
                });
              },
              onCancel() {
                console.log("Cancel");
              },
            });
          } else {
            // if_verify_user 为 0 或其他值，直接提示错误
            message.error("当前账号不能关闭这条质量安全监督问题");
          }
        }}
      >
        关闭
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='质量监督检查问题清单'
        type="qualitySafetyInspection/getQualitySafetyInspection"
        exportType="qualitySafetyInspection/getQualitySafetyInspection"
        importType="qualitySafetyInspection/importQualitySafetyInspection"
        tableColumns={getTableColumns()}
        funcCode={authority + '质量监督检查问题清单'}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={
          [
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
          ]
        }
        moduleCaption={'质量监督检查问题清单'}
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
      {addVisible && (
        <QualitySafetyInspectionAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {visible && (
        <BaseImportModal
          visible={visible}
          maxCount={1}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              return actionRef.current.importFile(file, 'importSafetyInspection', () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('importSafetyInspection');
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
      {/* 作业行为统计分析弹窗 */}
      <OperationBehaviorStatisticsModal
        visible={operationBehaviorStatisticsVisible}
        onClose={() => setOperationBehaviorStatisticsVisible(false)}
      />
    </div>
  )
}
export default connect()(QualitySafetyInspectionPage);
