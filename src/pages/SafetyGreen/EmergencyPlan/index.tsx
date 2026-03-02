import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { connect } from 'umi';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { configColumns } from './columns';
import MainContractVisaAdd from './Add';
import MainContractVisaEdit from './Edit';
import BaseHeaderAndBodyTable from '@/components/BaseHeaderAndBodyTable';
import { hasPermission } from '@/utils/authority';
import MainContractVisaDetail from './Detail'

interface MainContractProgressProps {
  dispatch: any;
  route: { authority: string };
  maxNumber: number;
}

/**
 * 应急预案台账列表
 * @constructor
 */
const MainContractProgress: React.FC<MainContractProgressProps> = (props) => {
  const {
    dispatch,
    route: { authority },
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

  /**
   * 删除主合同进度款合同
   */
  const handleDel = () => {
    dispatch({
      type: 'emergencyplan/delContingencyPlanConfig',
      payload: {
        form_no: recordList ? recordList?.form_no : '',
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
          title: 'emergencyplan.plan_name',
          subTitle: '专项应急预案名称',
          dataIndex: 'plan_name',
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
        "applicable_area",
        "scene",
        "punishment_principle",
        // "disposal_process",
        "contract_say_price",
      ])
      .initBodyTableColumns([
        "level_name",
        // "level_rgb",
        "level_code",
        "description",
        "message_source",
        "verification_analysis",
        "push_level_and_scope",
        "response_preparation",
        // "order_num",
        "warning_release",
        "possible_accident",
        "report_path",
        "social_resource",
        "social_resource_contact",
        "social_resource_estimate",
        "termination_condition",
        "follow_up_requirements",
        "disposal_process",
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        'RowNumber',
        'plan_name',
        "applicable_area",
        "scene",
        "punishment_principle",
        "disposal_process",
        "contract_say_price",
        "level_name",
        "level_rgb",
        "level_code",
        "description",
        "message_source",
        "verification_analysis",
        "push_level_and_scope",
        "response_preparation",
        "order_num",
        "warning_release",
        "possible_accident",
        "report_path",
        "social_resource",
        "social_resource_contact",
        "social_resource_estimate",
        "termination_condition",
        "follow_up_requirements",
      ])
    return cols.getNeedMultiColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [[
      <Button
        key={authority + 'add'}
        style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        新增
      </Button>,
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
    ]];
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
          setDelName(selectedRows[0].contract_name);
        }}
      >
        删除
      </Button>
      
    ];
  };
  return (
    <>
      <BaseHeaderAndBodyTable
        funcCode={authority}
        cRef={actionRef}
        tableTitle="应急预案模板"
        rowSelection={{
          type: 'radio',
        }}
        moduleCaption='应急预案模板'
        header={{
          type: 'emergencyplan/queryContingencyPlanConfigHead',
          sort: 'form_no',
          order: 'desc',
          rowKey: 'form_no',
          exportType: 'emergencyplan/queryContingencyPlanConfigHead',
        }}
        body={{
          type: 'emergencyplan/queryContingencyPlanConfigBody',
          sort: 'order_num',
          order: 'asc',
          rowKey: 'order_num',
          importType: '',
          left: {
            height: 'calc(100vh - 320px)',
            searchKey: 'dev_name',
            showColumns: [],
          },
          exportType: 'emergencyplan/queryContingencyPlanConfigBody'
        }}
        scan={{
          type: 'emergencyplan/queryContingencyPlanConfigFlat',
          sort: 'form_no',
          order: 'desc',
          rowKey: 'form_no',
          exportType: 'emergencyplan/queryContingencyPlanConfigFlat',
        }}
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + '%', Operator: 'like' },
        ]}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        renderSelfToolbar={undefined}
        selectedRowsToolbar={() => ({
          headerToolbar: renderSelectedRowsToolbar,
          scanToolbar: () => [],
        })}
      />

      {open && selectedRecord && (
        <MainContractVisaDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}

      {
        addVisible && (
          <MainContractVisaAdd
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            callbackAddSuccess={() => {
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
          <MainContractVisaEdit
            visible={editVisible}
            record={recordList}
            onCancel={() => setEditVisible(false)}
            callbackAddSuccess={() => {
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
export default connect()(MainContractProgress);
