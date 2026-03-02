import React, { useEffect,useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDefaultFiltersEngine } from "@/utils/utils";
import { configColumns } from "./columns";
import MonthlyOutputAdd from "./Add";
import MonthlyOutputDetail from "./Detail";
import MonthlyOutputEdit from "./Edit";

/**
 * 承包商施工作业过程中监督检查表信息
 * @constructor
 */
const MonthlyOutputPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  // 控制导入的显示状态
  const [visible, setVisible] = useState(false);
  // 控制新增的显示状态
  const [addVisible, setAddVisible] = useState(false);
  // 控制编辑的显示状态
  const [editVisible, setEditVisible] = useState(false);
  // 控制详情的展开状态
  const [open, setOpen] = useState(false);
  // 存当前选中的数据记录
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
  * 用于获取新的承包商单位提醒信息
  */
  useEffect(() => {
      dispatch({
        type: 'monthlyOutput/getRemindInfo',
        payload: {
          sort: 'id',
          order: 'asc'
        },
        callback: (res: any) => {
          // 在成功时显示提醒信息,判断下后台返回空的话不会弹出
          if (res.errCode === ErrorCode.ErrOk && res?.result !== '') {
            // 显示获取的新的承包商单位的监督提醒信息
            Modal.info({
              title: '提示',
              content: res?.result,
            });
          }
        }
      })
    }, [])
  /**
   * 获取接口数据（异步）
   * @param type dispatch 的 type
   * @param payload 请求参数
   */
  const getInterfaceData = (type: string, payload: any = { sort: 'id', order: 'asc', filter: JSON.stringify([]) }): Promise<any> => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: type,
        payload: payload,
        callback: (res: any) => {
          if (res && res.rows) {
            resolve(res.rows);
          } else {
            resolve(res);
          }
        },
      });
    });
  };


  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "branch_comp_name",
      "dep_name",
      {
        "title": "compinfo.contract_name",
        "subTitle": "合同名称",
        "dataIndex": "contract_name",
        "width": 160,
        "align": "center",
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
      'contractor_name',
      "contractor_manager",
      "register_number",
      "contact_phone",
      'belong_month',
      "monthly_person_count",
      "monthly_output_value",
      'cumulative_output_value',
      "actual_start_date_str",
      "actual_end_date_str",
      'remark',
      "report_date_str",
      "form_maker_name",
      "project_principal",
    ])
      .needToExport([
        "branch_comp_name",
        "dep_name",
        "contractor_name",
        "contractor_manager",
        "register_number",
        "contact_phone",
        "contract_name",
        'belong_month',
        "monthly_person_count",
        "monthly_output_value",
        'cumulative_output_value',
        "actual_start_date_str",
        "actual_end_date_str",
        'remark',
        "report_date_str",
        "form_maker_name",
        "project_principal",
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
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      </Space>,
      
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
                type: "monthlyOutput/delMonthlyOutput",
                payload: {
                  monthly_output_id: selectedRows[0]['monthly_output_id'],
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
        rowKey="monthly_output_id"
        tableTitle='承包商施工作业过程中监督检查表信息'
        type="monthlyOutput/queryMonthlyOutput"
        exportType="monthlyOutput/queryMonthlyOutput"
        tableColumns={getTableColumns()}
        funcCode={authority + '承包商施工作业过程中监督检查表1息'}
        tableSortOrder={{ sort: 'monthly_output_id', order: 'asc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersEngine()}
      />
      {open && selectedRecord && (
        <MonthlyOutputDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          getInterfaceData={getInterfaceData}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <MonthlyOutputAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          getInterfaceData={getInterfaceData}
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
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {editVisible && (
        <MonthlyOutputEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          getInterfaceData={getInterfaceData}
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
export default connect()(MonthlyOutputPage);
