import React, { useRef, useState } from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import { hasPermission } from "@/utils/authority";
import { Button, message, Modal, Space } from "antd";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";

import { configColumns } from "./columns";
import QualitySafetyFactorTypeAdd from "./Add";
import QualitySafetyFactorTypeEdit from "./Edit";
import QualitySafetyFactorTypeDetail from "./Detail";
import { ErrorCode } from "@yayang/constants";


/**
 * 问题归类配置
 * @param props
 * @constructor
 */
const QualitySafetyFactorTypePage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'problem_type_str',
      {
        title: "compinfo.problem_name",
        subTitle: "问题归类一级要素",
        dataIndex: "problem_name",
        align: "center",
        width: 160,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
            >{text ? text : "/"}</a>
          )
        }
      },

    ]).initBodyTableColumns([
      'problem_b_name',
      'weight_num',
    ])
      .needToExport([
        "problem_type_str",
        "problem_name",
        "problem_b_name",
        "weight_num",
      ])
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
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
            // style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        </Space>
      ],
      [],
      [
        <Space>
          <Button
            type={"primary"}
            // style={{ display: hasPermission(authority, "导出") ? "inline-block" : "none" }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        </Space>
      ],
    ]
  }

  return (
    <div>
      <BaseHeaderAndBodyTable
        cRef={actionRef}
        tableTitle={'问题归类配置'}
        header={{
          sort: "form_no",
          order: "desc",
          rowKey: "form_no",
          type: "qualitySafetyFactorType/queryQualitySafetyFactorTypeHead",
          exportType: "qualitySafetyFactorType/queryQualitySafetyFactorTypeHead",
          importType: "",
        }}
        scan={{
          sort: "form_no",
          order: "desc",
          rowKey: "form_no",
          type: "qualitySafetyFactorType/queryQualitySafetyFactorTypeFlat",
          exportType: "qualitySafetyFactorType/queryQualitySafetyFactorTypeFlat",
          importType: "",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        funcCode={authority}
        selectedRowsToolbar={() => {
          return {
            headerToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [
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
                          type: "qualitySafetyFactorType/delQualitySafetyFactorType",
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
              ],
            scanToolbar: (
              selectedRows?: any[],
              reloadTable?: (
                filters?: { Key: string; Val: string; Operator?: string }[],
                noFilters?: any,
              ) => void,
            ) => [],
          }
        }}
      />
      {open && (
        <QualitySafetyFactorTypeDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <QualitySafetyFactorTypeEdit
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
        <QualitySafetyFactorTypeAdd
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
    </div>
  )
}
export default connect()(QualitySafetyFactorTypePage);
