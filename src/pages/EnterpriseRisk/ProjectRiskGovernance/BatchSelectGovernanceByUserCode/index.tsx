import React, { useEffect, useState } from 'react';
import { configColumns, extractStageData, getInitTableColumns, STAGE_MAP } from '../columns';
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, useIntl } from 'umi';
import { connect } from 'umi';
import { CURR_USER_CODE, ErrorCode } from '@/common/const';
import { message } from 'antd';
import RiskEventDetail from '../RiskEventDetail';
import { getTitleByIndex } from '../Edit';
import WbsTreeSelect from '@/components/CommonList/WbsTreeSelect';
import BranchSelect from '../BranchSelect';
import _ from 'lodash';

const { CrudEditModal } = HeaderAndBodyTable;

interface BatchSelectGovernanceByUserCodeProps {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackSuccess: () => void,
  selectedRecord: any,
  bodyData: any[],
  index: number; //到第几部
  allUserListList: any[]
}

/**
 * 根据层级判断用户是在第几层需要过滤哪些数据
 * @param index 
 * @param bodyData 
 * @returns 
 */
const bodyFilterDataByIndex = (index: number, bodyData: any[]) => {
  switch (index) {
    case 1:
      const resultByOne = bodyData.filter(item => {
        if (item.examine_id) return false
        if (item.answer_id) return false
        if (item.analysis_id) return false
        if (item.recognition_id) return false
        return item.create_by === CURR_USER_CODE
      })
      return resultByOne

    case 2:
      const resultByTwo = bodyData.filter(item => {
        if (item.examine_id) return false
        if (item.answer_id) return false
        if (item.analysis_id) return false
        return item.recognition_id && item.analysis_person_code.includes(CURR_USER_CODE)
      })
      return resultByTwo

    case 3:
      const resultByThree = bodyData.filter(item => {
        if (item.examine_id) return false
        if (item.answer_id) return false
        return item.analysis_id //&& item.answer_person_code.includes(CURR_USER_CODE)
      })
      return resultByThree

    case 4:
      const resultByFour = bodyData.filter(item => {
        if (item.examine_id) return false
        return item.answer_id
        // return item.examine_person_code.includes(CURR_USER_CODE)
      })
      return resultByFour

    default:
      return []
  }
}

/**
 * 风险管控填报
 * 填报进度 1-风险识别 2-风险评估/评价 3-风险应对 4-监督检查
 * 根据填报进度动态填报
 * @param props 
 * @returns 
 */
