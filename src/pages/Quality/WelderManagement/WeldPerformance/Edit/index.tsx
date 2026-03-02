import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, MONITORING_STATUS_OPTIONS, MONITORING_CLASS_OPTIONS, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Select, DatePicker, InputNumber, Form, AutoComplete } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import moment from 'moment';
import FocusPaginationSelect from '@/components/CommonList/FocusSelect';
import { ConnectState } from '@/models/connect';

const { CrudEditModal } = SingleTable;

/**
 * 编辑焊工业绩
 * @param props
 * @constructor
 */
const MonitoringMeasuringEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, userList } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<any>();
  const qualifiedNumForm = Form.useWatch('qualified_num', form);
  const ndtNumForm = Form.useWatch('ndt_num', form); // 无损检测底片数量

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        {
          title: 'monitoringMeasuring.month',
          subTitle: '月份',
          dataIndex: 'month',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any) => {
            const handleChange = (_date: any, dateString: any) => {
              form.setFieldsValue({ month: moment(dateString) });
              if(dateString > 6){
                form.setFieldsValue({ year_stage: '2' });
              }else{
                form.setFieldsValue({ year_stage: '1' });
              }
            }
            return (
              <DatePicker disabled style={{ width: "100%" }} onChange={handleChange} picker="month" format='MM' />
            )
          }
        },
        "year_stage", // 阶段
        {
          title: 'compinfo.employee_code',
          subTitle: "员工编号",
          dataIndex: "employee_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const onChange = (value: any) => {
              // 根据选中的 employee_code 找到对应的完整对象
              console.log(value,"valuevalue");
              
              const selectItem = userList.find((item: any) => item.employee_code === value);
              form.setFieldsValue({
                employee_code: value,
                employment_type: selectItem.employment_type,
                team_code: selectItem.team_code,
                welder_name: selectItem.welder_name,

              });
            }
            return (
              <AutoComplete
                style={{ width: "100%" }}
                placeholder="请选择员工编号"
                onChange={onChange}
                options={userList || []}
                fieldNames={{
                  label: 'employee_name', // 显示字段
                  value: 'employee_code', // 实际值字段
                }}
                filterOption={(inputValue, option) => {
                  return option!.employee_code?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }}
              />
            )
          }
        },
        {
          title: 'compinfo.team_code',
          subTitle: "工程队编号",
          dataIndex: "team_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const onChange = (value: any) => {
              form.setFieldsValue({
                team_code: value,
              });
            }
            return (
              <AutoComplete
                style={{ width: "100%" }}
                placeholder="请选择工程队编号"
                onChange={onChange}
                options={userList || []}
                fieldNames={{
                  label: 'team_code', // 显示字段
                  value: 'team_code', // 实际值字段
                }}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option!.team_code?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )
          }
        },
        {
          title: 'compinfo.welder_name',
          subTitle: "焊工姓名",
          dataIndex: "welder_name",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const onChange = (value: any) => {
              form.setFieldsValue({
                welder_name: value,
              });
            }
            return (
              <AutoComplete
                style={{ width: "100%" }}
                placeholder="请选择焊工姓名"
                onChange={onChange}
                options={userList || []}
                fieldNames={{
                  label: 'welder_name', // 显示字段
                  value: 'welder_name', // 实际值字段
                }}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option!.welder_name?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )
          }
        },
        {
          title: 'compinfo.employment_type',
          subTitle: "用工形式",
          dataIndex: "employment_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const onChange = (value: any) => {
              form.setFieldsValue({
                employment_type: value,
              });
            }
            return (
              <AutoComplete
                style={{ width: "100%" }}
                placeholder="请选择用工形式"
                onChange={onChange}
                options={userList || []}
                fieldNames={{
                  label: 'employment_type', // 显示字段
                  value: 'employment_type', // 实际值字段
                }}
                filterOption={(inputValue, option) =>
                  // @ts-ignore
                  option!.employment_type?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )
          }
        },
        "project_name", // 工程名称
        "certificate_no", // 证件编号
        {
          title: 'wrokLicenseRegister.equipment_type',
          subTitle: "特种设备类别",
          dataIndex: "equipment_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "EQUIPMENT_TYPE", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择特种设备类别"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        {
          title: 'compinfo.welding_method_code',
          subTitle: "焊接方法代号",
          dataIndex: "welding_method_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                mode='multiple'
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "WELDING_METHOD_CODE", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择焊接方法代号"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        "welding_quantity", // 焊接数量
        "unit", // 单位（吋/米）
        {
          title: 'compinfo.ndt_num',
          subTitle: "无损检测底片数量",
          dataIndex: "ndt_num",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const handleChange = (value: any) => {
              if (qualifiedNumForm) {
                const percent = ((qualifiedNumForm / value) * 100)?.toFixed(2);
                form.setFieldsValue({
                  ndt_num: value,
                  pass_percent: percent,

                });
              }
              form.setFieldsValue({
                ndt_num: value,
              });
            }
            return (
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                onChange={handleChange}
                placeholder="无损检测底片数量"
              />
            )
          }
        },
        {
          title: 'compinfo.qualified_num',
          subTitle: "合格底片数量",
          dataIndex: "qualified_num",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const handleChange = (value: any) => {
              if(value > ndtNumForm){
                message.error('合格底片数量不能大于无损检测底片数量');
                form.setFieldsValue({
                  qualified_num: 0,
                });
                return;
              }
              if (ndtNumForm) {
                const percent = ((value / ndtNumForm) * 100)?.toFixed(2);
                form.setFieldsValue({
                  qualified_num: value,
                  pass_percent: percent,

                });
              }
              form.setFieldsValue({
                qualified_num: value,
              });
            }
            return (
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                onChange={handleChange}
                placeholder="合格底片数量"
              />
            )
          }
        },
        
        {
          title: 'compinfo.pass_percent',
          subTitle: "焊接一次合格率",
          dataIndex: "pass_percent",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <InputNumber
                min={0}
                disabled
                style={{ width: "100%" }}
                placeholder="焊接一次合格率"
              />
            )
          }
        },
        "repair_num", // 返修焊口底片数量
        {
          title: 'compinfo.material_category',
          subTitle: "材质类别",
          dataIndex: "material_category",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                mode='multiple'
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "MATERIAL_CATEGORY", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择材质类别"
                optionFilterProp={'dict_name'}

              />
            )
          }
        },
        "quality_accident", // 质量事故
      ])
      .setFormColumnToInputNumber([
        { value: 'welding_quantity', valueType: "digit", min: 0 },
        { value: 'repair_num', valueType: "digit", min: 0 },
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year', format: 'YYYY' },
        { value: 'visit_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToDisabled([
        'year_stage',
        'year',
      ])
      .setFormColumnToSelect([
        {
          value: 'year_stage', name: 'year_stage_str', valueType: 'select',
          data: [
            { year_stage: '1', year_stage_str: '上半年' },
            { year_stage: '2', year_stage_str: '下半年' },
          ] || []
        },
        {
          value: 'unit', name: 'unit_str', valueType: 'select',
          data: [
            { unit: '吋', unit_str: '吋' },
            { unit: '米', unit_str: '米' },
          ] || []
        },
        {
          value: 'quality_accident', name: 'quality_accident_str', valueType: 'select',
          data: [
            { quality_accident: '0', quality_accident_str: '无' },
            { quality_accident: '1', quality_accident_str: '有' },
          ] || []
        },
      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .needToRules([
        'year',
        'month',
        "year_stage", // 阶段
        "team_code", // 工程队编号
        "welder_name", // 焊工姓名
        "employment_type", // 用工形式
        "employee_code", // 员工编号
        "project_name", // 工程名称
        "certificate_no", // 证件编号
        'equipment_type',
        'welding_method_code',
        "welding_quantity", // 焊接数量
        "unit", // 单位（吋/米）
        "ndt_num", // 无损检测底片数量
        "qualified_num", // 合格底片数量
        "pass_percent", // 焊接一次合格率
        "repair_num", // 返修焊口底片数量
        'material_category',
        'quality_accident',

      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑焊工业绩"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: String(selectedRecord?.year),
        month: moment(),
        year_stage: String(selectedRecord?.year_stage),
        quality_accident: String(selectedRecord?.quality_accident),
      }}
      form={form}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          if(values?.qualified_num > values?.ndt_num){
            message.error('您的合格底片数量不能大于无损检测底片数量');
            return;
          }
          dispatch({
            type: "workLicenseRegister/updateWelderPerformance",
            payload: {
              ...selectedRecord,
              ...values,
              month: values?.month?.format("MM"),
              material_category: JSON.stringify(values.material_category),
              welding_method_code: JSON.stringify(values.welding_method_code),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
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

export default connect(({ workLicenseRegister }: ConnectState) => ({
  userList: workLicenseRegister.userList,
}))(MonitoringMeasuringEdit);