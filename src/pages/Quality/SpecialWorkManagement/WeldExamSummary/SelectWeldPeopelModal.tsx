import React, { useRef, useState, useEffect } from "react";
import { configColumns } from "./columns";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
// @ts-ignore
import { BasicTableColumns } from "yayang-ui"
import { Modal, Space, Button, Row, Col, message } from "antd";
import { getDefaultFiltersInspector } from "@/utils/utils";

/**
 * 特种设备作业人员的备选页面
 */
const SelectWeldPeopelModal: React.FC<any> = (props: any) => {
  const { onSelect, form, dataSource } = props;
  // 用于控制弹窗的显示状态
  const [bakVisible, setBakVisible] = useState(false);
  // 用于保存表格实例
  const actionRef: any = useRef();
  let selectedRow: any = [];

  // // 用于保存已选择的行数据
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
  //   dataSource?.map((item: any) => item.worker_id) || []
  // );

  // useEffect(() => {
  //   setSelectedRowKeys(dataSource?.map((item: any) => item.worker_id) || []);
  // }, [dataSource]);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "sub_comp_code",
        "employee_number",
        "name",
        "phone",
        "current_unit",
        "employment_type_str",
        "gender", // 性别
        "nation_str", // 民族
        "operation_project_str",
        "education_str",
        "skill_level_str",
        "id_card",
        "address",
        "file_no",
        "health_status",
        "violation_status",
        "work_years",
        'first_date',
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name',
      ]);
    return cols.getNeedColumns();
  };

  // 处理选中状态变化
  const handleSelectionChange = (keys: React.Key[], selectedRows: any[]) => {
    // 回调函数
    const rowsNew = selectedRows.map((item: any) => {
      return {
        ...item,
        worker_id: item.id,
      }
    })
    selectedRow = rowsNew;
   

  };

  return (
    <div>
      <Button
        type='primary'
        onClick={async () => {
          const values = await form.current.validateFields()
          if (values) {
            setBakVisible(true);
          }

        }}
      >
        选择作业人员
      </Button>
      <Modal
        title={(
          <Row justify={"space-between"}>
            <Col>特种设备作业人员</Col>
            <Col>
              <Space>
                <Button type='primary' onClick={async () => {
                  if (onSelect) {
                    onSelect(selectedRow || []);
                  }
                  setBakVisible(false);
                }}>确定</Button>
                <Button onClick={() => { setBakVisible(false) }}>取消</Button>
              </Space>
            </Col>
          </Row>
        )}
        style={{
          maxWidth: '100vw',
          top: 0,
          paddingBottom: 0,
        }}
        bodyStyle={{
          height: 'calc(100vh - 65px)',
          overflowY: 'auto',
        }}
        destroyOnClose
        visible={bakVisible}
        onCancel={() => { setBakVisible(false) }}
        width='100vw'
        closable={false}
        footer={null}
      >
        <BaseCurdSingleTable
          funcCode={'WeiXuanZeDeHanJieRiBao'}
          cRef={actionRef}
          rowKey="id"
          type="workLicenseRegister/getWelderInfo"
          renderSelfHeader={() => <></>}
          tableColumns={getTableColumns()}
          tableSortOrder={{ sort: "id", order: "asc" }}
          tableDefaultFilter={getDefaultFiltersInspector()}
          buttonToolbar={() => []}
          selectedRowsToolbar={() => []}
          rowSelection={{
            type: 'checkbox',
            callback: handleSelectionChange,
            
          }}
        />
      </Modal>
    </div>
  )
}

export default SelectWeldPeopelModal
