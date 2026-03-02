import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Select } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudEditModal } = SingleTable;

/**
 * 编辑质量检查员资格证年审
 * @param props
 * @constructor
 */
const WorkLicenseRegisterEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'quality_situation',  // 质量管理情况
        'pass_percent', // 焊接一次合格率情况
        'certificate_situation', // 持证上岗情况
        {
          title: "InspectorSeniorityApply.accident_situation", // 质量事故情况(0无,1特大,2重大,3较大,4一般 ),
          dataIndex: "accident_situation",
          subTitle: "质量事故情况",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理多选框选择值变化
             */
            const handleChange = (value: any) => {
              console.log(`selected ${value}`);
              form.setFieldsValue({ accident_situation: value })

            };
            return (
              <Select
                placeholder="请选择质量事故情况"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={[
                  { value: '0', label: '无' },
                  { value: '1', label: '特大' },
                  { value: '2', label: '重大' },
                  { value: '3', label: '较大' },
                  { value: '4', label: '一般' },
                ]}
              />
            )
          }
        },
        'reward_count', // 奖励次数
        'reward_amount', // 奖励金额
        'reward_personnel', // 被奖人员
        'reward_reason', // 奖励原因
        'fine_count', // 罚款次数
        'fine_amount', // 罚款金额
        'fine_personnel', // 被罚人员
        'fine_reason', // 罚款原因

      ])
      .setSplitGroupFormColumns([
        {
          title: '奖励情况',
          columns: [
            'reward_count',
            'reward_amount',
            'reward_personnel',
            'reward_reason',
          ]
        },
        {
          title: '罚款情况',
          columns: [
            'fine_count',
            'fine_amount',
            'fine_personnel',
            'fine_reason',
          ]
        },
      ])
      .setFormColumnToInputTextArea([
        { value: 'quality_situation' },
        { value: 'pass_percent' },
        { value: 'certificate_situation' },
        { value: 'reward_reason' },
        { value: 'fine_reason' },

      ])
      .setFormColumnToInputNumber([
        { value: 'reward_count', valueType: 'digit', min: 0 },
        { value: 'reward_amount', valueType: 'digit', min: 0 },
        { value: 'fine_count', valueType: 'digit', min: 0 },
        { value: 'fine_amount', valueType: 'digit', min: 0 },
      ])

      .needToRules([
        'quality_situation',
        'pass_percent',
        'certificate_situation',
        'reward_count',
        'reward_amount',
        'reward_personnel',
        'reward_reason',
        'fine_count',
        'fine_amount',
        'fine_personnel',
        'fine_reason',
        'accident_situation',
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
      title={formatMessage({ id: 'base.user.list.edit' }) + formatMessage({ id: 'InspectorAnnualAudit' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        apply_major: selectedRecord.apply_major?.split(','),
        // job_resume: selectedRecord.job_resume ? JSON.parse(selectedRecord.job_resume) : []
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
        };
        /**
         * 创建一个Promise实例
         */
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateInspectorAnnualAudit",
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
