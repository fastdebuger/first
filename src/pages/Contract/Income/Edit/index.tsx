import React, { useEffect, useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { InputNumber, message } from 'antd';
import type { ConnectState } from '@/models/connect';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

import useSysDict from '@/utils/useSysDict';
import { getProjectLevel } from '@/utils/utils';
const { CrudAddModal } = SingleTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  selectedRecord: any
}

const IncomeEdit: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    selectedRecord
  } = props;

  const [OwnerName, setOwnerName] = useState();
  const [OwnerUnitName, setOwnerUnitName] = useState();
  const [priceLevelConfig, setPriceLevelConfig] = useState<null | any[]>(null)

  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'OWNER_GROUP','CONTRACT_MODE','BIDDING_MODE','VALUATION_MODE','PROJECT_LEVEL','REVENUE_METHOD','CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE','PROJECT_CATEGORY','SPECIALTY_TYPE'",
        "Operator": "in"
      }
    ]
  })

  const { formatMessage } = useIntl();

  useEffect(() => {
    dispatch({
      type: "income/getPriceLevel",
      payload: {
        filter: JSON.stringify([]),
        order: 'desc',
        sort: 'id',
      },
      callback: (res: { errCode: number; rows: any }) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const flatData = res.rows;
          setPriceLevelConfig(flatData);
        } else {
          setPriceLevelConfig(null);
        }
      },
    });
  }, [])

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "wbs_code",
        "contract_no",
        "user_code",
        "owner_name",
        "owner_group",
        "owner_unit_name",
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode",
        "bidding_mode",
        "valuation_mode",
        "contract_start_date",
        "contract_end_date",
        {
          title: 'contract.contract_say_price',
          dataIndex: 'contract_say_price',
          width: 160,
          subTitle: '合同含税金额(元)',
          align: 'center',
          renderSelfForm(form) {
            return (
              <InputNumber
                placeholder='请输入合同含税金额(元)'
                style={{ width: "100%" }}
                min={0}
                precision={2}
                onChange={() => {
                  const projectLevel = getProjectLevel(form.getFieldsValue(), priceLevelConfig!)
                  if (projectLevel) {
                    const id = configData?.PROJECT_LEVEL?.find(o => o.dict_name === projectLevel)?.id
                    form.setFieldsValue({
                      project_level: id ? String(id) : ""
                    })
                  }
                }}
              />
            )
          }
        },
        {
          title: 'contract.contract_un_say_price',
          dataIndex: 'contract_un_say_price',
          width: 160,
          subTitle: '合同不含税金额(元)',
          align: 'center',
          renderSelfForm() {
            return (
              <InputNumber
                placeholder='请输入合同不含税金额(元)'
                style={{ width: "100%" }}
                min={0}
                precision={2}
              />
            )
          }
        },
        // "contract_un_say_price",
        "contract_sign_date",
        "project_level",
        "project_category",
        "specialty_type",
        "revenue_method",
        {
          title: 'contract.scanning_file_url',
          subTitle: "合同扫描件",
          dataIndex: "file_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              handleRemove={() => form.setFieldsValue({ file_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ file_url: file?.response?.url })
              }}
            />
        },
        {
          title: 'contract.others_file_url', // 附件标题
          subTitle: "其他附件", // 副标题
          dataIndex: "others_file_url", // 数据索引
          width: 160, // 列宽
          align: 'center', // 对齐方式
          renderSelfForm: (form: any) => // 自定义表单渲染
            <HuaWeiOBSUploadSingleFile // 华为 OBS 上传组件
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE} // 系统路径
              limitSize={100} // 文件大小限制
              folderPath="/Contract/Income" // 存储文件夹路径
              accept=".doc,.docx,.xls,.xlsx,.pdf" // 允许的文件类型
              handleRemove={() => form.setFieldsValue({ others_file_url: null })} // 删除文件时清空表单值
              onChange={(file) => { // 文件上传成功后更新表单值
                form.setFieldsValue({ others_file_url: file?.response?.url })
              }}
            />
        },
        "remark",
        "relative_person_code",
      ])
      .setSplitGroupFormColumns([
        {
          title: '项目信息',
          order: 1,
          columns: [
            "branch_comp_code",
            "dep_code",
            "user_code",
            "owner_name",
            "owner_group",
            "owner_unit_name",
            "project_location",
            "contract_mode",
            "project_level",
            "project_category",
            "specialty_type",
            "wbs_code",
            "revenue_method",
          ]
        },
        {
          title: '合同基础信息',
          order: 2,
          columns: [
            "contract_no",
            "contract_name",
            "scope_fo_work",
            "bidding_mode",
            "valuation_mode",
            "contract_sign_date",
            "contract_start_date",
            "contract_end_date",
            "relative_person_code",
          ]
        },
        {
          title: '合同金额信息',
          order: 3,
          columns: [
            "contract_say_price",
            "contract_un_say_price",
          ]
        },
        {
          title: '其他',
          order: 4,
          columns: [
            "scope_fo_work",
            "remark",
          ]
        },
        {
          title: '附件',
          order: 5,
          columns: [
            "file_url",
            "others_file_url",
          ]
        }
      ])
      .setFormColumnToInputNumber([
        // { value: 'contract_say_price', valueType: 'digit' },
        // { value: 'contract_un_say_price', valueType: 'digit' }
      ])
      .setFormColumnToDatePicker([
        {
          value: 'contract_start_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
        {
          value: 'contract_end_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
        {
          value: 'contract_sign_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
      ])
      .setFormColumnToSelect([
        {
          value: 'owner_group',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.OWNER_GROUP || [],
          valueAlias: 'id',
          onChange(value, selectedOption, form) {
            const str: string = selectedOption?.[0]?.value;
            if (str.endsWith("集团内")) {
              const id = configData?.REVENUE_METHOD?.find(o => o.dict_name === '产出法')?.id
              form.setFieldsValue({
                revenue_method: id ? String(id) : ""
              })
            }
            if (str.endsWith("集团外")) {
              const id = configData?.REVENUE_METHOD?.find(o => o.dict_name === '投入法')?.id
              form.setFieldsValue({
                revenue_method: id ? String(id) : ""
              })
            }
            form.setFieldsValue({
              contract_say_price: "",
              project_level: ""
            })
          },
        },
        {
          value: 'bidding_mode',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.BIDDING_MODE || [],
          valueAlias: 'id',
        },
        {
          value: 'contract_mode',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.CONTRACT_MODE || [],
          valueAlias: 'id',
          onChange(value, selectedOption, form) {
            form.setFieldsValue({
              contract_say_price: "",
              project_level: ""
            })
          },
        },
        {
          value: 'project_category',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PROJECT_CATEGORY || [],
          valueAlias: 'id',
        },
        {
          value: 'specialty_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.SPECIALTY_TYPE || [],
          valueAlias: 'id',
        },
        {
          value: 'project_level',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PROJECT_LEVEL || [],
          valueAlias: 'id',
        },
        {
          value: 'revenue_method',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.REVENUE_METHOD || [],
          valueAlias: 'id',
        },
        {
          value: 'valuation_mode',
          name: 'dict_name',
          valueType: "multiple",
          data: configData?.VALUATION_MODE || [],
          valueAlias: 'id',
        },
      ])
      .setFormColumnToAutoComplete([
        {
          value: 'owner_name',
          data: OwnerName
        },
        {
          value: 'owner_unit_name',
          data: OwnerUnitName
        }
      ])
      .setFormColumnToInputTextArea([
        {
          value: "scope_fo_work",
        },
        {

          value: "remark",
        }
      ])
      .needToDisabled([
        "revenue_method"
      ])
      .needToRules([
        "wbs_code",
        "user_code",
        "owner_name",
        "owner_group",
        "owner_unit_name",
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode",
        "bidding_mode",
        "valuation_mode",
        "contract_start_date",
        "contract_end_date",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date",
        "project_level",
        "project_category",
        "specialty_type",
        "revenue_method",
        'file_url',
        // "relative_person_code",
        {
          value: 'relative_person_code',
          rules: [{
            required: true,
            validator: (_: any, value: any) => {
              if (!value) {
                return Promise.reject(new Error("这是必填项"));
              }
              if (!/^[A-Za-z0-9]{10}$/.test(value)) {
                return Promise.reject(new Error('编码格式不正确，请输入10位数字或字母组合'));
              }
              return Promise.resolve();
            }
          }]
        },
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };


  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'contractBasic/getOwnerName',
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([])
        },
        callback(res) {
          setOwnerName(res.rows.map(o => ({ value: o.owner_name })))

        },
      });

      dispatch({
        type: 'contractBasic/getOwnerUnitName',
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([])
        },
        callback(res) {
          setOwnerUnitName(res.rows.map(o => ({ value: o.owner_unit_name })))
        },
      });

    }
  }, [])
  return (
    <CrudAddModal
      title={'编辑收入合同台账'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        specialty_type: String(selectedRecord.specialty_type),
        valuation_mode: selectedRecord?.valuation_mode?.split(",")
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        // 判断valuation_mode是不是数组，如果是数组转换成字符串
        if (values?.valuation_mode && Array.isArray(values?.valuation_mode)) {
          values.valuation_mode = values?.valuation_mode?.join(",")
        }

        const { contract_start_date, contract_sign_date } = values;

        // 签订时间必须在合同开工时间之前
        if (contract_sign_date > contract_start_date) {
          message.error("【合同开工日期】不能早于【合同签订日期】")
          return new Promise(resolve => resolve(true))
        }

        return new Promise((resolve) => {
          dispatch({
            type: 'income/updateIncomeInfo',
            payload: {
              ...selectedRecord,
              ...values,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('编辑成功');
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(IncomeEdit);
