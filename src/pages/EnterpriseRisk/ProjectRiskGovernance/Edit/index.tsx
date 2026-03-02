import React, { useEffect, useMemo, useState } from 'react';
import { configColumns, getInitTableColumns, RiskAnalysis, RiskIdentification, RiskResponse, SupervisionInspection } from '../columns';
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { CURR_USER_CODE, ErrorCode } from '@/common/const';
import { message } from 'antd';
import RiskEventDetail from '../RiskEventDetail';
import WbsTreeSelect from '@/components/CommonList/WbsTreeSelect';
import { arrToTree } from '@/utils/utils-array';
import BranchSelect from '../BranchSelect';
import _ from 'lodash';

const { CrudEditModal } = HeaderAndBodyTable;

interface EmergencyPlanProp {
  selectedRecord: any,
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  allUserListList: any[];
  index: number;
  bodyData: any[];
  riskMonitoringProject: any[];
}

/**
 * 将用户编辑的数据 (editedData) 合并回原始数据 (originalData)
 * 使用 recognition_id 作为主要合并键，因为它是四个流程的起点
 * @param {Array} originalData 原始完整的 bodyData
 * @param {Array} editedData 用户编辑后的 editData (即 dataSource)
 * @returns {Array} 合并后的数据数组
 */
const mergeEditedData = (originalData: any[], editedData: any[]) => {
  if (!editedData.length) {
    return originalData; // 没有修改，返回原数据
  }

  // 使用 Map 结构存储编辑后的数据，以便快速查找
  // 假设 recognition_id 是唯一的标识符（或至少是该阶段的主 ID）
  const editedMap = new Map();
  editedData.forEach(item => {
    // 使用识别ID作为合并键，如果recognition_id不存在，需要根据业务逻辑选择其他ID，如 id 或 analysis_id
    const key = item.recognition_id || item.id;
    if (key) {
      editedMap.set(key, item);
    }
  });

  // 遍历原始数据，进行更新
  const mergedData = originalData.map(originalItem => {
    const key = originalItem.recognition_id || originalItem.id;

    // 如果原始数据项在编辑后的 Map 中存在，则用编辑后的数据覆盖
    if (key && editedMap.has(key)) {
      const editedItem = editedMap.get(key);

      // 注意：这里使用浅拷贝 Object.assign 或展开运算符来合并，
      // 确保新数据覆盖了旧数据，但保留了用户未编辑的字段（例如create_date等）。
      return { ...originalItem, ...editedItem };
    }

    // 否则，返回原始数据
    return originalItem;
  });

  return mergedData;
};

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
        return item.recognition_id && item.create_by === CURR_USER_CODE
      })
      return resultByOne

    case 2:
      const resultByTwo = bodyData.filter(item => {
        if (item.examine_id) return false
        if (item.answer_id) return false
        return item.analysis_id && item.analysis_person_code.includes(CURR_USER_CODE)
      })
      return resultByTwo

    case 3:
      const resultByThree = bodyData.filter(item => {
        if (item.examine_id) return false
        return item.answer_id
        // return item.answer_id && item.answer_person_code === CURR_USER_CODE
      })
      return resultByThree

    case 4:
      const resultByFour = bodyData.filter(item => {
        return item.examine_id
        // return item.examine_id && item.examine_person_code === CURR_USER_CODE
      })
      return resultByFour

    default:
      return []
  }
}

/**
 * 获取编辑和填报所需要的层级
 * @param index 
 * @param bodyData 
 * @returns 
 */
export const getTitleByIndex = (index: number) => {
  switch (index) {
    case 1:
      return "(风险识别)"
    case 2:
      return "(风险评估)"
    case 3:
      return "(风险管控计划)"
    case 4:
      return "(风险监控情况)"
    default:
      return ""
  }
}

/**
 * 编辑风险管控
 * @param props 
 * @returns 
 */
