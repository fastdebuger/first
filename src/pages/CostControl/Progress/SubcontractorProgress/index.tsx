import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Space, Tag, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import BaseCrudSingleMultiHeaderTable from '@/components/BaseCrudSingleMultiHeaderTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { hasPermission } from '@/utils/authority';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { numberToChinese, formatMultiLevelColumns, fetchContractData, getPrintUrl } from '@/utils/utils';

import { configColumns } from './columns';
import SubcontractorProgressAdd from './Add';
import AddProgressPayment from './AddProgressPayment';
import EditProgressPayment from './EditProgressPayment'
import InitiateApproval from './InitiateApproval';
import ViewApproval from './ViewApproval';
import PrintProgress from './PrintProgress';
import SubcontractorProgressDetail from './Detail';
import IframeComponent from '@/components/IframeComponent';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
interface SubcontractorProgressProps {
  dispatch: any;
  route: { authority: string };
  maxNumber: number;
}

interface SubcontractorProgressState {
  subcontractorProgress: { maxNumber: number }
}

/**
 * 分包合同进度款台账列表
 * @constructor
 */
const SubcontractorProgress: React.FC<SubcontractorProgressProps> = (props) => {
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
  const [contractList, setContractList] = useState([]);//存储分包合同信息列表
  const [maxNumber, setMaxNumber] = useState(0);
  const [printUrl, setPrintUrl] = useState('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);
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
    dispatch({
      type: 'income/queryProgressPaymentMaxNumber',
      payload: {
        filter: JSON.stringify([]),
        type: '2'
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk && res.result) {
          setMaxNumber(res.result);
        }
      }
    });
  }, [dispatch]);

  /**
   * 刷新表格并重新查询最大进度款笔数
   */
  const reloadTableAndQueryMaxNumber = () => {
    // 先调用接口查询最大进度款笔数
    dispatch({
      type: 'income/queryProgressPaymentMaxNumber',
      payload: {
        filter: JSON.stringify([]),
        type: '2'
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk && res.result) {
          setMaxNumber(res.result);
        }
        // 接口调用完成后再刷新表格（无论成功与否都刷新）
        if (actionRef.current) {
          actionRef.current.reloadTable();
        }
      }
    });
  }

  /**
   * 删除分包商进度款合同
   */
  const handleDel = () => {
    dispatch({
      type: 'subcontractorProgress/delSubProgressPayment',
      payload: {
        form_no: delList ? delList?.form_no : '',
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('删除成功');
          reloadTableAndQueryMaxNumber();
        }
        setDelVisible(false);
      },
    });
  };

  /**
   * 通过最大值获取配置列
   * @param maxNumber 最大值
   * @returns 处理完成的配置列
   */
  const generateComplexData = (maxNumber: number) => {
    // 基础数据列模板
    const baseColumns = [
      {
        "title": "costControl.approval_amount",
        "subTitle": "审核金额",
        "dataIndex": "approval_amount{x}",
        "width": 160,
        "align": "center",
        render(text: ReactNode) {
          return <div>{text}</div>
        }
      },
      {
        "title": "compinfo.approval_date",
        "subTitle": "审批日期",
        "dataIndex": "approval_date_str{x}",
        "width": 160,
        "align": "center",
        render(text: ReactNode) {
          return <div>{text}</div>
        }
      },
      {
        "title": "costControl.is_arrival",
        "subTitle": "是否到账",
        "dataIndex": "is_arrival_str{x}",
        "width": 160,
        "align": "center",
        render(text: ReactNode) {
          return <div>{text}</div>
        }
      },
      {
        "title": "costControl.prepay_ratio",
        "subTitle": "累计占合同比例",
        "dataIndex": "ratio{x}",
        "width": 160,
        "align": "center",
        render(text: ReactNode) {
          return <div>{text}</div>
        }
      },
      {
        "title": "costControl.approval_schedule",
        "subTitle": "审批进度",
        "dataIndex": "approval_schedule_str{x}",
        "width": 160,
        "align": "center",
        render(text: ReactNode) {
          if (text === '审批完成') {
            return <Tag color={'success'}>{text}</Tag>
          } else if (text === '驳回') {
            return <Tag color={'error'}>{text}</Tag>
          } else if (text === '未审批') {
            return <Tag color={'warning'}>{text}</Tag>
          } else if (text === '审批中') {
            return <Tag color={'processing'}>{text}</Tag>
          } else {
            return <Tag color={'default'}>{'暂无进度款'}</Tag>
          }
        }
      },
      {
        "title": "附件",
        "subTitle": "附件",
        "dataIndex": "file_url{x}",
        "width": 160,
        "align": "center",
        render(text: string) {
          return (
            text ? <Button
              onClick={() => window.open(getUrlCrypto(text))}
              size='small'
              type='link'
            >下载文件</Button> : <span>暂无附件</span>
          )
        }
      }
    ];

    // 生成标题组
    const titleGroups = [];
    // 生成完整数据列
    const allColumns = [];

    for (let i = 1; i <= maxNumber; i++) {
      // 生成标题组
      titleGroups.push({
        title: `第${numberToChinese(i.toString())}笔进度款`,
        children: [
          `approval_amount${i}`,
          `approval_date_str${i}`,
          `is_arrival_str${i}`,
          `ratio${i}`,
          `approval_schedule_str${i}`,
          `file_url${i}`
        ]
      });

      // 生成对应的数据列
      const columnsGroup = baseColumns.map(item => ({
        ...item,
        dataIndex: item.dataIndex.replace('{x}', i.toString())
      }));

      allColumns.push(...columnsGroup);
    }

    return {
      titleGroups,  // 包含children的标题结构
      columns: allColumns  // 完整的数据列
    };
  }

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
          "title": "contract.contract_name",
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
        ...generateComplexData(maxNumber).columns
      ])
      .setTableColumnsToMultiHeader([
        ...generateComplexData(maxNumber).titleGroups
      ])
      .noNeedToFilterIcon([...generateComplexData(maxNumber).columns.map((item: any) => item.dataIndex)])
      .needToExport([
        "branch_comp_name",
        "dep_name",
        "wbs_code",
        "contract_no",
        "contract_out_name",
        "contract_sign_date_str",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_name",
        "income_info_wbs_name",
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
    // 从 contractList 中筛选出匹配的合同数据
    if (selectedRows[0]?.out_info_id && contractList?.length > 0) {
      const matchedContract = contractList.find((contract: any) =>
        String(contract.id) === String(selectedRows[0]?.out_info_id)
      );
      if (matchedContract && (matchedContract as any).settlement_management_id > 0) {
        return [
          <PrintProgress
            // style={{ display: hasPermission(authority, '打印') ? 'inline' : 'none' }}
            key={`print-${selectedRows[0]?.RowNumber || 'default'}`}
            selectedRecord={selectedRows[0]}
          />,
          <Tag key="settlement-tag" color="warning">当前合同已经结算，无法进行任何操作</Tag>
        ];
      }
    }
    return [
      <AddProgressPayment
        style={{ display: hasPermission(authority, '追加进度款') ? 'inline' : 'none' }}
        key={authority + 'add-progress'}
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          reloadTableAndQueryMaxNumber();
        }}
      />,
      <EditProgressPayment
        style={{ display: hasPermission(authority, '修改进度款') ? 'inline' : 'none' }}
        key={authority + 'edit-progress'}
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          reloadTableAndQueryMaxNumber();
        }}
      />,
      <InitiateApproval
        style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
        key={selectedRows[0]?.RowNumber || 'default'} // 添加key属性强制重新渲染
        selectedRecord={selectedRows[0]}
        dispatch={dispatch}
        funcode={'S22'}
        onSuccess={() => {
          reloadTableAndQueryMaxNumber();
        }}
      />,
      <ViewApproval
        style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
        key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
        selectedRecord={selectedRows[0]}
        onSuccess={() => {
          reloadTableAndQueryMaxNumber();
        }}
      />,
      <PrintProgress
        // style={{ display: hasPermission(authority, '打印') ? 'inline' : 'none' }}
        key={`print-${selectedRows[0]?.RowNumber || 'default'}`}
        selectedRecord={selectedRows[0]}
      />,
      <Button
        type={'primary'}
        danger
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        onClick={() => {
          // 判断是否有任何进度款已发起审批，如果有则不能删除
          const selectedRecord = selectedRows[0];
          if (selectedRecord) {
            // 遍历所有 approval_process_id{x} 字段，检查是否有已发起的审批
            const hasApproval = Object.keys(selectedRecord).some(key => {
              if (key.startsWith('approval_process_id')) {
                const value = selectedRecord[key];
                // 如果值不为空字符串且不为undefined，说明已发起审批
                return value !== '' && value !== undefined;
              }
              return false;
            });

            if (hasApproval) {
              message.warning('当前进度款已经发起审批无法删除');
              return;
            }
          }

          setDelList(selectedRecord);
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
        message="选择对应的分包合同进度款，可以进行进度款的追加，也可以修改未审批且未到账的进度款"
      />
      <BaseCrudSingleMultiHeaderTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="分包合同进度款台账"
        funcCode={authority + '分包合同进度款台账'}
        type="subcontractorProgress/querySubProgressPaymentFlat"
        exportType="subcontractorProgress/exportSubProgressPaymentFlat"
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
          <SubcontractorProgressAdd
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            callbackAddSuccess={() => {
              setAddVisible(false);
              reloadTableAndQueryMaxNumber();
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
        <p>确认要删除当前分包商进度款吗?</p>
      </Modal>
      {isDetailVisible && (
        <SubcontractorProgressDetail
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
          title="分包合同进度款台账"
          url={printUrl}
        />
      )}
    </div>
  );
};
export default connect(({ subcontractorProgress }: SubcontractorProgressState) => ({
  maxNumber: subcontractorProgress.maxNumber,
}))(SubcontractorProgress);