const BatchSelectGovernanceByUserCode: React.FC<BatchSelectGovernanceByUserCodeProps> = (props) => {
  const {
    dispatch,
    onCancel,
    callbackSuccess,
    selectedRecord,
    index,
    bodyData = [],
    allUserListList
  } = props;

  const { formatMessage } = useIntl();
  const [submitData, setSubmitData] = useState(bodyData)

  useEffect(() => {
    if (bodyData.length) {
      // 根据 1 ，2，3，4 判断 recognition_id analysis_id answer_id examine_id
      // 将需要用户填写的数据过滤出来
      const bodyFilterDataByUserAndId = bodyFilterDataByIndex(Number(index + 1), bodyData);
      setSubmitData(bodyFilterDataByUserAndId)
    }
  }, [bodyData.length])
  /**
   * 表单配置
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // "secondary_unit",
        // "project_manager_dept",
        {
          title: 'ProjectRiskGovernance.secondary_unit',
          subTitle: "二级单位",
          dataIndex: "secondary_unit",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <BranchSelect disabled />
            )
          }
        },
        // "secondary_unit",
        {
          title: 'ProjectRiskGovernance.project_manager_dept',
          subTitle: "项目经理部",
          dataIndex: "project_manager_dept",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <WbsTreeSelect disabled />
            )
          }
        },
        "project_manager",
        "project_name",
        "project_level",
        "risk_manager",
      ])
      .needToDisabled([
        "secondary_unit",
        "project_manager_dept",
        "project_manager",
        "project_name",
        "project_level",
        "risk_manager",
      ])
      .setFormColumnToSelect([
        {
          value: "project_level",
          valueType: "select",
          name: "project_level_str",
          data: [
            {
              project_level: "A",
              project_level_str: "A",
            },
            {
              project_level: "B",
              project_level_str: "B",
            },
            {
              project_level: "C",
              project_level_str: "C",
            }
          ]

        }
      ])
      .needToRules([
        "secondary_unit",
        "project_manager_dept",
        "project_manager",
        "project_name",
        "project_level",
        "risk_manager",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  /**
   * 表格配置
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        {
          title: 'ProjectRiskGovernance.risk_events_name',
          dataIndex: "risk_events_name",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            return (
              <div>
                <RiskEventDetail
                  record={record}
                  id={"recognition_id"}
                  type="projectRiskGovernance/getInfo"
                  cardDetail={
                    [
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_events_name" }), value: record.risk_events_name },
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_category" }), value: record.category_name },//
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_category_details" }), value: record.category_details_name },//
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_description" }), value: record.risk_description },
                      { label: formatMessage({ id: "ProjectRiskGovernance.effect_factors" }), value: record.effect_factors },
                      { label: formatMessage({ id: "ProjectRiskGovernance.potential_consequence" }), value: record.potential_consequence },
                      { label: formatMessage({ id: "ProjectRiskGovernance.weight" }), value: record.weight },

                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_possibility" }), value: record.risk_possibility_name },//
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_incidence" }), value: record.risk_incidence_name },//
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_socre" }), value: record.risk_socre },
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_socre_name" }), value: record.risk_socre_name },
                      { label: formatMessage({ id: "ProjectRiskGovernance.disposal_sort" }), value: record.disposal_sort },

                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_coping_strategy" }), value: record.risk_coping_strategy_name },//
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_control_plan" }), value: record.risk_control_plan },
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_unit" }), value: record.risk_unit },
                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_dept" }), value: record.risk_dept },
                      { label: formatMessage({ id: "ProjectRiskGovernance.required_complete_time" }), value: record.required_complete_time_str },//

                      { label: formatMessage({ id: "ProjectRiskGovernance.risk_status" }), value: record.risk_status },
                      { label: formatMessage({ id: "ProjectRiskGovernance.executive_condition" }), value: record.executive_condition },
                      { label: formatMessage({ id: "ProjectRiskGovernance.remark" }), value: record.remark },
                    ]
                  }

                >
                  {record.risk_events_name}
                </RiskEventDetail>
              </div>
            )
          },
        },
        ...getInitTableColumns(Number(index) + 1)
      ])
      .setTableColumnToSelect([
        {
          value: "analysis_person_code",
          valueType: "multiple",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList
        },
        {
          value: "risk_possibility",
          valueType: "select",
          name: "risk_possibility_str",
          data: [
            {
              risk_possibility: "1",
              risk_possibility_str: "极小",
            },
            {
              risk_possibility: "2",
              risk_possibility_str: "不太可能",
            },
            {
              risk_possibility: "3",
              risk_possibility_str: "有可能",
            },
            {
              risk_possibility: "4",
              risk_possibility_str: "很可能",
            },
            {
              risk_possibility: "5",
              risk_possibility_str: "基本会发生",
            },
          ]
        },
        {
          value: "risk_incidence",
          valueType: "select",
          name: "risk_incidence_str",
          data: [
            {
              risk_incidence: "1",
              risk_incidence_str: "轻微",
            },
            {
              risk_incidence: "2",
              risk_incidence_str: "较小",
            },
            {
              risk_incidence: "3",
              risk_incidence_str: "一般",
            },
            {
              risk_incidence: "4",
              risk_incidence_str: "严重",
            },
            {
              risk_incidence: "5",
              risk_incidence_str: "非常严重",
            },
          ]
        },
        {
          value: "risk_coping_strategy",
          valueType: "select",
          name: "risk_coping_strategy_str",
          data: [
            {
              risk_coping_strategy: "1",
              risk_coping_strategy_str: "风险规避",
            },
            {
              risk_coping_strategy: "2",
              risk_coping_strategy_str: "风险控制",
            },
            {
              risk_coping_strategy: "3",
              risk_coping_strategy_str: "风险分担",
            },
            {
              risk_coping_strategy: "4",
              risk_coping_strategy_str: "风险接受",
            }
          ]
        },
      ])
      .setTableColumnToDatePicker([
        {
          value: 'required_complete_time',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD'
        },
      ])
      .setEditTableHeaderTitleBatchIconToSelect([
        {
          value: "analysis_person_code",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList,
          showTableColumns: ["analysis_person_code"],
        },
      ])
      .needToRules([

        "risk_events_name",
        "risk_category",
        "risk_category_details",
        "risk_description",
        "effect_factors",
        "potential_consequence",
        "weight",
        "analysis_person_code",

        "risk_possibility",
        "risk_incidence",
        "disposal_sort",

        "risk_coping_strategy",
        "risk_control_plan",
        "risk_dept",
        "risk_unit", //风险主责单位
        "risk_principal", //风险主责负责人
        "required_complete_time",

        "risk_status",
        "executive_condition",
        "examine_person_name",

        "analysis_person_code",
      ])
      .noNeedToEditable(
        [
          "risk_socre",
          "risk_socre_name"
        ]
      )
      .getNeedColumns();

    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = () => [];

  return (
    <>
      <CrudEditModal
        sticky={false}
        scroll={{
          y: false,
        }}
        title={'填报风险管控' + getTitleByIndex(index + 1)}
        visible={true}
        onCancel={onCancel}
        toolBarRender={
          toolBarRender
        }
        renderOperator={() => undefined}
        renderSelfOperatorTableCell={() => false}
        formColumns={getFormColumns()}
        tableColumns={getTableColumns()}
        initFormValues={{
          ...selectedRecord,
        }}
        initDataSource={[...submitData]}
        onCommit={(data: any) => {
          const { dataSource, form } = data;
          const values = form.getFieldsValue();
          if (!(dataSource.length > 0)) {
            message.error("请添加数据")
            return new Promise((resolve: any) => {
              resolve(true)
            })
          }

          const datas = _.map(dataSource, (item) => {
            const cleanItem = _.omit(item, ['id', 'key', 'isEditRow', 'isAddRow', 'RowNumber']);
            return {
              ...cleanItem,
              risk_category_details: Array.isArray(item.risk_category_details) ?
                item.risk_category_details.join(",") :
                item.risk_category_details,

              analysis_person_code: Array.isArray(item.analysis_person_code) ?
                item.analysis_person_code.join(",") :
                item.analysis_person_code,
            };
          });

          // 获取当前阶段
          const reportStageType = STAGE_MAP[Number(index) + 1]

          if (!reportStageType) {
            message.info("未获取到阶段值，请刷新重试");
            return
          }
          // 提取和过滤当前阶段需要提交的字段
          const itemsToSubmit = extractStageData(
            datas,
            reportStageType.fields,
            ["recognition_id", "analysis_id", "answer_id"],
          );
          // console.log('datas :>> ', itemsToSubmit);
          const payload = {
            ...selectedRecord,
            ...values,
            main_id: selectedRecord.main_id || "",
            [reportStageType.payloadKey]: JSON.stringify(itemsToSubmit),
          };

          return new Promise((resolve: any) => {
            dispatch({
              type: reportStageType.action,
              payload,
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success(reportStageType.successMsg);
                  setTimeout(() => {
                    callbackSuccess();
                  }, 200);
                }
              },
            });
          });
        }}
      >
      </CrudEditModal>
    </>
  );
};

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(BatchSelectGovernanceByUserCode);
