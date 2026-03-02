import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from "antd";
import { BasicTableColumns } from "qcx4-components";
import { configColumns } from "../columns";
import { connect, useIntl } from "umi";
import BaseFormBakData from "@/components/BaseFormBakData";

const FormBakDataModal: React.FC<any> = (props) => {
  const { form, onOk } = props;
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [defaultFields, setDefaultFields] = useState({});
  const [defaultFieldNames, setDefaultFieldNames] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState([]);
  // 监听物料信息的改变 触发重新加载表格
  const getTableColumns = () => {
    const col = new BasicTableColumns(configColumns)
      .initTableColumns([
        "pipe_code",
        "pipe_image_no",
        "pipe_section_code",
        "prod_code",
        "prod_name",
        "total_plan_num",
        "total_split_num",
        "rest_plan_num",
        "cls_name",
        'material',
        "spec",
        "prod_describe",
      ])
      .getNeedColumns();

    col.forEach((item) => {
      if (item?.dataIndex === "total_plan_num")
        Object.assign(item, {
          sorter: false,
          noFilterIcon: true
        })
      if (item?.dataIndex === "total_split_num")
        Object.assign(item, {
          sorter: false,
          noFilterIcon: true
        })
    })

    return col
  };
  // 定义过滤的条件
  const operator = {
    in: [],
    "=": ['dev_code', 'unit_project_code', 'unit_code', 'form_no'],
    ">": [],
    "<": [],
    "><": [],
    noFilters: [],
  };
  /**
   * 展示查询的默认条件
   */
  const showDefaultAlert = () => {
    return (
      <>
        <a>{defaultFieldNames.dev_name}</a>、
        <a>{defaultFieldNames.unit_project_name}</a>、
        <a>{defaultFieldNames.unit_name}</a>
      </>
    )
  }
  return (
    <>
      <Button
        type="primary"
        key={1}
        onClick={async () => {
          const values = await form.current.validateFields();
          setDefaultFields({
            dev_code: values.dev_code.value,
            unit_project_code: values.unit_project_code.value,
            unit_code: values.unit_code.value,
            form_no: values.form_no
          });
          setDefaultFieldNames({
            dev_name: values.dev_code.label,
            unit_project_name: values.unit_project_code.label,
            unit_name: values.unit_code.label,
            form_no: values.form_no
          })
          setVisible(true);
        }}
      >
        {formatMessage({ id: "common.add" })}
      </Button>
      {visible && (
        <Modal
          width="97%"
          title={formatMessage({ id: "material.select.data" })}
          style={{ top: 20 }}
          bodyStyle={{ height: 'calc(100vh - 160px)', overflowY: "hidden" }}
          open={visible}
          onOk={() => {
            onOk(selectedRows);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        >
          <BaseFormBakData
            rowKey="uuid"
            operator={operator}
            tableSortOrder={{ sort: "prod_code", order: "asc" }}
            tableColumns={getTableColumns()}
            type="jiasplitbudget/queryBakData"
            showDefaultAlert={showDefaultAlert}
            onSelectedCallBack={(keys: any, rows: any) => {
              setSelectedRows(rows);
            }}
            // 是否需要筛选层级
            isNeedFilterLevel
            tableDefaultField={defaultFields}
          />
        </Modal>
      )}
    </>
  )
};
export default connect()(FormBakDataModal);
