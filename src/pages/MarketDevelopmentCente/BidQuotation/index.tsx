import React, { useMemo, useRef, useState } from 'react';
import { Button, DatePicker, message, Modal, Space } from "antd";
import { connect } from 'umi';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { CURR_USER_CODE, ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import BidQuotationAdd from "./Add";
import BidQuotationDetail from "./Detail";
import BidQuotationEdit from "./Edit";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import BetchDownLoadButton from '@/components/BetchDownLoadButton';
import BaseCrudSingleMultiHeaderTable from '@/components/BaseCrudSingleMultiHeaderTable';

const { RangePicker } = DatePicker;

/**
 * 投标报价管理
 * @constructor
 */
const BidQuotationPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  // 当前日期选择过滤条件
  const [currentParams, setCurrentParams] = useState<{
    start_date: undefined | string,
    end_date: undefined | string,
  }>({
    start_date: undefined,
    end_date: undefined,
  });

  /**
   * 初始化过滤条件
   */
  const tableDefaultFilter = useMemo(() => {
    const baseFilter: any[] = [{ Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }];
    // 如果没有查看权限，则追加创建人过滤
    if (!hasPermission(authority, "查看")) {
      baseFilter.push({ Key: 'create_by', Val: CURR_USER_CODE, Operator: '=' });
    }
    return baseFilter;
  }, [authority]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "owner_unit_name",
      {
        title: 'BidQuotation.project_name',
        subTitle: '工程项目名称',
        dataIndex: 'project_name',
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
      "applicant_unit",
      "is_internal_project_str",
      "lt_5m_flag_str",
      "is_new_lowcarbon_str",
      "project_description",
      // "construction_location",
      "quotation_method",
      "bid_open_time_str",
      "bid_result",
      "winning_amount",
      'fact_sheet',
      ...[
        'fact_sheet_file',
        "resource_review_report",
        "tender_docs_and_attachments",
        "tender_doc_review",
        "bid_document",
        "bid_document_review",
        "winning_notice",
        "company_meeting_materials",
      ].map(item => {
        return {
          title: 'BidQuotation.' + item,
          dataIndex: item,
          subTitle: '附件',
          align: 'center',
          width: 240,
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
        }
      }),
      "crm_entry_no",
      "create_by_name",
      // "wbs_code",
    ])
      .setTableColumnsToMultiHeader([
        {
          title: '详细信息',
          children: [
            "project_description",
            // "construction_location",
            "quotation_method",
            "bid_open_time_str",
            "bid_result",
            "winning_amount",
          ],
        },
        {
          title: '招标文件管理',
          children: [
            "resource_review_report",
            "tender_docs_and_attachments",
            "tender_doc_review",
            "bid_document",
            "bid_document_review",
            "winning_notice",
          ],
        },
        {
          title: '',
          children: [
            "company_meeting_materials",
          ],
        },
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "owner_unit_name",
        'project_name',
        "applicant_unit",
        "is_internal_project_str",
        "lt_5m_flag_str",
        "is_new_lowcarbon_str",
        "project_description",
        // "construction_location",
        "quotation_method",
        "bid_open_time_str",
        "bid_result",
        "winning_amount",
        "resource_review_report",
        "tender_docs_and_attachments",
        "tender_doc_review",
        "bid_document",
        "bid_document_review",
        "winning_notice",
        "company_meeting_materials",
        "crm_entry_no",
        "create_by_name",
      ])
    return cols.getNeedMultiColumns();
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

    if (selectedRows.length !== 1) {
      return []
    }
    // 将object的文件类型处理从[file1,file2,file3...]形式
    const file = selectedRows[0];
    const fileResult = []
    if (file) {
      for (const key in file) {
        if (!Object.hasOwn(file, key)) continue;
        const files = [
          "resource_review_report",
          "tender_docs_and_attachments",
          "tender_doc_review",
          "bid_document",
          "bid_document_review",
          "winning_notice"
        ]
        if (files.includes(key)) {
          const element = file[key];
          if (element) {
            fileResult.push(getUrlCrypto(element))
          }
        }
      }
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
                type: "bidQuotation/delInfo",
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
      <BetchDownLoadButton
        text="批量下载"
        file_path={fileResult?.join(",")}
      />
    ]
  }

  /**
   * 日期搜索
   * @returns 
   */
  const renderSelfToolbar = () => {
    return (
      <Space>
        <RangePicker
          onChange={(dates: any) => {
            if (!dates?.[0] || !dates?.[1]) {
              setCurrentParams(prev => ({ ...prev, start_date: '', end_date: '' }));
              return;
            }
            const start_date = Math.floor(dates[0].startOf('day').valueOf() / 1000);
            const end_date = Math.floor(dates[1].endOf('day').valueOf() / 1000);
            setCurrentParams(prev => ({
              ...prev,
              start_date: String(start_date),
              end_date: String(end_date)
            }));
          }}
          placeholder={['开标开始日期', '开标结束日期']}
          format="YYYY-MM-DD"
        />
        <Button
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}>搜索</Button>
      </Space>
    )
  }

  return (
    <div>
      <BaseCrudSingleMultiHeaderTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='投标报价管理'
        moduleCaption='投标报价管理'
        type="bidQuotation/getInfo"
        exportType="bidQuotation/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "投标报价管理1"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        sumCols={["winning_amount"]}
        tableDefaultFilter={tableDefaultFilter}
        tableDefaultField={{
          open_start_date: currentParams.start_date,
          open_end_date: currentParams.end_date,
        }}
        renderSelfToolbar={renderSelfToolbar}
      />
      {open && selectedRecord && (
        <BidQuotationDetail
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
        <BidQuotationAdd
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
        <BidQuotationEdit
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
export default connect()(BidQuotationPage);
