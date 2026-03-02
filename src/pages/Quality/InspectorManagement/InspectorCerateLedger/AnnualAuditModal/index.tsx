import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect, history, useLocation } from "umi";
import { ErrorCode, ACCIDENT_STATUS_OPTIONS_MAP } from "@/common/const";
import { message, Select, Input, Modal } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 新增质量检查员资格证年审
 * @param props
 * @constructor
 */
const AnnualAuditModal: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel,selectedRecord, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const { TextArea } = Input;
  const [currentRoute,setCurrentRoute] = useState<any>('');
  
  const location: any = useLocation();
  useEffect(() => {
    if (location?.pathname) {
      const fullPath = location?.pathname;
      // 获取 /dep/quality/inspectorManagement/ 这部分路由去掉最后的路径
      const parentPath = fullPath.split('/').slice(0, -1).join('/') + '/';
      setCurrentRoute(parentPath || '');
    }
  }, [location?.pathname])
   /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'sub_comp_name',
        'dep_name',
        'name',
        'gender',
        'birth_date',
        'job',
        'job_title',
        'work_date',
        'education',
        'graduation_school',
        'major',
        'related_work_date',
        'apply_major',
        // 'quality_situation',  // 质量管理情况
        'pass_percent', // 焊接一次合格率情况
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
              form.setFieldsValue({ accident_situation: value })
            };
            return (
              <Select
                placeholder="请选择质量事故情况"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={ACCIDENT_STATUS_OPTIONS_MAP || []}
              />
            )
          }
        },
        {
          title: "InspectorSeniorityApply.quality_situation",
          dataIndex: "quality_situation",
          subTitle: "质量管理情况",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const handleChange = (e: any) => {
              form.setFieldsValue({ quality_situation: e.target.value })
            };
            return (
              <TextArea rows={4} onChange={handleChange} showCount={true} maxLength={1024} />
            )
          }
        },
        {
          title: "InspectorSeniorityApply.certificate_situation",
          dataIndex: "certificate_situation",
          subTitle: "持证上岗情况",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const handleChange = (e: any) => {
              form.setFieldsValue({ certificate_situation: e.target.value })
            };
            return (
              <TextArea rows={4} onChange={handleChange} showCount={true} maxLength={1024} />
            )
          }
        },
        'reward_count', // 奖励次数
        'reward_amount', // 奖励金额
        'reward_personnel', // 被奖人员
        {
          title: "InspectorSeniorityApply.reward_reason",
          dataIndex: "reward_reason",
          subTitle: "奖励原因",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const handleChange = (e: any) => {
              form.setFieldsValue({ reward_reason: e.target.value })
            };
            return (
              <TextArea rows={4} onChange={handleChange} showCount={true} maxLength={1024} />
            )
          }
        },
        'fine_count', // 罚款次数
        'fine_amount', // 罚款金额
        'fine_personnel', // 被罚人员
        {
          title: "InspectorSeniorityApply.fine_reason",
          dataIndex: "fine_reason",
          subTitle: "罚款原因",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const handleChange = (e: any) => {
              form.setFieldsValue({ fine_reason: e.target.value })
            };
            return (
              <TextArea rows={4} onChange={handleChange} showCount={true} maxLength={1024} />
            )
          }
        },
        
      ])
      .setSplitGroupFormColumns([
        {
          title: '质量信息',
          columns: [
            'quality_situation',
            'pass_percent',
            'accident_situation',
            'certificate_situation',
          ]
        },
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
      .setFormColumnToSelfColSpan([
        { value: 'accident_situation', colSpan: 16, labelCol: { span: 4 }, wrapperCol: { span: 8 } },
      ])
      .setFormColumnToInputNumber([
        { value: 'reward_count', valueType: 'digit', min: 0 },
        { value: 'pass_percent', valueType: 'digit', min: 0 },
        { value: 'reward_amount', valueType: 'digit', min: 0 },
        { value: 'fine_count', valueType: 'digit', min: 0 },
        { value: 'fine_amount', valueType: 'digit', min: 0 },
      ])
      .needToDisabled([
        'sub_comp_name',
        'dep_name',
        'name',
        'gender',
        'birth_date',
        'job',
        'job_title',
        'work_date',
        'education',
        'graduation_school',
        'major',
        'related_work_date',
        'apply_major',
      ])
      .setFormColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'work_date', valueType: 'dateTs',needValueType: 'timestamp' },
        { value: 'related_work_date', valueType: 'dateTs',needValueType: 'timestamp' },
      ])
      .needToRules([
        'quality_situation',
        'pass_percent',
        'certificate_situation',
        'accident_situation',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => {
      if(item.title){
        item.title = formatMessage({ id: item.title })
      }
    }
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={'发起'+formatMessage({ id: 'InspectorAnnualAudit' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        apply_major: selectedRecord?.apply_major?.split(','),
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addInspectorAnnualAudit",
            payload: {
              ...selectedRecord,
              ...values,
              apply_major: values.apply_major.join(','),
              inspector_id: selectedRecord.id,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                setTimeout(() => {
                  callbackSuccess();
                  Modal.success({
                    title: '成功',
                    content: '年审发起成功，是否跳转到审批页面？',
                    okText: '确定',
                    onOk: () => {
                      // 用户点击确定后跳转到审批页面
                      history.push({
                        pathname: `${currentRoute}inspectorAnnualAudit`,
                      });
                    },
                  });
                }, 1000);
              }
            },
          });
        });

      }}
    />
      
  );
};

export default connect()(AnnualAuditModal);