import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode,MONITORING_STATUS_OPTIONS,MONITORING_CLASS_OPTIONS, HUA_WEI_OBS_CONFIG, QUALITY_CHECK_STATUS_OPTIONS, AFFILIATED_UNIT_OPTIONS } from "@/common/const";
import { Select, message, DatePicker, Form } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import moment from "moment";
const { CrudAddModal } = SingleTable;

/**
 * 新增监视和测量设备登记表
 * @param props
 * @constructor
 */
const MonitoringMeasuringAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  // 监听是否一次性字段
  const isDisposable = Form.useWatch('is_disposable', form);
  // 监听状态字段
  const measuringStatus = Form.useWatch('status', form);

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    let measuringColumns = [];
    // 当测量状态为7（转移）时，将'transfer_to'列添加到测量列数组中
    if (Number(measuringStatus) === 7) {
      measuringColumns.push('transfer_to')
    }
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        {
          title: 'monitoringMeasuring.month',
          subTitle: '月份',
          dataIndex: 'month',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (_date: any, dateString: any) => {
              form.setFieldsValue({ month: moment(dateString) });
            }
            return (
              <DatePicker style={{ width: "100%" }} onChange={handleChange} picker="month" format='MM' />
            )
          }
        },
        'name',
        'spec_model',
        'factory_no',
        'manufacturer',
        'accuracy_grade',
        'measurement_range',
        {
          title: 'monitoringMeasuring.is_disposable',
          subTitle: '是否一次性',
          dataIndex: 'is_disposable',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ is_disposable: value })
            }
            return (
              <Select 
                placeholder="请选择是否一次性"
                style={{ width: '100%' }}
                onChange={handleChange}
                options={QUALITY_CHECK_STATUS_OPTIONS || []}
              />
              
            )
          }
        },
        'verification_cycle', // 检定周期（月）
        'verification_date', // 检定日期
        'valid_date', // 有效日期
        'verification_result',
        'verification_unit', // 检定单位
        'use_unit',
        'keeper',
        // 'professional_class', // 专业分类：(1长度 / 2热工 / 3力学 / 4电磁 / 5其它),
        {
          title: 'monitoringMeasuring.professional_class',
          subTitle: '专业分类',
          dataIndex: 'professional_class',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ professional_class: value })
            }
            return (
              <Select 
                placeholder="请选择专业分类"
                style={{ width: '100%' }}
                onChange={handleChange}
                options={MONITORING_CLASS_OPTIONS || []}
              />
            )
          }
        },
        {
          title: 'monitoringMeasuring.category',
          subTitle: '类别',
          dataIndex: 'category',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ category: value })
            }
            return (
              <Select 
                placeholder="请选择类别"
                style={{ width: '100%' }}
                onChange={handleChange}
                options={[
                  { value: '1', label: 'A' },
                  { value: '2', label: 'B' },
                  { value: '3', label: 'C' },
                  
                ]}
              />
              
            )
          }
        },
        {
          title: 'monitoringMeasuring.status',
          subTitle: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ status: value })
            }
            return (
              <Select 
                placeholder="请选择状态"
                disabled
                style={{ width: '100%' }}
                onChange={handleChange}
                options={MONITORING_STATUS_OPTIONS || []}
              />
            )
          }
        },
        ...measuringColumns,
        {
          title: 'monitoringMeasuring.affiliated_unit',
          subTitle: '所属单位',
          dataIndex: 'affiliated_unit',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ affiliated_unit: value })
            }
            return (
              <Select 
                placeholder="请选择所属单位"
                style={{ width: '100%' }}
                  onChange={handleChange}
                  options={AFFILIATED_UNIT_OPTIONS || []}
              />
              
            )
          }
        },
        {
          title: 'monitoringMeasuring.safety_protection',
          subTitle: '安全防护',
          dataIndex: 'safety_protection',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (value: string) => {
              form.setFieldsValue({ safety_protection: value })
            }
            return (
              <Select 
                placeholder="请选择安全防护"
                style={{ width: '100%' }}
                  onChange={handleChange}
                  options={QUALITY_CHECK_STATUS_OPTIONS || []}
              />
            )
          }
        },
        'remark',
        {
          title: "contract.file_url",
          dataIndex: "url",
          subTitle: "附件",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/WorkLicenseRegister"
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
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
        { value: 'verification_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'valid_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToInputNumber([
        { value: 'project_in_progress_count', valueType: 'digit', min: 0 },
        { value: 'verification_cycle', valueType: 'digit', min: 0 },
        { value: 'mechanical_completion_count', valueType: 'digit', min: 0 },
        { value: 'production_project_count', valueType: 'digit', min: 0 },
      ])
       .setFormColumnToSelect([
        { value: 'verification_result', valueType: 'select', name: 'verification_result_str',data: [
          { verification_result: '0', verification_result_str: '不合格' },
          { verification_result: '1', verification_result_str: '合格' },
        ]}
      ])
      // 是一次性字段的话 则禁用对应的字段
      .needToDisabled(Number(isDisposable) === 1 ? [
        'verification_cycle', // 检定周期（月）
        // 'verification_date', // 检定日期
        'valid_date', // 有效日期
        // 'verification_result',
        // 'verification_unit'
      ] : [])
      .needToRules([
        'year',
        'month',
        'name',
        'spec_model',
        'factory_no',
        'manufacturer',
        'accuracy_grade',
        'measurement_range',
        'is_disposable',
        'use_unit',
        'keeper',
        'professional_class',
        'category',
        'status',
        'transfer_to',
        'affiliated_unit',
        'safety_protection',
        'url',

        'verification_date', // 
        'verification_result', // 检定结果
        'verification_unit', 
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增"+formatMessage({ id: "monitoringMeasuring" })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        status: '1',
        year: String(new Date().getFullYear()),
        month: moment(),
      }}
      form={form}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addMeasureDevice",
            payload: {
              ...values,
              month: values?.month?.format("MM"),
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

export default connect()(MonitoringMeasuringAdd);
