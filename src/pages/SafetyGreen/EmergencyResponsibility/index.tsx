import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { connect } from 'umi';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from '@/common/const';
import { configColumns } from './columns';
import EmergencyResponsibilityAdd from './BetchAdd';
import EmergencyResponsibilityEdit from './Edit';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { hasPermission } from '@/utils/authority';
import EmergencyResponsibilityDetail from './Detail'
import ViewTheReport from '@/components/ViewTheReport';

interface MainContractProgressProps {
  dispatch: any;
  route: { authority: string };
  allUserListList: any;
}

/**
 * 应急预案台账列表
 * @constructor
 */
const MainContractProgress: React.FC<MainContractProgressProps> = (props) => {
  const {
    dispatch,
    route: { authority },
    allUserListList
  } = props;

  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [recordList, setRecordList] = useState<any | null>(null);
  const [delName, setDelName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // 初始化数据
  useEffect(() => {
    if (dispatch) {
      //allUserListList没有数据的时候，请求数据
      if (allUserListList?.length === 0) {
        // 查看人员
        dispatch({
          type: "common/queryUserInfo",
          payload: {
            sort: 'user_code',
            order: 'desc',
            filter: JSON.stringify([
              { "Key": "other_account", "Operator": "=", "Val": "01" }
            ]),
            prop_key: PROP_KEY
          }
        });
      }

    }
  }, [])


  /**
   * 删除应急预案
   */
  const handleDel = () => {
    dispatch({
      type: 'emergencyplan/deleteContingencyPlan',
      payload: {
        id: recordList ? recordList?.id : '',
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }
        setDelVisible(false);
      },
    });
  };

  /**
   * 获取表格列
   * @returns
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'RowNumber',
        {
          title: 'emergencyplan.decision_info',
          subTitle: '负责人及决策信息',
          dataIndex: 'decision_info',
          align: 'center',
          width: 160,
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
        "plan_name",
        "principal_str",
        "principal_tel_num",
        "publisher_str",
        "publisher_tel_num",
        "receiver_str",
        "receiver_tel_num",
        // "form_make_time_str",
        // "form_maker_name",
        {
          title: '操作',
          subTitle: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 160,
          render: (text: any, record: any) => {
            return (
              <a
                onClick={() => {
                  if (actionRef.current) {
                    actionRef.current.exportFile({
                      filter: JSON.stringify([
                        { Key: 'id', Val: record.id, Operator: '=' },
                      ])
                    });
                  }
                }}
              >
                下载
              </a>
            );
          },
        },
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        'RowNumber',
        'decision_info',
        "plan_name",
        "principal_str",
        "principal_tel_num",
        "publisher_str",
        "publisher_tel_num",
        "receiver_str",
        "receiver_tel_num",
      ])
    return cols.getNeedMultiColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Space
        align="baseline"
      >
        <Button
          key={authority + 'add'}
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
        key={authority + 'export'}
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={() => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >
        导出
      </a>,
    ];
  };
  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length !== 1) {
      return []
    }
    return [
      <ViewTheReport
        query={`?viewlet=WeldSys2.0/anquan/planB-word.cpt&plan_name=${selectedRows[0].plan_name}`}
      />,
      <Button
        key={authority + 'edit'}
        type="primary"
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        onClick={() => {
          setRecordList(selectedRows[0]);
          setEditVisible(true);
        }}
      >
        编辑
      </Button>,
      <Button
        key={authority + 'betchdel'}
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        onClick={() => {
          setRecordList(selectedRows[0]);
          setDelVisible(true);
          setDelName(selectedRows[0].decision_info);
        }}
      >
        删除
      </Button>,
    ];
  };
  return (
    <>
      <BaseCurdSingleTable
        funcCode={authority + "getContingencyPlan"}
        cRef={actionRef}
        tableTitle="应急预案"
        rowSelection={{
          type: 'radio',
        }}
        rowKey="RowNumber"
        moduleCaption='应急预案'
        type="emergencyplan/getContingencyPlanFlat"
        exportType="emergencyplan/getContingencyPlanFlat"
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        tableDefaultFilter={[
          // { Key: 'dep_code', Val: WBS_CODE + '%', Operator: 'like' },
        ]}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        renderSelfToolbar={undefined}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />

      {open && selectedRecord && (
        <EmergencyResponsibilityDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => {
            setOpen(false)
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {
        addVisible && (
          <EmergencyResponsibilityAdd
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            callbackSuccess={() => {
              setAddVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {
        editVisible && (
          <EmergencyResponsibilityEdit
            visible={editVisible}
            selectedRecord={recordList}
            onCancel={() => setEditVisible(false)}
            callbackSuccess={() => {
              setEditVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {visible && (
        <BaseImportModal
          maxCount={1}
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
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={'primary'} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>确认要删除吗?</p>
      </Modal>
    </>
  );
};
export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(MainContractProgress);
