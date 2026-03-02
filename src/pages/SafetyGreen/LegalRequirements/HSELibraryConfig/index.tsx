import React, { useRef, useState } from "react";
import { Button, message, Modal, Segmented, Space } from "antd";
import { connect } from "umi";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from "yayang-ui";
import { CURR_USER_CODE, ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import SupplierInfoAdd from "./Add";
import SupplierInfoDetail from "./Detail";
import SupplierInfoEdit from "./Edit";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";
import HistoricalVersionRepository from "./HistoricalVersionRepository";
import VersionIteration from "./VersionIteration";
import BetchUpload from "./BetchUpload";
import ViewApprovalBetch from "@/components/Approval/ViewApprovalBetch";
import InitiateBetchApproval from "@/components/Approval/InitiateBetchApproval";

/**
 * HSE法律法规库
 * @constructor
 */
const SupplierInfoPage: React.FC<any> = (props) => {
  const {
    dispatch,
    route: { authority },
  } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [versionIterationVisible, setVersionIterationVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [betchUploadVisible, setBetchUploadVisible] = useState(false);
  const [importedList, setImportedList] = useState([]);

  const tableDefaultFieldRef = useRef<any>({
    currUserCode: CURR_USER_CODE,
  });

  if (PROP_KEY === "subComp") {
    tableDefaultFieldRef.current.up_wbs_code = WBS_CODE;
  }

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "wbs_name",
        {
          title: "HSELegislation.law_name",
          subTitle: "法律法规名称",
          dataIndex: "law_name",
          align: "center",
          width: 160,
          render: (text: any, record: any) => {
            return (
              <a
                onClick={() => {
                  setSelectedRecord(record);
                  setOpen(true);
                }}
              >
                {text}
              </a>
            );
          },
        },
        "element_name",
        "law_level_name",
        "keywords",
        "version_no",
        // "publish_content",
        "publish_date_str",
        "effective_date_str",
        // "create_by_name",
        "create_date_str",
        {
          title: "HSELegislation.file_path",
          dataIndex: "file_path",
          subTitle: "文件",
          align: "center",
          width: 160,
          render: (text: any) => {
            if (text) {
              return (
                <Button
                  onClick={() => window.open(getUrlCrypto(text))}
                  size="small"
                  type="link"
                >
                  下载文件
                </Button>
              );
            }
            return "";
          },
        },
        // 'audit_by_name',
        "audit_status_name",
      ])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: "right",
        },
      ])

      .needToExport([
        "RowNumber",
        "wbs_name",
        "law_name",
        "element_name",
        "law_level_name",
        "keywords",
        "version_no",
        // "publish_content",
        "publish_date_str",
        "effective_date_str",
        // "create_by_name",
        "create_date_str",
        "file_path",
        "audit_status_name",
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"]);
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (
    reloadTable: (filters?: [], noFilters?: []) => void,
  ) => {
    return [
      <Space>
        <Button
          style={{
            display: hasPermission(authority, "新增") ? "inline" : "none",
          }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
      </Space>,
      <a
        key={authority + "import"}
        style={{
          display: hasPermission(authority, "导入") ? "inline" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        导入
      </a>,
      <a
        style={{
          display: hasPermission(authority, "导出") ? "inline" : "none",
        }}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >
        导出
      </a>,
    ];
  };

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (
    selectedRows: any[],
    reloadTable: (filters?: [], noFilters?: []) => void,
  ) => {
    const selectedRecord = selectedRows[0];
    return [
      selectedRecord?.audit_status < 2 && (
        <Button
          style={{
            display: hasPermission(authority, "编辑") ? "inline" : "none",
          }}
          type={"primary"}
          onClick={() => {
            if (selectedRows.length === 0) {
              message.warn("请选择一条数据");
              return;
            }
            if (selectedRows.length !== 1) {
              message.warn("每次只能操作一条数据");
              return;
            }
            setSelectedRecord(selectedRows[0]);
            setEditVisible(true);
          }}
        >
          编辑
        </Button>
      ),
      // 法律版本迭代
      selectedRecord?.audit_status === "2" && (
        <Button
          style={{
            display: hasPermission(authority, "版本迭代") ? "inline" : "none",
          }}
          type={"primary"}
          onClick={() => {
            if (selectedRows.length === 0) {
              message.warn("请选择一条数据");
              return;
            }
            if (selectedRows.length !== 1) {
              message.warn("每次只能操作一条数据");
              return;
            }
            setSelectedRecord(selectedRows[0]);
            setVersionIterationVisible(true);
          }}
        >
          版本迭代
        </Button>
      ),
      selectedRows.length === 1 ? (
        // 发起审批
        <InitiateApproval
          key={selectedRecord?.RowNumber || "default"} // 添加key属性强制重新渲染
          recordId={selectedRecord?.id}
          // 是否允许发起审批audit_status
          allowedApproval={
            String(selectedRecord?.audit_status) === "0" ||
            String(selectedRecord?.audit_status) === "3"
          }
          selectedRecord={selectedRecord}
          dispatch={dispatch}
          funcode={"S25"}
          type="LegalRequirements/sendLawApproval"
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      ) : (
        <InitiateBetchApproval
          key={selectedRecord?.RowNumber || "new"}
          dispatch={dispatch}
          isApprovalAllowed={true}
          onPreCheck={() => {
            const isFlag = selectedRows.every(
              (item: any) =>
                item.audit_status === "0" || item.audit_status === "3",
            );
            if (!isFlag) {
              message.error(
                "所选数据中包含已发起审批的记录，请核对后重新操作。",
              );
            }
            return isFlag;
          }}
          funcode={"S25"}
          type="LegalRequirements/sendLawApproval"
          fieldMapping={{
            idField: "id",
          }}
          onSuccess={() => actionRef.current?.reloadTable()}
          // 详情相关
          tableTitle="待发起审批详情"
          tableType="LegalRequirements/queryAllLawList"
          tableColumns={getTableColumns}
          tableSortOrder={{ sort: "id", order: "desc" }}
          tableDefaultFilter={[
            {
              Key: "id",
              Val: `'${selectedRows.map((item: any) => item.id).join(`','`)}'`,
              Operator: "in",
            },
          ]}
        />
      ),
      selectedRows.length === 1 ? (
        // 查看审批
        <ViewApproval
          back={false}
          key={`view-${selectedRecord?.RowNumber || "default"}`} // 添加key属性强制重新渲染
          instanceId={selectedRecord?.audit_id}
          funcCode={"S25"}
          number={selectedRecord?.number}
          selectedRecord={selectedRecord}
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      ) : (
        // 批量查看审批
        <ViewApprovalBetch
          disabled={selectedRows.some(
            (item: any) =>
              !item.audit_id ||
              !item.task_id || 
              String(item.audit_status) === "3",//驳回状态
          )}
          key={`view-${selectedRecord?.RowNumber || "default1"}`} // 添加key属性强制重新渲染
          instanceIdLabel={"audit_id"}
          taskIdLabel={"task_id"}
          funcCode={"S25"}
          selectedRecord={selectedRows}
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      ),
      <HistoricalVersionRepository
        selectedRows={selectedRows.length > 0 ? selectedRows[0] : {}}
      />,
      <Button
        danger
        style={{
          display: hasPermission(authority, "删除") ? "inline" : "none",
        }}
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
                type: "LegalRequirements/delLawInfo",
                payload: {
                  id: selectedRows[0]["id"],
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
    ];
  };

  /**
   * 日期搜索
   * @returns
   */
  const renderSelfToolbar: any = (reloadTable: any) => {
    return (
      // @ts-ignore
      <Segmented
        options={[
          {
            label: "全部",
            value: "全部",
          },
          {
            label: "待发起",
            value: "待发起",
          },
          {
            label: "待我审批",
            value: "待审批",
          },
        ]}
        onChange={(value: any) => {
          if (value === "全部") {
            reloadTable([]);
          } else if (value === "待发起") {
            reloadTable([
              { Key: "audit_status", Val: "'0','3'", Operator: "in" },
            ]);
          } else if (value === "待审批") {
            reloadTable([
              { Key: "task_id", Val: "''", Operator: "!=" },
              { Key: "audit_status", Val: "'1'", Operator: "in" },
            ]);
          }
        }}
      />
    );
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle="HSE法律法规库上传"
        moduleCaption="HSE法律法规库上传"
        type="LegalRequirements/queryAllLawList"
        exportType="LegalRequirements/queryAllLawList"
        importType="LegalRequirements/importLawInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "getNewLawInfo112"}
        tableSortOrder={{ sort: "id", order: "desc" }}
        // rowSelection={{ type: 'radio' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[{ Key: "wbs_code", Val: WBS_CODE, Operator: "=" }]}
        tableDefaultField={tableDefaultFieldRef.current}
        renderSelfToolbar={renderSelfToolbar}
      />
      {/* 详情组件 */}
      {open && selectedRecord && (
        <SupplierInfoDetail
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
      {/* 新增组件 */}
      {addVisible && (
        <SupplierInfoAdd
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
      {/* 导入组件 */}
      {visible && (
        <BaseImportModal
          maxCount={1}
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              const formData = new FormData();
              return actionRef.current.importFile(
                file,
                "D51F708",
                (res: any) => {
                  if (
                    res?.result &&
                    Array.isArray(res?.result) &&
                    res?.result?.length > 0
                  ) {
                    const result = res.result;
                    setImportedList(result);
                    setBetchUploadVisible(true);
                  }

                  setVisible(false);
                },
                formData,
              );
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile("D51F708");
            }
          }}
        />
      )}
      {/* 编辑组件 */}
      {editVisible && (
        <SupplierInfoEdit
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
      {/* 版本迭代组件 */}
      {versionIterationVisible && (
        <VersionIteration
          visible={versionIterationVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setVersionIterationVisible(false)}
          callbackSuccess={() => {
            setVersionIterationVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {/* 批量导入 */}
      {betchUploadVisible && (
        <BetchUpload
          importedList={importedList}
          selectedRecord={selectedRecord}
          visible={betchUploadVisible}
          onCancel={() => setBetchUploadVisible(false)}
          callbackAddSuccess={() => {
            setBetchUploadVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};
export default connect()(SupplierInfoPage);
