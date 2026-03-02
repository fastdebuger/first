import React, { useEffect, useMemo, useState } from 'react';
import { configColumns, RiskAnalysis, RiskIdentification, RiskResponse, SupervisionInspection } from '../columns';
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { Button, Input, InputNumber, message, Select, Space } from 'antd';
import WbsTreeSelect from '@/components/CommonList/WbsTreeSelect';
import { arrToTree } from '@/utils/utils-array';
import RiskCategoryDetailsSelect from '../riskCategoryDetailsSelect';
import BranchSelect from '../BranchSelect';
import _ from 'lodash';

const { CrudAddModal } = HeaderAndBodyTable;
const { Option, OptGroup } = Select;

interface EmergencyPlanProps {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  allUserListList: any[],
  riskMonitoringProject: any[],
  queryParamsType?: any

}



/**
 * 组件不支持input 需要自定义渲染文本域
 * @param dataIndex 
 * @returns 
 */
export const renderTextArea = (dataIndex: string) => {
  return {
    title: 'ProjectRiskGovernance.' + dataIndex,
    dataIndex,
    width: 260,
    align: 'center',
    editable: true,
    renderSelfEditable: (record: any, handleSave: any) => {
      const onChange = (e: any) => {
        const value = e?.target?.value || ""
        const copyRecord = { ...record };
        Object.assign(copyRecord, {
          [dataIndex]: value,
        });
        handleSave(copyRecord)
      };
      return (
        <Input.TextArea
          style={{
            resize: "none"
          }}
          defaultValue={record[dataIndex]}
          rows={2}
          onChange={onChange}
        />
      )
    },
  }
}

/**
 * 新增风险管控新增
 * @param props 
 * @returns 
 */
