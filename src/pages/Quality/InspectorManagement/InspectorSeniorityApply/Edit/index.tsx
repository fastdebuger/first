import React, { useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Select } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import MultiDynamicForms from "@/components/MultiDynamicForms";

const { CrudEditModal } = SingleTable;

/**
 * 编辑年度生产计划
 * @param props
 * @constructor
 */
const WorkLicenseRegisterEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [modeValue, setModeValue] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'name', // 姓名
        {
          title: "InspectorSeniorityApply.gender",
          dataIndex: "gender",
          subTitle: "性别",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理性别选择框选择值的变化
             */
            const handleChange = (value: any) => {
              form.setFieldsValue({ gender: value })
            };
            return (
              <Select
                placeholder="请选择性别"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={[
                  { value: '男', label: '男' },
                  { value: '女', label: '女' },
                ]}
              />
            )
          }
        },
        'birth_date', // 出生日期
        'job', // 职务,
        'job_title', // 职称,
        'work_date', // 参加工作时间,
        'education', // 文化程度,
        'graduation_school', // 毕业院校,
        'major', // 所学专业,
        'related_work_date', // 从事质检或相关工作时间,
        {
          title: "InspectorSeniorityApply.apply_major",
          dataIndex: "apply_major",
          subTitle: "申请检查专业",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理多选框选择值变化
             */
            const handleChange = (value: any) => {
              // 申请检查专业只能选择 两个值，传多了后台会报错
              if (value.length <= 2) {
                setModeValue(value);
                form.setFieldsValue({ apply_major: value });
              } else {
                // 如果超过两个，截取前两个
                const limitedValue = value.slice(0, 2);
                form.setFieldsValue({ apply_major: limitedValue });
                setErrorMessage('申请检查专业只能选择两个值');
              }
            };
            return (
              <>
                <Select
                  mode="multiple"
                  value={modeValue || selectedRecord.apply_major.split(',')}
                  placeholder="请选择申请检查专业"
                  onChange={handleChange}
                  style={{ width: '100%' }}
                  options={[
                    { value: '土建', label: '土建' },
                    { value: '安装', label: '安装' },
                    { value: '电气', label: '电气' },
                    { value: '仪表', label: '仪表' },
                    { value: '材料检验', label: '材料检验' },
                  ]}
                />
                {errorMessage && (
                  <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                    {errorMessage}
                  </div>
                )}
              </>

            )
          }
        },
        {
          title: "", // InspectorSeniorityApply.job_resume
          dataIndex: "job_resume",
          subTitle: "工作简历",
          width: 1500,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <MultiDynamicForms
                name="job_resume"
                required={false}
                initialValue={{}}
              />
            )
          }
        },

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
        {
          title: "InspectorSeniorityApply.picture_url",
          dataIndex: "picture_url",
          subTitle: "个人照片",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".png,.jpg,.jpeg"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/WorkLicenseRegister"
                handleRemove={() => {
                  form.setFieldsValue({ picture_url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ picture_url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      .setSplitGroupFormColumns([
        {
          title: '工作简历',
          columns: ['job_resume']
        },
        {
          title: '附件',
          columns: ['url', 'picture_url'],
        }
      ])
      .setFormColumnToSelfColSpan([
        { value: 'job_resume', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'related_work_date', colSpan: 8, labelCol: { span: 14 }, wrapperCol: { span: 10 }, showLabel: false },
      ])
      .setFormColumnToInputNumber([
        { value: 'related_work_date', min: 0, valueType: 'digit' },
      ])
      .setFormColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'work_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .needToRules([
        'name', // 姓名
        'gender', // 性别
        'birth_date', // 出生日期
        'job', // 职务,
        'job_title', // 职称,
        'work_date', // 参加工作时间,
        'education', // 文化程度,
        'graduation_school', // 毕业院校,
        'major', // 所学专业,
        'related_work_date', // 从事质检或相关工作时间,
        'apply_major', // 申请检查专业(土建/安装/ 电气/仪表/材料检验),
        'job_resume', // 工作简历,
        'url',
        'picture_url', // 个人照片
      ])
      .getNeedColumns();
    cols.forEach((item: any) => {
      if (item.title) {
        item.title = formatMessage({ id: item.title })

      }
    });
    return cols;
  };

  return (
    <CrudEditModal
      title={formatMessage({ id: 'base.user.list.edit' }) + formatMessage({ id: 'InspectorSeniorityApply' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        apply_major: selectedRecord?.apply_major?.split(','),
        job_resume: selectedRecord.job_resume ? JSON.parse(selectedRecord.job_resume) : []
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
          apply_major: values.apply_major.join(','),
          job_resume: JSON.stringify(values.job_resume),
        };
        /**
         * 创建一个Promise实例
         */
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateInspectorApplication",
            payload,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("修改成功");
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

export default connect()(WorkLicenseRegisterEdit);
