import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Space, Tag } from 'antd';
import { connect } from 'umi';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { configColumns, DataIndexMap } from './columns';
import MainContractVisaAdd from './Add';
import MainContractVisaEdit from './Edit';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { hasPermission } from '@/utils/authority';
import { getDepTitle, fetchContractData } from '@/utils/utils';
import SubContractVisaDetail from './Detail'
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

interface MainContractProgressProps {
  dispatch: any;
  route: { authority: string };
  maxNumber: number;
}

interface CostControlState {
  costControl: { maxNumber: number }
}

/**
 * 分包合同进度款台账列表
 * @constructor
 */
const MainContractProgress: React.FC<MainContractProgressProps> = (props) => {
  const {
    dispatch,
    route: { authority },
  } = props;

  const actionRef: any = useRef();
  const actionDetilsRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [recordList, setRecordList] = useState<DataIndexMap | null>(null);
  const [delName, setDelName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [contractList, setContractList] = useState([]);//存储分包合同信息列表

  useEffect(() => {
    fetchContractData('expenditure', {
      filter: JSON.stringify([
        { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
      ]),
      sort: 'id',
      order: 'desc',
    }, dispatch, (res: any) => {
      if (res.errCode === ErrorCode.ErrOk) {
        setContractList(res.rows);
      }
    });
  }, [dispatch]);

  /**
   * 删除分包合同进度款合同
   */
  const handleDel = () => {
    dispatch({
      type: 'visaSub/delSubEngineeringVisa',
      payload: {
        form_no: recordList ? (recordList as any)?.form_no : '',
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
        ...getDepTitle(),
        "contract_name",
        {
          title: 'SubContractVisa.contract_no',
          subTitle: '服务采购订单编码',
          dataIndex: 'contract_no',
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
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "approval_schedule_str",
        'visa_code',
        'visa_major',
        'visa_content',
        'visa_budget_amount',
        'visa_date_str',
        {
          title: 'contract.file_url',
          dataIndex: 'file_url',
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
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        'RowNumber',
        ...getDepTitle(),
        "contract_name",
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        'visa_code',
        'visa_major',
        'visa_content',
        'visa_budget_amount',
        'visa_date_str',
        'file_url',
      ])
    return cols.getNeedMultiColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
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
    ];
  };
  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: DataIndexMap[]) => {
    if (selectedRows.length !== 1) {
      return []
    }
    const selectedRecord = selectedRows[0] as any;
    // 从 contractList 中筛选出匹配的合同数据
    if (selectedRecord?.out_info_id && contractList?.length > 0) {
      const matchedContract = contractList.find((contract: any) =>
        String(contract.id) === String(selectedRecord?.out_info_id)
      );
      if (matchedContract && (matchedContract as any).settlement_management_id > 0) {
        return [
          <Tag key="settlement-tag" color="warning">当前合同已经结算，无法进行任何操作</Tag>
        ];
      }
    }
    let funcCode = '';
    if(Number(selectedRecord.visa_budget_amount) > 100000){
      funcCode = 'S24';
    }else{
      funcCode = 'S63';
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
      // 分包商发起审批
      <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordFormNo={(selectedRecord as any)?.form_no}
        selectedRecord={selectedRecord}
        dispatch={dispatch}
        funcode={funcCode}
        type='user/subEngineeringVisaStartApproval'
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // 分包商查看审批
      <ViewApproval
        key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
        instanceId={(selectedRecord as any)?.approval_process_id}
        funcCode={funcCode}
        number={(selectedRecord as any)?.number}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <Button
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={'primary'}
        onClick={() => {
          setRecordList(selectedRows[0]);
          setDelVisible(true);
          setDelName(selectedRows[0].contract_name);
        }}
      >
        删除
      </Button>,
    ];
  };
  return (
    <>
      <BaseCurdSingleTable
        rowKey="form_no"
        funcCode={authority + "querySubEngineeringVisa"}
        cRef={actionRef}
        tableTitle="分包合同签证台账"
        rowSelection={{
          type: 'radio',
        }}
        moduleCaption='分包合同签证台账'
        type='visaSub/querySubEngineeringVisa'
        importType=""
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + '%', Operator: 'like' },
        ]}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        renderSelfToolbar={undefined}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />

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
            selectRecord={recordList}
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


      {open && selectedRecord && (
        <SubContractVisaDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}
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
export default connect(({ costControl }: CostControlState) => ({
  maxNumber: costControl.maxNumber,
}))(MainContractProgress);
