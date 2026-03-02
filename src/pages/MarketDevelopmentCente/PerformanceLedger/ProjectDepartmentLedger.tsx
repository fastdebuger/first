import React, { useRef, useState } from 'react';
import { Button, DatePicker, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import PerformanceLedgerAdd from "./Add";
import PerformanceLedgerDetail from "./Detail";
import PerformanceLedgerEdit from "./Edit";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import PreViewFile from './PreViewFile';
import BetchDownLoadButton from '@/components/BetchDownLoadButton';

const { RangePicker } = DatePicker;


/**
 * 公司业绩台账
 * @constructor
 */
const ProjectDepartmentLedger: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  //当前日期过滤条件
  const [currentParams, setCurrentParams] = useState<{
    start_begin_date: undefined | string,
    start_last_date: undefined | string,
    end_begin_date: undefined | string,
    end_last_date: undefined | string,
    begin_date: undefined | string,
    last_date: undefined | string,
  }>({
    start_begin_date: undefined,
    start_last_date: undefined,
    end_begin_date: undefined,
    end_last_date: undefined,
    begin_date: undefined,
    last_date: undefined,
  });

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      // "contract_income_id",
      {
        title: 'PerformanceLedger.performance_type',
        subTitle: '业绩细分',
        dataIndex: 'performance_type',
        align: 'center',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      "performance_detail_name",
      "project_name",
      "construction_unit",
      "branch_company",
      "contract_mode",
      "contract_type",
      "start_date_str",
      "end_date_str",
      "contract_amount",
      "work_scope",
      "contract_year",
      "main_engineering",
      ...[
        "contract_key_pages",
        "handover_report",
      ].map(item => {
        return {
          title: 'PerformanceLedger.' + item,
          dataIndex: item,
          subTitle: '附件',
          align: 'center',
          width: 240,
          render: (text: any) => {
            if (text) {
              const previewUrl = text;
              // 公司级下载
              if (PROP_KEY === "branchComp") {
                return (
                  <Button
                    onClick={() => window.open(getUrlCrypto(text))}
                    size='small'
                    type='link'
                  >下载文件</Button>
                )
              }
              // 项目部和分公司只支持预览
              return (
                <PreViewFile previewUrl={previewUrl} />
              );
            }
            return '-'
          }
        }
      }),
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        'performance_type',
        "performance_detail_name",
        "project_name",
        "construction_unit",
        "branch_company",
        "contract_mode",
        "contract_type",
        "start_date_str",
        "end_date_str",
        "contract_amount",
        "work_scope",
        "contract_year",
        "main_engineering",
        "contract_key_pages",
        "handover_report",
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

    const filePaths = selectedRows
      ?.flatMap(item => [
        item.contract_key_pages ? getUrlCrypto(item.contract_key_pages) : null,
        item.handover_report ? getUrlCrypto(item.handover_report) : null
      ])
      ?.filter(url => url && !url.startsWith('null'))
      ?.join(",");


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
                type: "performanceLedger/delInfo",
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
      PROP_KEY === "branchComp" && <BetchDownLoadButton
        key="batch-download"
        file_path={filePaths}
      />
    ]
  }


  /**
   * 日期搜索
   * @returns 
   */
  const renderSelfToolbar = () => {

    const handleRangeChange = (dates: any, startField: string, endField: string) => {
      if (!dates?.[0] || !dates?.[1]) {
        setCurrentParams(prev => ({ ...prev, [startField]: '', [endField]: '' }));
        return;
      }

      const start_date = String(Math.floor(dates[0].startOf('day').valueOf() / 1000));
      const end_date = String(Math.floor(dates[1].endOf('day').valueOf() / 1000));

      setCurrentParams(prev => ({
        ...prev,
        [startField]: start_date,
        [endField]: end_date
      }));
    };

    return (
      <Space>
        <RangePicker
          placeholder={['开工开始日期', '开工结束日期']}
          format="YYYY-MM-DD"
          onChange={(dates) => handleRangeChange(dates, 'start_begin_date', 'start_last_date')}
        />

        <RangePicker
          placeholder={['竣工开始日期', '竣工结束日期']}
          format="YYYY-MM-DD"
          onChange={(dates) => handleRangeChange(dates, 'end_begin_date', 'end_last_date')}
        />

        <RangePicker
          placeholder={['开工开始日期', '竣工结束日期']}
          format="YYYY-MM-DD"
          onChange={(dates) => handleRangeChange(dates, 'begin_date', 'last_date')}
        />
        <Button
          onClick={() => actionRef.current?.reloadTable()}
        >
          搜索
        </Button>
      </Space>
    );
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle='业绩台账'
        type="performanceLedger/getInfo"
        exportType="performanceLedger/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "公司业绩台账"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        moduleCaption='业绩台账'
        tableDefaultFilter={[
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
        tableDefaultField={{
          ...currentParams
        }}
        renderSelfToolbar={renderSelfToolbar}
      />
      {open && selectedRecord && (
        <PerformanceLedgerDetail
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
        <PerformanceLedgerAdd
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
      {editVisible && (
        <PerformanceLedgerEdit
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
export default connect()(ProjectDepartmentLedger);
