import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import ContractorAdd from "./Add";
import ContractorDetail from "./Detail";
import ContractorEdit from "./Edit";
import AuditStatModal from './AuditStatModal';

/**
 * 质量监督审核问题清单
 * @constructor
 */
const ContractorPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "wbs_name",
      {
        title: 'Contractor.auditor_name',
        subTitle: '审核人',
        dataIndex: 'auditor_name',
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
      "audit_time_str",             // 2. 审核时间
      "audit_location",         // 3. 审核地点
      "audited_unit",           // 4. 被审核单位
      "dept_name",              // 5. 部门名称
      "post_name",              // 6. 岗位名称
      "issue_description",      // 7. 问题描述
      "judgement_basis",        // 8. 判定依据
      "problem_category_name",       // 9. 问题类别
      "professional_field_name",     // 10. 专业领域
      "one_involved_elements",  // 11. 一级涉及要素
      "involved_elements",      // 12. 涉及要素
      "audit_item",             // 13. 审核项目
      "issue_nature",           // 14. 问题性质
      "rectification_advice",   // 15. 整改建议
      "completion_time_str",        // 16. 整改截止时间
      "remark"                  // 17. 备注
    ])
      .noNeedToFilterIcon(["RowNumber",])
      .noNeedToSorterIcon(["RowNumber",])
      .needToExport([
        "RowNumber",
        "wbs_name",
        'contractor_name',
        "auditor_name",           // 1. 审核人
        "audit_time_str",             // 2. 审核时间
        "audit_location",         // 3. 审核地点
        "audited_unit",           // 4. 被审核单位
        "dept_name",              // 5. 部门名称
        "post_name",              // 6. 岗位名称
        "issue_description",      // 7. 问题描述
        "judgement_basis",        // 8. 判定依据
        "problem_category_name",       // 9. 问题类别
        "professional_field_name",     // 10. 专业领域
        "one_involved_elements",  // 11. 一级涉及要素
        "involved_elements",      // 12. 涉及要素
        "audit_item",             // 13. 审核项目
        "issue_nature",           // 14. 问题性质
        "rectification_advice",   // 15. 整改建议
        "completion_time_str",        // 16. 整改截止时间
        "remark"                  // 17. 备注
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
        <AuditStatModal />
      </Space>,
      <a
        key={authority + 'import'}
        style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        导入
      </a>,
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
                type: "contractor/delInfo",
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
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='质量监督审核问题清单'
        type="contractor/getInfo"
        exportType="contractor/getInfo"
        importType="contractor/importInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "质量监督审核问题清单"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        moduleCaption={"质量监督审核问题清单"}
        tableDefaultFilter={[
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <ContractorDetail
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
        <ContractorAdd
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
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              return actionRef.current.importFile(file, "importQualitySupervisionAuditIssueInfo", () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile("importQualitySupervisionAuditIssueInfo");
            }
          }}
        />
      )}
      {editVisible && (
        <ContractorEdit
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
    </div>
  )
}
export default connect()(ContractorPage);
