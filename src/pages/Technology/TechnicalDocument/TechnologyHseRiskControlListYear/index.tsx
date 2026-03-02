import React, { useEffect, useRef, useState } from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import { hasPermission } from "@/utils/authority";
import { Alert, Button, message, Modal, Space } from "antd";
import { BaseImportModal, BasicTableColumns } from "yayang-ui";
import { connect } from "umi";

import { configColumns } from "./columns";
import TechnologyHseRiskControlListYearAdd from "./Add";
import TechnologyHseRiskControlListYearEdit from "./Edit";
import TechnologyHseRiskControlListYearDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";
import { WBS_CODE } from "@/common/const";
import { getIsCurrentDataMaintainable } from "@/services/technology/technicalDocument/technologyAudit";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";


/**
 * HSE重大风险及控制措施清单
 * @param props
 * @constructor
 */
const TechnologyHseRiskControlListYearPage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [isCurrentDataMaintainable, setIsCurrentDataMaintainable] = useState<boolean>(false);
  const [promptData, setPromptData] = useState<string>('');

  const getIsCurrentDataMaintainableData = async () => {
    const res = await getIsCurrentDataMaintainable({
      type_code: '0',
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

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "单位",
        subTitle: "单位",
        dataIndex: "dep_name",
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
      'form_maker_name',
      'form_make_time_str',
    ]).initBodyTableColumns([
      'contract_out_name',
      'level1_flow',
      'level2_flow',
      'level3_flow',
      'detail_position',
      'equipment_tool',
      'hazard_category',
      'main_consequence',
      'control_measures',
      'responsible_person',
      'responsible_unit',
      'plan_implement_time_str',
      'remark',
    ])
      .needToExport([
        'dep_name',
        'form_maker_name',
        'form_make_time_str',
        'contract_out_name',
        'level1_flow',
        'level2_flow',
        'level3_flow',
        'detail_position',
        'equipment_tool',
        'hazard_category',
        'main_consequence',
        'control_measures',
        'responsible_person',
        'responsible_unit',
        'plan_implement_time_str',
        'remark',
      ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'plan_implement_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    // 如果当前时间无法填报，那么只返回导出按钮
    if (!isCurrentDataMaintainable) {
      return [
        [
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        ],
        [],
        [
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        ],
      ];
    }
    return [
      [
        <Space>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "新增") ? "inline-block" : "none" }}
            onClick={() => {

              setAddVisible(true);
            }}
          >新增</Button>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
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
      ],
      [],
      [
        <Space>
          <Button
            type={"primary"}
            style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
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
      <BaseHeaderAndBodyTable
        key={isCurrentDataMaintainable}
        cRef={actionRef}
        tableTitle="HSE重大风险及控制措施清单"
        header={{
          sort: "form_make_time",
          order: "desc",
          rowKey: "form_no",
          type: "technologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearHead",
          exportType: "technologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearHead",
          importType: "technologyHseRiskControlListYear/importTechnologyHseRiskControlListYear",
        }}
        scan={{
          sort: "form_make_time",
          order: "desc",
          rowKey: "form_no",
          type: "technologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearFlat",
          exportType: "technologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearFlat",
          importType: "technologyHseRiskControlListYear/importTechnologyHseRiskControlListYear",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        funcCode={authority + 'HSE重大风险及控制措施清单'}
        selectedRowsToolbar={() => {
          return {
            headerToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => {
              if (!selectedRows || selectedRows.length !== 1) {
                return []
              }
              // 如果当前非填报时间，那么就能查看审批
              if (!isCurrentDataMaintainable) {
                return [

                ];
              }
              // 如果当前时间无法填报，那么返回空数组
              return [
                <Button
                  type={"primary"}
                  style={{ display: hasPermission(authority, "编辑") ? "inline-block" : "none" }}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
                      message.warn('每次编辑一行数据')
                      return;
                    }

                    setSelectedRecord(selectedRows[0])
                    setEditVisible(true);
                  }}
                >编辑</Button>,
                <Button
                  style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
                  danger
                  type={"primary"}
                  onClick={() => {
                    if (selectedRows?.length !== 1) {
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
                          type: "technologyHseRiskControlListYear/delTechnologyHseRiskControlListYea",
                          payload: {
                            form_no: selectedRows[0]['form_no'],
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
            },
            scanToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [],
          }
        }}
        tableDefaultFilter={[
          {
            Key: 'type_code',
            Val: '0',
            Operator: '=',
          },
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
        caption="HSE重大风险及控制措施清单"
      />
      {open && (
        <TechnologyHseRiskControlListYearDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <TechnologyHseRiskControlListYearEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <TechnologyHseRiskControlListYearAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
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
              return actionRef.current.importFile(file, 'technologyHseRiskControlListYear_1', () => {
                setVisible(false);

              }, '0');
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('technologyHseRiskControlListYear_1');
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(TechnologyHseRiskControlListYearPage);
