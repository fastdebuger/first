import React, { useState, useMemo } from "react";
import { Button, message, Modal, Space, Table, Tabs } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import {hasPermission} from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import PersonnelApplyFormEdit from "../Edit";
import { configColumns } from "../columns";
import OutsourcedLedgerAudit from "./OutsourcedLedgerAudit";
import RelevantQualifica from "./RelevantQualifica";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 计量人员资格申请表详情
 * @param props
 * @constructor
 */
const PersonnelApplyFormDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, callbackSuccess, authority } = props;
  const { formatMessage } = useIntl();
  // 用于控制编辑状态
  const [editVisible, setEditVisible] = useState(false);
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "lab_full_name", // 试验室名称
      'qualification', // 资质名称
      'evaluation_date', // 评价日期
      'qualification_date', // 资质到期时间
      "province_name",
      "city_name",
      "address",
      "lab_nature", // 外委实验室的性质
      'qualification_scope', // 资质范围
      'entrusted_projects', // 拟委托实验项目
      'monitor_name', // 监控人
      'maintainer_names',
      'monitoring_status_str', // 监控状态
      'remark', // 备注
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
    ])
    .setTableColumnToDatePicker([
      {value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Button
        // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="计量人员资格申请表"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs>

          <Tabs.TabPane tab="年度审查" key="1">
            {
              selectedRecord && (
                <OutsourcedLedgerAudit authority={authority} currentLedgerRecord={selectedRecord} />
              )
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="相关资质" key="2">
            {
              selectedRecord && (
                <RelevantQualifica authority={authority} currentLedgerRecord={selectedRecord}/>
              )
            }
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>

      {editVisible && (
        <PersonnelApplyFormEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
      
    </>
  );
};

export default connect()(PersonnelApplyFormDetail);
