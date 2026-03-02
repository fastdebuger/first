import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Form, message } from "antd";
import useSysDict from "@/utils/useSysDict";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import WbsTreeSelect from "@/components/CommonList/WbsTreeSelect";

const { CrudAddModal } = SingleTable;

/**
 * 新增记分人员信息
 * @param props
 * @constructor
 */
const ScoringPersonnelAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'POSITION_GRADE','TITLE_LEVEL'",
        "Operator": "in"
      }
    ]
  })
  const [form] = Form.useForm();
  const scoring_object_type = Form.useWatch('scoring_object_type', form);


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'scoringPersonnel.unit_code',
          subTitle: "单位",
          dataIndex: "branch_comp_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => <WbsTreeSelect />
        },
        'project_name',
        'dept_name',
        'person_name',
        'gender',
        // 'birth_date',
        // 'position_level',
        // 'title_level',
        'person_code',
        'scoring_object_type',
        'scoring_score',
        'scoring_reason',
        'penalty_amount',
        "contractor_penalty_amount",

        "block_situation",
        "nature_problem",
        "problem_description",

        {
          title: 'scoringPersonnel.penalty_voucher',
          subTitle: "罚款凭证",
          dataIndex: "penalty_voucher",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/scoringPersonnel"
              handleRemove={() => form.setFieldsValue({ penalty_voucher: null })}
              onChange={(file) => {
                form.setFieldsValue({ penalty_voucher: file?.response?.url })
              }}
            />
        },
      ])
      .setFormColumnToSelect([
        // {
        //   value: 'unit_code',
        //   valueAlias: 'value',
        //   name: 'name',
        //   valueType: 'select',
        //   data: branchCompOptions
        // },
        // {
        //   value: 'project_name',
        //   valueAlias: 'name',
        //   name: 'name',
        //   valueType: 'select',
        //   data: wbsOptions
        // },
        {
          value: 'gender',
          valueType: "select",
          name: "gender",
          data: [
            {
              gender: "男"
            },
            {
              gender: "女"
            }
          ]
        },
        {
          value: 'position_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.POSITION_GRADE || [],
          valueAlias: 'id',
        },
        {
          value: 'title_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.TITLE_LEVEL || [],
          valueAlias: 'id',
        },
        {
          value: 'scoring_object_type',
          name: 'scoring_object_type_str',
          valueType: 'select',
          data: [
            {
              scoring_object_type_str: "领导干部",
              scoring_object_type: "1",
            },
            {
              scoring_object_type_str: "管理人员",
              scoring_object_type: "2",
            },
            {
              scoring_object_type_str: "岗位员工",
              scoring_object_type: "3",
            },
            {
              scoring_object_type_str: "其他（承包商、临时人员）",
              scoring_object_type: "4",
            },
          ],
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'birth_date',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
      ])
      .setFormColumnToInputNumber([
        {
          value: "penalty_amount",
          valueType: "digit"
        },
        {
          value: "scoring_score",
          valueType: "digit"
        },
        {
          value: "contractor_penalty_amount",
          valueType: "digit"
        },
      ])
      .needToRules([
        "unit_code",
        'project_name',
        'dept_name',
        'person_name',
        'gender',
        'birth_date',
        'position_level',
        'title_level',
        scoring_object_type < 4 ? 'person_code' : '',
        'scoring_object_type',
        'scoring_score',
        'scoring_reason',
        'penalty_amount',
        'contractor_penalty_amount'
        // 'penalty_voucher',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      form={form}
      title={"新增记分人员信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        // 数据值为undefined和null设置为""
        for (const key in values) {
          if (!Object.hasOwn(values, key)) continue;
          const element = values[key];
          if (element === undefined || element === null) {
            values[key] = ""
          }
        }
        return new Promise((resolve) => {
          dispatch({
            type: "scoringPersonnel/saveBatch",
            payload: {
              Items: JSON.stringify([values])
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(ScoringPersonnelAdd);
