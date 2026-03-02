import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG, CURR_USER_NAME } from "@/common/const";
import { message, DatePicker } from "antd";
import { convertMomentToTimestamp } from "@/utils/utils-date";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import FocusSelect from "@/components/CommonList/FocusSelect";

const { CrudAddModal } = SingleTable;

/**
 * 新增作业许可证登录表
 * @param props
 * @constructor
 */
const WorkLicenseRegisterAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

   /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // 作业许可证编号
        'work_permit_code',
        {
          title: "wrokLicenseRegister.work_content",
          subTitle: "作业内容名称",
          dataIndex: "work_content",
          width: 160,
          align: "center",
          renderSelfForm: (form: any, dataSource: any) => {
            return (
              <FocusSelect
                fetchType='contractBasic/getSysDict' 
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "WORK_NAME", "Operator": "=" }]),
                }}
                optionFilterProp={'dict_name'} 
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择作业内容名称"
                form={form}
                fieldName="work_content"
              />
            )
          }
        },
        // 作业地点
        'work_location',
        {
          title: "wrokLicenseRegister.start_time",
          subTitle: "作业开始时间",
          dataIndex: "start_time",
          width: 160,
          align: "center",
          renderSelfForm: (_form: any) => {
            return (
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                showTime
                placeholder="请选择作业开始时间"
              />
            )
          }
        },
        {
          title: "wrokLicenseRegister.end_time",
          subTitle: "作业结束时间",
          dataIndex: "end_time",
          width: 160,
          align: "center",
          renderSelfForm: (_form: any) => {
            return (
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                showTime
                placeholder="请选择作业结束时间"
              />
            )
          }
        },
        // 作业批准人
        'approver',
        // 作业监护人
        'guardian',
        // 记录人
        'recorder',
        // 备注
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
      
      .setFormColumnToInputTextArea([
        { value: 'remark'},
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .needToDisabled(['recorder'])
      .needToRules([
        'work_permit_code',
        'work_content', // 作业内容
        'work_location',
        'start_time',
        'end_time',
        'approver',
        'guardian',
        'recorder',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={formatMessage({ id: 'base.user.list.add' })+formatMessage({ id: 'wrokLicenseRegister' })}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        recorder: CURR_USER_NAME
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        /**
         * convertMomentToTimestamp 函数会将moment 对象 =》 0时区时间戳
         * 后台要求 只传递到分的时间 所以这里只能自定义时间选择器
         */
        const payload = {
          ...values,
          start_time: convertMomentToTimestamp(values.start_time),
          end_time: convertMomentToTimestamp(values.end_time),
          wbs_code: localStorage.getItem('auth-default-wbsCode'),
        };

        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addWorkPermit",
            payload,
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