const EmergencyPlanEdit: React.FC<EmergencyPlanProp> = (props) => {
  const {
    dispatch,
    onCancel,
    callbackSuccess,
    selectedRecord = {},
    allUserListList,
    index,
    bodyData = [],
    riskMonitoringProject
  } = props;

  const { formatMessage } = useIntl();
  const [editData, setEditData] = useState(bodyData)

  // 风险类型配置项
  const [riskCategoryConfig, setRiskCategoryConfig] = useState<any[]>([]);

  /**
   * 请求风险类型配置项
   */
  useEffect(() => {
    dispatch({
      type: "collectionOfRiskIncidents/queryRiskCategoryConfig",
      payload: {
        filter: JSON.stringify([]),
        order: 'asc',
        sort: 'id',
      },
      callback: (res: { errCode: number; rows: any }) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const flatData = res?.rows?.map((item: any) => ({
            ...item,
            id: String(item.id),
            parent_id: item.parent_id ? String(item.parent_id) : null
          }));
          setRiskCategoryConfig(flatData);
        } else {
          setRiskCategoryConfig([]);
        }
      },
    });
  }, [])

  const treeData = useMemo(() =>
    arrToTree(riskCategoryConfig, 'id', 'parent_id', 'children', null),
    [riskCategoryConfig]);

  // 详情选项过滤
  const riskCategoryDetails = useMemo(() => {
    return riskCategoryConfig
  }, [riskCategoryConfig]);


  useEffect(() => {
    if (bodyData.length) {
      // 根据 1 ，2，3，4 判断 recognition_id analysis_id answer_id examine_id
      // 将需要用户填写的数据过滤出来
      const bodyFilterDataByUserAndId = bodyFilterDataByIndex(index, bodyData);
      setEditData(bodyFilterDataByUserAndId)
    }
  }, [bodyData.length])

  /**
   * 表单配置
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'ProjectRiskGovernance.secondary_unit',
          subTitle: "二级单位",
          dataIndex: "secondary_unit",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <BranchSelect />
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
              <WbsTreeSelect />
            )
          }
        },
        "project_manager",
        "project_name",
        "project_level",
        "risk_manager",
      ])
      .needToDisabled([])
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
      .setFormColumnToAutoComplete([
        {
          value: "project_name",
          data: riskMonitoringProject?.map(item => ({ value: item.project_name }))
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
        ...getInitTableColumns(Number(index), {
          treeData,
          riskCategoryDetails
        })
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
        // {
        //   value: "risk_events_name",
        //   valueType: "select",
        //   name: "risk_events_name_str",
        //   data: [
        //     {
        //       risk_events_name: "报告风险",
        //       risk_events_name_str: "报告风险",
        //     },
        //     {
        //       risk_events_name: "合规风险",
        //       risk_events_name_str: "合规风险",
        //     },
        //     {
        //       risk_events_name: "经营风险",
        //       risk_events_name_str: "经营风险",
        //     },
        //     {
        //       risk_events_name: "战略风险",
        //       risk_events_name_str: "战略风险",
        //     }
        //   ]
        // },
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
          showTableColumns: [
            "risk_events_name",
            // "risk_description",
            // "effect_factors",
            // "potential_consequence",
            // "weight",
            "analysis_person_code",
          ],
        },
      ])
      .setTableColumnToInputNumber([
        {
          value: "weight",
          valueType: "digit",
          max: 1,
          min: 0,
        }
      ])
      .needToRules([

        "risk_events_name",
        "risk_category",
        "risk_category_details",
        "risk_description",
        "effect_factors",
        "potential_consequence",
        "weight",

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

  const toolBarRender = () => []

  return (
    <>
      <CrudEditModal
        sticky={false}
        scroll={{
          y: false,
        }}
        title={'编辑风险管控' + getTitleByIndex(index)}
        visible={true}
        onCancel={onCancel}
        toolBarRender={toolBarRender}
        renderOperator={() => undefined}
        renderSelfOperatorTableCell={() => false}
        formColumns={getFormColumns()}
        tableColumns={getTableColumns()}
        initFormValues={{ ...selectedRecord }}
        initDataSource={[...editData]}
        onCommit={(data: any) => {
          const { dataSource, form } = data;
          const values = form.getFieldsValue();
          if (!(dataSource.length > 0)) {
            message.error("请添加数据")
            return new Promise((resolve: any) => {
              resolve(true)
            })
          }

          // 将用户修改的 dataSource 合并回原始的 bodyData
          const mergedData = mergeEditedData(bodyData, dataSource);

          const totalWeight = mergedData.reduce((acc: number, cur: { weight: number | string }) => {
            return acc + (Number(cur.weight) || 0);
          }, 0);

          if (totalWeight > 1) {
            message.error("权重总和不能大于1");
            return Promise.resolve(true);
          }

          const datas = mergedData.map((i: any) => {
            const cleanItem = _.omit(i, ['key', 'isEditRow', 'isAddRow', 'RowNumber']);
            return {
              ...cleanItem,
              risk_category_details: Array.isArray(i.risk_category_details) ?
                i.risk_category_details.join(",") :
                i.risk_category_details,

              analysis_person_code: Array.isArray(i.analysis_person_code) ?
                i.analysis_person_code.join(",") :
                i.analysis_person_code,
            };
          });

          // 处理风险识别配置数据
          const recognitionItems: any = [];
          const analysisItems: any = [];
          const answerItems: any = [];
          const examineItems: any = [];
          datas.forEach((items: any) => {
            const result1: any = {}
            const result2: any = {}
            const result3: any = {}
            const result4: any = {}
            for (const key in items) {
              if (!Object.hasOwn(items, key)) continue;
              if (RiskIdentification.includes(key)) {
                result1[key] = items[key] || "";
                result1.id = items.recognition_id || "";
              }
              if (RiskAnalysis.includes(key)) {
                result2[key] = items[key] || "";
                result2.id = items.analysis_id || "";
                result2.recognition_id = items.recognition_id || "";
              }
              if (RiskResponse.includes(key)) {
                result3[key] = items[key] || "";
                result3.id = items.answer_id || "";
                result3.analysis_id = items.analysis_id || "";
              }
              if (SupervisionInspection.includes(key)) {
                result4[key] = items[key] || "";
                result4.id = items.examine_id || "";
                result4.answer_id = items.answer_id || "";
              }
            }
            recognitionItems.push(result1)
            analysisItems.push(result2)
            answerItems.push(result3)
            examineItems.push(result4)
          })

          const payload = {
            ...selectedRecord,
            ...values,
            // wbs: localStorage.getItem("auth-default-wbsCode"),
            recognitionItems: JSON.stringify(
              recognitionItems
            ),
            analysisItems: JSON.stringify(
              analysisItems
            ),
            answerItems: JSON.stringify(
              answerItems
            ),
            examineItems: JSON.stringify(
              examineItems
            )
          };

          return new Promise((resolve: any) => {
            dispatch({
              type: 'projectRiskGovernance/updateInfo',
              payload,
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success("编辑成功");
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

export default connect(({ common, projectRiskGovernance }: any) => ({
  allUserListList: common.allUserListList,
  riskMonitoringProject: projectRiskGovernance?.riskMonitoringProject?.result || []
}))(EmergencyPlanEdit);
