import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Select, message } from "antd";
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';


const { CrudEditModal } = SingleTable;

/**
 * 编辑计量人员资格申请表
 * @param props
 * @constructor
 */
const PersonnelApplyFormEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  // 监控人状态
  const [userMonitor,setUserMonitor] = useState<any>(null);
  // 维护人员状态
  const [userMaintainer,setUserMaintainer] = useState<any>(selectedRecord.maintainer ? selectedRecord.maintainer_names.split(',') : []); 
  /**
    * 表单列配置引用columns文件
    * @returns 返回一个数组
    */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "lab_full_name", // 试验室名称
        'qualification', // 资质名称
        'qualification_date', // 资质到期时间
        "province_name",
        "city_name",
        "address",
        "lab_nature", // 外委实验室的性质
        'qualification_scope', // 资质范围
        'entrusted_projects', // 拟委托实验项目
        'evaluation_date', // 评价日期
        {
          title: "wrokLicenseRegister.monitor",
          subTitle: "监控人",
          dataIndex: "monitor",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType={'user/queryUserInfoInclude'}
                value={userMonitor}
                onChange={setUserMonitor}
                payload={{
                  sort: 'user_code',
                  order: 'desc',
                }}
              />
            )
          }
        },
        {
          title: "wrokLicenseRegister.maintainer",
          subTitle: "维护人员",
          dataIndex: "maintainer",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                mode="multiple"
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType={'user/queryUserInfoInclude'}
                value={userMaintainer}
                onChange={setUserMaintainer}
                payload={{
                  sort: 'user_code',
                  order: 'desc',
                }}
              />
            )
          }
        },

        'monitoring_status', // 监控状态
        'remark', // 备注
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
      .setFormColumnToSelect([
        {
          value: 'monitoring_status', name: 'monitoring_status_str', valueType: 'select', data: [
            { monitoring_status: '1', monitoring_status_str: '在用' },
            { monitoring_status: '2', monitoring_status_str: '新增' },
            { monitoring_status: '3', monitoring_status_str: '闲置' },
          ]
        },
      ])
      .setFormColumnToInputTextArea([
        { value: 'remark' }
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToDatePicker([
        { value: 'evaluation_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .setFormColumnToInputNumber([
        { value: 'phone', valueType: 'digit', min: 0 },
      ])

      .needToDisabled([
        "lab_full_name", // 试验室名称
        'qualification', // 资质名称
        'qualification_date', // 资质到期时间
        "province_name",
        "city_name",
        "address",
        "lab_nature", // 外委实验室的性质
        'qualification_scope', // 资质范围
        'entrusted_projects', // 拟委托实验项目
        'evaluation_date', // 评价日期

      ])
      .needToRules([
        'maintainer',
        'monitor', // 监控人
        'monitoring_status', // 监控状态
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
      title={"编辑外委实验室资质台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        monitoring_status: selectedRecord.monitoring_status + '',
        monitor: selectedRecord.monitor_name,
        maintainer: selectedRecord.maintainer_names ? selectedRecord.maintainer_names.split(',') : [],
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateExternalLaboratory",
            payload: {
              ...selectedRecord,
              ...values,
              buss_id: selectedRecord.buss_id,
              maintainer: values.maintainer ? values.maintainer.join(',') : null,
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

export default connect()(PersonnelApplyFormEdit);
