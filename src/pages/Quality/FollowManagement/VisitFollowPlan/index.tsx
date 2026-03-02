import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space, Radio } from "antd";
import { connect, useIntl, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, WBS_CODE,HUA_WEI_OBS_CONFIG } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApprovalButton from "@/components/InitiateApprovalButton";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

import { configColumns } from "./columns";
import MonitoringMeasuringAdd from "./Add";
import MonitoringMeasuringDetail from "./Detail";
import MonitoringMeasuringEdit from "./Edit";
import IframeModal from "@/components/IframeComponent";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 质量回访计划
 * @constructor
 */
const VisitFollowPlan: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  /**
   * 可以引用表格的.current属性可以在不触发重新渲染的情况下被更新
   */
  const actionRef: any = useRef();
  // 用于格式化国际化消息的函数
  const { formatMessage } = useIntl();
  // 用于控制导入的状态
  const [visible, setVisible] = useState(false);
  // 用于新增的状态
  const [addVisible, setAddVisible] = useState(false);
  // 用于编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于控制的详情状态
  const [open, setOpen] = useState(false);
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);
  // 用于控制管理查看报表功能的状态变量
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  // 判断当前是否为生产环境
  const isProduction = process.env.BUILD_ENV === 'pro';
  // 用于储存显示发布时间
  const [publishTime, setPublishTime] = useState<any>(null);
  // 用于控制Modal上传附件的显示状态
  const [isOnDutyVisible, setIsOnDutyVisible] = useState<boolean>(false);
  // url路径
  const [urlFile,setUrlFile] = useState<any>(null);
  // 查询当前年份和月份是否已经发布（发布了的话会返回发布时间） 
  const fetchCurrentPublish = () => {
    const basePayload: any = {
      year: defaultYear,
    }
    if (PROP_KEY === 'dep') {
      basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
    }
    if (PROP_KEY === 'subComp') {
      basePayload.sub_comp_code = WBS_CODE;
      basePayload.dep_code = undefined;
      basePayload.depCode = undefined;
    }
    dispatch({
      type: 'workLicenseRegister/getVisitPlanSubmitRecordTime',
      payload: basePayload,
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          if (res?.result?.submit_str) {
            setPublishTime(res?.result?.submit_str);
          } else {
            setPublishTime(false);
          }
        }
      }
    })
  }
  useEffect(() => {
    // 查询当前年份和月份是否已经发布（发布了的话会返回发布时间）
    fetchCurrentPublish();
  }, [defaultYear, defaultMonth]);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      'owner_name', // 建设单位名称 
      // "contract_no",
      'contract_name', // 回访工程（产品）名称
      'contract_end_date',
      "visit_date",
      "responsible_person",
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      'is_finish_str',
    ])
      .needToFixed([
        { value: 'is_finish_str', fixed: 'right' }
      ])
      .setTableColumnToDatePicker([
        { value: 'contract_end_date', valueType: 'dateTs' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'owner_name', // 建设单位名称 
        'contract_name', // 回访工程（产品）名称
        'contract_end_date',
        "visit_date",
        "responsible_person",
        'is_finish_str',
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name',
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
          type="primary"
          onClick={() => {
            const basePayload: any = {
              year: defaultYear,
            }
            if (PROP_KEY === 'dep') {
              basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
            }
            if (PROP_KEY === 'subComp') {
              basePayload.sub_comp_code = WBS_CODE;
              basePayload.dep_code = undefined;
              basePayload.depCode = undefined;
            }
            dispatch({
              type: 'workLicenseRegister/getVisitPlanSubmitRecordTime',
              payload: basePayload,
              callback: (res: any) => {
                if (res.errCode === ErrorCode.ErrOk) {
                  if (res?.result?.submit_str) {
                    message.error('您当前年份已经推送，不能新增了！');
                  } else {
                    setAddVisible(true);
                  }
                }
              }
            })
          }}
        >
          新增
        </Button>
        <Button
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      </Space>

    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      PROP_KEY === 'branchComp' && (
        <Button
          type={"primary"}
          onClick={() => {
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }
            setSelectedRecord(selectedRows[0]);
            setEditVisible(true);
          }}
        >
          编辑
        </Button>),
      PROP_KEY === 'branchComp' && (
        <Button
          danger
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
                  type: "workLicenseRegister/deleteVisitPlan",
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
        </Button>),
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          let baseUrl: any;
          if (isProduction) {
            // 正式环境
            baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/TQID/FR.cpt&id=${selectedRows[0].id}`;
          } else {
            // 测试/本地环境
            baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/TQID/FR.cpt&id=${selectedRows[0].id}`;
          }
          setPrintUrl(baseUrl);
          setIframeVisible(true);
        }}
      >
        质量回访记录
      </Button>,
      <Button
      type={"primary"}
      onClick={() => {
        if (selectedRows.length !== 1) {
          message.warn('每次只能操作一条数据');
          return;
        }
        // setUrlFile(selectedRows[0]?.url ?? null);
        console.log(selectedRows[0].url,"selectedRows[0]");
        setSelectedRecord(selectedRows[0]);
        setIsOnDutyVisible(true);
      }}
    >
      添加附件
    </Button>
    ]
  }

  
  /**
  * 处理模态框确认按钮点击
  * 该函数会在用户点击模态框的确认按钮时触发
  */
  const handleModalOk = () => {
    if (!urlFile) {
      message.warn('请您上传文件后提交!');
      return;
    }
    // 确认在岗状态接口成功后显示成功消息并重新加载表格
    dispatch({
      type: 'workLicenseRegister/addVisitRecordUrl',
      payload: {
        id: selectedRecord?.id,
        url: urlFile
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('上传成功');
          if (actionRef?.current) {
            actionRef?.current?.reloadTable();
          }
        }
        setIsOnDutyVisible(false);
      }
    })
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'质量回访计划'}
        type="workLicenseRegister/getVisitPlan"
        exportType="workLicenseRegister/getVisitPlan"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getVisitPlan'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { "Key": "year", "Val": defaultYear || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                showMonth={false}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />

              <>
                <Button
                  type={"primary"}
                  disabled={publishTime}
                  onClick={() => {
                    let basePayload: any = {
                      year: defaultYear,
                    }
                    if (PROP_KEY === 'dep') {
                      basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
                    }
                    if (PROP_KEY === 'subComp') {
                      basePayload.sub_comp_code = WBS_CODE;
                      basePayload.dep_code = undefined;
                      basePayload.depCode = undefined;
                    }
                    dispatch({
                      type: 'workLicenseRegister/submitVisitPlan',
                      payload: basePayload,
                      callback: (res: any) => {
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success('推送成功');
                          fetchCurrentPublish();
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
                        }
                      }
                    })
                  }}
                >
                  {publishTime ? '已推送' : '推送'}
                </Button>
                推送时间：{publishTime || '未推送'}
              </>
            </Space>

          )
        }}
      />
      {open && selectedRecord && (
        <MonitoringMeasuringDetail
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
        <MonitoringMeasuringAdd
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
        <MonitoringMeasuringEdit
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
      {iframeVisible && printUrl && (
        <IframeModal
          visible={iframeVisible}
          cancel={() => {
            setIframeVisible(false);
            setPrintUrl('');
          }}
          title={'质量回访记录'}
          url={printUrl}
        />
      )}

      <Modal
        title={`添加质量回访记录附件`}
        open={isOnDutyVisible}
        onOk={handleModalOk}
        onCancel={() => setIsOnDutyVisible(false)}
        destroyOnClose
      >
        附件：
        <HuaWeiOBSUploadSingleFile
          value={selectedRecord?.url}
          accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
          sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
          limitSize={100}
          folderPath="/Engineering/WorkLicenseRegister"
          handleRemove={() => {
            setUrlFile(null);
          }}
          /**
           * 文件上传变更处理函数
           * @param file - 上传的文件的信息
           */
          onChange={(file: any) => {
            setUrlFile(file?.response?.url);
          }}
        />
      </Modal>
    </div>
  )
}
export default connect()(VisitFollowPlan);
