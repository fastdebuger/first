import React, { useRef, useState } from 'react';
import { Button, message, Modal, notification, Space } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { configColumns } from './columns';
import ExpenditureAdd from './Add';
import ExpenditureEdit from './Edit';
import ExpenditureDetail from './Detail';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { hasPermission } from '@/utils/authority';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import ContractDetails from './ContractDetails';
import LogExpenditureContract from '@/components/LogExpenditureContract';
import BetchDownLoadButton from '@/components/BetchDownLoadButton';
import BetchUpload from './BetchUpload';

/**
 * 支出合同台账列表
 * @constructor
 */
const BaseExpenditure: React.FC<any> = (props) => {
  const {
    dispatch,
    route: { authority },
  } = props;
  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [delVisible, setDelVisible] = useState(false);
  const [delList, setDelList] = useState([]);
  const [delName, setDelName] = useState('');
  const [betchUploadVisible, setBetchUploadVisible] = useState(false);
  const [importedList, setImportedList] = useState([]);

  const handleDel = () => {
    dispatch({
      type: 'expenditure/deleteContract',
      payload: {
        id: delList ? delList?.id : '',
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

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        {
          title: 'contract.contract_no2',
          subTitle: '合同系统2.0合同编号',
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
        {
          title: 'income_info_wbs_name', // 对应的主合同 ERP 项目编号
          subTitle: "对应的主合同WBS项目定义", // 副标题
          dataIndex: "income_info_wbs_code", // 数据索引
          width: 260, // 列宽
          align: 'center', // 对齐方式
          render: (text: any, record) => { // 自定义表单渲染
            return (
              <>
                <ContractDetails
                  record={record}
                  dispatch={dispatch}
                >
                  {text}
                </ContractDetails>
              </>
            )

          }
        },
        'obs_name',
        'user_name',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        'subletting_enroll_name',
        // 'wbs_name',
        'y_signatory_name',
        'y_site_name',
        'contract_scope',
        'contract_type_str',
        'pur_way_str',
        'contract_start_date_str',
        'contract_end_date_str',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date_str',
        'materials_type_str',
        'relative_person_code',
        {
          title: 'contract.scanning_file_url',
          dataIndex: 'file_url',
          subTitle: '合同扫描件',
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
        {
          title: 'contract.others_file_url',
          dataIndex: 'others_file_url',
          subTitle: '其他附件',
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
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ])
      .needToFixed([
        {
          value: "settlement_management_id_str",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        'branch_comp_name',
        'dep_name',
        'obs_name',
        'user_name',
        'contract_no',
        'income_info_wbs_code',
        'subletting_enroll_name',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        // 'wbs_name',
        'y_signatory_name',
        'y_site_name',
        // 'contract_no',
        'contract_scope',
        'contract_type_str',
        'pur_way_str',
        'contract_start_date_str',
        'contract_end_date_str',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date_str',
        'materials_type_str',
        'relative_person_code',
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ]);
    return cols.getNeedColumns();
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
        key={authority + 'import'}
        style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        导入
      </a>,
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
    if (selectedRows.length > 1) {
      const file_path = selectedRows
        .map(item => item.file_url ? getUrlCrypto(item.file_url) : "")
        .filter(url => url)
        .join(",");
      return [
        <BetchDownLoadButton
          file_path={file_path}
        />
      ]
    }
    return [
      <Button
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          // 选中的单子是已经完成结算的单子 禁止编辑
          if (selectedRows[0].settlement_management_id > 0) {
            notification.warning({
              message: '温馨提示',
              description: '该合同已完成结算，无法进行编辑哦~',
            });
            return
          }
          setSelectedRecord(selectedRows[0])
          setEditVisible(true);
        }}
      >
        编辑
      </Button>,
      <LogExpenditureContract
        selectedRows={selectedRows.length > 0 ? selectedRows[0] : {}}
      />,
      <Button
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type="primary"
        danger
        onClick={() => {
          // 选中的单子是已经完成结算的单子 禁止删除
          if (selectedRows[0].settlement_management_id > 0) {
            notification.warning({
              message: '温馨提示',
              description: '该合同已完成结算，无法进行删除哦~',
            });
            return
          }
          setDelList(selectedRows[0]);
          setDelVisible(true);
          setDelName(selectedRows[0].owner_unit_name);
        }}
      >
        删除
      </Button>,
    ];
  };
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="支出合同台账"
        funcCode={authority + 'expenditure'}
        type="expenditure/queryContract"
        importType="expenditure/importDataContract"
        exportType="expenditure/queryContract"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'checkbox' }}
        tableDefaultFilter={
          [
            { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
          ]
        }
        moduleCaption="支出合同台账"
      />
      {open && selectedRecord && (
        <ExpenditureDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}
      {
        editVisible && (
          <ExpenditureEdit
            selectedRecord={selectedRecord}
            visible={editVisible}
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
      {
        addVisible && (
          <ExpenditureAdd
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            callbackAddSuccess={() => {
              setAddVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )}
      {visible && (
        <BaseImportModal
          maxCount={1}
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              const formData = new FormData();
              return actionRef.current.importFile(file, authority, (res:any) => {
                if (res?.result && Array.isArray(res?.result) && res?.result?.length > 0) {
                  const result = res.result.map((item: any) => ({
                    ...item,
                    contract_type: item.contract_type ? String(item.contract_type) : item.contract_type,
                    pur_way: item.pur_way ? String(item.pur_way) : item.pur_way,
                    materials_type: item.materials_type ? String(item.materials_type) : item.materials_type,
                    others_file_url: "",
                    file_url: "",
                  }));
                  setImportedList(result)
                  setBetchUploadVisible(true)
                }

                setVisible(false);
              }, formData);
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {
        betchUploadVisible && (
          <BetchUpload
            importedList={importedList}
            selectedRecord={selectedRecord}
            visible={betchUploadVisible}
            onCancel={() => setBetchUploadVisible(false)}
            callbackAddSuccess={() => {
              setBetchUploadVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
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
    </div>
  );
};
export default connect()(BaseExpenditure);
