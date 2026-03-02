import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { Alert, Modal } from "antd";
import {useEffect, useRef, useState } from "react";
import {BasicTableColumns} from "yayang-ui";
import {columns} from './columns'
import RatingScoreModal from "@/pages/Engineering/Supplier/SupplierContractScore/Rating/RatingScoreModal.tsx";
import moment from "moment";
import { history } from 'umi';

/**
 * 主要设备资源录入
 * @constructor
 */
const Rating = ({ selectedNodeInfo, isConfigLink }: any) => {

  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>(null);
  const [selectedNode, setSelectedNode] = useState<Record<string, any>>(selectedNodeInfo);

  useEffect(() => {
    setSelectedNode({...selectedNodeInfo})
  }, [selectedNodeInfo]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(columns);
    cols.initTableColumns([
      // "id",
      // "year",
      "contract_no",
      "procurement_content",
      // "wbs_code",
      "buyer",
      "supplier_name",
      "supplier_code",
      "supplier_type",
      "contract_amount",
      'product_quality',
      'service_ability',
      'contract_performance',
      'price_level',
      'technological_level',
      'integrity_management',
      'total_score',
      'delivery_amount',
      "create_ts_str",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      "modify_ts_str",
      // "modify_tz",
      // "modify_user_code",
      "modify_user_name",
      {
        title: '操作',
        subTitle: '操作',
        dataIndex: 'operate',
        width: 160,
        align: "center",
        render: (text, record: any) => {
          const currDate =  moment().format("YYYY-MM-DD");
          console.log('---selectedNode', selectedNode)
          const isOperate = (currDate >= selectedNode.score_date_start && currDate <= selectedNode.score_date_end);
          return (
            <>
              {record.id ? (
                <>
                  {isOperate && (
                    <a style={{color: 'orange'}} onClick={() => {
                      setSelectedRecord(record);
                      setVisible(true);
                    }}>分数修改</a>
                  )}
                </>
              ) : (
                <>
                  {isOperate && (
                    <a onClick={() => {
                      if (!isConfigLink) {
                        Modal.info({
                          title: "提示",
                          content: "需要提前配置二级单位的联系信息，才能进行打分",
                          onOk: () => {
                            history.push('/dep/engineering/supplier/moduleConfig')
                          }
                        });
                        return;
                      }
                      setSelectedRecord(record);
                      setVisible(true);
                    }}>打分</a>
                  )}
                </>
              )}
            </>
          )
        }
      }
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
      .needToExport([
        "contract_no",
        "procurement_content",
        "wbs_code",
        "buyer",
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "contract_amount",
        "year",
      ])
    return cols.getNeedColumns();
  }

  return (
    <div key={selectedNode.year}>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="contract_id"
        tableTitle='打分合同'
        type="supplierContractScore/querySupplierContractScoreBody"
        exportType="supplierContractScore/querySupplierContractScoreBody"
        tableColumns={getTableColumns()}
        funcCode={'打分合同'}
        renderSelfToolbar={() => {
          if (!selectedNode.score_date_start) {
            return (
              <Alert type={'warning'} message={<span>1，合同需要在 供应商合同 模块上传 2，公司级未配置打分时间段，需要配置后才能打分</span>}/>
            )
          }
          return (
            <Alert type={'warning'} message={<span>1，合同需要在 供应商合同 模块上传 2，请在规定时间段 <strong>{selectedNode.score_date_start} ~ {selectedNode.score_date_end}</strong> 内进行打分, 过期将无法打分</span>}/>
          )
        }}
        tableSortOrder={{ sort: 'contract_id', order: 'desc' }}
        tableDefaultFilter={[
          {Key: 'year', Val: selectedNode.year, Operator: '='},
        ]}
        buttonToolbar={() => []}
        selectedRowsToolbar={() => []}
      />
      {visible && (
        <RatingScoreModal
          visible={visible}
          onCancel={() => {
            setVisible(false)
          }}
          callbackSuccess={() => {
            setVisible(false)
            if (actionRef) {
              actionRef.current.reloadTable();
            }
          }}
          selectedRecord={selectedRecord}
          selectedNodeInfo={selectedNode}
        />
      )}
    </div>
  )
}

export default Rating;
