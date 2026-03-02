import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Space, Tag, Image, Tabs } from "antd";
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
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 质量安全监督检查问题清单
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
  /** 当前选中的 tab */
  const [activeTab, setActiveTab] = useState<string>('all');

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
        subTitle: "问题图片1",
        dataIndex: "problem_image_url",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片1"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
            )
          }
          return '暂无图片';
        },
      },
      {
        title: "compinfo.problem_image_url2",
        subTitle: "问题图片2",
        dataIndex: "problem_image_url2",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片2"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
            )
          }
          return '暂无图片';
        },
      },
      {
        title: "compinfo.problem_image_url3",
        subTitle: "问题图片3",
        dataIndex: "problem_image_url3",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片3"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
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
      "question_category_str",
      "safety_factor1",
      "safety_factor2",
      "responsible_unit_str",
      "violation_unit_str",
      "severity_level_str",
      "system_belong_str",
      "verify_user_name",
      "remark",
      "form_maker_name",
      "form_make_time",
      "if_close",
    ])
      .setTableColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'check_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToFixed([{ value: 'if_close', fixed: 'right' }])
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
        'problem_image_url2',
        'problem_image_url3',
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
        "verify_user_name",
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
    // 处理验证逻辑的函数
    const handleVerify = () => {
      if (selectedRows.length === 0) {
        message.warn('请选择至少一条数据');
        return;
      }

      const currentUserCode = localStorage.getItem('auth-default-userCode');

      // 检查所有选中数据是否符合验证条件
      for (const row of selectedRows) {
        if (row.verify_user_code !== currentUserCode) {
          message.warn('所选数据中存在非当前用户验证的数据');
          return;
        }
        if (row.if_close === 1) {
          message.warn('所选数据中存在验证通过的数据，不能重复验证');
          return;
        }
      }

      // 获取所有选中数据的工程名称
      const projectNames = selectedRows
        .map((row: any) => row.project_name)
        .filter((name: string) => name) // 过滤掉空值
        .join('、');

      // 获取所有选中数据的 id
      const ids = selectedRows.map((row: any) => row.id).join(',');

      // 构建提示内容
      const content = projectNames
        ? `是否验证通过(${projectNames})等问题清单？`
        : `是否验证通过所选问题清单？`;

      // 弹出确认框
      Modal.confirm({
        title: "验证确认",
        content: content,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          dispatch({
            type: "qualitySafetyInspection/updateBatchIsClose",
            payload: {
              ids: ids,
            },
            callback: (res: any) => {
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("验证成功");
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
    };

    return [
      <Button
        key="edit"
        style={{ display: hasPermission(authority, '编辑') && selectedRows.length === 1 ? 'inline' : 'none' }}
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
        style={{ display: hasPermission(authority, '删除') && selectedRows.length === 1 ? 'inline' : 'none' }}
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
        key="verify"
        type={"primary"}
        // style={{ display: hasPermission(authority, '验证') ? 'inline' : 'none' }}
        onClick={handleVerify}
      >
        验证
      </Button>
    ]
  }
  /**
   * 获取当前 tab 对应的过滤条件
   */
  const getTableDefaultFilter = () => {
    const baseFilter = [
      { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
    ];

    // 如果是"待我验证"tab，添加验证人过滤条件
    if (activeTab === 'myVerify') {
      const userCode = localStorage.getItem('auth-default-userCode');
      if (userCode) {
        baseFilter.push({
          Key: 'verify_user_code',
          Val: userCode,
          Operator: '='
        },{
          Key: 'if_close',
          Val: '0',
          Operator: '='
        });
      }
    }

    return baseFilter;
  };

  /**
   * 处理 tab 切换
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  /**
   * 当 tab 切换时，重新加载表格数据
   */
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.reloadTable();
    }
  }, [activeTab]);

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='质量安全监督检查问题清单'
        type="qualitySafetyInspection/getQualitySafetyInspection"
        exportType="qualitySafetyInspection/getQualitySafetyInspection"
        importType="qualitySafetyInspection/importQualitySafetyInspection"
        tableColumns={getTableColumns()}
        funcCode={authority + '质量安全监督检查问题清单'}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getTableDefaultFilter()}
        renderSelfToolbar={() => {
          return (
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: 'all',
                  label: '全部单据',
                },
                {
                  key: 'myVerify',
                  label: '待我验证',
                },
              ]}
            />
          )
        }}
        moduleCaption={'质量安全监督检查问题清单'}
        height={'calc(100vh - 400px)'}
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
    </div>
  )
}
export default connect()(QualitySafetyInspectionPage);