const EmergencyPlanAdd: React.FC<EmergencyPlanProps> = (props) => {
  const {
    dispatch,
    onCancel,
    callbackSuccess,
    allUserListList,
    queryParamsType,
    riskMonitoringProject
  } = props;

  const { formatMessage } = useIntl();
  // 风险类型配置项
  const [riskCategoryConfig, setRiskCategoryConfig] = useState<any[]>([]);

  const treeData = useMemo(() =>
    arrToTree(riskCategoryConfig, 'id', 'parent_id', 'children', null),
    [riskCategoryConfig]);

  // 详情选项过滤
  const riskCategoryDetails = useMemo(() => {
    return riskCategoryConfig
  }, [riskCategoryConfig]);

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
          const flatData = res.rows;
          setRiskCategoryConfig(flatData);
        } else {
          setRiskCategoryConfig([]);
        }
      },
    });
  }, [])


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
        // "project_manager_dept",
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
        // renderTextArea("risk_events_name"),
        "risk_events_name",
        {
          title: 'ProjectRiskGovernance.risk_category',
          dataIndex: "risk_category",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const handleCategoryChange = (e: any) => {
              const value = e || ""
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                risk_category: value,
                risk_category_details: []
              });
              handleSave(copyRecord)
            };
            return (
              <Select
                showSearch
                placeholder="请选择一级风险名称"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {treeData.map((parent: any) => (
                  <OptGroup key={parent.id} label={parent.category_name}>
                    {parent.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.category_name}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'ProjectRiskGovernance.risk_category_details',
          dataIndex: "risk_category_details",
          width: 260,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            return (
              <RiskCategoryDetailsSelect
                record={record}
                handleSave={handleSave}
                riskCategoryDetails={riskCategoryDetails}
              />
            )
          },
        },
        renderTextArea("risk_description"),
        renderTextArea("effect_factors"),
        renderTextArea("potential_consequence"),
        // "weight",
        {
          title: 'ProjectRiskGovernance.weight',
          dataIndex: 'weight',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value;
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                weight: num,
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        },
        "post_name",
        "analysis_person_code",
        // "risk_possibility",
        // "risk_incidence",
        // renderTextArea("disposal_sort"),
        // "risk_coping_strategy",
        // renderTextArea("risk_control_plan"),
        // renderTextArea("risk_dept"),
        // "required_complete_time",
        // renderTextArea("risk_status"),
        // renderTextArea("executive_condition"),
        // renderTextArea("remark")
      ])
      .setEditTableHeaderTitleBatchIconToMultiSelect([
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
            "analysis_person_code",
          ],
        },
      ])
      .setEditTableHeaderTitleBatchIconToInputNumber([
        {
          value: "weight",
          showTableColumns: ["risk_events_name", "weight"]
        }
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
        {
          value: "risk_events_name",
          valueType: "select",
          name: "risk_events_name_str",
          data: [
            {
              risk_events_name: "报告风险",
              risk_events_name_str: "报告风险",
            },
            {
              risk_events_name: "合规风险",
              risk_events_name_str: "合规风险",
            },
            {
              risk_events_name: "经营风险",
              risk_events_name_str: "经营风险",
            },
            {
              risk_events_name: "战略风险",
              risk_events_name_str: "战略风险",
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

        "risk_possibility",
        "risk_incidence",
        "disposal_sort",

        "risk_coping_strategy",
        "risk_control_plan",
        "risk_dept",
        "required_complete_time",

        "risk_status",
        "executive_condition",
        "weight",
        "analysis_person_code",
      ])
      .noNeedToEditable([
        // ...RiskIdentification,
        ...RiskAnalysis,
        ...RiskResponse,
        ...SupervisionInspection,
      ])

      .getNeedColumns();

    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };



  const toolBarRender = (
    handleAdd: any,
    handleBatchAdd: any,
    form: any,
    updateLoadDataSourc: any,
    dataSource: any
  ) => {
    return [
      <Space>
        <h3>风险监控登记表</h3>
        <Button onClick={async () => {
          await form?.current?.validateFields();
          handleAdd({
            risk_category_details: []
          });
        }}
        >
          新增
        </Button>
      </Space>
    ]
  }

  return (
    <>
      <CrudAddModal
        sticky={false}
        scroll={{
          y: false,
        }}
        title={'新增风险管控' + (queryParamsType ? "(代办任务)" : "(日常填报)")}
        visible={true}
        onCancel={onCancel}
        toolBarRender={
          toolBarRender
        }
        formColumns={getFormColumns()}
        tableColumns={getTableColumns()}
        initFormValues={{
          // "secondary_unit": "1325.13250022.13250740",
          // "project_manager_dept": "1325.13250022.13250740",
          // "project_manager": "project_manager1",
          // "project_name": "project_name" + Math.random(),
          // "project_level": "A",
          // "risk_manager": "risk_manager"
        }}
        initDataSource={[]}
        onCommit={(data: any) => {
          const { dataSource, form } = data;
          const values = form.getFieldsValue();
          if (!(dataSource.length > 0)) {
            message.error("请添加数据")
            return new Promise((resolve: any) => {
              resolve(true)
            })
          }

          const totalWeight = dataSource.reduce((acc: number, cur: { weight: number | string }) => {
            return acc + (Number(cur.weight) || 0);
          }, 0);

          if (totalWeight > 1) {
            message.error("权重总和不能大于1");
            return Promise.resolve(true);
          }

          const datas = dataSource.map((i: any) => {
            const cleanItem = _.omit(i, ['id', 'key', 'isEditRow', 'isAddRow', 'RowNumber']);
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
          const recognitionItems: any = []
          datas.forEach((items: any) => {
            const result: any = {}
            for (const key in items) {
              if (!Object.hasOwn(items, key)) continue;
              if (RiskIdentification.includes(key)) {
                result[key] = items[key];
              }
            }
            recognitionItems.push(result)
          })

          return new Promise((resolve: any) => {
            dispatch({
              type: 'projectRiskGovernance/saveBatch',
              payload: {
                ...values,
                // wbs: localStorage.getItem("auth-default-wbsCode"),
                recognitionItems: JSON.stringify(
                  recognitionItems
                ),
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success(formatMessage({ id: 'common.list.add.success' }));
                  setTimeout(() => {
                    callbackSuccess();
                  }, 200);
                }
              },
            });
          });
        }}
      >
      </CrudAddModal>

    </>
  );
};
// allUserListList
export default connect(({ common, projectRiskGovernance }: any) => ({
  allUserListList: common.allUserListList,
  riskMonitoringProject: projectRiskGovernance?.riskMonitoringProject?.result || []
}))(EmergencyPlanAdd);
