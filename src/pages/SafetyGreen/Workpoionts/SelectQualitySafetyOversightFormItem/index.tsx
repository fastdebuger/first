import React, { useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import QualitySafetyInspectionTable from "./QualitySafetyInspectionTable"
import { Button, Space } from 'antd'
import { connect } from 'umi'

/**
 * 显示卡片或者选择质量安全问题
 * @param props 
 * @returns 
 */

const SelectQualitySafetyOversightFormItem = (props: any) => {
  const { dispatch, record = {}, form } = props;
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  //查询质量相关数据
  useEffect(() => {
    if (record?.safety_inspection_id) {
      dispatch({
        type: 'qualitySafetyInspection/getQualitySafetyInspection',
        payload: {
          sort: 'form_make_time',
          order: 'desc',
          filter: JSON.stringify([
            { Key: 'id', Val: record?.safety_inspection_id, Operator: '=' }
          ])
        },
        callback: (response: any) => {
          setSelectedRecord(response?.rows?.[0])
        },
      });
    }
  }, [record?.safety_inspection_id])

  return (
    <div>
      { // 如果已选择记录，显示 InfoCard
        selectedRecord ? (
          <InfoCard
            record={selectedRecord}
            setIncomeInfoWbsNameOpen={() => setVisible(true)} // 设置打开弹窗的回调
            handleCancel={() => {
              form.setFieldsValue({
                'examine_wbs_code': "",
                'examine_wbs_name': "",
                'project_name': "",
                'problem_description': "",
                'branch_comp_code': "",
                'hazard_level': ""
              })
              setSelectedRecord(null)
            }}
          />
        ) : (
          <Space>
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
              {selectedRecord?.project_name ? selectedRecord?.project_name : '选择问题质量清单'}
            </Button>
          </Space>
        )
      }
      {/* 选择质量数据 */}
      <QualitySafetyInspectionTable
        visible={visible}
        onCancel={() => setVisible(false)}
        onSelect={(data: any) => {
          setSelectedRecord(data)
          if (typeof data === "object" && data !== null) {
            form.setFieldsValue({
              ...data,
              safety_inspection_id: data.id,
              hazard_level:data.severity_level
            });
          }
        }}
      />
    </div>
  )
}

export default connect()(SelectQualitySafetyOversightFormItem)