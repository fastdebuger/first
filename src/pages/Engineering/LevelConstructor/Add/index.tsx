import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Select } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudAddModal } = SingleTable;

/**
 * 新增一级建造师
 * @param props
 * @constructor
 */
const WorkLicenseRegisterAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  // 获取省份列表
  const [provinceList, setProvinceList] = useState<any>([]);
  // 获取城市列表
  const [cityList, setCityList] = useState<any>([]);

  const fecthCityList = (provinceCode: string) => {
    dispatch({
      type: 'workLicenseRegister/getAllAreaDict',
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'parent_id', Val: provinceCode, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const newRes = res.rows.map((item: any) => {
            return {
              value: item.id,
              label:item.dict_name
            }
          })
          setCityList(newRes || []);
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'workLicenseRegister/getAllAreaDict',
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'level', Val: '2', Operator: '=' },
          { Key: 'parent_id', Val: '10', Operator: '<' },
        ]),
      },
      callback: (res: any) => {
        if(res.rows && res.rows.length > 0){
          const newRes = res.rows.map((item: any) => {
            return {
              value: item.id,
              label:item.dict_name
            }
          })
          setProvinceList(newRes || []);
        }
      }
    });
  },[])
   /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'name', // '姓名',
        'employee_number', // '员工编号',
        'id_card', // '证件号',
        {
          title: "levelConstructor.province_id",
          subTitle: "省份",
          dataIndex: "province_id",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => { 
            return <Select
              options={provinceList || []}
              placeholder="请选择省份"
              showSearch
              onChange={(value) => {
                fecthCityList(value); 
                form.setFieldsValue({
                  province_id: value,
                  city_id: null
                });
              }}
              filterOption={(input, opt) => {
                // @ts-ignore
                return (opt?.label || '').toLowerCase().includes(input.toLowerCase());
              }}
              
            />;
          },
        },
        {
          title: "levelConstructor.city_id",
          subTitle: "地市",
          dataIndex: "city_id",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => { 
            return <Select
              options={cityList || []}
              placeholder="请选择地市"
              showSearch
              onChange={(value) => {
                form.setFieldsValue({
                  city_id: value,
                });
              }}
              filterOption={(input, opt) => {
                // @ts-ignore
                return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              
            />;
          },
        },
        'company', // '注册企业',
        'major', // '注册专业',
        'register_date_start', // '注册有效期开始',
        'register_date_end', // '注册有效期结束',
        'registration_number', // '注册编号',
        'use_date_start', // '使用有效期（起始）',
        'use_date_end', // '使用有效期（截止）',
        'remark', // '备注',

        {
          title: "contract.file_url",
          dataIndex: "url",
          subTitle: "附件",
          width: 300,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/levelConstructor"
                handleRemove={() => {
                  form.setFieldsValue({ url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      
      .setFormColumnToInputTextArea([
        { value: 'remark' },
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToDatePicker([
        { value: 'register_date_start', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'register_date_end', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'use_date_start', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'use_date_end', valueType: 'dateTs',needValueType: 'timestamp' },
      ])
      .needToDisabled([
        'company'
      ])
      .needToHide([
        'project_id',
        'contract_start_date',
        'contract_end_date',
      ])
      .needToRules([
        'name', // '姓名',
        'employee_number',
        'id_card', // '证件号',
        'province_id', // '省份id',
        'city_id', // '市id',
        'company', // '注册企业',
        'major', // '注册专业',
        'register_date_start', // '注册有效期开始',
        'register_date_end', // '注册有效期结束',
        'registration_number', // '注册编号',
        'use_date_start', // '使用有效期（起始）',
        'use_date_end', // '使用有效期（截止）',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={formatMessage({ id: 'base.user.list.add' })+formatMessage({ id: 'levelConstructor' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        company: '中国石油天然气第一建设有限公司'
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addAConstructionDivision",
            payload: {
              ...values,
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

export default connect()(WorkLicenseRegisterAdd);