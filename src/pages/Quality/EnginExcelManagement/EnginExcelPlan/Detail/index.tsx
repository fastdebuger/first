import React, { useState, useMemo } from "react";
import { Button, message, Modal, Table, Tabs } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { getDisplayHierarchy } from "@/utils/utils";

import QualityProjectQualityOverviewEdit from "../Edit";
import { configColumns, resumeColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 创优情况计划详情
 * @param props
 * @constructor
 */
const MonitoringMeasuringDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, callbackSuccess, dispatch } = props;

  // 用于国际化文本的格式化和显示
  const { formatMessage } = useIntl();

  // 解析 设计获奖情况json数据
  const resumeDataAward = useMemo(() => {
    if (selectedRecord?.design_award) {
      return JSON.parse(selectedRecord.design_award);
    }
    return [];
  }, [selectedRecord]);

  // 解析 科技进步获奖情况json数据
  const resumeDataTechAward = useMemo(() => {
    if (selectedRecord?.tech_progress_award) {
      return JSON.parse(selectedRecord.tech_progress_award);
    }
    return [];
  }, [selectedRecord]);

  // 解析 其他获奖情况json数据
  const resumeDataOtherAward = useMemo(() => {
    if (selectedRecord?.other_award) {
      return JSON.parse(selectedRecord.other_award);
    }
    return [];
  }, [selectedRecord]);
  
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      'dev_code',
      "merit_types_str",
      "application_date",
      "charge_person",
      'charge_person_phone',
      "contact_person",
      'contact_person_phone',
      "application_unit",
      "start_date",
      "end_date",
      "contract_amount",
      "budget_amount",
      "final_account_amount",
      "construction_unit",
      "survey_unit",
      "design_unit",
      "construction_contractor",
      "supervision_unit",
      // "design_award",
      // "tech_progress_award",
      // "other_award",
      "construction_unit_opinion_str",
      "quality_accident_proof_str",
      "no_wage_arrears_proof_str",
      "embassy_proof_str",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',

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
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  /**
   * 渲染按钮工具栏
   * @returns
   */
  const renderButtonToolbar = () => {
    return [];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="dev_code"
        title={'创优情况计划详情'}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs >
          <Tabs.TabPane tab="设计获奖情况" key="1">
            {resumeDataAward.length > 0 && (
              <Table
                columns={resumeColumns}
                dataSource={resumeDataAward || []}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={false}
                size="small"
                bordered
              />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="科技进步获奖情况" key="2">
            {resumeDataTechAward.length > 0 && (
              <Table
                columns={resumeColumns}
                dataSource={resumeDataTechAward || []}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={false}
                size="small"
                bordered
              />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="其他获奖情况" key="3">
            {resumeDataOtherAward.length > 0 && (
              <Table
                columns={resumeColumns}
                dataSource={resumeDataOtherAward || []}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={false}
                size="small"
                bordered
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>

    </>
  );
};

export default connect()(MonitoringMeasuringDetail);
