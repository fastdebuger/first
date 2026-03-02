import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import TechnologyBaseDataAdd from "./Add";
import TechnologyBaseDataDetail from "./Detail";
import TechnologyBaseDataEdit from "./Edit";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApprovalSelection from '@/components/Approval/InitiateApprovalSelection';
import ViewApproval from '@/components/Approval/ViewApproval';
import { getPrintUrl } from '@/utils/utils';
import IframeComponent from '@/components/IframeComponent';

/**
 * 施工技术方案审批
 * @constructor
 */
const TechnologyAuditConstruction: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [printUrl, setPrintUrl] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "分公司名称",
        subTitle: "分公司名称",
        dataIndex: "up_wbs_name",
        width: 200,
        align: "center",
      },
      'out_info_dep_name',
      {
        title: "工程名称",
        subTitle: "工程名称",
        dataIndex: "contract_out_name",
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
      'base_data_name',
      {
        title: '施工技术方案',
        dataIndex: 'file_url1',
        subTitle: '施工技术方案',
        align: 'center',
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
          return '暂无文件';
        },
      },
      {
        title: '项目审核意见',
        dataIndex: 'file_url2',
        subTitle: '项目审核意见',
        align: 'center',
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
          return '暂无文件';
        },
      },
      {
        title: '分公司审核意见',
        dataIndex: 'file_url3',
        subTitle: '分公司审核意见',
        align: 'center',
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
          return '暂无文件';
        },
      },
      {
        title: '公司审核意见',
        dataIndex: 'file_url5',
        subTitle: '公司审核意见',
        align: 'center',
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
          return '暂无文件';
        },
      },
      {
        title: '其他',
        dataIndex: 'file_url4',
        subTitle: '其他',
        align: 'center',
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
          return '暂无文件';
        },
      },
      'level_str',
      'data_ts_str',
      'status_str',
      'form_maker_name',
      'form_make_time_str',
    ])
      .needToExport([
        'up_wbs_name',
        'out_info_dep_name',
        'contract_out_name',
        'base_data_name',
        'file_url1',
        'file_url2',
        'file_url3',
        'file_url5',
        'file_url4',
        'level_str',
        'data_ts_str',
        'status_str',
        'form_maker_name',
        'form_make_time_str',
      ])
      .needToFixed([{ value: 'contract_say_price_str', fixed: 'right' }])
      .noNeedToFilterIcon(['contract_say_price_str'])
      .noNeedToSorterIcon(['contract_say_price_str'])
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
    let approvalFuncode = ''

    // 判断不同的工程金额对应的审批模板号
    if (selectedRows[0]?.level === '0') {
      approvalFuncode = 'S37';
    } else {
      approvalFuncode = 'S38';
    }

    let allowedApproval = true
    // 判断如果审批流程号存在那么无法重新发起审批
    if (selectedRows[0]?.status === 0 || selectedRows[0]?.status === -1) {
      allowedApproval = true
    } else {
      allowedApproval = false
    }

    let reportName = '';
    if (selectedRows[0]?.level === '0') {
      reportName = 'Generally-plan';
    } else {
      reportName = 'Major-plan';
    }

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
          if (selectedRows[0]?.status !== 0 && selectedRows[0]?.status !== -1) {
            message.warning("当前数据已进行审批无法更改");
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      // 发起审批
      <InitiateApprovalSelection
        key={selectedRows[0]?.id || 'default'} // 添加key属性强制重新渲染
        selectedRecord={selectedRows[0]}
        recordId={selectedRows[0]?.id}
        funcode={approvalFuncode}
        allowedApproval={allowedApproval}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // 查看审批
      <ViewApproval
        key={`view-${selectedRows[0]?.id || 'default'}`} // 添加key属性强制重新渲染
        instanceId={selectedRows[0]?.approval_process_id}
        funcCode={approvalFuncode}
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <Button
        key={authority + 'print'}
        // style={{ display: hasPermission(authority, '打印') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setIframeVisible(true);
          setPrintUrl(getPrintUrl('TQID', reportName, {
            id: selectedRows[0]?.id,
            type_code: '3'
          }));
        }}
      >
        打印
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
          if (selectedRows[0]?.status !== 0) {
            message.warning("当前数据已进行审批无法更改");
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
                type: "technologyBaseData/deleteTechnologyBaseData",
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
        tableTitle={"施工技术方案审批"}
        type="technologyBaseData/getTechnologyBaseData"
        exportType="technologyBaseData/getTechnologyBaseData"
        tableColumns={getTableColumns()}
        funcCode={`${authority}3`}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        tableDefaultField={{ type_code: '3' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <TechnologyBaseDataDetail
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
        <TechnologyBaseDataAdd
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
        <TechnologyBaseDataEdit
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
      {iframeVisible && (
        <IframeComponent
          visible={iframeVisible}
          cancel={() => setIframeVisible(false)}
          title="施工技术方案"
          url={printUrl}
        />
      )}
    </div>
  )
}
export default connect()(TechnologyAuditConstruction);




