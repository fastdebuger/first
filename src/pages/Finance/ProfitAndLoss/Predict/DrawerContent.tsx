import React, { useEffect, useState } from 'react';
import {querySubCompanyPredictReportItems, queryDepDiffVersionPredictReportItems} from "@/services/finance/predictReportItems";
import { Table } from 'antd';
import {showTS} from "@/utils/utils-date";

const DrawerContent = (props) => {
  const { year, itemKeyList, fieldsList} = props;

  // 表格内数据
  const [dataSource, setDataSource] = useState([])

  const fetchList = async () => {
    const res = await queryDepDiffVersionPredictReportItems({
      sort: 'item_key',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'year', Val: year, Operator: '='},
        {Key: 'item_key', Val: `'${itemKeyList.join("','")}'`, Operator: 'in'},
      ])
    })
    if (res.rows.length > 0) {

      setDataSource(res.rows || [])
    }
  }

  useEffect(() => {
    fetchList()
  }, [year]);

  const showNumberColumns = [
    { title: '1月份', dataIndex: 'q1_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '2月份', dataIndex: 'q1_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '3月份', dataIndex: 'q1_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计',  dataIndex: 'q1_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '4月份', dataIndex: 'q2_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '5月份', dataIndex: 'q2_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '6月份', dataIndex: 'q2_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:  'q2_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '7月份', dataIndex: 'q3_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '8月份', dataIndex: 'q3_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '9月份', dataIndex: 'q3_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:  'q3_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '10月份', dataIndex: 'q4_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '11月份', dataIndex: 'q4_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '12月份', dataIndex: 'q4_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:   'q4_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '全年预测', dataIndex: 'full_year_amount', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '指标数', dataIndex: 'indicator_amount', align: 'right', width: 180, valueType: 'number' },
  ]

  console.log('--------fieldsList', fieldsList)

  const showColumns: any[] = showNumberColumns.filter(col => fieldsList.includes(col.dataIndex));

  return (
    <>
      <div style={{display: 'flex', overflowX: 'scroll', flexDirection: 'column'}}>
        {dataSource.map((item, index) => {
          const parseData = JSON.parse(item.version_change_detail);
          return (
            <div style={{marginBottom: 8}}>
              <h3>{item.item_name}</h3>
              <div style={{
                paddingLeft: 8
              }}>
                <Table
                  title={() => <strong>{item.profit_center_code} {item.dep_name}</strong>}
                  style={{marginTop: 8}}
                  size={'small'}
                  bordered
                  columns={[
                    // { title: '项目', dataIndex: 'item_name', align: 'left', width: 330, fixed: 'left' },
                    { title: '填报原因', dataIndex: 'reason', align: 'left', width: 330, fixed: 'left' },
                    { title: '填报时间', dataIndex: 'create_ts', align: 'left', width: 160, fixed: 'left',
                      render: (text, record) => {
                        return (
                          <span>
                            {showTS(Number(text), 'YYYY-MM-DD HH:mm')}
                          </span>
                        )
                      }
                    },
                    { title: '填报人', dataIndex: 'create_user_name', align: 'left', width: 160, fixed: 'left' },
                    ...showColumns,
                  ]}
                  scroll={{ x: '100%', y: 'calc(100vh - 310px)' }}
                  dataSource={parseData}
                  pagination={false}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DrawerContent;
