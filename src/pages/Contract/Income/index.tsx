import React, { useRef, useState } from 'react';
import { Button, message, Modal, notification, Space } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { configColumns } from './columns';
import IncomeAdd from './Add';
import IncomeEdit from './Edit';
import IncomeDetail from './Detail';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { hasPermission } from '@/utils/authority';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import LogIncomeContract from '@/components/LogIncomeContract';
import BetchDownLoadButton from '@/components/BetchDownLoadButton';
import BetchUpload from './BetchUpload';
import SharedContract from './SharedContract';

/**
 * 收入合同台账列表
 * @constructor
 */
const BaseIncome: React.FC<any> = (props) => {
  const {
    dispatch,
    route,
  } = props;
  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [sharedContractVisible, setSharedContractVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [delVisible, setDelVisible] = useState(false);
  const [betchUploadVisible, setBetchUploadVisible] = useState(false);
  const [importedList, setImportedList] = useState([]);
  const [delList, setDelList] = useState<any>('');
  const [delName, setDelName] = useState('');
  const authority = route.authority
  const handleDel = () => {
    dispatch({
      type: String(delList?.if_main) === "0" ? 'income/deleteIncomeInfoB' : 'income/deleteIncomeInfo',
      payload: {
        id: delList ? (
          String(delList?.if_main) === "0" ? delList['b_id'] : delList['id']
        ) : '',
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
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "specialty_type_str",
        "revenue_method_str",
        "relative_person_code",
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
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'if_main',
        'settlement_management_id_str',

      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToFixed([
        {
          value: "if_main",
          fixed: "right"
        },
        {
          value: "settlement_management_id_str",
          fixed: "right"
        },
      ])
      .needToExport([
        "RowNumber",
        "branch_comp_code",
        "dep_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        "owner_unit_name",
        "project_location",
        "contract_no",
        "wbs_code",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "revenue_method_str",
        "relative_person_code",
        'file_url',
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
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
        key={authority + 'SharedContract'}
        style={{ display: hasPermission(authority, '共享合同') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setSelectedRecord(selectedRows[0])
          setSharedContractVisible(true);
        }}
      >
        共享合同
      </Button>,
      <Button
        key={authority + 'edit'}
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
      <LogIncomeContract
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
        tableTitle="收入合同台账"
        funcCode={authority}
        type="income/getIncomeInfo"
        importType="income/importIncomeInfo"
        exportType="income/getIncomeInfo"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'checkbox' }}
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
        moduleCaption={'收入合同台账'}
      />
      {open && selectedRecord && (
        <IncomeDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}
      {
        editVisible && (
          <IncomeEdit
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
      {
        addVisible && (
          <IncomeAdd
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
        sharedContractVisible && (
          <SharedContract
            selectedRecord={selectedRecord}
            visible={sharedContractVisible}
            onCancel={() => setSharedContractVisible(false)}
            callbackAddSuccess={() => {
              setSharedContractVisible(false);
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
              return actionRef.current.importFile(file, authority, (res: any) => {
                // console.log('res :>> ', res);
                if (res?.result && Array.isArray(res?.result) && res?.result?.length > 0) {
                  const result = res.result.map((item: any) => ({
                    ...item,
                    owner_group: item.owner_group ? String(item.owner_group) : item.owner_group,
                    contract_mode: item.contract_mode ? String(item.contract_mode) : item.contract_mode,
                    bidding_mode: item.bidding_mode ? String(item.bidding_mode) : item.bidding_mode,
                    valuation_mode: item.valuation_mode ? String(item.valuation_mode) : item.valuation_mode,
                    specialty_type: item.specialty_type ? String(item.specialty_type) : item.specialty_type,
                    project_level: item.project_level ? String(item.project_level) : item.project_level,
                    project_category: item.project_category ? String(item.project_category) : item.project_category,
                    others_file_url: "",
                    file_url: "",
                  }));
                  setImportedList(result)
                  setBetchUploadVisible(true)
                }
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
        <p>
          {
            String(delList?.if_can_del) === '0' ?
              "已存在主合同WBS项目定义下的支出合同，请谨慎删除!" :
              "确认要删除吗?"
          }
        </p>
      </Modal>
    </div>
  );
};
export default connect()(BaseIncome);
