import { Button, Input, Select, Space } from "antd";
import { BasicEditableColumns } from "yayang-ui";
import { renderInput, renderInputNumber, renderSelect } from "./renderCompWithTooltip";
import { getIntl } from "umi";
import _ from 'lodash';


/**
 * 特种设备共用的表体数据
 * @param options 
 * @returns 
 */
export const getEquipmentBodyTableColumns = (options: any) => {
  const { configColumns = [], flattenPostName = [], configData = {} } = options || {}
  const intl = getIntl();
  const cols = new BasicEditableColumns(configColumns)
    .initTableColumns([
      {
        title: 'PVQAStaffNomination.post_config_id',
        dataIndex: "post_config_id",
        width: 380,
        align: 'center',
        editable: true,
        renderSelfEditable: (record: any, handleSave: any) => {
          const handleChange = (e: any, values: any) => {
            const copyRecord = { ...record };
            Object.assign(copyRecord, {
              post_config_id: e,
              post_name: values.label
            });
            handleSave(copyRecord)
          };
          return (
            <Select
              disabled={!record.isAddRow}
              bordered={!!record.isAddRow}
              style={{ width: "90%", padding: "0 5px" }}
              onChange={handleChange}
              showSearch
              optionFilterProp="label"
              options={flattenPostName?.map(item => ({ ...item, label: item.post_name, value: String(item.id) }))}
            />
          )
        },
      },
      // 'person_code', //人员编号
      {
        title: 'PVQAStaffNomination.person_code',
        dataIndex: "person_code",
        width: 160,
        align: 'center',
        editable: true,
        renderSelfEditable: (record: any, handleSave: any) => {
          const handleChange = (e: any) => {
            const copyRecord = { ...record };
            Object.assign(copyRecord, {
              person_code: e?.target?.value ?? "",
            });
            handleSave(copyRecord)
          };
          return (
            <Input
              defaultValue={record.person_code}
              onChange={handleChange}
            />
          )
        },
      },
      renderInput('person_name', {
        TooltipTitle: "要求：公司合同化、市场化、企业化员工",
      }),
      'gender', //性别
      //学历
      // education_level
      renderSelect("education_level", {
        fieldsWithTooltips: "education_level_hint",
        datas: [
          {
            value: '1',
            label: '硕士',
          },
          {
            value: '2',
            label: '本科',
          },
          {
            value: '3',
            label: '大专',
          },
        ]
      }),
      // 'major_studied', //所学专业
      renderInput('major_studied', {
        fieldsWithTooltips: "major_studied_hint",
      }),
      //技术职称
      renderSelect("technical_title", {
        fieldsWithTooltips: "technical_title_hint",
        datas: [
          {
            label: "高级工程师",
            value: "1",
          },
          {
            label: "工程师",
            value: "2",
          },
          {
            label: "助理工程师",
            value: "3",
          },
        ]
      }),
      //从事专业
      "professial_id",
      // 'work_years', //工作年限
      renderInputNumber('work_years', {
        TooltipTitle: "工作年限要求：3年及以上",
      }),
      'administrative_post_id', //行政职务
      'remark', //说明
    ])
    .setTableColumnToSelect([
      {
        value: 'gender',
        name: 'gender_str',
        valueType: 'select',
        data: [
          {
            gender: "男",
            gender_str: "男",
          },
          {
            gender: "女",
            gender_str: "女",
          },
        ],
      },
      {
        value: 'professial_id',
        name: 'dict_name',
        valueType: 'select',
        data: configData?.PROFESSIAL || [],
        valueAlias: 'id',
      },
      {
        value: 'administrative_post_id',
        name: 'dict_name',
        valueType: 'select',
        data: configData?.ADMINISTRATIVE_POST || [],
        valueAlias: 'id',
      },
    ])
    .needToEditable([])
    .needToRules([
      'post_config_id', //质量控制职务
      'person_name', //姓名
      'gender', //性别
      'education_level', //学历
      'major_studied', //所学专业
      'technical_title', //技术职称
      'professial_id', //从事专业
      'work_years', //工作年限
      'administrative_post_id', //行政职务
    ])
    .getNeedColumns();
  cols.forEach((item: any) => (item.title = intl.formatMessage({ id: item.title })));
  return cols;
};



export const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
  return [
    <Space>
      <Button
        type="primary"
        onClick={() => {
          handleAdd({});
        }}
      >新增</Button>
    </Space>
  ];
};

