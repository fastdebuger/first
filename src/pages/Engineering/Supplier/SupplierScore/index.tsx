import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Dropdown, Menu, message, Modal, Popover, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import SupplierScoreAdd from "./Add";
import SupplierScoreDetail from "./Detail";
import SupplierScoreEdit from "./Edit";
import {calculateScore, getCalculateScoreTime} from "@/services/engineering/supplierScore";
import {getSupplierDateConfig} from "@/services/engineering/supplierDateConfig";
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

/**
 * 供应商得分
 * @constructor
 */
const SupplierScorePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [yearList, setYearList] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [updateTs, setUpdateTs] = useState<string>('');

  /**
   * 包含两个接口，控制 current
   */
  const fetchList = async () => {
    // 请求公司级的配置接口
    const res: any = await getSupplierDateConfig({
      sort: 'year',
      order: 'desc'
    })
    const arr: any[] = [];
    if (res.rows.length > 0) {
      res.rows.forEach(r => {
        arr.push({
          label: r.year,
          key: r.year,
        })
      })
      setCurrentYear(res.rows[0].year);
      setYearList(arr)
    }
  }

  const fetchNewUpdateTime = async () => {
    const res = await getCalculateScoreTime({
      year: currentYear,
    })
    setUpdateTs(res.result.create_ts_str || '')
  }

  useEffect(() => {
    if (currentYear) {
      fetchNewUpdateTime();
    }
  }, [currentYear]);

  useEffect(() => {
    fetchList();
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      "year",
      {
        title: "compinfo.supplier_name",
        subTitle: "供应商名称",
        dataIndex: "supplier_name",
        width: 160,
        align: "center",
        render:(text, record) => {
          return (
            <a onClick={() => {
              setSelectedRecord(record);
              setOpen(true);
            }}>
              {text}
            </a>
          )
        }
      },
      "supplier_code",
      "supplier_type",
      "product_quality",
      "service_ability",
      "contract_performance",
      "price_level",
      {
        title: "compinfo.market_shares",
        subTitle: "市场份额",
        dataIndex: "market_shares",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <div>
              {text}
              <Popover content={(
                <div>
                  <p>供货金额排名：{record.amount_rank}</p>
                  <p>供货金额排名百分比：{Number(record.amount_rank_percent || 0) * 100}%</p>
                  <p>供货金额排名分：{record.amount_rank_score}</p>
                  <p>用户数量：{record.user_num}</p>
                  <p>用户数量排名：{record.user_rank}</p>
                  <p>用户数量排名分：{record.user_rank_score}</p>
                </div>
              )} title="分数来源" trigger="click">
                <a style={{marginLeft: 4}}>详情</a>
              </Popover>

            </div>
          )
        }
      },
      "technological_level",
      "integrity_management",
      "total_score",
      "delivery_amount",
      // "year",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToExport([
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "product_quality",
        "service_ability",
        "contract_performance",
        "price_level",
        "market_shares",
        "technological_level",
        "integrity_management",
        "total_score",
        "delivery_amount",
        "year",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</Button>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='供应商得分'
        type="supplierScore/getSupplierScore"
        exportType="supplierScore/getSupplierScore"
        tableColumns={getTableColumns()}
        funcCode={authority}
        renderSelfToolbar={() => {
          return (
            <Alert type={'info'} message={`因为评分是有周期，所以要在这里每次更新最新得分才能看到最近的得分进展， 最近一次更新时间：${updateTs}`} action={
              <Button size="small" type="primary" onClick={async() => {
                const res = await calculateScore({
                  year: currentYear,
                })
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success("更新成功");
                  if (actionRef.current) {
                    actionRef.current.reloadTable();
                  }
                }
              }}>
                更新最新得分
              </Button>
            } />
          )
        }}
        renderDropMenuToolbar={() => {
          return (
            <span>
              <Dropdown overlay={(
                <Menu>
                  {yearList.map((item: any, index: number) => {
                    return (
                      <Menu.Item onClick={async () => {
                        const res = await calculateScore({
                          year: item.label,
                        })
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success("更新成功");
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
                        }
                        setCurrentYear(item.label);
                      }} key={item.key}>{item.label}</Menu.Item>
                    )
                  })}
                </Menu>
              )}>
                <a>
                  {currentYear}年
                  <DownOutlined />
                </a>
              </Dropdown>
            </span>
          )
        }}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        tableDefaultFilter={[
          {Key: 'year', Val: currentYear, Operator: '='},
        ]}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <SupplierScoreDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <SupplierScoreAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
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
            if(actionRef.current) {
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
        <SupplierScoreEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(SupplierScorePage);
