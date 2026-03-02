import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import SpecialWorkLedgerEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 焊工人员台账详情
 * @param props
 * @constructor
 */
const WeldPersonLedgerDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "sub_comp_name",
      'employee_number',
      "name",
      "phone",
      "current_unit", // 现单位
      "employment_type_str", // 用工形式
      "gender", // 性别
      "nation_str", // 民族
      "operation_project_str", // 作业项目
      "education_str", // 文化程度
      'skill_level_str', // 职业技能等级 字典 SKILL_LEVEL
      "id_card", // 身份证号
      "address", // 身份证地址
      'first_date', // 首次取得特种设备作业人员取证时间,
      "work_start_date", // 参加工作时间
      "work_years", // 从事本工种年限
      'remark',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
    ])
      .setTableColumnToDatePicker([
        { value: 'work_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [];
  };

  const handleDel = () => {
    dispatch({
      type: "workLicenseRegister/deleteWelderInfo",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="焊工人员台账"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <SpecialWorkLedgerEdit
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
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(WeldPersonLedgerDetail);
