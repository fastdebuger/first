import React, { useRef, useState } from "react";
import { BasicTableColumns } from "yayang-ui";
import { configColumns } from "../columns";
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { Button, Dropdown, MenuProps, Space, Tag } from "antd";
import BatchSelectGovernanceByUserCode from "../BatchSelectGovernanceByUserCode";
import { CURR_USER_CODE } from "@/common/const";
import BatchSelectGovernanceEditByUserCode from "../Edit";
import styles from './index.module.css'

/**
 * 风险管控表格
 * @param props
 * @constructor
 */
const ExperienceDetail: React.FC<any> = (props) => {
  const { authority, selectedRecord, onClose } = props;
  const actionRef: any = useRef();
  const [batchSelectGovernanceVisible, setBatchSelectGovernanceVisible] = useState(false);
  const [currIndex, setCurrIndex] = useState<1 | 2 | 3 | 4>(1);
  const [batchSelectGovernanceEditVisible, setBatchSelectGovernanceEditVisible] = useState(false);

  const tableDataSource = useRef(null)

  /**
   * 表格配置
   */
  const getTabelBodyColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "risk_events_name",
      "category_name",
      "category_details_name",
      "risk_description",
      "effect_factors",
      "potential_consequence",
      "weight",
      "post_name",

      "risk_possibility_name",
      "risk_incidence_name",

      "risk_socre",
      "risk_socre_name",

      "risk_coping_strategy_name",
      "risk_control_plan",

      "risk_unit",
      "risk_dept",
      
      "risk_principal",
      "required_complete_time_str",
      "disposal_sort",

      "risk_status",
      "executive_condition",
      "examine_person_name",
      "remark",

    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
    return cols.getNeedColumns();
  }

  /**
   * 打开编辑弹窗
   * @param index 
   */
  const handleEditingProgressFn = (index: (1 | 2 | 3 | 4)) => {
    setCurrIndex(index)
    setBatchSelectGovernanceEditVisible(true)
  }

  /**
   * 打开填报弹窗
   * @param index 
   */
  const handleSubmitProgressFn = (index: (1 | 2 | 3 | 4)) => {
    setCurrIndex(index)
    setBatchSelectGovernanceVisible(true)
  }


  const editItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          onClick={() => {
            handleEditingProgressFn(1)
          }}
        >
          编辑风险识别
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          onClick={() => {
            handleEditingProgressFn(2)
          }}
        >
          编辑风险评估
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a
          onClick={() => {
            handleEditingProgressFn(3)
          }}
        >
          编辑风险管控计划
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a
          onClick={() => {
            handleEditingProgressFn(4)
          }}
        >
          编辑风险监控情况
        </a>
      ),
    },
  ];

  const submitItems: MenuProps['items'] = [
    {
      key: '2',
      label: (
        <a
          onClick={() => {
            handleSubmitProgressFn(1)
          }}
        >
          填报风险评估
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a
          onClick={() => {
            handleSubmitProgressFn(2)
          }}
        >
          填报风险管控计划
        </a>
      ),
    },

    {
      key: '4',
      label: (
        <a
          onClick={() => {
            handleSubmitProgressFn(3)
          }}
        >
          填报风险监控情况
        </a>
      ),
    },
  ]

  /**
   * 处理表格的回调数据
   * @param data 
   */
  const handleResponse = (data: any) => {
    tableDataSource.current = data?.rows?.map((o: any) => ({
      ...o,
      create_by: selectedRecord.create_by,
      risk_category: o.risk_category ? String(o.risk_category) : o.risk_category,
      risk_possibility: o.risk_possibility ? String(o.risk_possibility) : o.risk_possibility,
      risk_incidence: o.risk_incidence ? String(o.risk_incidence) : o.risk_incidence,
      risk_coping_strategy: o.risk_coping_strategy ? String(o.risk_coping_strategy) : o.risk_coping_strategy,
      risk_category_details: o.risk_category_details ? o.risk_category_details.split(",") : o.risk_category_details,
      analysis_person_code: o.analysis_person_code ? o.analysis_person_code.split(",") : o.analysis_person_code,
      // answer_person_code: o.answer_person_code ? o.answer_person_code.split(",") : o.answer_person_code,
      // examine_person_code: o.examine_person_code ? o.examine_person_code.split(",") : o.examine_person_code,
    })) || []
  }

  /***
   * 渲染按钮组
   */
  const renderButtonToolbar = () => {

    return [
      <Space>
        <Dropdown
          menu={{ items: editItems }}
          placement="bottom"
        >
          <Button
            type="primary"
          >
            编辑
          </Button>
        </Dropdown>

        <Dropdown
          menu={{ items: submitItems }}
          placement="bottom"
        >
          <Button
            type="primary"
          >
            填报
          </Button>
        </Dropdown>
      </Space>
    ]
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="风险监控登记表"
        funcCode={authority + '风险监控登记表1'}
        type="projectRiskGovernance/getInfo"
        importType="projectRiskGovernance/getInfo"
        tableColumns={getTabelBodyColumns()}
        tableSortOrder={{ sort: 'risk_socre', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={undefined}
        rowSelection={null}
        handleResponse={handleResponse}
        renderDropMenuToolbar={() => {
          return (
            <Tag color="blue">
              黄色是风险评估人员填报
              蓝色是风险主责部门/单位负责人填报
              粉色是监督检查人员填报
            </Tag>
          )
        }}
        rowClassName={(record: any) => {
          const { examine_id, analysis_id, recognition_id, answer_id, analysis_person_code = "" } = record

          // 渲染哪些需要填报
          if (examine_id) {
            return styles.success
          }
           if (answer_id) {
            return styles.examine_person_code
          }
          if (analysis_id) {
            return styles.answer_person_code
          }
          if (analysis_person_code?.split(",")?.includes(CURR_USER_CODE) && recognition_id) {
            return styles.analysis_person_code
          }
         
        }}
        tableDefaultFilter={
          [
            { Key: 'main_id', Val: selectedRecord.main_id, Operator: '=' }
          ]
        }
      />
      {/* 根据选择的数据批量下一个审批功能 */}
      {batchSelectGovernanceVisible && (
        <BatchSelectGovernanceByUserCode
          // tableDataSource={tableDataSource}
          index={currIndex}
          selectedRecord={selectedRecord}
          visible={batchSelectGovernanceVisible}
          bodyData={tableDataSource.current || []}
          onCancel={() => setBatchSelectGovernanceVisible(false)}
          callbackSuccess={() => {
            setBatchSelectGovernanceVisible(false);
            if (onClose) {
              onClose()
            }
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {/* 根据选择的数据批量编辑 */}
      {batchSelectGovernanceEditVisible && (
        <BatchSelectGovernanceEditByUserCode
          // tableDataSource={tableDataSource}
          bodyData={tableDataSource.current || []}
          index={currIndex}
          visible={batchSelectGovernanceEditVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setBatchSelectGovernanceEditVisible(false)}
          callbackSuccess={() => {
            setBatchSelectGovernanceEditVisible(false);
            if (onClose) {
              onClose()
            }
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </>
  );
};

export default ExperienceDetail
