import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Tag, Input } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, SYS_BLACKLOG_STATUS } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { CONTRACTOR_STATUS_CONFIG } from "@/common/common";
import { getDefaultFiltersEngine } from "@/utils/utils";

import { configColumns } from "./columns";
import PersonInfoAdd from "./Add";
import PersonInfoDetail from "./Detail";
import PersonInfoEdit from "./Edit";

/**
 * 承包商人员信息
 * @constructor
 */
const PersonInfoPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { TextArea } = Input;
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isReasonVisible, setIsReasonVisible] = useState<boolean>(false);
  const [textAreaValue, setTextAreaValue] = useState<any>(null);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "wbs_name",
      "person_name",
      "id_card_no",
      'contract_no',
      "team_name",
      "position_name",
      "certificate_type",
      "certificate_no",
      'reason',
      "entry_date_str",
      "create_person",
      {
        title: "scheduleManagement.status",
        subTitle: "状态",
        dataIndex: "status",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          const statusStr = String(text);
          const config = CONTRACTOR_STATUS_CONFIG[statusStr];
          // 如果后台返回的null，则返回 -
          if (!config) {
            return <>-</>;
          }

          return <Tag color={config.color}>{config.text}</Tag>;
        }
      }

    ])
      .needToFixed([
        { value: 'status', fixed: 'right' }
      ])
      .needToExport([
        "wbs_name",
        "person_name",
        "id_card_no",
        'contract_no',
        "team_name",
        "position_name",
        "certificate_type",
        "certificate_no",
        'reason',
        "entry_date_str",
        "create_person",
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
    // 判断是否显示拉黑按钮只有一条数据且 status 为 0、1、3
    const showBlackButton = [0, 1, 3].includes(Number(selectedRows[0]?.status));
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
                type: "personInfo/deletePersonInfo",
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
      showBlackButton && (
        <Button
          style={{ display: hasPermission(authority, '拉黑') ? 'inline' : 'none' }}
          type={"primary"}
          danger
          onClick={() => {
            if (selectedRows.length === 0) {
              message.warn('请选择一条数据');
              return;
            }
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }

            setTextAreaValue(null);
            setSelectedRecord(selectedRows[0]);
            setIsReasonVisible(true);
          }}
        >
          拉黑
        </Button>
      )

    ]
  }

  /**
 * 处理拉黑原因确认后调用拉黑接口，并让用户写上拉黑原因
 */
  const handleReasonOk = () => {
    // 验证文本域输入值，如果为空则直接返回
    if (!textAreaValue) {
      return
    }

    // 发起拉黑人员的dispatch请求
    dispatch({
      type: 'personInfo/blockPerson',
      payload: {
        id: selectedRecord?.id,
        reason: textAreaValue
      },
      callback: (res: any) => {
        // 根据接口返回结果处理成功或失败的逻辑
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('拉黑成功！');
          // 重新加载表格数据
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        } else {
          message.error('拉黑失败');
        }
        // 关闭弹窗
        setIsReasonVisible(false);
      }
    })
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='承包商人员信息'
        type="personInfo/getPersonInfo"
        exportType="personInfo/getPersonInfo"
        importType="personInfo/importPersonInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + '承包商人员信息'}
        tableSortOrder={{ sort: 'entry_date', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersEngine()}

      />
      {open && selectedRecord && (
        <PersonInfoDetail
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
        <PersonInfoAdd
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
              return actionRef.current.importFile(file, 'importContractorPerson', () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('importContractorPerson');
            }
          }}
        />
      )}
      {editVisible && (
        <PersonInfoEdit
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

      {
        isReasonVisible && (
          <Modal
            title="拉黑原因"
            destroyOnClose
            closable
            open={isReasonVisible}
            onOk={handleReasonOk}
            onCancel={() => setIsReasonVisible(false)}
          >
            <TextArea
              value={textAreaValue}
              rows={4}
              placeholder='请输入拉黑原因'
              onChange={(e) => {
                setTextAreaValue(e.target.value)
              }}
            />
          </Modal>
        )
      }

    </div>
  )
}
export default connect()(PersonInfoPage);
