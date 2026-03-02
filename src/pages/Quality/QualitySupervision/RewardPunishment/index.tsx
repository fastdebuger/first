import React, { useRef, useState } from 'react';
import { Button, DatePicker, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import RewardPunishmentAdd from "./Add";
import RewardPunishmentDetail from "./Detail";
import RewardPunishmentEdit from "./Edit";

const { RangePicker } = DatePicker;
/**
 * 质量奖惩情况
 * @constructor
 */
const RewardPunishmentPage: React.FC<any> = (props) => {
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


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'unit_name',
      {
        title: 'scoringPersonnel.wbs_name',
        subTitle: '项目部',
        dataIndex: 'wbs_name',
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
      "reward_punish_type",
      "stat_period",
      "reward_amount",
      "reward_reason",
      "punish_amount",
      "punish_reason",
    ])
      .noNeedToFilterIcon(["RowNumber",])
      .noNeedToSorterIcon(["RowNumber",])
      .needToExport([
        "RowNumber",
        'unit_name',
        "wbs_name",
        "reward_punish_type",
        "stat_period",
        "reward_amount",
        "reward_reason",
        "punish_amount",
        "punish_reason",
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
                type: "rewardPunishment/delInfo",
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
          placeholder={['统计开始日期', '统计结束日期']}
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
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='质量奖惩情况'
        type="rewardPunishment/getInfo"
        exportType="rewardPunishment/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "质量奖惩情况"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        moduleCaption={"质量奖惩情况"}
        tableDefaultField={{
          start_date: currentParams.start_date,
          end_date: currentParams.end_date,
        }}
        tableDefaultFilter={[
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
        renderSelfToolbar={renderSelfToolbar}
        sumCols={["reward_amount", "punish_amount"]}
      />
      {open && selectedRecord && (
        <RewardPunishmentDetail
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
        <RewardPunishmentAdd
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
        <RewardPunishmentEdit
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
export default connect()(RewardPunishmentPage);
