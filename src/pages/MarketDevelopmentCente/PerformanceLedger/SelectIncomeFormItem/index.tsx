import React, { useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import IncomeTable from "./IncomeTable"
import { Button, Space } from 'antd'
import { connect } from 'umi'

/**
 * 显示卡片
 * @param props 
 * @returns 
 */
const AddQualitySafetyOversight = (props: any) => {
  const { dispatch, record = {}, form, isDetail = false } = props;
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  //查询相关数据
  useEffect(() => {
    if (record?.contract_income_id) {
      dispatch({
        type: 'income/getIncomeInfo',
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([
            { Key: 'id', Val: record?.contract_income_id, Operator: '=' }
          ])
        },
        callback: (response: any) => {
          setSelectedRecord(response?.rows?.[0])
        },
      });
    }
  }, [record?.contract_income_id])

  return (
    <div>
      { // 如果已选择记录，显示 InfoCard
        selectedRecord ? (
          <InfoCard
            isDetail={isDetail}
            record={selectedRecord}
            setIncomeInfoWbsNameOpen={() => setVisible(true)} // 设置打开弹窗的回调
            handleCancel={() => {
              form.setFieldsValue({
                contract_income_id: '',
              })
              setSelectedRecord(null)
            }}
          />
        ) : (
          //是否是详情 详情不需要展示按钮
          isDetail ? <>加载中...</> : <Space>
            <Button
              type="dashed"
              style={{
                width: 160
              }}
              onClick={() => {
                setVisible(true)
              }}
              disabled={false}
            >
              {selectedRecord?.contract_name ? selectedRecord?.contract_name : '选择收入合同'}
            </Button>
          </Space>
        )
      }
      {/* 选择收入合同数据 */}
      <IncomeTable
        visible={visible}
        onCancel={() => setVisible(false)}
        onSelect={(data: any) => {
          setSelectedRecord(data)
          if (typeof data === "object" && data !== null) {
            form.setFieldsValue({
              ...data,
              contract_income_id: data.id,
              'project_name': data.contract_name,
              'construction_unit': data.owner_unit_name,
              'branch_company': data.dep_name,
              'contract_mode': data.contract_mode_str,
              'contract_type': data.valuation_mode_name,
              'start_date': data.contract_start_date,
              'end_date': data.contract_end_date,
              'contract_amount': data.contract_say_price,
              'contract_year': data.contract_sign_date_str ? data.contract_sign_date_str.split("-")[0] : "",
              'work_scope': data.scope_fo_work,
              'performance_type':data.project_category_str
            });
          }
        }}
      />
    </div>
  )
}

export default connect()(AddQualitySafetyOversight)