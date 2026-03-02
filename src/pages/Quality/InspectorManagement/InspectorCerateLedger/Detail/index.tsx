import React, {  } from "react";
import { Button } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { configColumns } from "../columns";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 作业许可证登记表详情
 * @param props
 * @constructor
 */
const InspectorSeniorityApplyDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord } = props;
  const { formatMessage } = useIntl();
  
  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'sub_comp_code',
      'dep_code',
      'name',
      'gender', // 性别
      'birth_date', // 出生日期
      'work_date', // 参加工作时间
      'education', // 文化程度
      'major', // 所学专业
      'job_title', // 职称
      'apply_major', // 申请检查专业
      'certificate_number', // 证号
      'issue_date', // 取证时间
      'annual_audit_date', // 年审时间
      'job_nature_str', // 专职/兼职
      'is_on_duty_str', // 是否在岗
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name'
    ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [];
  };

  
  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="name"
        title={formatMessage({ id: 'InspectorSeniorityApply' }) + formatMessage({ id: 'base.user.list.detail' })}
        columns={getTableColumns()}
        open={visible}
        onClose={onCancel}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />

    </>
  );
};

export default connect()(InspectorSeniorityApplyDetail);
