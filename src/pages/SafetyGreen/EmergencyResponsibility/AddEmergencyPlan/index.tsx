import React, { useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import AddEmergencyPlanPage from "./AddEmergencyPlanPage"
import { Button, Space } from 'antd'
import { connect } from 'umi'

/**
 * 显示卡片
 * @param props 
 * @returns 
 */
const AddQualitySafetyOversight = (props: any) => {
  const { dispatch, record = {}, form, isDetail = false, type, onOk } = props;
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  //查询相关数据
  useEffect(() => {
    if (record?.form_no) {
      dispatch({
        type: 'emergencyplan/queryContingencyPlanConfigHead',
        payload: {
          sort: 'form_no',
          order: 'desc',
          filter: JSON.stringify([
            { Key: 'form_no', Val: record?.form_no, Operator: '=' }
          ])
        },
        callback: (response: any) => {
          setSelectedRecord(response?.rows?.[0])
        },
      });
    }
  }, [record?.form_no])

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
                plan_config_id: '',
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
              {selectedRecord?.project_name ? selectedRecord?.project_name : '选择应急预案'}
            </Button>
          </Space>
        )
      }
      {/* 选择质量数据 */}
      <AddEmergencyPlanPage
        type={type}
        visible={visible}
        onOk={onOk}
        onCancel={() => setVisible(false)}
        onSelect={(data: any) => {
          setSelectedRecord(data)
          if (typeof data === "object" && data !== null) {
            if (form.setFieldsValue) {
              form.setFieldsValue({
                ...data,
                plan_config_id: data.form_no,
              });
            }
            else if (form.current.setFieldsValue) {
              form.setFieldsValue({
                ...data,
                plan_config_id: data.form_no,
              });
            }


          }
        }}
      />
    </div>
  )
}

export default connect()(AddQualitySafetyOversight)