import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import BaseCrudSingleMultiHeaderTable from '@/components/BaseCrudSingleMultiHeaderTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { hasPermission } from '@/utils/authority';
import { ErrorCode, WBS_CODE } from '@/common/const';

import { configColumns } from './columns';
import MainContractSettlementAdd from './Add';
import OCRUpload from './OCRUpload';
import AddSettlementPayment from './AddSettlementPayment';
// import InitiateApproval from './InitiateApproval';
// import ViewApproval from './ViewApproval';
import SubcontractorSettlementDetail from './Detail';
import { formatMultiLevelColumns, getPrintUrl } from '@/utils/utils';
import IframeComponent from '@/components/IframeComponent';

interface MainContractSettlementProps {
  dispatch: any;
  route: { authority: string };
  maxNumber: number;
}

/**
 * 分包合同结算台账列表
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
  const [ocrVisible, setOcrVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [delList, setDelList] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [printUrl, setPrintUrl] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  /**
   * 删除分包合同结算合同
   */
  const handleDel = () => {
    dispatch({
      type: 'subcontractorSettlement/deleteSubSettlementManagement',
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
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        // "income_info_wbs_name",
        "contract_say_price",
        "report_amount1",
        "report_date_str1",
        "approval_schedule1_str",
        "approval_amount1",
        "approval_date_str1",
        "report_amount2",
        "approval_schedule2_str",
        "approval_amount2",
        "approval_date_str2",
        "report_amount3",
        "approval_schedule3_str",
        "approval_amount3",
        "approval_date_str3",
      ])
      .setTableColumnsToMultiHeader([
        {
          title: '项目部审核',
          children: [
            "report_amount1",
            "report_date_str1",
            "approval_amount1",
            "approval_date_str1",
            "approval_schedule1_str",
          ],
        },
        {
          title: '预结算费控中心审核',
          children: [
            "report_amount2",
            "approval_amount2",
            "approval_date_str2",
            "approval_schedule2_str",
          ],
        },
        {
          title: '华中审计审核',
          children: [
            "report_amount3",
            "approval_amount3",
            "approval_date_str3",
            "approval_schedule3_str",
          ],
        },
      ])
      .needToExport([
        "branch_comp_name",
        "dep_name",
        "contract_name",
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        // "income_info_wbs_name",
        "contract_say_price",
        "report_amount1",
        "report_date_str1",
        "approval_schedule1_str",
        "approval_amount1",
        "approval_date_str1",
        "report_amount2",
        "approval_schedule2_str",
        "approval_amount2",
        "approval_date_str2",
        "report_amount3",
        "approval_schedule3_str",
        "approval_amount3",
        "approval_date_str3",
      ]);
    return cols.getNeedMultiColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Space key={authority + 'buttonGroup'}>
        <Button
          key={authority + 'ocr'}
          // style={{ display: hasPermission(authority, 'OCR上传') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setOcrVisible(true);
          }}
        >
          OCR上传
        </Button>
        <Button
          key={authority + 'add'}
          style={{ display: hasPermission(authority, '新建') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新建
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
   * @param selectedRows 当前列的值
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    // 如果没有选中行，返回空数组
    if (!selectedRows || selectedRows.length === 0 || !selectedRows[0]) {
      return [];
    }
    const rowRecord = selectedRows[0];
    return [
      <AddSettlementPayment
        key={authority + 'settlementPayment'}
        style={{ display: hasPermission(authority, '修改上报金额') ? 'inline' : 'none' }}
        selectedRecord={rowRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // <InitiateApproval
      //   style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
      //   key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
      //   recordId={selectedRecord?.id}
      //   selectedRecord={selectedRecord}
      //   dispatch={dispatch}
      //   funcode={'S23'}
      //   type='user/settlementStartApproval'
      //   onSuccess={() => {
      //     if (actionRef.current) {
      //       actionRef.current.reloadTable();
      //     }
      //   }}
      // />,
      // <ViewApproval
      //   style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
      //   key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
      //   instanceId={selectedRecord?.approval_process_id}
      //   funcCode={'S23'}
      //   number={selectedRecord?.number}
      //   selectedRecord={selectedRecord}
      //   onSuccess={() => {
      //     if (actionRef.current) {
      //       actionRef.current.reloadTable();
      //     }
      //   }}
      // />,
      <Button
        key={authority + 'print'}
        // style={{ display: hasPermission(authority, '打印') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setIframeVisible(true);
          setPrintUrl(getPrintUrl('subcontract', 'YJZHPDYJS-001-2025R06', {
            id: rowRecord?.id,
            contract_no: rowRecord?.contract_no,
          }));
        }}
      >
        打印
      </Button>,
      <Button
        type={'primary'}
        danger
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        onClick={() => {
          // 判断审批流程号是否存在，如果不存在则可以删除
          if (rowRecord?.approval_process_id) {
            message.warning('当前结算款已经发起审批无法删除');
            return;
          }

          setDelList(rowRecord);
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
        message="选择对应的分包合同结算可以进行审核，如果当前审核未完成，那么点击审核则会进行修改，反之则会进入下一次审核"
      />
      <BaseCrudSingleMultiHeaderTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="分包合同结算台账"
        funcCode={authority + '分包合同结算台账'}
        type="subcontractorSettlement/getSubSettlementManagement"
        exportType="subcontractorSettlement/exportSubSettlementManagement"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
        tableDefaultFilter={
          [
            { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
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
      {
        ocrVisible && (
          <OCRUpload
            visible={ocrVisible}
            onCancel={() => setOcrVisible(false)}
            callbackAddSuccess={() => {
              setOcrVisible(false);
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
        <p>确认要删除当前分包合同结算吗?</p>
      </Modal>
      {isDetailVisible && (
        <SubcontractorSettlementDetail
          open={isDetailVisible}
          onClose={() => setIsDetailVisible(false)}
          selectedRecord={selectedRecord}
          authority={authority}
        />
      )}
      {iframeVisible && (
        <IframeComponent
          visible={iframeVisible}
          cancel={() => setIframeVisible(false)}
          title="分包合同结算台账"
          url={printUrl}
        />
      )}
    </div>
  );
};
export default connect()(MainContractSettlement);
