import React, { useRef, useState } from 'react';
import { Button, message, Space, DatePicker, Tag } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { getEvaluationStatusByScore } from "@/common/common";
import { getDifferentInterface } from "@/utils/utils";

import { hasPermission } from "@/utils/authority";
import moment from "moment";

import { configColumns } from "./columns";
import ContractorModal from "./ContractorModal";
import AppraiseInfoEdit from "./Edit";
import EditBranchCompEval from "./EditBranchCompEval";
import CompEditBranchCompEval from "./CompEditBranchCompEval";

/**
 * 承包商年度评价基本信息
 * @constructor
 */
const ContractorAnnualEval: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [defaultCurrent, setDefaultCurrent] = useState<any>(new Date().getFullYear());


  // 判断模块公司层级以及分公司层级和项目部层级
  const getDefaultFiltersEngine = () => {
    // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
    switch (PROP_KEY) {
      // 公司级
      case 'branchComp':
        return [];
      // 分公司
      case 'subComp':
        return [
          { Key: 'branch_comp_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=' }
        ];
        // 项目部
      case 'dep':
        return [
          { Key: 'dep_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }
        ];
      default:
        return [];
    }
  };

  /**
   * 获取接口数据（异步）
   * 封装统一的调用接口的函数，来用并发多个接口，如编辑的时候查表单详情数据，以及业绩评价(项目部考核)数据
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
    let levelColumns: any = [];
    if(PROP_KEY === 'branchComp'){
      levelColumns.push(
        'comp_score',
        'comp_principal',
        'comp_reason',
        {
          title: "scheduleManagement.evaluation",
          subTitle: "评估结果",
          dataIndex: "evaluation",
          width: 210,
          align: "center",
          render: (_text: any, record: any) => {
            const status = getEvaluationStatusByScore(record?.comp_score);
            if (!status) {
              return <Tag>-</Tag>;
            }
            return <Tag color={status.color}>{status.text}</Tag>;
          }
        }
      )
    } else if (PROP_KEY === 'subComp') {
      levelColumns.push(
        'branch_comp_name',
        'contract_out_score',
        'contract_out_principal',
        'contract_out_reason'
      )

    } else {
      levelColumns.push("branch_comp_name", 'dep_name')
    }

    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'belong_year',
      'contractor_name',
      "contractor_manager",
      "register_number",
      "contact_phone",
      ...levelColumns,
      PROP_KEY !== 'branchComp' && {
        "title": "compinfo.is_publish",
        "subTitle": "发布",
        "dataIndex": "is_publish",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          const numText = Number(text);
          if(numText === 1){
            return (
              <Tag color='success'>已发布</Tag>
            )
          }else {
            return (
              <Tag color='error'>未发布</Tag>
            )
          }
        }
      },
      "create_ts_format",
      "create_user_name",
      "modify_ts_format",
      'modify_user_name',
      {
        "title": "compinfo.action",
        "subTitle": "评价",
        "dataIndex": "action",
        "width": 210,
        "align": "center",
        render: (_text: any, record: any) => {
          return (
            <Space>
              {
                PROP_KEY === 'dep' && (
                  <Button
                    type='link'
                    size='small'
                    onClick={() => {
                      setSelectedRecord(record);
                      setAddVisible(true);
                    }}
                  >评价</Button>
                )
              }
              {
                PROP_KEY === 'subComp' && (
                  <EditBranchCompEval
                    selectedRows={record}
                    authority={authority}
                    getInterfaceData={getInterfaceData}
                    onSuccess={() => {
                      if (actionRef.current) {
                        actionRef.current.reloadTable();
                      }
                    }}
                  />
                )
              }
              {
                PROP_KEY === 'branchComp' && (
                  <CompEditBranchCompEval
                    selectedRows={record}
                    authority={authority}
                    getInterfaceData={getInterfaceData}
                    onSuccess={() => {
                      if (actionRef.current) {
                        actionRef.current.reloadTable();
                      }
                    }}
                  />
                )
              }
            </Space>

          )
        }
      }
    ])
      .noNeedToFilterIcon(['action'])
      .noNeedToSorterIcon(['action'])
      .needToFixed([{ value: 'action', fixed: 'right' }])
      .needToExport([
        "branch_comp_name",
        "dep_name",
        'belong_year',
        "contractor_name",
        "contractor_manager",
        "register_number",
        "contact_phone",
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
    // 已经发布了的，不能重新发布
    const flowStatusFlag = selectedRows.every((row: any) => Number(row.is_publish) === 0);
    return [
      PROP_KEY === 'dep' && flowStatusFlag && <Button
        style={{ display: hasPermission(authority, '发布') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows?.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          dispatch({
            type: 'appraiseInfo/publishScoreDep',
            payload: {
              head_id: selectedRows[0].head_id
            },
            callback: (res: any) => {
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('发布成功！');
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              }
            }
          })
        }}
      >
        发布
      </Button>,
      // PROP_KEY === 'subComp' && flowStatusFlag && <Button
      //   // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
      //   type={"primary"}
      //   onClick={() => {
      //     if (selectedRows?.length !== 1) {
      //       message.warn('每次只能操作一条数据');
      //       return;
      //     }
      //     setSelectedRecord(selectedRows[0]);
      //     dispatch({
      //       type: 'appraiseInfo/publishScoreBranch',
      //       payload: {
      //         id: selectedRows[0].id
      //       },
      //       callback: (res: any) => {
      //         if (res.errCode === ErrorCode.ErrOk) {
      //           message.success('发布成功！');
      //           if (actionRef.current) {
      //             actionRef.current.reloadTable();
      //           }
      //         }
      //       }
      //     })
      //   }}
      // >
      //   发布
      // </Button>,
      PROP_KEY === 'dep' && (
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
            setEditVisible(true);
          }}
        >
          编辑
        </Button>
      ),

    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey={getDifferentInterface().payload.sort}
        tableTitle='承包商年度评价基本信息'
        type={getDifferentInterface()?.type}
        exportType={getDifferentInterface().type}
        tableColumns={getTableColumns()}
        funcCode={authority + '承包商年度评价基本信息'}
        tableSortOrder={getDifferentInterface().payload}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultField={{ belong_year: defaultCurrent }}
        tableDefaultFilter={getDefaultFiltersEngine()}
        renderSelfToolbar={() => {
          const onChange = (_date: any, dateString: any) => {
            setDefaultCurrent(dateString);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          };
          return (
            <Space>
              <DatePicker
                defaultValue={moment()}
                style={{ width: 200 }}
                onChange={onChange}
                picker="year"
                format="YYYY"
              />
            </Space>
          )
        }}
      />
      {addVisible && (
        <ContractorModal
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          selectedRecord={selectedRecord}
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
        <AppraiseInfoEdit
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
export default connect()(ContractorAnnualEval);
