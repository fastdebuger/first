import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, message, Modal, Space, Tabs } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getIsCurrentDataMaintainable } from "@/services/technology/technicalDocument/technologyAudit";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { configColumns } from "./columns";
import TechnologyHseRiskControlListAdd from "./Add";
import TechnologyHseRiskControlListDetail from "./Detail";
import TechnologyHseRiskControlListEdit from "./Edit";

/**
 * HSE重大风险清单
 * @constructor
 */
const TechnologyHseRiskControlListPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [timeType, setTimeType] = useState<number>(0); // 0: 季度, 1: 月度
  const [isCurrentDataMaintainable, setIsCurrentDataMaintainable] = useState<boolean>(false);
  const [promptData, setPromptData] = useState<string>('');

  const getIsCurrentDataMaintainableData = async () => {
    // timeType 0 对应季度 type_code '1', timeType 1 对应月度 type_code '2'
    const typeCode = timeType === 0 ? '1' : '2';
    const res = await getIsCurrentDataMaintainable({
      type_code: typeCode,
    });
    if (res.errCode === ErrorCode.ErrOk && res.result) {
      setIsCurrentDataMaintainable(res.result.isCurrentDataMaintainable);
      // 处理时间戳：如果是秒级时间戳，需要转换为毫秒级或使用 moment.unix()
      const startTime = moment.unix(Number(res.result.start_date));
      const endTime = moment.unix(Number(res.result.end_date));
      setPromptData('当前的填报时间为' + startTime.format('YYYY-MM-DD') + '至' + endTime.format('YYYY-MM-DD'));
    }
  }

  useEffect(() => {
    getIsCurrentDataMaintainableData();
  }, [])

  // 当 timeType 改变时，重新加载表格和填报时间状态
  useEffect(() => {
    getIsCurrentDataMaintainableData();
    if (actionRef.current) {
      actionRef.current.reloadTable();
    }
  }, [timeType])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "二级单位",
        subTitle: "二级单位",
        dataIndex: "up_dep_name",
        width: 160,
        align: "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      "dep_name",
      "contract_out_name",
      "level1_process",
      "level2_process",
      "level3_process",
      "major_risk_detail",
      "equipment_tool",
      "hazard_type",
      "company_area_supervisor",
      "risk_level_str",
      "plan_execute_time_str",
      "form_maker_name",
      "form_make_time_str",
    ])
      .needToExport([
        "up_dep_name",
        "dep_name",
        "contract_out_name",
        "level1_process",
        "level2_process",
        "level3_process",
        "major_risk_detail",
        "equipment_tool",
        "hazard_type",
        "company_area_supervisor",
        "risk_level_str",
        "plan_execute_time_str",
        "form_maker_name",
        "form_make_time_str",
      ])
      .setTableColumnToDatePicker([
        { value: 'plan_execute_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    // 如果当前时间无法填报，那么只返回导出按钮
    if (!isCurrentDataMaintainable) {
      return [
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      ]
    }
    return [
      <Space key="toolbar">
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
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (!selectedRows || selectedRows.length !== 1) {
      return []
    }
    // 如果当前非填报时间，那么只能查看审批
    if (!isCurrentDataMaintainable) {
      return [

      ];
    }
    return [
      <Button
        key="edit"
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
                type: "technologyHseRiskControlList/deleteTechnologyHseRiskControlList",
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
      <Alert
        type="warning"
        showIcon
        banner
        icon={<ExclamationCircleOutlined />}
        message={promptData}
      />
      <Tabs
        activeKey={String(timeType)}
        type='card'
        onChange={(key) => {
          setTimeType(Number(key));
        }}
        style={{ marginBottom: 16 }}
      >
        <Tabs.TabPane tab="季度" key="0" />
        <Tabs.TabPane tab="月度" key="1" />
      </Tabs>
      <BaseCurdSingleTable
        key={isCurrentDataMaintainable}
        cRef={actionRef}
        rowKey="id"
        tableTitle='HSE重大风险清单'
        type="technologyHseRiskControlList/getTechnologyHseRiskControlList"
        exportType="technologyHseRiskControlList/getTechnologyHseRiskControlList"
        importType="technologyHseRiskControlList/importTechnologyHseRiskControlList"
        tableColumns={getTableColumns()}
        funcCode={authority + 'HSE重大风险清单'}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        tableDefaultFilter={[
          { Key: 'type_code', Val: timeType, Operator: '=' },
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <TechnologyHseRiskControlListDetail
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
        <TechnologyHseRiskControlListAdd
          visible={addVisible}
          timeType={timeType}
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
            const formData = new FormData();
            formData.append('type_code', String(timeType));
            if (actionRef.current) {
              return actionRef.current.importFile(file, 'importTechnologyHseRiskControlList', () => {
                setVisible(false);
              },formData);
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('importTechnologyHseRiskControlList');
            }
          }}
        />
      )}
      {editVisible && (
        <TechnologyHseRiskControlListEdit
          visible={editVisible}
          timeType={timeType}
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
export default connect()(TechnologyHseRiskControlListPage);
