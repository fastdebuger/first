import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import ExperienceAdd from "./Add";
import ExperienceDetail from "./Detail";
import ExperienceEdit from "./Edit";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';

/**
 * 经验分享上传
 * @constructor
 */
const ExperiencePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const isProduction = process.env.BUILD_ENV === 'pro';

  /**
   * 由于审批只需要安全环保部的人进行审批
   * 所以需要将过滤条件替换一下
   */
  const environmentFilter = {
    prop_key: "institutions",
  }
  // 根据是否是正式环境替换不同的过滤条件
  if (isProduction) {
    Object.assign(environmentFilter, {
      obs_code: "C01.institutions.13",
      depCode: "C01",
      dep_code: "C01",
      wbsCode: "C01",
      wbs_code: "C01",
    })
  } else {
    Object.assign(environmentFilter, {
      obs_code: "1325.institutions.13250009",
      depCode: "1325",
      dep_code: "1325",
      wbsCode: "1325",
      wbs_code: "1325",
    })
  }


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'title',
      'dict_name',
      'publish_content',
      'scene',
      'keywords',
      {
        title: 'HSELegislation.file_path',
        dataIndex: 'file_path',
        subTitle: '文件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      "create_by_name",
      "update_by_name",
      "audit_date_str",
      "create_date_str",
      "audit_status_name",
    ])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
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

    const selectedRecord = selectedRows[0]
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
          setSelectedRecord(selectedRows);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      // 发起审批
      <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordMainId={selectedRecord?.main_id}
        selectedRecord={selectedRecord}
        allowedApproval={selectedRecord?.audit_status === "0"}
        dispatch={dispatch}
        funcode={'S26'}
        fetchUserType="common/queryUserInfo"
        type='experience/sendApproval'
        userInfoByPlayload={environmentFilter}
        additionalParameters={{
          title: selectedRecord?.title
        }}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // 查看审批
      <ViewApproval
        back={false}
        key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
        instanceId={selectedRecord?.audit_id}
        funcCode={'S26'}
        number={selectedRecord?.number}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
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
                type: "experience/delInfo",
                payload: {
                  main_id: selectedRecord['main_id'],
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
      <Alert type="info" message="可以分享安全经验分享上传材料（PPT/视频）、HSE管理方案、最佳实践案例、典型事故教训总结等"></Alert>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="main_id"
        tableTitle='经验分享上传'
        type="experience/getApprovalList"
        exportType="experience/getApprovalList"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getApprovalList'}
        rowSelection={{ type: 'radio' }}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <ExperienceDetail
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
        <ExperienceAdd
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
              const formData = new FormData();
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
        <ExperienceEdit
          visible={editVisible}
          selectedRecord={selectedRecord?.[0]}
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
export default connect()(ExperiencePage);
