import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import BaseCrudSingleMultiHeaderTable from '@/components/BaseCrudSingleMultiHeaderTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { hasPermission } from '@/utils/authority';
import { ErrorCode, WBS_CODE } from '@/common/const';

import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { configColumns } from './columns';
import MainContractSettlementAdd from './Add';
import AddSettlementPayment from './AddSettlementPayment';
import EditSettlementPayment from './EditSettlementPayment';
import MainContractSettlementDetail from './Detail';
import { formatMultiLevelColumns } from '@/utils/utils';



interface MainContractSettlementProps {
  dispatch: any;
  route: { authority: string };
  maxNumber: number;
}

/**
 * 主合同结算台账列表
 * @constructor
 */
const MainContractSettlement: React.FC<MainContractSettlementProps> = (props) => {
  const {
    dispatch,
    route: { authority },
  } = props;

  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [delList, setDelList] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);



  /**
   * 删除主合同结算合同
   */
  const handleDel = () => {
    dispatch({
      type: 'settlementManagement/deleteSettlementManagement',
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



  /**
   * 获取表格列
   * @returns
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "branch_comp_name",
        "dep_name",
        "wbs_code",
        {
          "title": "costControl.contract_name",
          "subTitle": "工程名称",
          "dataIndex": "contract_name",
          "width": 160,
          "align": "center",
          render(text: any, record: any) {
            return (
              <a
                onClick={() => {
                  setSelectedRecord(record);
                  setIsDetailVisible(true);
                }}
                style={{ color: '#1890ff', cursor: 'pointer' }}
              >
                {text}
              </a>
            );
          }
        },
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        // "income_info_wbs_name",
        "contract_say_price",
        "report_amount1",
        "approval_amount1",
        {
          title: '附件',
          subTitle: '一审审核附件',
          dataIndex: 'file_url1',
          width: 100,
          align: 'center',
          render: (text: any) =>
            text ? (
              <a href={getUrlCrypto(String(text))} target="_blank" rel="noopener noreferrer">
                查看附件
              </a>
            ) : <span>暂无附件</span>,
        },
        "report_amount2",
        "approval_amount2",
        {
          title: '附件',
          subTitle: '二审审核附件',
          dataIndex: 'file_url2',
          width: 100,
          align: 'center',
          render: (text: any) =>
            text ? (
              <a href={getUrlCrypto(String(text))} target="_blank" rel="noopener noreferrer">
                查看附件
              </a>
            ) : <span>暂无附件</span>,
        },
        "report_amount3",
        "approval_amount3",
        {
          title: '附件',
          subTitle: '三审审核附件',
          dataIndex: 'file_url3',
          width: 100,
          align: 'center',
          render: (text: any) =>
            text ? (
              <a href={getUrlCrypto(String(text))} target="_blank" rel="noopener noreferrer">
                查看附件
              </a>
            ) : <span>暂无附件</span>,
        },
        "report_amount4",
        "approval_amount4",
        {
          title: '附件',
          subTitle: '审计审定附件',
          dataIndex: 'file_url4',
          width: 100,
          align: 'center',
          render: (text: any) =>
            text ? (
              <a href={getUrlCrypto(String(text))} target="_blank" rel="noopener noreferrer">
                查看附件
              </a>
            ) : <span>暂无附件</span>,
        },
      ])
      .setTableColumnsToMultiHeader([
        {
          title: '一审审核',
          children: ["report_amount1", "approval_amount1", "file_url1"],
        },
        {
          title: '二审审核',
          children: ["report_amount2", "approval_amount2", "file_url2"],
        },
        {
          title: '三审审核',
          children: ["report_amount3", "approval_amount3", "file_url3"],
        },
        {
          title: '审计审定',
          children: ["report_amount4", "approval_amount4", "file_url4"],
        },
      ])
      .needToExport([
        "branch_comp_name",
        "dep_name",
        "wbs_code",
        "contract_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        // "income_info_wbs_name",
        "contract_say_price",
        "report_amount1",
        "approval_amount1",
        "report_amount2",
        "approval_amount2",
        "report_amount3",
        "approval_amount3",
        "report_amount4",
        "final_amount4",
      ]);
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
   * @param selectedRows 当前列的值
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    return [
      <EditSettlementPayment
        key="edit"
        style={{ display: hasPermission(authority, '审核') ? 'inline' : 'none', marginRight: 8 }}
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <AddSettlementPayment
        key="append"
        style={{ display: hasPermission(authority, '审核') ? 'inline' : 'none', marginRight: 8 }}
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <Button
        type={'primary'}
        danger
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        onClick={() => {
          setDelList(selectedRows[0]);
          setDelVisible(true);
        }}
      >
        删除
      </Button>,
    ];
  };
  return (
    <div>
      <Alert
        type="warning"
        showIcon
        banner
        icon={<ExclamationCircleOutlined />}
        message="选择对应的主合同结算可进行修改（已追加的审核）或追加审核（下一笔一审/二审/三审/审计审定）"
      />
      <BaseCrudSingleMultiHeaderTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="主合同结算台账"
        funcCode={authority + '主合同结算台账'}
        type="settlementManagement/getSettlementManagement"
        exportType="settlementManagement/exportSettlementManagement"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
        tableDefaultFilter={
          [
            { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
            { Key: 'income_info_wbs_code', Val: WBS_CODE, Operator: '=' },

          ]
        }
        exportColumns={formatMultiLevelColumns(getTableColumns())}
      />
      {
        addVisible && (
          <MainContractSettlementAdd
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
        <p>确认要删除当前主合同结算吗?</p>
      </Modal>
      {isDetailVisible && (
        <MainContractSettlementDetail
          open={isDetailVisible}
          onClose={() => setIsDetailVisible(false)}
          selectedRecord={selectedRecord}
          authority={authority}
        />
      )}
    </div>
  );
};
export default connect()(MainContractSettlement);
